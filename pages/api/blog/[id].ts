// pages/api/blog/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { BlogPostModel } from '../../../lib/models';
import { withApiAuth, AuthPayload } from '../../../lib/apiAuth';

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthPayload) {
    try {
        await connectDB();
        const { id } = req.query;

        if (req.method === 'GET') {
            const post = await BlogPostModel.findById(id).lean();
            if (!post) return res.status(404).json({ error: 'Post not found' });
            return res.status(200).json(post);
        }

        if (req.method === 'PUT') {
            const { _id, ...updates } = req.body;
            const post = await BlogPostModel.findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!post) return res.status(404).json({ error: 'Post not found' });
            return res.status(200).json(post);
        }

        if (req.method === 'DELETE') {
            await BlogPostModel.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Post deleted' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err: any) {
        console.error('[blog:[id]] error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withApiAuth(handler, ['admin', 'employee']);
