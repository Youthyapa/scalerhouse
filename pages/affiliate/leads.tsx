// pages/affiliate/leads.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, KEYS, Affiliate, Lead, genId, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const affNav = [
    { href: '/affiliate/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/affiliate/leads', label: 'My Leads', icon: '🎯' },
    { href: '/affiliate/wallet', label: 'Wallet', icon: '💰' },
];

const services = ['SEO & Content', 'Performance Ads', 'Social Media', 'Web Design', 'Email Marketing', 'Brand Strategy'];

function AffiliateLeads() {
    const { user } = useAuth();
    const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '' });

    useEffect(() => {
        const all = getAll<Affiliate>(KEYS.AFFILIATES);
        const aff = all.find(a => a.id === user?.entityId);
        setAffiliate(aff || null);
        if (aff) {
            const allLeads = getAll<Lead>(KEYS.LEADS);
            setLeads(allLeads.filter(l => aff.leads.includes(l.id)).reverse());
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliate) return;
        const newLead: Lead = {
            id: genId(), ...form,
            status: 'New', source: 'Affiliate', score: 70,
            notes: `Referred by: ${affiliate.name}`,
            affiliateId: affiliate.id,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        addItem<Lead>(KEYS.LEADS, newLead);
        const allAffs = getAll<Affiliate>(KEYS.AFFILIATES);
        const idx = allAffs.findIndex(a => a.id === affiliate.id);
        if (idx !== -1) {
            allAffs[idx].leads.push(newLead.id);
            const { saveAll } = require('../../lib/store');
            saveAll(KEYS.AFFILIATES, allAffs);
        }
        logActivity(`Affiliate lead: ${form.name} by ${affiliate.name}`, 'Affiliate');
        toast.success('Lead submitted successfully!');
        setShowModal(false);
        setForm({ name: '', email: '', phone: '', company: '', service: '' });
        setLeads(prev => [newLead, ...prev]);
    };

    return (
        <DashboardLayout navItems={affNav} title="My Leads" roleBadge="Affiliate" roleBadgeClass="badge-purple">
            <Head><title>My Leads – Affiliate | ScalerHouse</title></Head>

            <div className="flex justify-between items-center mb-5">
                <div>
                    <div className="text-slate-400 text-sm">{leads.length} total leads submitted</div>
                    <div className="text-green-400 text-sm">{leads.filter(l => l.status === 'Won').length} converted • ₹{leads.filter(l => l.status === 'Won').length * 12500} earned</div>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm">
                    <Plus size={14} /> Submit Lead
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Service</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-500 py-16">
                                <TrendingUp size={32} className="mx-auto mb-3 text-slate-700" />
                                No leads yet. Submit your first lead to start earning!
                            </td></tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id}>
                                <td>
                                    <div className="text-white font-medium">{lead.name}</div>
                                    <div className="text-slate-500 text-xs">{lead.email}</div>
                                </td>
                                <td className="text-slate-300 text-sm">{lead.service}</td>
                                <td className="text-slate-400 text-sm">{lead.company || '—'}</td>
                                <td>
                                    <span className={`badge text-xs ${lead.status === 'Won' ? 'badge-green' : lead.status === 'New' ? 'badge-blue' : lead.status === 'Lost' ? 'badge-red' : 'badge-yellow'}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="text-slate-500 text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                                <td className="text-green-400 font-medium">
                                    {lead.status === 'Won' ? '₹12,500' : lead.status === 'Negotiation' ? 'Pending' : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Submit a New Lead</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Full Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Lead's full name" />
                                </div>
                                <div>
                                    <label className="form-label">Email *</label>
                                    <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@company.com" />
                                </div>
                                <div>
                                    <label className="form-label">Phone *</label>
                                    <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div>
                                    <label className="form-label">Company</label>
                                    <input className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Service Interest</label>
                                <select className="form-input" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                                    <option value="">Select service...</option>
                                    {services.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Submit Lead</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AffiliateLeads, ['affiliate']);
