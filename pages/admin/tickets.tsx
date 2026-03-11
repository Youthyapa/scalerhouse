// pages/admin/tickets.tsx – Admin Ticket Management
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, Ticket } from '../../lib/store';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selected, setSelected] = useState<Ticket | null>(null);

    const reload = () => setTickets(getAll<Ticket>(KEYS.TICKETS));
    useEffect(() => { reload(); }, []);

    const updateStatus = (id: string, status: Ticket['status']) => {
        const all = getAll<Ticket>(KEYS.TICKETS);
        const idx = all.findIndex(t => t.id === id);
        if (idx !== -1) { all[idx].status = status; all[idx].updatedAt = new Date().toISOString(); }
        saveAll(KEYS.TICKETS, all);
        toast.success(`Ticket ${status}`);
        reload();
        if (selected?.id === id) setSelected({ ...selected, status });
    };

    const statusColor = (s: string) => ({ Open: 'badge-yellow', 'In Progress': 'badge-blue', Resolved: 'badge-green', Closed: 'badge-red' }[s] || 'badge-blue');
    const priorityColor = (p: string) => ({ High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' }[p] || 'badge-blue');

    return (
        <DashboardLayout navItems={adminNav} title="Support Tickets" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Tickets – Admin | ScalerHouse</title></Head>

            <div className="flex flex-wrap gap-3 mb-5">
                {(['Open', 'In Progress', 'Resolved', 'Closed'] as Ticket['status'][]).map(s => (
                    <div key={s} className="stat-card !p-3 text-center flex-1 min-w-24">
                        <div className="font-bold text-xl text-white">{tickets.filter(t => t.status === s).length}</div>
                        <span className={`badge text-xs mt-1 ${statusColor(s)}`}>{s}</span>
                    </div>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr><th>Subject</th><th>Raised By</th><th>Role</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No tickets yet.</td></tr>
                        ) : tickets.map(t => (
                            <tr key={t.id}>
                                <td><button className="font-medium text-white hover:text-cyan-400 text-left" onClick={() => setSelected(t)}>{t.subject}</button></td>
                                <td className="text-slate-300 text-sm">{t.raisedBy}</td>
                                <td><span className={`badge text-xs ${t.raisedByRole === 'client' ? 'badge-green' : t.raisedByRole === 'affiliate' ? 'badge-purple' : 'badge-blue'}`}>{t.raisedByRole}</span></td>
                                <td><span className={`badge text-xs ${priorityColor(t.priority)}`}>{t.priority}</span></td>
                                <td>
                                    <select value={t.status} onChange={e => updateStatus(t.id, e.target.value as Ticket['status'])} className={`badge cursor-pointer bg-transparent border-0 focus:outline-none text-xs ${statusColor(t.status)}`}>
                                        {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td className="text-slate-500 text-xs">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                                <td><button onClick={() => setSelected(t)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 text-xs">View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-syne font-bold text-xl text-white">{selected.subject}</h3>
                            <div className="flex gap-2">
                                <span className={`badge ${priorityColor(selected.priority)}`}>{selected.priority}</span>
                                <span className={`badge ${statusColor(selected.status)}`}>{selected.status}</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">From: {selected.raisedBy} ({selected.raisedByRole})</p>
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                            <p className="text-slate-300 text-sm">{selected.description}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-slate-400 text-xs font-medium mb-2">CONVERSATION</p>
                            {selected.messages.map(m => (
                                <div key={m.id} className="bg-white/3 rounded-lg p-3 mb-2">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-cyan-400 text-xs font-medium">{m.from}</span>
                                        <span className="text-slate-600 text-xs">{new Date(m.timestamp).toLocaleString('en-IN')}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{m.message}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {selected.status !== 'Resolved' && (
                                <button onClick={() => updateStatus(selected.id, 'Resolved')} className="btn-glow flex-1 justify-center !py-2.5 !text-sm">Mark Resolved</button>
                            )}
                            <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(TicketsPage, ['admin']);
