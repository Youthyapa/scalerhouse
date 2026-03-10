// pages/api/services/packages.ts
// GET: fetch all packages (optionally ?serviceSlug=xxx), seeds 3 defaults if empty per service
// POST: create a new package
// PATCH: update a package
// DELETE: delete a package

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDB } from '../../../lib/db';
import { ServicePackageModel, ServiceModel } from '../../../lib/models';
import { withApiAuth } from '../../../lib/apiAuth';

// Default 3 packages per service
const DEFAULT_PACKAGES: Record<string, { name: string; price: string; priceNote: string; isPopular: boolean; ctaLabel: string; deliverables: string[] }[]> = {
    'seo-content-marketing': [
        { name: 'Starter', price: '₹15,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['5 SEO-optimized blog posts/month', 'Keyword research & tracking (50 keywords)', 'On-page optimization (5 pages)', 'Monthly performance report', 'Google Search Console setup'] },
        { name: 'Growth', price: '₹30,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['12 blog posts/month', 'Keyword tracking (150 keywords)', 'On-page SEO (15 pages)', 'Technical SEO audit', 'Link building (10 backlinks/month)', 'Monthly strategy call'] },
        { name: 'Enterprise', price: '₹60,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['25 blog posts/month', 'Unlimited keyword tracking', 'Full site SEO overhaul', 'Link building (25+ backlinks/month)', 'Content calendar & strategy', 'Dedicated SEO manager', 'Weekly reports'] },
    ],
    'performance-ads': [
        { name: 'Starter', price: '₹20,000', priceNote: '/month + ad spend', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Google/Meta ads setup', 'Up to ₹50K ad spend managed', '2 ad creatives/month', 'Campaign performance report', 'Basic A/B testing'] },
        { name: 'Growth', price: '₹40,000', priceNote: '/month + ad spend', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Multi-platform campaigns (Google + Meta)', 'Up to ₹2L ad spend managed', '6 ad creatives/month', 'Retargeting campaigns', 'Conversion tracking setup', 'Bi-weekly strategy calls'] },
        { name: 'Enterprise', price: '₹75,000', priceNote: '/month + ad spend', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['All platforms (Google, Meta, LinkedIn, TikTok)', 'Unlimited ad spend managed', '15+ ad creatives/month', 'Advanced audience segmentation', 'Attribution modeling', 'Dedicated ads manager', 'Weekly optimization reports'] },
    ],
    'social-media-management': [
        { name: 'Starter', price: '₹12,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['12 posts/month (2 platforms)', 'Basic graphic design', 'Caption writing', 'Monthly content calendar', 'Hashtag research'] },
        { name: 'Growth', price: '₹25,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['20 posts/month (3 platforms)', 'Custom graphic design', 'Reels/short video (4/month)', 'Community management', 'Influencer outreach', 'Monthly analytics report'] },
        { name: 'Enterprise', price: '₹50,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited posts (all platforms)', 'Premium graphic & video production', '8+ Reels/month', 'Full community management', 'Paid social integration', 'Brand voice & strategy', 'Weekly performance reports'] },
    ],
    'web-design-development': [
        { name: 'Starter', price: '₹40,000', priceNote: 'one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 5-page website', 'Mobile responsive design', 'Contact form integration', 'Basic SEO setup', '1 revision round', '1 month support'] },
        { name: 'Growth', price: '₹90,000', priceNote: 'one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Up to 15 pages', 'Custom UI/UX design', 'CMS integration', 'Speed optimization', 'Google Analytics setup', '3 revision rounds', '3 months support'] },
        { name: 'Enterprise', price: '₹2,00,000+', priceNote: 'custom quote', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited pages & features', 'Custom web application', 'API & third-party integrations', 'E-commerce / booking system', 'Advanced performance optimization', 'Dedicated developer', '6 months support'] },
    ],
    'analytics-cro': [
        { name: 'Starter', price: '₹18,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['GA4 & GTM setup', 'Conversion goal tracking', 'Monthly analytics report', 'Heatmap analysis', '1 A/B test/month'] },
        { name: 'Growth', price: '₹35,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Advanced GA4 & GTM configuration', 'Funnel drop-off analysis', '3 A/B tests/month', 'User session recordings', 'CRO recommendations', 'Bi-weekly reports'] },
        { name: 'Enterprise', price: '₹65,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Full analytics stack setup', 'Custom dashboards', 'Unlimited A/B testing', 'Predictive analytics', 'Personalization engine', 'Dedicated CRO specialist', 'Weekly insights'] },
    ],
    'email-marketing': [
        { name: 'Starter', price: '₹10,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['2 email campaigns/month', 'Welcome sequence setup', 'List segmentation', 'Performance reporting', 'Template design'] },
        { name: 'Growth', price: '₹22,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['6 campaigns/month', 'Advanced automation flows', 'A/B email testing', 'Subscriber list growth strategy', 'Personalized content blocks', 'Monthly strategy call'] },
        { name: 'Enterprise', price: '₹45,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited email campaigns', 'Complex lifecycle automations', 'Advanced segmentation & personalization', 'Deliverability optimization', 'SMS integration', 'Dedicated email strategist', 'Weekly reports'] },
    ],
    'google-my-business': [
        { name: 'Starter', price: '₹12,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['GMB Profile Setup & Verification', 'Basic Profile Optimization', '4 Local Posts/month', 'Basic Review Management', 'Monthly Performance Report'] },
        { name: 'Growth', price: '₹25,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Everything in Starter', 'Advanced Profile SEO Optimization', '10 Local Posts/month', 'Q&A Section Management', 'Reputation Management & Replies', 'Monthly Strategy Call'] },
        { name: 'Enterprise', price: '₹45,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Multi-location Management', '15+ Local Posts/month', 'Local Citations Building', 'Competitor Intelligence', 'Dedicated GMB Manager', 'Bi-weekly Performance Reports'] },
    ],
    'app-development': [
        { name: 'Starter', price: '₹1,50,000', priceNote: ' onwards', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Native iOS or Android MVP', 'Basic UI/UX Design', '3 Core Features', 'Standard API Integrations', '1 Month Free Maintenance'] },
        { name: 'Growth', price: '₹3,50,000', priceNote: ' onwards', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Cross-Platform App (React Native/Flutter)', 'Custom UI/UX Design', 'Advanced Features & Animations', 'Custom API Development', 'App Store Optimization (ASO)', '3 Months Free Maintenance'] },
        { name: 'Enterprise', price: '₹8,00,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Custom Native or Cross-Platform iOS & Android', 'Complex Backend Architecture', 'AI/ML or IoT Integrations', 'High Security Compliance', 'Dedicated Development Team', '12 Months Priority Support'] },
    ],
    'ui-ux-design': [
        { name: 'Starter', price: '₹40,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 5 Pages/Screens', 'Wireframing & Prototyping', 'Basic Design System', '1 Revision Round', 'Figma Source File Delivery'] },
        { name: 'Growth', price: '₹95,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Up to 15 Pages/Screens', 'In-depth User Research', 'Comprehensive Design System', 'Interactive Prototypes', '3 Revision Rounds', 'Developer Handoff Support'] },
        { name: 'Enterprise', price: '₹2,50,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Pages/Screens', 'Full Product Lifecycle Design', 'Extensive Usability Testing', 'Complex Interaction Design', 'Dedicated Lead Designer', 'Ongoing Design Support (Retainer)'] },
    ],
    'graphic-designing': [
        { name: 'Starter', price: '₹15,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['10 Graphic Assets / month', 'Social Media Creatives', 'Basic Print Collaterals', '2 Revisions per Asset', 'Standard Delivery (2-3 days)'] },
        { name: 'Growth', price: '₹35,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['30 Graphic Assets / month', 'Ad Creatives & Banners', 'Presentations & Pitch Decks', 'Unlimited Revisions', 'Priority Delivery (24-48 hours)'] },
        { name: 'Enterprise', price: '₹70,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Graphic Assets', 'Brand Campaign Storyboarding', 'Complex Illustrations & 3D (Basic)', 'Dedicated Senior Designer', 'Same-day Delivery for urgent tasks'] },
    ],
    'logo-designing': [
        { name: 'Starter', price: '₹12,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['2 Unique Logo Concepts', '2 Revision Rounds', 'Primary Logo File Formats (PNG, JPG)', 'Vector File Delivery (SVG, AI)', 'Basic Typographical Font Setup'] },
        { name: 'Growth', price: '₹28,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['4 Unique Logo Concepts', 'Unlimited Revisions', 'Full Brand Guidelines (Basic)', 'Color Palette & Typography', 'Social Media Kit (Profile & Covers)'] },
        { name: 'Enterprise', price: '₹60,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['6+ Unique Logo Concepts', 'Comprehensive Brand Identity System', 'Stationery Design (Cards, Letterheads)', 'Brand Voice & Tone Guidelines', 'Dedicated Brand Director'] },
    ],
    'crm-development': [
        { name: 'Starter', price: '₹75,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Custom Basic CRM Setup', 'Up to 3 User Roles', 'Lead & Contact Management', 'Basic Reporting Dashboard', 'Standard Email Integration', '1 Month Support'] },
        { name: 'Growth', price: '₹2,00,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Advanced Automation & Workflows', 'Up to 10 User Roles', 'Sales Pipeline & Deal Tracking', 'Custom Analytics & Custom Reporting', 'Third-party API Integrations (Zapier, etc)', '3 Months Support'] },
        { name: 'Enterprise', price: '₹5,00,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Enterprise-grade Modular CRM', 'Unlimited User Roles', 'Complex Legacy System Migration', 'AI-powered Insights & Predictions', 'Dedicated Infrastructure Setup', '12 Months Priority Support'] },
    ],
    'api-automations': [
        { name: 'Starter', price: '₹25,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 3 App Integrations', 'Zapier/Make Workflow Setup', 'Data Syncing Configuration', 'Basic Error Logging', '1 Month Monitoring'] },
        { name: 'Growth', price: '₹65,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Up to 10 App Integrations', 'Custom Webhook Development', 'Complex Multi-step Workflows', 'Data Transformation & Processing', 'Advanced Error Handling & Retry Logic', '3 Months Monitoring & Tweaks'] },
        { name: 'Enterprise', price: '₹1,50,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Integrations & Scalability', 'Custom API Aggregation Layer', 'High Availability Architecture', 'Strict Security & Compliance Controls', 'Dedicated Automation Engineer', '12 Months Priority Retainer Maintenance'] },
    ],
};

