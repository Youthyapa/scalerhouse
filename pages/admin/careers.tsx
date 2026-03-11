// pages/admin/careers.tsx – Admin Career listings with Markdown editor
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import {
    Plus, Trash2, ToggleLeft, ToggleRight, Users,
    Pencil, Bold, Italic, List, ListOrdered,
    Heading3, Minus, AlignLeft
} from 'lucide-react';
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
    title: '', department: '', location: 'Remote / B-25, Neemeshwar MahaMandir Society, Kanpur',
    type: 'Full-time', salary: '', description: '', requirements: [],
};

// ── Markdown toolbar button ──────────────────────────────────────────────────
function ToolbarBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
            {icon}
        </button>
    );
}

// ── Markdown description editor with toolbar ─────────────────────────────────
function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const wrap = (before: string, after = before, placeholder = 'text') => {
        const el = ref.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.slice(start, end) || placeholder;
        const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
        onChange(newVal);
        // restore cursor
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + before.length, start + before.length + selected.length);
        }, 0);
    };

    const insertLine = (prefix: string) => {
        const el = ref.current;
        if (!el) return;
        const selStart = el.selectionStart;
        const selEnd = el.selectionEnd;

        // Find the start of the first selected line
        const before = value.slice(0, selStart);
        const lineStart = before.lastIndexOf('\n') + 1;

        // Extract the selected block (from line start to selEnd)
        const selectedBlock = value.slice(lineStart, selEnd);

        // Apply prefix to every non-empty line in the selected block
        let counter = 1;
        const replaced = selectedBlock
            .split('\n')
            .map(line => {
                if (!line.trim()) return line; // leave blank lines as-is
                // If prefix is numbered list, auto-increment per line
                if (/^\d+\. $/.test(prefix)) {
                    return `${counter++}. ${line}`;
                }
                return prefix + line;
            })
            .join('\n');

        const newVal = value.slice(0, lineStart) + replaced + value.slice(selEnd);
        onChange(newVal);

        // Restore selection over the newly modified block
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(lineStart, lineStart + replaced.length);
        }, 0);
    };

    const addSeparator = () => {
        const el = ref.current;
        if (!el) return;
        const pos = el.selectionStart;
        const addition = '\n\n---\n\n';
        onChange(value.slice(0, pos) + addition + value.slice(pos));
        setTimeout(() => { el.focus(); el.setSelectionRange(pos + addition.length, pos + addition.length); }, 0);
    };

    const tools = [
        { icon: <Bold size={14} />, label: 'Bold (Ctrl+B)', action: () => wrap('**', '**', 'bold text') },
        { icon: <Italic size={14} />, label: 'Italic', action: () => wrap('*', '*', 'italic text') },
        { icon: <Heading3 size={14} />, label: 'Subheading', action: () => insertLine('### ') },
        { icon: <List size={14} />, label: 'Bullet list item', action: () => insertLine('- ') },
        { icon: <ListOrdered size={14} />, label: 'Numbered list item', action: () => insertLine('1. ') },
        { icon: <Minus size={14} />, label: 'Horizontal separator', action: addSeparator },
    ];

    return (
        <div className="border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-800/80 border-b border-slate-700">
                <AlignLeft size={13} className="text-slate-500 mr-1" />
                <span className="text-slate-500 text-xs mr-2">Format:</span>
                {tools.map(t => (
                    <ToolbarBtn key={t.label} icon={t.icon} label={t.label} onClick={t.action} />
                ))}
                <span className="ml-auto text-slate-600 text-xs">Markdown</span>
            </div>
            {/* Textarea */}
            <textarea
                ref={ref}
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={8}
                placeholder={`Write the job description here...\n\nTips:\n- Use **bold** for emphasis\n- Use ### for section headings (e.g. ### Key Responsibilities)\n- Use - or 1. for bullet/numbered lists\n- Press the toolbar buttons above for quick formatting`}
                className="w-full bg-slate-900/50 text-slate-200 text-sm placeholder:text-slate-600 px-4 py-3 resize-y focus:outline-none font-mono leading-relaxed"
            />
            {/* Preview hint */}
            <div className="px-3 py-1.5 bg-slate-800/50 border-t border-slate-700/50 text-slate-600 text-xs">
                💡 Tip: Use <code className="text-slate-400">### Heading</code>, <code className="text-slate-400">- bullet</code>, <code className="text-slate-400">1. numbered</code>, <code className="text-slate-400">**bold**</code>
            </div>
        </div>
    );
}

