// pages/affiliate/register.tsx
import Head from 'next/head';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, ArrowRight, DollarSign, Users, BarChart2, Shield } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WhatsAppFAB from '../../components/layout/WhatsAppFAB';
import { addItem, genId, KEYS, Affiliate, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';

const perks = [
    { icon: DollarSign, title: 'Up to 15% Commission', desc: 'Earn a percentage of every deal you close through your referral link.' },
    { icon: Users, title: 'Unlimited Referrals', desc: 'No cap on referrals. Refer as many clients as you like.' },
    { icon: BarChart2, title: 'Real-Time Dashboard', desc: 'Track your leads, commissions, and payouts in a dedicated dashboard.' },
    { icon: Shield, title: 'Secure & Transparent', desc: 'Every transaction is logged. Payouts via bank transfer or UPI.' },
];

export default function AffiliateRegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', pan: '', bank: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const affiliate: Affiliate = {
            id: genId(),
            name: form.name,
            email: form.email,
            phone: form.phone,
            pan: form.pan,
            bank: form.bank,
            status: 'Pending',
            walletBalance: 0,
            leads: [],
            payouts: [],
            createdAt: new Date().toISOString(),
        };
        addItem<Affiliate>(KEYS.AFFILIATES, affiliate);
        logActivity(`New affiliate registration: ${form.name} (${form.email})`, 'Affiliate Form');
        toast.success('Registration submitted! Admin will review and activate your account.');
        setSubmitted(true);
    };

    return (
        <>
            <Head>
                <title>Affiliate Program – ScalerHouse | Earn 15% Commission</title>
                <meta name="description" content="Join the ScalerHouse Affiliate Program. Earn up to 15% commission on every deal you refer. Register today." />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            <section className="hero-bg grid-bg pt-32 pb-16">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <span className="badge badge-yellow mb-4">Affiliate Program</span>
                            <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5">
                                Earn Up To<br /><span className="gradient-text">15% Commission</span><br />Per Referral
                            </h1>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                No selling required. Simply refer brands that need digital marketing help — we close the deal and you earn commissions automatically.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {perks.map((p) => (
                                    <div key={p.title} className="glass-card p-4">
                                        <p.icon size={20} className="text-cyan-400 mb-2" />
                                        <h3 className="font-semibold text-white text-sm mb-1">{p.title}</h3>
                                        <p className="text-slate-400 text-xs">{p.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* How it works */}
                            <div className="mt-8">
                                <p className="text-slate-400 text-sm font-medium mb-4">How it works:</p>
                                <div className="space-y-3">
                                    {[
                                        'Register below and submit your details',
                                        'Admin approves your account (within 24 hours)',
                                        'Share your referral link or submit leads from dashboard',
                                        'Sales team closes the deal',
                                        'Commission is auto-calculated and added to your wallet',
                                        'Request payout anytime via bank transfer or UPI',
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">{i + 1}</div>
                                            <span className="text-slate-300 text-sm">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <div>
                            {submitted ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="glass-card p-10 text-center"
                                >
                                    <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
                                    <h3 className="font-syne font-bold text-2xl text-white mb-3">Registration Received!</h3>
                                    <p className="text-slate-400 mb-6">Our team will review your application and activate your affiliate account within 24 hours.</p>
                                    <Link href="/login" className="btn-glow">
                                        Go to Login <ArrowRight size={16} />
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-8"
                                >
                                    <div className="flex items-center gap-2 mb-6">
                                        <UserPlus size={20} className="text-cyan-400" />
                                        <h2 className="font-syne font-bold text-xl text-white">Affiliate Registration</h2>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="form-label">Full Name *</label>
                                            <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your Full Name" />
                                        </div>
                                        <div>
                                            <label className="form-label">Email Address *</label>
                                            <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                                        </div>
                                        <div>
                                            <label className="form-label">WhatsApp / Phone *</label>
                                            <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                        <div>
                                            <label className="form-label">PAN Number (for payout)</label>
                                            <input className="form-input" value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} placeholder="ABCDE1234F" />
                                        </div>
                                        <div>
                                            <label className="form-label">Bank / UPI for payouts</label>
                                            <input className="form-input" value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} placeholder="Bank name or UPI ID" />
                                        </div>
                                        <button type="submit" className="btn-glow w-full justify-center !py-4">
                                            <UserPlus size={16} /> Register as Affiliate
                                        </button>
                                    </form>
                                    <p className="text-slate-500 text-xs text-center mt-4">Already registered? <Link href="/login" className="text-cyan-400">Login here</Link></p>
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
