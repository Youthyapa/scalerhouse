// pages/onboarding/[token].tsx
// Public page — selected candidates submit their onboarding documents without login
// Validates the token from DB, shows a multi-step form

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type TokenInfo = {
    name: string;
    jobTitle: string;
    email: string;
    valid: boolean;
    error?: string;
};

const STEPS = [
    { id: 1, label: 'Personal Info', icon: '👤' },
    { id: 2, label: 'Bank & Tax', icon: '🏦' },
    { id: 3, label: 'Emergency Contact', icon: '🆘' },
    { id: 4, label: 'Documents', icon: '📎' },
    { id: 5, label: 'Declaration', icon: '✅' },
];

type FormData = {
    // Step 1
    dob: string; gender: string; permanentAddress: string; currentAddress: string;
    // Step 2
    bankAccountNumber: string; ifscCode: string; bankName: string; panNumber: string;
    // Step 3
    emergencyContactName: string; emergencyContactRelation: string; emergencyContactPhone: string;
    // Step 5
    declarationAccepted: boolean;
};

const initialForm: FormData = {
    dob: '', gender: '', permanentAddress: '', currentAddress: '',
    bankAccountNumber: '', ifscCode: '', bankName: '', panNumber: '',
    emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhone: '',
    declarationAccepted: false,
};

type DocFiles = {
    aadhaar: File | null;
    panCard: File | null;
    degree: File | null;
    experienceLetter: File | null;
    passportPhoto: File | null;
};

const initialDocs: DocFiles = {
    aadhaar: null, panCard: null, degree: null, experienceLetter: null, passportPhoto: null,
};

