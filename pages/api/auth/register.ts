// pages/api/auth/register.ts
// Public affiliate self-registration (no auth required).
// Creates an affiliate with status = 'Pending' awaiting admin approval.
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { AffiliateModel } from '../../../lib/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, email, phone, pan, bank, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if ((password as string).length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        await connectDB();

        const existing = await AffiliateModel.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'An affiliate account with this email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const id = `aff_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;

        const aff = await AffiliateModel.create({
            _id: id,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ?? '',
            pan: pan ?? '',
            bank: bank ?? '',
            passwordHash,
            status: 'Pending',
            walletBalance: 0,
            leads: [],
            payouts: [],
        });

        const { passwordHash: _ph, ...safe } = aff.toObject();
        return res.status(201).json({
            message: 'Registration successful! Your account is pending approval.',
            affiliate: safe,
        });
    } catch (err: any) {
        console.error('[register] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
