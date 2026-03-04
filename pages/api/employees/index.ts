// pages/api/employees/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/db';
import { EmployeeModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            const employees = await EmployeeModel.find({}).select('-passwordHash').lean();
            return res.status(200).json(employees);
        }

        if (req.method === 'POST') {
            const { id, password, ...data } = req.body;
            if (!data.name || !data.email) {
                return res.status(400).json({ error: 'Name and email are required' });
            }
            const _id = id || `emp_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const passwordHash = password
                ? await bcrypt.hash(password, 12)
                : await bcrypt.hash('scaler123', 12);
            const employee = await EmployeeModel.create({ _id, passwordHash, ...data });
            const obj = employee.toObject();
            const { passwordHash: _ph, ...safe } = obj;
            return res.status(201).json(safe);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[employees:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin']);
