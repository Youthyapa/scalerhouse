// pages/api/affiliates/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { AffiliateModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            if (user.role === 'affiliate') {
                const aff = await AffiliateModel.findById(user.entityId).select('-passwordHash').lean();
                return res.status(200).json(aff ? [aff] : []);
            }
            const affiliates = await AffiliateModel.find({}).select('-passwordHash').lean();
            return res.status(200).json(affiliates);
        }

        if (req.method === 'POST') {
            const { id, password, ...data } = req.body;
            if (!data.email) return res.status(400).json({ error: 'Email is required' });
            const _id = id || `aff_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const passwordHash = password
                ? await bcrypt.hash(password, 12)
                : await bcrypt.hash('affiliate123', 12);
            const aff = await AffiliateModel.create({ _id, passwordHash, ...data });
            const { passwordHash: _ph, ...safe } = aff.toObject();
            return res.status(201).json(safe);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[affiliates:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee', 'affiliate']);
