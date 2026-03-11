// pages/admin/index.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, BarChart2, Award, Activity, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Lead, Client, Affiliate, Employee, ActivityLog } from '../../lib/store';
import { adminNav } from '../../lib/adminNav';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';



const chartData = [
    { month: 'Sep', revenue: 180000, leads: 22 },
    { month: 'Oct', revenue: 250000, leads: 31 },
    { month: 'Nov', revenue: 220000, leads: 28 },
    { month: 'Dec', revenue: 310000, leads: 35 },
    { month: 'Jan', revenue: 290000, leads: 38 },
    { month: 'Feb', revenue: 380000, leads: 52 },
    { month: 'Mar', revenue: 420000, leads: 60 },
];

function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);

    useEffect(() => {
        setLeads(getAll<Lead>(KEYS.LEADS));
        setClients(getAll<Client>(KEYS.CLIENTS));
        setAffiliates(getAll<Affiliate>(KEYS.AFFILIATES));
        setEmployees(getAll<Employee>(KEYS.EMPLOYEES));
        setLogs(getAll<ActivityLog>(KEYS.ACTIVITY).slice(0, 8));
    }, []);

    const wonLeads = leads.filter(l => l.status === 'Won').length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const pendingAffs = affiliates.filter(a => a.status === 'Pending').length;

    const stats = [
        { label: 'Total Leads', value: leads.length, sub: `${newLeads} new`, icon: TrendingUp, color: 'text-blue-400', bg: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/20' },
        { label: 'Active Clients', value: clients.filter(c => c.status === 'Active').length, sub: `${clients.length} total`, icon: Users, color: 'text-cyan-400', bg: 'from-cyan-600/20 to-cyan-900/10', border: 'border-cyan-500/20' },
        { label: 'Affiliates', value: affiliates.filter(a => a.status === 'Approved').length, sub: `${pendingAffs} pending`, icon: Award, color: 'text-purple-400', bg: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/20' },
        { label: 'Team Size', value: employees.filter(e => e.status === 'Active').length, sub: 'active employees', icon: BarChart2, color: 'text-green-400', bg: 'from-green-600/20 to-green-900/10', border: 'border-green-500/20' },
    ];

    return (
        <DashboardLayout navItems={adminNav} title="Admin Dashboard" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Admin Dashboard – ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`glass-card p-5 bg-gradient-to-br ${s.bg} border ${s.border}`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <s.icon size={20} className={s.color} />
                            <span className="text-slate-500 text-xs">{s.sub}</span>
                        </div>
                        <div className={`font-syne font-black text-3xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="grid lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="font-semibold text-white mb-4">Revenue & Leads (6 months)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: '#0f1f3d', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#f1f5f9' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#00d4ff" fill="url(#revGrad)" strokeWidth={2} name="Revenue (₹)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Lead Pipeline Summary */}
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4">Lead Pipeline</h3>
                    {(['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'] as Lead['status'][]).map((status) => {
                        const count = leads.filter(l => l.status === status).length;
                        const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
                        const colors: Record<string, string> = { New: '#60a5fa', Contacted: '#a78bfa', 'Proposal Sent': '#34d399', Negotiation: '#fbbf24', Won: '#4ade80', Lost: '#f87171' };
                        return (
                            <div key={status} className="mb-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">{status}</span>
                                    <span className="text-white font-medium">{count}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${pct}%`, background: colors[status] }} />
                                </div>
                            </div>
                        );
                    })}
                    <Link href="/admin/leads" className="btn-glow w-full justify-center !py-2.5 !text-sm mt-4">
                        View All Leads <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {/* Recent Leads + Activity */}
            <div className="grid lg:grid-cols-2 gap-5">
                {/* Recent Leads */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Recent Leads</h3>
                        <Link href="/admin/leads" className="text-cyan-400 text-xs hover:text-cyan-300">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {leads.slice(-5).reverse().map(lead => (
                            <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-white text-sm font-medium">{lead.name}</p>
                                    <p className="text-slate-500 text-xs">{lead.service} · {lead.source}</p>
                                </div>
                                <span className={`badge ${lead.status === 'Won' ? 'badge-green' : lead.status === 'New' ? 'badge-blue' : lead.status === 'Lost' ? 'badge-red' : 'badge-yellow'} text-xs`}>
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Log */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2"><Activity size={16} className="text-cyan-400" />Activity Log</h3>
                        <Link href="/admin/activity" className="text-cyan-400 text-xs hover:text-cyan-300">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <p className="text-slate-500 text-sm">No recent activity. Fill a form to see logs here.</p>
                        ) : logs.map(log => (
                            <div key={log.id} className="flex gap-3 items-start">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-slate-300 text-sm">{log.message}</p>
                                    <p className="text-slate-600 text-xs">{new Date(log.timestamp).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-5 glass-card p-5">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    {adminNav.slice(1).map((item) => (
                        <Link key={item.href} href={item.href} className="glass-card p-3 flex items-center gap-2 hover:border-cyan-400/20 transition-all text-slate-300 hover:text-white text-sm">
                            <span>{item.icon}</span> {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(AdminDashboard, ['admin']);
