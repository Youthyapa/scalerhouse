// pages/admin/clients.tsx – Admin Clients Management
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Client } from '../../lib/store';

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

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selected, setSelected] = useState<Client | null>(null);

    useEffect(() => { setClients(getAll<Client>(KEYS.CLIENTS)); }, []);

    return (
        <DashboardLayout navItems={adminNav} title="Clients Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Clients – Admin | ScalerHouse</title></Head>

            <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                    { l: 'Total Clients', v: clients.length },
                    { l: 'Active', v: clients.filter(c => c.status === 'Active').length },
                    { l: 'Completed', v: clients.filter(c => c.status === 'Completed').length },
                ].map(s => (
                    <div key={s.l} className="stat-card">
                        <div className="font-syne font-black text-3xl gradient-text">{s.v}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.l}</div>
                    </div>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr><th>Client</th><th>Company</th><th>Service</th><th>Project</th><th>Status</th><th>Revenue</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {clients.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No clients yet.</td></tr>
                        ) : clients.map(c => (
                            <tr key={c.id}>
                                <td><div className="font-medium text-white">{c.name}</div><div className="text-slate-500 text-xs">{c.email}</div></td>
                                <td className="text-slate-300">{c.company}</td>
                                <td className="text-slate-400 text-sm">{c.service}</td>
                                <td className="text-slate-400 text-sm">{c.projectName}</td>
                                <td><span className={`badge ${c.status === 'Active' ? 'badge-green' : c.status === 'Completed' ? 'badge-blue' : 'badge-yellow'}`}>{c.status}</span></td>
                                <td className="text-green-400 font-medium">
                                    ₹{c.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                                </td>
                                <td>
                                    <button onClick={() => setSelected(c)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.company} · {selected.service}</p>
                            </div>
                            <span className={`badge ${selected.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>{selected.status}</span>
                        </div>
                        <h4 className="text-slate-400 text-xs font-medium mb-2">TIMELINE</h4>
                        <div className="space-y-2 mb-4">
                            {selected.timeline.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-white/3">
                                    <span className="text-slate-300 text-sm">{t.title}</span>
                                    <span className={`badge text-xs ${t.status === 'Done' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
                                </div>
                            ))}
                        </div>
                        <h4 className="text-slate-400 text-xs font-medium mb-2">INVOICES</h4>
                        <div className="space-y-2">
                            {selected.invoices.map(inv => (
                                <div key={inv.id} className="flex justify-between p-2 rounded-lg bg-white/3">
                                    <span className="text-slate-300 text-sm">{inv.description}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">₹{inv.amount.toLocaleString()}</span>
                                        <span className={`badge text-xs ${inv.status === 'Paid' ? 'badge-green' : inv.status === 'Pending' ? 'badge-yellow' : 'badge-red'}`}>{inv.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelected(null)} className="btn-outline w-full justify-center !py-2.5 mt-5">Close</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ClientsPage, ['admin']);
