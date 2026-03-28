// pages/services.tsx
import SEO from '../components/seo/SEO';
import { motion } from 'framer-motion';
import {
    Search, Megaphone, Globe, BarChart2, Mail, TrendingUp, Code, ArrowRight, CheckCircle,
    MapPin, Smartphone, Palette, PenTool, Layers, Database, Zap
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';
import { ALL_SERVICES } from '../lib/serviceData';
import { useEffect, useState } from 'react';
import { ServicePackage } from '../lib/store';
import { useCurrency } from '../components/context/CurrencyContext';

const iconMap: Record<string, React.ElementType> = {
    'seo-content-marketing': Search,
    'performance-ads': Megaphone,
    'social-media-management': Globe,
    'web-design-development': Code,
    'analytics-cro': BarChart2,
    'email-marketing': Mail,
    'google-my-business': MapPin,
    'app-development': Smartphone,
    'ui-ux-design': Layers,
    'branding-advertisement': Palette,
    'logo-designing': PenTool,
    'crm-development': Database,
    'api-automations': Zap,
};

const colorMap: Record<string, { card: string; border: string; iconBg: string; icon: string }> = {
    'seo-content-marketing': { card: 'from-blue-600/10 to-blue-900/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/10', icon: 'text-blue-400' },
    'performance-ads': { card: 'from-cyan-600/10 to-cyan-900/5', border: 'border-cyan-500/20', iconBg: 'bg-cyan-500/10', icon: 'text-cyan-400' },
    'social-media-management': { card: 'from-purple-600/10 to-purple-900/5', border: 'border-purple-500/20', iconBg: 'bg-purple-500/10', icon: 'text-purple-400' },
    'web-design-development': { card: 'from-green-600/10 to-green-900/5', border: 'border-green-500/20', iconBg: 'bg-green-500/10', icon: 'text-green-400' },
    'analytics-cro': { card: 'from-orange-600/10 to-orange-900/5', border: 'border-orange-500/20', iconBg: 'bg-orange-500/10', icon: 'text-orange-400' },
    'email-marketing': { card: 'from-pink-600/10 to-pink-900/5', border: 'border-pink-500/20', iconBg: 'bg-pink-500/10', icon: 'text-pink-400' },
    'google-my-business': { card: 'from-blue-600/10 to-indigo-900/5', border: 'border-indigo-500/20', iconBg: 'bg-indigo-500/10', icon: 'text-indigo-400' },
    'app-development': { card: 'from-sky-600/10 to-sky-900/5', border: 'border-sky-500/20', iconBg: 'bg-sky-500/10', icon: 'text-sky-400' },
    'ui-ux-design': { card: 'from-violet-600/10 to-violet-900/5', border: 'border-violet-500/20', iconBg: 'bg-violet-500/10', icon: 'text-violet-400' },
    'branding-advertisement': { card: 'from-rose-600/10 to-rose-900/5', border: 'border-rose-500/20', iconBg: 'bg-rose-500/10', icon: 'text-rose-400' },
    'logo-designing': { card: 'from-yellow-600/10 to-yellow-900/5', border: 'border-yellow-500/20', iconBg: 'bg-yellow-500/10', icon: 'text-yellow-400' },
    'crm-development': { card: 'from-emerald-600/10 to-emerald-900/5', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/10', icon: 'text-emerald-400' },
    'api-automations': { card: 'from-amber-600/10 to-amber-900/5', border: 'border-amber-500/20', iconBg: 'bg-amber-500/10', icon: 'text-amber-400' },
};

export default function ServicesPage() {
    const [packages, setPackages] = useState<ServicePackage[]>([]);
    const { currency } = useCurrency();

    useEffect(() => {
        fetch('/api/services/packages')
            .then(res => res.json())
            .then(data => setPackages(data))
            .catch(err => console.error('Failed to load packages', err));
    }, []);

    const getStartingPrice = (slug: string) => {
        const pkgs = packages.filter(p => p.serviceSlug === slug);
        if (!pkgs.length) return null;
        const starter = pkgs.find(p => p.name === 'Starter') || pkgs[0];
        
        const displayPrice = (currency === 'USD' && (starter as any).priceUSD) 
            ? (starter as any).priceUSD 
            : starter.price;
        return `From ${displayPrice}${starter.priceNote}`;
    };

    return (
        <>
            <SEO 
                title="Digital Marketing Services in Kanpur – ScalerHouse | SEO, Ads, Web, Apps & More"
                description="Full-stack digital growth services in Kanpur: SEO, Performance Ads, Social Media, Web Design, App Development, Graphic Design, GMB, CRM & API Automations. Trusted by 150+ brands across India."
                keywords="digital marketing services Kanpur, SEO agency Kanpur, Google Ads Kanpur, social media marketing, web development Kanpur, app development, ScalerHouse services"
                schemaData={[
                    {
                        '@type': 'ItemList',
                        name: 'Digital Marketing & Technology Services by ScalerHouse',
                        description: 'Complete range of digital marketing and technology services offered by ScalerHouse, Kanpur.',
                        numberOfItems: ALL_SERVICES.length,
                        itemListElement: ALL_SERVICES.map((svc, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            name: svc.title,
                            description: svc.metaDesc,
                            url: `https://scalerhouse.com/services/${svc.slug}`,
                        })),
                    },
                ]}
                breadcrumbs={[
                    { name: 'Home', url: 'https://scalerhouse.com' },
                    { name: 'Services', url: 'https://scalerhouse.com/services' },
                ]}
            />
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
                            Every service we offer is tied to measurable business outcomes — from SEO and performance ads to custom apps, CRM systems and workflow automation. No fluff. Just predictable, scalable growth.
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
                    <div className="text-center mb-14">
                        <span className="badge badge-blue mb-4">13 Specialist Services</span>
                        <h2 className="font-syne font-black text-4xl text-white mb-3">Everything Your Brand <span className="gradient-text">Needs to Grow</span></h2>
                        <p className="text-slate-400 max-w-xl mx-auto">From strategy to execution — click any service to explore the full details, our approach and pricing.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ALL_SERVICES.map((svc, i) => {
                            const Icon = iconMap[svc.slug] || TrendingUp;
                            const c = colorMap[svc.slug] || colorMap['seo-content-marketing'];
                            const price = getStartingPrice(svc.slug);
                            return (
                                <motion.div
                                    key={svc.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: i * 0.05 }}
                                    className={`glass-card-hover flex flex-col p-7 bg-gradient-to-br ${c.card} border ${c.border} group cursor-pointer`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${c.iconBg} border ${c.border} flex items-center justify-center mb-5`}>
                                        <Icon size={26} className={c.icon} />
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="font-syne font-bold text-xl text-white mb-2 leading-snug">
                                            {svc.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                            {svc.metaDesc}
                                        </p>

                                        <div className="space-y-1.5 mb-5">
                                            {svc.howItWorks.slice(0, 3).map(step => (
                                                <div key={step.step} className="flex items-start gap-2">
                                                    <CheckCircle size={13} className={`${c.icon} mt-0.5 shrink-0`} />
                                                    <span className="text-slate-400 text-xs">{step.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        {price && (
                                            <span className={`text-xs font-semibold ${c.icon} opacity-90`}>{price}</span>
                                        )}
                                        <Link
                                            href={`/services/${svc.slug}`}
                                            className={`ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${c.icon} bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:gap-3`}
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
                    <p className="text-slate-400 mb-6">Book a free strategy call and get a custom proposal tailored to your brand and your goals.</p>
                    <Link href="/contact" className="btn-glow flex justify-center w-full sm:w-auto !py-4 !px-8 text-base">
                        Get Free Proposal <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
