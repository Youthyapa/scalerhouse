// pages/admin/offer-letter/[applicationId].tsx
// Corporate Offer Letter Builder – Full Version

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import {
    Download, Send, ArrowLeft, Building2, Calendar, DollarSign,
    User, Briefcase, Clock, FileText, ChevronDown, ChevronUp, Shield, Heart
} from 'lucide-react';
import { withAuth } from '../../../lib/auth';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { adminNav } from '../../../lib/adminNav';

interface OfferData {
    // Candidate
    candidateName: string;
    candidateEmail: string;
    candidateAddress: string;
    // Role
    jobTitle: string;
    employeeId: string;
    department: string;
    grade: string;
    jobType: string;
    // Dates
    joiningDate: string;
    offerValidTill: string;
    probation: string;
    noticePeriod: string;
    // Compensation
    fixedCTC: string;
    variableCTC: string;
    basicSalary: string;
    hra: string;
    specialAllowance: string;
    pf: string;
    medicalAllowance: string;
    // People
    reportingManager: string;
    hrContact: string;
    // Work
    workingHours: string;
    location: string;
    workMode: string;
    // Benefits
    benefits: string;
    // Custom clauses
    customClause: string;
}

const defaultData: OfferData = {
    candidateName: '',
    candidateEmail: '',
    candidateAddress: '',
    jobTitle: '',
    employeeId: '',
    department: '',
    grade: 'L2',
    jobType: 'Full-Time',
    joiningDate: '',
    offerValidTill: '',
    probation: '3 months',
    noticePeriod: '30 days',
    fixedCTC: '',
    variableCTC: '',
    basicSalary: '',
    hra: '',
    specialAllowance: '',
    pf: '',
    medicalAllowance: '',
    reportingManager: 'Shashank Singh (Founder & CEO)',
    hrContact: 'hr@scalerhouse.com',
    workingHours: '9:30 AM – 6:30 PM, Monday to Friday',
    location: 'B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, UP 208022',
    workMode: 'Hybrid',
    benefits: 'Health Insurance, Paid Leaves (18 days/year), Festival Bonus, Performance Bonus, Learning & Development Budget',
    customClause: '',
};

