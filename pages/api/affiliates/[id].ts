// pages/api/affiliates/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { AffiliateModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        // Affiliates can only access their own record
        if (user.role === 'affiliate' && user.entityId !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (req.method === 'GET') {
            const aff = await AffiliateModel.findById(id).select('-passwordHash').lean();
            if (!aff) return res.status(404).json({ error: 'Affiliate not found' });
            return res.status(200).json(aff);
        }

        if (req.method === 'PUT' || req.method === 'PATCH') {
            const { _id, passwordHash: _ph, ...updates } = req.body;
            const aff = await AffiliateModel.findByIdAndUpdate(id, updates, { new: true })
                .select('-passwordHash')
                .lean();
            if (!aff) return res.status(404).json({ error: 'Affiliate not found' });
            return res.status(200).json(aff);
        }

        if (req.method === 'DELETE') {
            await AffiliateModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Affiliate deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[affiliates:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee', 'affiliate']);
