// pages/admin/affiliates.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Eye, Wallet } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, Affiliate, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];

function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [selected, setSelected] = useState<Affiliate | null>(null);

    const reload = () => setAffiliates(getAll<Affiliate>(KEYS.AFFILIATES));

    useEffect(() => { reload(); }, []);

    const updateStatus = (id: string, status: Affiliate['status']) => {
        const all = getAll<Affiliate>(KEYS.AFFILIATES);
        const idx = all.findIndex(a => a.id === id);
        if (idx !== -1) { all[idx].status = status; }
        saveAll(KEYS.AFFILIATES, all);
        logActivity(`Affiliate ${status}: ${all[idx]?.name}`, 'Admin');
        toast.success(`Affiliate ${status}`);
        reload();
        if (selected?.id === id) setSelected({ ...selected, status });
    };

    const statusColor = (s: string) => ({ Pending: 'badge-yellow', Approved: 'badge-green', Rejected: 'badge-red' }[s] || 'badge-blue');

    return (
        <DashboardLayout navItems={adminNav} title="Affiliate Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Affiliates – Admin | ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                    { label: 'Total Affiliates', value: affiliates.length },
                    { label: 'Approved', value: affiliates.filter(a => a.status === 'Approved').length },
                    { label: 'Pending Approval', value: affiliates.filter(a => a.status === 'Pending').length },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="font-syne font-black text-3xl gradient-text">{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email / Phone</th>
                            <th>Leads</th>
                            <th>Wallet</th>
                            <th>Status</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {affiliates.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No affiliates yet. Share the registration link!</td></tr>
                        ) : affiliates.map(aff => (
                            <tr key={aff.id}>
                                <td className="font-medium text-white">{aff.name}</td>
                                <td className="text-slate-400 text-sm">{aff.email}<br />{aff.phone}</td>
                                <td className="text-white">{aff.leads.length}</td>
                                <td className="text-green-400 font-medium">₹{aff.walletBalance.toLocaleString()}</td>
                                <td><span className={`badge ${statusColor(aff.status)}`}>{aff.status}</span></td>
                                <td className="text-slate-500 text-xs">{new Date(aff.createdAt).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelected(aff)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                        {aff.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(aff.id, 'Approved')} className="p-1.5 rounded text-green-400 hover:bg-green-400/10"><Check size={14} /></button>
                                                <button onClick={() => updateStatus(aff.id, 'Rejected')} className="p-1.5 rounded text-red-400 hover:bg-red-400/10"><X size={14} /></button>
                                            </>
                                        )}
                                        {aff.status === 'Approved' && (
                                            <button onClick={() => updateStatus(aff.id, 'Rejected')} className="p-1.5 rounded text-red-400 hover:bg-red-400/10"><X size={14} /></button>
                                        )}
                                        {aff.status === 'Rejected' && (
                                            <button onClick={() => updateStatus(aff.id, 'Approved')} className="p-1.5 rounded text-green-400 hover:bg-green-400/10"><Check size={14} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.email}</p>
                            </div>
                            <span className={`badge ${statusColor(selected.status)}`}>{selected.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="stat-card">
                                <Wallet size={18} className="text-cyan-400 mb-2" />
                                <div className="text-2xl font-bold text-green-400">₹{selected.walletBalance.toLocaleString()}</div>
                                <div className="text-slate-400 text-xs">Wallet Balance</div>
                            </div>
                            <div className="stat-card">
                                <div className="text-2xl font-bold text-blue-400">{selected.leads.length}</div>
                                <div className="text-slate-400 text-xs">Leads Submitted</div>
                            </div>
                        </div>
                        <div className="space-y-2 mb-5">
                            {[
                                { l: 'Phone', v: selected.phone },
                                { l: 'PAN', v: selected.pan || 'Not provided' },
                                { l: 'Bank/UPI', v: selected.bank || 'Not provided' },
                                { l: 'Registered', v: new Date(selected.createdAt).toLocaleDateString('en-IN') },
                            ].map(item => (
                                <div key={item.l} className="flex gap-3">
                                    <span className="text-slate-500 text-xs w-20">{item.l}</span>
                                    <span className="text-slate-300 text-sm">{item.v}</span>
                                </div>
                            ))}
                        </div>
                        {selected.payouts.length > 0 && (
                            <div>
                                <p className="text-slate-400 text-xs font-medium mb-2">Payout History</p>
                                {selected.payouts.map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3 mb-2">
                                        <span className="text-slate-300 text-sm">₹{p.amount.toLocaleString()}</span>
                                        <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span>
                                        <span className="text-slate-500 text-xs">{new Date(p.requestedAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-3 mt-5">
                            {selected.status === 'Pending' && (
                                <button onClick={() => updateStatus(selected.id, 'Approved')} className="btn-glow flex-1 justify-center"><Check size={14} /> Approve</button>
                            )}
                            {selected.status !== 'Rejected' && (
                                <button onClick={() => updateStatus(selected.id, 'Rejected')} className="btn-outline flex-1 justify-center !border-red-500/40 !text-red-400">Reject</button>
                            )}
                            <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AffiliatesPage, ['admin']);
