// pages/career.tsx – Enhanced Career Page with Resume Upload
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Send, Upload, X, CheckCircle, Linkedin, Globe, DollarSign, FileText, ChevronRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import toast from 'react-hot-toast';

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

const perks = ['Remote-friendly culture', 'Learning & development budget', 'Performance bonuses', 'Health benefits', 'Flexible hours', '5-day work week'];

const defaultForm = { name: '', email: '', phone: '', linkedIn: '', portfolio: '', expectedCTC: '', coverLetter: '' };

export default function CareerPage() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [selectedJob, setSelectedJob] = useState<Career | null>(null);
    const [form, setForm] = useState(defaultForm);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/careers')
            .then(r => r.json())
            .then(data => setJobs(Array.isArray(data) ? data.filter((j: Career) => j.isActive) : []))
            .catch(() => setJobs([]));
    }, []);

    const handleFileSelect = (file: File) => {
        if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max size is 5MB.'); return; }
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(ext || '')) { toast.error('Only PDF, DOC, or DOCX files allowed.'); return; }
        setResumeFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) { toast.error('Please upload your resume.'); return; }
        if (!selectedJob) return;

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('careerId', selectedJob._id);
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            fd.append('resume', resumeFile);

            const res = await fetch('/api/applications', { method: 'POST', body: fd });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Submission failed');
            setSubmitted(true);
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        setSelectedJob(null);
        setSubmitted(false);
        setForm(defaultForm);
        setResumeFile(null);
    };

    const typeBadge = (type: string) => {
        if (type === 'Full-time') return 'badge-blue';
        if (type === 'Remote') return 'badge-green';
        if (type === 'Internship') return 'badge-purple';
        return 'badge-yellow';
    };

    return (
        <>
            <Head>
                <title>Careers at ScalerHouse – Join Our Growth Team</title>
                <meta name="description" content="Join ScalerHouse and help ambitious brands scale. Explore open positions in SEO, Performance Marketing, Social Media, and more." />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            <section className="hero-bg grid-bg pt-32 pb-16">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <span className="badge badge-blue mb-4">Join Our Team</span>
                    <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5">
                        Grow With <span className="gradient-text">ScalerHouse</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
                        We&apos;re building a team of ambitious, creative, and data-driven professionals. If you want to grow fast and make a real impact, we want you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {perks.map(p => (
                            <span key={p} className="badge badge-cyan">{p}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[#0a1222]">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-syne font-bold text-3xl text-white mb-8 text-center">Open Positions</h2>

                    {jobs.length === 0 ? (
                        <div className="text-center text-slate-500 py-16">No open positions right now. Check back soon!</div>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map((job, i) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="glass-card-hover p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-white text-lg">{job.title}</h3>
                                                <span className={`badge ${typeBadge(job.type)}`}>{job.type}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                                                <span className="flex items-center gap-1"><Briefcase size={13} />{job.department}</span>
                                                <span className="flex items-center gap-1"><MapPin size={13} />{job.location}</span>
                                                <span className="flex items-center gap-1"><Clock size={13} />{new Date(job.postedAt).toLocaleDateString('en-IN')}</span>
                                                {job.salary && <span className="flex items-center gap-1 text-green-400"><DollarSign size={13} />{job.salary}</span>}
                                            </div>
                                            <div className="prose-career mt-2">
                                                <ReactMarkdown
                                                    components={{
                                                        h3: ({ children }) => <h4 className="text-white font-semibold text-sm mt-3 mb-1">{children}</h4>,
                                                        p: ({ children }) => <p className="text-slate-400 text-sm mb-1">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc pl-4 text-slate-400 text-sm space-y-0.5 mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal pl-4 text-slate-400 text-sm space-y-0.5 mb-2">{children}</ol>,
                                                        li: ({ children }) => <li>{children}</li>,
                                                        strong: ({ children }) => <strong className="text-slate-200">{children}</strong>,
                                                        hr: () => <hr className="border-white/10 my-2" />,
                                                    }}
                                                >
                                                    {job.description}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedJob(job); setSubmitted(false); setForm(defaultForm); setResumeFile(null); }}
                                            className="btn-glow !py-2.5 !px-5 !text-sm shrink-0"
                                        >
                                            Apply Now <ArrowRight size={14} />
                                        </button>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.requirements.map(req => (
                                            <span key={req} className="badge badge-blue text-xs">{req}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 glass-card p-6 text-center">
                        <p className="text-slate-300 mb-2">Don&apos;t see a role that fits?</p>
                        <p className="text-slate-400 text-sm mb-4">Send us your CV. We&apos;re always open to exceptional talent.</p>
                        <a href="mailto:careers@scalerhouse.com" className="btn-outline !py-2.5 !px-6 !text-sm">
                            <Send size={14} /> careers@scalerhouse.com
                        </a>
                    </div>
                </div>
            </section>

            {/* Apply Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.92, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="modal-box !max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    /* ── Success State ── */
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle size={40} className="text-green-400" />
                                        </div>
                                        <h3 className="font-syne font-black text-2xl text-white mb-3">Application Submitted!</h3>
                                        <p className="text-slate-400 mb-2">We&apos;ve received your application for</p>
                                        <p className="text-cyan-400 font-semibold text-lg mb-6">{selectedJob.title}</p>
                                        <div className="glass-card p-5 text-left mb-6 space-y-3">
                                            {[
                                                ['📧', 'Confirmation email sent to your inbox'],
                                                ['📋', 'Our talent team reviews within 3–5 days'],
                                                ['📞', 'Shortlisted candidates get a screening call'],
                                            ].map(([icon, text]) => (
                                                <div key={text} className="flex items-center gap-3 text-slate-400 text-sm">
                                                    <span>{icon}</span><span>{text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={closeModal} className="btn-glow !py-2.5 !px-8">
                                            Close <X size={14} />
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* ── Application Form ── */
                                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3 className="font-syne font-bold text-xl text-white mb-1">Apply for: {selectedJob.title}</h3>
                                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                                    <Briefcase size={12} />{selectedJob.department}
                                                    <span className="text-slate-600">·</span>
                                                    <MapPin size={12} />{selectedJob.location}
                                                </p>
                                            </div>
                                            <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors p-1">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <form onSubmit={handleApply} className="space-y-4">
                                            {/* Personal Info */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label className="form-label">Full Name *</label>
                                                    <input className="form-input" required value={form.name}
                                                        onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Full Name" />
                                                </div>
                                                <div>
                                                    <label className="form-label">Email *</label>
                                                    <input type="email" className="form-input" required value={form.email}
                                                        onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                                                </div>
                                                <div>
                                                    <label className="form-label">Phone</label>
                                                    <input className="form-input" value={form.phone}
                                                        onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                                                </div>
                                            </div>

                                            {/* Professional Links */}
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="form-label flex items-center gap-1.5"><Linkedin size={13} />LinkedIn Profile</label>
                                                    <input className="form-input" value={form.linkedIn}
                                                        onChange={e => setForm({ ...form, linkedIn: e.target.value })} placeholder="linkedin.com/in/yourprofile" />
                                                </div>
                                                <div>
                                                    <label className="form-label flex items-center gap-1.5"><Globe size={13} />Portfolio / Website</label>
                                                    <input className="form-input" value={form.portfolio}
                                                        onChange={e => setForm({ ...form, portfolio: e.target.value })} placeholder="yourportfolio.com" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label flex items-center gap-1.5"><DollarSign size={13} />Expected CTC (Per Annum)</label>
                                                <input className="form-input" value={form.expectedCTC}
                                                    onChange={e => setForm({ ...form, expectedCTC: e.target.value })} placeholder="e.g. ₹4.5 LPA" />
                                            </div>

                                            {/* Resume Upload */}
                                            <div>
                                                <label className="form-label flex items-center gap-1.5"><FileText size={13} />Resume / CV *</label>
                                                <div
                                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                                    onDragLeave={() => setDragOver(false)}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileRef.current?.click()}
                                                    className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 text-center
                                                        ${dragOver ? 'border-cyan-400 bg-cyan-400/5' : resumeFile ? 'border-green-400/50 bg-green-400/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}
                                                >
                                                    <input
                                                        ref={fileRef}
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                                                    />
                                                    {resumeFile ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <CheckCircle size={20} className="text-green-400" />
                                                            <div className="text-left">
                                                                <p className="text-white text-sm font-medium">{resumeFile.name}</p>
                                                                <p className="text-slate-500 text-xs">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                            <button type="button" onClick={e => { e.stopPropagation(); setResumeFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                                                                className="ml-auto text-slate-400 hover:text-red-400 transition-colors">
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                                                            <p className="text-slate-300 text-sm font-medium">Drop your resume here or <span className="text-cyan-400">browse</span></p>
                                                            <p className="text-slate-500 text-xs mt-1">PDF, DOC, or DOCX · Max 5MB</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label">Why should we hire you?</label>
                                                <textarea className="form-input !h-28 resize-none" value={form.coverLetter}
                                                    onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                                                    placeholder="Tell us about your experience and why you're a great fit..." />
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button type="submit" disabled={submitting}
                                                    className="btn-glow flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                                                    {submitting ? (
                                                        <span className="flex items-center gap-2">
                                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                            </svg>
                                                            Submitting...
                                                        </span>
                                                    ) : (
                                                        <>Submit Application <ChevronRight size={15} /></>
                                                    )}
                                                </button>
                                                <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
