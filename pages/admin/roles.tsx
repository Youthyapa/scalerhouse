// pages/admin/roles.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';

interface Permission {
    path: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

interface Role {
    _id: string;
    name: string;
    description: string;
    isProtected: boolean;
    permissions: Permission[];
}

function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const emptyForm = { name: '', description: '', permissions: [] as Permission[] };
    const [form, setForm] = useState(emptyForm);

    const loadRoles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/roles');
            const data = await res.json();
            setRoles(data);
        } catch (err) {
            toast.error('Failed to load roles');
        }
        setLoading(false);
    };

    useEffect(() => { loadRoles(); }, []);

    const handleSave = async () => {
        if (!form.name) return toast.error('Role name is required');
        const url = isEditing ? `/api/roles/${isEditing}` : '/api/roles';
        const method = isEditing ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            toast.success(`Role ${isEditing ? 'updated' : 'created'}`);
            setShowModal(false);
            setForm(emptyForm);
            setIsEditing(null);
            loadRoles();
        } else {
            const data = await res.json();
            toast.error(data.error || 'Operation failed');
        }
    };

    const handleDelete = async (role: Role) => {
        if (role.isProtected) return toast.error('Protected roles cannot be deleted');
        if (!confirm(`Are you sure you want to delete the ${role.name} role?`)) return;

        const res = await fetch(`/api/roles/${role._id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Role deleted');
            loadRoles();
        } else {
            toast.error('Failed to delete role');
        }
    };

    const openModal = (role?: Role) => {
        if (role) {
            setIsEditing(role._id);
            setForm({ name: role.name, description: role.description, permissions: role.permissions || [] });
        } else {
            setIsEditing(null);
            setForm(emptyForm);
        }
        setShowModal(true);
    };

    const togglePermission = (path: string, key: 'canView' | 'canEdit' | 'canDelete') => {
        setForm(prev => {
            let perms = [...prev.permissions];
            const idx = perms.findIndex(p => p.path === path);
            if (idx === -1) {
                // Default block: everything false except what was checked
                perms.push({ path, canView: key === 'canView', canEdit: key === 'canEdit', canDelete: key === 'canDelete' });
            } else {
                perms[idx] = { ...perms[idx], [key]: !perms[idx][key] };
                // If they can edit or delete, they must be able to view
                if ((key === 'canEdit' || key === 'canDelete') && perms[idx][key]) {
                    perms[idx].canView = true;
                }
            }
            return { ...prev, permissions: perms };
        });
    };

    return (
        <DashboardLayout navItems={adminNav} title="Roles & Permissions" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Roles – Admin | ScalerHouse</title></Head>

            <div className="flex justify-between items-center mb-6">
                <p className="text-slate-400 text-sm">Create custom roles to control what sections employees can access in the <strong className="text-cyan-400">Employee Portal</strong>.</p>
                <button onClick={() => openModal()} className="btn-glow !py-2 !px-4 !text-sm"><Plus size={15} /> Create Role</button>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading roles...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map(role => (
                        <div key={role._id} className="glass-card p-6 flex flex-col h-full border border-white/5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                                        {role.name} 
                                        {role.isProtected && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Protected</span>}
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">{role.description || 'Custom Role'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(role)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Edit2 size={14} /></button>
                                    {!role.isProtected && <button onClick={() => handleDelete(role)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>}
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500 mb-2">ACCESS OVERVIEW</div>
                                {role.permissions.slice(0, 3).map(p => (
                                    <div key={p.path} className="flex justify-between text-xs mb-1.5">
                                        <span className="text-slate-300">{p.path === '*' ? 'Everything (Super Admin)' : p.path.replace('/admin/', '') || 'Dashboard'}</span>
                                        <div className="flex gap-1.5">
                                            {p.canView && <span className="text-green-400">View</span>}
                                            {p.canEdit && <span className="text-blue-400">Edit</span>}
                                            {p.canDelete && <span className="text-red-400">Del</span>}
                                        </div>
                                    </div>
                                ))}
                                {role.permissions.length > 3 && <div className="text-xs text-slate-500 mt-2">+ {role.permissions.length - 3} more sections</div>}
                                {role.permissions.length === 0 && <span className="text-slate-500 text-xs">No permissions assigned</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">{isEditing ? 'Edit Role' : 'Create Custom Role'}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="form-label">Role Name</label>
                                <input className="form-input !text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Content Writer" disabled={roles.find(r => r._id === isEditing)?.isProtected} />
                            </div>
                            <div>
                                <label className="form-label">Description (optional)</label>
                                <input className="form-input !text-sm" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What does this role do?" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="form-label mb-3 border-b border-white/10 pb-2 flex justify-between">
                                <span>Employee Portal Section Permissions</span>
                                <div className="flex gap-6 text-[10px] uppercase tracking-wider text-slate-500">
                                    <span className="w-8 text-center">View</span>
                                    <span className="w-8 text-center">Edit</span>
                                    <span className="w-8 text-center">Delete</span>
                                </div>
                            </label>
                            <div className="space-y-2">
                                {adminNav.map(nav => {
                                    const perm = form.permissions.find(p => p.path === nav.href) || { path: nav.href, canView: false, canEdit: false, canDelete: false };
                                    const isSuperAdmin = form.permissions.some(p => p.path === '*');
                                    return (
                                        <div key={nav.href} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <span>{nav.icon}</span>
                                                <span className="text-sm font-medium text-slate-300">{nav.label}</span>
                                                <span className="text-xs text-slate-600 block sm:inline ml-2">{nav.href}</span>
                                            </div>
                                            <div className="flex gap-6">
                                                <input type="checkbox" checked={isSuperAdmin || perm.canView} onChange={() => togglePermission(nav.href, 'canView')} disabled={isSuperAdmin} className="w-4 h-4 accent-cyan-500" />
                                                <input type="checkbox" checked={isSuperAdmin || perm.canEdit} onChange={() => togglePermission(nav.href, 'canEdit')} disabled={isSuperAdmin} className="w-4 h-4 accent-blue-500" />
                                                <input type="checkbox" checked={isSuperAdmin || perm.canDelete} onChange={() => togglePermission(nav.href, 'canDelete')} disabled={isSuperAdmin} className="w-4 h-4 accent-red-500" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleSave} className="btn-glow flex-1 justify-center !py-3">Save Role</button>
                            <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(RolesPage, ['admin']);
