// pages/services.tsx
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Search, Megaphone, Globe, BarChart2, Mail, TrendingUp, Code, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { ALL_SERVICES } from '../lib/serviceData';
import { useEffect, useState } from 'react';
import { getAll, KEYS, ServicePackage } from '../lib/store';

const iconMap: Record<string, React.ElementType> = {
    'seo-content-marketing': Search,
    'performance-ads': Megaphone,
    'social-media-management': Globe,
    'web-design-development': Code,
    'analytics-cro': BarChart2,
    'email-marketing': Mail,
};

const colorMap: Record<string, { card: string; border: string; iconBg: string; icon: string }> = {
    'seo-content-marketing': { card: 'from-blue-600/10 to-blue-900/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/10', icon: 'text-blue-400' },
    'performance-ads': { card: 'from-cyan-600/10 to-cyan-900/5', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/10', icon: 'text-cyan-400' },
    'social-media-management': { card: 'from-purple-600/10 to-purple-900/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10', icon: 'text-purple-400' },
    'web-design-development': { card: 'from-green-600/10 to-green-900/5', border: 'border-green-500/20', iconBg: 'bg-green-500/10', icon: 'text-green-400' },
    'analytics-cro': { card: 'from-orange-600/10 to-orange-900/5', border: 'border-orange-500/20', iconBg: 'bg-orange-500/10', icon: 'text-orange-400' },
    'email-marketing': { card: 'from-pink-600/10 to-pink-900/5', border: 'border-pink-500/20', iconBg: 'bg-pink-500/10', icon: 'text-pink-400' },
};

export default function ServicesPage() {
    const [packages, setPackages] = useState<ServicePackage[]>([]);

    useEffect(() => {
        setPackages(getAll<ServicePackage>(KEYS.SERVICE_PACKAGES));
    }, []);

    const getStartingPrice = (slug: string) => {
        const pkgs = packages.filter(p => p.serviceSlug === slug);
        if (!pkgs.length) return null;
        const starter = pkgs.find(p => p.name === 'Starter') || pkgs[0];
        return `From ${starter.price}${starter.priceNote}`;
    };

    return (
        <>
            <Head>
                <title>Services – ScalerHouse Digital Marketing Agency</title>
                <meta name="description" content="Full-stack digital growth services: SEO, Performance Ads, Social Media, Web Design, Analytics, Email Marketing. Trusted by 150+ brands." />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            {/* Hero */}
            <section className="hero-bg grid-bg pt-32 pb-20">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="badge badge-blue mb-4">What We Offer</span>
                        <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5">
                            Full-Stack <span className="gradient-text">Growth Services</span>
                        </h1>
                        <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-8">
                            Every service we offer is tied to measurable business outcomes. No fluff. No vanity metrics. Just predictable, scalable growth.
                        </p>
                        <Link href="/contact" className="btn-glow !py-4 !px-8 text-base">
                            Get Free Proposal <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ALL_SERVICES.map((svc, i) => {
                            const Icon = iconMap[svc.slug] || TrendingUp;
                            const c = colorMap[svc.slug];
                            const price = getStartingPrice(svc.slug);
                            return (
                                <motion.div
                                    key={svc.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.07 }}
                                    className={`glass-card-hover flex flex-col p-7 bg-gradient-to-br ${c.card} border ${c.border} group cursor-pointer`}
                                >
                                    {/* Icon */}
                                    <div className={`w-13 h-13 w-14 h-14 rounded-2xl ${c.iconBg} border ${c.border} flex items-center justify-center mb-5`}>
                                        <Icon size={26} className={c.icon} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h2 className="font-syne font-bold text-xl text-white mb-2 leading-snug">
                                            {svc.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            {svc.metaDesc}
                                        </p>

                                        {/* Key Highlights — top 3 from howItWorks */}
                                        <div className="space-y-1.5 mb-5">
                                            {svc.howItWorks.slice(0, 3).map(step => (
                                                <div key={step.step} className="flex items-start gap-2">
                                                    <CheckCircle size={13} className={`${c.icon} mt-0.5 shrink-0`} />
                                                    <span className="text-slate-400 text-xs">{step.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        {price && (
                                            <span className={`text-xs font-semibold ${c.icon} opacity-90`}>{price}</span>
                                        )}
                                        <Link
                                            href={`/services/${svc.slug}`}
                                            className={`ml-auto inline-flex items-center gap-1.5 text-sm font-semibold ${c.icon} group-hover:gap-2.5 transition-all duration-200`}
                                        >
                                            View Details <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[#080f1e]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="font-syne font-black text-3xl text-white mb-4">Ready to Start Growing?</h2>
                    <p className="text-slate-400 mb-6">Book a free strategy call and get a custom proposal tailored to your brand.</p>
                    <Link href="/contact" className="btn-glow !py-4 !px-8 text-base">
                        Get Free Proposal <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
