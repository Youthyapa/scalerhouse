// pages/api/offers/index.ts
// Public GET for active offers shown on the website; admin-only POST
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { OfferModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            const query = req.query.all === 'true' ? {} : { isActive: true };
            const offers = await OfferModel.find(query).lean();
            return res.status(200).json(offers);
        }

        const protectedHandler = withApiAuth(async (req, res, user) => {
            if (req.method === 'POST') {
                const { id, ...data } = req.body;
                if (!data.title) return res.status(400).json({ error: 'Title is required' });
                const _id = id || `offer_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
                const offer = await OfferModel.create({ _id, ...data });
                return res.status(201).json(offer);
            }
            return res.status(405).json({ error: 'Method not allowed' });
        }, ['admin']);

        return protectedHandler(req, res);
    } catch (err: any) {
        console.error('[offers:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