async function seedPackagesForService(serviceSlug: string) {
    const count = await (ServicePackageModel as any).countDocuments({ serviceSlug });
    if (count > 0) return;

    const templates = DEFAULT_PACKAGES[serviceSlug] || [
        { name: 'Basic', price: '₹10,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Core service deliverables', 'Monthly reporting'] },
        { name: 'Standard', price: '₹25,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Standard', deliverables: ['Enhanced service deliverables', 'Priority support', 'Monthly strategy call'] },
        { name: 'Premium', price: '₹50,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Full-service deliverables', 'Dedicated manager', 'Weekly reports', 'Unlimited revisions'] },
    ];

    const packages = templates.map((t, i) => ({
        _id: `pkg_${serviceSlug}_${i}_${crypto.randomUUID().slice(0, 6)}`,
        serviceSlug,
        ...t,
    }));

    await (ServicePackageModel as any).insertMany(packages);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    // Public GET
    if (req.method === 'GET') {
        const { serviceSlug } = req.query as { serviceSlug?: string };
        if (serviceSlug) {
            await seedPackagesForService(serviceSlug);
        }
        const filter = serviceSlug ? { serviceSlug } : {};
        const packages = await (ServicePackageModel as any).find(filter).lean();
        return res.status(200).json(packages);
    }

    const protectedHandler = withApiAuth(async (req, res) => {
        if (req.method === 'POST') {
            const { serviceSlug, name, price, priceNote, deliverables, isPopular, ctaLabel } = req.body;
            if (!serviceSlug || !name) return res.status(400).json({ error: 'serviceSlug and name required' });
            const pkg = await (ServicePackageModel as any).create({
                _id: `pkg_${serviceSlug}_${Date.now()}`,
                serviceSlug,
                name,
                price: price || '',
                priceNote: priceNote || '/month',
                deliverables: deliverables || [],
                isPopular: isPopular || false,
                ctaLabel: ctaLabel || 'Get Started',
            });
            return res.status(201).json(pkg);
        }

        if (req.method === 'PATCH') {
            const { id, ...updates } = req.body;
            if (!id) return res.status(400).json({ error: 'id required' });
            const updated = await (ServicePackageModel as any).findByIdAndUpdate(id, updates, { new: true }).lean();
            if (!updated) return res.status(404).json({ error: 'Package not found' });
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            if (!id) return res.status(400).json({ error: 'id required' });
            await (ServicePackageModel as any).findByIdAndDelete(id);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }, ['admin']);

    return protectedHandler(req, res);
}
