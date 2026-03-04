// pages/api/leads/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { LeadModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            // Employees only see their assigned leads (unless admin)
            const query = user.role === 'employee'
                ? { assignedTo: user.entityId }
                : {};
            const leads = await LeadModel.find(query).sort({ createdAt: -1 }).lean();
            return res.status(200).json(leads);
        }

        if (req.method === 'POST') {
            const { id, ...data } = req.body;
            if (!data.name || !data.email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const _id = id || `lead_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const lead = await LeadModel.create({ _id, ...data });
            return res.status(201).json(lead);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[leads:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee']);
