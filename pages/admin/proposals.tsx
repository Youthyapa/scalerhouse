// pages/admin/proposals.tsx – Proposal Generator
import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import { Plus, Download, Eye, Trash2 } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getAll, addItem, deleteItem, KEYS, Proposal, genId, logActivity } from '../../lib/store';
import toast from 'react-hot-toast';
import { adminNav } from '../../lib/adminNav';



const serviceOptions = ['SEO & Content Marketing', 'Performance Ads', 'Social Media Management', 'Web Design & Development', 'Email Marketing', 'Full Growth Package'];
const featuresByService: Record<string, string[]> = {
    'SEO & Content Marketing': ['Technical SEO Audit', 'Keyword Research', 'Content Calendar', '10 Blog Posts/mo', 'Link Building (20 DA40+)', 'Monthly Report'],
    'Performance Ads': ['Google Ads Setup', 'Meta Ads Setup', 'Audience Research', 'Creative Strategy', 'A/B Testing', 'Weekly Reports'],
    'Social Media Management': ['3 Platform Management', 'Content Creation', '20 Posts/mo', 'Community Management', 'Monthly Report'],
    'Web Design & Development': ['Custom Design (5 pages)', 'Responsive Build', 'SEO Setup', 'Speed Optimization', '1 Month Support'],
    'Email Marketing': ['Strategy & Segmentation', '3 Automated Sequences', 'Monthly Newsletter', 'Analytics Report'],
    'Full Growth Package': ['All Services Included', 'Dedicated Growth Manager', 'Priority Support', 'Weekly Strategy Call', 'Monthly CEO Report'],
};

const emptyForm = { clientName: '', service: '', budget: 0, discount: 0, timeline: '3 months', features: [] as string[] };

