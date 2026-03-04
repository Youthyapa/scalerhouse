// pages/api/employees/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { EmployeeModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        if (req.method === 'GET') {
            const emp = await EmployeeModel.findById(id).select('-passwordHash').lean();
            if (!emp) return res.status(404).json({ error: 'Employee not found' });
            return res.status(200).json(emp);
        }

        if (req.method === 'PUT') {
            const { _id, password, passwordHash: _ph, ...updates } = req.body;
            if (password) {
                (updates as any).passwordHash = await bcrypt.hash(password, 12);
            }
            const emp = await EmployeeModel.findByIdAndUpdate(id, updates, { new: true })
                .select('-passwordHash')
                .lean();
            if (!emp) return res.status(404).json({ error: 'Employee not found' });
            return res.status(200).json(emp);
        }

        if (req.method === 'DELETE') {
            await EmployeeModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Employee deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[employees:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin']);
