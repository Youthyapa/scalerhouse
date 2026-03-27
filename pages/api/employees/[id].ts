import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { EmployeeModel, RoleModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' });

    try {
        // Only admin can modify/delete employees
        if (user.role !== 'admin') return res.status(403).json({ error: 'Access Denied: Admin only' });

        await connectDB();

        if (req.method === 'PATCH') {
            const { name, phone, role, department, status } = req.body;

            const existing = await EmployeeModel.findById(id).lean().exec();
            if (!existing) return res.status(404).json({ error: 'Employee not found' });

            // Prevent modifying the super admin's role
            if ((existing as any).email === 'admin@scalerhouse.com' && role && role !== (existing as any).role) {
                return res.status(403).json({ error: 'Cannot change the primary Admin role' });
            }

            const updateData: Record<string, any> = {};
            if (name) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (role) updateData.role = role;
            if (department !== undefined) updateData.department = department;
            if (status) updateData.status = status;

            const updated = await EmployeeModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean().exec();
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            const existing = await EmployeeModel.findById(id).lean().exec();
            if (!existing) return res.status(404).json({ error: 'Employee not found' });

            if ((existing as any).email === 'admin@scalerhouse.com') {
                return res.status(403).json({ error: 'Primary Admin cannot be deleted' });
            }

            await EmployeeModel.findByIdAndDelete(id).exec();
            return res.status(200).json({ success: true, message: 'Employee deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error(`[employees:${id}] error:`, err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Only admin can create/modify/delete employees
export default withApiAuth(handler, ['admin']);
