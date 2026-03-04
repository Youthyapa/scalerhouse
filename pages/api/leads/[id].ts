// pages/api/leads/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { LeadModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        if (req.method === 'GET') {
            const lead = await LeadModel.findById(id).lean();
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            return res.status(200).json(lead);
        }

        if (req.method === 'PUT') {
            const { _id, ...updates } = req.body;
            updates.updatedAt = new Date().toISOString();
            const lead = await LeadModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!lead) return res.status(404).json({ error: 'Lead not found' });
            return res.status(200).json(lead);
        }

        if (req.method === 'DELETE') {
            await LeadModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Lead deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[leads:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee']);
