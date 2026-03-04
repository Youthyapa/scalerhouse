// pages/affiliate/wallet.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, ArrowDownToLine, Clock } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Affiliate, Lead } from '../../lib/store';
import toast from 'react-hot-toast';

const affNav = [
    { href: '/affiliate/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/affiliate/leads', label: 'My Leads', icon: '🎯' },
    { href: '/affiliate/wallet', label: 'Wallet', icon: '💰' },
];

function AffiliateWallet() {
    const { user } = useAuth();
    const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const all = getAll<Affiliate>(KEYS.AFFILIATES);
        const aff = all.find(a => a.id === user?.entityId);
        setAffiliate(aff || null);
        if (aff) {
            setLeads(getAll<Lead>(KEYS.LEADS).filter(l => aff.leads.includes(l.id)));
        }
    }, [user]);

    const requestPayout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!affiliate) return;
        const val = parseFloat(amount);
        if (val > affiliate.walletBalance) { toast.error('Insufficient balance'); return; }
        const payout = { id: Date.now().toString(), amount: val, status: 'Requested' as const, requestedAt: new Date().toISOString() };
        const allAffs = getAll<Affiliate>(KEYS.AFFILIATES);
        const idx = allAffs.findIndex(a => a.id === affiliate.id);
        if (idx !== -1) {
            allAffs[idx].payouts.push(payout);
            allAffs[idx].walletBalance -= val;
            const { saveAll } = require('../../lib/store');
            saveAll(KEYS.AFFILIATES, allAffs);
            setAffiliate(allAffs[idx]);
        }
        toast.success('Payout requested! Processed within 5 business days.');
        setShowModal(false);
        setAmount('');
    };

    if (!affiliate) return (
        <DashboardLayout navItems={affNav} title="Wallet" roleBadge="Affiliate" roleBadgeClass="badge-purple">
            <div className="text-center text-slate-400 py-20">No affiliate data found.</div>
        </DashboardLayout>
    );

    const wonLeads = leads.filter(l => l.status === 'Won').length;
    const totalEarned = affiliate.payouts.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
    const pendingPayout = affiliate.payouts.filter(p => p.status === 'Requested').reduce((s, p) => s + p.amount, 0);

    return (
        <DashboardLayout navItems={affNav} title="Wallet & Payouts" roleBadge="Affiliate" roleBadgeClass="badge-purple">
            <Head><title>Wallet – Affiliate | ScalerHouse</title></Head>

            {/* Balance Card */}
            <div className="glass-card p-8 mb-6 bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 text-center">
                <Wallet size={32} className="text-purple-400 mx-auto mb-3" />
                <div className="font-syne font-black text-5xl gradient-text mb-2">₹{affiliate.walletBalance.toLocaleString()}</div>
                <div className="text-slate-400 mb-6">Available Balance</div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={affiliate.walletBalance === 0}
                    className="btn-glow !py-3 !px-8 disabled:opacity-40"
                >
                    <ArrowDownToLine size={16} /> Request Payout
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Deals Won', value: wonLeads, color: 'text-green-400' },
                    { label: 'Total Earned', value: `₹${totalEarned.toLocaleString()}`, color: 'text-cyan-400' },
                    { label: 'Pending Payout', value: `₹${pendingPayout.toLocaleString()}`, color: 'text-yellow-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card text-center">
                        <div className={`font-syne font-black text-2xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Commission Info */}
            <div className="glass-card p-5 mb-5 bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-500/10">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-green-400" />
                    <h3 className="font-semibold text-white">Commission Structure</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                    {[
                        { tier: 'Starter (1-5 deals)', rate: '10%', color: 'badge-blue' },
                        { tier: 'Silver (6-15 deals)', rate: '12%', color: 'badge-purple' },
                        { tier: 'Gold (16+ deals)', rate: '15%', color: 'badge-yellow' },
                    ].map(t => (
                        <div key={t.tier} className="text-center p-3 rounded-xl bg-white/5">
                            <span className={`badge ${t.color} text-xs`}>{t.tier}</span>
                            <div className="font-syne font-black text-2xl text-green-400 mt-2">{t.rate}</div>
                            <div className="text-slate-500 text-xs">of deal value</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payout History */}
            <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <Clock size={16} className="text-cyan-400" />
                    <h3 className="font-semibold text-white">Payout History</h3>
                </div>
                {affiliate.payouts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No payout requests yet.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Requested On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliate.payouts.map(p => (
                                <tr key={p.id}>
                                    <td className="text-white font-semibold">₹{p.amount.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge text-xs ${p.status === 'Paid' ? 'badge-green' : p.status === 'Processing' ? 'badge-blue' : 'badge-yellow'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="text-slate-400 text-sm">{new Date(p.requestedAt).toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Payout Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box max-w-sm" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-2">Request Payout</h3>
                        <p className="text-slate-400 text-sm mb-5">
                            Available: <span className="text-green-400 font-bold">₹{affiliate.walletBalance.toLocaleString()}</span>
                        </p>
                        <form onSubmit={requestPayout} className="space-y-4">
                            <div>
                                <label className="form-label">Amount (₹)</label>
                                <input type="number" className="form-input" required min={1} max={affiliate.walletBalance} value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" />
                            </div>
                            <p className="text-slate-500 text-xs">Processed within 5 business days to your registered bank/UPI account.</p>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Request</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AffiliateWallet, ['affiliate']);
