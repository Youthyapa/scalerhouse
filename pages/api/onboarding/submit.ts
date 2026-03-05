// pages/api/onboarding/submit.ts
// POST: Public route — candidate submits their onboarding documents using a one-time token
// No authentication required; validates token from DB

import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import { connectDB } from '../../../lib/db';
import { OnboardingTokenModel, OnboardingModel, ApplicationModel } from '../../../lib/models';
import { sendMail } from '../../../lib/mailer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDoc(file: formidable.File, folder: string, label: string): Promise<string> {
    const result = await cloudinary.uploader.upload(file.filepath, {
        folder: `scalerhouse/onboarding/${folder}`,
        resource_type: 'raw',
        use_filename: false,
        public_id: `${label}_${Date.now()}`,
    });
    if (fs.existsSync(file.filepath)) fs.unlinkSync(file.filepath);
    return result.secure_url;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    await connectDB();

    const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
        if (err) return res.status(400).json({ error: 'File upload error. Max 10MB per file.' });

        try {
            const get = (f: string) => {
                const v = fields[f];
                return Array.isArray(v) ? v[0] : v || '';
            };

            const token = get('token');
            if (!token) return res.status(400).json({ error: 'Token is required' });

            // Validate token
            const tokenDoc = await OnboardingTokenModel.findOne({ token }).lean() as any;
            if (!tokenDoc) return res.status(404).json({ error: 'Invalid or expired link.' });
            if (tokenDoc.used) return res.status(400).json({ error: 'This link has already been used.' });
            if (new Date() > new Date(tokenDoc.expiresAt)) return res.status(400).json({ error: 'This link has expired. Please contact hr@scalerhouse.com.' });

            const { applicationId, email, name, jobTitle } = tokenDoc;

            // Upload documents to Cloudinary
            const docUploads: Record<string, string> = {};
            const docFields = ['aadhaar', 'panCard', 'degree', 'experienceLetter', 'passportPhoto'] as const;
            for (const field of docFields) {
                const file = Array.isArray(files[field]) ? (files[field] as any[])[0] : files[field] as formidable.File | undefined;
                if (file && file.filepath) {
                    docUploads[`${field}Url`] = await uploadDoc(file, field, `${field}_${applicationId}`);
                }
            }

            // Save onboarding data
            const onboardingData = {
                applicationId,
                email,
                name,
                jobTitle,
                // Step 1: Personal
                dob: get('dob'),
                gender: get('gender'),
                permanentAddress: get('permanentAddress'),
                currentAddress: get('currentAddress'),
                // Step 2: Bank
                bankAccountNumber: get('bankAccountNumber'),
                ifscCode: get('ifscCode'),
                bankName: get('bankName'),
                panNumber: get('panNumber'),
                // Step 3: Emergency Contact
                emergencyContactName: get('emergencyContactName'),
                emergencyContactRelation: get('emergencyContactRelation'),
                emergencyContactPhone: get('emergencyContactPhone'),
                // Step 4: Documents
                ...docUploads,
                // Step 5: Declaration
                declarationAccepted: get('declarationAccepted') === 'true',
                isComplete: true,
                completedSteps: [1, 2, 3, 4, 5],
                submittedAt: new Date(),
                updatedAt: new Date(),
            };

            // Delete any previous (incomplete) record for this application, then create fresh
            // Using delete+create pattern to avoid Mongoose model-cache issues with upsert filters
            await OnboardingModel.deleteMany({ employeeId: applicationId }).catch(() => { });
            await OnboardingModel.create({
                ...onboardingData,
                employeeId: applicationId,  // satisfies required field; replaced when hired
            });

            // Mark docsSubmitted on application
            await (ApplicationModel as any).findByIdAndUpdate(applicationId, {
                docsSubmitted: true,
                updatedAt: new Date(),
            });

            // Mark token as used
            await OnboardingTokenModel.findOneAndUpdate({ token }, { used: true });

            // Send confirmation email to candidate
            sendMail({
                to: email,
                subject: `✅ Documents Received – ScalerHouse`,
                html: docsConfirmationEmail({ name, jobTitle }),
            }).catch((e) => console.error('Doc confirmation email failed:', e));

            return res.status(200).json({ success: true, message: 'Documents submitted successfully!' });
        } catch (e: any) {
            console.error('Onboarding submit error:', e);
            return res.status(500).json({ error: 'Failed to submit documents. Please try again.' });
        }
    });
}

function docsConfirmationEmail({ name, jobTitle }: { name: string; jobTitle: string }): string {
    const firstName = name.split(' ')[0];
    return `
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Documents Received – ScalerHouse</title></head>
<body style="margin:0;padding:0;background:#050d1a;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#050d1a;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1628;border-radius:20px;overflow:hidden;border:1px solid rgba(99,179,237,0.15);">
<tr><td style="background:linear-gradient(135deg,#052e16,#064e3b,#065f46);padding:48px 40px;text-align:center;">
<div style="font-size:28px;font-weight:900;color:#fff;">SCALER<span style="color:#10b981;">HOUSE</span></div>
<div style="font-size:40px;margin:20px 0;">✅</div>
<h1 style="color:#fff;font-size:22px;margin:0;">Documents Received!</h1>
</td></tr>
<tr><td style="padding:40px;">
<h2 style="color:#fff;margin:0 0 16px;">Thank you, ${firstName}!</h2>
<p style="color:#94a3b8;font-size:15px;line-height:1.8;margin:0 0 24px;">
We have successfully received your onboarding documents for the <strong style="color:#e2e8f0;">${jobTitle}</strong> position. Our HR team will review them and be in touch shortly with next steps, including your official offer letter and joining details.
</p>
<div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px 24px;">
<p style="color:#10b981;font-size:14px;font-weight:700;margin:0 0 8px;">What happens next?</p>
<p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0;">
Our HR team will verify your documents (usually within 1–2 business days).<br/>
You will then receive your official offer letter and employee portal login credentials.
</p>
</div>
<p style="color:#64748b;font-size:14px;margin:24px 0 0;">Questions? <a href="mailto:hr@scalerhouse.com" style="color:#10b981;text-decoration:none;">hr@scalerhouse.com</a></p>
</td></tr>
<tr><td style="background:#070f1e;padding:20px 40px;text-align:center;border-top:1px solid rgba(99,179,237,0.1);">
<p style="color:#334155;font-size:12px;margin:0;">© 2026 ScalerHouse. All rights reserved.</p>
</td></tr>
</table></td></tr></table></body></html>`.trim();
}
