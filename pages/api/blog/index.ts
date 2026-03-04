// pages/api/blog/index.ts
// Public GET (for blog page) + Protected POST (admin/employee only)
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { BlogPostModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();

        if (req.method === 'GET') {
            // Public: show only published posts; admin can see all via ?all=true
            const query = req.query.all === 'true' ? {} : { status: 'Published' };
            const posts = await BlogPostModel.find(query).sort({ publishedAt: -1 }).lean();
            return res.status(200).json(posts);
        }

        // Protected: POST to create
        const protectedHandler = withApiAuth(async (req, res, user) => {
            const { id, ...data } = req.body;
            if (!data.title) return res.status(400).json({ error: 'Title is required' });
            const _id = id || `blog_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
            const post = await BlogPostModel.create({ _id, ...data });
            return res.status(201).json(post);
        }, ['admin', 'employee']);

        return protectedHandler(req, res);
    } catch (err: any) {
        console.error('[blog:index] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
