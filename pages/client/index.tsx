// pages/client/index.tsx – Client Portal Dashboard
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Client, Ticket, addItem, genId, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const clientNav = [
    { href: '/client', label: 'Dashboard', icon: '📊' },
    { href: '/client/invoices', label: 'Invoices', icon: '💳' },
    { href: '/client/reports', label: 'Reports', icon: '📈' },
    { href: '/client/tickets', label: 'Support', icon: '🎫' },
];

function ClientDashboard() {
    const { user } = useAuth();
    const [client, setClient] = useState<Client | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketForm, setTicketForm] = useState({ subject: '', description: '' });
    const [showTicketModal, setShowTicketModal] = useState(false);

    useEffect(() => {
        const clients = getAll<Client>(KEYS.CLIENTS);
        const found = clients.find(c => c.id === user?.entityId);
        setClient(found || null);
        const allTickets = getAll<Ticket>(KEYS.TICKETS).filter(t => t.raisedBy === user?.name);
        setTickets(allTickets);
    }, [user]);

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ticket: Ticket = {
            id: genId(), subject: ticketForm.subject, description: ticketForm.description,
            status: 'Open', priority: 'Medium', raisedBy: user?.name || '',
            raisedByRole: 'client', messages: [{ id: genId(), from: user?.name || '', message: ticketForm.description, timestamp: new Date().toISOString() }],
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        addItem<Ticket>(KEYS.TICKETS, ticket);
        logActivity(`Ticket raised by ${user?.name}: ${ticketForm.subject}`, 'Client');
        toast.success('Support ticket submitted!');
        setShowTicketModal(false);
        setTicketForm({ subject: '', description: '' });
        setTickets(prev => [...prev, ticket]);
    };

    const invoiceStatusColor = (s: string) => ({ Paid: 'badge-green', Pending: 'badge-yellow', Overdue: 'badge-red' }[s] || 'badge-blue');
    const tlColor = (s: string) => ({ Done: 'text-green-400', 'In Progress': 'text-blue-400', Pending: 'text-slate-500' }[s] || '');

    if (!client) return (
        <DashboardLayout navItems={clientNav} title="Client Portal" roleBadge="Client" roleBadgeClass="badge-green">
            <div className="text-center text-slate-400 py-20">No project data found. Please contact your account manager.</div>
        </DashboardLayout>
    );

    const paidTotal = client.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    const pendingTotal = client.invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);

    return (
        <DashboardLayout navItems={clientNav} title="Client Portal" roleBadge="Client" roleBadgeClass="badge-green">
            <Head><title>Client Portal – ScalerHouse</title></Head>

            {/* Welcome */}
            <div className="glass-card p-6 mb-5 bg-gradient-to-br from-blue-900/30 to-cyan-900/10 border border-cyan-400/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="font-syne font-bold text-2xl text-white">Welcome, {user?.name}!</h2>
                        <p className="text-slate-400">{client.projectName}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`badge ${client.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{client.status}</span>
                            <span className="text-slate-500 text-xs">Started {new Date(client.startDate).toLocaleDateString('en-IN')}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="stat-card !p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">₹{paidTotal.toLocaleString()}</div>
                            <div className="text-slate-400 text-xs">Total Paid</div>
                        </div>
                        <div className="stat-card !p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-400">₹{pendingTotal.toLocaleString()}</div>
                            <div className="text-slate-400 text-xs">Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5 mb-5">
                {/* Project Timeline */}
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4">Project Timeline</h3>
                    <div className="space-y-3">
                        {client.timeline.map((item, i) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.status === 'Done' ? 'bg-green-500/20 text-green-400' : item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                                        {item.status === 'Done' ? <CheckCircle size={14} /> : item.status === 'In Progress' ? <Activity size={14} /> : <Clock size={14} />}
                                    </div>
                                    {i < client.timeline.length - 1 && <div className="w-px flex-1 bg-white/5 mt-1 min-h-[20px]" />}
                                </div>
                                <div className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-medium ${item.status === 'Done' ? 'text-green-400' : item.status === 'In Progress' ? 'text-white' : 'text-slate-500'}`}>{item.title}</p>
                                        <span className={`badge text-xs ${item.status === 'Done' ? 'badge-green' : item.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{item.status}</span>
                                    </div>
                                    <p className="text-slate-500 text-xs">{item.description}</p>
                                    <p className="text-slate-600 text-xs">{new Date(item.date).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invoice Summary */}
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4">Invoices</h3>
                    <div className="space-y-3">
                        {client.invoices.map(inv => (
                            <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                                <div>
                                    <p className="text-white text-sm">{inv.description}</p>
                                    <p className="text-slate-500 text-xs">Due: {new Date(inv.dueDate).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-semibold">₹{inv.amount.toLocaleString()}</p>
                                    <span className={`badge ${invoiceStatusColor(inv.status)} text-xs`}>{inv.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reports + Tickets */}
            <div className="grid lg:grid-cols-2 gap-5">
                <div className="glass-card p-6">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FileText size={16} className="text-cyan-400" />Reports</h3>
                    {client.reports.length === 0 ? (
                        <p className="text-slate-500 text-sm">No reports uploaded yet.</p>
                    ) : client.reports.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 mb-2">
                            <div>
                                <p className="text-white text-sm">{r.title}</p>
                                <p className="text-slate-500 text-xs">{new Date(r.uploadedAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <a href={r.url} className="btn-glow !py-1.5 !px-3 !text-xs">Download</a>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2"><AlertCircle size={16} className="text-cyan-400" />Support Tickets</h3>
                        <button onClick={() => setShowTicketModal(true)} className="btn-glow !py-1.5 !px-3 !text-xs">New Ticket</button>
                    </div>
                    {tickets.length === 0 ? (
                        <p className="text-slate-500 text-sm">No tickets. Need help? Raise a support ticket.</p>
                    ) : tickets.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-white/3 mb-2">
                            <div className="flex justify-between mb-1">
                                <p className="text-white text-sm font-medium">{t.subject}</p>
                                <span className={`badge text-xs ${t.status === 'Open' ? 'badge-yellow' : t.status === 'Resolved' ? 'badge-green' : 'badge-blue'}`}>{t.status}</span>
                            </div>
                            <p className="text-slate-500 text-xs">{new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showTicketModal && (
                <div className="modal-overlay" onClick={() => setShowTicketModal(false)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-4">Raise Support Ticket</h3>
                        <form onSubmit={handleTicketSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Subject</label>
                                <input className="form-input !text-sm" required value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Briefly describe your issue" />
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea className="form-input !h-28 resize-none !text-sm" required value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} placeholder="Provide more details..." />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Submit Ticket</button>
                                <button type="button" onClick={() => setShowTicketModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ClientDashboard, ['client', 'admin']);
