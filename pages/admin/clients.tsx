// pages/admin/clients.tsx – Admin Clients Management (MongoDB-backed)
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Eye, X, Trash2 } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
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

const SERVICE_OPTIONS = [
    'SEO & Content Marketing',
    'Performance Ads',
    'Social Media Management',
    'Web Design & Development',
    'Analytics & CRO',
    'Email Marketing',
    'Other',
];

interface Client {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service?: string;
    projectName?: string;
    budget?: string;
    status: string;
    specialRequirements?: string;
    startDate?: string;
    invoices?: { amount: number; status: string }[];
    timeline?: { title: string; status: string }[];
    createdAt?: string;
}

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    projectName: '',
    budget: '',
    status: 'Active',
    startDate: '',
    specialRequirements: '',
};

function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selected, setSelected] = useState<Client | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadClients = async () => {
        try {
            const token = localStorage.getItem('sh_token');
            const res = await fetch('/api/clients', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) setClients(await res.json());
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { loadClients(); }, []);

    const handleAdd = async () => {
        if (!form.name || !form.email) return toast.error('Name and email are required');
        setSaving(true);
        try {
            const token = localStorage.getItem('sh_token');
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, invoices: [], timeline: [], reports: [], assignedEmployees: [] }),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            toast.success('Client added successfully!');
            setShowAdd(false);
            setForm(EMPTY_FORM);
            loadClients();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this client?')) return;
        const token = localStorage.getItem('sh_token');
        await fetch(`/api/clients/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        toast.success('Client deleted');
        setSelected(null);
        loadClients();
    };

    const revenue = (c: Client) =>
        (c.invoices || []).filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

    return (
        <DashboardLayout navItems={adminNav} title="Clients Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Clients – Admin | ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                    { l: 'Total Clients', v: clients.length },
                    { l: 'Active', v: clients.filter(c => c.status === 'Active').length },
                    { l: 'Completed', v: clients.filter(c => c.status === 'Completed').length },
                ].map(s => (
                    <div key={s.l} className="stat-card">
                        <div className="font-syne font-black text-3xl gradient-text">{s.v}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.l}</div>
                    </div>
                ))}
            </div>

            {/* Table Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-slate-300 text-sm font-medium">{clients.length} clients</h2>
                <button onClick={() => setShowAdd(true)} className="btn-glow !py-2 !px-4 !text-sm flex items-center gap-2">
                    <Plus size={15} /> Add Client
                </button>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr><th>Client</th><th>Company</th><th>Service</th><th>Project</th><th>Status</th><th>Revenue</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">Loading...</td></tr>
                        ) : clients.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No clients yet. Click "+ Add Client" to get started.</td></tr>
                        ) : clients.map(c => (
                            <tr key={c._id}>
                                <td><div className="font-medium text-white">{c.name}</div><div className="text-slate-500 text-xs">{c.email}</div></td>
                                <td className="text-slate-300">{c.company || '—'}</td>
                                <td className="text-slate-400 text-sm">{c.service || '—'}</td>
                                <td className="text-slate-400 text-sm">{c.projectName || '—'}</td>
                                <td><span className={`badge ${c.status === 'Active' ? 'badge-green' : c.status === 'Completed' ? 'badge-blue' : 'badge-yellow'}`}>{c.status}</span></td>
                                <td className="text-green-400 font-medium">₹{revenue(c).toLocaleString()}</td>
                                <td>
                                    <div className="flex gap-1">
                                        <button onClick={() => setSelected(c)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Client Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-box !max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-syne font-bold text-xl text-white">Add New Client</h3>
                            <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="form-label">Email *</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" />
                            </div>
                            <div>
                                <label className="form-label">Phone</label>
                                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                            </div>
                            <div>
                                <label className="form-label">Company</label>
                                <input className="form-input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company Name" />
                            </div>
                            <div>
                                <label className="form-label">Service Required</label>
                                <select className="form-input" value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}>
                                    <option value="">Select service</option>
                                    {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Project Name</label>
                                <input className="form-input" value={form.projectName} onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))} placeholder="Website Redesign" />
                            </div>
                            <div>
                                <label className="form-label">Budget Finalized (₹)</label>
                                <input className="form-input" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. 50,000" />
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Start Date</label>
                                <input type="date" className="form-input" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="form-label">Special Requirements</label>
                            <textarea className="form-input !h-20" value={form.specialRequirements} onChange={e => setForm(p => ({ ...p, specialRequirements: e.target.value }))} placeholder="Any specific notes, deliverables, or constraints…" />
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button onClick={handleAdd} disabled={saving} className="btn-glow flex-1 justify-center">
                                {saving ? 'Saving…' : '+ Add Client'}
                            </button>
                            <button onClick={() => setShowAdd(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Client Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.company} · {selected.service}</p>
                            </div>
                            <span className={`badge ${selected.status === 'Active' ? 'badge-green' : selected.status === 'Completed' ? 'badge-blue' : 'badge-yellow'}`}>{selected.status}</span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                            {[
                                ['Email', selected.email],
                                ['Phone', selected.phone || '—'],
                                ['Project', selected.projectName || '—'],
                                ['Budget', selected.budget ? `₹${selected.budget}` : '—'],
                                ['Start Date', selected.startDate || '—'],
                            ].map(([label, val]) => (
                                <div key={label as string} className="bg-white/3 rounded-lg p-2">
                                    <div className="text-slate-500 text-xs mb-0.5">{label}</div>
                                    <div className="text-slate-300">{val}</div>
                                </div>
                            ))}
                        </div>

                        {selected.specialRequirements && (
                            <div className="mb-4 bg-white/3 rounded-lg p-3">
                                <div className="text-slate-500 text-xs mb-1">Special Requirements</div>
                                <div className="text-slate-300 text-sm">{selected.specialRequirements}</div>
                            </div>
                        )}

                        {(selected.timeline || []).length > 0 && (
                            <>
                                <h4 className="text-slate-400 text-xs font-medium mb-2">TIMELINE</h4>
                                <div className="space-y-2 mb-4">
                                    {(selected.timeline || []).map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/3">
                                            <span className="text-slate-300 text-sm">{t.title}</span>
                                            <span className={`badge text-xs ${t.status === 'Done' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-yellow'}`}>{t.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 mt-5">
                            <button onClick={() => handleDelete(selected._id)} className="btn-outline !border-red-500/40 !text-red-400"><Trash2 size={14} /> Delete</button>
                            <button onClick={() => setSelected(null)} className="btn-outline flex-1 justify-center">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ClientsPage, ['admin']);
