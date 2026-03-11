// pages/admin/offers.tsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, saveAll, addItem, deleteItem, KEYS, Offer, genId } from '../../lib/store';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



const emptyOffer: Partial<Offer> = {
    title: '', description: '', couponCode: '', discount: 10, discountType: 'percentage',
    startDate: '', endDate: '', pages: ['/'], isActive: true,
};

function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<Partial<Offer>>(emptyOffer);

    const reload = () => setOffers(getAll<Offer>(KEYS.OFFERS));
    useEffect(() => { reload(); }, []);

    const toggleActive = (id: string) => {
        const all = getAll<Offer>(KEYS.OFFERS);
        const idx = all.findIndex(o => o.id === id);
        if (idx !== -1) all[idx].isActive = !all[idx].isActive;
        saveAll(KEYS.OFFERS, all);
        toast.success('Updated!');
        reload();
    };

    const handleSave = () => {
        const offer: Offer = {
            ...emptyOffer as Offer,
            ...form,
            id: genId(),
            createdAt: new Date().toISOString(),
        };
        addItem<Offer>(KEYS.OFFERS, offer);
        toast.success('Offer created!');
        setShowModal(false);
        setForm(emptyOffer);
        reload();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this offer?')) return;
        deleteItem<Offer>(KEYS.OFFERS, id);
        toast.success('Deleted');
        reload();
    };

    const handlePagesChange = (page: string) => {
        const pages = form.pages || [];
        setForm({ ...form, pages: pages.includes(page) ? pages.filter(p => p !== page) : [...pages, page] });
    };

    return (
        <DashboardLayout navItems={adminNav} title="Offers & Popups" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Offers – Admin | ScalerHouse</title></Head>

            <div className="flex justify-end mb-5">
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm">
                    <Plus size={15} /> Create Offer
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
                {offers.length === 0 ? (
                    <div className="col-span-2 text-center text-slate-500 py-16">No offers created yet. Create your first campaign!</div>
                ) : offers.map(offer => (
                    <div key={offer.id} className={`glass-card p-5 border ${offer.isActive ? 'border-cyan-400/20' : 'border-white/5 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-white">{offer.title}</h3>
                                <p className="text-slate-400 text-sm mt-1">{offer.description}</p>
                            </div>
                            <button onClick={() => toggleActive(offer.id)} className={`p-1 rounded transition-colors ${offer.isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                                {offer.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="badge badge-yellow font-mono font-bold">{offer.couponCode}</span>
                            <span className="badge badge-green">{offer.discount}{offer.discountType === 'percentage' ? '%' : '₹'} OFF</span>
                            <span className={`badge ${offer.isActive ? 'badge-cyan' : 'badge-red'}`}>{offer.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="text-slate-500 text-xs mb-3">
                            {new Date(offer.startDate).toLocaleDateString('en-IN')} – {new Date(offer.endDate).toLocaleDateString('en-IN')}
                        </div>
                        <div className="flex gap-2 text-xs mb-3">
                            {offer.pages.map(p => <span key={p} className="badge badge-blue">{p}</span>)}
                        </div>
                        <button onClick={() => handleDelete(offer.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors">
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Create Offer Campaign</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Offer Title</label>
                                <input className="form-input !text-sm" placeholder="e.g. Diwali Special 20% Off" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea className="form-input !h-20 resize-none !text-sm" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Coupon Code</label>
                                    <input className="form-input !text-sm font-mono" placeholder="HOLI20" value={form.couponCode || ''} onChange={e => setForm({ ...form, couponCode: e.target.value.toUpperCase() })} />
                                </div>
                                <div>
                                    <label className="form-label">Discount</label>
                                    <div className="flex gap-2">
                                        <input type="number" className="form-input !text-sm flex-1" value={form.discount || 10} onChange={e => setForm({ ...form, discount: parseInt(e.target.value) })} />
                                        <select className="form-input !text-sm w-32" value={form.discountType || 'percentage'} onChange={e => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}>
                                            <option value="percentage">%</option>
                                            <option value="fixed">₹ Fixed</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Start Date</label>
                                    <input type="date" className="form-input !text-sm" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label">End Date</label>
                                    <input type="date" className="form-input !text-sm" value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Show Popup On Pages</label>
                                <div className="flex flex-wrap gap-2">
                                    {['/', '/services', '/contact', '/about', '/blog'].map(page => (
                                        <button key={page} type="button" onClick={() => handlePagesChange(page)} className={`badge cursor-pointer ${(form.pages || []).includes(page) ? 'badge-cyan' : 'badge-blue opacity-40'}`}>
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button onClick={handleSave} className="btn-glow flex-1 justify-center !py-3">Create Offer</button>
                                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(OffersPage, ['admin']);
