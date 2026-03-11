// pages/blog/[slug].tsx – Individual Blog Post Page
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WhatsAppFAB from '../../components/layout/WhatsAppFAB';

type BlogPost = {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    coverImage?: string;
    publishedAt: string;
    status: string;
};

function renderMarkdown(md: string): string {
    if (!md) return '';
    return md
        // Remove Windows line endings
        .replace(/\r\n/g, '\n')
        // H1
        .replace(/^# (.+)$/gm, '<h1 class="font-syne font-black text-3xl text-white mt-8 mb-4">$1</h1>')
        // H2
        .replace(/^## (.+)$/gm, '<h2 class="font-syne font-bold text-2xl text-white mt-8 mb-3 border-b border-white/10 pb-2">$1</h2>')
        // H3
        .replace(/^### (.+)$/gm, '<h3 class="font-semibold text-xl text-blue-300 mt-6 mb-2">$1</h3>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
        // Images with captions
        .replace(/!\[(.+?)\]\((.+?)\)\n\*(.+?)\*/g, '<figure class="my-6"><img src="$2" alt="$1" class="w-full rounded-xl object-cover max-h-80" /><figcaption class="text-slate-500 text-sm text-center mt-2">$3</figcaption></figure>')
        // Images without captions
        .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl object-cover max-h-80 my-6" />')
        // Hr
        .replace(/^---$/gm, '<hr class="border-white/10 my-8" />')
        // Numbered list items
        .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 mb-1 ml-4 list-decimal">$1</li>')
        // Bullet list items
        .replace(/^- (.+)$/gm, '<li class="text-slate-300 mb-1 ml-4 list-disc">$1</li>')
        // Blockquote
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 text-slate-400 italic my-4">$1</blockquote>')
        // Paragraphs (lines that aren't already HTML)
        .split('\n\n')
        .map(block => {
            if (block.trim().startsWith('<') || block.trim() === '') return block;
            return `<p class="text-slate-300 leading-relaxed mb-4">${block.replace(/\n/g, ' ')}</p>`;
        })
        .join('\n');
}

export default function BlogPostPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/blog?all=true`)
            .then(r => r.json())
            .then((posts: BlogPost[]) => {
                const found = Array.isArray(posts) ? posts.find(p => p.slug === slug) : null;
                if (found) setPost(found);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen hero-bg flex items-center justify-center">
                    <div className="text-slate-400 text-lg">Loading article...</div>
                </div>
                <Footer />
            </>
        );
    }

    if (notFound || !post) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen hero-bg flex flex-col items-center justify-center gap-4">
                    <h1 className="font-syne font-black text-3xl text-white">Article Not Found</h1>
                    <p className="text-slate-400">This blog post doesn&apos;t exist or has been removed.</p>
                    <Link href="/blog" className="btn-glow !py-2 !px-6">← Back to Blog</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{post.title} | ScalerHouse Blog</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                {post.coverImage && <meta property="og:image" content={post.coverImage} />}
            </Head>
            <Navbar />
            <WhatsAppFAB />

            {/* Hero Section */}
            <section className="hero-bg grid-bg pt-32 pb-14">
                <div className="orb orb-1" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
                        <ArrowLeft size={15} /> Back to Blog
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="badge badge-blue"><Tag size={10} className="mr-1 inline" />{post.category}</span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Calendar size={13} />{new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="font-syne font-black text-3xl lg:text-5xl text-white mb-4 leading-tight">{post.title}</h1>
                        <p className="text-slate-400 text-lg mb-6">{post.excerpt}</p>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <User size={14} />
                            <span>By {post.author}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cover Image */}
            {post.coverImage && (
                <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
                    <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl object-cover max-h-96 shadow-xl shadow-black/40" />
                </div>
            )}

            {/* Article Content */}
            <section className="py-12 bg-[#0a1222]">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass-card p-8 lg:p-12 prose-custom"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                    />

                    {/* CTA */}
                    <div className="mt-10 glass-card p-8 text-center">
                        <h3 className="font-syne font-bold text-2xl text-white mb-3">Ready to Scale Your Business?</h3>
                        <p className="text-slate-400 mb-6">Get a free strategy consultation from Kanpur&apos;s top digital marketing team.</p>
                        <Link href="/#contact" className="btn-glow inline-flex">Get a Free Consultation →</Link>
                    </div>

                    {/* Back link */}
                    <div className="mt-8 text-center">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft size={15} /> View All Articles
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
