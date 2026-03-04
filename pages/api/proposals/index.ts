// pages/api/proposals/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ProposalModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            const proposals = await ProposalModel.find({}).sort({ createdAt: -1 }).lean();
            return res.status(200).json(proposals);
        }

        if (req.method === 'POST') {
            const { id, ...data } = req.body;
            if (!data.leadId || !data.clientName) {
                return res.status(400).json({ error: 'leadId and clientName are required' });
            }
            const _id = id || `prop_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const proposal = await ProposalModel.create({ _id, ...data });
            return res.status(201).json(proposal);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[proposals:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee']);
