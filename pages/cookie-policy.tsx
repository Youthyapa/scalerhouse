import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/seo/SEO';

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#060b14] font-sans selection:bg-cyan-500/30">
            <SEO
                title="Cookie Policy | ScalerHouse"
                description="Review the ScalerHouse Cookie Policy to understand how we use cookies, trackers, and analytics to improve your website experience."
                canonicalUrl="https://scalerhouse.com/cookie-policy"
            />
            
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mb-12">
                        <h1 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">Cookie Policy</h1>
                        <p className="text-slate-400">Last Updated: March 11, 2026</p>
                    </div>

                    <article className="prose prose-invert prose-slate max-w-none">
                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files that are placed on your computer or mobile device when you browse a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                            <p>We use cookies for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-400">
                                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly, such as providing secure login to our client portals (JWT tokens).</li>
                                <li><strong>Analytics & Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. We use tools like Google Analytics.</li>
                                <li><strong>Marketing/Retargeting Cookies:</strong> These cookies may be set by our advertising partners to build a profile of your interests and show you relevant advertising on other sites.</li>
                            </ul>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
                            <p>
                                In some special cases, we also use cookies provided by trusted third parties. For example, third-party analytics are used to track and measure usage of this site so that we can continue to produce engaging content. These cookies may track things such as how long you spend on the site or pages you visit.
                            </p>
                        </section>

                        <section className="mb-10 text-slate-300 space-y-4">
                            <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
                            <p>
                                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                            <p>
                                To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">allaboutcookies.org</a>.
                            </p>
                        </section>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}
