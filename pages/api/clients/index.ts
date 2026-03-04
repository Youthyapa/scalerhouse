// pages/api/clients/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ClientModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            if (user.role === 'client') {
                const client = await ClientModel.findById(user.entityId).select('-passwordHash').lean();
                return res.status(200).json(client ? [client] : []);
            }
            const clients = await ClientModel.find({}).select('-passwordHash').sort({ createdAt: -1 }).lean();
            return res.status(200).json(clients);
        }

        if (req.method === 'POST') {
            const { id, ...data } = req.body;
            if (!data.email) return res.status(400).json({ error: 'Email is required' });
            const _id = id || `client_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const client = await ClientModel.create({ _id, ...data });
            const { passwordHash: _ph, ...safe } = client.toObject();
            return res.status(201).json(safe);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[clients:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee', 'client']);
