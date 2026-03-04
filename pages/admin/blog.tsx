// pages/admin/blog.tsx – Admin Blog Management
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, deleteItem, saveAll, KEYS, BlogPost, genId } from '../../lib/store';
import toast from 'react-hot-toast';

const adminNav = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/leads', label: 'CRM / Leads', icon: '🎯' },
    { href: '/admin/clients', label: 'Clients', icon: '🏢' },
    { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
    { href: '/admin/employees', label: 'Employees', icon: '👥' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📄' },
    { href: '/admin/blog', label: 'Blog', icon: '✍️' },
    { href: '/admin/services', label: 'Services & Pricing', icon: '⚙️' },
    { href: '/admin/offers', label: 'Offers & Popups', icon: '🎁' },
    { href: '/admin/careers', label: 'Careers', icon: '💼' },
    { href: '/admin/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/admin/activity', label: 'Activity Log', icon: '📋' },
];

const categories = ['SEO', 'Performance Marketing', 'Social Media', 'Analytics', 'Strategy', 'Case Study'];

const emptyPost: Partial<BlogPost> = { title: '', slug: '', excerpt: '', content: '', category: 'SEO', author: 'ScalerHouse Team', status: 'Draft' };

function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<BlogPost>>(emptyPost);
    const [editing, setEditing] = useState<string | null>(null);

    const reload = () => setPosts(getAll<BlogPost>(KEYS.BLOG));
    useEffect(() => { reload(); }, []);

    const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleSave = () => {
        const all = getAll<BlogPost>(KEYS.BLOG);
        if (editing) {
            const idx = all.findIndex(p => p.id === editing);
            if (idx !== -1) all[idx] = { ...all[idx], ...form as BlogPost };
            saveAll(KEYS.BLOG, all);
            toast.success('Post updated!');
        } else {
            const post: BlogPost = {
                id: genId(),
                title: form.title || '',
                slug: form.slug || autoSlug(form.title || ''),
                excerpt: form.excerpt || '',
                content: form.content || '',
                category: form.category || 'SEO',
                author: form.author || 'ScalerHouse Team',
                publishedAt: new Date().toISOString().slice(0, 10),
                status: form.status || 'Draft',
            };
            addItem<BlogPost>(KEYS.BLOG, post);
            toast.success('Post created!');
        }
        setShowModal(false);
        setEditing(null);
        setForm(emptyPost);
        reload();
    };

    const toggleStatus = (id: string) => {
        const all = getAll<BlogPost>(KEYS.BLOG);
        const idx = all.findIndex(p => p.id === id);
        if (idx !== -1) all[idx].status = all[idx].status === 'Published' ? 'Draft' : 'Published';
        saveAll(KEYS.BLOG, all);
        toast.success('Status changed!');
        reload();
    };

    const openEdit = (p: BlogPost) => { setEditing(p.id); setForm(p); setShowModal(true); };

    return (
        <DashboardLayout navItems={adminNav} title="Blog Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Blog – Admin | ScalerHouse</title></Head>

            <div className="flex justify-end mb-5">
                <button onClick={() => { setEditing(null); setForm(emptyPost); setShowModal(true); }} className="btn-glow !py-2 !px-4 !text-sm">
                    <Plus size={15} /> New Post
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr><th>Title</th><th>Category</th><th>Author</th><th>Published</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-500 py-10">No blog posts. Create your first article!</td></tr>
                        ) : posts.map(p => (
                            <tr key={p.id}>
                                <td><div className="font-medium text-white">{p.title}</div><div className="text-slate-500 text-xs">/blog/{p.slug}</div></td>
                                <td><span className="badge badge-blue text-xs">{p.category}</span></td>
                                <td className="text-slate-400 text-sm">{p.author}</td>
                                <td className="text-slate-500 text-xs">{new Date(p.publishedAt).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <button onClick={() => toggleStatus(p.id)} className={`badge cursor-pointer ${p.status === 'Published' ? 'badge-green' : 'badge-yellow'}`}>
                                        {p.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(p)} className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"><Edit size={14} /></button>
                                        <button onClick={() => { if (confirm('Delete?')) { deleteItem<BlogPost>(KEYS.BLOG, p.id); reload(); toast.success('Deleted'); } }} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Title *</label>
                                <input className="form-input !text-sm" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })} placeholder="Article title" />
                            </div>
                            <div>
                                <label className="form-label">Slug</label>
                                <input className="form-input !text-sm font-mono" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Category</label>
                                    <select className="form-input !text-sm" value={form.category || 'SEO'} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {categories.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Status</label>
                                    <select className="form-input !text-sm" value={form.status || 'Draft'} onChange={e => setForm({ ...form, status: e.target.value as BlogPost['status'] })}>
                                        <option>Draft</option><option>Published</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Excerpt</label>
                                <textarea className="form-input !h-20 resize-none !text-sm" value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description for listing" />
                            </div>
                            <div>
                                <label className="form-label">Content</label>
                                <textarea className="form-input !h-32 resize-none !text-sm" value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Full article content" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} className="btn-glow flex-1 justify-center !py-3">Save Post</button>
                                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(BlogPage, ['admin']);
