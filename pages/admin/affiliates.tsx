// pages/admin/affiliates.tsx – Admin Affiliates Management (MongoDB-backed)
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Check, X, Eye, Wallet, Trash2 } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



interface ExtraField { label: string; value: string; }

interface Affiliate {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    pan?: string;
    bank?: string;
    city?: string;
    commissionRate?: string;
    notes?: string;
    extraFields?: ExtraField[];
    status: string;
    walletBalance: number;
    leads: string[];
    payouts: { id: string; amount: number; status: string; requestedAt: string }[];
    createdAt: string;
}

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    pan: '',
    bank: '',
    city: '',
    commissionRate: '',
    notes: '',
    status: 'Pending',
};

function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [selected, setSelected] = useState<Affiliate | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [extraFields, setExtraFields] = useState<ExtraField[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = () => localStorage.getItem('sh_token');
    const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

    const loadAffiliates = async () => {
        try {
            const res = await fetch('/api/affiliates', { headers: { Authorization: `Bearer ${token()}` } });
            if (res.ok) setAffiliates(await res.json());
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { loadAffiliates(); }, []);

    const updateStatus = async (id: string, status: string) => {
        const aff = affiliates.find(a => a._id === id);
        try {
            const res = await fetch(`/api/affiliates/${id}`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success(`Affiliate ${status}`);
            loadAffiliates();
            if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : null);
        } catch { toast.error('Failed to update status'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this affiliate?')) return;
        await fetch(`/api/affiliates/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
        toast.success('Affiliate deleted');
        setSelected(null);
        loadAffiliates();
    };

    const handleAdd = async () => {
        if (!form.name || !form.email) return toast.error('Name and email are required');
        setSaving(true);
        try {
            const res = await fetch('/api/affiliates', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    ...form,
                    extraFields,
                    walletBalance: 0,
                    leads: [],
                    payouts: [],
                }),
            });
            if (!res.ok) throw new Error((await res.json()).error || 'Failed');
            toast.success('Affiliate added!');
            setShowAdd(false);
            setForm(EMPTY_FORM);
            setExtraFields([]);
            loadAffiliates();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const addExtraField = () => setExtraFields(prev => [...prev, { label: '', value: '' }]);
    const updateExtraField = (i: number, key: 'label' | 'value', val: string) => {
        setExtraFields(prev => prev.map((f, idx) => idx === i ? { ...f, [key]: val } : f));
    };
    const removeExtraField = (i: number) => setExtraFields(prev => prev.filter((_, idx) => idx !== i));

    const statusColor = (s: string) => ({
        Pending: 'badge-yellow', Approved: 'badge-green', Rejected: 'badge-red',
    }[s] || 'badge-blue');

    return (
        <DashboardLayout navItems={adminNav} title="Affiliate Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Affiliates – Admin | ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                    { label: 'Total Affiliates', value: affiliates.length },
                    { label: 'Approved', value: affiliates.filter(a => a.status === 'Approved').length },
                    { label: 'Pending Approval', value: affiliates.filter(a => a.status === 'Pending').length },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="font-syne font-black text-3xl gradient-text">{s.value}</div>
                        <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-slate-300 text-sm font-medium">{affiliates.length} affiliates</h2>
                <button onClick={() => setShowAdd(true)} className="btn-glow !py-2 !px-4 !text-sm flex items-center gap-2">
                    <Plus size={15} /> Add Affiliate
                </button>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th><th>Email / Phone</th><th>Leads</th><th>Wallet</th>
                            <th>Status</th><th>Registered</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">Loading...</td></tr>
                        ) : affiliates.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No affiliates yet. Click "+ Add Affiliate" to get started.</td></tr>
                        ) : affiliates.map(aff => (
                            <tr key={aff._id}>
                                <td className="font-medium text-white">{aff.name}</td>
                                <td className="text-slate-400 text-sm">{aff.email}<br />{aff.phone}</td>
                                <td className="text-white">{(aff.leads || []).length}</td>
                                <td className="text-green-400 font-medium">₹{(aff.walletBalance || 0).toLocaleString()}</td>
                                <td><span className={`badge ${statusColor(aff.status)}`}>{aff.status}</span></td>
                                <td className="text-slate-500 text-xs">{new Date(aff.createdAt).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <div className="flex gap-1">
                                        <button onClick={() => setSelected(aff)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                        {aff.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(aff._id, 'Approved')} className="p-1.5 rounded text-green-400 hover:bg-green-400/10"><Check size={14} /></button>
                                                <button onClick={() => updateStatus(aff._id, 'Rejected')} className="p-1.5 rounded text-red-400 hover:bg-red-400/10"><X size={14} /></button>
                                            </>
                                        )}
                                        {aff.status === 'Approved' && (
                                            <button onClick={() => updateStatus(aff._id, 'Rejected')} className="p-1.5 rounded text-red-400 hover:bg-red-400/10"><X size={14} /></button>
                                        )}
                                        {aff.status === 'Rejected' && (
                                            <button onClick={() => updateStatus(aff._id, 'Approved')} className="p-1.5 rounded text-green-400 hover:bg-green-400/10"><Check size={14} /></button>
                                        )}
                                        <button onClick={() => handleDelete(aff._id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Affiliate Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-box !max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-syne font-bold text-xl text-white">Add New Affiliate</h3>
                            <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ravi Sharma" />
                            </div>
                            <div>
                                <label className="form-label">Email *</label>
                                <input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="ravi@example.com" />
                            </div>
                            <div>
                                <label className="form-label">Phone</label>
                                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 92193 31120" />
                            </div>
                            <div>
                                <label className="form-label">City</label>
                                <input className="form-input" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Mumbai" />
                            </div>
                            <div>
                                <label className="form-label">PAN Number</label>
                                <input className="form-input" value={form.pan} onChange={e => setForm(p => ({ ...p, pan: e.target.value }))} placeholder="ABCDE1234F" />
                            </div>
                            <div>
                                <label className="form-label">Bank / UPI</label>
                                <input className="form-input" value={form.bank} onChange={e => setForm(p => ({ ...p, bank: e.target.value }))} placeholder="UPI ID or account info" />
                            </div>
                            <div>
                                <label className="form-label">Commission Rate (%)</label>
                                <input className="form-input" value={form.commissionRate} onChange={e => setForm(p => ({ ...p, commissionRate: e.target.value }))} placeholder="e.g. 10" />
                            </div>
                            <div>
                                <label className="form-label">Status</label>
                                <select className="form-input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="form-label">Notes</label>
                            <textarea className="form-input !h-16" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any notes about this affiliate…" />
                        </div>

                        {/* Additional custom fields */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="form-label !mb-0">Additional Fields</label>
                                <button onClick={addExtraField} className="text-cyan-400 text-xs flex items-center gap-1 hover:text-cyan-300">
                                    <Plus size={12} /> Add Field
                                </button>
                            </div>
                            {extraFields.map((f, i) => (
                                <div key={i} className="flex gap-2 mb-2">
                                    <input className="form-input !text-xs flex-1" value={f.label} onChange={e => updateExtraField(i, 'label', e.target.value)} placeholder="Field name (e.g. GST No)" />
                                    <input className="form-input !text-xs flex-1" value={f.value} onChange={e => updateExtraField(i, 'value', e.target.value)} placeholder="Value" />
                                    <button onClick={() => removeExtraField(i)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button onClick={handleAdd} disabled={saving} className="btn-glow flex-1 justify-center">
                                {saving ? 'Saving…' : '+ Add Affiliate'}
                            </button>
                            <button onClick={() => setShowAdd(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Affiliate Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="font-syne font-bold text-xl text-white">{selected.name}</h3>
                                <p className="text-slate-400 text-sm">{selected.email}</p>
                            </div>
                            <span className={`badge ${statusColor(selected.status)}`}>{selected.status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="stat-card">
                                <Wallet size={18} className="text-cyan-400 mb-2" />
                                <div className="text-2xl font-bold text-green-400">₹{(selected.walletBalance || 0).toLocaleString()}</div>
                                <div className="text-slate-400 text-xs">Wallet Balance</div>
                            </div>
                            <div className="stat-card">
                                <div className="text-2xl font-bold text-blue-400">{(selected.leads || []).length}</div>
                                <div className="text-slate-400 text-xs">Leads Submitted</div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-5">
                            {[
                                ['Phone', selected.phone],
                                ['City', selected.city],
                                ['PAN', selected.pan || 'Not provided'],
                                ['Bank/UPI', selected.bank || 'Not provided'],
                                ['Commission', selected.commissionRate ? `${selected.commissionRate}%` : 'Not set'],
                                ['Registered', new Date(selected.createdAt).toLocaleDateString('en-IN')],
                            ].filter(([, v]) => v).map(([l, v]) => (
                                <div key={l as string} className="flex gap-3">
                                    <span className="text-slate-500 text-xs w-24 shrink-0">{l}</span>
                                    <span className="text-slate-300 text-sm">{v}</span>
                                </div>
                            ))}
                        </div>

                        {selected.notes && (
                            <div className="mb-4 bg-white/3 rounded-lg p-3">
                                <div className="text-slate-500 text-xs mb-1">Notes</div>
                                <div className="text-slate-300 text-sm">{selected.notes}</div>
                            </div>
                        )}

                        {(selected.extraFields || []).length > 0 && (
                            <div className="mb-5">
                                <div className="text-slate-500 text-xs font-medium mb-2">ADDITIONAL FIELDS</div>
                                {selected.extraFields!.map((f, i) => (
                                    <div key={i} className="flex gap-3 mb-1">
                                        <span className="text-slate-500 text-xs w-24 shrink-0">{f.label}</span>
                                        <span className="text-slate-300 text-sm">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(selected.payouts || []).length > 0 && (
                            <div className="mb-4">
                                <p className="text-slate-400 text-xs font-medium mb-2">Payout History</p>
                                {selected.payouts.map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-white/5 rounded-lg p-3 mb-2">
                                        <span className="text-slate-300 text-sm">₹{p.amount.toLocaleString()}</span>
                                        <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span>
                                        <span className="text-slate-500 text-xs">{new Date(p.requestedAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 mt-5">
                            {selected.status === 'Pending' && (
                                <button onClick={() => updateStatus(selected._id, 'Approved')} className="btn-glow flex-1 justify-center"><Check size={14} /> Approve</button>
                            )}
                            {selected.status !== 'Rejected' && (
                                <button onClick={() => updateStatus(selected._id, 'Rejected')} className="btn-outline flex-1 justify-center !border-red-500/40 !text-red-400">Reject</button>
                            )}
                            <button onClick={() => handleDelete(selected._id)} className="p-2 rounded text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                            <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(AffiliatesPage, ['admin']);
