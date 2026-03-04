// pages/api/careers/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { CareerModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
        const career = await CareerModel.findById(id).lean();
        if (!career) return res.status(404).json({ error: 'Career not found' });
        return res.status(200).json(career);
    }

    if (req.method === 'PUT') {
        const { _id, ...updates } = req.body;
        const career = await CareerModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (!career) return res.status(404).json({ error: 'Career not found' });
        return res.status(200).json(career);
    }

    if (req.method === 'DELETE') {
        await CareerModel.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Career deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

export default withApiAuth(handler, ['admin']);
