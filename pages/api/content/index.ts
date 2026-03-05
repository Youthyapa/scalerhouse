import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ContentItemModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';

const DEFAULT_CONTENT = [
    // Client Logos
    { _id: 'client_tata', type: 'client_logo', title: 'TATA', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1024px-Tata_logo.svg.png', order: 0 },
    { _id: 'client_adani', type: 'client_logo', title: 'Adani', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Adani_logo.svg/1200px-Adani_logo.svg.png', order: 1 },
    { _id: 'client_royal_enfield', type: 'client_logo', title: 'Royal Enfield', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Royal_Enfield_logo.svg/2560px-Royal_Enfield_logo.svg.png', order: 2 },
    { _id: 'client_jawa', type: 'client_logo', title: 'Jawa', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Jawa_logo.svg/2560px-Jawa_logo.svg.png', order: 3 },
    { _id: 'client_raymond', type: 'client_logo', title: 'Raymond', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Raymond_logo.svg/1200px-Raymond_logo.svg.png', order: 4 },
    { _id: 'client_ceat', type: 'client_logo', title: 'CEAT', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/CEAT_logo.svg/1200px-CEAT_logo.svg.png', order: 5 },
    { _id: 'client_redchief', type: 'client_logo', title: 'RedChief', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_Chief_logo.svg/1200px-Red_Chief_logo.svg.png', order: 6 },

    // Achievements
    { _id: 'ach_google', type: 'achievement', title: 'Google Premier Partner', description: 'Recognized as a top 3% agency globally for Google Ads performance', imageUrl: 'https://www.google.com/partners/badge/images/2022/PremierBadgeClickable.svg', order: 0 },
    { _id: 'ach_meta', type: 'achievement', title: 'Meta Business Partner', description: 'Certified experts in advanced Meta advertising and tracking', imageUrl: 'https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/a0kO6vM969T.png', order: 1 },
    { _id: 'ach_clutch', type: 'achievement', title: 'Top B2B Company', description: 'Rated 4.9/5 on Clutch for digital strategy and execution', imageUrl: 'https://s3.amazonaws.com/clutch-image-assets/badges/2023/brand/Clutch_Top_B2B_Company_2023.png', order: 2 },

    // News Links
    { _id: 'news_forbes', type: 'news_link', title: 'Forbes', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Forbes_logo.svg/1200px-Forbes_logo.svg.png', linkUrl: '#', order: 0 },
    { _id: 'news_et', type: 'news_link', title: 'Economic Times', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/The_Economic_Times_logo.svg/2560px-The_Economic_Times_logo.svg.png', linkUrl: '#', order: 1 },
    { _id: 'news_mint', type: 'news_link', title: 'Mint', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Mint_logo.svg/1200px-Mint_logo.svg.png', linkUrl: '#', order: 2 },

    // FAQs (Why Choose Us)
    { _id: 'faq_1', type: 'faq', title: 'Do you guarantee results?', description: 'While we cannot guarantee arbitrary numbers, we do guarantee execution against KPI-driven benchmarks established during our strategy phase.', order: 0 },
    { _id: 'faq_2', type: 'faq', title: 'Are there any long-term lock-ins?', description: 'No. All our retainers run on a month-to-month basis. We rely on performance to keep you with us, not legally binding annual contracts.', order: 1 },
    { _id: 'faq_3', type: 'faq', title: 'Who creates the content?', description: 'Everything is managed by our in-house team of expert copywriters, designers, and strategists. We never outsource your brand\'s voice.', order: 2 },
];

async function seedDefaultContent() {
    const count = await (ContentItemModel as any).countDocuments();
    if (count > 0) return;
    await (ContentItemModel as any).insertMany(DEFAULT_CONTENT);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    // Public GET
    if (req.method === 'GET') {
        await seedDefaultContent();

        const { type } = req.query as { type?: string };
        const filter = type ? { type, isActive: true } : { isActive: true };

        const content = await (ContentItemModel as any).find(filter).sort({ order: 1 }).lean();
        return res.status(200).json(content);
    }

    // Admin protected mutations
    const protectedHandler = withApiAuth(async (req, res) => {
        if (req.method === 'POST') {
            const { type, title, imageUrl, linkUrl, description } = req.body;
            if (!type || !title) return res.status(400).json({ error: 'Type and title required' });

            const count = await (ContentItemModel as any).countDocuments({ type });
            const item = await (ContentItemModel as any).create({
                _id: `content_${Date.now()}_${crypto.randomUUID().slice(0, 4)}`,
                type,
                title,
                imageUrl,
                linkUrl,
                description,
                order: count,
            });
            return res.status(201).json(item);
        }

        if (req.method === 'PATCH') {
            const { id, ...updates } = req.body;
            if (!id) return res.status(400).json({ error: 'id required' });
            const item = await (ContentItemModel as any).findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!item) return res.status(404).json({ error: 'Content not found' });
            return res.status(200).json(item);
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            const targetId = id || req.body.id;
            if (!targetId) return res.status(400).json({ error: 'id required' });
            await (ContentItemModel as any).findByIdAndDelete(targetId);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }, ['admin']);

    return protectedHandler(req, res);
}
