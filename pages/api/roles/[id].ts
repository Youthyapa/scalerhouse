import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { RoleModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' });

    try {
        // Only admin can manage roles
        if (user.role !== 'admin') return res.status(403).json({ error: 'Access Denied: Admin only' });

        await connectDB();

        if (req.method === 'PATCH') {
            const { name, description, permissions } = req.body;

            // @ts-ignore: Mongoose typing issue with custom string _id
            const existing = await (RoleModel as any).findOne({ _id: id }).lean().exec();
            if (!existing) return res.status(404).json({ error: 'Role not found' });

            // Prevent renaming the protected Admin role
            if ((existing as any).isProtected && (existing as any).name === 'Admin' && name && name !== 'Admin') {
                return res.status(403).json({ error: 'Cannot rename the primary Admin role' });
            }

            const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
            if (name) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (permissions) updateData.permissions = permissions;

            // @ts-ignore: Mongoose typing issue with custom string _id
            const updated = await (RoleModel as any).findOneAndUpdate({ _id: id }, { $set: updateData }, { new: true }).lean().exec();
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            // @ts-ignore: Mongoose typing issue with custom string _id
            const existing = await (RoleModel as any).findOne({ _id: id }).lean().exec();
            if (!existing) return res.status(404).json({ error: 'Role not found' });

            if ((existing as any).isProtected) {
                return res.status(403).json({ error: 'Protected roles cannot be deleted' });
            }

            // @ts-ignore: Mongoose typing issue with custom string _id
            await (RoleModel as any).findOneAndDelete({ _id: id }).exec();
            return res.status(200).json({ success: true, message: 'Role deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error(`[roles:${id}] error:`, err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Only admin can edit / delete roles
export default withApiAuth(handler, ['admin']);
