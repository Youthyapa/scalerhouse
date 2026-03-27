// pages/client/tickets.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AlertCircle, Plus, MessageCircle, CheckCircle } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, KEYS, Ticket, genId, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const clientNav = [
    { href: '/client', label: 'Dashboard', icon: '📊' },
    { href: '/client/invoices', label: 'Invoices', icon: '💳' },
    { href: '/client/reports', label: 'Reports', icon: '📈' },
    { href: '/client/tickets', label: 'Support', icon: '🎫' },
];

function ClientTickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ subject: '', description: '', priority: 'Medium' as Ticket['priority'] });
    const [selected, setSelected] = useState<Ticket | null>(null);

    const reload = () => {
        const all = getAll<Ticket>(KEYS.TICKETS).filter(t => t.raisedBy === user?.name);
        setTickets(all.reverse());
    };

    useEffect(() => { if (user) reload(); }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const ticket: Ticket = {
            id: genId(), subject: form.subject, description: form.description,
            status: 'Open', priority: form.priority, raisedBy: user?.name || '',
            raisedByRole: 'client',
            messages: [{ id: genId(), from: user?.name || '', message: form.description, timestamp: new Date().toISOString() }],
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };
        addItem<Ticket>(KEYS.TICKETS, ticket);
        logActivity(`Support ticket raised by ${user?.name}: ${form.subject}`, 'Client');
        toast.success('Support ticket submitted!');
        setShowModal(false);
        setForm({ subject: '', description: '', priority: 'Medium' });
        reload();
    };

    const statusBadge = (s: string) => ({ Open: 'badge-yellow', 'In Progress': 'badge-blue', Resolved: 'badge-green', Closed: 'badge-purple' }[s] || 'badge-blue');
    const priorityBadge = (p: string) => ({ High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-blue' }[p] || 'badge-blue');

    return (
        <DashboardLayout navItems={clientNav} title="Support Tickets" roleBadge="Client" roleBadgeClass="badge-green">
            <Head><title>Support – ScalerHouse Client Portal</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Tickets', value: tickets.length, color: 'text-blue-400' },
                    { label: 'Open', value: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length, color: 'text-yellow-400' },
                    { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-green-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`font-syne font-black text-2xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2"><AlertCircle size={16} className="text-cyan-400" /> My Tickets</h3>
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm">
                    <Plus size={14} /> New Ticket
                </button>
            </div>

            {/* Ticket List */}
            <div className="space-y-3">
                {tickets.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <AlertCircle size={40} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">No support tickets yet.</p>
                        <p className="text-slate-600 text-sm mt-1">Need help? Raise a ticket and we'll respond within 4 hours.</p>
                    </div>
                ) : tickets.map(t => (
                    <div
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="glass-card p-5 cursor-pointer hover:border-cyan-400/20 transition-all"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{t.subject}</p>
                                <p className="text-slate-500 text-sm mt-1 truncate">{t.description}</p>
                                <p className="text-slate-600 text-xs mt-2">{new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className={`badge text-xs ${statusBadge(t.status)}`}>{t.status}</span>
                                <span className={`badge text-xs ${priorityBadge(t.priority)}`}>{t.priority}</span>
                            </div>
                        </div>
                        {t.messages.length > 0 && (
                            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
                                <MessageCircle size={12} /> {t.messages.length} message{t.messages.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* New Ticket Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box max-w-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Raise Support Ticket</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Subject *</label>
                                <input className="form-input" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of your issue" />
                            </div>
                            <div>
                                <label className="form-label">Priority</label>
                                <select className="form-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as typeof form.priority })}>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Description *</label>
                                <textarea className="form-input h-28 resize-none" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Provide more details about your issue..." />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center !py-3">Submit Ticket</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ticket Detail Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-syne font-bold text-lg text-white">{selected.subject}</h3>
                                <div className="flex gap-2 mt-2">
                                    <span className={`badge text-xs ${statusBadge(selected.status)}`}>{selected.status}</span>
                                    <span className={`badge text-xs ${priorityBadge(selected.priority)}`}>{selected.priority}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {selected.messages.map(msg => (
                                <div key={msg.id} className={`p-3 rounded-xl text-sm ${msg.from === user?.name ? 'bg-blue-600/20 border border-blue-500/20 ml-4' : 'bg-white/5 mr-4'}`}>
                                    <p className={`font-medium text-xs mb-1 ${msg.from === user?.name ? 'text-blue-400' : 'text-cyan-400'}`}>{msg.from}</p>
                                    <p className="text-slate-300">{msg.message}</p>
                                    <p className="text-slate-600 text-xs mt-1">{new Date(msg.timestamp).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelected(null)} className="btn-outline w-full justify-center">Close</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ClientTickets, ['client', 'admin']);
