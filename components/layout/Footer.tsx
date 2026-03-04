// components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#050d1a] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center font-black text-white text-lg">
                                SH
                            </div>
                            <span className="font-syne font-bold text-xl text-white">
                                Scaler<span className="gradient-text">House</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5">
                            Engineering Predictable Growth for Ambitious Brands. Performance-driven digital marketing that delivers real results.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: Linkedin, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Youtube, href: '#' },
                                { Icon: Twitter, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/30 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Services</h3>
                        <ul className="space-y-2">
                            {['SEO & Content Marketing', 'Performance Ads', 'Social Media Management', 'Web Design & Development', 'Email Marketing', 'Brand Strategy'].map((s) => (
                                <li key={s}>
                                    <Link href="/services" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                                        {s}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'About Us', href: '/about' },
                                { label: 'Case Studies', href: '/case-studies' },
                                { label: 'Blog', href: '/blog' },
                                { label: 'Careers', href: '/career' },
                                { label: 'Affiliate Program', href: '/affiliate/register' },
                                { label: 'Client Portal', href: '/login' },
                            ].map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-slate-400">
                                <Mail size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                <a href="mailto:hello@scalerhouse.com" className="hover:text-cyan-400 transition-colors">
                                    hello@scalerhouse.com
                                </a>
                            </li>
                            <li className="flex gap-3 text-sm text-slate-400">
                                <Phone size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                <a href="tel:+919876543210" className="hover:text-cyan-400 transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex gap-3 text-sm text-slate-400">
                                <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                                <span>Kanpur, Uttar Pradesh, India</span>
                            </li>
                        </ul>
                        <div className="mt-5">
                            <Link href="/contact" className="btn-glow !py-2.5 !px-5 !text-sm !rounded-lg">
                                Get Free Proposal
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-500 text-sm">
                        © 2026 ScalerHouse. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
