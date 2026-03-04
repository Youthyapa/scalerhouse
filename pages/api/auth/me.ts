// pages/api/auth/me.ts
// Returns the currently logged-in user's info from their JWT token
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../lib/apiAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const user = verifyToken(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        const { userId, ...safeUser } = user;
        return res.status(200).json(safeUser);
    } catch (err: any) {
        console.error('[me] error:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
