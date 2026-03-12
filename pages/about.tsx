// pages/about.tsx
import Head from 'next/head';
import SEO from '../components/seo/SEO';
import { motion, useInView } from 'framer-motion';
import { Users, Target, Award, Rocket, Heart, CheckCircle, ArrowRight, TrendingUp, BarChart2, Shield, Zap, Eye, Star, Search, Settings, LineChart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { useRef } from 'react';

const team = [
    { name: 'Shashank Singh', role: 'Founder & CEO', initials: 'SS', color: 'from-blue-600 to-cyan-500' },
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

const timelineEvents = [
    {
        year: '2021',
        title: 'ScalerHouse Is Born',
        desc: 'Shashank Singh founded ScalerHouse in Kanpur with a singular mission — to make digital growth predictable for Indian businesses. Starting with a lean team of 3, we built our first performance marketing systems from scratch, refusing to rely on guesswork.',
        tag: 'Founded',
        color: 'from-blue-600 to-cyan-500',
    },
    {
        year: '2022',
        title: '50+ Brands Scaled Across India',
        desc: 'Within 12 months, word spread fast. ScalerHouse grew from local Kanpur clients to brands across Delhi, Mumbai, Bengaluru and Hyderabad. We built dedicated growth pods for each vertical — e-commerce, ed-tech, real estate and local businesses.',
        tag: 'National Reach',
        color: 'from-purple-600 to-pink-500',
    },
    {
        year: '2023',
        title: '₹200 Crore+ Revenue Generated for Clients',
        desc: 'A landmark year. Our data-driven performance campaigns crossed ₹200 Crore in attributed client revenue. We launched our proprietary growth audit framework, which is now used across every new client onboarding — delivering faster results with zero wasted spend.',
        tag: '₹200Cr+ Revenue',
        color: 'from-green-500 to-emerald-400',
    },
    {
        year: '2024',
        title: '150+ Brands & Full-Stack Digital Services',
        desc: 'ScalerHouse crossed 150 active brands while expanding into SEO, content marketing, social media growth and brand strategy. Our retention rate hit 99% — a testament to the systems we build and the results we deliver.',
        tag: '150+ Brands',
        color: 'from-orange-500 to-yellow-400',
    },
    {
        year: '2025',
        title: 'Pan-India Growth Partner',
        desc: 'Today, ScalerHouse is recognised as one of India\'s fastest-growing performance marketing agencies. We have partnered with brands across 20+ categories, generated ₹500Cr+ in client revenue, and are on a mission to become India\'s most trusted growth partner for ambitious brands.',
        tag: 'Pan-India',
        color: 'from-cyan-500 to-blue-400',
    },
];

const trustSignals = [
    { icon: BarChart2, title: 'Data-Driven Strategies', desc: 'Every decision backed by real data — not gut feelings. We track, analyse and optimise relentlessly.' },
    { icon: TrendingUp, title: 'Performance Marketing Experts', desc: 'Certified specialists in Meta Ads, Google Ads, SEO and conversion rate optimisation.' },
    { icon: Eye, title: 'Radical Transparency', desc: 'Live dashboards, weekly reports and open access. You always know exactly where your money goes.' },
    { icon: Users, title: 'Dedicated Growth Team', desc: 'You get a team — not a freelancer. Strategist, creative, analyst and account manager, all focused on you.' },
    { icon: Zap, title: 'Speed of Execution', desc: 'Campaigns go live in days, not months. We move fast without sacrificing quality or accuracy.' },
    { icon: Shield, title: 'ROI-Focused Campaigns', desc: 'We measure success in revenue and returns — not impressions. Every rupee is accountable.' },
];

const growthSteps = [
    { num: '01', icon: Search, title: 'Discovery & Research', desc: 'We deep-dive into your business, audience, competitors and market to uncover the real growth levers — before we write a single ad.' },
    { num: '02', icon: Target, title: 'Strategy Development', desc: 'A bespoke, multi-channel growth roadmap built specifically for your brand — covering paid media, SEO, content and conversion.' },
    { num: '03', icon: Rocket, title: 'Campaign Execution', desc: 'Swift, precise launch across all channels. Every creative, copy and funnel is crafted to convert — not just impress.' },
    { num: '04', icon: Settings, title: 'Data Optimisation', desc: 'Continuous A/B testing, bid optimisation and funnel refinement. We kill what doesn\'t work and double down on what does.' },
    { num: '05', icon: LineChart, title: 'Scaling & Automation', desc: 'Once the system works, we scale it intelligently — using automation, lookalike audiences and predictive analytics to 10x your results.' },
];

// Animated counter hook
function useCountUp(target: number, duration: number = 1500) {
    return target;
}

export default function AboutPage() {
    const founderRef = useRef(null);
    const founderInView = useInView(founderRef, { once: true, margin: '-100px' });

    const timelineRef = useRef(null);
    const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' });

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Shashank Singh',
        jobTitle: 'Founder & CEO',
        worksFor: {
            '@type': 'Organization',
            name: 'ScalerHouse',
            url: 'https://scalerhouse.com',
            description: 'Performance marketing agency helping 150+ brands with data-driven digital growth strategies',
        },
        description: 'Shashank Singh is the Founder and CEO of ScalerHouse, a leading performance marketing agency in Kanpur, India. Under his leadership, ScalerHouse has helped 150+ brands across India generate ₹500Cr+ in revenue through predictable, data-driven digital marketing systems.',
        knowsAbout: ['Performance Marketing', 'Digital Marketing', 'SEO', 'Growth Strategy', 'Meta Ads', 'Google Ads'],
        sameAs: ['https://scalerhouse.com/about'],
    };

    const orgSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ScalerHouse',
        url: 'https://scalerhouse.com',
        logo: 'https://scalerhouse.com/logo.png',
        foundingDate: '2021',
        founder: { '@type': 'Person', name: 'Shashank Singh' },
        description: 'ScalerHouse is India\'s leading performance marketing agency based in Kanpur, helping 150+ ambitious brands grow with predictable, ROI-driven digital marketing strategies.',
        areaServed: 'India',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
    };

    return (
        <>
            <SEO
                title="About ScalerHouse – Shashank Singh | Performance Marketing Agency Kanpur"
                description="ScalerHouse, founded by Shashank Singh, is Kanpur's leading performance marketing agency. We've helped 150+ brands generate ₹500Cr+ in revenue through data-driven digital growth strategies. Learn our story."
            />
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
                />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            {/* ─── Hero ─── */}
            <section className="hero-bg grid-bg pt-32 pb-20">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="badge badge-blue mb-4"
                            >
                                Our Story
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-syne font-black text-5xl lg:text-6xl text-white mb-5"
                            >
                                We Are <span className="gradient-text">ScalerHouse</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-300 text-lg leading-relaxed mb-6"
                            >
                                ScalerHouse was founded with a single mission: to make world-class digital growth accessible to ambitious Indian brands. We believe growth is not luck — it&apos;s a system.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-400 leading-relaxed mb-8"
                            >
                                We&apos;ve helped 150+ brands across industries scale their digital presence, generate quality leads, and achieve measurable revenue growth — all through data-driven strategies and relentless execution.
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Link href="/contact" className="btn-glow">
                                    Work With Us <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { num: '150+', label: 'Brands Scaled' },
                                { num: '₹500Cr+', label: 'Revenue Generated' },
                                { num: '4 yrs', label: 'In Business' },
                                { num: '99%', label: 'Retention Rate' },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="stat-card"
                                >
                                    <div className="font-syne font-black text-3xl gradient-text">{s.num}</div>
                                    <div className="text-slate-400 text-sm mt-1">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Founder's Message ─── */}
            <section className="py-28 bg-[#080f1e] relative overflow-hidden" ref={founderRef}>
                {/* Background orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={founderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="badge badge-blue mb-4">Founder&apos;s Message</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white">
                            A Word From <span className="gradient-text">Our Leader</span>
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Founder Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="relative flex justify-center order-1 lg:order-none mt-8 lg:mt-0"
                        >
                            {/* Rotating gradient ring */}
                            <div className="founder-ring-outer absolute inset-0 flex items-center justify-center">
                                <div className="founder-ring" />
                            </div>

                            {/* Glowing backdrop */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-2xl scale-110 pointer-events-none" />

                            {/* Photo */}
                            <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-blue-900/60">
                                <Image
                                    src="/Images/Founder.jpeg"
                                    alt="Shashank Singh – Founder & CEO of ScalerHouse, Performance Marketing Agency Kanpur"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                                {/* Subtle overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080f1e]/40 via-transparent to-transparent" />
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [-6, 6, -6] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 glass-card px-4 py-2 sm:px-5 sm:py-3 flex items-center gap-2 sm:gap-3 rounded-2xl border border-cyan-500/30 w-11/12 max-w-xs"
                            >
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                                <span className="text-white text-xs sm:text-sm font-semibold truncate text-center w-full">Shashank Singh – Founder & CEO</span>
                            </motion.div>
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0, x: 60 }}
                            animate={founderInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                            className="space-y-6 lg:pl-4"
                        >
                            {/* Quote mark */}
                            <div className="text-8xl text-blue-500/30 font-serif leading-none select-none">&ldquo;</div>

                            <div className="space-y-4 -mt-8">
                                <p className="text-slate-200 text-lg leading-relaxed">
                                    When I started <strong className="text-white">ScalerHouse</strong>, the goal was simple — help ambitious brands grow with <em>predictable digital systems</em> instead of guesswork.
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    Too many businesses were losing money on marketing that looked impressive on paper but delivered zero real returns. I saw agencies over-promise and under-deliver, leaving founders frustrated and disillusioned with digital marketing.
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    At ScalerHouse, we flipped the script. We build data-backed growth systems — not vanity campaigns. Every rupee we manage is accountable. Every strategy is tied to revenue, not reach.
                                </p>
                                <p className="text-white font-medium leading-relaxed">
                                    Today, I am proud to say that <span className="gradient-text font-bold">150+ brands</span> across India trust us to grow their business — and we have helped them generate over <span className="gradient-text font-bold">₹500 Crore</span> in revenue.
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    This is just the beginning. India has millions of brilliant businesses waiting to scale. We are here to make that happen — one measurable result at a time.
                                </p>
                            </div>

                            {/* Signature */}
                            <div className="pt-4 border-t border-white/10">
                                <p className="signature-text text-cyan-400 text-3xl mb-1">Shashank Singh</p>
                                <p className="text-slate-400 text-sm tracking-wider uppercase">Founder & Chief Executive Officer, ScalerHouse</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-slate-400 text-xs ml-1">Trusted by 150+ Brands</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── Our Journey Timeline ─── */}
            <section className="py-20 lg:py-28 bg-[#0a1222] relative overflow-hidden" ref={timelineRef}>
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] rounded-full bg-blue-800/10 blur-[140px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12 lg:mb-20"
                    >
                        <span className="badge badge-purple mb-4">Our Journey</span>
                        <h2 className="font-syne font-black text-3xl lg:text-5xl text-white">
                            Built Milestone by <span className="gradient-text">Milestone</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base px-2">
                            From a lean startup in Kanpur to a pan-India growth powerhouse — every year we&apos;ve raised the bar.
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Central line */}
                        <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-blue-600/60 via-cyan-500/40 to-transparent" />

                        <div className="space-y-12 lg:space-y-16">
                            {timelineEvents.map((event, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <motion.div
                                        key={event.year}
                                        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                                        animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                                        className={`relative flex flex-row lg:items-center gap-6 lg:gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                                    >
                                        {/* Center year badge */}
                                        <div className="relative flex-shrink-0 flex items-center justify-center pl-4 lg:pl-0 pt-2 lg:pt-0">
                                            {/* Pulse ring */}
                                            <div className={`absolute w-12 lg:w-16 h-12 lg:h-16 rounded-full bg-gradient-to-br ${event.color} opacity-20 animate-ping`} style={{ animationDuration: '2.5s' }} />
                                            <div className={`relative w-10 lg:w-14 h-10 lg:h-14 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg z-10`}>
                                                <span className="font-syne font-black text-white text-[10px] lg:text-xs leading-tight text-center">{event.year}</span>
                                            </div>
                                        </div>

                                        {/* Content card */}
                                        <div className="flex-1 lg:w-1/2">
                                            <div className="glass-card-hover p-5 lg:p-7 rounded-2xl relative group">
                                                {/* Gradient left border */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${event.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                                <div className="pl-3 lg:pl-4">
                                                    <span className={`badge text-[10px] lg:text-xs mb-2 lg:mb-3 bg-gradient-to-r ${event.color} text-white border-0 px-2 lg:px-3 py-1 block w-fit`}>
                                                        {event.tag}
                                                    </span>
                                                    <h3 className="font-syne font-bold text-lg lg:text-xl text-white mb-2">{event.title}</h3>
                                                    <p className="text-slate-400 text-xs lg:text-sm leading-relaxed">{event.desc}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spacer for opposite side on desktop */}
                                        <div className="flex-1 hidden lg:block" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Why Brands Choose ScalerHouse ─── */}
            <section className="py-28 bg-[#080f1e] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="badge badge-cyan mb-4">Why Us</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white">
                            Why 150+ Brands Trust <span className="gradient-text">ScalerHouse</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                            We are not just a marketing agency. We are a growth partner that takes ownership of your results.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trustSignals.map((signal, i) => (
                            <motion.div
                                key={signal.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="glass-card-hover p-7 group relative overflow-hidden"
                            >
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/10 group-hover:to-cyan-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/50 transition-all duration-300">
                                            <signal.icon size={22} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                                                <h3 className="font-semibold text-white text-base">{signal.title}</h3>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed">{signal.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-14 glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-cyan-500/20"
                    >
                        <div>
                            <h3 className="font-syne font-bold text-xl text-white mb-1">Ready to scale your brand?</h3>
                            <p className="text-slate-400 text-sm">Get a free growth audit. No commitment, no fluff — just clarity.</p>
                        </div>
                        <Link href="/contact" className="btn-glow whitespace-nowrap flex-shrink-0">
                            Get Free Audit <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ─── Growth Framework ─── */}
            <section className="py-28 bg-[#0a1222] relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <span className="badge badge-blue mb-4">Our Process</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white">
                            The ScalerHouse <span className="gradient-text">Growth Framework</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                            A battle-tested 5-step system that has driven ₹500Cr+ in client revenue. Systematic. Scalable. Predictable.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting dashed line (desktop only) */}
                        <div className="hidden lg:block absolute top-7 left-0 right-0 h-px">
                            <svg width="100%" height="2" className="overflow-visible">
                                <line
                                    x1="10%"
                                    y1="1"
                                    x2="90%"
                                    y2="1"
                                    stroke="rgba(0,212,255,0.2)"
                                    strokeWidth="2"
                                    strokeDasharray="8 6"
                                />
                            </svg>
                        </div>

                        {/* Mobile vertical dashed line */}
                        <div className="block lg:hidden absolute left-[3.25rem] top-10 bottom-10 w-px">
                            <svg width="2" height="100%" className="overflow-visible">
                                <line
                                    x1="1"
                                    y1="0"
                                    x2="1"
                                    y2="100%"
                                    stroke="rgba(0,212,255,0.2)"
                                    strokeWidth="2"
                                    strokeDasharray="8 6"
                                />
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative">
                            {growthSteps.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.6 }}
                                    className="group relative"
                                >
                                    <div className="glass-card-hover p-5 lg:p-6 text-left lg:text-center h-full relative flex flex-row lg:flex-col items-start lg:items-center gap-4 lg:gap-0">
                                        {/* Number badge */}
                                        <div className="relative flex-shrink-0 lg:mb-5">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                                            <div className="relative w-12 lg:w-14 h-12 lg:h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                                                <span className="font-syne font-black text-white text-xs lg:text-sm">{step.num}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 pl-2 lg:pl-0 pt-1 lg:pt-0">
                                            {/* Icon */}
                                            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-2 lg:mb-4 lg:mx-auto group-hover:border-cyan-500/40 transition-all">
                                                <step.icon size={16} className="text-cyan-400" />
                                            </div>

                                            <h3 className="font-syne font-bold text-white text-base lg:text-sm mb-2 lg:mb-3 leading-tight block">{step.title}</h3>
                                            <p className="text-slate-400 text-xs sm:text-sm lg:text-xs leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Our Culture ─── */}
            <section className="py-24 bg-[#080f1e] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/10 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="badge badge-purple mb-6">Our Culture</span>
                        <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-8 leading-tight">
                            Great Results Come From <span className="gradient-text">Great People</span>
                        </h2>
                        <p className="text-slate-300 text-xl leading-relaxed mb-6">
                            At ScalerHouse, every team member is a <strong className="text-white">growth specialist</strong>, not just an executor. We hire sharp thinkers who are obsessed with results, energised by challenges, and relentless in their pursuit of excellence.
                        </p>
                        <p className="text-slate-400 leading-relaxed mb-10">
                            We are a team that celebrates wins together, learns from every campaign, and pushes each other to raise the standard every single week. No politics. No bureaucracy. Just a shared obsession with making our clients grow faster than they ever thought possible.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Results-Driven', 'Transparent', 'Curious', 'Fast-Moving', 'Client-Obsessed', 'Data-First'].map((value) => (
                                <span key={value} className="badge badge-blue px-4 py-2 text-sm">{value}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Values ─── */}
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

            {/* ─── Team ─── */}
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
