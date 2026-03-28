// pages/services/[slug].tsx
import SEO from '../../components/seo/SEO';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronDown, ChevronUp, Star, Building2, Briefcase, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WhatsAppFAB from '../../components/layout/WhatsAppFAB';
import { useCurrency } from '../../components/context/CurrencyContext';
import { getServiceBySlug, ALL_SERVICES } from '../../lib/serviceData';
import { ServicePackage } from '../../lib/store';
import type { GetStaticPaths, GetStaticProps } from 'next';

interface Props { slug: string; }

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: ALL_SERVICES.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({
    props: { slug: params?.slug as string },
});

export default function ServiceDetailPage({ slug }: Props) {
    const service = getServiceBySlug(slug);
    const { currency, setCurrency } = useCurrency();
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        fetch(`/api/services/packages?serviceSlug=${slug}`)
            .then(res => res.json())
            .then(data => setPackages(data))
            .catch(err => console.error('Failed to load packages', err));
    }, [slug]);

    if (!service) return null;

    const toggleFaq = (i: number) => setOpenFaq(prev => (prev === i ? null : i));

    const hasWhyItMatters = Array.isArray((service as any).whyItMatters) && (service as any).whyItMatters.length > 0;
    const hasDescription = typeof (service as any).description === 'string';
    const hasOurServices = Array.isArray((service as any).ourServices) && (service as any).ourServices.length > 0;
    const hasWeOffer = Array.isArray((service as any).weOffer) && (service as any).weOffer.length > 0;
    const hasResearchShows = Array.isArray((service as any).researchShows) && (service as any).researchShows.length > 0;

    return (
        <>
            <SEO
                title={`${service.title} in Kanpur – ScalerHouse | Expert ${service.title} Services`}
                description={service.metaDesc}
                keywords={`${service.title}, ${service.title.toLowerCase()} Kanpur, ${service.title.toLowerCase()} services India, ScalerHouse ${service.title.toLowerCase()}`}
                schemaData={[
                    {
                        '@type': 'Service',
                        '@id': `https://scalerhouse.com/services/${slug}/#service`,
                        name: service.title,
                        description: service.metaDesc,
                        url: `https://scalerhouse.com/services/${slug}`,
                        provider: {
                            '@type': 'Organization',
                            '@id': 'https://scalerhouse.com/#organization',
                            name: 'ScalerHouse',
                        },
                        areaServed: {
                            '@type': 'Country',
                            name: 'India',
                        },
                        serviceType: service.title,
                        offers: {
                            '@type': 'Offer',
                            url: `https://scalerhouse.com/services/${slug}`,
                            priceCurrency: 'INR',
                        },
                    },
                    {
                        '@type': 'FAQPage',
                        mainEntity: service.faqs.map((faq: { q: string; a: string }) => ({
                            '@type': 'Question',
                            name: faq.q,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.a,
                            },
                        })),
                    },
                ]}
                breadcrumbs={[
                    { name: 'Home', url: 'https://scalerhouse.com' },
                    { name: 'Services', url: 'https://scalerhouse.com/services' },
                    { name: service.title, url: `https://scalerhouse.com/services/${slug}` },
                ]}
            />
            <Navbar />
            <WhatsAppFAB />

            {/* ── HERO ───────────────────────────────────────────────── */}
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

            {/* ── WHAT IS THIS SERVICE ─────────────────────────────── */}
            {hasDescription && (
                <section className="py-24 bg-[#080f1e]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-14 items-start">
                            {/* Left: explanation text */}
                            <motion.article
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="badge badge-blue mb-4">Service Overview</span>
                                <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-6">
                                    What is <span className="gradient-text">{service.title}?</span>
                                </h2>
                                <div className="space-y-4">
                                    {(service as any).description.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                        <p key={i} className="text-slate-300 text-base leading-relaxed">
                                            {para.trim()}
                                        </p>
                                    ))}
                                </div>
                            </motion.article>

                            {/* Right: why it matters */}
                            {hasWhyItMatters && (
                                <div className="space-y-5">
                                    {(service as any).whyItMatters.map((item: { icon: string; title: string; desc: string }, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: i * 0.12 }}
                                            className="glass-card p-6 border border-white/8 flex gap-5 hover:border-cyan-400/20 transition-colors duration-300"
                                        >
                                            <div
                                                className="text-3xl shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl"
                                                style={{ background: `linear-gradient(135deg, ${service.gradientFrom}22, ${service.gradientTo}11)` }}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-syne font-bold text-white text-lg mb-1">{item.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── RESEARCH SHOWS ──────────────────────────────────── */}
            {hasResearchShows && (
                <section className="py-24 bg-[#080a14]">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="badge badge-yellow mb-4">Market Insights</span>
                            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                                Research <span className="gradient-text">Shows</span>
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {(service as any).researchShows.map((para: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="glass-card p-6 md:p-8 border-l-4 border-l-cyan-500 border-white/5 bg-slate-900/40"
                                >
                                    <p className="text-slate-300 text-lg leading-relaxed">{para}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── OUR SERVICES ─────────────────────────────────────── */}
            {hasOurServices && (
                <section className="py-24 bg-[#0a1222]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="badge badge-purple mb-4">Core Offerings</span>
                            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                                Our <span className="gradient-text">Services</span>
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {(service as any).ourServices.map((srv: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="glass-card p-8 border border-white/8 hover:border-cyan-400/20 transition-all duration-300"
                                >
                                    <div className="text-4xl mb-6">{srv.icon}</div>
                                    <h3 className="font-syne font-bold text-white text-2xl mb-4">{srv.title}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{srv.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── WE OFFER (TABULAR) ─────────────────────────────── */}
            {hasWeOffer && (
                <section className="py-24 bg-[#080f1e]">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="badge badge-cyan mb-4">Complete Capabilities</span>
                            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                                We <span className="gradient-text">Offer</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(service as any).weOffer.map((item: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: (Math.min(i, 20)) * 0.03 }}
                                    className="flex items-center gap-4 p-4 rounded-xl glass-card border border-white/5 hover:border-cyan-400/30 transition-all duration-300 group"
                                >
                                    <div className="text-2xl w-12 h-12 flex items-center justify-center shrink-0 bg-slate-800/80 rounded-lg border border-white/10 group-hover:bg-slate-700/80 transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="text-slate-200 font-semibold">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── HOW IT WORKS ─────────────────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-blue mb-4">The Process</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            How <span className="gradient-text">It Works</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A clear, proven process — from onboarding to measurable results. No guesswork, no ambiguity.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.howItWorks.map((step, i) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.07 }}
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

            {/* ── BENEFITS ─────────────────────────────────────────── */}
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

            {/* ── OUR APPROACH ────────────────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-purple mb-4">Our Strategy</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Our <span className="gradient-text">Approach</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">A structured, repeatable 6-step strategy that drives consistent results — from discovery to measurable outcomes.</p>
                    </div>
                    <div className="relative">
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

            {/* ── PACKAGES ─────────────────────────────────────────── */}
            <section id="packages" className="py-24 bg-[#080f1e]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-green mb-4">Transparent Pricing</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Choose Your <span className="gradient-text">Package</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto mb-8">All plans include a dedicated account manager. No hidden fees. Cancel anytime with 30-day notice.</p>

                        {/* Currency Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-slate-400 text-sm">View pricing in:</span>
                            <div className="flex bg-slate-800/60 backdrop-blur border border-white/10 p-1 rounded-full">
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${currency === 'USD' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'}`}
                                >
                                    $ USD
                                </button>
                                <button
                                    onClick={() => setCurrency('INR')}
                                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${currency === 'INR' ? 'bg-cyan-500 text-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'}`}
                                >
                                    ₹ INR
                                </button>
                            </div>
                        </div>
                    </div>

                    {packages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 mb-4">Packages are customised for this service.</p>
                            <Link href="/contact" className="btn-glow !py-3 !px-6">Request a Custom Quote <ArrowRight size={16} /></Link>
                        </div>
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
                                            <span className="font-syne font-black text-4xl gradient-text">
                                                {currency === 'USD' && (pkg as any).priceUSD 
                                                    ? (pkg as any).priceUSD 
                                                    : pkg.price}
                                            </span>
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

            {/* ── FAQs ─────────────────────────────────────────────── */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="badge badge-yellow mb-4">Common Questions</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto">Everything you need to know before working with us. Still have questions? <Link href="/contact" className="text-cyan-400 hover:underline">Ask us directly</Link>.</p>
                    </div>
                    <div className="space-y-3">
                        {service.faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.35, delay: i * 0.04 }}
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

            {/* ── BOTTOM CTA ────────────────────────────────────────── */}
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
