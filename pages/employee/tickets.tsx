// pages/employee/tickets.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AlertCircle, MessageCircle, CheckCircle } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, updateItem, KEYS, Employee, Ticket, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

import { useEmployeeNav, useEmployeePermission } from '../../lib/employeeNav';

function EmployeeTickets() {
    const { user } = useAuth();
    const navItems = useEmployeeNav();
    const hasAccess = useEmployeePermission('/admin/tickets');
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selected, setSelected] = useState<Ticket | null>(null);

    const reload = () => {
        const emps = getAll<Employee>(KEYS.EMPLOYEES);
        const emp = emps.find(e => e.id === user?.entityId);
        if (emp) {
            setEmployee(emp);
            const allTickets = getAll<Ticket>(KEYS.TICKETS);
            setTickets(allTickets.filter(t => t.assignedTo === emp.id).reverse());
        }
    };

    useEffect(() => { if (user) reload(); }, [user]);

    const resolve = (ticketId: string) => {
        updateItem<Ticket>(KEYS.TICKETS, ticketId, { status: 'Resolved', updatedAt: new Date().toISOString() });
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Resolved' } : t));
        if (selected?.id === ticketId) setSelected(prev => prev ? { ...prev, status: 'Resolved' } : null);
        logActivity(`Ticket resolved by ${employee?.name}`, 'Employee');
        toast.success('Ticket resolved!');
    };

    const statusBadge = (s: string) => ({ Open: 'badge-yellow', 'In Progress': 'badge-blue', Resolved: 'badge-green', Closed: 'badge-purple' }[s] || 'badge-blue');
    const priorityBadge = (p: string) => ({ High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-blue' }[p] || 'badge-blue');

    if (!hasAccess) return (
        <DashboardLayout navItems={navItems} title="Support Tickets" roleBadge={employee?.role || 'Employee'} roleBadgeClass="badge-blue">
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                <p className="text-slate-400 text-sm max-w-sm">Your role does not include access to Tickets. Please contact your administrator to request access.</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout navItems={navItems} title="Support Tickets" roleBadge={employee?.role || 'Employee'} roleBadgeClass="badge-blue">
            <Head><title>Tickets – ScalerHouse</title></Head>

            <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                    { label: 'Total', value: tickets.length, color: 'text-blue-400' },
                    { label: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: 'text-yellow-400' },
                    { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-green-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className={`font-syne font-black text-2xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {tickets.length === 0 ? (
                    <div className="glass-card p-16 text-center">
                        <AlertCircle size={40} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">No tickets assigned.</p>
                    </div>
                ) : tickets.map(t => (
                    <div key={t.id} onClick={() => setSelected(t)} className="glass-card p-5 cursor-pointer hover:border-cyan-400/20 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{t.subject}</p>
                                <p className="text-slate-500 text-sm mt-0.5">From: {t.raisedBy} ({t.raisedByRole})</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                                    <MessageCircle size={11} /> {t.messages.length} messages
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`badge text-xs ${statusBadge(t.status)}`}>{t.status}</span>
                                <span className={`badge text-xs ${priorityBadge(t.priority)}`}>{t.priority}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-syne font-bold text-lg text-white">{selected.subject}</h3>
                                <p className="text-slate-500 text-sm">Raised by: {selected.raisedBy}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`badge text-xs ${statusBadge(selected.status)}`}>{selected.status}</span>
                                <span className={`badge text-xs ${priorityBadge(selected.priority)}`}>{selected.priority}</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            {selected.messages.map(msg => (
                                <div key={msg.id} className="p-3 rounded-xl bg-white/5 text-sm">
                                    <p className="text-cyan-400 text-xs font-medium mb-1">{msg.from}</p>
                                    <p className="text-slate-300">{msg.message}</p>
                                    <p className="text-slate-600 text-xs mt-1">{new Date(msg.timestamp).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {selected.status !== 'Resolved' && (
                                <button onClick={() => resolve(selected.id)} className="btn-glow flex-1 justify-center !py-2.5">
                                    <CheckCircle size={14} /> Mark Resolved
                                </button>
                            )}
                            <button onClick={() => setSelected(null)} className="btn-outline flex-1 justify-center">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(EmployeeTickets, ['employee', 'admin']);
