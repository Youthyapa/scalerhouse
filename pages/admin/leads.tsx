// pages/admin/leads.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Trash2, Edit, Eye, Phone, Mail } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, KEYS, Lead, genId, logActivity } from '../../lib/store';
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

const statuses: Lead['status'][] = ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const statusColors: Record<string, string> = {
    New: 'badge-blue', Contacted: 'badge-purple', 'Proposal Sent': 'badge-cyan',
    Negotiation: 'badge-yellow', Won: 'badge-green', Lost: 'badge-red',
};

const emptyLead: Partial<Lead> = {
    name: '', email: '', phone: '', company: '', service: '', budget: '',
    status: 'New', source: 'Website', score: 60, notes: '',
};

function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filtered, setFiltered] = useState<Lead[]>([]);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<Lead>>(emptyLead);
    const [editing, setEditing] = useState<string | null>(null);
    const [view, setView] = useState<'table' | 'kanban'>('table');

    const reload = () => {
        const all = getAll<Lead>(KEYS.LEADS);
        setLeads(all);
        setFiltered(all);
    };

    useEffect(() => { reload(); }, []);

    useEffect(() => {
        let result = leads;
        if (statusFilter !== 'All') result = result.filter(l => l.status === statusFilter);
        if (query) result = result.filter(l =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.email.toLowerCase().includes(query.toLowerCase()) ||
            (l.company || '').toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(result);
    }, [query, statusFilter, leads]);

    const openAdd = () => { setEditing(null); setForm(emptyLead); setShowModal(true); };
    const openEdit = (lead: Lead) => { setEditing(lead.id); setForm(lead); setShowModal(true); };

    const handleSave = () => {
        const all = getAll<Lead>(KEYS.LEADS);
        if (editing) {
            const idx = all.findIndex(l => l.id === editing);
            if (idx !== -1) {
                all[idx] = { ...all[idx], ...form, updatedAt: new Date().toISOString() };
                logActivity(`Lead updated: ${form.name}`, 'Admin');
            }
        } else {
            const newLead: Lead = {
                ...emptyLead as Lead,
                ...form,
                id: genId(),
                status: form.status || 'New',
                score: form.score || 60,
                source: form.source || 'Manual',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            all.push(newLead);
            logActivity(`Lead added: ${form.name}`, 'Admin');
        }
        saveAll(KEYS.LEADS, all);
        toast.success(editing ? 'Lead updated!' : 'Lead added!');
        setShowModal(false);
        reload();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this lead?')) return;
        saveAll(KEYS.LEADS, getAll<Lead>(KEYS.LEADS).filter(l => l.id !== id));
        toast.success('Lead deleted');
        setSelectedLead(null);
        reload();
    };

    const updateStatus = (id: string, status: Lead['status']) => {
        const all = getAll<Lead>(KEYS.LEADS);
        const idx = all.findIndex(l => l.id === id);
        if (idx !== -1) { all[idx].status = status; all[idx].updatedAt = new Date().toISOString(); }
        saveAll(KEYS.LEADS, all);
        reload();
    };

    return (
        <DashboardLayout navItems={adminNav} title="CRM / Leads" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>CRM Leads – Admin | ScalerHouse</title></Head>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input className="form-input !pl-9 !py-2 !text-sm w-56" placeholder="Search leads..." value={query} onChange={e => setQuery(e.target.value)} />
                    </div>
                    <select className="form-input !py-2 !text-sm w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option>All</option>
                        {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView(view === 'table' ? 'kanban' : 'table')} className="btn-outline !py-2 !px-4 !text-sm">
                        {view === 'table' ? '📋 Kanban' : '📊 Table'}
                    </button>
                    <button onClick={openAdd} className="btn-glow !py-2 !px-4 !text-sm">
                        <Plus size={15} /> Add Lead
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-3 mb-5">
                {statuses.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s === statusFilter ? 'All' : s)} className={`badge cursor-pointer ${statusColors[s]} ${statusFilter === s ? 'ring-1 ring-cyan-400' : ''}`}>
                        {s}: {leads.filter(l => l.status === s).length}
                    </button>
                ))}
            </div>

            {/* Kanban View */}
            {view === 'kanban' ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {statuses.map(status => (
                        <div key={status} className="kanban-col shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`badge ${statusColors[status]}`}>{status}</span>
                                <span className="text-slate-500 text-xs">{filtered.filter(l => l.status === status).length}</span>
                            </div>
                            {filtered.filter(l => l.status === status).map(lead => (
                                <div key={lead.id} className="kanban-card" onClick={() => setSelectedLead(lead)}>
                                    <p className="text-white text-sm font-medium">{lead.name}</p>
                                    <p className="text-slate-400 text-xs mt-1">{lead.company}</p>
                                    <p className="text-cyan-400 text-xs mt-1">{lead.service}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-slate-500 text-xs">{lead.source}</span>
                                        <span className="text-green-400 text-xs font-semibold">Score: {lead.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                /* Table View */
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Lead</th>
                                <th>Service</th>
                                <th>Source</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center text-slate-500 py-10">No leads found</td></tr>
                            ) : filtered.map(lead => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="font-medium text-white">{lead.name}</div>
                                        <div className="text-slate-500 text-xs">{lead.email} · {lead.phone}</div>
                                        {lead.company && <div className="text-slate-500 text-xs">{lead.company}</div>}
                                    </td>
                                    <td className="text-slate-300 text-sm">{lead.service}<br /><span className="text-slate-500 text-xs">{lead.budget}</span></td>
                                    <td><span className="badge badge-blue text-xs">{lead.source}</span></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ background: lead.score > 75 ? '#4ade80' : lead.score > 50 ? '#fbbf24' : '#f87171' }} />
                                            <span className="text-white text-sm font-medium">{lead.score}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            value={lead.status}
                                            onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                                            className={`badge ${statusColors[lead.status]} cursor-pointer bg-transparent border-0 focus:outline-none text-xs`}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                    <td className="text-slate-500 text-xs">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => setSelectedLead(lead)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                            <button onClick={() => openEdit(lead)} className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Lead Detail Panel */}
            {selectedLead && (
                <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
                    <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selectedLead.name}</h3>
                                <p className="text-slate-400 text-sm">{selectedLead.company}</p>
                            </div>
                            <span className={`badge ${statusColors[selectedLead.status]}`}>{selectedLead.status}</span>
                        </div>
                        <div className="space-y-3 mb-5">
                            {[
                                { label: 'Email', val: selectedLead.email, icon: <Mail size={13} /> },
                                { label: 'Phone', val: selectedLead.phone, icon: <Phone size={13} /> },
                                { label: 'Service', val: selectedLead.service },
                                { label: 'Budget', val: selectedLead.budget },
                                { label: 'Source', val: selectedLead.source },
                                { label: 'Score', val: selectedLead.score?.toString() },
                                { label: 'Follow-up', val: selectedLead.followUpDate },
                            ].filter(i => i.val).map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <span className="text-slate-500 text-xs w-24">{item.label}</span>
                                    <span className="text-slate-300 text-sm">{item.val}</span>
                                </div>
                            ))}
                        </div>
                        {selectedLead.notes && (
                            <div className="bg-white/5 rounded-xl p-4 mb-4">
                                <p className="text-slate-400 text-xs mb-1">Notes</p>
                                <p className="text-slate-300 text-sm">{selectedLead.notes}</p>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => { openEdit(selectedLead); setSelectedLead(null); }} className="btn-glow flex-1 justify-center !py-2.5"><Edit size={14} /> Edit</button>
                            <button onClick={() => handleDelete(selectedLead.id)} className="btn-outline flex-1 justify-center !py-2.5 !border-red-500/40 !text-red-400 hover:!bg-red-900/20"><Trash2 size={14} /> Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">{editing ? 'Edit Lead' : 'Add New Lead'}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {([
                                { key: 'name', label: 'Full Name', placeholder: 'Name' },
                                { key: 'email', label: 'Email', placeholder: 'email@example.com' },
                                { key: 'phone', label: 'Phone', placeholder: '+91 XXXXX XXXXX' },
                                { key: 'company', label: 'Company', placeholder: 'Company Name' },
                                { key: 'service', label: 'Service', placeholder: 'SEO, Ads...' },
                                { key: 'budget', label: 'Budget', placeholder: '₹50,000/mo' },
                            ] as const).map(field => (
                                <div key={field.key}>
                                    <label className="form-label">{field.label}</label>
                                    <input className="form-input !text-sm" placeholder={field.placeholder} value={(form as Record<string, string>)[field.key] || ''} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
                                </div>
                            ))}
                            <div>
                                <label className="form-label">Status</label>
                                <select className="form-input !text-sm" value={form.status || 'New'} onChange={e => setForm({ ...form, status: e.target.value as Lead['status'] })}>
                                    {statuses.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Source</label>
                                <select className="form-input !text-sm" value={form.source || 'Website'} onChange={e => setForm({ ...form, source: e.target.value })}>
                                    {['Website', 'Affiliate', 'Cold Call', 'Referral', 'Manual', 'Social Media'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Score (0-100)</label>
                                <input type="number" min={0} max={100} className="form-input !text-sm" value={form.score || 60} onChange={e => setForm({ ...form, score: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label className="form-label">Follow-up Date</label>
                                <input type="date" className="form-input !text-sm" value={form.followUpDate || ''} onChange={e => setForm({ ...form, followUpDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="form-label">Notes</label>
                            <textarea className="form-input !h-20 resize-none !text-sm" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleSave} className="btn-glow flex-1 justify-center !py-3">Save Lead</button>
                            <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(LeadsPage, ['admin']);
