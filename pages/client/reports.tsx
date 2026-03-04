// pages/client/reports.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp, BarChart2, Search } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Client } from '../../lib/store';
import toast from 'react-hot-toast';

const clientNav = [
    { href: '/client', label: 'Dashboard', icon: '📊' },
    { href: '/client/invoices', label: 'Invoices', icon: '💳' },
    { href: '/client/reports', label: 'Reports', icon: '📈' },
    { href: '/client/tickets', label: 'Support', icon: '🎫' },
];

const mockMetrics = [
    { label: 'Organic Sessions', value: '+127%', icon: TrendingUp, color: 'text-green-400', sub: 'vs last month' },
    { label: 'Leads Generated', value: '284', icon: BarChart2, color: 'text-blue-400', sub: 'this month' },
    { label: 'Avg. ROAS', value: '6.8x', icon: BarChart2, color: 'text-cyan-400', sub: 'Google + Meta' },
    { label: 'SEO Ranking', value: '#3', icon: Search, color: 'text-yellow-400', sub: 'primary keyword' },
];

function ClientReports() {
    const { user } = useAuth();
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const clients = getAll<Client>(KEYS.CLIENTS);
        const found = clients.find(c => c.id === user?.entityId);
        setClient(found || null);
    }, [user]);

    if (!client) return (
        <DashboardLayout navItems={clientNav} title="Performance Reports" roleBadge="Client" roleBadgeClass="badge-green">
            <div className="text-center text-slate-400 py-20">No client data found.</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout navItems={clientNav} title="Performance Reports" roleBadge="Client" roleBadgeClass="badge-green">
            <Head><title>Reports – ScalerHouse Client Portal</title></Head>

            {/* Live KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {mockMetrics.map(m => (
                    <div key={m.label} className="stat-card">
                        <m.icon size={20} className={`${m.color} mb-2`} />
                        <div className={`font-syne font-black text-2xl ${m.color}`}>{m.value}</div>
                        <div className="text-white text-sm font-medium">{m.label}</div>
                        <div className="text-slate-500 text-xs">{m.sub}</div>
                    </div>
                ))}
            </div>

            {/* Reports List */}
            <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <FileText size={18} className="text-cyan-400" />
                    <h3 className="font-semibold text-white">Monthly Reports</h3>
                </div>
                {client.reports.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText size={40} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">No reports uploaded yet.</p>
                        <p className="text-slate-600 text-sm mt-1">Your account manager will upload monthly performance reports here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {client.reports.map(r => (
                            <div key={r.id} className="flex items-center justify-between p-5 hover:bg-white/2 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                                        <FileText size={18} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{r.title}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Uploaded: {new Date(r.uploadedAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                                <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={e => { e.preventDefault(); toast.success('Downloading report... (Demo mode)'); }}
                                    className="btn-glow !py-2 !px-4 !text-xs"
                                >
                                    <Download size={13} /> Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default withAuth(ClientReports, ['client']);
