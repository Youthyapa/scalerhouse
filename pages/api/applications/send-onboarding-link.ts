// pages/api/applications/send-onboarding-link.ts
// POST: Generate a secure one-time token and email the candidate a document submission link
// Admin only

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ApplicationModel, OnboardingTokenModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import { sendMail } from '../../../lib/mailer';
import { onboardingLinkEmail } from '../../../lib/emailTemplates/onboardingLink';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    await connectDB();

    const protectedHandler = withApiAuth(async (req, res) => {
        const { applicationId } = req.body;
        if (!applicationId) return res.status(400).json({ error: 'applicationId is required' });

        const application = await (ApplicationModel as any).findById(applicationId).lean();
        if (!application) return res.status(404).json({ error: 'Application not found' });

        // Generate a unique token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Save token to DB
        await OnboardingTokenModel.create({
            token,
            applicationId: applicationId,
            email: application.email,
            name: application.name,
            jobTitle: application.jobTitle,
            expiresAt,
        });

        // Build the URL
        const getAppUrl = () => {
            if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
            if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
            if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
            return 'http://localhost:3000';
        };
        const appUrl = getAppUrl();
        const onboardingUrl = `${appUrl}/onboarding/${token}`;

        // Send email to candidate
        await sendMail({
            to: application.email,
            subject: `📋 Action Required: Submit Your Documents – ScalerHouse`,
            html: onboardingLinkEmail({
                name: application.name,
                jobTitle: application.jobTitle,
                onboardingUrl,
            }),
        });

        return res.status(200).json({
            success: true,
            message: `Document submission link sent to ${application.email}`,
            onboardingUrl,
            expiresAt,
        });
    }, ['admin']);

    return protectedHandler(req, res);
}
