// pages/api/services/index.ts
// GET: fetch all services (seeds from ALL_SERVICES if DB is empty)
// POST: create a new service
// PATCH: update service details

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ServiceModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';
import { ALL_SERVICES } from '../../../lib/serviceData';

// Seed default services from serviceData.ts if none exist
async function seedDefaultServices() {
    const count = await (ServiceModel as any).countDocuments();
    if (count > 0) return;

    const defaults = ALL_SERVICES.map((s, i) => ({
        _id: s.slug,
        slug: s.slug,
        title: s.title,
        iconEmoji: s.iconEmoji,
        description: s.metaDesc,
        isActive: true,
        order: i,
    }));

    await (ServiceModel as any).insertMany(defaults);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    // Public GET — anyone can fetch services
    if (req.method === 'GET') {
        await seedDefaultServices();
        const services = await (ServiceModel as any).find({ isActive: true }).sort({ order: 1 }).lean();
        return res.status(200).json(services);
    }

    // Admin-only mutations
    const protectedHandler = withApiAuth(async (req, res) => {
        if (req.method === 'POST') {
            const { slug, title, iconEmoji, description } = req.body;
            if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
            const id = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const existingCount = await (ServiceModel as any).countDocuments();
            const service = await (ServiceModel as any).create({
                _id: id,
                slug: id,
                title,
                iconEmoji: iconEmoji || '⚙️',
                description: description || '',
                order: existingCount,
            });
            return res.status(201).json(service);
        }

        if (req.method === 'PATCH') {
            const { slug, ...updates } = req.body;
            if (!slug) return res.status(400).json({ error: 'slug is required' });
            const updated = await (ServiceModel as any).findOneAndUpdate(
                { slug },
                { ...updates },
                { new: true }
            ).lean();
            if (!updated) return res.status(404).json({ error: 'Service not found' });
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            const { slug } = req.body;
            if (!slug) return res.status(400).json({ error: 'slug is required' });
            await (ServiceModel as any).findOneAndDelete({ slug });
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }, ['admin']);

    return protectedHandler(req, res);
}
