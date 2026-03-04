// pages/admin/services.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, ServicePackage } from '../../lib/store';
import { ALL_SERVICES } from '../../lib/serviceData';
import toast from 'react-hot-toast';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];

function ServicesAdminPage() {
    const [allPackages, setAllPackages] = useState<ServicePackage[]>([]);
    const [expanded, setExpanded] = useState<string | null>(ALL_SERVICES[0]?.slug ?? null);
    const [dirty, setDirty] = useState<Set<string>>(new Set());

    const reload = () => setAllPackages(getAll<ServicePackage>(KEYS.SERVICE_PACKAGES));
    useEffect(() => { reload(); }, []);

    const getServicePackages = (slug: string) =>
        allPackages.filter(p => p.serviceSlug === slug);

    const updatePackage = (id: string, updates: Partial<ServicePackage>) => {
        setAllPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        setDirty(prev => new Set(prev).add(id));
    };

    const updateDeliverable = (pkgId: string, index: number, value: string) => {
        const pkg = allPackages.find(p => p.id === pkgId);
        if (!pkg) return;
        const dels = [...pkg.deliverables];
        dels[index] = value;
        updatePackage(pkgId, { deliverables: dels });
    };

    const addDeliverable = (pkgId: string) => {
        const pkg = allPackages.find(p => p.id === pkgId);
        if (!pkg) return;
        updatePackage(pkgId, { deliverables: [...pkg.deliverables, ''] });
    };

    const removeDeliverable = (pkgId: string, index: number) => {
        const pkg = allPackages.find(p => p.id === pkgId);
        if (!pkg) return;
        const dels = pkg.deliverables.filter((_, i) => i !== index);
        updatePackage(pkgId, { deliverables: dels });
    };

    const handleSave = () => {
        saveAll(KEYS.SERVICE_PACKAGES, allPackages);
        setDirty(new Set());
        toast.success('All pricing saved successfully!');
    };

    return (
        <DashboardLayout navItems={adminNav} title="Services & Pricing" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Services & Pricing – Admin | ScalerHouse</title></Head>

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-slate-400 text-sm">Edit package names, prices, and deliverables for all services. Changes reflect live on the public website.</p>
                <button
                    onClick={handleSave}
                    className={`btn-glow !py-2 !px-5 !text-sm flex items-center gap-2 ${dirty.size > 0 ? '' : 'opacity-60 pointer-events-none'}`}
                >
                    <Save size={15} />
                    Save All Changes {dirty.size > 0 && `(${dirty.size} edited)`}
                </button>
            </div>

            {/* Service Accordions */}
            <div className="space-y-4">
                {ALL_SERVICES.map(svc => {
                    const pkgs = getServicePackages(svc.slug);
                    const isOpen = expanded === svc.slug;
                    const hasDirty = pkgs.some(p => dirty.has(p.id));

                    return (
                        <div key={svc.slug} className={`glass-card border transition-all ${hasDirty ? 'border-yellow-400/30' : 'border-white/8'}`}>
                            {/* Accordion Header */}
                            <button
                                className="w-full flex items-center justify-between p-5 text-left"
                                onClick={() => setExpanded(isOpen ? null : svc.slug)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{svc.iconEmoji}</span>
                                    <div>
                                        <p className="font-syne font-bold text-white">{svc.title}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{pkgs.length} packages</p>
                                    </div>
                                    {hasDirty && (
                                        <span className="badge badge-yellow text-xs">Unsaved changes</span>
                                    )}
                                </div>
                                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>

                            {/* Package Grid */}
                            {isOpen && (
                                <div className="px-5 pb-6 border-t border-white/5">
                                    <div className="grid md:grid-cols-3 gap-5 mt-5">
                                        {pkgs.map(pkg => (
                                            <div
                                                key={pkg.id}
                                                className={`rounded-xl border p-5 space-y-4 ${dirty.has(pkg.id) ? 'border-yellow-400/20 bg-yellow-400/3' : 'border-white/8 bg-white/2'}`}
                                            >
                                                {/* Package Name + Popular */}
                                                <div className="flex items-center justify-between">
                                                    <input
                                                        className="form-input !text-sm font-syne font-bold !bg-transparent !border-0 !p-0 !text-white focus:!ring-0 w-28"
                                                        value={pkg.name}
                                                        onChange={e => updatePackage(pkg.id, { name: e.target.value })}
                                                        placeholder="Package Name"
                                                    />
                                                    <button
                                                        onClick={() => updatePackage(pkg.id, { isPopular: !pkg.isPopular })}
                                                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${pkg.isPopular ? 'border-cyan-400/60 text-cyan-400 bg-cyan-400/10' : 'border-white/10 text-slate-500'}`}
                                                        title="Toggle Most Popular"
                                                    >
                                                        <Star size={11} fill={pkg.isPopular ? 'currentColor' : 'none'} />
                                                        Popular
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div>
                                                    <label className="form-label">Price</label>
                                                    <input
                                                        className="form-input !text-sm"
                                                        value={pkg.price}
                                                        onChange={e => updatePackage(pkg.id, { price: e.target.value })}
                                                        placeholder="e.g. ₹25,000"
                                                    />
                                                </div>

                                                {/* Price Note */}
                                                <div>
                                                    <label className="form-label">Price Note</label>
                                                    <input
                                                        className="form-input !text-sm"
                                                        value={pkg.priceNote}
                                                        onChange={e => updatePackage(pkg.id, { priceNote: e.target.value })}
                                                        placeholder="/month or one-time"
                                                    />
                                                </div>

                                                {/* CTA Label */}
                                                <div>
                                                    <label className="form-label">Button Label</label>
                                                    <input
                                                        className="form-input !text-sm"
                                                        value={pkg.ctaLabel}
                                                        onChange={e => updatePackage(pkg.id, { ctaLabel: e.target.value })}
                                                        placeholder="Get Started"
                                                    />
                                                </div>

                                                {/* Deliverables */}
                                                <div>
                                                    <label className="form-label">Deliverables</label>
                                                    <div className="space-y-2">
                                                        {pkg.deliverables.map((d, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <input
                                                                    className="form-input !text-xs flex-1"
                                                                    value={d}
                                                                    onChange={e => updateDeliverable(pkg.id, idx, e.target.value)}
                                                                    placeholder="Deliverable item"
                                                                />
                                                                <button
                                                                    onClick={() => removeDeliverable(pkg.id, idx)}
                                                                    className="text-red-400 hover:text-red-300 shrink-0 transition-colors"
                                                                    title="Remove"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => addDeliverable(pkg.id)}
                                                            className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors mt-1"
                                                        >
                                                            <Plus size={12} /> Add Deliverable
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </DashboardLayout>
    );
}

export default withAuth(ServicesAdminPage, ['admin']);
