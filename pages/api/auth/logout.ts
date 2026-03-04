// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { buildClearCookie } from '../../../lib/apiAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    res.setHeader('Set-Cookie', buildClearCookie());
    return res.status(200).json({ message: 'Logged out successfully' });
}