function OfferLetterPage() {
    const router = useRouter();
    const [sending, setSending] = useState(false);
    const [data, setData] = useState<OfferData>(defaultData);
    const [openSection, setOpenSection] = useState<string>('candidate');

    // Pre-fill from URL query params
    useEffect(() => {
        if (!router.isReady) return;
        const { name, email, job } = router.query;
        setData(prev => ({
            ...prev,
            ...(name ? { candidateName: String(name) } : {}),
            ...(email ? { candidateEmail: String(email) } : {}),
            ...(job ? { jobTitle: String(job) } : {}),
        }));
    }, [router.isReady]); // eslint-disable-line

    const set = useCallback((k: keyof OfferData, v: string) => {
        setData(prev => ({ ...prev, [k]: v }));
    }, []);

    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const totalCTC = ((parseFloat(data.fixedCTC) || 0) + (parseFloat(data.variableCTC) || 0)).toFixed(2);
    const monthlyGross = (parseFloat(totalCTC) / 12).toFixed(2);

    const downloadPDF = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 50;
        const pageW = 595;
        const w = pageW - margin * 2;
        const darkBg: [number, number, number] = [5, 13, 26];
        const accent: [number, number, number] = [0, 212, 255];
        const white: [number, number, number] = [255, 255, 255];
        const light: [number, number, number] = [148, 163, 184];
        const body: [number, number, number] = [30, 41, 59];
        const sub: [number, number, number] = [100, 116, 139];

        // ── Header ──────────────────────────────────────────────────────────
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageW, 120, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(...white);
        doc.text('SCALER', margin, 52);
        doc.setTextColor(...accent);
        doc.text('HOUSE', margin + 82, 52);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...light);
        doc.text('GLOBAL DIGITAL GROWTH PARTNER', margin, 64);
        doc.text('scalerhouse.com | hr@scalerhouse.com | +91 92193 31120', pageW - margin, 64, { align: 'right' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...white);
        doc.text('LETTER OF OFFER', pageW / 2, 98, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...light);
        doc.text(`Date: ${today}`, pageW - margin, 112, { align: 'right' });

        let y = 140;
        const line = (text: string, bold = false, size = 9.5, color: [number, number, number] = body) => {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            doc.setFontSize(size);
            doc.setTextColor(...color);
            const lines = doc.splitTextToSize(text, w);
            doc.text(lines, margin, y);
            y += lines.length * (size * 1.5);
        };

        const sectionTitle = (title: string) => {
            y += 8;
            doc.setFillColor(0, 212, 255);
            doc.rect(margin, y, w, 1, 'F');
            y += 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 150, 200);
            doc.text(title.toUpperCase(), margin, y);
            y += 14;
            doc.setTextColor(...body);
        };

        const tableRow = (key: string, val: string, highlight = false) => {
            if (highlight) doc.setFillColor(240, 249, 255);
            else doc.setFillColor(248, 250, 252);
            doc.rect(margin, y - 9, w, 18, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(sub[0], sub[1], sub[2]);
            doc.text(key, margin + 6, y);
            doc.setFont('helvetica', highlight ? 'bold' : 'normal');
            if (highlight) doc.setTextColor(0, 130, 200);
            else doc.setTextColor(body[0], body[1], body[2]);
            doc.text(val, margin + 230, y);
            y += 19;
        };

        // ── Salutation ──────────────────────────────────────────────────────
        if (data.candidateAddress) {
            line(data.candidateAddress, false, 8.5, sub);
            y += 4;
        }
        y += 4;
        line(`Dear ${data.candidateName || '[Candidate Name]'},`, true);
        y += 6;
        line(`We are pleased to extend this offer of employment to you at ScalerHouse as ${data.jobTitle || '[Position]'} in the ${data.department || '[Department]'} department. We believe your skills and experience will be a valuable addition to our growing team.`);
        y += 6;

        // ── Employment Details ───────────────────────────────────────────────
        sectionTitle('1. Employment Details');
        tableRow('Employee ID', data.employeeId || '(Will be assigned on joining)');
        tableRow('Designation / Job Title', data.jobTitle || '—');
        tableRow('Job Type', data.jobType);
        tableRow('Grade / Level', data.grade);
        tableRow('Department', data.department || '—');
        tableRow('Reporting To', data.reportingManager || '—');
        tableRow('Date of Joining', data.joiningDate || '—');
        tableRow('Work Mode', data.workMode);
        tableRow('Work Location', data.location);
        tableRow('Working Hours', data.workingHours);
        tableRow('Probation Period', data.probation);
        tableRow('Notice Period', data.noticePeriod);

        // ── Compensation ─────────────────────────────────────────────────────
        sectionTitle('2. Compensation & Benefits');
        if (data.basicSalary) tableRow('Basic Salary (Monthly)', `₹${data.basicSalary}`);
        if (data.hra) tableRow('HRA (Monthly)', `₹${data.hra}`);
        if (data.specialAllowance) tableRow('Special Allowance (Monthly)', `₹${data.specialAllowance}`);
        if (data.medicalAllowance) tableRow('Medical Allowance (Monthly)', `₹${data.medicalAllowance}`);
        if (data.pf) tableRow("Employer's PF Contribution (Monthly)", `₹${data.pf}`);
        tableRow('Fixed CTC (Per Annum)', `₹${data.fixedCTC || '—'} LPA`);
        if (data.variableCTC) tableRow('Variable / Performance Pay (Per Annum)', `₹${data.variableCTC} LPA`);
        tableRow('Total CTC (Per Annum)', `₹${totalCTC} LPA`, true);
        tableRow('Monthly Gross (Approx.)', `₹${monthlyGross} LPA`);

        // ── Benefits ─────────────────────────────────────────────────────────
        if (data.benefits) {
            y += 4;
            line('Employee Benefits:', true, 9);
            y += 2;
            line(data.benefits, false, 8.5, sub);
            y += 4;
        }

        // Check if we need a new page
        if (y > 680) {
            doc.addPage();
            y = 60;
        }

        // ── Code of Conduct ───────────────────────────────────────────────────
        sectionTitle('3. Code of Conduct & Policies');
        const coc = [
            'You are expected to maintain the highest standards of professionalism, integrity, and ethical conduct.',
            'Confidentiality of company data, client information, and proprietary technology must be strictly maintained at all times, even after the employment period.',
            'Any invention, intellectual property, or work product created during employment shall be the exclusive property of ScalerHouse.',
            'Employees must comply with all company policies including the IT Policy, Data Protection Policy, and Anti-Harassment Policy.',
            'Soliciting clients, employees, or business partners of ScalerHouse for personal gain or for a competing entity during and for a period of 12 months after employment is strictly prohibited.',
        ];
        coc.forEach(c => {
            line(`• ${c}`, false, 8, sub);
            y += 2;
        });

        // ── NDA & Confidentiality ─────────────────────────────────────────────
        sectionTitle('4. Non-Disclosure Agreement');
        line('By accepting this offer, you agree not to disclose to any third party, directly or indirectly, any confidential or proprietary information acquired during the course of your employment. This obligation survives the termination of your employment for a period of two (2) years.', false, 8.5, sub);
        y += 4;

        if (y > 680) { doc.addPage(); y = 60; }

        // ── Custom Clause ─────────────────────────────────────────────────────
        if (data.customClause) {
            sectionTitle('5. Additional Terms');
            line(data.customClause, false, 8.5, sub);
            y += 4;
        }

        // ── Acceptance ───────────────────────────────────────────────────────
        sectionTitle(`${data.customClause ? '6' : '5'}. Acceptance`);
        line('This offer expires on ' + (data.offerValidTill || '[date]') + '. Please sign and return a copy of this letter to confirm your acceptance. Failure to respond by the above date will result in this offer being automatically rescinded.', false, 8.5, sub);
        y += 14;

        // Signature block
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...body);
        doc.text('For ScalerHouse:', margin, y);
        doc.text('Accepted by Candidate:', margin + 270, y);
        y += 40;
        doc.setDrawColor(200, 212, 224);
        doc.line(margin, y, margin + 160, y);
        doc.line(margin + 270, y, margin + 430, y);
        y += 12;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...sub);
        doc.text('Shashank Singh', margin, y);
        doc.text(`${data.candidateName || 'Candidate Name'}`, margin + 270, y);
        y += 12;
        doc.text('Founder & CEO', margin, y);
        doc.text('Date: _______________', margin + 270, y);

        // Footer
        doc.setFillColor(...darkBg);
        doc.rect(0, 820, pageW, 22, 'F');
        doc.setFontSize(7); doc.setTextColor(...light);
        doc.text('© 2026 ScalerHouse · B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, UP 208022 · scalerhouse.com', pageW / 2, 833, { align: 'center' });

        doc.save(`OfferLetter_${(data.candidateName || 'Candidate').replace(/\s+/g, '_')}.pdf`);
        toast.success('Offer letter PDF downloaded!');
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

    const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
        <div className="glass-card overflow-hidden">
            <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenSection(openSection === id ? '' : id)}
            >
                <div className="flex items-center gap-2 font-syne font-bold text-white text-sm">{icon}{title}</div>
                {openSection === id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {openSection === id && <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">{children}</div>}
        </div>
    );

    const F = ({ label, field, type = 'text', placeholder = '', span = false }: {
        label: string; field: keyof OfferData; type?: string; placeholder?: string; span?: boolean;
    }) => (
        <div className={span ? 'col-span-2' : ''}>
            <label className="form-label text-xs">{label}</label>
            <input
                type={type}
                className="form-input !text-sm"
                defaultValue={data[field]}
                onBlur={e => set(field, e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    const TA = ({ label, field, rows = 3, placeholder = '' }: { label: string; field: keyof OfferData; rows?: number; placeholder?: string }) => (
        <div className="col-span-2">
            <label className="form-label text-xs">{label}</label>
            <textarea
                className="form-input !text-sm resize-none"
                rows={rows}
                defaultValue={data[field]}
                onBlur={e => set(field, e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <DashboardLayout navItems={adminNav} title="Offer Letter Builder" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Offer Letter Builder – Admin | ScalerHouse</title></Head>

            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
                <ArrowLeft size={15} /> Back to Applications
            </button>

            <div className="grid xl:grid-cols-[480px_1fr] gap-6 items-start">

                {/* ── LEFT: Form ───────────────────────────────────────────── */}
                <div className="space-y-3">

                    <Section id="candidate" title="Candidate Details" icon={<User size={14} />}>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Full Name *" field="candidateName" placeholder="e.g. Rahul Sharma" />
                            <F label="Email Address *" field="candidateEmail" type="email" placeholder="candidate@email.com" />
                            <TA label="Candidate Address" field="candidateAddress" rows={2} placeholder="House No, Street, City, Pin" />
                        </div>
                    </Section>

                    <Section id="role" title="Role & Employment" icon={<Briefcase size={14} />}>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Job Title *" field="jobTitle" placeholder="e.g. SEO Specialist" />
                            <F label="Department *" field="department" placeholder="e.g. Digital Marketing" />
                            <F label="Employee ID" field="employeeId" placeholder="EMP-001 (or leave blank)" />
                            <F label="Grade / Level" field="grade" placeholder="e.g. L2, L3" />
                            <div>
                                <label className="form-label text-xs">Job Type</label>
                                <select className="form-input !text-sm" defaultValue={data.jobType} onBlur={e => set('jobType', e.target.value)}>
                                    {['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label text-xs">Work Mode</label>
                                <select className="form-input !text-sm" defaultValue={data.workMode} onBlur={e => set('workMode', e.target.value)}>
                                    {['Hybrid', 'Remote', 'On-Site'].map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <F label="Reporting Manager" field="reportingManager" placeholder="Manager Name" />
                            <F label="HR Contact Email" field="hrContact" placeholder="hr@scalerhouse.com" />
                        </div>
                    </Section>

                    <Section id="dates" title="Dates & Duration" icon={<Calendar size={14} />}>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Date of Joining" field="joiningDate" type="date" />
                            <F label="Offer Valid Till" field="offerValidTill" type="date" />
                            <F label="Probation Period" field="probation" placeholder="e.g. 3 months" />
                            <F label="Notice Period" field="noticePeriod" placeholder="e.g. 30 days" />
                            <F label="Working Hours" field="workingHours" placeholder="9:30 AM – 6:30 PM" span />
                            <TA label="Work Location / Address" field="location" rows={2} placeholder="Office street address" />
                        </div>
                    </Section>

                    <Section id="ctc" title="Compensation (CTC)" icon={<DollarSign size={14} />}>
                        <p className="text-slate-500 text-xs mb-1">Enter LPA values for CTC, and monthly amounts for salary breakup.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Fixed CTC (LPA)" field="fixedCTC" placeholder="e.g. 5.5" />
                            <F label="Variable / Performance Pay (LPA)" field="variableCTC" placeholder="e.g. 0.5" />
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-1">Total CTC: <span className="text-cyan-400 font-bold">₹{totalCTC} LPA</span> / Monthly Gross: <span className="text-cyan-400">₹{monthlyGross}L</span></div>
                        <div className="border-t border-white/5 pt-3 mt-1">
                            <p className="text-slate-400 text-xs mb-3">Monthly Salary Breakup (optional but recommended)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <F label="Basic Salary (₹/month)" field="basicSalary" placeholder="e.g. 25000" />
                                <F label="HRA (₹/month)" field="hra" placeholder="e.g. 10000" />
                                <F label="Special Allowance (₹/month)" field="specialAllowance" placeholder="e.g. 8000" />
                                <F label="Medical Allowance (₹/month)" field="medicalAllowance" placeholder="e.g. 1250" />
                                <F label="Employer PF (₹/month)" field="pf" placeholder="e.g. 1800" />
                            </div>
                        </div>
                    </Section>

                    <Section id="benefits" title="Benefits & Perks" icon={<Heart size={14} />}>
                        <div className="grid grid-cols-1 gap-3">
                            <TA label="Benefits (one per line or comma separated)" field="benefits" rows={4} placeholder="Health Insurance, 18 Paid Leaves, Bonus..." />
                        </div>
                    </Section>

                    <Section id="conduct" title="Custom Terms / Special Clauses" icon={<Shield size={14} />}>
                        <TA label="Additional Terms or Special Clauses (optional)" field="customClause" rows={5} placeholder="Any special terms specific to this hire, e.g. sign-on bonus, equipment provision, relocation allowance..." />
                    </Section>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button onClick={downloadPDF} className="btn-glow flex-1 justify-center !py-3.5">
                            <Download size={15} /> Download PDF
                        </button>
                        <button onClick={sendByEmail} disabled={sending} className="btn-outline flex-1 !py-3.5 justify-center disabled:opacity-60">
                            <Send size={15} /> {sending ? 'Sending...' : 'Email to Candidate'}
                        </button>
                    </div>
                    <p className="text-slate-500 text-xs text-center">PDF includes all sections. Email sends a branded HTML version.</p>
                </div>

                {/* ── RIGHT: Live Preview ──────────────────────────────────── */}
                <div className="sticky top-4">
                    <h3 className="font-syne font-bold text-white text-sm mb-3 flex items-center gap-2"><FileText size={14} /> Live Preview</h3>
                    <div className="bg-white rounded-xl overflow-hidden text-[#1e293b] shadow-2xl text-[11px] leading-relaxed max-h-[85vh] overflow-y-auto">

                        {/* Header */}
                        <div className="bg-[#050d1a] px-7 py-5">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-lg font-black text-white tracking-tight">SCALER<span className="text-[#00d4ff]">HOUSE</span></div>
                                    <div className="text-[8px] text-slate-400 tracking-widest mt-0.5">GLOBAL DIGITAL GROWTH PARTNER</div>
                                </div>
                                <div className="text-right text-slate-400 text-[8px]">
                                    <div>scalerhouse.com</div>
                                    <div>hr@scalerhouse.com</div>
                                    <div>+91 92193 31120</div>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-white font-bold text-sm tracking-widest">LETTER OF OFFER</div>
                            <div className="text-center text-slate-400 text-[8px] mt-0.5">Date: {today}</div>
                        </div>

                        {/* Body */}
                        <div className="px-7 py-5 space-y-4">
                            {data.candidateAddress && <p className="text-[#64748b] text-[9px] whitespace-pre-line">{data.candidateAddress}</p>}
                            <div>
                                <p className="font-semibold text-slate-800">Dear <span className="text-blue-700">{data.candidateName || '[Candidate Name]'}</span>,</p>
                                <p className="text-slate-500 mt-1">We are pleased to extend this offer of employment to you at <strong className="text-slate-700">ScalerHouse</strong> as <strong className="text-blue-700">{data.jobTitle || '[Position]'}</strong>{data.department ? ` in the ${data.department} department` : ''}.</p>
                            </div>

                            {/* Employment Details */}
                            <div>
                                <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">1. Employment Details</div>
                                <table className="w-full text-[9px]">
                                    {[
                                        ['Employee ID', data.employeeId || '(To be assigned)'],
                                        ['Designation', data.jobTitle || '—'],
                                        ['Job Type', data.jobType],
                                        ['Grade', data.grade],
                                        ['Department', data.department || '—'],
                                        ['Reporting To', data.reportingManager || '—'],
                                        ['Date of Joining', data.joiningDate || '—'],
                                        ['Work Mode', data.workMode],
                                        ['Work Location', data.location],
                                        ['Working Hours', data.workingHours],
                                        ['Probation Period', data.probation],
                                        ['Notice Period', data.noticePeriod],
                                    ].map(([k, v], i) => (
                                        <tr key={k} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                            <td className="px-2 py-1 text-slate-500 font-medium w-1/2 border-r border-slate-100">{k}</td>
                                            <td className="px-2 py-1 font-semibold text-slate-800">{v}</td>
                                        </tr>
                                    ))}
                                </table>
                            </div>

                            {/* Compensation */}
                            <div>
                                <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">2. Compensation</div>
                                <table className="w-full text-[9px]">
                                    {[
                                        ...(data.basicSalary ? [['Basic Salary (Monthly)', `₹${data.basicSalary}`]] : []),
                                        ...(data.hra ? [['HRA (Monthly)', `₹${data.hra}`]] : []),
                                        ...(data.specialAllowance ? [['Special Allowance (Monthly)', `₹${data.specialAllowance}`]] : []),
                                        ...(data.medicalAllowance ? [['Medical Allowance (Monthly)', `₹${data.medicalAllowance}`]] : []),
                                        ...(data.pf ? [["Employer PF (Monthly)", `₹${data.pf}`]] : []),
                                        ['Fixed CTC (Annual)', `₹${data.fixedCTC || '—'} LPA`],
                                        ...(data.variableCTC ? [['Variable Pay (Annual)', `₹${data.variableCTC} LPA`]] : []),
                                        ['Total CTC (Annual)', `₹${totalCTC} LPA`],
                                    ].map(([k, v], i) => (
                                        <tr key={k} className={k === 'Total CTC (Annual)' ? 'bg-blue-50' : i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                            <td className="px-2 py-1 text-slate-500 font-medium w-1/2 border-r border-slate-100">{k}</td>
                                            <td className={`px-2 py-1 font-${k === 'Total CTC (Annual)' ? 'bold text-blue-700' : 'semibold text-slate-800'}`}>{v}</td>
                                        </tr>
                                    ))}
                                </table>
                            </div>

                            {/* Benefits */}
                            {data.benefits && (
                                <div>
                                    <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">3. Benefits & Perks</div>
                                    <p className="text-slate-500 text-[9px]">{data.benefits}</p>
                                </div>
                            )}

                            {/* Code of Conduct */}
                            <div>
                                <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">4. Code of Conduct & Policies</div>
                                <ul className="text-[9px] text-slate-500 space-y-0.5 list-disc list-inside">
                                    <li>Maintain highest standards of professionalism and integrity at all times.</li>
                                    <li>Confidentiality of company data and client information must be strictly maintained.</li>
                                    <li>All intellectual property created during employment belongs to ScalerHouse.</li>
                                    <li>Non-solicitation of clients/employees for 12 months after employment.</li>
                                    <li>Compliance with IT, Data Protection, and Anti-Harassment policies is mandatory.</li>
                                </ul>
                            </div>

                            {/* NDA */}
                            <div>
                                <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">5. Non-Disclosure Agreement</div>
                                <p className="text-slate-500 text-[9px]">By accepting this offer, you agree not to disclose any confidential or proprietary information for a period of 2 years post-employment.</p>
                            </div>

                            {/* Custom Clause */}
                            {data.customClause && (
                                <div>
                                    <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">6. Additional Terms</div>
                                    <p className="text-slate-500 text-[9px] whitespace-pre-line">{data.customClause}</p>
                                </div>
                            )}

                            {/* Acceptance */}
                            <div>
                                <div className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest mb-1 border-b border-cyan-100 pb-1">{data.customClause ? '7' : '6'}. Acceptance</div>
                                <p className="text-slate-500 text-[9px]">This offer expires on <strong>{data.offerValidTill || '[date]'}</strong>. Please sign and return a copy to confirm acceptance.</p>
                            </div>

                            {/* Signature */}
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                                <div>
                                    <div className="border-b border-slate-400 mb-1 h-6" />
                                    <p className="text-slate-700 font-semibold text-[9px]">Shashank Singh</p>
                                    <p className="text-slate-400 text-[8px]">Founder & CEO, ScalerHouse</p>
                                </div>
                                <div>
                                    <div className="border-b border-slate-400 mb-1 h-6" />
                                    <p className="text-slate-700 font-semibold text-[9px]">{data.candidateName || 'Candidate Name'}</p>
                                    <p className="text-slate-400 text-[8px]">Date: _______________</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-[#050d1a] px-7 py-3 text-center text-[#475569] text-[8px]">
                            © 2026 ScalerHouse · B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, UP 208022 · scalerhouse.com
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(OfferLetterPage, ['admin']);
