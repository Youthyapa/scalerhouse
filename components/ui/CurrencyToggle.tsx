import React, { useEffect, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { DollarSign, IndianRupee } from 'lucide-react';

export default function CurrencyToggle() {
    const { currency, setCurrency } = useCurrency();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="w-[120px] h-8 bg-slate-800/50 rounded-full animate-pulse" />;

    return (
        <div className="flex bg-slate-800/50 backdrop-blur-md border border-white/10 p-0.5 rounded-full">
            <button
                onClick={() => setCurrency('USD')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    currency === 'USD' 
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Switch to USD"
            >
                <DollarSign size={13} /> USD
            </button>
            <button
                onClick={() => setCurrency('INR')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                    currency === 'INR' 
                    ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Switch to INR"
            >
                <IndianRupee size={13} /> INR
            </button>
        </div>
    );
}
