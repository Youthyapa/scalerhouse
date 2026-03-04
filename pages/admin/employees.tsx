// pages/admin/employees.tsx – Admin Employee Management
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, KEYS, Employee, genId, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];

const roles: Employee['role'][] = ['Sales Executive', 'Digital Marketing Executive', 'SEO Specialist', 'Ads Manager', 'HR Manager', 'Accounts Manager'];
const emptyEmp = { name: '', email: '', phone: '', role: 'Sales Executive' as Employee['role'], department: 'Sales' };

function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Employee | null>(null);
    const [form, setForm] = useState(emptyEmp);

    const reload = () => setEmployees(getAll<Employee>(KEYS.EMPLOYEES));
    useEffect(() => { reload(); }, []);

    const handleAdd = () => {
        const emp: Employee = {
            id: genId(), ...form,
            assignedLeads: [], assignedClients: [], tasks: [],
            status: 'Active', joinedAt: new Date().toISOString().slice(0, 10), performanceScore: 75,
        };
        addItem<Employee>(KEYS.EMPLOYEES, emp);
        logActivity(`Employee added: ${form.name} (${form.role})`, 'Admin');
        toast.success('Employee added!');
        setShowModal(false);
        setForm(emptyEmp);
        reload();
    };

    const roleColor = (r: string) => {
        const m: Record<string, string> = { 'Sales Executive': 'badge-blue', 'SEO Specialist': 'badge-green', 'Ads Manager': 'badge-cyan', 'HR Manager': 'badge-purple', 'Accounts Manager': 'badge-yellow', Admin: 'badge-red' };
        return m[r] || 'badge-blue';
    };

    return (
        <DashboardLayout navItems={adminNav} title="Employee Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Employees – Admin | ScalerHouse</title></Head>

            <div className="flex justify-end mb-5">
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm"><Plus size={15} /> Add Employee</button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr><th>Employee</th><th>Role</th><th>Department</th><th>Leads</th><th>Clients</th><th>Score</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td><div className="font-medium text-white">{emp.name}</div><div className="text-slate-500 text-xs">{emp.email}</div></td>
                                <td><span className={`badge text-xs ${roleColor(emp.role)}`}>{emp.role}</span></td>
                                <td className="text-slate-400 text-sm">{emp.department}</td>
                                <td className="text-white">{emp.assignedLeads.length}</td>
                                <td className="text-white">{emp.assignedClients.length}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="progress-bar w-16"><div className="progress-fill" style={{ width: `${emp.performanceScore}%` }} /></div>
                                        <span className="text-white text-xs">{emp.performanceScore}%</span>
                                    </div>
                                </td>
                                <td><span className={`badge text-xs ${emp.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{emp.status}</span></td>
                                <td>
                                    <button onClick={() => setSelected(emp)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Add Employee</h3>
                        <div className="space-y-4">
                            <div><label className="form-label">Full Name</label><input className="form-input !text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Employee Name" /></div>
                            <div><label className="form-label">Email (login)</label><input type="email" className="form-input !text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@scalerhouse.com" /></div>
                            <div><label className="form-label">Phone</label><input className="form-input !text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX" /></div>
                            <div>
                                <label className="form-label">Role</label>
                                <select className="form-input !text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as Employee['role'] })}>
                                    {roles.map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div><label className="form-label">Department</label><input className="form-input !text-sm" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
                            <div className="flex gap-3">
                                <button onClick={handleAdd} className="btn-glow flex-1 justify-center !py-3">Add Employee</button>
                                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-1">{selected.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">{selected.role} · {selected.department}</p>
                        <div className="space-y-2 mb-4">
                            {[{ l: 'Email', v: selected.email }, { l: 'Phone', v: selected.phone }, { l: 'Joined', v: new Date(selected.joinedAt).toLocaleDateString('en-IN') }].map(i => (
                                <div key={i.l} className="flex gap-4"><span className="text-slate-500 text-xs w-16">{i.l}</span><span className="text-slate-300 text-sm">{i.v}</span></div>
                            ))}
                        </div>
                        <h4 className="text-slate-400 text-xs mb-2">TASK SUMMARY</h4>
                        <div className="flex gap-3 mb-4">
                            {(['Pending', 'In Progress', 'Done'] as const).map(s => (
                                <div key={s} className="stat-card !p-3 text-center flex-1">
                                    <div className="text-xl font-bold text-white">{selected.tasks.filter(t => t.status === s).length}</div>
                                    <div className="text-slate-500 text-xs">{s}</div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelected(null)} className="btn-outline w-full justify-center !py-2.5">Close</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(EmployeesPage, ['admin']);