// ── Main page ────────────────────────────────────────────────────────────────
function CareersAdminPage() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [reqInput, setReqInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(false);

    const reload = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/careers?all=true');
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch { toast.error('Failed to load jobs'); }
        finally { setLoading(false); }
    };

    useEffect(() => { reload(); }, []);

    const openCreate = () => { setEditingId(null); setForm(emptyForm); setReqInput(''); setPreview(false); setShowModal(true); };
    const openEdit = (job: Career) => {
        setEditingId(job._id);
        setForm({ title: job.title, department: job.department, location: job.location, type: job.type, salary: job.salary || '', description: job.description, requirements: [...job.requirements] });
        setReqInput(''); setPreview(false); setShowModal(true);
    };
    const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm); setReqInput(''); setPreview(false); };

    const toggleActive = async (job: Career) => {
        try {
            await fetch(`/api/careers/${job._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !job.isActive }) });
            toast.success(job.isActive ? 'Job deactivated' : 'Job activated'); reload();
        } catch { toast.error('Failed to update job'); }
    };

    const deleteJob = async (id: string) => {
        if (!confirm('Delete this job posting?')) return;
        try { await fetch(`/api/careers/${id}`, { method: 'DELETE' }); toast.success('Job deleted'); reload(); }
        catch { toast.error('Failed to delete'); }
    };

    const addReq = () => { if (!reqInput.trim()) return; setForm(p => ({ ...p, requirements: [...p.requirements, reqInput.trim()] })); setReqInput(''); };
    const removeReq = (i: number) => setForm(p => ({ ...p, requirements: p.requirements.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.title.trim()) { toast.error('Job title is required'); return; }
        setSaving(true);
        try {
            if (editingId) {
                const res = await fetch(`/api/careers/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                if (!res.ok) throw new Error((await res.json()).error || 'Failed');
                toast.success('Job updated!');
            } else {
                const res = await fetch('/api/careers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, isActive: true, postedAt: new Date().toISOString().slice(0, 10) }) });
                if (!res.ok) throw new Error((await res.json()).error || 'Failed');
                toast.success('Job posted!');
            }
            closeModal(); reload();
        } catch (err: any) { toast.error(err.message || 'Error saving job'); }
        finally { setSaving(false); }
    };

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
                                        {job.salary && <span className="text-green-400 text-xs flex items-center gap-1">₹ {job.salary}</span>}
                                        <span className={`badge text-xs ${job.isActive ? 'badge-green' : 'badge-yellow'}`}>{job.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm line-clamp-2">{job.description.replace(/[#*_\-]/g, '').slice(0, 120)}…</p>
                                    {job.requirements.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {job.requirements.map(r => <span key={r} className="badge badge-blue text-xs">{r}</span>)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1 items-center shrink-0">
                                    <Link href={`/admin/applications?careerId=${job._id}`}
                                        className="flex items-center gap-1.5 text-xs text-cyan-400 border border-cyan-400/20 rounded-lg px-3 py-1.5 hover:bg-cyan-400/10 transition-all mr-1">
                                        <Users size={12} /> Applicants
                                    </Link>
                                    <button onClick={() => openEdit(job)} className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all" title="Edit"><Pencil size={14} /></button>
                                    <button onClick={() => toggleActive(job)} className={job.isActive ? 'text-cyan-400' : 'text-slate-500 p-0.5'} title={job.isActive ? 'Deactivate' : 'Activate'}>
                                        {job.isActive ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                    </button>
                                    <button onClick={() => deleteJob(job._id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Create / Edit Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-box !max-w-3xl w-full mx-4 max-h-[92vh] overflow-y-auto"
                        style={{ scrollbarWidth: 'none' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="font-syne font-bold text-xl text-white mb-5">
                            {editingId ? '✏️ Edit Job' : '+ Post New Job'}
                        </h3>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="form-label">Job Title *</label>
                                <input className="form-input !text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior SEO Specialist" />
                            </div>

                            {/* Dept + Location */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Department</label>
                                    <input className="form-input !text-sm" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="Digital Marketing" />
                                </div>
                                <div>
                                    <label className="form-label">Location</label>
                                    <input className="form-input !text-sm" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Remote / B-25, Neemeshwar MahaMandir Society, Kanpur" />
                                </div>
                            </div>

                            {/* Type + Salary */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Job Type</label>
                                    <select className="form-input !text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        {['Full-time', 'Part-time', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">₹ Salary Range</label>
                                    <input className="form-input !text-sm" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="e.g. ₹3–5 LPA" />
                                </div>
                            </div>

                            {/* Description with Markdown toolbar */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="form-label !mb-0">Description</label>
                                    <button
                                        type="button"
                                        onClick={() => setPreview(p => !p)}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-400/20 rounded px-2 py-0.5"
                                    >
                                        {preview ? '✏️ Edit' : '👁 Preview'}
                                    </button>
                                </div>

                                {preview ? (
                                    /* ── Markdown Preview ── */
                                    <div className="border border-slate-700 rounded-xl p-4 bg-slate-900/50 min-h-[150px] prose prose-invert prose-sm max-w-none">
                                        <style>{`
                                            .job-preview h3 { color: #60a5fa; font-size: 1rem; font-weight: 700; margin: 1rem 0 0.5rem; }
                                            .job-preview p { color: #94a3b8; margin: 0.5rem 0; line-height: 1.7; }
                                            .job-preview ul { list-style: disc; padding-left: 1.25rem; color: #94a3b8; }
                                            .job-preview ol { list-style: decimal; padding-left: 1.25rem; color: #94a3b8; }
                                            .job-preview li { margin: 0.25rem 0; }
                                            .job-preview strong { color: #e2e8f0; }
                                            .job-preview em { color: #a5b4fc; }
                                            .job-preview hr { border-color: rgba(255,255,255,0.1); margin: 1rem 0; }
                                        `}</style>
                                        <div
                                            className="job-preview"
                                            dangerouslySetInnerHTML={{ __html: simpleMarkdown(form.description) }}
                                        />
                                        {!form.description && <p className="text-slate-600 italic">Nothing to preview yet…</p>}
                                    </div>
                                ) : (
                                    <MarkdownEditor value={form.description} onChange={v => setForm({ ...form, description: v })} />
                                )}
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="form-label">Requirements <span className="text-slate-600 text-xs font-normal">(click tag to remove)</span></label>
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

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button onClick={handleSave} disabled={saving} className="btn-glow flex-1 justify-center !py-3 disabled:opacity-60">
                                    {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Post Job'}
                                </button>
                                <button onClick={closeModal} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// Very simple markdown → HTML (only used in admin preview; public uses ReactMarkdown)
function simpleMarkdown(md: string): string {
    return md
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/^---$/gm, '<hr/>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul]|<hr)(.+)$/gm, '<p>$1</p>');
}

export default withAuth(CareersAdminPage, ['admin']);
