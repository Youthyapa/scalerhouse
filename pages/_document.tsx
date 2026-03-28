// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="description" content="ScalerHouse – Engineering Predictable Growth for Ambitious Brands. Performance-Driven Digital Marketing Agency." />
                <meta name="keywords" content="digital marketing agency, SEO, performance ads, social media marketing, ScalerHouse, digital marketing company in Kanpur" />
                <meta property="og:title" content="ScalerHouse – Engineering Predictable Growth" />
                <meta property="og:description" content="Performance-Driven Digital Marketing. Scale Faster. Smarter. Stronger." />
                <meta property="og:type" content="website" />
                <meta name="theme-color" content="#0a1628" />
                <meta name="p:domain_verify" content="e32f11a3580c24b27c021491eb709f0e" />

                {/* ── DNS Prefetch & Preconnect (performance) ── */}
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="dns-prefetch" href="https://maps.google.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* ── Google Fonts – preload so it doesn't block rendering ── */}
                <link
                    rel="preload"
                    as="style"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
                <link rel="manifest" href="/favicon_io/site.webmanifest" />
                <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
            </Head>
            <body suppressHydrationWarning={true}>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
