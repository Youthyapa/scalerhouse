// pages/about.tsx
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';

const team = [
    { name: 'Rahul Sharma', role: 'Founder & CEO', initials: 'RS', color: 'from-blue-600 to-cyan-500' },
    { name: 'Priya Nair', role: 'Head of Growth', initials: 'PN', color: 'from-purple-600 to-pink-500' },
    { name: 'Amit Verma', role: 'SEO Lead', initials: 'AV', color: 'from-green-600 to-emerald-500' },
    { name: 'Kiran Mehta', role: 'Performance Ads Manager', initials: 'KM', color: 'from-orange-600 to-yellow-500' },
];

const values = [
    { icon: Target, title: 'Results First', desc: 'Every strategy we craft is tied to real, measurable business outcomes. No vanity metrics.' },
    { icon: Users, title: 'Client Partnership', desc: 'We treat your business like our own. Your growth is our success.' },
    { icon: Award, title: 'Excellence', desc: 'We set exceptionally high standards in everything we do — creative, technical, and strategic.' },
    { icon: Heart, title: 'Transparency', desc: 'Full visibility into every campaign. Weekly reports, honest updates, no hidden fees.' },
];

export default function AboutPage() {
    return (
        <>
            <Head>
                <title>About ScalerHouse – Performance-Driven Digital Marketing Agency</title>
            </Head>
            <Navbar />
            <WhatsAppFAB />

            {/* Hero */}
            <section className="hero-bg grid-bg pt-32 pb-20">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="badge badge-blue mb-4">Our Story</span>
                            <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5">
                                We Are <span className="gradient-text">ScalerHouse</span>
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                ScalerHouse was founded with a single mission: to make world-class digital growth accessible to ambitious Indian brands. We believe growth is not luck — it&apos;s a system.
                            </p>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                We&apos;ve helped 150+ brands across industries scale their digital presence, generate quality leads, and achieve measurable revenue growth — all through data-driven strategies and relentless execution.
                            </p>
                            <Link href="/contact" className="btn-glow">
                                Work With Us <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { num: '150+', label: 'Brands Scaled' },
                                { num: '₹500Cr+', label: 'Revenue Generated' },
                                { num: '4 yrs', label: 'In Business' },
                                { num: '99%', label: 'Retention Rate' },
                            ].map((s) => (
                                <div key={s.label} className="stat-card">
                                    <div className="font-syne font-black text-3xl gradient-text">{s.num}</div>
                                    <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="badge badge-purple mb-4">Our Principles</span>
                        <h2 className="font-syne font-black text-4xl text-white">What Drives Us</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card-hover p-6 text-center"
                            >
                                <v.icon size={32} className="text-cyan-400 mx-auto mb-4" />
                                <h3 className="font-semibold text-white mb-2">{v.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-[#080f1e]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="badge badge-cyan mb-4">Our Team</span>
                        <h2 className="font-syne font-black text-4xl text-white">The Brains Behind the Growth</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card-hover p-6 text-center"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-white text-xl mb-4`}>
                                    {member.initials}
                                </div>
                                <h3 className="font-semibold text-white">{member.name}</h3>
                                <p className="text-slate-400 text-sm mt-1">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
