// pages/admin/offer-letter/[applicationId].tsx
// Corporate Offer Letter Builder – Full Version

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Download, Send, ArrowLeft, Building2, Calendar, DollarSign,
    User, Briefcase, Clock, FileText, ChevronDown, ChevronUp, Shield, Heart
} from 'lucide-react';
import { withAuth } from '../../../lib/auth';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import { adminNav } from '../../../lib/adminNav';

interface OfferData {
    candidateName: string;
    candidateEmail: string;
    candidateAddress: string;
    jobTitle: string;
    employeeId: string;
    department: string;
    grade: string;
    jobType: string;
    joiningDate: string;
    offerValidTill: string;
    probation: string;
    noticePeriod: string;
    fixedCTC: string;
    variableCTC: string;
    basicSalary: string;
    hra: string;
    specialAllowance: string;
    pf: string;
    medicalAllowance: string;
    reportingManager: string;
    hrContact: string;
    workingHours: string;
    location: string;
    workMode: string;
    benefits: string;
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
    const [downloading, setDownloading] = useState(false);
    const [data, setData] = useState<OfferData>(defaultData);
    const [openSection, setOpenSection] = useState<string>('candidate');
    const previewRef = useRef<HTMLDivElement>(null);

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


    // Capture the FULL preview (clone without height restrictions so html2canvas gets everything)
    const captureFullCanvas = async () => {
        const html2canvas = (await import('html2canvas')).default;
        if (!previewRef.current) throw new Error('Preview not found');

        // Clone without overflow/height restrictions
        const original = previewRef.current;
        const clone = original.cloneNode(true) as HTMLElement;
        clone.style.cssText = `
            position: fixed; top: -99999px; left: 0;
            width: ${original.scrollWidth}px;
            max-height: none; height: auto;
            overflow: visible; z-index: -1;
        `;
        document.body.appendChild(clone);

        try {
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: original.scrollWidth,
                windowWidth: original.scrollWidth,
            });
            return canvas;
        } finally {
            document.body.removeChild(clone);
        }
    };

    // Download PDF using print window — proper margins, full quality, full page
    const downloadPDF = () => {
        if (!previewRef.current) { toast.error('Preview not ready'); return; }
        const filename = `OfferLetter_${(data.candidateName || 'Candidate').replace(/\s+/g, '_')}`;
        const content = previewRef.current.innerHTML;

        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) { toast.error('Pop-up blocked. Allow pop-ups to download PDF.'); return; }

        win.document.write(`
            <!DOCTYPE html>
            <html><head>
                <title>${filename}</title>
                <style>
                    *, *::before, *::after { box-sizing: border-box; }
                    html, body { margin: 0; padding: 0; background: #fff; font-family: 'Segoe UI', Arial, sans-serif; }
                    /* Outer wrapper adds the page breathing room */
                    .print-wrap { padding: 12mm 18mm 16mm 18mm; }
                    /* A4 page with proper margins */
                    @media print {
                        html, body { margin: 0; padding: 0; }
                        .print-wrap { padding: 0; }
                        @page {
                            size: A4 portrait;
                            margin: 15mm 18mm 18mm 18mm;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            color-adjust: exact;
                        }
                        /* Prevent tables and sections from being cut mid-content */
                        table { page-break-inside: avoid; }
                        div { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body><div class="print-wrap">${content}</div></body></html>
        `);
        win.document.close();

        setTimeout(() => { win.focus(); win.print(); }, 800);

        toast.success(`📄 Save as PDF → name it "${filename}.pdf"`);
    };


    const sendByEmail = async () => {
        if (!data.candidateEmail) { toast.error('Enter candidate email first'); return; }
        if (!data.candidateName || !data.jobTitle) { toast.error('Fill in candidate name and job title'); return; }
        setSending(true);
        try {
            // Generate PDF as base64 to attach in email (captures full page, no clipping)
            const canvas = await captureFullCanvas();
            const { default: jsPDF } = await import('jspdf');
            // Use high quality JPEG
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            // Calculate PDF dimensions in mm at A4 width
            const pdfW = 210;  // A4 width mm
            const pdfH = Math.round(pdfW * canvas.height / canvas.width);

            // Use CUSTOM page height = exact content height → zero content cutoff
            // This is the correct approach for HTML-captured PDFs
            const doc = new jsPDF({
                unit: 'mm',
                format: [pdfW, pdfH],   // custom page exactly fits content
                orientation: pdfH > pdfW ? 'portrait' : 'landscape',
            });
            doc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);

            const pdfBase64 = doc.output('datauristring').split(',')[1];

            const r = await fetch('/api/applications/send-offer-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, pdfBase64 }),
            });
            const res = await r.json();
            if (!r.ok) throw new Error(res.error);
            toast.success(`✅ Offer letter + PDF sent to ${data.candidateEmail}`);
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
            {openSection === id && <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">{children}</div>}
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

    const compRows = [
        ...(data.basicSalary ? [['Basic Salary', `₹${data.basicSalary}`, 'Monthly']] : []),
        ...(data.hra ? [['HRA', `₹${data.hra}`, 'Monthly']] : []),
        ...(data.specialAllowance ? [['Special Allowance', `₹${data.specialAllowance}`, 'Monthly']] : []),
        ...(data.medicalAllowance ? [['Medical Allowance', `₹${data.medicalAllowance}`, 'Monthly']] : []),
        ...(data.pf ? [["Employer's PF", `₹${data.pf}`, 'Monthly']] : []),
        ['Fixed CTC', `₹${data.fixedCTC || '—'} LPA`, 'Annual'],
        ...(data.variableCTC ? [['Variable / Performance Pay', `₹${data.variableCTC} LPA`, 'Annual']] : []),
        ['Total CTC', `₹${totalCTC} LPA`, 'Annual'],
    ];

    return (
        <DashboardLayout navItems={adminNav} title="Offer Letter Builder" roleBadge="Super Admin" roleBadgeClass="badge-red">
            <Head><title>Offer Letter Builder – Admin | ScalerHouse</title></Head>

            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors">
                <ArrowLeft size={15} /> Back to Applications
            </button>

            <div className="grid xl:grid-cols-[480px_1fr] gap-6 items-start">

                {/* ── LEFT: Form ── */}
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
                            <F label="Grade / Level" field="grade" placeholder="L2, L3…" />
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
                            <F label="Probation Period" field="probation" placeholder="3 months" />
                            <F label="Notice Period" field="noticePeriod" placeholder="30 days" />
                            <F label="Working Hours" field="workingHours" placeholder="9:30 AM – 6:30 PM" span />
                            <TA label="Work Location / Address" field="location" rows={2} placeholder="Office address" />
                        </div>
                    </Section>

                    <Section id="ctc" title="Compensation (CTC)" icon={<DollarSign size={14} />}>
                        <p className="text-slate-500 text-xs">Enter LPA for CTC fields, and monthly amounts (₹) for salary breakup.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <F label="Fixed CTC (LPA)" field="fixedCTC" placeholder="e.g. 5.5" />
                            <F label="Variable Pay (LPA)" field="variableCTC" placeholder="e.g. 0.5" />
                        </div>
                        <div className="text-xs text-slate-400 font-medium bg-slate-800/50 rounded-lg px-3 py-2">
                            Total CTC: <span className="text-cyan-400 font-bold">₹{totalCTC} LPA</span> &nbsp;|&nbsp; Monthly Gross ≈ <span className="text-cyan-400">₹{monthlyGross}L</span>
                        </div>
                        <div className="border-t border-white/5 pt-3">
                            <p className="text-slate-400 text-xs mb-3 font-medium">Monthly Salary Breakup (optional)</p>
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
                        <TA label="Benefits" field="benefits" rows={4} placeholder="Health Insurance, 18 Paid Leaves, Bonus..." />
                    </Section>

                    <Section id="conduct" title="Custom Terms / Special Clauses" icon={<Shield size={14} />}>
                        <TA label="Additional Terms (optional)" field="customClause" rows={5} placeholder="Sign-on bonus, relocation allowance, equipment, etc." />
                    </Section>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button onClick={downloadPDF} disabled={downloading} className="btn-glow flex-1 justify-center !py-3.5 disabled:opacity-60">
                            <Download size={15} /> {downloading ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button onClick={sendByEmail} disabled={sending} className="btn-outline flex-1 !py-3.5 justify-center disabled:opacity-60">
                            <Send size={15} /> {sending ? 'Sending...' : 'Email + PDF'}
                        </button>
                    </div>
                    <p className="text-slate-500 text-xs text-center">Email sends both a branded HTML version + PDF attached.</p>
                </div>

                {/* ── RIGHT: Live Preview ── */}
                <div className="sticky top-4">
                    <h3 className="font-syne font-bold text-white text-sm mb-3 flex items-center gap-2"><FileText size={14} /> Live Preview <span className="text-slate-500 font-normal text-xs">(PDF will look exactly like this)</span></h3>
                    <div ref={previewRef} className="bg-white rounded-xl overflow-hidden text-[#1e293b] shadow-2xl max-h-[85vh] overflow-y-auto">

                        {/* Header */}
                        <div style={{ background: '#050d1a' }} className="px-8 py-6">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
                                        SCALER<span style={{ color: '#00d4ff' }}>HOUSE</span>
                                    </div>
                                    <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: 4, marginTop: 2 }}>GLOBAL DIGITAL GROWTH PARTNER</div>
                                </div>
                                <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: 9 }}>
                                    <div>scalerhouse.com</div>
                                    <div>hr@scalerhouse.com</div>
                                    <div>+91 92193 31120</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 3, marginTop: 16 }}>LETTER OF OFFER</div>
                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 9, marginTop: 2 }}>Date: {today}</div>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6 space-y-5 text-xs">
                            {data.candidateAddress && (
                                <p style={{ color: '#64748b', whiteSpace: 'pre-line', fontSize: 10 }}>{data.candidateAddress}</p>
                            )}

                            <div>
                                <p style={{ fontWeight: 600, color: '#1e293b', fontSize: 12 }}>
                                    Dear <span style={{ color: '#1e40af' }}>{data.candidateName || '[Candidate Name]'}</span>,
                                </p>
                                <p style={{ color: '#64748b', marginTop: 6, lineHeight: 1.7, fontSize: 11 }}>
                                    We are pleased to extend this offer of employment to you at <strong style={{ color: '#1e293b' }}>ScalerHouse</strong> as{' '}
                                    <strong style={{ color: '#1e40af' }}>{data.jobTitle || '[Position]'}</strong>
                                    {data.department ? ` in the ${data.department} department` : ''}.
                                    We believe your expertise will be a valuable addition to our growing team.
                                </p>
                            </div>

                            {/* 1. Employment Details */}
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                    1. Employment Details
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                                    <tbody>
                                        {[
                                            ['Employee ID', data.employeeId || '(To be assigned on joining)'],
                                            ['Designation / Job Title', data.jobTitle || '—'],
                                            ['Job Type', data.jobType],
                                            ['Grade / Level', data.grade],
                                            ['Department', data.department || '—'],
                                            ['Reporting To', data.reportingManager || '—'],
                                            ['Date of Joining', data.joiningDate || '—'],
                                            ['Work Mode', data.workMode],
                                            ['Work Location', data.location],
                                            ['Working Hours', data.workingHours],
                                            ['Probation Period', data.probation],
                                            ['Notice Period', data.noticePeriod],
                                        ].map(([k, v], i) => (
                                            <tr key={k} style={{ background: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                                                <td style={{ padding: '5px 10px', color: '#64748b', fontWeight: 600, width: '42%', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #f1f5f9' }}>{k}</td>
                                                <td style={{ padding: '5px 10px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}>{v}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 2. Compensation */}
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                    2. Compensation Package
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                                    <thead>
                                        <tr style={{ background: '#f0f9ff' }}>
                                            <th style={{ padding: '5px 10px', color: '#0369a1', textAlign: 'left', fontWeight: 700, width: '42%', borderBottom: '1px solid #bae6fd', borderRight: '1px solid #bae6fd' }}>Component</th>
                                            <th style={{ padding: '5px 10px', color: '#0369a1', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #bae6fd', borderRight: '1px solid #bae6fd' }}>Amount</th>
                                            <th style={{ padding: '5px 10px', color: '#0369a1', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #bae6fd' }}>Frequency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compRows.map(([k, v, freq], i) => (
                                            <tr key={k} style={{ background: k === 'Total CTC' ? '#eff6ff' : i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                                                <td style={{ padding: '5px 10px', color: '#64748b', fontWeight: k === 'Total CTC' ? 700 : 500, borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #f1f5f9' }}>{k}</td>
                                                <td style={{ padding: '5px 10px', color: k === 'Total CTC' ? '#1d4ed8' : '#1e293b', fontWeight: k === 'Total CTC' ? 800 : 500, borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #f1f5f9' }}>{v}</td>
                                                <td style={{ padding: '5px 10px', color: '#94a3b8', fontSize: 9, borderBottom: '1px solid #f1f5f9' }}>{freq}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. Benefits */}
                            {data.benefits && (
                                <div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                        3. Benefits & Perks
                                    </div>
                                    <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 10 }}>{data.benefits}</p>
                                </div>
                            )}

                            {/* 4. Code of Conduct */}
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                    4. Code of Conduct & Policies
                                </div>
                                <ul style={{ color: '#64748b', fontSize: 10, lineHeight: 1.8, paddingLeft: 16 }}>
                                    <li>Maintain the highest standards of professionalism and integrity at all times.</li>
                                    <li>Confidentiality of company data, client information, and proprietary technology must be maintained strictly.</li>
                                    <li>All intellectual property created during the employment period belongs exclusively to ScalerHouse.</li>
                                    <li>Non-solicitation of clients or employees for 12 months post-employment.</li>
                                    <li>Compliance with IT Policy, Data Protection Policy, and Anti-Harassment Policy is mandatory.</li>
                                </ul>
                            </div>

                            {/* 5. NDA */}
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                    5. Non-Disclosure Agreement
                                </div>
                                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 10 }}>
                                    By accepting this offer, you agree not to disclose to any third party, directly or indirectly, any confidential or proprietary
                                    information acquired during the course of your employment. This obligation survives the termination of your employment for a
                                    period of <strong style={{ color: '#1e293b' }}>two (2) years</strong>.
                                </p>
                            </div>

                            {/* 6. Custom Clause */}
                            {data.customClause && (
                                <div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                        6. Additional Terms
                                    </div>
                                    <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 10, whiteSpace: 'pre-line' }}>{data.customClause}</p>
                                </div>
                            )}

                            {/* 7. Acceptance */}
                            <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#0891b2', textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #e0f2fe', paddingBottom: 4, marginBottom: 6 }}>
                                    {data.customClause ? '7' : '6'}. Acceptance
                                </div>
                                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: 10 }}>
                                    This offer expires on <strong style={{ color: '#1e293b' }}>{data.offerValidTill || '[date]'}</strong>. Please sign and return
                                    a copy of this letter within the stipulated time to confirm your acceptance. Failure to respond will result in this offer
                                    being automatically rescinded.
                                </p>
                            </div>

                            {/* Signature block */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                                <div>
                                    <div style={{ borderBottom: '1px solid #94a3b8', height: 32, marginBottom: 6 }} />
                                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: 10 }}>Shashank Singh</p>
                                    <p style={{ color: '#94a3b8', fontSize: 9 }}>Founder & CEO, ScalerHouse</p>
                                    <p style={{ color: '#94a3b8', fontSize: 9 }}>Date: {today}</p>
                                </div>
                                <div>
                                    <div style={{ borderBottom: '1px solid #94a3b8', height: 32, marginBottom: 6 }} />
                                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: 10 }}>{data.candidateName || 'Candidate Name'}</p>
                                    <p style={{ color: '#94a3b8', fontSize: 9 }}>Candidate Signature & Acceptance</p>
                                    <p style={{ color: '#94a3b8', fontSize: 9 }}>Date: _______________</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ background: '#050d1a', padding: '12px 32px', textAlign: 'center', color: '#475569', fontSize: 9 }}>
                            © 2026 ScalerHouse · B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, UP 208022 · scalerhouse.com
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withAuth(OfferLetterPage, ['admin']);