export default function OnboardingPage() {
    const router = useRouter();
    const { token } = router.query as { token: string };

    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [checking, setChecking] = useState(true);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(initialForm);
    const [docs, setDocs] = useState<DocFiles>(initialDocs);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        if (!token) return;
        fetch(`/api/onboarding/validate-token?token=${token}`)
            .then(r => r.json())
            .then(data => {
                setTokenInfo(data);
                setChecking(false);
            })
            .catch(() => {
                setTokenInfo({ name: '', jobTitle: '', email: '', valid: false, error: 'Failed to validate link.' });
                setChecking(false);
            });
    }, [token]);

    const update = (key: keyof FormData, val: string | boolean) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const setDoc = (key: keyof DocFiles, file: File | null) =>
        setDocs(prev => ({ ...prev, [key]: file }));

    const handleSubmit = async () => {
        if (!form.declarationAccepted) {
            toast.error('Please accept the declaration to proceed.');
            return;
        }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('token', token);
            // Append all text fields
            (Object.keys(form) as (keyof FormData)[]).forEach(k => {
                fd.append(k, String(form[k]));
            });
            // Append files
            (Object.keys(docs) as (keyof DocFiles)[]).forEach(k => {
                if (docs[k]) fd.append(k, docs[k] as File);
            });

            const r = await fetch('/api/onboarding/submit', { method: 'POST', body: fd });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Submission failed');
            setSubmitted(true);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = 'w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 transition-colors placeholder-slate-500';
    const labelCls = 'block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2';

    if (checking) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
            <div className="text-slate-400 animate-pulse text-lg">Validating your link…</div>
        </div>
    );

    if (!tokenInfo?.valid) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
            <Head><title>Invalid Link – ScalerHouse</title></Head>
            <div className="max-w-md w-full bg-[#0a1628] border border-slate-700/50 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">❌</div>
                <h1 className="text-white text-2xl font-bold mb-3">Link Invalid or Expired</h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{tokenInfo?.error || 'This onboarding link is not valid. It may have already been used or expired.'}</p>
                <a href="mailto:hr@scalerhouse.com" className="inline-block bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-cyan-500/20 transition-colors">
                    Contact HR Team
                </a>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
            <Head><title>Documents Submitted – ScalerHouse</title></Head>
            <div className="max-w-lg w-full bg-[#0a1628] border border-green-500/20 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-white text-2xl font-bold mb-3">Documents Submitted!</h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    Thank you, <strong className="text-white">{tokenInfo.name.split(' ')[0]}</strong>! We've received your documents. A confirmation email has been sent to <strong className="text-cyan-400">{tokenInfo.email}</strong>.
                </p>
                <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-5 text-left mt-6">
                    <p className="text-green-400 font-semibold text-sm mb-2">What's next?</p>
                    <p className="text-slate-400 text-sm leading-relaxed">Our HR team will verify your documents (1–2 business days) and send your official offer letter and login credentials to your email.</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head><title>Onboarding – ScalerHouse</title></Head>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-[#050d1a] py-10 px-4">
                {/* Header */}
                <div className="max-w-2xl mx-auto mb-8 text-center">
                    <div className="text-2xl font-black text-white mb-1">SCALER<span className="text-cyan-400">HOUSE</span></div>
                    <h1 className="text-white text-xl font-bold mt-4 mb-1">Complete Your Onboarding</h1>
                    <p className="text-slate-400 text-sm">
                        Welcome, <span className="text-cyan-400 font-semibold">{tokenInfo.name}</span>!
                        Please provide the details below for your <span className="text-white font-semibold">{tokenInfo.jobTitle}</span> role.
                    </p>
                </div>

                {/* Stepper */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700 z-0" />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                        />
                        {STEPS.map(s => (
                            <div key={s.id} className="flex flex-col items-center relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                                    ${step > s.id ? 'bg-cyan-400 border-cyan-400 text-white' :
                                        step === s.id ? 'bg-[#0a1628] border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-400/20' :
                                            'bg-[#0a1628] border-slate-600 text-slate-500'}`}>
                                    {step > s.id ? '✓' : s.icon}
                                </div>
                                <span className={`text-xs mt-2 font-medium hidden sm:block ${step === s.id ? 'text-cyan-400' : step > s.id ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="max-w-2xl mx-auto bg-[#0a1628] border border-slate-700/50 rounded-2xl p-8">

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-white font-bold text-lg mb-6">👤 Personal Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Date of Birth *</label>
                                    <input type="date" className={inputCls} value={form.dob} onChange={e => update('dob', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Gender *</label>
                                    <select className={inputCls} value={form.gender} onChange={e => update('gender', e.target.value)}>
                                        <option value="">Select gender</option>
                                        <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Permanent Address *</label>
                                <textarea rows={3} className={inputCls + ' resize-none'} value={form.permanentAddress} onChange={e => update('permanentAddress', e.target.value)} placeholder="Full permanent address..." />
                            </div>
                            <div>
                                <label className={labelCls}>Current Address</label>
                                <textarea rows={3} className={inputCls + ' resize-none'} value={form.currentAddress} onChange={e => update('currentAddress', e.target.value)} placeholder="If same as permanent, leave blank" />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Bank & Tax */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-white font-bold text-lg mb-6">🏦 Bank & Tax Details</h2>
                            <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 text-yellow-400 text-xs leading-relaxed mb-2">
                                ⚠️ This information is used exclusively for payroll processing and is kept strictly confidential.
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Bank Name *</label>
                                    <input className={inputCls} value={form.bankName} onChange={e => update('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
                                </div>
                                <div>
                                    <label className={labelCls}>Account Number *</label>
                                    <input className={inputCls} value={form.bankAccountNumber} onChange={e => update('bankAccountNumber', e.target.value)} placeholder="Bank account number" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>IFSC Code *</label>
                                    <input className={inputCls} value={form.ifscCode} onChange={e => update('ifscCode', e.target.value.toUpperCase())} placeholder="e.g. HDFC0001234" />
                                </div>
                                <div>
                                    <label className={labelCls}>PAN Number *</label>
                                    <input className={inputCls} value={form.panNumber} onChange={e => update('panNumber', e.target.value.toUpperCase())} placeholder="e.g. ABCDE1234F" maxLength={10} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Emergency Contact */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-white font-bold text-lg mb-6">🆘 Emergency Contact</h2>
                            <p className="text-slate-400 text-sm mb-4">Please provide a person we can contact in case of an emergency. This information is confidential.</p>
                            <div>
                                <label className={labelCls}>Contact Name *</label>
                                <input className={inputCls} value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} placeholder="Full name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Relationship *</label>
                                    <select className={inputCls} value={form.emergencyContactRelation} onChange={e => update('emergencyContactRelation', e.target.value)}>
                                        <option value="">Select...</option>
                                        <option>Parent</option><option>Spouse</option><option>Sibling</option><option>Friend</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Phone Number *</label>
                                    <input className={inputCls} value={form.emergencyContactPhone} onChange={e => update('emergencyContactPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Documents */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-white font-bold text-lg mb-2">📎 Document Uploads</h2>
                            <p className="text-slate-400 text-sm mb-6">Upload clear scans or photos. Accepted formats: PDF, JPG, PNG (max 10MB each).</p>
                            {([
                                ['aadhaar', '🪪 Aadhaar Card', 'Both sides, PDF preferred', true],
                                ['panCard', '💳 PAN Card', 'Clear scan or photo', true],
                                ['degree', '🎓 Degree Certificate', 'Highest qualification', true],
                                ['experienceLetter', '📄 Experience Letter', '(Optional) From previous employer', false],
                                ['passportPhoto', '📸 Passport Photo', 'Recent, white background', true],
                            ] as [keyof DocFiles, string, string, boolean][]).map(([key, label, hint, required]) => (
                                <div key={key} className="border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="text-white text-sm font-semibold">{label}{required && <span className="text-red-400 ml-1">*</span>}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{hint}</div>
                                        </div>
                                        {docs[key] && (
                                            <span className="text-green-400 text-xs font-medium bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">✓ Ready</span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        ref={el => { fileRefs.current[key] = el; }}
                                        onChange={e => setDoc(key, e.target.files?.[0] || null)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRefs.current[key]?.click()}
                                        className="mt-2 text-cyan-400 text-sm border border-cyan-400/25 px-4 py-2 rounded-lg hover:bg-cyan-400/10 transition-colors"
                                    >
                                        {docs[key] ? `📄 ${docs[key]!.name}` : 'Choose File'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 5: Declaration */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-white font-bold text-lg mb-2">✅ Declaration & Submit</h2>
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-slate-400 text-sm leading-relaxed space-y-3">
                                <p className="font-semibold text-slate-300">Declaration by Candidate</p>
                                <p>I, <strong className="text-white">{tokenInfo.name}</strong>, hereby declare that:</p>
                                <ul className="list-disc list-inside space-y-1 text-slate-400">
                                    <li>All the information provided in this form is true and accurate to the best of my knowledge.</li>
                                    <li>All documents uploaded are genuine and I am the rightful owner of these documents.</li>
                                    <li>I understand that any false information may result in immediate termination of employment.</li>
                                    <li>I consent to ScalerHouse storing and processing my personal information for employment purposes as per applicable data privacy laws.</li>
                                </ul>
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div
                                    onClick={() => update('declarationAccepted', !form.declarationAccepted)}
                                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all
                                        ${form.declarationAccepted ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600 group-hover:border-slate-400'}`}
                                >
                                    {form.declarationAccepted && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                                <span className="text-slate-300 text-sm leading-relaxed">
                                    I confirm that all the information I have provided is accurate. I understand and agree to the declaration above.
                                </span>
                            </label>

                            {/* Summary */}
                            <div className="border border-slate-700 rounded-xl p-5">
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Submission Summary</p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-white">{tokenInfo.name}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Position</span><span className="text-cyan-400">{tokenInfo.jobTitle}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-slate-300">{tokenInfo.email}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Documents</span><span className="text-green-400">{Object.values(docs).filter(Boolean).length} / 5 uploaded</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8 pt-6 border-t border-slate-700/50">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 border border-slate-600 text-slate-300 rounded-xl py-3 text-sm font-semibold hover:border-slate-400 transition-colors"
                            >
                                ← Back
                            </button>
                        )}
                        {step < 5 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !form.declarationAccepted}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? '⏳ Submitting...' : '🚀 Submit My Documents'}
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-8">
                    Need help? Email <a href="mailto:hr@scalerhouse.com" className="text-slate-500 hover:text-cyan-400 transition-colors">hr@scalerhouse.com</a>
                </p>
            </div>
        </>
    );
}
