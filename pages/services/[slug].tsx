// pages/services/[slug].tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Star, Building2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WhatsAppFAB from '../../components/layout/WhatsAppFAB';
import { getServiceBySlug, ALL_SERVICES } from '../../lib/serviceData';
import { getAll, KEYS, ServicePackage } from '../../lib/store';
import type { GetStaticPaths, GetStaticProps } from 'next';

interface Props {
    slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: ALL_SERVICES.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({
    props: { slug: params?.slug as string },
});

export default function ServiceDetailPage({ slug }: Props) {
    const service = getServiceBySlug(slug);
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const all = getAll<ServicePackage>(KEYS.SERVICE_PACKAGES);
        setPackages(all.filter(p => p.serviceSlug === slug));
    }, [slug]);

    if (!service) return null;

    const toggleFaq = (i: number) => setOpenFaq(prev => (prev === i ? null : i));

    return (
        <>
            <Head>
                <title>{`${service.title} – ScalerHouse`}</title>
                <meta name="description" content={service.metaDesc} />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="hero-bg grid-bg pt-32 pb-24 relative overflow-hidden">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        className="max-w-3xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className={`badge ${service.badgeClass} mb-4`}>{service.badge}</span>
                        <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5 leading-tight">
                            {service.title}
                        </h1>
                        <p className="text-slate-300 text-xl leading-relaxed mb-8 max-w-2xl">
                            {service.tagline}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/contact" className="btn-glow !py-4 !px-8 text-base">
                                Get a Free Proposal <ArrowRight size={18} />
                            </Link>
                            <a href="#packages" className="btn-outline !py-4 !px-8 text-base">
                                See Pricing
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-blue mb-4">The Process</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            How <span className="gradient-text">It Works</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A clear, proven process — from onboarding to measurable results.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.howItWorks.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.08 }}
                                className="glass-card p-6 border border-white/8 relative"
                            >
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-syne font-black text-sm text-white mb-4"
                                    style={{ background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})` }}
                                >
                                    {step.step}
                                </div>
                                <h3 className="font-syne font-bold text-white text-lg mb-2">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BENEFITS ─────────────────────────────────────── */}
            <section className="py-24 bg-[#080f1e]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-cyan mb-4">Who It's For</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Built for <span className="gradient-text">Every Scale</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Whether you're a growing startup or a large enterprise, our approach adapts to your scale and goals.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Small Business */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55 }}
                            className="glass-card p-8 border border-blue-500/20"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <Briefcase size={22} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-syne font-bold text-white text-xl">Small Businesses</h3>
                                    <p className="text-slate-400 text-sm">Startups, SMEs & local brands</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {service.smallBizBenefits.map((b, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                        <span className="text-slate-300 text-sm">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Enterprise */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55 }}
                            className="glass-card p-8 border border-cyan-500/20"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <Building2 size={22} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-syne font-bold text-white text-xl">Large Enterprises</h3>
                                    <p className="text-slate-400 text-sm">Corporates, national & global brands</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {service.enterpriseBenefits.map((b, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                                        <span className="text-slate-300 text-sm">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── PROCESS / STRATEGY ───────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-purple mb-4">Our Strategy</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Our <span className="gradient-text">Approach</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A structured, repeatable strategy that drives consistent results every engagement.</p>
                    </div>
                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {service.process.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="text-center relative"
                                >
                                    <div
                                        className="w-16 h-16 mx-auto rounded-2xl border border-white/10 flex items-center justify-center text-2xl mb-3 relative z-10"
                                        style={{ background: `linear-gradient(135deg, ${service.gradientFrom}22, ${service.gradientTo}11)` }}
                                    >
                                        {step.icon}
                                    </div>
                                    <p className="font-syne font-bold text-white text-sm mb-1">{step.label}</p>
                                    <p className="text-slate-500 text-xs leading-snug">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PACKAGES ─────────────────────────────────────── */}
            <section id="packages" className="py-24 bg-[#080f1e]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-green mb-4">Transparent Pricing</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Choose Your <span className="gradient-text">Package</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">All plans include a dedicated account manager. No hidden fees. Cancel anytime with 30-day notice.</p>
                    </div>

                    {packages.length === 0 ? (
                        <p className="text-center text-slate-500">Loading packages…</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {packages.map((pkg, i) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.1 }}
                                    className={`glass-card flex flex-col p-7 border relative ${pkg.isPopular ? 'border-cyan-400/40 shadow-[0_0_40px_rgba(0,212,255,0.12)]' : 'border-white/8'}`}
                                >
                                    {pkg.isPopular && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                            <span className="badge badge-cyan text-xs px-4 flex items-center gap-1">
                                                <Star size={10} fill="currentColor" /> Most Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="mb-5">
                                        <h3 className="font-syne font-bold text-xl text-white mb-1">{pkg.name}</h3>
                                        <div className="flex items-end gap-1">
                                            <span className="font-syne font-black text-4xl gradient-text">{pkg.price}</span>
                                            <span className="text-slate-400 text-sm mb-1">{pkg.priceNote}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2.5 mb-7">
                                        {pkg.deliverables.map((d, j) => (
                                            <div key={j} className="flex items-start gap-2.5">
                                                <CheckCircle size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                                                <span className="text-slate-300 text-sm">{d}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href="/contact"
                                        className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${pkg.isPopular ? 'btn-glow justify-center' : 'btn-outline justify-center'}`}
                                    >
                                        {pkg.ctaLabel}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <p className="text-center text-slate-500 text-sm mt-8">
                        Need something custom? <Link href="/contact" className="text-cyan-400 hover:underline">Let's build a custom plan →</Link>
                    </p>
                </div>
            </section>

            {/* ── FAQs ─────────────────────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-yellow mb-4">Common Questions</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {service.faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                                className={`glass-card border transition-all duration-300 ${openFaq === i ? 'border-cyan-400/30' : 'border-white/8'}`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left"
                                    onClick={() => toggleFaq(i)}
                                >
                                    <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                                    {openFaq === i
                                        ? <ChevronUp size={18} className="text-cyan-400 shrink-0" />
                                        : <ChevronDown size={18} className="text-slate-400 shrink-0" />
                                    }
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-slate-400 text-sm leading-relaxed px-5 pb-5">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ────────────────────────────────────── */}
            <section className="py-20 bg-[#080f1e]">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-900/60 via-[#0f172a] to-cyan-900/30 border border-white/10 p-10 lg:p-14 text-center">
                        <span className="badge badge-cyan mb-4">Ready to Grow?</span>
                        <h2 className="font-syne font-black text-4xl text-white mb-4">
                            Let's Build Your <span className="gradient-text">Growth Engine</span>
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            Book a free 30-minute strategy call. We'll audit your current situation, identify the biggest opportunities, and share a custom plan — no obligation.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/contact" className="btn-glow !py-4 !px-8 text-base">
                                Get Free Proposal <ArrowRight size={18} />
                            </Link>
                            <Link href="/services" className="btn-outline !py-4 !px-8 text-base">
                                ← All Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
