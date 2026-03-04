// pages/api/clients/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { ClientModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        // Clients can only access their own record
        if (user.role === 'client' && user.entityId !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (req.method === 'GET') {
            const client = await ClientModel.findById(id).select('-passwordHash').lean();
            if (!client) return res.status(404).json({ error: 'Client not found' });
            return res.status(200).json(client);
        }

        if (req.method === 'PUT') {
            const { _id, passwordHash: _ph, ...updates } = req.body;
            const client = await ClientModel.findByIdAndUpdate(id, updates, { new: true })
                .select('-passwordHash')
                .lean();
            if (!client) return res.status(404).json({ error: 'Client not found' });
            return res.status(200).json(client);
        }

        if (req.method === 'DELETE') {
            await ClientModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Client deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[clients:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee', 'client']);
