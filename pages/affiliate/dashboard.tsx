// pages/affiliate/dashboard.tsx – Affiliate Dashboard
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, KEYS, Affiliate, Lead, genId, logActivity, updateItem } from '../../lib/store';
import toast from 'react-hot-toast';

const affNav = [
    { href: '/affiliate/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/affiliate/leads', label: 'My Leads', icon: '🎯' },
    { href: '/affiliate/wallet', label: 'Wallet', icon: '💰' },
];

const services = ['SEO & Content', 'Performance Ads', 'Social Media', 'Web Design', 'Email Marketing', 'Brand Strategy'];

function AffiliateDashboard() {
    const { user } = useAuth();
    const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', company: '', service: '' });

    useEffect(() => {
        const all = getAll<Affiliate>(KEYS.AFFILIATES);
        const aff = all.find(a => a.id === user?.entityId);
        setAffiliate(aff || null);
        if (aff) {
            const allLeads = getAll<Lead>(KEYS.LEADS);
            setLeads(allLeads.filter(l => aff.leads.includes(l.id)));
        }
    }, [user]);

    const submitLead = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliate) return;
        const newLead: Lead = {
            id: genId(), ...leadForm,
            status: 'New', source: 'Affiliate', score: 70,
            notes: `Referred by affiliate: ${affiliate.name}`,
            affiliateId: affiliate.id,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        addItem<Lead>(KEYS.LEADS, newLead);

        // Update affiliate leads array
        const allAffs = getAll<Affiliate>(KEYS.AFFILIATES);
        const idx = allAffs.findIndex(a => a.id === affiliate.id);
        if (idx !== -1) {
            allAffs[idx].leads.push(newLead.id);
            const { saveAll } = require('../../lib/store');
            saveAll(KEYS.AFFILIATES, allAffs);
        }

        logActivity(`Affiliate lead submitted: ${leadForm.name} by ${affiliate.name}`, 'Affiliate');
        toast.success('Lead submitted! We\'ll be in touch with you about the progress.');
        setShowLeadModal(false);
        setLeadForm({ name: '', email: '', phone: '', company: '', service: '' });
        setLeads(prev => [...prev, newLead]);
    };

    const requestPayout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliate) return;
        const amount = parseFloat(payoutAmount);
        if (amount > affiliate.walletBalance) { toast.error('Insufficient wallet balance'); return; }
        const payout = { id: genId(), amount, status: 'Requested' as const, requestedAt: new Date().toISOString() };

        const allAffs = getAll<Affiliate>(KEYS.AFFILIATES);
        const idx = allAffs.findIndex(a => a.id === affiliate.id);
        if (idx !== -1) {
            allAffs[idx].payouts.push(payout);
            allAffs[idx].walletBalance -= amount;
            const { saveAll } = require('../../lib/store');
            saveAll(KEYS.AFFILIATES, allAffs);
            setAffiliate(allAffs[idx]);
        }
        logActivity(`Payout request ₹${amount} by ${affiliate.name}`, 'Affiliate');
        toast.success('Payout requested! Admin will process within 5 business days.');
        setShowPayoutModal(false);
        setPayoutAmount('');
    };

    if (!affiliate) return (
        <DashboardLayout navItems={affNav} title="Affiliate Dashboard" roleBadge="Affiliate" roleBadgeClass="badge-purple">
            <div className="text-center text-slate-400 py-20">Affiliate account not found. Please contact support.</div>
        </DashboardLayout>
    );

    if (affiliate.status === 'Pending') return (
        <DashboardLayout navItems={affNav} title="Affiliate Dashboard" roleBadge="Pending Approval" roleBadgeClass="badge-yellow">
            <div className="max-w-md mx-auto text-center py-20">
                <Clock size={48} className="text-yellow-400 mx-auto mb-4" />
                <h3 className="font-syne font-bold text-xl text-white mb-3">Pending Approval</h3>
                <p className="text-slate-400">Your affiliate account is under review. Our team will approve it within 24 hours.</p>
            </div>
        </DashboardLayout>
    );

    const wonLeads = leads.filter(l => l.status === 'Won').length;
    const estimatedCommission = wonLeads * 12500; // mock calculation

    return (
        <DashboardLayout navItems={affNav} title="Affiliate Dashboard" roleBadge="Affiliate" roleBadgeClass="badge-purple">
            <Head><title>Affiliate Dashboard – ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {[
                    { label: 'Total Leads', value: leads.length, sub: 'submitted', color: 'text-blue-400' },
                    { label: 'Deals Won', value: wonLeads, sub: 'conversions', color: 'text-green-400' },
                    { label: 'Wallet Balance', value: `₹${affiliate.walletBalance.toLocaleString()}`, sub: 'available', color: 'text-cyan-400' },
                    { label: 'Est. Commission', value: `₹${estimatedCommission.toLocaleString()}`, sub: 'total earned', color: 'text-yellow-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`font-syne font-black text-3xl ${s.color}`}>{s.value}</div>
                        <div className="text-white text-sm font-medium">{s.label}</div>
                        <div className="text-slate-500 text-xs">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-5">
                <button onClick={() => setShowLeadModal(true)} className="btn-glow !py-2.5 !px-5 !text-sm">
                    <Plus size={15} /> Submit Lead
                </button>
                <button onClick={() => setShowPayoutModal(true)} disabled={affiliate.walletBalance === 0} className="btn-outline !py-2.5 !px-5 !text-sm disabled:opacity-40">
                    <Wallet size={15} /> Request Payout
                </button>
            </div>

            {/* Leads Table */}
            <div className="glass-card overflow-hidden mb-5">
                <div className="p-5 border-b border-white/5">
                    <h3 className="font-semibold text-white">My Submitted Leads</h3>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-slate-500 py-10">No leads submitted yet. Click &ldquo;Submit Lead&rdquo; to start earning!</td></tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id}>
                                <td>
                                    <div className="font-medium text-white">{lead.name}</div>
                                    <div className="text-slate-500 text-xs">{lead.company}</div>
                                </td>
                                <td className="text-slate-300 text-sm">{lead.service}</td>
                                <td>
                                    <span className={`badge text-xs ${lead.status === 'Won' ? 'badge-green' : lead.status === 'New' ? 'badge-blue' : lead.status === 'Lost' ? 'badge-red' : 'badge-yellow'}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="text-slate-500 text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                                <td className="text-green-400 font-medium">
                                    {lead.status === 'Won' ? '₹12,500' : lead.status === 'Negotiation' ? 'Pending deal' : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payouts */}
            <div className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4">Payout History</h3>
                {affiliate.payouts.length === 0 ? (
                    <p className="text-slate-500 text-sm">No payout requests yet.</p>
                ) : affiliate.payouts.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-white/3 mb-2">
                        <div>
                            <p className="text-white font-medium">₹{p.amount.toLocaleString()}</p>
                            <p className="text-slate-500 text-xs">{new Date(p.requestedAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <span className={`badge ${p.status === 'Paid' ? 'badge-green' : p.status === 'Processing' ? 'badge-blue' : 'badge-yellow'}`}>{p.status}</span>
                    </div>
                ))}
            </div>

            {/* Submit Lead Modal */}
            {showLeadModal && (
                <div className="modal-overlay" onClick={() => setShowLeadModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Submit a Lead</h3>
                        <form onSubmit={submitLead} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Contact Name *</label>
                                    <input className="form-input !text-sm" required value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="Full Name" />
                                </div>
                                <div>
                                    <label className="form-label">Email *</label>
                                    <input type="email" className="form-input !text-sm" required value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="email@company.com" />
                                </div>
                                <div>
                                    <label className="form-label">Phone *</label>
                                    <input className="form-input !text-sm" required value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="+91 XXXXX" />
                                </div>
                                <div>
                                    <label className="form-label">Company</label>
                                    <input className="form-input !text-sm" value={leadForm.company} onChange={e => setLeadForm({ ...leadForm, company: e.target.value })} placeholder="Company Name" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Service Interest</label>
                                <select className="form-input !text-sm" value={leadForm.service} onChange={e => setLeadForm({ ...leadForm, service: e.target.value })}>
                                    <option value="">Select service...</option>
                                    {services.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Submit Lead</button>
                                <button type="button" onClick={() => setShowLeadModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payout Modal */}
            {showPayoutModal && (
                <div className="modal-overlay" onClick={() => setShowPayoutModal(false)}>
                    <div className="modal-box max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-3">Request Payout</h3>
                        <p className="text-slate-400 text-sm mb-5">Available balance: <span className="text-green-400 font-bold">₹{affiliate.walletBalance.toLocaleString()}</span></p>
                        <form onSubmit={requestPayout} className="space-y-4">
                            <div>
                                <label className="form-label">Payout Amount (₹)</label>
                                <input type="number" className="form-input" required min={1} max={affiliate.walletBalance} value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} placeholder="Enter amount" />
                            </div>
                            <p className="text-slate-500 text-xs">Processed within 5 business days via bank/UPI on file.</p>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Request</button>
                                <button type="button" onClick={() => setShowPayoutModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AffiliateDashboard, ['affiliate', 'admin']);
