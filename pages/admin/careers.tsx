// pages/admin/careers.tsx – Admin Career listings management
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import Link from 'next/link';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, deleteItem, saveAll, KEYS, Career, genId } from '../../lib/store';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



const emptyJob: Partial<Career> = { title: '', department: '', location: 'Remote / Kanpur', type: 'Full-time', description: '', requirements: [], isActive: true };

function CareersAdminPage() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<Career>>(emptyJob);
    const [reqInput, setReqInput] = useState('');

    const reload = () => setJobs(getAll<Career>(KEYS.CAREERS));
    useEffect(() => { reload(); }, []);

    const toggleActive = (id: string) => {
        const all = getAll<Career>(KEYS.CAREERS);
        const idx = all.findIndex(j => j.id === id);
        if (idx !== -1) all[idx].isActive = !all[idx].isActive;
        saveAll(KEYS.CAREERS, all);
        toast.success('Updated!');
        reload();
    };

    const addReq = () => {
        if (!reqInput.trim()) return;
        setForm(prev => ({ ...prev, requirements: [...(prev.requirements || []), reqInput.trim()] }));
        setReqInput('');
    };

    const removeReq = (i: number) => setForm(prev => ({ ...prev, requirements: prev.requirements?.filter((_, idx) => idx !== i) }));

    const handleSave = () => {
        const job: Career = {
            id: genId(), title: form.title || '', department: form.department || '', location: form.location || 'Remote',
            type: form.type || 'Full-time', description: form.description || '', requirements: form.requirements || [],
            isActive: true, postedAt: new Date().toISOString().slice(0, 10),
        };
        addItem<Career>(KEYS.CAREERS, job);
        toast.success('Job posted!');
        setShowModal(false);
        setForm(emptyJob);
        setReqInput('');
        reload();
    };

    return (
        <DashboardLayout navItems={adminNav} title="Career Listings" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Careers – Admin | ScalerHouse</title></Head>
            <div className="flex justify-end mb-5">
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm"><Plus size={15} /> Post Job</button>
            </div>

            <div className="space-y-4">
                {jobs.length === 0 ? (
                    <div className="text-center text-slate-500 py-16">No jobs posted.</div>
                ) : jobs.map(job => (
                    <div key={job.id} className={`glass-card p-5 ${!job.isActive ? 'opacity-50' : ''}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-white">{job.title}</h3>
                                <div className="flex gap-2 mt-1 mb-2">
                                    <span className="badge badge-blue text-xs">{job.department}</span>
                                    <span className="badge badge-cyan text-xs">{job.type}</span>
                                    <span className="text-slate-500 text-xs">{job.location}</span>
                                </div>
                                <p className="text-slate-400 text-sm">{job.description}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Link href={`/admin/applications?careerId=${job.id}`}
                                    className="flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/20 rounded-lg px-3 py-1.5 hover:bg-cyan-400/10 transition-all">
                                    <Users size={12} /> View Applicants
                                </Link>
                                <button onClick={() => toggleActive(job.id)} className={job.isActive ? 'text-cyan-400' : 'text-slate-500'}>
                                    {job.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                </button>
                                <button onClick={() => { if (confirm('Delete job?')) { deleteItem<Career>(KEYS.CAREERS, job.id); reload(); toast.success('Deleted'); } }} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Post New Job</h3>
                        <div className="space-y-4">
                            <div><label className="form-label">Job Title</label><input className="form-input !text-sm" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior SEO Specialist" /></div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div><label className="form-label">Department</label><input className="form-input !text-sm" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Digital Marketing" /></div>
                                <div><label className="form-label">Location</label><input className="form-input !text-sm" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote / Kanpur" /></div>
                            </div>
                            <div>
                                <label className="form-label">Type</label>
                                <select className="form-input !text-sm" value={form.type || 'Full-time'} onChange={e => setForm({ ...form, type: e.target.value as Career['type'] })}>
                                    {['Full-time', 'Part-time', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div><label className="form-label">Description</label><textarea className="form-input !h-24 resize-none !text-sm" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            <div>
                                <label className="form-label">Requirements</label>
                                <div className="flex gap-2 mb-2">
                                    <input className="form-input !text-sm flex-1" placeholder="e.g. 3+ years experience" value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addReq()} />
                                    <button type="button" onClick={addReq} className="btn-outline !py-2 !px-3 !text-xs">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(form.requirements || []).map((r, i) => (
                                        <span key={i} className="badge badge-blue cursor-pointer hover:badge-red" onClick={() => removeReq(i)}>{r} ×</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} className="btn-glow flex-1 justify-center !py-3">Post Job</button>
                                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(CareersAdminPage, ['admin']);
