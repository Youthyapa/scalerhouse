// pages/api/offers/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { OfferModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
        const offer = await OfferModel.findById(id).lean();
        if (!offer) return res.status(404).json({ error: 'Offer not found' });
        return res.status(200).json(offer);
    }

    if (req.method === 'PUT') {
        const { _id, ...updates } = req.body;
        const offer = await OfferModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (!offer) return res.status(404).json({ error: 'Offer not found' });
        return res.status(200).json(offer);
    }

    if (req.method === 'DELETE') {
        await OfferModel.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Offer deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

export default withApiAuth(handler, ['admin']);
