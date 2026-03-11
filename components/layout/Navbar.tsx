// components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/career', label: 'Career' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/5 shadow-lg'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center relative -left-4">
                    <img src="/logo.png" alt="ScalerHouse Logo" className="h-auto w-[200px] lg:w-[240px] object-contain" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${router.pathname === link.href
                                    ? 'text-cyan-400 bg-blue-900/30'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link href="/affiliate/register" className="btn-outline !py-2.5 !px-5 !text-sm">
                        Become Affiliate
                    </Link>
                    <Link href="/login" className="btn-glow !py-2.5 !px-5 !text-sm">
                        <LogIn size={15} />
                        Login
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden text-slate-300 hover:text-white p-2"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[#0a1628]/98 border-t border-white/5"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${router.pathname === link.href
                                            ? 'text-cyan-400 bg-blue-900/30'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 space-y-3 pb-2">
                                <Link href="/affiliate/register" onClick={() => setOpen(false)} className="w-full flex items-center justify-center btn-outline !py-2.5">
                                    Become Affiliate
                                </Link>
                                <Link href="/login" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 btn-glow !py-2.5">
                                    <LogIn size={15} /> Login
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
