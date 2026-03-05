// pages/admin/applications.tsx – Admin Applications Management Dashboard
import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import {
    Search, Filter, Download, Eye, Check, X, ExternalLink, FileText,
    User, Mail, Phone, Linkedin, Globe, DollarSign, StickyNote,
    UserCheck, AlertTriangle, Clock, Star, Send, FileCheck
} from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/applications', label: 'Applications', icon: '📝' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];

const STATUSES = ['New', 'Shortlisted', 'On Hold', 'Interview Scheduled', 'Selected', 'Rejected'] as const;
type AppStatus = typeof STATUSES[number];

const statusConfig: Record<AppStatus, { color: string; icon: React.ReactNode; bg: string }> = {
    'New': { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: <Clock size={12} /> },
    'Shortlisted': { color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20', icon: <Star size={12} /> },
    'On Hold': { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: <AlertTriangle size={12} /> },
    'Interview Scheduled': { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', icon: <User size={12} /> },
    'Selected': { color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: <Check size={12} /> },
    'Rejected': { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: <X size={12} /> },
};

interface Application {
    _id: string;
    careerId: string;
    jobTitle: string;
    name: string;
    email: string;
    phone?: string;
    linkedIn?: string;
    portfolio?: string;
    expectedCTC?: string;
    coverLetter?: string;
    resumeUrl?: string;
    resumeFileName?: string;
    status: AppStatus;
    notes?: string;
    docsSubmitted?: boolean;
    appliedAt: string;
}

// Fix Cloudinary raw URL so the browser opens the PDF inline instead of downloading
function getPdfViewUrl(url: string): string {
    if (!url) return url;
    try {
        // For Cloudinary raw resources: replace /raw/upload/ with /image/upload/fl_attachment:false/
        if (url.includes('/raw/upload/')) {
            return url.replace('/raw/upload/', '/image/upload/fl_attachment:false/');
        }
        // Also handle already-transformed URLs: ensure fl_attachment:false is present
        if (url.includes('cloudinary.com') && !url.includes('fl_attachment')) {
            return url + '?fl_attachment=false';
        }
        return url;
    } catch {
        return url;
    }
}

function ApplicationsAdminPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selected, setSelected] = useState<Application | null>(null);
    const [notes, setNotes] = useState('');
    const [hireModal, setHireModal] = useState<Application | null>(null);
    const [hireForm, setHireForm] = useState({ joiningDate: '', role: '', department: '' });
    const [hiring, setHiring] = useState(false);
    const [sendingLink, setSendingLink] = useState(false);

    // Interview scheduling modal state
    const [interviewModal, setInterviewModal] = useState<Application | null>(null);
    const [interviewForm, setInterviewForm] = useState({ interviewDate: '', interviewTime: '', interviewLink: '', adminNotes: '' });

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            const r = await fetch(`/api/applications?${params}`);
            const data = await r.json();
            setApplications(Array.isArray(data.applications) ? data.applications : []);
            setTotal(data.total || 0);
        } catch {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const updateStatus = async (id: string, status: AppStatus, extra?: Record<string, string>) => {
        const r = await fetch(`/api/applications/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, ...extra }),
        });
        if (!r.ok) { toast.error('Status update failed'); return; }
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
        if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : null);
        toast.success(`📧 Status updated to "${status}" — email sent to candidate`);
    };

    const handleInterviewSchedule = async () => {
        if (!interviewModal) return;
        await updateStatus(interviewModal._id, 'Interview Scheduled', interviewForm);
        setInterviewModal(null);
        setInterviewForm({ interviewDate: '', interviewTime: '', interviewLink: '', adminNotes: '' });
    };

    const saveNotes = async () => {
        if (!selected) return;
        await fetch(`/api/applications/${selected._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
        });
        setApplications(prev => prev.map(a => a._id === selected._id ? { ...a, notes } : a));
        toast.success('Notes saved');
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Delete this application permanently?')) return;
        await fetch(`/api/applications/${id}`, { method: 'DELETE' });
        setApplications(prev => prev.filter(a => a._id !== id));
        if (selected?._id === id) setSelected(null);
        toast.success('Application deleted');
    };

    const sendOnboardingLink = async () => {
        if (!selected) return;
        setSendingLink(true);
        try {
            const r = await fetch('/api/applications/send-onboarding-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: selected._id }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error);
            toast.success(`✅ Document submission link sent to ${selected.email}`);
        } catch (e: any) {
            toast.error(e.message || 'Failed to send link');
        } finally {
            setSendingLink(false);
        }
    };

    const handleHire = async () => {
        if (!hireModal) return;
        setHiring(true);
        try {
            const r = await fetch('/api/applications/hire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: hireModal._id, ...hireForm }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error);
            toast.success(`🎉 ${hireModal.name} hired! Credentials sent to their email.`);
            setHireModal(null);
            fetchApplications();
        } catch (e: any) {
            toast.error(e.message || 'Hire failed');
        } finally {
            setHiring(false);
        }
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Job Title', 'Expected CTC', 'LinkedIn', 'Status', 'Docs Submitted', 'Applied Date', 'Resume'];
        const rows = applications.map(a => [
            a.name, a.email, a.phone || '', a.jobTitle, a.expectedCTC || '',
            a.linkedIn || '', a.status, a.docsSubmitted ? 'Yes' : 'No',
            new Date(a.appliedAt).toLocaleDateString('en-IN'),
            a.resumeUrl || ''
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
        const csv = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `applications_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
        toast.success('CSV exported successfully');
    };

    const stats = STATUSES.reduce((acc, s) => { acc[s] = applications.filter(a => a.status === s).length; return acc; }, {} as Record<string, number>);

    return (
        <DashboardLayout navItems={adminNav} title="Job Applications" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Applications – Admin | ScalerHouse</title></Head>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {STATUSES.map(s => {
                    const cfg = statusConfig[s];
                    return (
                        <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                            className={`glass-card p-3 text-center cursor-pointer transition-all border ${statusFilter === s ? cfg.bg + ' ' + cfg.color : 'border-slate-700/50 hover:border-slate-600'}`}>
                            <div className={`text-2xl font-bold ${cfg.color}`}>{stats[s] || 0}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{s}</div>
                        </button>
                    );
                })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="form-input !pl-9 !py-2 !text-sm" placeholder="Search by name or email..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="relative">
                    <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <select className="form-input !pl-8 !py-2 !text-sm !w-auto pr-8" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={exportCSV} className="btn-outline !py-2 !px-4 !text-sm flex items-center gap-2">
                    <Download size={14} /> Export CSV
                </button>
            </div>

            <div className="flex gap-4">
                {/* Applications Table */}
                <div className={`flex-1 min-w-0 ${selected ? 'hidden lg:block' : ''}`}>
                    {loading ? (
                        <div className="text-center text-slate-500 py-16">Loading...</div>
                    ) : applications.length === 0 ? (
                        <div className="text-center text-slate-500 py-16 glass-card">No applications found.</div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-slate-500 text-xs mb-3">{total} total applications</div>
                            {applications.map(app => {
                                const cfg = statusConfig[app.status];
                                return (
                                    <div key={app._id}
                                        className={`glass-card p-4 cursor-pointer transition-all hover:border-slate-600 ${selected?._id === app._id ? 'border-cyan-400/40 bg-cyan-400/5' : ''}`}
                                        onClick={() => { setSelected(app); setNotes(app.notes || ''); }}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-white font-semibold text-sm">{app.name}</span>
                                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                                                        {cfg.icon}{app.status}
                                                    </span>
                                                    {app.docsSubmitted && (
                                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-emerald-400/10 border-emerald-400/20 text-emerald-400">
                                                            <FileCheck size={10} /> Docs Submitted
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-slate-400 text-xs mt-1 truncate">{app.email}</div>
                                                <div className="text-cyan-400 text-xs mt-0.5 font-medium">{app.jobTitle}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-slate-500 text-xs">{new Date(app.appliedAt).toLocaleDateString('en-IN')}</div>
                                                {app.resumeUrl && (
                                                    <a href={getPdfViewUrl(app.resumeUrl)} target="_blank" rel="noreferrer"
                                                        onClick={e => e.stopPropagation()}
                                                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-1">
                                                        <FileText size={11} /> Resume
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="w-full lg:w-96 shrink-0 glass-card p-5 h-fit sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-syne font-bold text-white">Candidate Details</h3>
                            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                        </div>

                        {/* Avatar */}
                        <div className="text-center mb-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                                {selected.name.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="text-white font-bold text-lg">{selected.name}</h4>
                            <p className="text-cyan-400 text-sm">{selected.jobTitle}</p>
                            {selected.docsSubmitted && (
                                <span className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-full border bg-emerald-400/10 border-emerald-400/20 text-emerald-400">
                                    <FileCheck size={11} /> Documentation Complete
                                </span>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-5">
                            {[
                                [<Mail size={13} />, selected.email, `mailto:${selected.email}`],
                                [<Phone size={13} />, selected.phone, null],
                                [<Linkedin size={13} />, selected.linkedIn ? 'LinkedIn Profile' : null, selected.linkedIn],
                                [<Globe size={13} />, selected.portfolio ? 'Portfolio' : null, selected.portfolio],
                                [<DollarSign size={13} />, selected.expectedCTC ? `CTC: ${selected.expectedCTC}` : null, null],
                            ].filter(([, val]) => val).map(([icon, label, href], i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <span className="text-slate-500">{icon}</span>
                                    {href ? (
                                        <a href={href as string} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate">{label}</a>
                                    ) : (
                                        <span className="text-slate-300 truncate">{label}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="text-xs text-slate-500 mb-5">Applied on {new Date(selected.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>

                        {/* Resume — opens as PDF in browser */}
                        {selected.resumeUrl && (
                            <a href={getPdfViewUrl(selected.resumeUrl)} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 glass-card !p-3 hover:border-cyan-400/30 transition-all mb-4 text-sm text-cyan-400">
                                <FileText size={15} />
                                <span className="flex-1 truncate">{selected.resumeFileName || 'View Resume (PDF)'}</span>
                                <ExternalLink size={13} className="shrink-0" />
                            </a>
                        )}

                        {/* Cover Letter */}
                        {selected.coverLetter && (
                            <div className="mb-4">
                                <label className="form-label">Cover Letter</label>
                                <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/50 rounded-lg p-3">{selected.coverLetter}</p>
                            </div>
                        )}

                        {/* Status Changer */}
                        <div className="mb-4">
                            <label className="form-label">Update Status <span className="text-slate-500 font-normal">(sends email)</span></label>
                            <div className="grid grid-cols-2 gap-2">
                                {STATUSES.map(s => {
                                    const cfg = statusConfig[s];
                                    return (
                                        <button key={s}
                                            onClick={() => {
                                                if (s === 'Interview Scheduled') {
                                                    setInterviewModal(selected);
                                                } else {
                                                    updateStatus(selected._id, s);
                                                }
                                            }}
                                            className={`text-xs py-2 px-3 rounded-lg border transition-all font-medium ${selected.status === s ? cfg.bg + ' ' + cfg.color + ' border-current' : 'text-slate-400 border-slate-700 hover:border-slate-500'}`}>
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-4">
                            <label className="form-label flex items-center gap-1.5"><StickyNote size={12} />Admin Notes</label>
                            <textarea className="form-input !h-20 resize-none !text-sm" value={notes}
                                onChange={e => setNotes(e.target.value)} placeholder="Add private notes about this candidate..." />
                            <button onClick={saveNotes} className="btn-outline !py-1.5 !px-4 !text-xs mt-2">Save Notes</button>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/50">
                            {/* Send Document Submission Link — only when Selected */}
                            {selected.status === 'Selected' && (
                                <button
                                    onClick={sendOnboardingLink}
                                    disabled={sendingLink}
                                    className="flex items-center justify-center gap-2 text-sm font-semibold bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 rounded-lg py-2.5 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                >
                                    <Send size={14} /> {sendingLink ? 'Sending...' : 'Send Document Submission Link'}
                                </button>
                            )}

                            {/* Hire button — always show if not Rejected */}
                            {selected.status !== 'Rejected' && selected.status !== 'New' && (
                                <button onClick={() => { setHireModal(selected); setHireForm({ joiningDate: '', role: selected.jobTitle, department: '' }); }}
                                    className="btn-glow !py-2 !text-sm justify-center">
                                    <UserCheck size={15} /> Hire This Candidate
                                </button>
                            )}
                            <button onClick={() => deleteApplication(selected._id)}
                                className="flex items-center justify-center gap-2 text-sm text-red-400 border border-red-400/20 rounded-lg py-2 hover:bg-red-400/10 transition-all">
                                <X size={14} /> Delete Application
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Interview Scheduling Modal */}
            {interviewModal && (
                <div className="modal-overlay" onClick={() => setInterviewModal(null)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">📅</div>
                            <h3 className="font-syne font-bold text-xl text-white">Schedule Interview</h3>
                            <p className="text-slate-400 text-sm mt-1">An interview invite will be sent to <span className="text-cyan-400">{interviewModal.email}</span></p>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Date</label>
                                    <input type="date" className="form-input !text-sm" value={interviewForm.interviewDate}
                                        onChange={e => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">Time</label>
                                    <input type="time" className="form-input !text-sm" value={interviewForm.interviewTime}
                                        onChange={e => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Meeting Link (optional)</label>
                                <input className="form-input !text-sm" value={interviewForm.interviewLink}
                                    onChange={e => setInterviewForm({ ...interviewForm, interviewLink: e.target.value })}
                                    placeholder="https://meet.google.com/..." />
                            </div>
                            <div>
                                <label className="form-label">Note to Candidate (optional)</label>
                                <textarea rows={2} className="form-input resize-none !text-sm" value={interviewForm.adminNotes}
                                    onChange={e => setInterviewForm({ ...interviewForm, adminNotes: e.target.value })}
                                    placeholder="Any preparation tips or instructions..." />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleInterviewSchedule} className="btn-glow flex-1 justify-center">
                                📧 Send Interview Invite
                            </button>
                            <button onClick={() => setInterviewModal(null)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hire Modal */}
            {hireModal && (
                <div className="modal-overlay" onClick={() => setHireModal(null)}>
                    <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">🎉</div>
                            <h3 className="font-syne font-bold text-xl text-white">Hire {hireModal.name}?</h3>
                            <p className="text-slate-400 text-sm mt-1">This will create an employee account and send login credentials.</p>
                            {hireModal.docsSubmitted && (
                                <div className="mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                                    <FileCheck size={11} /> Documents already on file
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Role / Designation</label>
                                <input className="form-input !text-sm" value={hireForm.role}
                                    onChange={e => setHireForm({ ...hireForm, role: e.target.value })} placeholder="e.g. SEO Specialist" />
                            </div>
                            <div>
                                <label className="form-label">Department</label>
                                <input className="form-input !text-sm" value={hireForm.department}
                                    onChange={e => setHireForm({ ...hireForm, department: e.target.value })} placeholder="e.g. Digital Marketing" />
                            </div>
                            <div>
                                <label className="form-label">Joining Date</label>
                                <input type="date" className="form-input !text-sm" value={hireForm.joiningDate}
                                    onChange={e => setHireForm({ ...hireForm, joiningDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleHire} disabled={hiring}
                                className="btn-glow flex-1 justify-center disabled:opacity-60">
                                {hiring ? 'Hiring...' : '✅ Confirm & Send Credentials'}
                            </button>
                            <button onClick={() => setHireModal(null)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ApplicationsAdminPage, ['admin']);
