// pages/contact.tsx
import Head from 'next/head';
import SEO from '../components/seo/SEO';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { addItem, genId, KEYS, Lead, logActivity } from '../lib/store';
import toast from 'react-hot-toast';

const services = ['SEO & Content Marketing', 'Performance Ads', 'Social Media', 'Web Design', 'Email Marketing', 'Brand Strategy', 'Full Growth Package'];

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const lead: Lead = {
            id: genId(),
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            service: form.service,
            budget: form.budget,
            status: 'New',
            source: 'Website',
            score: 65,
            notes: form.message,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addItem<Lead>(KEYS.LEADS, lead);
        logActivity(`New lead from website: ${form.name} (${form.company})`, 'Website Form');
        toast.success('Proposal request submitted!');
        setSubmitted(true);
    };

    return (
        <>
            <SEO 
                title="Get Free Proposal – ScalerHouse"
                description="Get your free custom digital marketing proposal from ScalerHouse. Fill the form or WhatsApp us directly."
            />
            <Navbar />
            <WhatsAppFAB />

            <section className="hero-bg grid-bg pt-32 pb-20">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <span className="badge badge-green mb-4">Free Proposal</span>
                        <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-4">
                            Let&apos;s Build Your <span className="gradient-text">Growth Engine</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl mx-auto">Tell us about your business and we&apos;ll send you a custom growth proposal within 24 hours.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: 'Email Us', val: 'hello@scalerhouse.com', href: 'mailto:hello@scalerhouse.com' },
                                { icon: Phone, label: 'Call/WhatsApp', val: '+91 98765 43210', href: 'tel:+919876543210' },
                                { icon: MapPin, label: 'Visit Us', val: 'B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, Uttar Pradesh 208022', href: '#' },
                            ].map((item) => (
                                <a key={item.label} href={item.href} className="glass-card-hover p-5 flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                                        <item.icon size={18} className="text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs">{item.label}</p>
                                        <p className="text-white font-medium text-sm">{item.val}</p>
                                    </div>
                                </a>
                            ))}

                            <div className="glass-card p-5">
                                <p className="text-white font-semibold mb-2">Response Time</p>
                                <p className="text-slate-400 text-sm">We reply to all inquiries within <span className="text-cyan-400 font-semibold">24 hours</span>. Proposal delivered in <span className="text-cyan-400 font-semibold">48 hours</span>.</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2">
                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-card p-10 text-center"
                                >
                                    <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                                    <h3 className="font-syne font-bold text-2xl text-white mb-3">Proposal Request Received!</h3>
                                    <p className="text-slate-400 mb-6">You&apos;ll hear from us within 24 hours. Meanwhile, check out our case studies.</p>
                                    <a href="/case-studies" className="btn-glow">
                                        View Case Studies <ArrowRight size={16} />
                                    </a>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8"
                                >
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Full Name *</label>
                                                <input className="form-input" placeholder="Your Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="form-label">Email *</label>
                                                <input type="email" className="form-input" placeholder="you@company.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="form-label">Phone *</label>
                                                <input className="form-input" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="form-label">Company</label>
                                                <input className="form-input" placeholder="Your Company Name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="form-label">Service Needed</label>
                                                <select className="form-input" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                                                    <option value="">Select a service...</option>
                                                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label">Monthly Budget</label>
                                                <select className="form-input" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                                                    <option value="">Select budget...</option>
                                                    <option>Below ₹20,000</option>
                                                    <option>₹20,000 – ₹50,000</option>
                                                    <option>₹50,000 – ₹1,00,000</option>
                                                    <option>₹1,00,000+</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Tell us about your goals</label>
                                            <textarea className="form-input !h-28 resize-none" placeholder="What do you want to achieve? What challenges are you facing?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-glow w-full justify-center !py-4">
                                            <Send size={16} /> Submit Proposal Request
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
