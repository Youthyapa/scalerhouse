// pages/api/careers/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { CareerModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'GET') {
        const query = req.query.all === 'true' ? {} : { isActive: true };
        const careers = await CareerModel.find(query).sort({ postedAt: -1 }).lean();
        return res.status(200).json(careers);
    }

    const protectedHandler = withApiAuth(async (req, res) => {
        if (req.method === 'POST') {
            const { id, ...data } = req.body;
            const career = await CareerModel.create({ _id: id, ...data });
            return res.status(201).json(career);
        }
        return res.status(405).json({ error: 'Method not allowed' });
    }, ['admin']);

    return protectedHandler(req, res);
}
