// pages/admin/blog.tsx – Admin Blog Management (API-backed)
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
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

const categories = ['SEO', 'Performance Marketing', 'Social Media', 'Analytics', 'Strategy', 'Case Study', 'Web Development', 'Email Marketing', 'Google My Business', 'App Development', 'UI/UX Design', 'Graphic Designing', 'Logo Designing', 'CRM Development', 'API Automations'];

type BlogPost = { _id: string; title: string; slug: string; excerpt: string; content: string; category: string; author: string; coverImage?: string; publishedAt: string; status: string; };
type FormState = Partial<Omit<BlogPost, '_id'>>;

const emptyPost: FormState = { title: '', slug: '', excerpt: '', content: '', category: 'SEO', author: 'ScalerHouse Team', status: 'Draft' };

function getAuthToken(): string {
    return typeof window !== 'undefined' ? (localStorage.getItem('sh_token') || '') : '';
}

function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<FormState>(emptyPost);
    const [editing, setEditing] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const reload = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blog?all=true');
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { reload(); }, []);

    const autoSlug = (title: string) =>
        title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleSave = async () => {
        if (!form.title) { toast.error('Title is required'); return; }
        setSaving(true);
        const token = getAuthToken();
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        const body = { ...form, slug: form.slug || autoSlug(form.title || '') };

        try {
            if (editing) {
                const res = await fetch(`/api/blog/${editing}`, { method: 'PUT', headers, body: JSON.stringify(body) });
                if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
                toast.success('Post updated!');
            } else {
                const res = await fetch('/api/blog', { method: 'POST', headers, body: JSON.stringify(body) });
                if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
                toast.success('Post created!');
            }
            setShowModal(false);
            setEditing(null);
            setForm(emptyPost);
            await reload();
        } catch (e: any) {
            toast.error(e.message || 'Error saving post');
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (post: BlogPost) => {
        const token = getAuthToken();
        const newStatus = post.status === 'Published' ? 'Draft' : 'Published';
        try {
            const res = await fetch(`/api/blog/${post._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Failed to update status');
            toast.success(`Status changed to ${newStatus}`);
            await reload();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post permanently?')) return;
        const token = getAuthToken();
        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete');
            toast.success('Post deleted');
            await reload();
        } catch {
            toast.error('Failed to delete post');
        }
    };

    const openEdit = (p: BlogPost) => {
        setEditing(p._id);
        setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author, coverImage: p.coverImage, publishedAt: p.publishedAt, status: p.status });
        setShowModal(true);
    };

    return (
        <DashboardLayout navItems={adminNav} title="Blog Management" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Blog – Admin | ScalerHouse</title></Head>

            <div className="flex justify-between items-center mb-5">
                <p className="text-slate-400 text-sm">{posts.length} article{posts.length !== 1 ? 's' : ''} total</p>
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
                        {loading ? (
                            <tr><td colSpan={6} className="text-center text-slate-500 py-10">Loading blog posts...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center text-slate-500 py-10">No blog posts yet. Create your first article!</td></tr>
                        ) : posts.map(p => (
                            <tr key={p._id}>
                                <td><div className="font-medium text-white">{p.title}</div><div className="text-slate-500 text-xs">/blog/{p.slug}</div></td>
                                <td><span className="badge badge-blue text-xs">{p.category}</span></td>
                                <td className="text-slate-400 text-sm">{p.author}</td>
                                <td className="text-slate-500 text-xs">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-IN') : '—'}</td>
                                <td>
                                    <button onClick={() => toggleStatus(p)} className={`badge cursor-pointer ${p.status === 'Published' ? 'badge-green' : 'badge-yellow'}`}>
                                        {p.status}
                                    </button>
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(p)} className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-blue-400/10"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
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
                                    <select className="form-input !text-sm" value={form.status || 'Draft'} onChange={e => setForm({ ...form, status: e.target.value })}>
                                        <option>Draft</option><option>Published</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Cover Image URL</label>
                                <input className="form-input !text-sm" value={form.coverImage || ''} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="form-label">Excerpt</label>
                                <textarea className="form-input !h-20 resize-none !text-sm" value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description for listing" />
                            </div>
                            <div>
                                <label className="form-label">Content (Markdown)</label>
                                <textarea className="form-input !h-40 resize-none !text-sm font-mono" value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Full article content in Markdown..." />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleSave} disabled={saving} className="btn-glow flex-1 justify-center !py-3">
                                    {saving ? 'Saving...' : 'Save Post'}
                                </button>
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
