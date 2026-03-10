// pages/blog.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFAB from '../components/layout/WhatsAppFAB';

type BlogPost = { _id: string; id?: string; title: string; slug: string; excerpt: string; content: string; category: string; author: string; coverImage?: string; publishedAt: string; status: string; };

const categories = ['All', 'SEO', 'Performance Marketing', 'Social Media', 'Analytics', 'Strategy', 'Web Development', 'Email Marketing', 'Google My Business', 'App Development', 'UI/UX Design', 'Graphic Designing', 'Logo Designing', 'CRM Development', 'API Automations'];

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filtered, setFiltered] = useState<BlogPost[]>([]);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blog')
            .then(r => r.json())
            .then((data: BlogPost[]) => {
                const published = Array.isArray(data) ? data : [];
                setPosts(published);
                setFiltered(published);
            })
            .catch(() => { setPosts([]); setFiltered([]); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = posts;
        if (category !== 'All') result = result.filter(p => p.category === category);
        if (query) result = result.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase()));
        setFiltered(result);
    }, [query, category, posts]);

    return (
        <>
            <Head>
                <title>Blog – Digital Marketing Insights | ScalerHouse</title>
                <meta name="description" content="Expert insights on SEO, performance marketing, social media, and digital growth from the ScalerHouse team." />
            </Head>
            <Navbar />
            <WhatsAppFAB />

            <section className="hero-bg grid-bg pt-32 pb-14">
                <div className="orb orb-1" />
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <span className="badge badge-blue mb-4">Growth Insights</span>
                    <h1 className="font-syne font-black text-5xl lg:text-6xl text-white mb-4">
                        The ScalerHouse <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-slate-400 mb-8">Expert strategies, case studies, and tactics to grow your brand online.</p>
                    <div className="relative max-w-md mx-auto">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="form-input !pl-11"
                            placeholder="Search articles..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#0a1222]">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-blue-600 text-white' : 'glass-card text-slate-400 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading articles...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No articles found. Try a different filter.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((post, i) => (
                                <motion.article
                                    key={post._id || post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="glass-card-hover overflow-hidden"
                                >
                                    <div className="h-36 bg-gradient-to-br from-blue-900/80 to-slate-900 flex items-center justify-center">
                                        <span className="font-syne font-black text-4xl gradient-text opacity-40">SH</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="badge badge-blue">
                                                <Tag size={10} className="mr-1" />{post.category}
                                            </span>
                                            <span className="text-slate-500 text-xs flex items-center gap-1">
                                                <Calendar size={11} />{new Date(post.publishedAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                        <h2 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h2>
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-cyan-400 text-sm hover:gap-2 transition-all">
                                            Read More <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
