// pages/api/applications/index.ts
// POST: Submit job application with resume upload
// GET: Admin – fetch all applications with filters

import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import { connectDB } from '../../../lib/db';
import { ApplicationModel, CareerModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { applicationConfirmationEmail } from '../../../lib/emailTemplates/applicationConfirmation';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Disable Next.js default body parser (formidable handles multipart)
export const config = { api: { bodyParser: false } };

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    // ── GET ─────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
        const protectedGet = withApiAuth(async (req, res) => {
            const { careerId, status, search, page = '1', limit = '50' } = req.query as Record<string, string>;
            const filter: any = {};
            if (careerId) filter.careerId = careerId;
            if (status) filter.status = status;
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }

            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;

            const [applications, total] = await Promise.all([
                ApplicationModel.find(filter).sort({ appliedAt: -1 }).skip(skip).limit(limitNum).lean(),
                ApplicationModel.countDocuments(filter),
            ]);
            return res.status(200).json({ applications, total, page: pageNum, limit: limitNum });
        }, ['admin']);
        return protectedGet(req, res);
    }

    // ── POST (Public – anyone can apply) ───────────────────────────────────
    if (req.method === 'POST') {
        const form = formidable({ maxFileSize: 5 * 1024 * 1024 }); // 5MB limit

        form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
            if (err) {
                return res.status(400).json({ error: 'File upload failed. Max size is 5MB.' });
            }

            try {
                const get = (f: string) => {
                    const v = fields[f];
                    return Array.isArray(v) ? v[0] : v || '';
                };

                const careerId = get('careerId');
                const name = get('name');
                const email = get('email');

                if (!careerId || !name || !email) {
                    return res.status(400).json({ error: 'careerId, name and email are required.' });
                }

                // Fetch job title from DB
                const career = await (CareerModel as any).findById(careerId).lean();
                if (!career) {
                    return res.status(404).json({ error: 'Job posting not found.' });
                }

                // Upload resume to Cloudinary if provided
                let resumeUrl = '';
                let resumeFileName = '';
                let resumePublicId = '';

                const resumeFile = Array.isArray(files.resume) ? files.resume[0] : files.resume;
                if (resumeFile && resumeFile.filepath) {
                    const uploadResult = await cloudinary.uploader.upload(resumeFile.filepath, {
                        folder: 'scalerhouse/resumes',
                        resource_type: 'raw',
                        public_id: `resume_${Date.now()}_${name.replace(/\s+/g, '_')}`,
                        use_filename: true,
                    });
                    resumeUrl = uploadResult.secure_url;
                    resumeFileName = resumeFile.originalFilename || 'resume';
                    resumePublicId = uploadResult.public_id;
                    fs.unlinkSync(resumeFile.filepath); // clean up temp file
                }

                // Save application
                const application = await ApplicationModel.create({
                    careerId,
                    jobTitle: career.title,
                    name: get('name'),
                    email: get('email'),
                    phone: get('phone'),
                    linkedIn: get('linkedIn'),
                    portfolio: get('portfolio'),
                    expectedCTC: get('expectedCTC'),
                    coverLetter: get('coverLetter'),
                    resumeUrl,
                    resumeFileName,
                    resumePublicId,
                    status: 'New',
                });

                // Send branded confirmation email (non-blocking)
                try {
                    await sendMail({
                        to: email,
                        subject: `✅ Application Received – ${career.title} | ScalerHouse`,
                        html: applicationConfirmationEmail({
                            name: get('name'),
                            jobTitle: career.title,
                            department: career.department,
                        }),
                    });
                } catch (e) {
                    console.error('Email send failed:', e);
                }

                return res.status(201).json({ success: true, applicationId: application._id });
            } catch (e: any) {
                console.error('Application submission error:', e);
                return res.status(500).json({ error: 'Failed to submit application. Please try again.' });
            }
        });
        return; // formidable is async, return early
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
