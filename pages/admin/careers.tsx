// pages/admin/careers.tsx – Admin Career listings management (MongoDB via API)
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Users, DollarSign, Pencil } from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salary?: string;
    description: string;
    requirements: string[];
    isActive: boolean;
    postedAt: string;
}

type FormState = {
    title: string; department: string; location: string;
    type: string; salary: string; description: string; requirements: string[];
};

const emptyForm: FormState = {
    title: '', department: '', location: 'Remote / Kanpur',
    type: 'Full-time', salary: '', description: '', requirements: [],
};

function CareersAdminPage() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null); // null = creating, string = editing
    const [form, setForm] = useState<FormState>(emptyForm);
    const [reqInput, setReqInput] = useState('');
    const [saving, setSaving] = useState(false);

    const reload = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/careers?all=true');
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, []);

    // Open modal for creating a new job
    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setReqInput('');
        setShowModal(true);
    };

    // Open modal pre-filled with existing job data
    const openEdit = (job: Career) => {
        setEditingId(job._id);
        setForm({
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            salary: job.salary || '',
            description: job.description,
            requirements: [...job.requirements],
        });
        setReqInput('');
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm); setReqInput(''); };

    const toggleActive = async (job: Career) => {
        try {
            await fetch(`/api/careers/${job._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !job.isActive }),
            });
            toast.success(job.isActive ? 'Job deactivated' : 'Job activated');
            reload();
        } catch {
            toast.error('Failed to update job');
        }
    };

    const deleteJob = async (id: string) => {
        if (!confirm('Delete this job posting?')) return;
        try {
            await fetch(`/api/careers/${id}`, { method: 'DELETE' });
            toast.success('Job deleted');
            reload();
        } catch {
            toast.error('Failed to delete job');
        }
    };

    const addReq = () => {
        if (!reqInput.trim()) return;
        setForm(prev => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }));
        setReqInput('');
    };
    const removeReq = (i: number) => setForm(prev => ({ ...prev, requirements: prev.requirements.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.title.trim()) { toast.error('Job title is required'); return; }
        setSaving(true);
        try {
            if (editingId) {
                // UPDATE existing job
                const res = await fetch(`/api/careers/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
                toast.success('Job updated!');
            } else {
                // CREATE new job
                const payload = { ...form, isActive: true, postedAt: new Date().toISOString().slice(0, 10) };
                const res = await fetch('/api/careers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
                toast.success('Job posted!');
            }
            closeModal();
            reload();
        } catch (err: any) {
            toast.error(err.message || 'Error saving job');
        } finally {
            setSaving(false);
        }
    };

    const JobForm = (
        <div className="space-y-4">
            <div>
                <label className="form-label">Job Title *</label>
                <input className="form-input !text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior SEO Specialist" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="form-label">Department</label>
                    <input className="form-input !text-sm" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Digital Marketing" />
                </div>
                <div>
                    <label className="form-label">Location</label>
                    <input className="form-input !text-sm" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote / Kanpur" />
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="form-label">Job Type</label>
                    <select className="form-input !text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        {['Full-time', 'Part-time', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label flex items-center gap-1"><DollarSign size={12} /> Salary / Range</label>
                    <input className="form-input !text-sm" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. ₹3–5 LPA" />
                </div>
            </div>
            <div>
                <label className="form-label">Description</label>
                <textarea className="form-input !h-24 resize-none !text-sm" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the role..." />
            </div>
            <div>
                <label className="form-label">Requirements</label>
                <div className="flex gap-2 mb-2">
                    <input className="form-input !text-sm flex-1" placeholder="e.g. 3+ years SEO experience" value={reqInput}
                        onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addReq()} />
                    <button type="button" onClick={addReq} className="btn-outline !py-2 !px-3 !text-xs">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {form.requirements.map((r, i) => (
                        <span key={i} className="badge badge-blue cursor-pointer hover:opacity-70" onClick={() => removeReq(i)}>{r} ×</span>
                    ))}
                </div>
            </div>
            <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving} className="btn-glow flex-1 justify-center !py-3 disabled:opacity-60">
                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Post Job'}
                </button>
                <button onClick={closeModal} className="btn-outline">Cancel</button>
            </div>
        </div>
    );

    return (
        <DashboardLayout navItems={adminNav} title="Career Listings" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Careers – Admin | ScalerHouse</title></Head>
            <div className="flex justify-end mb-5">
                <button onClick={openCreate} className="btn-glow !py-2 !px-4 !text-sm"><Plus size={15} /> Post Job</button>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-16">Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div className="text-center text-slate-500 py-16">No jobs posted yet. Click <strong className="text-white">&quot;+ Post Job&quot;</strong> to add one.</div>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className={`glass-card p-5 ${!job.isActive ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="font-semibold text-white">{job.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        <span className="badge badge-blue text-xs">{job.department}</span>
                                        <span className="badge badge-cyan text-xs">{job.type}</span>
                                        <span className="text-slate-500 text-xs">{job.location}</span>
                                        {job.salary && <span className="text-green-400 text-xs flex items-center gap-1"><DollarSign size={10} />{job.salary}</span>}
                                        <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-yellow'}`}>{job.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{job.description}</p>
                                    {job.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {job.requirements.map(r => <span key={r} className="badge badge-blue text-xs">{r}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center shrink-0">
                                    <Link href={`/admin/applications?careerId=${job._id}`}
                                        className="flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/20 rounded-lg px-3 py-1.5 hover:bg-cyan-400/10 transition-all">
                                        <Users size={12} /> Applicants
                                    </Link>
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => openEdit(job)}
                                        className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                                        title="Edit job"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => toggleActive(job)} className={job.isActive ? 'text-cyan-400' : 'text-slate-500'} title={job.isActive ? 'Deactivate' : 'Activate'}>
                                        {job.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                    </button>
                                    <button onClick={() => deleteJob(job._id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create / Edit Job Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">
                            {editingId ? '✏️ Edit Job' : 'Post New Job'}
                        </h3>
                        {JobForm}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(CareersAdminPage, ['admin']);
