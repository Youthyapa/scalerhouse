import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/seo/SEO';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#060b14] font-sans selection:bg-cyan-500/30">
            <SEO
                title="Privacy Policy | ScalerHouse"
                description="Read the ScalerHouse Privacy Policy. Learn how we collect, use, and protect your personal data when using our digital marketing services."
                canonicalUrl="https://scalerhouse.com/privacy-policy"
            />
            
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-12">
                        <h1 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">Privacy Policy</h1>
                        <p className="text-slate-400">Last Updated: March 11, 2026</p>
                    </div>

                    <article className="prose prose-invert prose-slate max-w-none">
                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to ScalerHouse ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website (https://scalerhouse.com) and use our digital marketing services.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                            <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services.</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                                <li><strong>Personal Data:</strong> Name, email address, phone number, and company details when you fill out our contact or proposal forms.</li>
                                <li><strong>Automated Data:</strong> IP addresses, browser types, device information, and usage metrics via cookies and analytics tools.</li>
                            </ul>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                            <p>We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                                <li>To deliver customized marketing proposals and services.</li>
                                <li>To communicate with you regarding project updates, invoices, and support.</li>
                                <li>To improve our website functionality and user experience.</li>
                                <li>To send administrative information to you.</li>
                            </ul>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                            <p>
                                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal data to third-party advertisers. 
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention & Security</h2>
                            <p>
                                We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
                            <p>
                                Depending on your location, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To exercise these rights, please contact us.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                            <p>
                                If you have questions or comments about this notice, you may email us at:
                                <br />
                                <a href="mailto:hello@scalerhouse.com" className="text-cyan-400 hover:underline">hello@scalerhouse.com</a>
                            </p>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
