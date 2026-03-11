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
                        <div className="flex items-center -mt-4 -mb-8">
                            <img src="/logo.png" alt="ScalerHouse Logo" className="h-auto w-[220px] object-contain relative -left-4" />
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
                                    <Link href="/services" className="inline-block py-1.5 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
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
                                    <Link href={href} className="inline-block py-1.5 text-slate-400 hover:text-cyan-400 text-sm transition-colors">
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
                                <a href="tel:+919219331120" className="hover:text-cyan-400 transition-colors">
                                    +91 92193 31120
                                </a>
                            </li>
                            <li className="flex gap-3 text-sm text-slate-400">
                                <MapPin size={24} className="text-cyan-400 shrink-0 mt-0.5" />
                                <span>B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini, Kanpur, Uttar Pradesh 208022</span>
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
                        <Link href="/privacy-policy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Terms of Service</Link>
                        <Link href="/cookie-policy" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
