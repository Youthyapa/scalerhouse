// pages/api/tickets/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { TicketModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            // Clients and affiliates only see their own tickets (scope by entityId)
            if (user.role === 'client' || user.role === 'affiliate') {
                const tickets = await TicketModel.find({ raisedById: user.entityId })
                    .sort({ createdAt: -1 })
                    .lean();
                return res.status(200).json(tickets);
            }
            const tickets = await TicketModel.find({}).sort({ createdAt: -1 }).lean();
            return res.status(200).json(tickets);
        }

        if (req.method === 'POST') {
            const { id, ...data } = req.body;
            if (!data.subject) return res.status(400).json({ error: 'Subject is required' });
            const _id = id || `ticket_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            // Stamp who raised it
            const ticket = await TicketModel.create({
                _id,
                raisedById: user.entityId,
                ...data,
            });
            return res.status(201).json(ticket);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[tickets:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler);
