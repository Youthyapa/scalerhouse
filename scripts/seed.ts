// scripts/seed.ts
// Seeds MongoDB with initial demo data — run with: npx ts-node --esm scripts/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
    }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

// Inline schemas for seed script
const mix = mongoose.Schema.Types.Mixed;
const EmployeeSchema = new mongoose.Schema({ _id: String, name: String, email: String, passwordHash: String, role: String, department: String, assignedLeads: [String], assignedClients: [String], tasks: mix, status: String, joinedAt: String, performanceScore: Number }, { _id: false });
const LeadSchema = new mongoose.Schema({ _id: String, name: String, email: String, phone: String, company: String, service: String, budget: String, status: String, source: String, score: Number, notes: String, assignedTo: String, proposalUrl: String, followUpDate: String, affiliateId: String, createdAt: String, updatedAt: String }, { _id: false });
const ClientSchema = new mongoose.Schema({ _id: String, name: String, email: String, phone: String, company: String, service: String, projectName: String, status: String, passwordHash: String, startDate: String, endDate: String, invoices: mix, timeline: mix, reports: mix, assignedEmployees: [String], createdAt: String }, { _id: false });
const AffiliateSchema = new mongoose.Schema({ _id: String, name: String, email: String, phone: String, pan: String, bank: String, passwordHash: String, status: String, walletBalance: Number, leads: [String], payouts: mix, createdAt: String }, { _id: false });
const BlogSchema = new mongoose.Schema({ _id: String, title: String, slug: String, excerpt: String, content: String, category: String, author: String, coverImage: String, publishedAt: String, status: String }, { _id: false });
const CareerSchema = new mongoose.Schema({ _id: String, title: String, department: String, location: String, type: String, description: String, requirements: [String], isActive: Boolean, postedAt: String }, { _id: false });
const OfferSchema = new mongoose.Schema({ _id: String, title: String, description: String, couponCode: String, discount: Number, discountType: String, startDate: String, endDate: String, pages: [String], isActive: Boolean, createdAt: String }, { _id: false });
const TicketSchema = new mongoose.Schema({ _id: String, subject: String, description: String, status: String, priority: String, raisedBy: String, raisedByRole: String, assignedTo: String, messages: mix, createdAt: String, updatedAt: String }, { _id: false });
const ServicePackageSchema = new mongoose.Schema({ _id: String, serviceSlug: String, name: String, price: String, priceNote: String, deliverables: [String], isPopular: Boolean, ctaLabel: String }, { _id: false });
const PermissionSchema = new mongoose.Schema({ path: String, canView: Boolean, canEdit: Boolean, canDelete: Boolean }, { _id: false });
const RoleSchema = new mongoose.Schema({ _id: String, name: String, description: String, isProtected: Boolean, permissions: [PermissionSchema] }, { _id: false });

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected!');

    const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
    const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
    const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
    const Affiliate = mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema);
    const Blog = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogSchema);
    const Career = mongoose.models.Career || mongoose.model('Career', CareerSchema);
    const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
    const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
    const ServicePackage = mongoose.models.ServicePackage || mongoose.model('ServicePackage', ServicePackageSchema);
    const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

    console.log('🗑️  Clearing existing data...');
    await Promise.all([
        Employee.deleteMany({}), Lead.deleteMany({}), Client.deleteMany({}),
        Affiliate.deleteMany({}), Blog.deleteMany({}), Career.deleteMany({}),
        Offer.deleteMany({}), Ticket.deleteMany({}), ServicePackage.deleteMany({}), Role.deleteMany({})
    ]);

    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const staffHash = await bcrypt.hash('scaler123', 10);
    const clientHash = await bcrypt.hash('client123', 10);
    const affHash = await bcrypt.hash('affiliate123', 10);

    const defaultRoles = [
        {
            _id: 'role_admin', name: 'Admin', description: 'Super Administrator', isProtected: true,
            permissions: [{ path: '*', canView: true, canEdit: true, canDelete: true }]
        },
        {
            _id: 'role_sales', name: 'Sales Executive', description: 'Handles leads and client onboarding', isProtected: false,
            permissions: [
                { path: '/admin', canView: true, canEdit: false, canDelete: false },
                { path: '/admin/leads', canView: true, canEdit: true, canDelete: false },
                { path: '/admin/clients', canView: true, canEdit: true, canDelete: false },
                { path: '/admin/proposals', canView: true, canEdit: true, canDelete: false }
            ]
        },
        {
            _id: 'role_seo', name: 'SEO Specialist', description: 'Manages blogs and content', isProtected: false,
            permissions: [
                { path: '/admin', canView: true, canEdit: false, canDelete: false },
                { path: '/admin/blog', canView: true, canEdit: true, canDelete: true },
                { path: '/admin/content', canView: true, canEdit: true, canDelete: false },
                { path: '/admin/tickets', canView: true, canEdit: true, canDelete: false }
            ]
        }
    ];

    await Role.insertMany(defaultRoles);
    console.log('✅ Roles seeded');

    await Employee.insertMany([
        { _id: 'emp_admin', name: 'Shashank Singh', email: 'admin@scalerhouse.com', passwordHash: adminHash, role: 'Admin', department: 'Management', assignedLeads: [], assignedClients: [], tasks: [], status: 'Active', joinedAt: '2024-01-01', performanceScore: 98 },
        { _id: 'emp_001', name: 'Sandeep Verma', email: 'sandeep@scalerhouse.com', passwordHash: staffHash, role: 'Sales Executive', department: 'Sales', assignedLeads: ['lead_001', 'lead_002'], assignedClients: ['client_001'], tasks: [{ id: 'task_001', title: 'Follow up with TechCorp lead', status: 'Pending', priority: 'High', createdAt: new Date().toISOString() }], status: 'Active', joinedAt: '2024-03-15', performanceScore: 87 },
        { _id: 'emp_002', name: 'Amit Verma', email: 'amit@scalerhouse.com', passwordHash: staffHash, role: 'SEO Specialist', department: 'Digital Marketing', assignedLeads: [], assignedClients: ['client_001'], tasks: [], status: 'Active', joinedAt: '2024-04-01', performanceScore: 91 },
    ]);
    console.log('✅ Employees seeded');

    await Lead.insertMany([
        { _id: 'lead_001', name: 'Rajesh Kumar', email: 'rajesh@techcorp.in', phone: '+91-9800000001', company: 'TechCorp India', service: 'SEO + Social Media', budget: '₹50,000/mo', status: 'Proposal Sent', source: 'Website', score: 82, notes: 'Interested in full-stack digital growth package.', assignedTo: 'emp_001', followUpDate: '2026-03-10', createdAt: '2026-02-20T10:00:00.000Z', updatedAt: '2026-02-28T12:00:00.000Z' },
        { _id: 'lead_002', name: 'Sneha Gupta', email: 'sneha@fashionhive.com', phone: '+91-9800000002', company: 'Fashion Hive', service: 'Performance Ads', budget: '₹80,000/mo', status: 'Negotiation', source: 'Affiliate', score: 91, notes: 'Wants meta + Google Ads. Budget flexible.', assignedTo: 'emp_001', affiliateId: 'aff_001', createdAt: '2026-02-22T10:00:00.000Z', updatedAt: '2026-03-01T08:00:00.000Z' },
        { _id: 'lead_003', name: 'Vikram Singh', email: 'vikram@buildmasters.in', phone: '+91-9800000003', company: 'BuildMasters', service: 'Website + SEO', budget: '₹30,000/mo', status: 'New', source: 'Cold Call', score: 55, notes: 'Initial inquiry, needs nurturing.', createdAt: '2026-03-01T10:00:00.000Z', updatedAt: '2026-03-01T10:00:00.000Z' },
    ]);
    console.log('✅ Leads seeded');

    await Client.insertMany([
        {
            _id: 'client_001', name: 'Rajesh Kumar', email: 'client@scalerhouse.com', phone: '+91-9800000001', company: 'TechCorp India', service: 'SEO + Social Media', projectName: 'TechCorp Digital Growth Q1 2026', status: 'Active', passwordHash: clientHash, startDate: '2026-01-01',
            invoices: [
                { id: 'inv_001', amount: 50000, status: 'Paid', dueDate: '2026-02-01', paidDate: '2026-01-30', description: 'January Retainer' },
                { id: 'inv_002', amount: 50000, status: 'Paid', dueDate: '2026-03-01', paidDate: '2026-02-28', description: 'February Retainer' },
                { id: 'inv_003', amount: 50000, status: 'Pending', dueDate: '2026-04-01', description: 'March Retainer' },
            ],
            timeline: [
                { id: 'tl_001', title: 'Project Kickoff', description: 'Onboarding, audit, strategy', status: 'Done', date: '2026-01-05' },
                { id: 'tl_002', title: 'Technical SEO Fix', description: 'On-page + technical fixes', status: 'Done', date: '2026-01-20' },
                { id: 'tl_003', title: 'Content Strategy', description: 'Blog calendar + social plan', status: 'In Progress', date: '2026-02-15' },
                { id: 'tl_004', title: 'Link Building', description: '30 high-DA backlinks', status: 'In Progress', date: '2026-03-01' },
                { id: 'tl_005', title: 'Monthly Report', description: 'March performance report', status: 'Pending', date: '2026-04-01' },
            ],
            reports: [
                { id: 'rpt_001', title: 'January SEO Report', url: '#', uploadedAt: '2026-02-03' },
                { id: 'rpt_002', title: 'February SEO Report', url: '#', uploadedAt: '2026-03-03' },
            ],
            assignedEmployees: ['emp_001', 'emp_002'],
            createdAt: '2026-01-01T00:00:00.000Z',
        },
    ]);
    console.log('✅ Clients seeded');

    await Affiliate.insertMany([
        { _id: 'aff_001', name: 'Mohit Khanna', email: 'affiliate@scalerhouse.com', phone: '+91-9900000001', passwordHash: affHash, status: 'Approved', walletBalance: 12500, leads: ['lead_002'], payouts: [{ id: 'pay_001', amount: 8000, status: 'Paid', requestedAt: '2026-02-20', paidAt: '2026-02-25' }], createdAt: '2026-01-10T00:00:00.000Z' },
    ]);
    console.log('✅ Affiliates seeded');

    await Blog.insertMany([
        { _id: 'blog_001', title: '10 SEO Strategies That Actually Work in 2026', slug: '10-seo-strategies-2026', excerpt: 'Discover the top SEO tactics that are driving real results this year.', content: 'Full blog content here...', category: 'SEO', author: 'ScalerHouse Team', publishedAt: '2026-02-15', status: 'Published' },
        { _id: 'blog_002', title: 'How Performance Marketing Can 10x Your Revenue', slug: 'performance-marketing-10x-revenue', excerpt: 'Learn how data-driven performance marketing is transforming brands.', content: 'Full blog content here...', category: 'Performance Marketing', author: 'ScalerHouse Team', publishedAt: '2026-02-20', status: 'Published' },
        { _id: 'blog_003', title: 'Why Every Brand Needs a Social Media Playbook', slug: 'social-media-playbook', excerpt: 'A structured social media approach is the backbone of brand growth.', content: 'Full blog content here...', category: 'Social Media', author: 'ScalerHouse Team', publishedAt: '2026-03-01', status: 'Published' },
    ]);
    console.log('✅ Blog posts seeded');

    await Career.insertMany([
        { _id: 'job_001', title: 'Senior SEO Specialist', department: 'Digital Marketing', location: 'Remote / Kanpur', type: 'Full-time', description: 'We are looking for a skilled SEO expert to drive organic growth for our clients.', requirements: ['3+ years of SEO experience', 'Ahrefs/SEMrush proficiency', 'Content strategy knowledge'], isActive: true, postedAt: '2026-03-01' },
        { _id: 'job_002', title: 'Performance Ads Manager', department: 'Paid Media', location: 'Remote / Kanpur', type: 'Full-time', description: 'Manage and optimize Google & Meta ad campaigns for high-growth brands.', requirements: ['Google Ads certified', 'Meta Blueprint certified', '2+ years ROAS optimization'], isActive: true, postedAt: '2026-03-01' },
    ]);
    console.log('✅ Careers seeded');

    await Offer.insertMany([
        { _id: 'offer_001', title: 'Holi Special – 20% Off First Month', description: 'Celebrate Holi with ScalerHouse! Get 20% discount on any retainer plan.', couponCode: 'HOLI20', discount: 20, discountType: 'percentage', startDate: '2026-03-10', endDate: '2026-03-20', pages: ['/', '/services', '/contact'], isActive: true, createdAt: new Date().toISOString() },
    ]);
    console.log('✅ Offers seeded');

    await Ticket.insertMany([
        { _id: 'ticket_001', subject: 'March report not uploaded yet', description: 'Please upload the March performance report.', status: 'Open', priority: 'Medium', raisedBy: 'Rajesh Kumar', raisedByRole: 'client', assignedTo: 'emp_002', messages: [{ id: 'm1', from: 'Rajesh Kumar', message: 'Please upload the March performance report.', timestamp: new Date().toISOString() }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]);
    console.log('✅ Tickets seeded');

    await ServicePackage.insertMany([
        { _id: 'pkg_seo_1', serviceSlug: 'seo-content-marketing', name: 'Starter', price: '₹25,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Technical SEO Audit', 'Keyword Research (50 keywords)', 'On-Page Optimization (10 pages)', '4 Blog Posts/month', 'Monthly Ranking Report', 'Google Search Console Setup'] },
        { _id: 'pkg_seo_2', serviceSlug: 'seo-content-marketing', name: 'Growth', price: '₹45,000', priceNote: '/month', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Everything in Starter', 'Keyword Research (150 keywords)', 'On-Page Optimization (25 pages)', '8 Blog Posts/month', 'Link Building (10 DA40+ links)', 'Competitor Gap Analysis', 'Core Web Vitals Fix', 'Weekly Progress Updates'] },
        { _id: 'pkg_seo_3', serviceSlug: 'seo-content-marketing', name: 'Enterprise', price: '₹80,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Us', deliverables: ['Everything in Growth', 'Unlimited Keyword Tracking', 'Full-Site On-Page Optimization', '16 Blog Posts/month', 'Link Building (25 DA50+ links)', 'PR & Digital Press Coverage', 'Dedicated SEO Strategist', 'Bi-weekly Strategy Calls'] },
        { _id: 'pkg_ads_1', serviceSlug: 'performance-ads', name: 'Starter', price: '₹35,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Google Search Ads', 'Meta (Facebook + Instagram) Ads', 'Audience Research & Setup', 'Up to ₹2L Ad Spend Management', '2 Ad Creatives/month', 'Monthly Performance Report'] },
        { _id: 'pkg_ads_2', serviceSlug: 'performance-ads', name: 'Growth', price: '₹60,000', priceNote: '/month', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Everything in Starter', 'Google Display & YouTube Ads', 'Up to ₹5L Ad Spend Management', '6 Ad Creatives/month', 'Conversion Tracking (GTM)', 'A/B Ad Testing', 'Retargeting Campaigns', 'Weekly ROAS Reports'] },
        { _id: 'pkg_ads_3', serviceSlug: 'performance-ads', name: 'Enterprise', price: '₹1,20,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Us', deliverables: ['Everything in Growth', 'Unlimited Ad Spend Management', 'Full Funnel Strategy', '15+ Ad Creatives/month', 'Dedicated Ads Manager', 'Custom Dashboard Access', 'Competitor Ad Intelligence', 'Daily Performance Monitoring'] },
        { _id: 'pkg_smm_1', serviceSlug: 'social-media-management', name: 'Starter', price: '₹20,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['2 Platforms (Instagram + Facebook)', '12 Posts/month', 'Caption Copywriting', 'Basic Graphic Design', 'Community Management', 'Monthly Analytics Report'] },
        { _id: 'pkg_smm_2', serviceSlug: 'social-media-management', name: 'Growth', price: '₹38,000', priceNote: '/month', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Everything in Starter', '3 Platforms + LinkedIn', '20 Posts/month', '4 Reels/Shorts/month', 'Influencer Outreach (2/month)', 'Hashtag & Trend Strategy', 'Story/Highlights Management', 'Bi-weekly Performance Review'] },
        { _id: 'pkg_smm_3', serviceSlug: 'social-media-management', name: 'Enterprise', price: '₹65,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Us', deliverables: ['Everything in Growth', 'All Platforms incl. YouTube', '35 Posts/month', '8 Reels + 2 YouTube Videos/month', 'Influencer Outreach (5/month)', 'Paid Social Boost (₹10K budget)', 'Brand Voice Guidelines', 'Dedicated Social Strategist'] },
        { _id: 'pkg_web_1', serviceSlug: 'web-design-development', name: 'Starter', price: '₹40,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 5 pages', 'Mobile-Responsive Design', 'WordPress or Next.js', 'Basic On-Page SEO', 'Contact Form Integration', '3 months free support'] },
        { _id: 'pkg_web_2', serviceSlug: 'web-design-development', name: 'Growth', price: '₹85,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Up to 12 pages', 'Custom UI/UX Design', 'CMS Integration', 'Advanced SEO Setup', 'Google Analytics + GTM', 'Speed & Core Web Vitals', 'Blog/Portfolio Section', '6 months free support'] },
        { _id: 'pkg_web_3', serviceSlug: 'web-design-development', name: 'Enterprise', price: '₹1,80,000', priceNote: '+', isPopular: false, ctaLabel: 'Get a Quote', deliverables: ['Unlimited Pages', 'Full Custom Design System', 'Next.js / Headless CMS', 'E-commerce / Booking System', 'Advanced Animations', 'Multi-language Support', 'CRM & API Integrations', '12 months priority support'] },
        { _id: 'pkg_cro_1', serviceSlug: 'analytics-cro', name: 'Starter', price: '₹18,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['GA4 Setup & Configuration', 'GTM Implementation', 'Basic Goal Tracking', '1 Landing Page CRO Audit', 'Monthly CRO Report'] },
        { _id: 'pkg_cro_2', serviceSlug: 'analytics-cro', name: 'Growth', price: '₹32,000', priceNote: '/month', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Everything in Starter', 'Hotjar / Heatmap Setup', 'Session Recording Analysis', 'A/B Testing (2 tests/month)', 'Funnel Drop-off Analysis', 'Form Optimization', 'Bi-weekly CRO Updates'] },
        { _id: 'pkg_cro_3', serviceSlug: 'analytics-cro', name: 'Enterprise', price: '₹55,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Us', deliverables: ['Everything in Growth', 'Custom Reporting Dashboard', 'Multi-Channel Attribution', 'A/B Testing (unlimited)', 'Dedicated CRO Strategist', 'Revenue Impact Projections', 'Quarterly CRO Deep-Dive'] },
        { _id: 'pkg_email_1', serviceSlug: 'email-marketing', name: 'Starter', price: '₹15,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Email Platform Setup', 'Welcome Sequence (3 emails)', '2 Newsletter Campaigns/month', 'List Segmentation (basic)', 'Open & Click Analytics'] },
        { _id: 'pkg_email_2', serviceSlug: 'email-marketing', name: 'Growth', price: '₹28,000', priceNote: '/month', isPopular: true, ctaLabel: 'Most Popular', deliverables: ['Everything in Starter', 'Full Drip Sequence (8 emails)', '6 Newsletter Campaigns/month', 'Advanced Segmentation', 'A/B Subject Line Testing', 'Re-engagement Campaigns', 'Monthly List Health Check'] },
        { _id: 'pkg_email_3', serviceSlug: 'email-marketing', name: 'Enterprise', price: '₹50,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Us', deliverables: ['Everything in Growth', 'Unlimited Email Campaigns', 'Behavioural Trigger Automation', 'CRM Integration', 'E-commerce Flows (cart, upsell)', 'Dedicated Email Strategist', 'Revenue Attribution Tracking'] },
        { _id: 'pkg_gmb_1', serviceSlug: 'google-my-business', name: 'Starter', price: '₹12,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['GMB Profile Setup & Verification', 'Basic Profile Optimization', '4 Local Posts/month', 'Basic Review Management', 'Monthly Performance Report'] },
        { _id: 'pkg_gmb_2', serviceSlug: 'google-my-business', name: 'Growth', price: '₹25,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Everything in Starter', 'Advanced Profile SEO Optimization', '10 Local Posts/month', 'Q&A Section Management', 'Reputation Management & Replies', 'Monthly Strategy Call'] },
        { _id: 'pkg_gmb_3', serviceSlug: 'google-my-business', name: 'Enterprise', price: '₹45,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Multi-location Management', '15+ Local Posts/month', 'Local Citations Building', 'Competitor Intelligence', 'Dedicated GMB Manager', 'Bi-weekly Performance Reports'] },
        { _id: 'pkg_app_1', serviceSlug: 'app-development', name: 'Starter', price: '₹1,50,000', priceNote: ' onwards', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Native iOS or Android MVP', 'Basic UI/UX Design', '3 Core Features', 'Standard API Integrations', '1 Month Free Maintenance'] },
        { _id: 'pkg_app_2', serviceSlug: 'app-development', name: 'Growth', price: '₹3,50,000', priceNote: ' onwards', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Cross-Platform App (React Native/Flutter)', 'Custom UI/UX Design', 'Advanced Features & Animations', 'Custom API Development', 'App Store Optimization (ASO)', '3 Months Free Maintenance'] },
        { _id: 'pkg_app_3', serviceSlug: 'app-development', name: 'Enterprise', price: '₹8,00,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Custom Native or Cross-Platform iOS & Android', 'Complex Backend Architecture', 'AI/ML or IoT Integrations', 'High Security Compliance', 'Dedicated Development Team', '12 Months Priority Support'] },
        { _id: 'pkg_uiux_1', serviceSlug: 'ui-ux-design', name: 'Starter', price: '₹40,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 5 Pages/Screens', 'Wireframing & Prototyping', 'Basic Design System', '1 Revision Round', 'Figma Source File Delivery'] },
        { _id: 'pkg_uiux_2', serviceSlug: 'ui-ux-design', name: 'Growth', price: '₹95,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Up to 15 Pages/Screens', 'In-depth User Research', 'Comprehensive Design System', 'Interactive Prototypes', '3 Revision Rounds', 'Developer Handoff Support'] },
        { _id: 'pkg_uiux_3', serviceSlug: 'ui-ux-design', name: 'Enterprise', price: '₹2,50,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Pages/Screens', 'Full Product Lifecycle Design', 'Extensive Usability Testing', 'Complex Interaction Design', 'Dedicated Lead Designer', 'Ongoing Design Support (Retainer)'] },
        { _id: 'pkg_gd_1', serviceSlug: 'graphic-designing', name: 'Starter', price: '₹15,000', priceNote: '/month', isPopular: false, ctaLabel: 'Get Started', deliverables: ['10 Graphic Assets / month', 'Social Media Creatives', 'Basic Print Collaterals', '2 Revisions per Asset', 'Standard Delivery (2-3 days)'] },
        { _id: 'pkg_gd_2', serviceSlug: 'graphic-designing', name: 'Growth', price: '₹35,000', priceNote: '/month', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['30 Graphic Assets / month', 'Ad Creatives & Banners', 'Presentations & Pitch Decks', 'Unlimited Revisions', 'Priority Delivery (24-48 hours)'] },
        { _id: 'pkg_gd_3', serviceSlug: 'graphic-designing', name: 'Enterprise', price: '₹70,000', priceNote: '/month', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Graphic Assets', 'Brand Campaign Storyboarding', 'Complex Illustrations & 3D (Basic)', 'Dedicated Senior Designer', 'Same-day Delivery for urgent tasks'] },
        { _id: 'pkg_logo_1', serviceSlug: 'logo-designing', name: 'Starter', price: '₹12,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['2 Unique Logo Concepts', '2 Revision Rounds', 'Primary Logo File Formats (PNG, JPG)', 'Vector File Delivery (SVG, AI)', 'Basic Typographical Font Setup'] },
        { _id: 'pkg_logo_2', serviceSlug: 'logo-designing', name: 'Growth', price: '₹28,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['4 Unique Logo Concepts', 'Unlimited Revisions', 'Full Brand Guidelines (Basic)', 'Color Palette & Typography', 'Social Media Kit (Profile & Covers)'] },
        { _id: 'pkg_logo_3', serviceSlug: 'logo-designing', name: 'Enterprise', price: '₹60,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['6+ Unique Logo Concepts', 'Comprehensive Brand Identity System', 'Stationery Design (Cards, Letterheads)', 'Brand Voice & Tone Guidelines', 'Dedicated Brand Director'] },
        { _id: 'pkg_crm_1', serviceSlug: 'crm-development', name: 'Starter', price: '₹75,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Custom Basic CRM Setup', 'Up to 3 User Roles', 'Lead & Contact Management', 'Basic Reporting Dashboard', 'Standard Email Integration', '1 Month Support'] },
        { _id: 'pkg_crm_2', serviceSlug: 'crm-development', name: 'Growth', price: '₹2,00,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Advanced Automation & Workflows', 'Up to 10 User Roles', 'Sales Pipeline & Deal Tracking', 'Custom Analytics & Custom Reporting', 'Third-party API Integrations (Zapier, etc)', '3 Months Support'] },
        { _id: 'pkg_crm_3', serviceSlug: 'crm-development', name: 'Enterprise', price: '₹5,00,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Enterprise-grade Modular CRM', 'Unlimited User Roles', 'Complex Legacy System Migration', 'AI-powered Insights & Predictions', 'Dedicated Infrastructure Setup', '12 Months Priority Support'] },
        { _id: 'pkg_api_1', serviceSlug: 'api-automations', name: 'Starter', price: '₹25,000', priceNote: ' one-time', isPopular: false, ctaLabel: 'Get Started', deliverables: ['Up to 3 App Integrations', 'Zapier/Make Workflow Setup', 'Data Syncing Configuration', 'Basic Error Logging', '1 Month Monitoring'] },
        { _id: 'pkg_api_2', serviceSlug: 'api-automations', name: 'Growth', price: '₹65,000', priceNote: ' one-time', isPopular: true, ctaLabel: 'Choose Growth', deliverables: ['Up to 10 App Integrations', 'Custom Webhook Development', 'Complex Multi-step Workflows', 'Data Transformation & Processing', 'Advanced Error Handling & Retry Logic', '3 Months Monitoring & Tweaks'] },
        { _id: 'pkg_api_3', serviceSlug: 'api-automations', name: 'Enterprise', price: '₹1,50,000+', priceNote: ' custom', isPopular: false, ctaLabel: 'Contact Sales', deliverables: ['Unlimited Integrations & Scalability', 'Custom API Aggregation Layer', 'High Availability Architecture', 'Strict Security & Compliance Controls', 'Dedicated Automation Engineer', '12 Months Priority Retainer Maintenance'] },
    ]);
    console.log('✅ Service packages seeded');

    console.log('\n🎉 Seed complete! All demo data is now in MongoDB Atlas.');
    console.log('\n📋 Demo Login Credentials:');
    console.log('   Admin:     admin@scalerhouse.com     / (see ADMIN_PASSWORD in .env.local)');
    console.log('   Employee:  sandeep@scalerhouse.com   / scaler123');
    console.log('   Employee:  amit@scalerhouse.com      / scaler123');
    console.log('   Client:    client@scalerhouse.com    / client123');
    console.log('   Affiliate: affiliate@scalerhouse.com / affiliate123');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
