// pages/employee/clients.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Users, FileText } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, KEYS, Employee, Client } from '../../lib/store';

const employeeNav = [
    { href: '/employee', label: 'Dashboard', icon: '📊' },
    { href: '/employee/leads', label: 'My Leads', icon: '🎯' },
    { href: '/employee/clients', label: 'My Clients', icon: '🏢' },
    { href: '/employee/tickets', label: 'Tickets', icon: '🎫' },
];

function EmployeeClients() {
    const { user } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [selected, setSelected] = useState<Client | null>(null);

    useEffect(() => {
        const emps = getAll<Employee>(KEYS.EMPLOYEES);
        const emp = emps.find(e => e.id === user?.entityId);
        if (emp) {
            setEmployee(emp);
            const allClients = getAll<Client>(KEYS.CLIENTS);
            setClients(allClients.filter(c => c.assignedEmployees.includes(emp.id)));
        }
    }, [user]);

    return (
        <DashboardLayout navItems={employeeNav} title="My Clients" roleBadge={employee?.role || 'Employee'} roleBadgeClass="badge-blue">
            <Head><title>My Clients – ScalerHouse</title></Head>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.length === 0 ? (
                    <div className="col-span-3 glass-card p-16 text-center">
                        <Users size={40} className="text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500">No clients assigned yet.</p>
                    </div>
                ) : clients.map(c => (
                    <div
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="glass-card-hover p-5 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-white">{c.name}</h3>
                                <p className="text-slate-400 text-sm">{c.company}</p>
                            </div>
                            <span className={`badge text-xs ${c.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{c.status}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Service</span>
                                <span className="text-slate-300">{c.service}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Invoices</span>
                                <span className="text-cyan-400 font-medium">{c.invoices.length} total</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Timeline progress</span>
                                <span className="text-slate-300">{c.timeline.filter(t => t.status === 'Done').length}/{c.timeline.length} stages</span>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${c.timeline.length ? (c.timeline.filter(t => t.status === 'Done').length / c.timeline.length) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selected.name}</h3>
                                <p className="text-slate-400">{selected.company} · {selected.service}</p>
                            </div>
                            <span className={`badge ${selected.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{selected.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-slate-500 text-xs">Project</p>
                                <p className="text-cyan-400 font-bold text-sm">{selected.projectName || selected.service}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3">
                                <p className="text-slate-500 text-xs">Started</p>
                                <p className="text-white font-medium">{new Date(selected.startDate).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><FileText size={14} className="text-cyan-400" /> Project Timeline</h4>
                        <div className="space-y-2 mb-5">
                            {selected.timeline.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/3">
                                    <p className="text-slate-300 text-sm">{t.title}</p>
                                    <span className={`badge text-xs ${t.status === 'Done' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
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

export default withAuth(EmployeeClients, ['employee', 'admin']);
