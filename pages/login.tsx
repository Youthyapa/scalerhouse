// pages/login.tsx
import Head from 'next/head';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import Link from 'next/link';


const roleRoutes: Record<string, string> = {
    admin: '/admin',
    employee: '/employee',
    client: '/client',
    affiliate: '/affiliate/dashboard',
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            const saved = JSON.parse(localStorage.getItem('sh_auth_user') || '{}');
            window.location.href = roleRoutes[saved.role] || '/';
        } else {
            setError(result.message);
        }
        setLoading(false);
    };


    return (
        <>
            <Head>
                <title>Login – ScalerHouse</title>
            </Head>
            <div className="min-h-screen hero-bg grid-bg flex items-center justify-center px-4">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="relative z-10 w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <img src="/logo.png" alt="ScalerHouse Logo" className="h-auto w-[260px] object-contain mx-auto" />
                        </Link>
                        <p className="text-slate-400 mt-3 text-sm">Sign in to your portal</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="form-label">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@scalerhouse.com"
                                        className="form-input !pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="form-input !pl-10 !pr-12"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-900/20 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-glow w-full justify-center !py-3.5">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <><LogIn size={16} /> Sign In</>
                                )}
                            </button>
                        </form>

                    </motion.div>

                    <p className="text-center text-slate-500 text-sm mt-5">
                        Want to partner with us?{' '}
                        <Link href="/affiliate/register" className="text-cyan-400 hover:text-cyan-300">
                            Become an Affiliate
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
