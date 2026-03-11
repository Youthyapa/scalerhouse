// lib/adminNav.ts – Single source of truth for admin sidebar navigation
// Import this in every admin page instead of defining a local adminNav array.

export const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/content', label: 'Homepage Content', icon: '🌐' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/applications', label: 'Applications', icon: '📝' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];