function ProposalsPage() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState<Proposal | null>(null);
    const [form, setForm] = useState(emptyForm);
    const printRef = useRef<HTMLDivElement>(null);

    const reload = () => setProposals(getAll<Proposal>(KEYS.PROPOSALS));
    useEffect(() => { reload(); }, []);

    const autoFillFeatures = (service: string) => {
        setForm(prev => ({ ...prev, service, features: featuresByService[service] || [] }));
    };

    const toggleFeature = (f: string) => {
        setForm(prev => ({
            ...prev,
            features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f],
        }));
    };

    const handleCreate = () => {
        const p: Proposal = {
            id: genId(),
            clientName: form.clientName,
            service: form.service,
            budget: form.budget,
            discount: form.discount,
            timeline: form.timeline,
            features: form.features,
            status: 'Draft',
            createdAt: new Date().toISOString(),
        };
        addItem<Proposal>(KEYS.PROPOSALS, p);
        logActivity(`Proposal created for ${form.clientName}`, 'Admin');
        toast.success('Proposal created!');
        setShowModal(false);
        setForm(emptyForm);
        reload();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete proposal?')) return;
        deleteItem<Proposal>(KEYS.PROPOSALS, id);
        toast.success('Deleted');
        reload();
    };

    const handleDownload = async (proposal: Proposal) => {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const finalPrice = proposal.budget - (proposal.budget * proposal.discount / 100);

        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('SCALERHOUSE', 20, 30);
        doc.setFontSize(10);
        doc.setTextColor(100, 163, 251);
        doc.text('Engineering Predictable Growth for Ambitious Brands', 20, 38);
        doc.setDrawColor(0, 212, 255);
        doc.setLineWidth(0.5);
        doc.line(20, 42, 190, 42);

        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('GROWTH PROPOSAL', 20, 56);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`Prepared for: ${proposal.clientName}`, 20, 66);
        doc.text(`Service: ${proposal.service}`, 20, 73);
        doc.text(`Date: ${new Date(proposal.createdAt).toLocaleDateString('en-IN')}`, 20, 80);
        doc.text(`Timeline: ${proposal.timeline}`, 20, 87);

        doc.setTextColor(0, 212, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('WHAT\'S INCLUDED', 20, 102);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(226, 232, 240);
        proposal.features.forEach((f, i) => doc.text(`• ${f}`, 25, 112 + i * 8));

        const priceY = 112 + proposal.features.length * 8 + 15;
        doc.setDrawColor(29, 78, 216);
        doc.setLineWidth(0.3);
        doc.line(20, priceY, 190, priceY);
        doc.setFontSize(12);
        doc.setTextColor(148, 163, 184);
        doc.text(`Investment: ₹${proposal.budget.toLocaleString()}`, 20, priceY + 12);
        if (proposal.discount > 0) {
            doc.setTextColor(251, 191, 36);
            doc.text(`Special Discount: ${proposal.discount}%`, 20, priceY + 20);
        }
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text(`Final Price: ₹${finalPrice.toLocaleString()}/month`, 20, priceY + 32);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Terms: 50% advance, 50% on delivery. 30-day cancellation policy.', 20, priceY + 48);
        doc.text('This proposal is valid for 15 days from the date of issue.', 20, priceY + 55);

        doc.line(20, 275, 190, 275);
        doc.setTextColor(150, 150, 150);
        doc.text('hello@scalerhouse.com  |  +91 91961 31120  |  scalerhouse.com', 20, 282);
        doc.setTextColor(0, 212, 255);
        doc.text('ScalerHouse – Scale Faster. Smarter. Stronger.', 20, 289);

        doc.save(`ScalerHouse_Proposal_${proposal.clientName.replace(/\s+/g, '_')}.pdf`);
        toast.success('Proposal downloaded as PDF!');
    };

    const netPrice = (p: Proposal) => p.budget - (p.budget * p.discount / 100);

    return (
        <DashboardLayout navItems={adminNav} title="Proposal Generator" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Proposals – Admin | ScalerHouse</title></Head>

            <div className="flex justify-end mb-5">
                <button onClick={() => setShowModal(true)} className="btn-glow !py-2 !px-4 !text-sm">
                    <Plus size={15} /> Generate Proposal
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Investment</th>
                            <th>Net Price</th>
                            <th>Timeline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.length === 0 ? (
                            <tr><td colSpan={7} className="text-center text-slate-500 py-10">No proposals yet. Generate your first one!</td></tr>
                        ) : proposals.map(p => (
                            <tr key={p.id}>
                                <td className="text-white font-medium">{p.clientName}</td>
                                <td className="text-slate-300 text-sm">{p.service}</td>
                                <td className="text-white">₹{p.budget.toLocaleString()}/mo</td>
                                <td className="text-cyan-400 font-semibold">₹{netPrice(p).toLocaleString()}/mo</td>
                                <td className="text-slate-400 text-sm">{p.timeline}</td>
                                <td><span className={`badge text-xs ${p.status === 'Accepted' ? 'badge-green' : p.status === 'Sent' ? 'badge-blue' : p.status === 'Rejected' ? 'badge-red' : 'badge-yellow'}`}>{p.status}</span></td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPreview(p)} className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10"><Eye size={14} /></button>
                                        <button onClick={() => handleDownload(p)} className="p-1.5 rounded text-slate-400 hover:text-green-400 hover:bg-green-400/10"><Download size={14} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 className="font-syne font-bold text-xl text-white mb-5">Generate Proposal</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Client Name *</label>
                                <input className="form-input !text-sm" required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Client / Company Name" />
                            </div>
                            <div>
                                <label className="form-label">Service *</label>
                                <select className="form-input !text-sm" value={form.service} onChange={e => autoFillFeatures(e.target.value)}>
                                    <option value="">Select service...</option>
                                    {serviceOptions.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="form-label">Budget (₹/mo)</label>
                                    <input type="number" className="form-input !text-sm" value={form.budget || ''} onChange={e => setForm({ ...form, budget: parseInt(e.target.value) })} placeholder="50000" />
                                </div>
                                <div>
                                    <label className="form-label">Discount (%)</label>
                                    <input type="number" min={0} max={50} className="form-input !text-sm" value={form.discount || ''} onChange={e => setForm({ ...form, discount: parseInt(e.target.value) })} placeholder="10" />
                                </div>
                                <div>
                                    <label className="form-label">Timeline</label>
                                    <select className="form-input !text-sm" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })}>
                                        {['1 month', '3 months', '6 months', '12 months', 'Ongoing'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            {form.service && (
                                <div>
                                    <label className="form-label">Features (click to toggle)</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {(featuresByService[form.service] || []).map(f => (
                                            <button key={f} type="button" onClick={() => toggleFeature(f)} className={`badge cursor-pointer text-xs ${form.features.includes(f) ? 'badge-cyan' : 'badge-blue opacity-40'}`}>{f}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {form.budget > 0 && (
                                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/20">
                                    <p className="text-slate-400 text-xs">Net Price after discount</p>
                                    <p className="font-syne font-black text-2xl text-cyan-400">
                                        ₹{(form.budget - form.budget * form.discount / 100).toLocaleString()}/mo
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button onClick={handleCreate} disabled={!form.clientName || !form.service} className="btn-glow flex-1 justify-center !py-3 disabled:opacity-40">Create & Save</button>
                                <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {preview && (
                <div className="modal-overlay" onClick={() => setPreview(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="border-b border-white/10 pb-4 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center font-black text-white text-xs">SH</div>
                                <span className="font-syne font-bold text-white">SCALERHOUSE</span>
                            </div>
                            <p className="text-slate-500 text-xs">Engineering Predictable Growth for Ambitious Brands</p>
                        </div>
                        <h2 className="font-syne font-bold text-xl text-white mb-1">Growth Proposal</h2>
                        <p className="text-slate-400 text-sm mb-4">Prepared for: {preview.clientName}</p>
                        <div className="space-y-2 mb-4">
                            {[
                                { l: 'Service', v: preview.service },
                                { l: 'Timeline', v: preview.timeline },
                                { l: 'Budget', v: `₹${preview.budget.toLocaleString()}/mo` },
                                { l: 'Discount', v: `${preview.discount}%` },
                                { l: 'Net Price', v: `₹${netPrice(preview).toLocaleString()}/mo` },
                            ].map(item => (
                                <div key={item.l} className="flex gap-4">
                                    <span className="text-slate-500 text-sm w-24">{item.l}</span>
                                    <span className="text-white text-sm font-medium">{item.v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <p className="text-slate-400 text-xs mb-2">Included features:</p>
                            <div className="space-y-1">
                                {preview.features.map(f => <div key={f} className="flex gap-2 text-slate-300 text-sm"><span className="text-cyan-400">✓</span>{f}</div>)}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleDownload(preview)} className="btn-glow flex-1 justify-center !py-2.5"><Download size={15} /> Download PDF</button>
                            <button onClick={() => setPreview(null)} className="btn-outline">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default withAuth(ProposalsPage, ['admin']);
