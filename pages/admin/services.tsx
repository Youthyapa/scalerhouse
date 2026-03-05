// pages/admin/services.tsx — Services & Pricing (MongoDB-backed)
import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronUp, Star, X, Pencil } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
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

interface ServicePackage {
    _id: string;
    serviceSlug: string;
    name: string;
    price: string;
    priceNote: string;
    deliverables: string[];
    isPopular: boolean;
    ctaLabel: string;
}

interface Service {
    _id: string;
    slug: string;
    title: string;
    iconEmoji: string;
    description?: string;
    isActive: boolean;
}

function ServicesAdminPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [dirty, setDirty] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Add Service Modal
    const [showAddService, setShowAddService] = useState(false);
    const [newSvc, setNewSvc] = useState({ title: '', iconEmoji: '', description: '' });
    const [addingSvc, setAddingSvc] = useState(false);

    const token = () => typeof window !== 'undefined' ? localStorage.getItem('sh_token') : '';
    const authJson = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [svcRes, pkgRes] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/services/packages'),
            ]);
            if (svcRes.ok) {
                const svcs: Service[] = await svcRes.json();
                setServices(svcs);
                if (!expanded && svcs[0]) setExpanded(svcs[0].slug);
            }
            if (pkgRes.ok) setPackages(await pkgRes.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    // Make sure packages are seeded whenever a service is expanded
    const handleExpand = async (slug: string) => {
        if (expanded === slug) { setExpanded(null); return; }
        setExpanded(slug);
        const has = packages.some(p => p.serviceSlug === slug);
        if (!has) {
            // Trigger seeding via GET with serviceSlug
            const res = await fetch(`/api/services/packages?serviceSlug=${slug}`);
            if (res.ok) {
                const newPkgs: ServicePackage[] = await res.json();
                setPackages(prev => [...prev.filter(p => p.serviceSlug !== slug), ...newPkgs]);
            }
        }
    };

    const getServicePackages = (slug: string) => packages.filter(p => p.serviceSlug === slug);

    const updatePackage = (id: string, updates: Partial<ServicePackage>) => {
        setPackages(prev => prev.map(p => p._id === id ? { ...p, ...updates } : p));
        setDirty(prev => new Set(prev).add(id));
    };

    const updateDeliverable = (pkgId: string, index: number, value: string) => {
        const pkg = packages.find(p => p._id === pkgId);
        if (!pkg) return;
        const dels = [...pkg.deliverables];
        dels[index] = value;
        updatePackage(pkgId, { deliverables: dels });
    };

    const addDeliverable = (pkgId: string) => {
        const pkg = packages.find(p => p._id === pkgId);
        if (!pkg) return;
        updatePackage(pkgId, { deliverables: [...pkg.deliverables, ''] });
    };

    const removeDeliverable = (pkgId: string, index: number) => {
        const pkg = packages.find(p => p._id === pkgId);
        if (!pkg) return;
        updatePackage(pkgId, { deliverables: pkg.deliverables.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        if (dirty.size === 0) return;
        setSaving(true);
        try {
            const dirtyPkgs = packages.filter(p => dirty.has(p._id));
            await Promise.all(
                dirtyPkgs.map(pkg =>
                    fetch('/api/services/packages', {
                        method: 'PATCH',
                        headers: authJson(),
                        body: JSON.stringify({ id: pkg._id, name: pkg.name, price: pkg.price, priceNote: pkg.priceNote, deliverables: pkg.deliverables, isPopular: pkg.isPopular, ctaLabel: pkg.ctaLabel }),
                    })
                )
            );
            setDirty(new Set());
            toast.success('All pricing saved!');
        } catch {
            toast.error('Failed to save some changes');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPackage = async (serviceSlug: string) => {
        try {
            const res = await fetch('/api/services/packages', {
                method: 'POST',
                headers: authJson(),
                body: JSON.stringify({
                    serviceSlug,
                    name: 'New Package',
                    price: '₹0',
                    priceNote: '/month',
                    deliverables: ['Add your deliverables here'],
                    isPopular: false,
                    ctaLabel: 'Get Started',
                }),
            });
            if (!res.ok) throw new Error('Failed');
            const pkg = await res.json();
            setPackages(prev => [...prev, pkg]);
            toast.success('Package added!');
        } catch {
            toast.error('Failed to add package');
        }
    };

    const handleDeletePackage = async (id: string) => {
        if (!confirm('Delete this package?')) return;
        await fetch('/api/services/packages', {
            method: 'DELETE',
            headers: authJson(),
            body: JSON.stringify({ id }),
        });
        setPackages(prev => prev.filter(p => p._id !== id));
        setDirty(prev => { const s = new Set(prev); s.delete(id); return s; });
        toast.success('Package deleted');
    };

    const handleAddService = async () => {
        if (!newSvc.title) return toast.error('Service title is required');
        setAddingSvc(true);
        try {
            const slug = newSvc.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: authJson(),
                body: JSON.stringify({ slug, title: newSvc.title, iconEmoji: newSvc.iconEmoji || '⚙️', description: newSvc.description }),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            toast.success('Service added!');
            setShowAddService(false);
            setNewSvc({ title: '', iconEmoji: '', description: '' });
            loadData();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setAddingSvc(false);
        }
    };

    return (
        <DashboardLayout navItems={adminNav} title="Services & Pricing" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Services & Pricing – Admin | ScalerHouse</title></Head>

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-slate-400 text-sm">Edit package names, prices, and deliverables. Changes reflect live on the public website.</p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddService(true)}
                        className="btn-outline !py-2 !px-4 !text-sm flex items-center gap-2"
                    >
                        <Plus size={14} /> Add Service
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={dirty.size === 0 || saving}
                        className={`btn-glow !py-2 !px-5 !text-sm flex items-center gap-2 ${dirty.size === 0 ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                        <Save size={15} />
                        {saving ? 'Saving…' : `Save All Changes${dirty.size > 0 ? ` (${dirty.size})` : ''}`}
                    </button>
                </div>
            </div>

            {/* Service Accordions */}
            {loading ? (
                <div className="text-center text-slate-500 py-20">Loading services…</div>
            ) : (
                <div className="space-y-4">
                    {services.map(svc => {
                        const pkgs = getServicePackages(svc.slug);
                        const isOpen = expanded === svc.slug;
                        const hasDirty = pkgs.some(p => dirty.has(p._id));

                        return (
                            <div key={svc.slug} className={`glass-card border transition-all ${hasDirty ? 'border-yellow-400/30' : 'border-white/8'}`}>
                                {/* Accordion Header */}
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left"
                                    onClick={() => handleExpand(svc.slug)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{svc.iconEmoji}</span>
                                        <div>
                                            <p className="font-syne font-bold text-white">{svc.title}</p>
                                            <p className="text-slate-500 text-xs mt-0.5">{pkgs.length} packages</p>
                                        </div>
                                        {hasDirty && <span className="badge badge-yellow text-xs">Unsaved changes</span>}
                                    </div>
                                    {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </button>

                                {/* Package Grid */}
                                {isOpen && (
                                    <div className="px-5 pb-6 border-t border-white/5">
                                        <div className="grid md:grid-cols-3 gap-5 mt-5">
                                            {pkgs.map(pkg => (
                                                <div
                                                    key={pkg._id}
                                                    className={`rounded-xl border p-5 space-y-4 relative ${dirty.has(pkg._id) ? 'border-yellow-400/20 bg-yellow-400/3' : 'border-white/8 bg-white/2'}`}
                                                >
                                                    {/* Delete package */}
                                                    <button
                                                        onClick={() => handleDeletePackage(pkg._id)}
                                                        className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors"
                                                        title="Delete package"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>

                                                    {/* Package Name + Popular */}
                                                    <div className="flex items-center justify-between pr-4">
                                                        <input
                                                            className="form-input !text-sm font-syne font-bold !bg-transparent !border-0 !p-0 !text-white focus:!ring-0 w-28"
                                                            value={pkg.name}
                                                            onChange={e => updatePackage(pkg._id, { name: e.target.value })}
                                                            placeholder="Package Name"
                                                        />
                                                        <button
                                                            onClick={() => updatePackage(pkg._id, { isPopular: !pkg.isPopular })}
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
                                                            onChange={e => updatePackage(pkg._id, { price: e.target.value })}
                                                            placeholder="e.g. ₹25,000"
                                                        />
                                                    </div>

                                                    {/* Price Note */}
                                                    <div>
                                                        <label className="form-label">Price Note</label>
                                                        <input
                                                            className="form-input !text-sm"
                                                            value={pkg.priceNote}
                                                            onChange={e => updatePackage(pkg._id, { priceNote: e.target.value })}
                                                            placeholder="/month or one-time"
                                                        />
                                                    </div>

                                                    {/* CTA Label */}
                                                    <div>
                                                        <label className="form-label">Button Label</label>
                                                        <input
                                                            className="form-input !text-sm"
                                                            value={pkg.ctaLabel}
                                                            onChange={e => updatePackage(pkg._id, { ctaLabel: e.target.value })}
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
                                                                        onChange={e => updateDeliverable(pkg._id, idx, e.target.value)}
                                                                        placeholder="Deliverable item"
                                                                    />
                                                                    <button
                                                                        onClick={() => removeDeliverable(pkg._id, idx)}
                                                                        className="text-red-400 hover:text-red-300 shrink-0 transition-colors"
                                                                        title="Remove"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => addDeliverable(pkg._id)}
                                                                className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors mt-1"
                                                            >
                                                                <Plus size={12} /> Add Deliverable
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Package button */}
                                            <button
                                                onClick={() => handleAddPackage(svc.slug)}
                                                className="rounded-xl border border-dashed border-white/15 p-5 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 transition-all min-h-[180px]"
                                            >
                                                <Plus size={24} />
                                                <span className="text-sm">Add Package</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Service Modal */}
            {showAddService && (
                <div className="modal-overlay" onClick={() => setShowAddService(false)}>
                    <div className="modal-box !max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-syne font-bold text-xl text-white">Add New Service</h3>
                            <button onClick={() => setShowAddService(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-4 gap-3">
                                <div className="col-span-1">
                                    <label className="form-label">Emoji</label>
                                    <input
                                        className="form-input text-center text-2xl"
                                        value={newSvc.iconEmoji}
                                        onChange={e => setNewSvc(p => ({ ...p, iconEmoji: e.target.value }))}
                                        placeholder="⚙️"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="form-label">Service Title *</label>
                                    <input
                                        className="form-input"
                                        value={newSvc.title}
                                        onChange={e => setNewSvc(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Video Production"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Short Description</label>
                                <textarea
                                    className="form-input !h-16"
                                    value={newSvc.description}
                                    onChange={e => setNewSvc(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Brief description for this service…"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button onClick={handleAddService} disabled={addingSvc} className="btn-glow flex-1 justify-center">
                                {addingSvc ? 'Adding…' : '+ Add Service'}
                            </button>
                            <button onClick={() => setShowAddService(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ServicesAdminPage, ['admin']);
