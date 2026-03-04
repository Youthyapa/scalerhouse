// pages/career.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Send } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { getAll, KEYS, Career } from '../lib/store';
import toast from 'react-hot-toast';

const perks = ['Remote-friendly culture', 'Learning & development budget', 'Performance bonuses', 'Health benefits', 'Flexible hours', '5-day work week'];

export default function CareerPage() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [selectedJob, setSelectedJob] = useState<Career | null>(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });

    useEffect(() => {
        setJobs(getAll<Career>(KEYS.CAREERS).filter(j => j.isActive));
    }, []);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Application submitted! We\'ll be in touch within 5 days.');
        setSelectedJob(null);
        setForm({ name: '', email: '', phone: '', coverLetter: '' });
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
                                    key={job.id}
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
                                            </div>
                                            <p className="text-slate-400 text-sm mt-2">{job.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedJob(job)}
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
            {selectedJob && (
                <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="modal-box"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="font-syne font-bold text-xl text-white mb-1">Apply for: {selectedJob.title}</h3>
                        <p className="text-slate-400 text-sm mb-6">{selectedJob.department} · {selectedJob.location}</p>
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="form-label">Full Name *</label>
                                <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Name" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Email *</label>
                                    <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                                </div>
                                <div>
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Why should we hire you?</label>
                                <textarea className="form-input !h-28 resize-none" value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} placeholder="Tell us about your experience and why you're a great fit..." />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-glow flex-1 justify-center">Submit Application</button>
                                <button type="button" onClick={() => setSelectedJob(null)} className="btn-outline">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <Footer />
        </>
    );
}
