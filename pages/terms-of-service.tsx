import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/seo/SEO';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#060b14] font-sans selection:bg-cyan-500/30">
            <SEO
                title="Terms of Service | ScalerHouse"
                description="Review the ScalerHouse Terms of Service. Understand the rules, guidelines, and agreements for using our website and digital marketing services."
                canonicalUrl="https://scalerhouse.com/terms-of-service"
            />
            
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-12">
                        <h1 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">Terms of Service</h1>
                        <p className="text-slate-400">Last Updated: March 11, 2026</p>
                    </div>

                    <article className="prose prose-invert prose-slate max-w-none">
                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ScalerHouse ("we," "us," or "our"), concerning your access to and use of the https://scalerhouse.com website as well as any other media form, media channel, or mobile website related, linked, or otherwise connected thereto.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Representations</h2>
                            <p>
                                By using the Site or our Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Client Portals & Accounts</h2>
                            <p>
                                If you are provided with client dashboard access, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. We reserve the right to refuse service, terminate accounts, remove or edit content in our sole discretion if we find that your account is engaged in fraudulent or harmful activity.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or our marketing services, even if we have been advised of the possibility of such damages.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Kanpur, Uttar Pradesh.
                            </p>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
