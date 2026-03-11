import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
    isArticle?: boolean;
    schemaData?: any;
}

const defaultSEO = {
    title: "ScalerHouse – Engineering Predictable Growth for Ambitious Brands",
    description: "ScalerHouse is a performance-driven digital marketing agency. We specialize in SEO, Performance Ads, Social Media, and Web Development to scale your brand faster, smarter, and stronger.",
    keywords: "digital marketing agency, SEO, performance ads, social media marketing, web development, web design, ScalerHouse, Kanpur digital marketing",
    ogImage: "https://scalerhouse.com/logo.png", // Fallback to logo for now
    siteName: "ScalerHouse",
    twitterHandle: "@scalerhouse"
};

export default function SEO({
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    ogImage = defaultSEO.ogImage,
    canonicalUrl,
    isArticle = false,
    schemaData
}: SEOProps) {
    const router = useRouter();
    const siteUrl = "https://scalerhouse.com"; // Change to actual production URL
    const url = canonicalUrl || `${siteUrl}${router.asPath === '/' ? '' : router.asPath}`;

    // Default Organization Schema
    const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ScalerHouse",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": defaultSEO.description,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9219331120",
            "contactType": "customer service",
            "email": "hello@scalerhouse.com"
        },
        "sameAs": [
            "https://www.linkedin.com/company/scalerhouse",
            "https://twitter.com/scalerhouse",
            "https://www.instagram.com/scalerhouse"
        ]
    };

    return (
        <Head>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <link rel="canonical" href={url} />

            {/* Open Graph (OG) Meta Tags for Social Media */}
            <meta property="og:type" content={isArticle ? 'article' : 'website'} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={defaultSEO.siteName} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={defaultSEO.twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Theme Color */}
            <meta name="theme-color" content="#0a1628" />

            {/* JSON-LD Schema Markup for AEO (AI Engine Optimization) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData || baseSchema) }}
            />
        </Head>
    );
}
