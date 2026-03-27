// pages/employee/leads.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { TrendingUp, Phone, Mail } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, updateItem, KEYS, Employee, Lead, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

import { useEmployeeNav, useEmployeePermission } from '../../lib/employeeNav';

const STATUSES: Lead['status'][] = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

function EmployeeLeads() {
    const { user } = useAuth();
    const navItems = useEmployeeNav();
    const hasAccess = useEmployeePermission('/admin/leads');
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const emps = getAll<Employee>(KEYS.EMPLOYEES);
        const emp = emps.find(e => e.id === user?.entityId);
        if (emp) {
            setEmployee(emp);
            const allLeads = getAll<Lead>(KEYS.LEADS);
            setLeads(allLeads.filter(l => l.assignedTo === emp.id));
        }
    }, [user]);

    const updateStatus = (leadId: string, status: Lead['status']) => {
        updateItem<Lead>(KEYS.LEADS, leadId, { status, updatedAt: new Date().toISOString() });
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
        logActivity(`Lead status updated to ${status} by ${employee?.name}`, 'Employee');
        toast.success(`Status updated to ${status}`);
    };

    const filtered = filter === 'All' ? leads : leads.filter(l => l.status === filter);
    const statusBadge = (s: string) => ({ Won: 'badge-green', New: 'badge-blue', Lost: 'badge-red', Contacted: 'badge-purple', 'Proposal Sent': 'badge-cyan', Negotiation: 'badge-yellow' }[s] || 'badge-blue');

    if (!hasAccess) return (
        <DashboardLayout navItems={navItems} title="My Leads" roleBadge={employee?.role || 'Employee'} roleBadgeClass="badge-blue">
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                <p className="text-slate-400 text-sm max-w-sm">Your role does not include access to Leads. Please contact your administrator to request access.</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout navItems={navItems} title="My Leads" roleBadge={employee?.role || 'Employee'} roleBadgeClass="badge-blue">
            <Head><title>My Leads – ScalerHouse</title></Head>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {['All', ...STATUSES].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`badge cursor-pointer ${filter === s ? 'badge-cyan' : 'badge-blue opacity-50'}`}
                    >
                        {s} {s === 'All' ? `(${leads.length})` : `(${leads.filter(l => l.status === s).length})`}
                    </button>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Lead</th>
                            <th>Service</th>
                            <th>Source</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-500 py-16">
                                <TrendingUp size={32} className="mx-auto mb-3 text-slate-700" />
                                No leads in this category.
                            </td></tr>
                        ) : filtered.map(lead => (
                            <tr key={lead.id}>
                                <td>
                                    <div className="text-white font-medium">{lead.name}</div>
                                    <div className="text-slate-500 text-xs">{lead.company}</div>
                                    <div className="flex gap-3 mt-1">
                                        <a href={`tel:${lead.phone}`} className="text-slate-500 hover:text-cyan-400 transition-colors"><Phone size={12} /></a>
                                        <a href={`mailto:${lead.email}`} className="text-slate-500 hover:text-cyan-400 transition-colors"><Mail size={12} /></a>
                                    </div>
                                </td>
                                <td className="text-slate-300 text-sm">{lead.service}</td>
                                <td className="text-slate-400 text-sm">{lead.source}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${lead.score}%` }} />
                                        </div>
                                        <span className="text-slate-300 text-xs">{lead.score}</span>
                                    </div>
                                </td>
                                <td><span className={`badge text-xs ${statusBadge(lead.status)}`}>{lead.status}</span></td>
                                <td>
                                    <select
                                        value={lead.status}
                                        onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                                        className="form-input !py-1.5 !text-xs !w-auto"
                                    >
                                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(EmployeeLeads, ['employee', 'admin']);
