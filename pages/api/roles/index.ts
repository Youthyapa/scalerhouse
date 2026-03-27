import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { RoleModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        // Only admin can manage roles
        const canManageRoles = user.role === 'admin';
        if (!canManageRoles) return res.status(403).json({ error: 'Access Denied: Admin only' });

        await connectDB();

        if (req.method === 'GET') {
            const roles = await RoleModel.find().lean().exec();
            return res.status(200).json(roles);
        }

        if (req.method === 'POST') {
            const { name, description, permissions } = req.body;
            if (!name) return res.status(400).json({ error: 'Role name is required' });

            // Check if name already exists
            const existing = await RoleModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } }).lean().exec();
            if (existing) return res.status(400).json({ error: 'Role name already exists' });

            const _id = `role_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const newRole = await RoleModel.create({
                _id,
                name,
                description: description || '',
                isProtected: false,
                permissions: permissions || [],
            });

            return res.status(201).json(newRole);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[roles:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Only admin can create / list roles
export default withApiAuth(handler, ['admin']);
