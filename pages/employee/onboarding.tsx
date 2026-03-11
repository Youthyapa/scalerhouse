// pages/employee/onboarding.tsx
// 5-Step Digital Onboarding Wizard for new ScalerHouse hires

import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, ChevronLeft, User, CreditCard, HeartHandshake, FileText, Shield, Upload, X } from 'lucide-react';
import { withAuth } from '../../lib/auth';
import toast from 'react-hot-toast';

const STEPS = [
    { id: 1, label: 'Personal Details', icon: <User size={18} />, description: 'Basic personal information' },
    { id: 2, label: 'Bank & Tax', icon: <CreditCard size={18} />, description: 'Financial & tax details' },
    { id: 3, label: 'Emergency Contact', icon: <HeartHandshake size={18} />, description: 'Emergency contact info' },
    { id: 4, label: 'Documents', icon: <FileText size={18} />, description: 'Upload required documents' },
    { id: 5, label: 'Declaration', icon: <Shield size={18} />, description: 'Review & submit' },
];

interface OnboardingData {
    // Step 1
    dob: string; gender: string; permanentAddress: string; currentAddress: string;
    // Step 2
    bankAccountNumber: string; ifscCode: string; bankName: string; panNumber: string;
    // Step 3
    emergencyContactName: string; emergencyContactRelation: string; emergencyContactPhone: string;
    // Step 5
    declarationAccepted: boolean;
}

interface DocFiles {
    aadhaar: File | null;
    panCard: File | null;
    degree: File | null;
    experienceLetter: File | null;
    passportPhoto: File | null;
}

const defaultData: OnboardingData = {
    dob: '', gender: '', permanentAddress: '', currentAddress: '',
    bankAccountNumber: '', ifscCode: '', bankName: '', panNumber: '',
    emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhone: '',
    declarationAccepted: false,
};

