// pages/api/tickets/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { TicketModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        // Clients and affiliates can only access their own tickets
        if (user.role === 'client' || user.role === 'affiliate') {
            const ticket = await TicketModel.findById(id).lean() as any;
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
            if (ticket.raisedById !== user.entityId) {
                return res.status(403).json({ error: 'Forbidden' });
            }
        }

        if (req.method === 'GET') {
            const ticket = await TicketModel.findById(id).lean();
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
            return res.status(200).json(ticket);
        }

        if (req.method === 'PUT') {
            const { _id, ...updates } = req.body;
            updates.updatedAt = new Date().toISOString();
            const ticket = await TicketModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
            return res.status(200).json(ticket);
        }

        if (req.method === 'DELETE') {
            await TicketModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Ticket deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[tickets:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler);
