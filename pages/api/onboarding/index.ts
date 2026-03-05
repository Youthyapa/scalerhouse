// pages/api/onboarding/index.ts
// GET: fetch onboarding data for logged-in employee
// POST/PATCH: save/update onboarding data

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { OnboardingModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import formidable, { Fields, Files } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const config = { api: { bodyParser: false } };

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDoc(file: formidable.File, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(file.filepath, {
        folder: `scalerhouse/onboarding/${folder}`,
        resource_type: 'raw',
        public_id: `${folder}_${Date.now()}`,
    });
    fs.unlinkSync(file.filepath);
    return result.secure_url;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    const protectedHandler = withApiAuth(async (req, res, user: any) => {
        const employeeId = user.id;
        const email = user.email;

        if (req.method === 'GET') {
            const data = await OnboardingModel.findOne({ employeeId }).lean();
            return res.status(200).json(data || { employeeId, completedSteps: [], isComplete: false });
        }

        if (req.method === 'POST' || req.method === 'PATCH') {
            const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
            form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
                if (err) return res.status(400).json({ error: 'Upload error' });

                try {
                    const get = (f: string) => {
                        const v = fields[f];
                        return Array.isArray(v) ? v[0] : v || '';
                    };

                    const step = parseInt(get('step') || '1', 10);
                    const update: Record<string, any> = { updatedAt: new Date() };

                    if (step === 1) {
                        update.dob = get('dob');
                        update.gender = get('gender');
                        update.permanentAddress = get('permanentAddress');
                        update.currentAddress = get('currentAddress');
                    } else if (step === 2) {
                        update.bankAccountNumber = get('bankAccountNumber');
                        update.ifscCode = get('ifscCode');
                        update.bankName = get('bankName');
                        update.panNumber = get('panNumber');
                    } else if (step === 3) {
                        update.emergencyContactName = get('emergencyContactName');
                        update.emergencyContactRelation = get('emergencyContactRelation');
                        update.emergencyContactPhone = get('emergencyContactPhone');
                    } else if (step === 4) {
                        // Upload documents
                        const docFields = ['aadhaar', 'panCard', 'degree', 'experienceLetter', 'passportPhoto'];
                        for (const field of docFields) {
                            const file = Array.isArray(files[field]) ? files[field][0] : files[field];
                            if (file && file.filepath) {
                                update[`${field}Url`] = await uploadDoc(file, field);
                            }
                        }
                    } else if (step === 5) {
                        update.declarationAccepted = get('declarationAccepted') === 'true';
                        update.isComplete = true;
                        update.submittedAt = new Date();
                    }

                    // Track completed steps
                    const existing = await OnboardingModel.findOne({ employeeId }).lean() as any;
                    const completedSteps = existing?.completedSteps || [];
                    if (!completedSteps.includes(step)) completedSteps.push(step);
                    update.completedSteps = completedSteps;

                    const doc = await OnboardingModel.findOneAndUpdate(
                        { employeeId },
                        { $set: { ...update, employeeId, email } },
                        { new: true, upsert: true }
                    ).lean();

                    return res.status(200).json(doc);
                } catch (e: any) {
                    console.error('Onboarding save error:', e);
                    return res.status(500).json({ error: 'Failed to save onboarding data' });
                }
            });
            return;
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }, ['employee', 'admin']);

    return protectedHandler(req, res);
}
