// pages/client/invoices.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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

function ClientInvoices() {
    const { user } = useAuth();
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const clients = getAll<Client>(KEYS.CLIENTS);
        const found = clients.find(c => c.id === user?.entityId);
        setClient(found || null);
    }, [user]);

    const statusIcon = (s: string) => ({
        Paid: <CheckCircle size={14} className="text-green-400" />,
        Pending: <Clock size={14} className="text-yellow-400" />,
        Overdue: <AlertCircle size={14} className="text-red-400" />,
    }[s] || null);

    const statusBadge = (s: string) => ({ Paid: 'badge-green', Pending: 'badge-yellow', Overdue: 'badge-red' }[s] || 'badge-blue');

    const handlePay = (invoiceId: string) => {
        toast.success('Redirecting to payment gateway... (Demo mode)');
    };

    if (!client) return (
        <DashboardLayout navItems={clientNav} title="Invoices" roleBadge="Client" roleBadgeClass="badge-green">
            <div className="text-center text-slate-400 py-20">No client data found.</div>
        </DashboardLayout>
    );

    const paidTotal = client.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    const pendingTotal = client.invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);

    return (
        <DashboardLayout navItems={clientNav} title="Invoices & Payments" roleBadge="Client" roleBadgeClass="badge-green">
            <Head><title>Invoices – ScalerHouse</title></Head>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Invoices', value: client.invoices.length, color: 'text-blue-400' },
                    { label: 'Total Paid', value: `₹${paidTotal.toLocaleString()}`, color: 'text-green-400' },
                    { label: 'Outstanding', value: `₹${pendingTotal.toLocaleString()}`, color: 'text-yellow-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`font-syne font-black text-2xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Invoice List */}
            <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/5 flex items-center gap-2">
                    <CreditCard size={18} className="text-cyan-400" />
                    <h3 className="font-semibold text-white">All Invoices</h3>
                </div>
                {client.invoices.length === 0 ? (
                    <div className="text-center text-slate-500 py-16">No invoices yet.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {client.invoices.map((inv, i) => (
                                <tr key={inv.id}>
                                    <td className="text-slate-400 text-xs font-mono">INV-{String(i + 1).padStart(3, '0')}</td>
                                    <td className="text-white">{inv.description}</td>
                                    <td className="text-white font-semibold">₹{inv.amount.toLocaleString()}</td>
                                    <td className="text-slate-400 text-sm">{new Date(inv.dueDate).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <span className={`badge text-xs flex items-center gap-1 w-fit ${statusBadge(inv.status)}`}>
                                            {statusIcon(inv.status)} {inv.status}
                                        </span>
                                    </td>
                                    <td>
                                        {inv.status !== 'Paid' ? (
                                            <button onClick={() => handlePay(inv.id)} className="btn-glow !py-1.5 !px-3 !text-xs">
                                                Pay Now
                                            </button>
                                        ) : (
                                            <button onClick={() => toast.success('Downloading receipt... (Demo)')} className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs transition-colors">
                                                <Download size={12} /> Receipt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
}

export default withAuth(ClientInvoices, ['client']);
