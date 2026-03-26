// pages/api/admin/fix-usd-prices.ts
// One-time migration: add priceUSD to all existing packages that don't have it
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db';
import { ServicePackageModel } from '../../../lib/models';

// same seed data from packages.ts – just the prices
const USD_PRICES: Record<string, Record<string, string>> = {
    'seo-content-marketing': { 'Starter': '$181', 'Growth': '$361', 'Enterprise': '$723' },
    'performance-ads': { 'Starter': '$241', 'Growth': '$482', 'Enterprise': '$904' },
    'social-media-management': { 'Starter': '$145', 'Growth': '$301', 'Enterprise': '$602' },
    'web-design-development': { 'Starter': '$482', 'Growth': '$1,084', 'Enterprise': '$2,410+' },
    'analytics-cro': { 'Starter': '$217', 'Growth': '$422', 'Enterprise': '$783' },
    'email-marketing': { 'Starter': '$121', 'Growth': '$265', 'Enterprise': '$542' },
    'google-my-business': { 'Starter': '$145', 'Growth': '$301', 'Enterprise': '$542' },
    'app-development': { 'Starter': '$1,807', 'Growth': '$4,217', 'Enterprise': '$9,639+' },
    'ui-ux-design': { 'Starter': '$482', 'Growth': '$1,145', 'Enterprise': '$3,012+' },
    'graphic-designing': { 'Starter': '$181', 'Growth': '$422', 'Enterprise': '$843' },
    'logo-designing': { 'Starter': '$145', 'Growth': '$337', 'Enterprise': '$723' },
    'crm-development': { 'Starter': '$904', 'Growth': '$2,410', 'Enterprise': '$6,024+' },
    'api-automations': { 'Starter': '$301', 'Growth': '$783', 'Enterprise': '$1,807+' },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    
    await connectDB();
    
    const packages = await (ServicePackageModel as any).find({}).lean();
    let updated = 0;

    for (const pkg of packages) {
        if (!(pkg as any).priceUSD) {
            const serviceMap = USD_PRICES[(pkg as any).serviceSlug] || {};
            const usd = serviceMap[(pkg as any).name];
            if (usd) {
                await (ServicePackageModel as any).findByIdAndUpdate(pkg._id, { priceUSD: usd });
                updated++;
            }
        }
    }

    return res.status(200).json({ message: `Updated ${updated} packages with USD pricing` });
}
