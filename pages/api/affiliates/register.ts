// pages/api/affiliates/register.ts
// Public endpoint for new affiliate registration (no auth required)
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { AffiliateModel } from '../../../lib/models';
import bcrypt from 'bcryptjs';

function genId() {
    return 'aff_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    await connectDB();

    const { name, email, phone, pan, bank, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await AffiliateModel.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const aff = await AffiliateModel.create({
        _id: genId(),
        name,
        email: email.toLowerCase(),
        phone,
        pan,
        bank,
        passwordHash,
        status: 'Pending',
        walletBalance: 0,
        leads: [],
        payouts: [],
        createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: 'Registration successful. Pending admin approval.' });
}
