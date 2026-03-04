// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta name="description" content="ScalerHouse – Engineering Predictable Growth for Ambitious Brands. Performance-Driven Digital Marketing Agency." />
                <meta name="keywords" content="digital marketing agency, SEO, performance ads, social media marketing, ScalerHouse" />
                <meta property="og:title" content="ScalerHouse – Engineering Predictable Growth" />
                <meta property="og:description" content="Performance-Driven Digital Marketing. Scale Faster. Smarter. Stronger." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
