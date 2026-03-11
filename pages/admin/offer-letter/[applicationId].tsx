// pages/admin/offer-letter/[applicationId].tsx
// Branded offer letter builder with PDF download and email send

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { Download, Send, ArrowLeft, Building2, Calendar, DollarSign, User, Briefcase, Clock } from 'lucide-react';
import { withAuth } from '../../../lib/auth';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { adminNav } from '../../../lib/adminNav';



interface OfferData {
    candidateName: string;
    candidateEmail: string;
    jobTitle: string;
    department: string;
    joiningDate: string;
    fixedCTC: string;
    variableCTC: string;
    probation: string;
    reportingManager: string;
    workingHours: string;
    location: string;
}

function OfferLetterPage() {
    const router = useRouter();
    const previewRef = useRef<HTMLDivElement>(null);
    const [sending, setSending] = useState(false);

    const [data, setData] = useState<OfferData>({
        candidateName: '',
        candidateEmail: '',
        jobTitle: '',
        department: '',
        joiningDate: '',
        fixedCTC: '',
        variableCTC: '',
        probation: '3 months',
        reportingManager: 'Shashank Singh (Founder & CEO)',
        workingHours: '9:30 AM – 6:30 PM, Monday to Friday',
        location: 'Remote / Kanpur, Uttar Pradesh',
    });

    // Pre-fill from URL query params passed from Applications panel
    useEffect(() => {
        if (!router.isReady) return;
        const { name, email, job } = router.query;
        setData(prev => ({
            ...prev,
            ...(name ? { candidateName: String(name) } : {}),
            ...(email ? { candidateEmail: String(email) } : {}),
            ...(job ? { jobTitle: String(job) } : {}),
        }));
    }, [router.isReady, router.query]);

    const set = (k: keyof OfferData, v: string) => setData(prev => ({ ...prev, [k]: v }));

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const totalCTC = () => {
        const f = parseFloat(data.fixedCTC) || 0;
        const v = parseFloat(data.variableCTC) || 0;
        return (f + v).toFixed(2);
    };

    const downloadPDF = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 60;
        const pageW = 595;
        const w = pageW - margin * 2;

        // Colors
        const darkBg: [number, number, number] = [5, 13, 26];
        const accent: [number, number, number] = [0, 212, 255];
        const white: [number, number, number] = [255, 255, 255];
        const light: [number, number, number] = [148, 163, 184];
        const bodyText: [number, number, number] = [30, 41, 59];

        // Header background
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageW, 130, 'F');

        // Logo text
        doc.setTextColor(...white);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('SCALER', margin, 55);
        doc.setTextColor(...accent);
        doc.text('HOUSE', margin + 80, 55);

        doc.setTextColor(...light);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('GLOBAL DIGITAL GROWTH PARTNER', margin, 68);

        // Offer Letter title
        doc.setTextColor(...white);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('OFFER LETTER', pageW / 2, 100, { align: 'center' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...light);
        doc.text(`Date: ${today}`, pageW - margin, 100, { align: 'right' });

        let y = 155;
        doc.setTextColor(...bodyText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const line = (text: string, bold = false) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, w);
            doc.text(lines, margin, y);
            y += lines.length * 15 + (bold ? 2 : 0);
        };

        // Body
        line(`Dear ${data.candidateName || '[Candidate Name]'},`);
        y += 8;
        line(`We are delighted to extend this offer of employment to you at ScalerHouse as a ${data.jobTitle || '[Position]'} within the ${data.department || '[Department]'} department. After careful consideration of your qualifications and experience, we believe you will be an excellent addition to our team.`);
        y += 12;

        // Details Table
        const rows: [string, string][] = [
            ['Position', data.jobTitle || '—'],
            ['Department', data.department || '—'],
            ['Date of Joining', data.joiningDate || '—'],
            ['Fixed CTC (Per Annum)', data.fixedCTC ? `₹${data.fixedCTC} LPA` : '—'],
            ['Variable CTC (Per Annum)', data.variableCTC ? `₹${data.variableCTC} LPA` : '—'],
            ['Total CTC (Per Annum)', `₹${totalCTC()} LPA`],
            ['Probation Period', data.probation],
            ['Reporting Manager', data.reportingManager || '—'],
            ['Working Hours', data.workingHours],
            ['Work Location', data.location],
        ];

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, w, rows.length * 22 + 16, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, w, rows.length * 22 + 16);
        y += 12;

        rows.forEach(([key, val], i) => {
            const rowY = y + i * 22;
            if (i % 2 === 0) {
                doc.setFillColor(255, 255, 255);
                doc.rect(margin, rowY - 8, w, 22, 'F');
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...bodyText);
            doc.text(key, margin + 10, rowY + 4);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(key === 'Total CTC (Per Annum)' ? 0 : 71, key === 'Total CTC (Per Annum)' ? 130 : 85, key === 'Total CTC (Per Annum)' ? 200 : 99);
            doc.text(val, margin + 220, rowY + 4);
        });

        y += rows.length * 22 + 24;
        line('This offer is contingent upon successful completion of background verification and submission of all required documents during the onboarding process.', false);
        y += 8;
        line('We are excited about your potential contribution to ScalerHouse and look forward to welcoming you aboard. Please confirm your acceptance of this offer by signing and returning a copy within 7 working days.', false);
        y += 20;
        line('Warm regards,', false);
        y += 12;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('ScalerHouse', margin, y);
        y += 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...light);
        doc.text('Human Resources Department', margin, y);
        doc.text('hr@scalerhouse.com', margin, y + 14);

        // Footer
        doc.setFillColor(...darkBg);
        doc.rect(0, 800, pageW, 42, 'F');
        doc.setTextColor(...light);
        doc.setFontSize(8);
        doc.text('© 2026 ScalerHouse · Kanpur, Uttar Pradesh, India · scalerhouse.com', pageW / 2, 825, { align: 'center' });

        doc.save(`OfferLetter_${(data.candidateName || 'Candidate').replace(/\s+/g, '_')}.pdf`);
        toast.success('Offer letter downloaded!');
    };

    const sendByEmail = async () => {
        if (!data.candidateEmail) { toast.error('Enter candidate email first'); return; }
        if (!data.candidateName || !data.jobTitle) { toast.error('Fill in candidate name and job title'); return; }
        setSending(true);
        try {
            const r = await fetch('/api/applications/send-offer-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const res = await r.json();
            if (!r.ok) throw new Error(res.error);
            toast.success(`✅ Offer letter sent to ${data.candidateEmail}`);
        } catch (e: any) {
            toast.error(e.message || 'Failed to send offer letter');
        } finally {
            setSending(false);
        }
    };

    const Field = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => (
        <div>
            <label className="form-label flex items-center gap-1.5">{icon}{label}</label>
            {children}
        </div>
    );

    return (
        <DashboardLayout navItems={adminNav} title="Offer Letter Builder" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Offer Letter Builder – Admin | ScalerHouse</title></Head>

            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
                <ArrowLeft size={15} /> Back to Applications
            </button>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="glass-card p-6">
                    <h3 className="font-syne font-bold text-white text-lg mb-5">Offer Details</h3>
                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Candidate Name" icon={<User size={12} />}>
                                <input className="form-input !text-sm" value={data.candidateName} onChange={e => set('candidateName', e.target.value)} placeholder="Full Name" />
                            </Field>
                            <Field label="Candidate Email" icon={<Send size={12} />}>
                                <input type="email" className="form-input !text-sm" value={data.candidateEmail} onChange={e => set('candidateEmail', e.target.value)} placeholder="candidate@email.com" />
                            </Field>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Job Title" icon={<Briefcase size={12} />}>
                                <input className="form-input !text-sm" value={data.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="e.g. SEO Specialist" />
                            </Field>
                            <Field label="Department" icon={<Building2 size={12} />}>
                                <input className="form-input !text-sm" value={data.department} onChange={e => set('department', e.target.value)} placeholder="Digital Marketing" />
                            </Field>
                        </div>
                        <Field label="Date of Joining" icon={<Calendar size={12} />}>
                            <input type="date" className="form-input !text-sm" value={data.joiningDate} onChange={e => set('joiningDate', e.target.value)} />
                        </Field>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Fixed CTC (LPA)" icon={<DollarSign size={12} />}>
                                <input className="form-input !text-sm" value={data.fixedCTC} onChange={e => set('fixedCTC', e.target.value)} placeholder="e.g. 4.5" />
                            </Field>
                            <Field label="Variable CTC (LPA)" icon={<DollarSign size={12} />}>
                                <input className="form-input !text-sm" value={data.variableCTC} onChange={e => set('variableCTC', e.target.value)} placeholder="e.g. 0.5" />
                            </Field>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Probation Period" icon={<Clock size={12} />}>
                                <input className="form-input !text-sm" value={data.probation} onChange={e => set('probation', e.target.value)} />
                            </Field>
                            <Field label="Reporting Manager" icon={<User size={12} />}>
                                <input className="form-input !text-sm" value={data.reportingManager} onChange={e => set('reportingManager', e.target.value)} placeholder="Manager Name" />
                            </Field>
                        </div>
                        <Field label="Work Location" icon={<Building2 size={12} />}>
                            <input className="form-input !text-sm" value={data.location} onChange={e => set('location', e.target.value)} />
                        </Field>

                        <div className="flex gap-3 pt-2">
                            <button onClick={downloadPDF} className="btn-glow flex-1 justify-center !py-3">
                                <Download size={15} /> Download PDF
                            </button>
                            <button onClick={sendByEmail} disabled={sending} className="btn-outline flex-1 !py-3 justify-center disabled:opacity-60">
                                <Send size={15} /> {sending ? 'Sending...' : 'Email to Candidate'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div>
                    <h3 className="font-syne font-bold text-white text-lg mb-4">Live Preview</h3>
                    <div ref={previewRef} className="bg-white rounded-xl overflow-hidden text-[#1e293b] shadow-2xl">
                        {/* Letter Header */}
                        <div className="bg-[#050d1a] px-8 py-6">
                            <div className="text-xl font-black text-white">SCALER<span className="text-[#00d4ff]">HOUSE</span></div>
                            <div className="text-[10px] text-slate-400 tracking-widest mt-0.5">GLOBAL DIGITAL GROWTH PARTNER</div>
                        </div>
                        {/* Letter body */}
                        <div className="px-8 py-6 text-sm leading-relaxed">
                            <div className="flex justify-between items-start mb-6">
                                <div className="font-bold text-lg text-slate-800">OFFER LETTER</div>
                                <div className="text-slate-500 text-xs">Date: {today}</div>
                            </div>
                            <p className="mb-4 text-slate-700">Dear <strong>{data.candidateName || '[Candidate Name]'}</strong>,</p>
                            <p className="mb-5 text-slate-600 text-xs">We are delighted to extend this offer of employment to you at ScalerHouse as a <strong>{data.jobTitle || '[Position]'}</strong> within the <strong>{data.department || '[Department]'}</strong> department.</p>

                            <div className="rounded-lg overflow-hidden border border-slate-200 mb-5">
                                {[
                                    ['Position', data.jobTitle || '—'],
                                    ['Department', data.department || '—'],
                                    ['Date of Joining', data.joiningDate || '—'],
                                    ['Fixed CTC', data.fixedCTC ? `₹${data.fixedCTC} LPA` : '—'],
                                    ['Variable CTC', data.variableCTC ? `₹${data.variableCTC} LPA` : '—'],
                                    ['Total CTC', `₹${totalCTC()} LPA`],
                                    ['Probation', data.probation],
                                    ['Reporting Manager', data.reportingManager || '—'],
                                ].map(([k, v], i) => (
                                    <div key={k} className={`flex text-xs ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                        <div className="w-1/2 px-4 py-2 text-slate-500 font-medium border-r border-slate-100">{k}</div>
                                        <div className={`w-1/2 px-4 py-2 font-semibold ${k === 'Total CTC' ? 'text-blue-700' : 'text-slate-800'}`}>{v}</div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-slate-600 text-xs mb-4">Please confirm your acceptance within 7 working days.</p>
                            <p className="text-slate-700 font-semibold text-sm">ScalerHouse – HR Department</p>
                            <p className="text-slate-400 text-xs">hr@scalerhouse.com</p>
                        </div>
                        <div className="bg-[#050d1a] px-8 py-3 text-center text-[#475569] text-[10px]">
                            © 2026 ScalerHouse · scalerhouse.com
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(OfferLetterPage, ['admin']);
