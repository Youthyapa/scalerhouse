import Head from 'next/head';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
    isArticle?: boolean;
    /** A single schema object OR an array of schema objects. If omitted, default @graph is used. */
    schemaData?: Record<string, any> | Record<string, any>[];
    /** Optional breadcrumb trail for BreadcrumbList schema */
    breadcrumbs?: BreadcrumbItem[];
    /** Set to 'noindex' for pages you don't want indexed (login, admin etc.) */
    robots?: string;
}

const SITE_URL = 'https://scalerhouse.com';

const defaultSEO = {
    title: 'ScalerHouse – Engineering Predictable Growth for Ambitious Brands',
    description: 'ScalerHouse is a performance-driven digital marketing agency in Kanpur. We specialize in SEO, Performance Ads, Social Media, and Web Development to scale your brand faster, smarter, and stronger.',
    keywords: 'digital marketing agency, digital marketing company in Kanpur, SEO services Kanpur, performance ads, social media marketing, web development, ScalerHouse',
    ogImage: `${SITE_URL}/logo.png`,
    siteName: 'ScalerHouse',
    twitterHandle: '@scalerhouse',
};

/** Build the default @graph schema used on all pages unless overridden */
function buildDefaultGraph(siteUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'ScalerHouse',
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: `${siteUrl}/logo.png`,
                },
                image: `${siteUrl}/favicon_io/android-chrome-512x512.png`,
                description: defaultSEO.description,
                foundingDate: '2020',
                areaServed: 'India',
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+91-9196131120',
                    contactType: 'customer service',
                    email: 'hello@scalerhouse.com',
                    availableLanguage: ['English', 'Hindi'],
                },
                sameAs: [
                    'https://www.linkedin.com/company/scalerhouse',
                    'https://www.facebook.com/scalerhouse',
                    'https://www.instagram.com/scalerhouse',
                    'https://twitter.com/scalerhouse',
                    'https://www.youtube.com/@scalerhouse',
                    'https://www.wikidata.org/wiki/Q138752497'
                ],
            },
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: siteUrl,
                name: 'ScalerHouse',
                publisher: { '@id': `${siteUrl}/#organization` },
                image: `${siteUrl}/favicon_io/android-chrome-512x512.png`,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/blog?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },
        ],
    };
}

export default function SEO({
    title = defaultSEO.title,
    description = defaultSEO.description,
    keywords = defaultSEO.keywords,
    ogImage = defaultSEO.ogImage,
    canonicalUrl,
    isArticle = false,
    schemaData,
    breadcrumbs,
    robots,
}: SEOProps) {
    const router = useRouter();
    const url = canonicalUrl || `${SITE_URL}${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`;

    // Build the JSON-LD schema output
    let schemaOutput: Record<string, any> | Record<string, any>[];
    if (schemaData) {
        // Caller-supplied schema: if it's an array, wrap in @graph
        if (Array.isArray(schemaData)) {
            schemaOutput = { '@context': 'https://schema.org', '@graph': schemaData };
        } else {
            schemaOutput = schemaData;
        }
    } else {
        schemaOutput = buildDefaultGraph(SITE_URL);
    }

    // If breadcrumbs are supplied, append BreadcrumbList to the output
    const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
        ? {
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: crumb.name,
                item: crumb.url,
            })),
        }
        : null;

    // Serialise schema(s) into one or two <script> tags
    const mainSchemaStr = JSON.stringify(schemaOutput);
    const breadcrumbSchemaStr = breadcrumbSchema ? JSON.stringify({
        '@context': 'https://schema.org',
        ...breadcrumbSchema,
    }) : null;

    return (
        <Head>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <link rel="canonical" href={url} />
            {robots && <meta name="robots" content={robots} />}

            {/* Verification Meta Tags */}
            <meta name="yandex-verification" content="3b3be3785b71e258" />

            {/* Open Graph (OG) Meta Tags for Social Media */}
            <meta property="og:type" content={isArticle ? 'article' : 'website'} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={defaultSEO.siteName} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={defaultSEO.twitterHandle} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Theme Color */}
            <meta name="theme-color" content="#0a1628" />

            {/* JSON-LD Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: mainSchemaStr }}
            />
            {breadcrumbSchemaStr && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: breadcrumbSchemaStr }}
                />
            )}
        </Head>
    );
}
