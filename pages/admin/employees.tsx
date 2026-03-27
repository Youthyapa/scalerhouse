// pages/admin/employees.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Eye, MailCheck, Edit2, Trash2 } from 'lucide-react';
import { withAuth, useAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';

function EmployeesPage() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const emptyForm = { name: '', email: '', phone: '', role: '', department: '' };
    const [form, setForm] = useState(emptyForm);

    const loadData = async () => {
        setLoading(true);
        try {
            const [empRes, roleRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/roles')
            ]);
            const empData = await empRes.json();
            const roleData = await roleRes.json();
            
            if (!empRes.ok) {
                toast.error(empData.error || 'Failed to load employees');
                setEmployees([]);
                setRoles([]);
            } else {
                setEmployees(Array.isArray(empData) ? empData : []);
                setRoles(Array.isArray(roleData) ? roleData : []);
                if (Array.isArray(roleData) && roleData.length > 0) setForm(f => ({ ...f, role: roleData[0]._id }));
            }
        } catch (err) {
            toast.error('Failed to load data');
            setEmployees([]);
            setRoles([]);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleAddOrEdit = async () => {
        if (!form.name || !form.email || !form.role) return toast.error('Name, email, and role are required');
        
        setSaving(true);
        try {
            const url = isEditing ? `/api/employees/${isEditing}` : '/api/employees';
            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(isEditing ? 'Employee updated' : 'Employee created & welcome email sent!');
                setShowModal(false);
                setForm(emptyForm);
                setIsEditing(null);
                loadData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Operation failed');
            }
        } catch (err) {
            toast.error('Network error');
        }
        setSaving(false);
    };

    const handleDelete = async (emp: any) => {
        if (!confirm(`Are you sure you want to delete ${emp.name}?`)) return;
        try {
            const res = await fetch(`/api/employees/${emp._id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Employee deleted');
                loadData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete');
            }
        } catch (err) {
            toast.error('Network error');
        }
    };

    const openEdit = (emp: any) => {
        setForm({ name: emp.name, email: emp.email, phone: emp.phone || '', role: emp.role, department: emp.department || '' });
        setIsEditing(emp._id);
        setShowModal(true);
    };

    const openCreate = () => {
        setForm(emptyForm);
        if (roles.length > 0) setForm(f => ({ ...f, role: roles[0]._id }));
        setIsEditing(null);
        setShowModal(true);
    };

    const roleColor = (roleName: string) => {
        if (!roleName) return 'badge-blue';
        const str = roleName.toLowerCase();
        if (str.includes('admin')) return 'badge-red';
        if (str.includes('seo') || str.includes('content')) return 'badge-green';
        if (str.includes('ads') || str.includes('marketing')) return 'badge-cyan';
        if (str.includes('hr')) return 'badge-purple';
        if (str.includes('account')) return 'badge-yellow';
        return 'badge-blue';
    };

    // Quick check if current logged in user has 'admin' in their explicit role to allow creating employees
    // In a full RBAC model, this would check permissions, but since Super Admin is the only one who can add for now:
    const canAddEmployee = user?.role === 'admin' || user?.roleName === 'Admin';

    return (
        <DashboardLayout navItems={adminNav} title="Employee Management" roleBadge={user?.roleName || 'Employee'} roleBadgeClass={roleColor(user?.roleName || '')}>
            <Head><title>Employees – Admin | ScalerHouse</title></Head>

            <div className="flex justify-between items-center mb-5">
                <p className="text-slate-400 text-sm">Manage team members and their assignments.</p>
                {canAddEmployee && (
                    <button onClick={openCreate} className="btn-glow !py-2 !px-4 !text-sm"><Plus size={15} /> Add Employee</button>
                )}
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading employees...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr><th>Employee</th><th>Role</th><th>Department</th><th>Leads</th><th>Clients</th><th>Score</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp._id}>
                                    <td>
                                        <div className="font-medium text-white">{emp.name}</div>
                                        <div className="text-slate-500 text-xs">{emp.email}</div>
                                    </td>
                                    <td><span className={`badge text-xs ${roleColor(emp.roleName)}`}>{emp.roleName || emp.role}</span></td>
                                    <td className="text-slate-400 text-sm">{emp.department || '-'}</td>
                                    <td className="text-white">{(emp.assignedLeads || []).length}</td>
                                    <td className="text-white">{(emp.assignedClients || []).length}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="progress-bar w-16"><div className="progress-fill" style={{ width: `${emp.performanceScore || 0}%` }} /></div>
                                            <span className="text-white text-xs">{emp.performanceScore || 0}%</span>
                                        </div>
                                    </td>
                                    <td><span className={`badge text-xs ${emp.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{emp.status || 'Active'}</span></td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => setSelected(emp)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                            {canAddEmployee && (
                                                <>
                                                    <button onClick={() => openEdit(emp)} className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"><Edit2 size={14} /></button>
                                                    <button onClick={() => handleDelete(emp)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-8 text-slate-400">No employees found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-2">{isEditing ? 'Edit Employee' : 'Add Employee'}</h3>
                        {!isEditing && <p className="text-slate-400 text-xs mb-5 flex items-center gap-1"><MailCheck size={12}/> An automatic welcome email with login credentials will be sent.</p>}
                        
                        <div className="space-y-4 pt-2">
                            <div><label className="form-label">Full Name</label><input className="form-input !text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Employee Name" disabled={saving}/></div>
                            <div><label className="form-label">Email (login)</label><input type="email" className="form-input !text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@scalerhouse.com" disabled={saving}/></div>
                            <div><label className="form-label">Phone</label><input className="form-input !text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX" disabled={saving}/></div>
                            <div>
                                <label className="form-label">Role</label>
                                <select className="form-input !text-sm" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} disabled={saving}>
                                    {roles.length === 0 && <option value="">No roles defined</option>}
                                    {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div><label className="form-label">Department</label><input className="form-input !text-sm" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} disabled={saving}/></div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={handleAddOrEdit} disabled={saving} className="btn-glow flex-1 justify-center !py-3">
                                    {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Employee')}
                                </button>
                                <button onClick={() => setShowModal(false)} disabled={saving} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-1">{selected.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">{selected.roleName || selected.role} {selected.department && `· ${selected.department}`}</p>
                        <div className="space-y-2 mb-4">
                            {[{ l: 'Email', v: selected.email }, { l: 'Phone', v: selected.phone || 'N/A' }, { l: 'Joined', v: selected.joinedAt ? new Date(selected.joinedAt).toLocaleDateString('en-IN') : 'N/A' }].map(i => (
                                <div key={i.l} className="flex gap-4"><span className="text-slate-500 text-xs w-16">{i.l}</span><span className="text-slate-300 text-sm">{i.v}</span></div>
                            ))}
                        </div>
                        <h4 className="text-slate-400 text-xs mb-2">TASK SUMMARY</h4>
                        <div className="flex gap-3 mb-4">
                            {(['Pending', 'In Progress', 'Done'] as const).map(s => {
                                const count = (selected.tasks || []).filter((t: any) => t.status === s).length;
                                return (
                                    <div key={s} className="stat-card !p-3 text-center flex-1">
                                        <div className="text-xl font-bold text-white">{count}</div>
                                        <div className="text-slate-500 text-xs">{s}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={() => setSelected(null)} className="btn-outline w-full justify-center !py-2.5">Close</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(EmployeesPage, ['admin']);
