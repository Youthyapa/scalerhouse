// pages/api/onboarding/validate-token.ts
// GET: Validate a one-time onboarding token (public, no auth)

import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { OnboardingTokenModel } from '../../../lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    await connectDB();

    const { token } = req.query as { token: string };
    if (!token) return res.status(400).json({ valid: false, error: 'Token is required.' });

    const tokenDoc = await OnboardingTokenModel.findOne({ token }).lean() as any;

    if (!tokenDoc) {
        return res.status(200).json({ valid: false, error: 'This link is invalid or does not exist.' });
    }

    if (tokenDoc.used) {
        return res.status(200).json({ valid: false, error: 'This link has already been used. Your documents have been submitted.' });
    }

    if (new Date() > new Date(tokenDoc.expiresAt)) {
        return res.status(200).json({ valid: false, error: 'This link has expired (valid for 7 days). Please contact hr@scalerhouse.com.' });
    }

    return res.status(200).json({
        valid: true,
        name: tokenDoc.name,
        jobTitle: tokenDoc.jobTitle,
        email: tokenDoc.email,
        expiresAt: tokenDoc.expiresAt,
    });
}
