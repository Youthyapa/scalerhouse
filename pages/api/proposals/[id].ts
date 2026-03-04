// pages/api/proposals/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { ProposalModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
        const proposal = await ProposalModel.findById(id).lean();
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        return res.status(200).json(proposal);
    }

    if (req.method === 'PUT') {
        const { _id, ...updates } = req.body;
        const proposal = await ProposalModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
        return res.status(200).json(proposal);
    }

    if (req.method === 'DELETE') {
        await ProposalModel.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Proposal deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

export default withApiAuth(handler, ['admin', 'employee']);
