// pages/api/contact.ts
// Public endpoint — saves contact form submissions to MongoDB with rate limiting
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../lib/db';
import { ContactModel } from '../../lib/models';
import { checkRateLimit, CONTACT_RATE_LIMIT } from '../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Rate limiting — max 5 submissions per IP per 10 minutes
    if (!checkRateLimit(req, res, 'contact', CONTACT_RATE_LIMIT)) return;

    const { name, email, phone, company, service, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if ((message as string).length > 2000) {
        return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
    }

    try {
        await connectDB();
        await ContactModel.create({ name, email, phone, company, service, message });
        return res.status(200).json({ message: 'Message received! We will get back to you shortly.' });
    } catch (err: any) {
        console.error('[contact] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
