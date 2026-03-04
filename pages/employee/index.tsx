// pages/employee/index.tsx – Employee Dashboard
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, Employee, Lead, Client, Ticket, updateItem, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const employeeNav = [
    { href: '/employee', label: 'Dashboard', icon: '📊' },
    { href: '/employee/leads', label: 'My Leads', icon: '🎯' },
    { href: '/employee/clients', label: 'My Clients', icon: '🏢' },
    { href: '/employee/tickets', label: 'Tickets', icon: '🎫' },
];

function EmployeeDashboard() {
    const { user } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const emps = getAll<Employee>(KEYS.EMPLOYEES);
        const emp = emps.find(e => e.id === user?.entityId);
        if (!emp) return;
        setEmployee(emp);

        const allLeads = getAll<Lead>(KEYS.LEADS);
        setLeads(allLeads.filter(l => l.assignedTo === emp.id));

        const allClients = getAll<Client>(KEYS.CLIENTS);
        setClients(allClients.filter(c => c.assignedEmployees.includes(emp.id)));

        const allTickets = getAll<Ticket>(KEYS.TICKETS);
        setTickets(allTickets.filter(t => t.assignedTo === emp.id));
    }, [user]);

    const updateTaskStatus = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Done') => {
        if (!employee) return;
        const emps = getAll<Employee>(KEYS.EMPLOYEES);
        const idx = emps.findIndex(e => e.id === employee.id);
        if (idx !== -1) {
            const tIdx = emps[idx].tasks.findIndex(t => t.id === taskId);
            if (tIdx !== -1) emps[idx].tasks[tIdx].status = newStatus;
            saveAll(KEYS.EMPLOYEES, emps);
            setEmployee(emps[idx]);
            toast.success('Task updated!');
        }
    };

    if (!employee) return (
        <DashboardLayout navItems={employeeNav} title="Employee Dashboard" roleBadge="Employee" roleBadgeClass="badge-blue">
            <div className="text-center text-slate-400 py-20">Employee data not found. Contact your HR manager.</div>
        </DashboardLayout>
    );

    const doneTasks = employee.tasks.filter(t => t.status === 'Done').length;
    const pendingTasks = employee.tasks.filter(t => t.status === 'Pending').length;

    return (
        <DashboardLayout navItems={employeeNav} title="Employee Dashboard" roleBadge={employee.role} roleBadgeClass="badge-blue">
            <Head><title>Employee Dashboard – ScalerHouse</title></Head>

            {/* Welcome */}
            <div className="glass-card p-5 mb-5 bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/10">
                <h2 className="font-syne font-bold text-xl text-white">Good day, {employee.name}!</h2>
                <p className="text-slate-400 text-sm">{employee.role} · {employee.department}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                    <span className="badge badge-green">Performance: {employee.performanceScore}%</span>
                    <span className="badge badge-blue">{leads.length} Assigned Leads</span>
                    <span className="badge badge-cyan">{clients.length} Assigned Clients</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {[
                    { label: 'My Leads', value: leads.length, icon: TrendingUp, color: 'text-blue-400' },
                    { label: 'My Clients', value: clients.length, icon: Users, color: 'text-cyan-400' },
                    { label: 'Open Tickets', value: tickets.filter(t => t.status === 'Open').length, icon: AlertCircle, color: 'text-yellow-400' },
                    { label: 'Tasks Done', value: doneTasks, icon: CheckCircle, color: 'text-green-400' },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <s.icon size={20} className={`${s.color} mb-2`} />
                        <div className={`font-syne font-black text-3xl ${s.color}`}>{s.value}</div>
                        <div className="text-slate-400 text-sm">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                {/* My Tasks */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-cyan-400" />My Tasks</h3>
                    {employee.tasks.length === 0 ? (
                        <p className="text-slate-500 text-sm">No tasks assigned yet.</p>
                    ) : employee.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 mb-2">
                            <div>
                                <p className="text-white text-sm font-medium">{task.title}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className={`badge text-xs ${task.priority === 'High' ? 'badge-red' : task.priority === 'Medium' ? 'badge-yellow' : 'badge-blue'}`}>{task.priority}</span>
                                    {task.dueDate && <span className="text-slate-500 text-xs">{new Date(task.dueDate).toLocaleDateString('en-IN')}</span>}
                                </div>
                            </div>
                            <select
                                value={task.status}
                                onChange={e => updateTaskStatus(task.id, e.target.value as typeof task.status)}
                                className={`badge cursor-pointer bg-transparent border-0 focus:outline-none text-xs ${task.status === 'Done' ? 'badge-green' : task.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    ))}
                </div>

                {/* Assigned Leads */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-cyan-400" />My Leads</h3>
                    {leads.length === 0 ? (
                        <p className="text-slate-500 text-sm">No leads assigned.</p>
                    ) : leads.map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 mb-2">
                            <div>
                                <p className="text-white text-sm font-medium">{lead.name}</p>
                                <p className="text-slate-500 text-xs">{lead.service} · {lead.company}</p>
                            </div>
                            <div className="text-right">
                                <span className={`badge text-xs ${lead.status === 'Won' ? 'badge-green' : lead.status === 'New' ? 'badge-blue' : 'badge-yellow'}`}>{lead.status}</span>
                                <p className="text-slate-500 text-xs mt-1">Score: {lead.score}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Assigned Clients */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Users size={16} className="text-cyan-400" />My Clients</h3>
                    {clients.length === 0 ? (
                        <p className="text-slate-500 text-sm">No clients assigned.</p>
                    ) : clients.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 mb-2">
                            <div>
                                <p className="text-white text-sm font-medium">{c.name}</p>
                                <p className="text-slate-500 text-xs">{c.company} · {c.service}</p>
                            </div>
                            <span className={`badge text-xs ${c.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>{c.status}</span>
                        </div>
                    ))}
                </div>

                {/* My Tickets */}
                <div className="glass-card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertCircle size={16} className="text-cyan-400" />Assigned Tickets</h3>
                    {tickets.length === 0 ? (
                        <p className="text-slate-500 text-sm">No tickets assigned.</p>
                    ) : tickets.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-white/3 mb-2">
                            <div className="flex justify-between mb-1">
                                <p className="text-white text-sm font-medium">{t.subject}</p>
                                <span className={`badge text-xs ${t.status === 'Open' ? 'badge-yellow' : t.status === 'Resolved' ? 'badge-green' : 'badge-blue'}`}>{t.status}</span>
                            </div>
                            <p className="text-slate-500 text-xs">From: {t.raisedBy} · {new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(EmployeeDashboard, ['employee']);