function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [docs, setDocs] = useState<DocFiles>({ aadhaar: null, panCard: null, degree: null, experienceLetter: null, passportPhoto: null });
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [sameAddress, setSameAddress] = useState(false);

    useEffect(() => {
        fetch('/api/onboarding').then(r => r.json()).then(d => {
            if (d.completedSteps) setCompletedSteps(d.completedSteps);
            if (d.isComplete) setDone(true);
        }).catch(() => { });
    }, []);

    const set = (k: keyof OnboardingData, v: any) => setData(prev => ({ ...prev, [k]: v }));
    const setDoc = (k: keyof DocFiles, file: File | null) => setDocs(prev => ({ ...prev, [k]: file }));

    const saveStep = async (stepNum: number) => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('step', String(stepNum));
            if (stepNum === 1) {
                fd.append('dob', data.dob); fd.append('gender', data.gender);
                fd.append('permanentAddress', data.permanentAddress); fd.append('currentAddress', data.currentAddress);
            } else if (stepNum === 2) {
                fd.append('bankAccountNumber', data.bankAccountNumber); fd.append('ifscCode', data.ifscCode);
                fd.append('bankName', data.bankName); fd.append('panNumber', data.panNumber);
            } else if (stepNum === 3) {
                fd.append('emergencyContactName', data.emergencyContactName);
                fd.append('emergencyContactRelation', data.emergencyContactRelation);
                fd.append('emergencyContactPhone', data.emergencyContactPhone);
            } else if (stepNum === 4) {
                Object.entries(docs).forEach(([key, file]) => { if (file) fd.append(key, file); });
            } else if (stepNum === 5) {
                fd.append('declarationAccepted', String(data.declarationAccepted));
            }

            const r = await fetch('/api/onboarding', { method: 'POST', body: fd });
            if (!r.ok) throw new Error('Save failed');
            const saved = await r.json();
            setCompletedSteps(saved.completedSteps || []);
            if (stepNum === 5) { setDone(true); return; }
            setStep(prev => Math.min(prev + 1, 5));
            toast.success('Progress saved!');
        } catch {
            toast.error('Failed to save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const FileUploadField = ({ label, field, accept = '.pdf,.jpg,.jpeg,.png', required = false }: { label: string; field: keyof DocFiles; accept?: string; required?: boolean }) => {
        const ref = useRef<HTMLInputElement>(null);
        const file = docs[field];
        return (
            <div>
                <label className="form-label">{label} {required && <span className="text-red-400">*</span>}</label>
                <div onClick={() => ref.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200
                        ${file ? 'border-green-400/40 bg-green-400/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}>
                    <input ref={ref} type="file" accept={accept} className="hidden"
                        onChange={e => { if (e.target.files?.[0]) setDoc(field, e.target.files[0]); }} />
                    {file ? (
                        <div className="flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-400 shrink-0" />
                            <span className="text-slate-300 text-sm truncate flex-1">{file.name}</span>
                            <button type="button" onClick={e => { e.stopPropagation(); setDoc(field, null); if (ref.current) ref.current.value = ''; }}
                                className="text-slate-500 hover:text-red-400"><X size={14} /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Upload size={16} />
                            <span>Click to upload <span className="text-slate-500 text-xs">(PDF, JPG, PNG)</span></span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (done) {
        return (
            <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 max-w-md text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-400/40 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-400" />
                    </div>
                    <h2 className="font-syne font-black text-2xl text-white mb-3">Onboarding Complete! 🎉</h2>
                    <p className="text-slate-400">Your onboarding documents have been submitted successfully. Your HR team will review and confirm within 1-2 business days.</p>
                    <a href="/employee" className="btn-glow mt-6 inline-flex">Go to Dashboard</a>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Employee Onboarding – ScalerHouse</title>
            </Head>
            <div className="min-h-screen bg-[#050d1a]">
                {/* Header */}
                <div className="bg-[#0a1628] border-b border-slate-800 px-6 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div>
                            <div className="font-syne font-black text-lg text-white">SCALER<span className="text-cyan-400">HOUSE</span></div>
                            <div className="text-slate-500 text-xs tracking-wider">Employee Onboarding Portal</div>
                        </div>
                        <div className="text-slate-400 text-sm">Step {step} of {STEPS.length}</div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-10 relative">
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-800 -z-0" />
                        <div className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 -z-0 transition-all duration-500"
                            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
                        {STEPS.map(s => {
                            const isCompleted = completedSteps.includes(s.id);
                            const isCurrent = s.id === step;
                            return (
                                <div key={s.id} className="flex flex-col items-center z-10 cursor-pointer" onClick={() => completedSteps.includes(s.id) && setStep(s.id)}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm
                                        ${isCompleted ? 'bg-green-500/20 border-green-400 text-green-400' : isCurrent ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        {isCompleted ? <CheckCircle size={20} /> : s.icon}
                                    </div>
                                    <span className={`mt-2 text-xs font-medium hidden sm:block text-center max-w-16 leading-tight ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-green-400' : 'text-slate-500'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            <div className="glass-card p-8">
                                <div className="mb-6">
                                    <h2 className="font-syne font-bold text-xl text-white">{STEPS[step - 1].label}</h2>
                                    <p className="text-slate-400 text-sm mt-1">{STEPS[step - 1].description}</p>
                                </div>

                                {/* STEP 1: Personal */}
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Date of Birth</label>
                                                <input type="date" className="form-input" value={data.dob} onChange={e => set('dob', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="form-label">Gender</label>
                                                <select className="form-input" value={data.gender} onChange={e => set('gender', e.target.value)}>
                                                    <option value="">Select</option>
                                                    {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Permanent Address</label>
                                            <textarea className="form-input !h-20 resize-none" value={data.permanentAddress}
                                                onChange={e => set('permanentAddress', e.target.value)} placeholder="Full permanent address..." />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="form-label !mb-0">Current Address</label>
                                                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                                                    <input type="checkbox" checked={sameAddress} onChange={e => {
                                                        setSameAddress(e.target.checked);
                                                        if (e.target.checked) set('currentAddress', data.permanentAddress);
                                                    }} className="w-3.5 h-3.5" />
                                                    Same as permanent
                                                </label>
                                            </div>
                                            <textarea className="form-input !h-20 resize-none" value={data.currentAddress}
                                                onChange={e => set('currentAddress', e.target.value)} placeholder="Current address..." disabled={sameAddress} />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: Bank & Tax */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-yellow-300 text-sm flex items-start gap-2">
                                            <Shield size={15} className="shrink-0 mt-0.5" />
                                            All financial information is encrypted and stored securely. This data is only used for payroll processing.
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Bank Account Number</label>
                                                <input className="form-input" value={data.bankAccountNumber} onChange={e => set('bankAccountNumber', e.target.value)} placeholder="XXXXXXXXXXXXXXXX" />
                                            </div>
                                            <div>
                                                <label className="form-label">IFSC Code</label>
                                                <input className="form-input" value={data.ifscCode} onChange={e => set('ifscCode', e.target.value.toUpperCase())} placeholder="e.g. SBIN0001234" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label">Bank Name & Branch</label>
                                            <input className="form-input" value={data.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. SBI - B-25 Neemeshwar Branch" />
                                        </div>
                                        <div>
                                            <label className="form-label">PAN Number</label>
                                            <input className="form-input" value={data.panNumber} onChange={e => set('panNumber', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Emergency Contact */}
                                {step === 3 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="form-label">Contact Name</label>
                                            <input className="form-input" value={data.emergencyContactName} onChange={e => set('emergencyContactName', e.target.value)} placeholder="Full name" />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="form-label">Relationship</label>
                                                <select className="form-input" value={data.emergencyContactRelation} onChange={e => set('emergencyContactRelation', e.target.value)}>
                                                    <option value="">Select</option>
                                                    {['Parent', 'Spouse', 'Sibling', 'Friend', 'Other'].map(r => <option key={r}>{r}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="form-label">Phone Number</label>
                                                <input className="form-input" value={data.emergencyContactPhone} onChange={e => set('emergencyContactPhone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: Documents */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-blue-400/5 border border-blue-400/20 text-blue-300 text-sm">
                                            📎 Upload clear, legible scanned copies or photos of original documents. Accepted formats: PDF, JPG, PNG (max 10MB each).
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <FileUploadField label="Aadhaar Card" field="aadhaar" required />
                                            <FileUploadField label="PAN Card" field="panCard" required />
                                            <FileUploadField label="Highest Degree Certificate" field="degree" required />
                                            <FileUploadField label="Experience Letter(s) (if any)" field="experienceLetter" />
                                            <FileUploadField label="Passport-size Photo" field="passportPhoto" accept=".jpg,.jpeg,.png" required />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: Declaration */}
                                {step === 5 && (
                                    <div className="space-y-5">
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 text-sm text-slate-400 leading-relaxed max-h-48 overflow-y-auto">
                                            <p className="font-semibold text-white mb-3">Declaration & Consent</p>
                                            <p className="mb-3">I, the undersigned, hereby declare that all information provided in this onboarding form is true, accurate, and complete to the best of my knowledge. I understand that any falsification of information may result in immediate termination of employment.</p>
                                            <p className="mb-3">I consent to ScalerHouse collecting, storing, and processing my personal and professional information for employment-related purposes in accordance with applicable data protection laws.</p>
                                            <p>I acknowledge that I have read and understood ScalerHouse's Employee Handbook and agree to abide by all company policies and code of conduct.</p>
                                        </div>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all
                                                ${data.declarationAccepted ? 'bg-cyan-400 border-cyan-400' : 'border-slate-600 group-hover:border-cyan-400'}`}
                                                onClick={() => set('declarationAccepted', !data.declarationAccepted)}>
                                                {data.declarationAccepted && <CheckCircle size={12} className="text-white" />}
                                            </div>
                                            <span className="text-slate-300 text-sm leading-relaxed">I declare that all information provided is accurate and I agree to the terms stated above.</span>
                                        </label>

                                        {/* Summary */}
                                        <div className="glass-card p-4">
                                            <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">Completion Summary</p>
                                            {STEPS.slice(0, 4).map(s => (
                                                <div key={s.id} className="flex items-center gap-2 text-sm py-1.5">
                                                    {completedSteps.includes(s.id) ? <CheckCircle size={15} className="text-green-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />}
                                                    <span className={completedSteps.includes(s.id) ? 'text-green-400' : 'text-slate-500'}>{s.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between mt-8 pt-5 border-t border-slate-700/50">
                                    <button onClick={() => setStep(prev => Math.max(prev - 1, 1))} disabled={step === 1}
                                        className="btn-outline !py-2.5 !px-5 disabled:opacity-30 disabled:cursor-not-allowed">
                                        <ChevronLeft size={16} /> Previous
                                    </button>
                                    <button onClick={() => saveStep(step)} disabled={submitting || (step === 5 && !data.declarationAccepted)}
                                        className="btn-glow !py-2.5 !px-6 disabled:opacity-40 disabled:cursor-not-allowed">
                                        {submitting ? 'Saving...' : step === 5 ? '✅ Submit Onboarding' : <>Next Step <ChevronRight size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

export default withAuth(OnboardingPage, ['employee', 'admin']);
