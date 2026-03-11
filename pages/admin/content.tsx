// pages/admin/content.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Link as LinkIcon, Image as ImageIcon, Check, X } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



type ContentType = 'client_logo' | 'achievement' | 'news_link' | 'faq';

interface ContentItem {
    _id: string;
    type: ContentType;
    title: string;
    imageUrl?: string;
    linkUrl?: string;
    description?: string;
    isActive: boolean;
    order: number;
}

const TABS: { id: ContentType; label: string; desc: string }[] = [
    { id: 'client_logo', label: 'Client Logos', desc: 'Manage the "Our Clients" logo carousel' },
    { id: 'achievement', label: 'Achievements', desc: 'Manage certificates, awards, and badges' },
    { id: 'news_link', label: 'Featured News', desc: 'Manage logos and links for PR and news features' },
    { id: 'faq', label: 'Why Choose Us (FAQs)', desc: 'Manage the homepage value proposition accordion' },
];

const EMPTY_FORM = { title: '', imageUrl: '', linkUrl: '', description: '' };

function ContentAdminPage() {
    const [activeTab, setActiveTab] = useState<ContentType>('client_logo');
    const [items, setItems] = useState<Record<ContentType, ContentItem[]>>({
        client_logo: [], achievement: [], news_link: [], faq: []
    });
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const loadContent = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/content');
            if (res.ok) {
                const data: ContentItem[] = await res.json();
                const grouped = {
                    client_logo: data.filter(d => d.type === 'client_logo'),
                    achievement: data.filter(d => d.type === 'achievement'),
                    news_link: data.filter(d => d.type === 'news_link'),
                    faq: data.filter(d => d.type === 'faq'),
                };
                setItems(grouped);
            }
        } catch (e) {
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadContent(); }, []);

    const handleOpenModal = (item?: ContentItem) => {
        if (item) {
            setEditingId(item._id);
            setForm({ title: item.title, imageUrl: item.imageUrl || '', linkUrl: item.linkUrl || '', description: item.description || '' });
        } else {
            setEditingId(null);
            setForm(EMPTY_FORM);
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.title) return toast.error('Title is required');

        // Client logos and achievements need images (unless it's an FAQ)
        if (activeTab !== 'faq' && !form.imageUrl) return toast.error('Image URL is required');

        setSaving(true);
        const token = localStorage.getItem('sh_token') || '';
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

        try {
            if (editingId) {
                const res = await fetch('/api/content', {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ id: editingId, ...form }),
                });
                if (!res.ok) throw new Error('Update failed');
                toast.success('Updated successfully');
            } else {
                const res = await fetch('/api/content', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ type: activeTab, ...form }),
                });
                if (!res.ok) throw new Error('Create failed');
                toast.success('Created successfully');
            }
            setShowModal(false);
            loadContent();
        } catch (e: any) {
            toast.error(e.message || 'Error saving item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item? It will be removed from the public website.')) return;
        const token = localStorage.getItem('sh_token') || '';
        try {
            const res = await fetch(`/api/content?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Delete failed');
            toast.success('Item deleted');
            loadContent();
        } catch {
            toast.error('Failed to delete item');
        }
    };

    const toggleStatus = async (item: ContentItem) => {
        const token = localStorage.getItem('sh_token') || '';
        try {
            const res = await fetch('/api/content', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id: item._id, isActive: !item.isActive })
            });
            if (res.ok) {
                toast.success(item.isActive ? 'Item hidden' : 'Item published');
                loadContent();
            }
        } catch {
            toast.error('Failed to update status');
        }
    };

    const currentItems = items[activeTab] || [];
    const activeTabData = TABS.find(t => t.id === activeTab)!;

    return (
        <DashboardLayout navItems={adminNav} title="Homepage Content" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Homepage Content – Admin | ScalerHouse</title></Head>

            <div className="mb-6">
                <p className="text-slate-400 text-sm">Manage dynamic sections of the public homepage. Changes reflect immediately.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-white/10">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                                ? 'bg-cyan-400/10 text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-lg font-syne font-bold text-white">{activeTabData.label}</h2>
                    <p className="text-xs text-slate-500">{activeTabData.desc}</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-glow !py-2 !px-4 !text-sm flex items-center gap-2">
                    <Plus size={15} /> Add Item
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading content...</div>
            ) : currentItems.length === 0 ? (
                <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl">
                    No items found for {activeTabData.label}. Click "+ Add Item" to get started.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {currentItems.map(item => (
                        <div key={item._id} className={`glass-card p-5 border transition-all ${!item.isActive ? 'opacity-50 border-red-500/20' : 'border-white/8'}`}>

                            {/* Header / Active Status */}
                            <div className="flex justify-between items-start mb-4">
                                <button
                                    onClick={() => toggleStatus(item)}
                                    className={`badge ${item.isActive ? 'badge-green' : 'badge-red'} cursor-pointer hover:opacity-80 transition-opacity`}
                                    title="Click to toggle visibility"
                                >
                                    {item.isActive ? 'Live' : 'Hidden'}
                                </button>
                                <div className="flex gap-1">
                                    <button onClick={() => handleOpenModal(item)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            {/* Image Preview (if applicable) */}
                            {item.imageUrl && (
                                <div className="h-24 bg-white/5 rounded-lg flex items-center justify-center mb-4 p-2 relative overflow-hidden group">
                                    <img src={item.imageUrl} alt={item.title} className="max-h-full max-w-full object-contain" />
                                </div>
                            )}

                            {/* Content Details */}
                            <h3 className="font-syne font-bold text-white text-lg mb-1 line-clamp-1" title={item.title}>{item.title}</h3>

                            {item.description && (
                                <p className="text-slate-400 text-xs mb-3 line-clamp-3" title={item.description}>{item.description}</p>
                            )}

                            {item.linkUrl && (
                                <a href={item.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-400/10 mt-auto">
                                    <LinkIcon size={12} /> Visit Link
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box !max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-syne font-bold text-xl text-white">
                                {editingId ? 'Edit Item' : `Add ${activeTabData.label.replace(/s$/, '')}`}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="form-label">{activeTab === 'faq' ? 'Question (Title) *' : 'Title / Name *'}</label>
                                <input
                                    className="form-input"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder={activeTab === 'client_logo' ? 'e.g. TATA' : activeTab === 'faq' ? 'e.g. Do you guarantee results?' : 'Enter title'}
                                />
                            </div>

                            {activeTab !== 'faq' && (
                                <div>
                                    <label className="form-label flex items-center gap-1.5"><ImageIcon size={14} /> Image Logo URL *</label>
                                    <input
                                        className="form-input"
                                        value={form.imageUrl}
                                        onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Provide a public URL for the logo or badge. Transparent PNG/SVG recommended.</p>
                                </div>
                            )}

                            {activeTab === 'news_link' && (
                                <div>
                                    <label className="form-label flex items-center gap-1.5"><LinkIcon size={14} /> News Link / Article URL</label>
                                    <input
                                        className="form-input"
                                        type="url"
                                        value={form.linkUrl}
                                        onChange={e => setForm(p => ({ ...p, linkUrl: e.target.value }))}
                                        placeholder="https://forbes.com/article/..."
                                    />
                                </div>
                            )}

                            {(activeTab === 'faq' || activeTab === 'achievement') && (
                                <div>
                                    <label className="form-label">{activeTab === 'faq' ? 'Answer (Description) *' : 'Short Description (Optional)'}</label>
                                    <textarea
                                        className="form-input !h-24"
                                        value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Enter the description..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSave} disabled={saving} className="btn-glow flex-1 justify-center">
                                {saving ? 'Saving...' : editingId ? 'Update Item' : 'Create Item'}
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}

export default withAuth(ContentAdminPage, ['admin']);
