// pages/api/patch-admin-name.ts
// One-time migration: Update admin user name to Shashank Singh
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../lib/db';
import { EmployeeModel } from '../../lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Simple security: only allow GET requests with a secret token
    if (req.query.token !== 'sh_patch_2026') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        await connectDB();
        const result = await EmployeeModel.findOneAndUpdate(
            { email: 'admin@scalerhouse.com' },
            { name: 'Shashank Singh' },
            { new: true }
        ).select('name email role');

        if (!result) return res.status(404).json({ error: 'Admin user not found' });
        return res.status(200).json({ success: true, updated: result });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
}
