// lib/serviceData.ts

export const ALL_SERVICES = [
    {
        slug: 'seo-content-marketing',
        title: 'SEO & Content Marketing',
        iconEmoji: '🔍',
        metaDesc: 'Dominate search results and drive organic traffic with our proven SEO strategies.',
        badgeClass: 'badge-blue',
        badge: 'Organic Growth',
        tagline: 'Turn your website into a 24/7 lead generation machine.',
        gradientFrom: '#3b82f6',
        gradientTo: '#1d4ed8',
        howItWorks: [
            { step: '1', title: 'Audit', desc: 'Comprehensive technical and content audit.' },
            { step: '2', title: 'Strategy', desc: 'Keyword research and content planning.' },
            { step: '3', title: 'Execution', desc: 'On-page optimization and link building.' },
        ],
        smallBizBenefits: [
            'Increase local visibility',
            'Cost-effective long-term growth',
            'Build brand authority'
        ],
        enterpriseBenefits: [
            'Dominate highly competitive niches',
            'Enterprise-grade technical SEO',
            'Content team scaling'
        ],
        process: [
            { icon: '📊', label: 'Technical SEO', desc: 'Fixing site structure and speed.' },
            { icon: '✍️', label: 'Content Creation', desc: 'High-quality, engaging content.' },
            { icon: '🔗', label: 'Link Building', desc: 'Acquiring high-authority backlinks.' }
        ],
        faqs: [
            { q: 'How long does SEO take?', a: 'Typically 3-6 months to see significant results.' },
            { q: 'Do you guarantee rankings?', a: 'No reputable agency can guarantee #1 rankings due to algorithms.' }
        ]
    },
    {
        slug: 'performance-ads',
        title: 'Performance Ads',
        iconEmoji: '📣',
        metaDesc: 'Maximize your ROI with data-driven advertising campaigns.',
        badgeClass: 'badge-cyan',
        badge: 'Paid Growth',
        tagline: 'Reach your ideal customers instantly and scale your revenue.',
        gradientFrom: '#06b6d4',
        gradientTo: '#0891b2',
        howItWorks: [
            { step: '1', title: 'Research', desc: 'Audience and competitor analysis.' },
            { step: '2', title: 'Build', desc: 'Campaign setup and ad copy creation.' },
            { step: '3', title: 'Optimize', desc: 'Continuous testing and scaling.' },
        ],
        smallBizBenefits: [
            'Immediate traffic generation',
            'Highly targeted local audiences',
            'Flexible budget management'
        ],
        enterpriseBenefits: [
            'Multi-channel scaling',
            'Advanced attribution modeling',
            'High-volume conversion optimization'
        ],
        process: [
            { icon: '🎯', label: 'Targeting', desc: 'Finding the right audience.' },
            { icon: '💡', label: 'Creative', desc: 'Designing high-converting ads.' },
            { icon: '📈', label: 'Scaling', desc: 'Increasing budget profitably.' }
        ],
        faqs: [
            { q: 'What platforms do you use?', a: 'Google, Meta, LinkedIn, and TikTok.' },
            { q: 'What is the minimum budget?', a: 'We recommend at least $1500/mo in ad spend.' }
        ]
    },
    {
        slug: 'social-media-management',
        title: 'Social Media Management',
        iconEmoji: '📱',
        metaDesc: 'Build a loyal community and elevate your brand presence.',
        badgeClass: 'badge-purple',
        badge: 'Brand Building',
        tagline: 'Connect with your audience where they spend their time.',
        gradientFrom: '#a855f7',
        gradientTo: '#7e22ce',
        howItWorks: [
            { step: '1', title: 'Strategy', desc: 'Platform and content strategy.' },
            { step: '2', title: 'Create', desc: 'Designing visuals and writing copy.' },
            { step: '3', title: 'Engage', desc: 'Community management and reporting.' },
        ],
        smallBizBenefits: [
            'Consistent posting schedule',
            'Professional brand image',
            'Community engagement'
        ],
        enterpriseBenefits: [
            'Omnichannel brand voice consistency',
            'Influencer campaign management',
            'Crisis communication handling'
        ],
        process: [
            { icon: '📅', label: 'Planning', desc: 'Monthly content calendars.' },
            { icon: '🎨', label: 'Design', desc: 'Custom graphics and video.' },
            { icon: '💬', label: 'Community', desc: 'Replying to comments and DMs.' }
        ],
        faqs: [
            { q: 'Which platforms are included?', a: 'Customized based on your audience.' },
            { q: 'Do you create videos?', a: 'Yes, we handle short-form video content.' }
        ]
    },
    {
        slug: 'web-design-development',
        title: 'Web Design & Development',
        iconEmoji: '💻',
        metaDesc: 'Stunning, high-performance websites built for conversions.',
        badgeClass: 'badge-green',
        badge: 'Digital Storefront',
        tagline: 'Your website should be your best salesperson.',
        gradientFrom: '#22c55e',
        gradientTo: '#16a34a',
        howItWorks: [
            { step: '1', title: 'Discover', desc: 'UX research and wireframing.' },
            { step: '2', title: 'Design', desc: 'UI design and prototyping.' },
            { step: '3', title: 'Develop', desc: 'Coding and performance optimization.' },
        ],
        smallBizBenefits: [
            'Professional online presence',
            'Mobile-responsive design',
            'Lead capture integration'
        ],
        enterpriseBenefits: [
            'Custom web applications',
            'Complex API integrations',
            'Enterprise CMS solutions'
        ],
        process: [
            { icon: '✏️', label: 'Wireframing', desc: 'Plotting the user journey.' },
            { icon: '🖼️', label: 'UI/UX', desc: 'Creating the visual language.' },
            { icon: '🚀', label: 'Launch', desc: 'Deployment and testing.' }
        ],
        faqs: [
            { q: 'Do you use templates?', a: 'Custom designs tailored to your brand.' },
            { q: 'Will I be able to edit it?', a: 'Yes, we provide an easy-to-use CMS.' }
        ]
    },
    {
        slug: 'analytics-cro',
        title: 'Analytics & CRO',
        iconEmoji: '📊',
        metaDesc: 'Turn more visitors into customers with data-driven optimization.',
        badgeClass: 'badge-orange',
        badge: 'Optimization',
        tagline: 'Stop guessing. Start growing with data.',
        gradientFrom: '#f97316',
        gradientTo: '#ea580c',
        howItWorks: [
            { step: '1', title: 'Setup', desc: 'Advanced tracking implementation.' },
            { step: '2', title: 'Analyze', desc: 'Identifying conversion bottlenecks.' },
            { step: '3', title: 'Test', desc: 'A/B testing and implementation.' },
        ],
        smallBizBenefits: [
            'Understand visitor behavior',
            'Improve website ROI',
            'Clear performance reporting'
        ],
        enterpriseBenefits: [
            'Advanced predictive analytics',
            'Personalization at scale',
            'Complex funnel optimization'
        ],
        process: [
            { icon: '📈', label: 'Tracking', desc: 'GA4 and Tag Manager setup.' },
            { icon: '🔬', label: 'Hypothesis', desc: 'Formulating tests.' },
            { icon: 'A/B', label: 'Testing', desc: 'Running experiments.' }
        ],
        faqs: [
            { q: 'What is CRO?', a: 'Conversion Rate Optimization.' },
            { q: 'How long until we see results?', a: 'Tests usually run 2-4 weeks.' }
        ]
    },
    {
        slug: 'email-marketing',
        title: 'Email Marketing',
        iconEmoji: '✉️',
        metaDesc: 'Nurture leads and drive repeat sales with automated campaigns.',
        badgeClass: 'badge-pink',
        badge: 'Retention',
        tagline: 'Unlock the highest ROI channel in digital marketing.',
        gradientFrom: '#ec4899',
        gradientTo: '#db2777',
        howItWorks: [
            { step: '1', title: 'Audit', desc: 'Reviewing current email performance.' },
            { step: '2', title: 'Automate', desc: 'Setting up core flows.' },
            { step: '3', title: 'Campaigns', desc: 'Regular newsletter sends.' },
        ],
        smallBizBenefits: [
            'Build direct customer relationships',
            'Automated welcome sequences',
            'Promotional campaign management'
        ],
        enterpriseBenefits: [
            'Advanced segment personalization',
            'Complex lifecycle automations',
            'Deliverability optimization'
        ],
        process: [
            { icon: '📝', label: 'Copywriting', desc: 'Persuasive email copy.' },
            { icon: '🎨', label: 'Design', desc: 'Branded email templates.' },
            { icon: '⚙️', label: 'Automation', desc: 'Behavior-triggered flows.' }
        ],
        faqs: [
            { q: 'Which ESP do you recommend?', a: 'We typically use Klaviyo or Mailchimp.' },
            { q: 'How often should we email?', a: 'Depends on your audience and goals.' }
        ]
    }
];

export function getServiceBySlug(slug: string) {
    return ALL_SERVICES.find((s) => s.slug === slug);
}
