// pages/case-studies.tsx
import Head from 'next/head';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';

const cases = [
    {
        brand: 'TechCorp India',
        industry: 'Technology',
        service: 'SEO + Content Marketing',
        duration: '6 months',
        challenge: 'TechCorp was struggling with poor organic visibility. Their domain authority was low, technical issues were rampant, and they had no content strategy.',
        solution: 'We conducted a full SEO audit, fixed 247 technical issues, built a topic-cluster content strategy, and acquired 80+ high-DA backlinks.',
        results: [
            { metric: 'Organic Traffic', value: '+340%' },
            { metric: 'Page 1 Keywords', value: '120+' },
            { metric: 'Domain Authority', value: '18 → 42' },
            { metric: 'Monthly Leads from SEO', value: '+280%' },
        ],
        color: 'from-blue-900/70 to-slate-900',
        tag: 'badge-blue',
    },
    {
        brand: 'Fashion Hive',
        industry: 'E-commerce / Fashion',
        service: 'Performance Ads (Meta + Google)',
        duration: '3 months',
        challenge: 'Fashion Hive was spending ₹3L/month on ads with a 1.8x ROAS. Their targeting was broad and creatives were not optimized for conversion.',
        solution: 'We rebuilt their entire ad account structure from scratch — new audience segments, dynamic creative testing, and custom retargeting funnels.',
        results: [
            { metric: 'ROAS', value: '1.8x → 8.2x' },
            { metric: 'CPA Reduction', value: '-62%' },
            { metric: 'Revenue from Ads', value: '+₹42L/mo' },
            { metric: 'New Customers', value: '+3,200/mo' },
        ],
        color: 'from-purple-900/70 to-slate-900',
        tag: 'badge-purple',
    },
    {
        brand: 'BuildMasters',
        industry: 'Construction & Real Estate',
        service: 'Social Media + Local SEO',
        duration: '90 days',
        challenge: 'BuildMasters had zero social media presence and no local SEO strategy. They relied entirely on referrals and word-of-mouth for leads.',
        solution: 'We launched their Instagram & LinkedIn from zero, created educational construction content, and optimized their Google Business profile and local SEO.',
        results: [
            { metric: 'Social Reach', value: '500K+' },
            { metric: 'Instagram Followers', value: '0 → 18,500' },
            { metric: 'Local Search Visibility', value: '+420%' },
            { metric: 'Quote Requests', value: '+180%' },
        ],
        color: 'from-cyan-900/70 to-slate-900',
        tag: 'badge-cyan',
    },
];

export default function CaseStudiesPage() {
    return (
        <>
            <Head>
                <title>Case Studies – ScalerHouse Growth Results</title>
                <meta name="description" content="Real results from real brands. See how ScalerHouse helped brands achieve 8x ROAS, 340% traffic growth, and 500K+ social reach." />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            <section className="hero-bg grid-bg pt-32 pb-16">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <span className="badge badge-cyan mb-4">Proof of Work</span>
                    <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-5">
                        Real Results. <span className="gradient-text">Real Brands.</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        We let our work do the talking. Every case study below is a real client, with real numbers.
                    </p>
                </div>
            </section>

            <section className="py-20 bg-[#0a1222]">
                <div className="max-w-5xl mx-auto px-6 space-y-12">
                    {cases.map((cs, i) => (
                        <motion.div
                            key={cs.brand}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className={`rounded-2xl overflow-hidden bg-gradient-to-br ${cs.color} border border-white/10`}
                        >
                            <div className="p-8 lg:p-10">
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className={`badge ${cs.tag}`}>{cs.service}</span>
                                    <span className="text-slate-400 text-sm">{cs.industry}</span>
                                    <span className="text-slate-400 text-sm">· {cs.duration}</span>
                                </div>
                                <h2 className="font-syne font-black text-3xl text-white mb-6">{cs.brand}</h2>
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h3 className="text-slate-400 text-sm font-medium mb-2">THE CHALLENGE</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">{cs.challenge}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-400 text-sm font-medium mb-2">OUR SOLUTION</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">{cs.solution}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {cs.results.map(r => (
                                        <div key={r.metric} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <div className="font-syne font-black text-2xl lg:text-3xl gradient-text">{r.value}</div>
                                            <div className="text-slate-400 text-xs mt-1">{r.metric}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-14 text-center">
                    <p className="text-slate-400 mb-5">Ready to become our next success story?</p>
                    <Link href="/contact" className="btn-glow !py-4 !px-8 text-base">
                        Get Free Proposal <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
