// pages/index.tsx
import Head from "next/head";
import SEO from "../components/seo/SEO";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Search,
  Megaphone,
  Globe,
  BarChart2,
  Mail,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Zap,
  CheckCircle,
  Play,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WhatsAppFAB from "../components/layout/WhatsAppFAB";
import { getAll, KEYS, Offer } from "../lib/store";

interface ContentItem {
  _id: string;
  type: "client_logo" | "achievement" | "news_link" | "faq";
  title: string;
  imageUrl?: string;
  linkUrl?: string;
  description?: string;
}

// ── Counter Hook ──
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
}

const services = [
  {
    icon: Search,
    title: "SEO & Content",
    desc: "Dominate search rankings with data-driven SEO strategies and compelling content.",
    color: "from-blue-600/20 to-blue-900/10",
    border: "border-blue-500/20",
    slug: "seo-content-marketing"
  },
  {
    icon: Megaphone,
    title: "Performance Ads",
    desc: "Google & Meta campaigns engineered for maximum ROAS and scalable growth.",
    color: "from-cyan-600/20 to-cyan-900/10",
    border: "border-cyan-500/20",
    slug: "performance-ads"
  },
  {
    icon: Globe,
    title: "Social Media",
    desc: "Build authority and community across Instagram, LinkedIn, YouTube & more.",
    color: "from-purple-600/20 to-purple-900/10",
    border: "border-purple-500/20",
    slug: "social-media-management"
  },
  {
    icon: BarChart2,
    title: "Analytics & CRO",
    desc: "Turn data into decisions. Conversion rate optimization that multiplies revenue.",
    color: "from-green-600/20 to-green-900/10",
    border: "border-green-500/20",
    slug: "analytics-cro"
  },
  {
    icon: Mail,
    title: "Email Marketing",
    desc: "Automated drip campaigns that nurture leads and drive repeat revenue.",
    color: "from-orange-600/20 to-orange-900/10",
    border: "border-orange-500/20",
    slug: "email-marketing-automation"
  },
  {
    icon: TrendingUp,
    title: "Brand Strategy",
    desc: "Position your brand as a market leader with our strategic growth framework.",
    color: "from-pink-600/20 to-pink-900/10",
    border: "border-pink-500/20",
    slug: "brand-strategy"
  },
  {
    icon: Globe,
    title: "Web Design & Development",
    desc: "Get a stunning, conversion-optimized website built on modern technology.",
    color: "from-blue-600/20 to-indigo-900/10",
    border: "border-blue-500/20",
    slug: "web-design-development"
  },
  {
    icon: TrendingUp,
    title: "App Development",
    desc: "Custom iOS and Android applications that engage users and drive revenue.",
    color: "from-emerald-600/20 to-teal-900/10",
    border: "border-emerald-500/20",
    slug: "app-development"
  },
  {
    icon: Search,
    title: "Graphic Designing",
    desc: "Eye-catching visuals, brand identities, and social media creatives that pop.",
    color: "from-fuchsia-600/20 to-pink-900/10",
    border: "border-fuchsia-500/20",
    slug: "graphic-designing"
  },
];

const caseStudies = [
  {
    brand: "TechCorp India",
    category: "SEO + Content",
    result: "340% organic traffic increase in 6 months",
    stat: "+340%",
    metric: "Organic Traffic",
    bg: "from-blue-900/60 to-slate-900",
  },
  {
    brand: "Fashion Hive",
    category: "Performance Ads",
    result: "8.2x ROAS on Meta & Google Ads campaigns",
    stat: "8.2x",
    metric: "ROAS Achieved",
    bg: "from-purple-900/60 to-slate-900",
  },
  {
    brand: "BuildMasters",
    category: "Social Media + SEO",
    result: "500K+ brand reach from zero in 90 days",
    stat: "500K+",
    metric: "Brand Reach",
    bg: "from-cyan-900/60 to-slate-900",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechCorp India",
    text: "ScalerHouse transformed our online presence. We went from page 5 to page 1 for our main keywords in just 4 months. Our leads have tripled.",
    rating: 5,
    avatar: "RK",
  },
  {
    name: "Sneha Gupta",
    company: "Fashion Hive",
    text: "The performance ads team delivered 8x ROAS. We've never seen numbers like this before. Truly a world-class performance marketing team.",
    rating: 5,
    avatar: "SG",
  },
  {
    name: "Vikram Singh",
    company: "BuildMasters",
    text: "In 90 days, our brand went from unknown to 500K+ reach. The social media strategy was brilliant and execution was flawless.",
    rating: 5,
    avatar: "VS",
  },
];

export default function Home() {
  const [activeCase, setActiveCase] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  // Dynamic Content
  const [content, setContent] = useState<Record<string, ContentItem[]>>({
    client_logo: [],
    achievement: [],
    news_link: [],
    faq: [],
  });

  const clients100 = useCounter(150);
  const revenue500 = useCounter(500);
  const roas8 = useCounter(8);
  const happy99 = useCounter(99);

  // Animate on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("visible", e.isIntersecting),
        ),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".animate-fade-up")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Fetch Dynamic Content
  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: ContentItem[]) => {
        setContent({
          client_logo: data.filter((d) => d.type === "client_logo"),
          achievement: data.filter((d) => d.type === "achievement"),
          news_link: data.filter((d) => d.type === "news_link"),
          faq: data.filter((d) => d.type === "faq"),
        });
      })
      .catch((err) => console.error("Failed to load content", err));
  }, []);

  // Offer popup
  useEffect(() => {
    const offers = getAll<Offer>(KEYS.OFFERS);
    const now = new Date();
    const active = offers.find(
      (o) =>
        o.isActive &&
        o.pages.includes("/") &&
        new Date(o.startDate) <= now &&
        new Date(o.endDate) >= now,
    );
    if (active) {
      setOffer(active);
      const dismissed = sessionStorage.getItem(
        "sh_offer_dismissed_" + active.id,
      );
      if (!dismissed) {
        setTimeout(() => setShowOfferPopup(true), 3000);
      }
    }
  }, []);

  const closeOffer = () => {
    if (offer) sessionStorage.setItem("sh_offer_dismissed_" + offer.id, "1");
    setShowOfferPopup(false);
  };

  return (
    <>
      <SEO 
        title="ScalerHouse – Engineering Predictable Growth for Ambitious Brands"
        description="ScalerHouse is a performance-driven digital marketing agency in Kanpur. SEO, Ads, Social Media, CRO. Scale Faster. Smarter. Stronger."
        schemaData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "ScalerHouse",
          "image": "https://scalerhouse.com/logo.png",
          "url": "https://scalerhouse.com",
          "telephone": "+919219331120",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "B-25, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Gujaini",
            "addressLocality": "Kanpur",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "208022",
            "addressCountry": "IN"
          }
        }}
      />

      <Navbar />
      <WhatsAppFAB />

      {/* ── HERO ── */}
      <section className="hero-bg grid-bg min-h-screen flex items-center relative pt-20 lg:pt-32 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24 relative z-10 w-full mb-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left mx-auto max-w-[95%] sm:max-w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-[11px] sm:text-xs lg:text-sm font-medium mb-4 lg:mb-6 whitespace-normal text-center"
              >
                <Zap size={14} className="animate-pulse flex-shrink-0" />
                <span>Growth Is Not Luck. It&apos;s Strategy.</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-syne font-bold text-[32px] leading-[1.15] sm:text-4xl lg:text-6xl text-white mb-4 lg:mb-6 drop-shadow-sm"
              >
                Engineering <br className="hidden lg:block"/><span className="gradient-text">Predictable</span>{" "}
                Growth.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0"
              >
                We don&apos;t run campaigns. We build growth systems.
                ScalerHouse delivers measurable, predictable digital growth for
                ambitious brands across SEO, ads, social media, and beyond.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full justify-center lg:justify-start"
              >
                <Link
                  href="/contact"
                  className="btn-glow flex justify-center text-sm lg:text-base !py-3 lg:!py-4 !px-6 w-full sm:w-auto mt-2"
                >
                  Get Free Proposal <ArrowRight size={18} />
                </Link>
                <Link
                  href="/case-studies"
                  className="btn-outline flex justify-center text-sm lg:text-base !py-3 lg:!py-4 !px-6 w-full sm:w-auto"
                >
                  <Play size={16} /> See Results
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 mt-8 lg:mt-10"
              >
                <div className="flex -space-x-3">
                  {["RK", "SG", "VS", "AK", "PM"].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 border-2 border-[#0f172a] flex items-center justify-center text-[10px] lg:text-xs font-bold text-white shrink-0"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left shrink-0 mt-1 sm:mt-0">
                  <div className="flex justify-center sm:justify-start text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="lg:w-[14px] lg:h-[14px]" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-400 text-[11px] lg:text-sm mt-0.5 whitespace-normal sm:whitespace-nowrap">
                    Trusted by 150+ brands
                  </p>
                </div>
              </motion.div>

              {/* Featured In – infinite marquee carousel, uniform logo sizes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 lg:mt-10 overflow-hidden text-center lg:text-left mx-auto max-w-[95%] sm:max-w-full"
              >
                <p className="text-slate-500 text-[10px] lg:text-xs font-semibold tracking-wider uppercase mb-2 lg:mb-3">
                  Featured In
                </p>
                <style>{`
                  @keyframes hero-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .hero-marquee { animation: hero-marquee 22s linear infinite; }
                  .hero-marquee:hover { animation-play-state: paused; }
                  .news-logo {
                    filter: brightness(0) invert(1);
                    opacity: 0.55;
                    transition: opacity 0.3s;
                  }
                  .news-logo:hover { opacity: 1; }
                `}</style>
                <div className="flex hero-marquee items-center" style={{ width: 'max-content' }}>
                  {[
                    'economicstimes.png', 'timesofindia.png', 'forbesindia.png', 'thehindu.png',
                    'republic.png', 'timesnow.png', 'tv9.png', 'punjabkesari.png',
                    '99news.png', 'Insidernews.png', 'newswire.png', 'newstoday.png', 'india.png', 'todaynews.png',
                    'economicstimes.png', 'timesofindia.png', 'forbesindia.png', 'thehindu.png',
                    'republic.png', 'timesnow.png', 'tv9.png', 'punjabkesari.png',
                    '99news.png', 'Insidernews.png', 'newswire.png', 'newstoday.png', 'india.png', 'todaynews.png',
                  ].map((file, i) => (
                    <div key={`hn-${i}`} className="mr-6 lg:mr-10 flex-shrink-0 w-20 lg:w-28 h-8 lg:h-10 flex items-center justify-center">
                      <img
                        src={`/News/${file}`}
                        alt={file.replace(/\.[^.]+$/, '')}
                        className="news-logo max-w-[80px] lg:max-w-full max-h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hero Right – Floating Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="glass-card p-6 animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-xs">
                      Client Growth Dashboard
                    </p>
                    <p className="text-white font-semibold">
                      Q1 2026 Performance
                    </p>
                  </div>
                  <span className="badge-green badge">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    {
                      label: "Organic Traffic",
                      val: "+340%",
                      color: "text-green-400",
                    },
                    { label: "ROAS", val: "8.2x", color: "text-cyan-400" },
                    {
                      label: "Leads Generated",
                      val: "2,847",
                      color: "text-blue-400",
                    },
                    {
                      label: "Revenue Growth",
                      val: "+₹42L",
                      color: "text-yellow-400",
                    },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/5 rounded-xl p-3">
                      <p className={`font-bold text-xl ${m.color}`}>{m.val}</p>
                      <p className="text-slate-400 text-xs mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { label: "SEO Progress", val: 87 },
                    { label: "Ads Performance", val: 94 },
                    { label: "Social Reach", val: 72 },
                  ].map((p) => (
                    <div key={p.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{p.label}</span>
                        <span className="text-slate-300">{p.val}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${p.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating bubbles */}
              <div
                className="absolute -top-4 -right-4 glass-card px-4 py-3 text-sm animate-float"
                style={{ animationDelay: "-2s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-medium">
                    New Lead: ₹80K/mo
                  </span>
                </div>
              </div>
              <div
                className="absolute -bottom-6 -left-4 glass-card px-4 py-3 animate-float"
                style={{ animationDelay: "-4s" }}
              >
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-yellow-400" />
                  <span className="text-white text-sm font-medium">
                    Deal Closed 🎉
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 border-y border-white/5 bg-[#080f1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={clients100.ref}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                value: clients100.count,
                suffix: "+",
                label: "Brands Scaled",
                icon: Users,
              },
              {
                value: revenue500.count,
                suffix: "Cr+",
                label: "Revenue Generated",
                icon: TrendingUp,
              },
              {
                value: roas8.count,
                suffix: ".2x",
                label: "Average ROAS",
                icon: BarChart2,
              },
              {
                value: happy99.count,
                suffix: "%",
                label: "Client Retention",
                icon: Star,
              },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <stat.icon size={24} className="text-cyan-400 mx-auto mb-3" />
                <div className="font-syne font-black text-4xl text-white">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR CLIENTS – Infinite Marquee Carousel ── */}
      <section className="py-14 bg-[#0a1222] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-slate-500 text-sm font-bold tracking-[4px] uppercase mb-2">Trusted by Industry Leaders</p>
          <h2 className="font-syne font-black text-3xl md:text-4xl text-white">
            Brands That <span className="gradient-text">Grow With Us</span>
          </h2>
        </div>

        <style>{`
          @keyframes marquee-left {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-right {
            0%   { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-track-left  { animation: marquee-left  28s linear infinite; }
          .marquee-track-right { animation: marquee-right 32s linear infinite; }
          .marquee-track-left:hover,
          .marquee-track-right:hover { animation-play-state: paused; }
        `}</style>

        {/* Row 1 — scrolls left */}
        <div className="relative overflow-hidden mb-8">
          <div className="flex marquee-track-left" style={{ width: 'max-content' }}>
            {[
              'CEAT.png','Raymond.png','TATA.png','Royal Enfield.jpg','Jawa.png',
              'Killer.gif','LeeCooper.png','RedChief.png','adani.png','apollo.png',
              'CEAT.png','Raymond.png','TATA.png','Royal Enfield.jpg','Jawa.png',
              'Killer.gif','LeeCooper.png','RedChief.png','adani.png','apollo.png',
            ].map((logo, i) => (
              <div key={`r1-${i}`} className="mx-8 flex items-center justify-center w-36 h-16 flex-shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src={`/Clients/${logo}`} alt={logo.replace(/\.[^.]+$/, '')} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="relative overflow-hidden">
          <div className="flex marquee-track-right" style={{ width: 'max-content' }}>
            {[
              'GroceBay.png','KDC.png','SSCable Network.png','Sachan Construction.png','Sachan TechnoFirm.png',
              'VSS DEVELOPERS.png','Yash Cable Network.png','Bhola.png','Anirudh Vaidik Parivar.png','Ekta Hi Ek Vikalp.png',
              'GroceBay.png','KDC.png','SSCable Network.png','Sachan Construction.png','Sachan TechnoFirm.png',
              'VSS DEVELOPERS.png','Yash Cable Network.png','Bhola.png','Anirudh Vaidik Parivar.png','Ekta Hi Ek Vikalp.png',
            ].map((logo, i) => (
              <div key={`r2-${i}`} className="mx-8 flex items-center justify-center w-36 h-16 flex-shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <img src={`/Clients/${logo}`} alt={logo.replace(/\.[^.]+$/, '')} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a1222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <span className="badge badge-blue mb-4">What We Do</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
              Full-Stack <span className="gradient-text">Growth Services</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every service we offer is tied to measurable outcomes. No vanity
              metrics. Just growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`glass-card-hover p-6 bg-gradient-to-br ${svc.color} border ${svc.border}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} border ${svc.border} flex items-center justify-center mb-4`}
                >
                  <svc.icon size={22} className="text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  {svc.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {svc.desc}
                </p>
                <Link
                  href={svc.slug ? `/services/${svc.slug}` : "/services"}
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-lg text-sm font-semibold text-cyan-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:gap-3"
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="py-24 bg-[#080f1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <span className="badge badge-cyan mb-4">Proof of Work</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
              Real Results. <span className="gradient-text">Real Brands.</span>
            </h2>
          </div>
          <div className="relative">
            <div
              className={`rounded-2xl overflow-hidden bg-gradient-to-br ${caseStudies[activeCase].bg} border border-white/10 p-8 lg:p-12 min-h-64`}
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="badge badge-blue mb-4">
                    {caseStudies[activeCase].category}
                  </span>
                  <h3 className="font-syne font-bold text-3xl text-white mb-3">
                    {caseStudies[activeCase].brand}
                  </h3>
                  <p className="text-slate-300 text-lg">
                    {caseStudies[activeCase].result}
                  </p>
                  <Link
                    href="/case-studies"
                    className="btn-glow mt-6 !py-3 !px-6 !text-sm"
                  >
                    View Full Case Study <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="text-center lg:text-right">
                  <div className="font-syne font-black text-8xl gradient-text">
                    {caseStudies[activeCase].stat}
                  </div>
                  <div className="text-slate-400 text-lg mt-2">
                    {caseStudies[activeCase].metric}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() =>
                  setActiveCase(
                    (p) => (p - 1 + caseStudies.length) % caseStudies.length,
                  )
                }
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              {caseStudies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeCase ? "bg-cyan-400 w-8" : "bg-slate-600"}`}
                />
              ))}
              <button
                onClick={() =>
                  setActiveCase((p) => (p + 1) % caseStudies.length)
                }
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-400/30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS & ACHIEVEMENTS ── */}
      <section className="py-24 bg-[#0a1222] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="badge badge-yellow mb-4">Our Partners</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
              Our <span className="gradient-text">Partners &amp; Achievements</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Proud partners of industry leaders and recognized globally for delivering outstanding digital growth results.
            </p>
          </div>
          {content.achievement.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {content.achievement.map((ach, i) => (
                <motion.div
                  key={ach._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass-card flex items-center gap-6 p-6 border border-white/10 hover:border-cyan-400/30 transition-all group"
                >
                  <div className="w-24 h-24 shrink-0 flex items-center justify-center p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    <img src={ach.imageUrl} alt={ach.title} className="max-h-full max-w-full object-contain filter drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-lg text-white mb-1.5">{ach.title}</h3>
                    {ach.description && <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{ach.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Google Premier Partner", desc: "Recognized as a top 3% agency globally for Google Ads performance", badge: "GP" },
                { title: "Meta Business Partner", desc: "Certified experts in advanced Meta advertising and tracking", badge: "MB" },
                { title: "Top B2B Company", desc: "Rated 4.9/5 on Clutch for digital strategy and execution", badge: "B2" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass-card flex items-center gap-6 p-6 border border-white/10 hover:border-cyan-400/30 transition-all group"
                >
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-cyan-400/20 rounded-xl font-syne font-black text-xl gradient-text group-hover:scale-110 transition-all">
                    {item.badge}
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-lg text-white mb-1.5">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED IN – News & Media Logos ── */}
      <section className="py-12 bg-[#070f1d] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-slate-500 text-sm font-bold tracking-[4px] uppercase mb-2">As Featured In</p>
          <h2 className="font-syne font-black text-3xl md:text-4xl text-white">
            Covered By <span className="gradient-text">Top Media</span>
          </h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex marquee-news" style={{ width: 'max-content' }}>
            {[
              'economicstimes.png', 'timesofindia.png', 'forbesindia.png', 'thehindu.png',
              'republic.png', 'timesnow.png', 'tv9.png', 'punjabkesari.png',
              '99news.png', 'Insidernews.png', 'newswire.png', 'newstoday.png', 'india.png', 'todaynews.png',
              'economicstimes.png', 'timesofindia.png', 'forbesindia.png', 'thehindu.png',
              'republic.png', 'timesnow.png', 'tv9.png', 'punjabkesari.png',
              '99news.png', 'Insidernews.png', 'newswire.png', 'newstoday.png', 'india.png', 'todaynews.png',
            ].map((logo, i) => (
              <div key={`news3-${i}`} className="mx-8 flex items-center justify-center w-36 h-14 flex-shrink-0">
                <img src={`/News/${encodeURIComponent(logo)}`} alt={logo.replace(/\.[^.]+$/, '')} className="max-w-full max-h-full object-contain news-logo" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SCALERHOUSE ── */}
      <section className="py-24 bg-[#0a1222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="badge badge-purple mb-4">Why ScalerHouse</span>
              <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-6">
                We Build <span className="gradient-text">Growth Engines,</span>
                <br />
                Not Just Campaigns
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Most agencies run ads and hope for the best. We engineer
                end-to-end growth systems — from strategy to execution to
                reporting — all tied to your revenue goals.
              </p>
              <div className="space-y-4">
                {[
                  "Dedicated growth strategist for every client",
                  "Weekly reporting & monthly strategy sessions",
                  "Zero lock-in. Cancel anytime with 30-day notice",
                  "In-house team — no outsourcing, ever",
                  "KPI-driven retainers with guaranteed benchmarks",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-glow mt-8">
                About ScalerHouse <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  number: "150+",
                  label: "Brands Scaled",
                  desc: "Across 15+ industries",
                },
                {
                  number: "₹500Cr+",
                  label: "Revenue Driven",
                  desc: "For our clients",
                },
                {
                  number: "45 Days",
                  label: "First Results",
                  desc: "Average time to see growth",
                },
                {
                  number: "24/7",
                  label: "Support",
                  desc: "Always available via portal",
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true }}
                  className="glass-card p-5"
                >
                  <div className="font-syne font-black text-3xl gradient-text">
                    {item.number}
                  </div>
                  <div className="font-semibold text-white mt-1">
                    {item.label}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SCALERHOUSE (Animated Features) ── */}
      <section className="py-24 bg-[#050b14] border-t border-white/5 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-up">
            <span className="badge badge-purple mb-4">Why ScalerHouse</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-6">
              Why Brands Choose <span className="gradient-text">Us</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              We don&apos;t just run campaigns. We build predictable, scalable, and data-driven growth engines for ambitious brands.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side metrics */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 order-2 lg:order-1">
              {[
                { number: "150+", label: "Brands Scaled", desc: "Across 15+ industries", delay: 0.1 },
                { number: "₹500Cr+", label: "Revenue Driven", desc: "For our clients", delay: 0.2 },
                { number: "45 Days", label: "First Results", desc: "Average time to ROI", delay: 0.3 },
                { number: "100%", label: "In-House Team", desc: "No outsourcing, ever", delay: 0.4 },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className={`glass-card p-6 lg:p-8 ${idx === 1 || idx === 3 ? 'lg:translate-y-12' : ''} border border-white/5 hover:border-cyan-400/20 transition-all`}
                >
                  <div className="font-syne font-black text-4xl lg:text-5xl gradient-text mb-2">
                    {item.number}
                  </div>
                  <div className="font-bold text-white text-lg mb-1">
                    {item.label}
                  </div>
                  <div className="text-slate-500 text-sm">{item.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Right side features */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {[
                  {
                    title: "Data-Driven Decisions",
                    desc: "No guesswork. Every strategy is backed by deep analytics, market research, and continuous A/B testing to ensure maximum ROI.",
                    icon: <BarChart2 size={24} className="text-blue-400" />
                  },
                  {
                    title: "Dedicated Growth Experts",
                    desc: "You get a dedicated pod of specialists—strategists, media buyers, and copywriters—working relentlessly on your account.",
                    icon: <Users size={24} className="text-purple-400" />
                  },
                  {
                    title: "Transparent Reporting",
                    desc: "Real-time dashboards and weekly strategy calls. You always know exactly where your budget is going and what it's generating.",
                    icon: <TrendingUp size={24} className="text-emerald-400" />
                  }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 font-syne group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm lg:text-base">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-6">
                  <Link href="/about" className="btn-glow inline-flex items-center gap-2">
                    Learn More About Us <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-24 bg-[#080f1e] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="badge badge-purple mb-4">FAQ</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about partnering with ScalerHouse. Can&apos;t find an answer?{" "}
              <Link href="/contact" className="text-cyan-400 hover:underline">Feel free to reach out.</Link>
            </p>
          </div>
          <div className="space-y-4">
            {(content.faq.length > 0 ? content.faq : [
              { _id: 'faq_1', title: 'Do you guarantee results?', description: 'While we cannot guarantee arbitrary numbers, we do guarantee execution against KPI-driven benchmarks established during our strategy phase.' },
              { _id: 'faq_2', title: 'Are there any long-term lock-ins?', description: 'No. All our retainers run on a month-to-month basis. We rely on performance to keep you with us, not legally binding annual contracts.' },
              { _id: 'faq_3', title: 'Who creates the content?', description: 'Everything is managed by our in-house team of expert copywriters, designers, and strategists. We never outsource your brand\'s voice.' },
            ]).map((faq) => (
              <details key={faq._id} className="glass-card p-6 group cursor-pointer marker:content-[''] transition-all hover:bg-white/5">
                <summary className="font-syne font-bold text-lg text-white flex justify-between items-center outline-none select-none">
                  {faq.title}
                  <span className="text-cyan-400 group-open:rotate-45 transition-transform text-2xl leading-none flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400/10 shrink-0 ml-4">+</span>
                </summary>
                <p className="text-slate-400 mt-4 leading-relaxed pr-8 border-t border-white/10 pt-4">{faq.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-[#080f1e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <span className="badge badge-yellow mb-4">Client Love</span>
            <h2 className="font-syne font-black text-4xl lg:text-5xl text-white mb-4">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 text-center"
            >
              <div className="flex justify-center text-yellow-400 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map(
                  (_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ),
                )}
              </div>
              <p className="text-slate-200 text-lg leading-relaxed mb-8 italic">
                &ldquo;{testimonials[activeTestimonial].text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeTestimonial ? "bg-cyan-400 w-8" : "bg-slate-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AFFILIATE CTA ── */}
      <section className="py-16 bg-[#0a1222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl bg-gradient-to-r from-blue-900/60 via-[#0f172a] to-cyan-900/30 border border-white/10 p-10 lg:p-14 text-center">
            <span className="badge badge-green mb-4">Affiliate Program</span>
            <h2 className="font-syne font-black text-4xl text-white mb-4">
              Earn Up To <span className="gradient-text">15% Commission</span>{" "}
              Per Deal
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Refer clients to ScalerHouse and earn recurring commissions on
              every deal that closes. Zero investment. High returns.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/affiliate/register"
                className="btn-glow !py-4 !px-8 text-base"
              >
                Become an Affiliate <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="btn-outline !py-4 !px-8 text-base"
              >
                Get Free Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── OFFER POPUP ── */}
      {showOfferPopup && offer && (
        <div className="modal-overlay" onClick={closeOffer}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-box max-w-md text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-4">🎉</div>
            <span className="badge badge-green mb-3">Limited Time Offer</span>
            <h3 className="font-syne font-black text-2xl text-white mb-3">
              {offer.title}
            </h3>
            <p className="text-slate-300 mb-4">{offer.description}</p>
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/30 rounded-xl p-4 mb-6 border border-cyan-400/20">
              <p className="text-slate-400 text-sm mb-1">Use coupon code</p>
              <p className="font-syne font-black text-3xl gradient-text tracking-widest">
                {offer.couponCode}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Valid till {new Date(offer.endDate).toLocaleDateString("en-IN")}
              </p>
            </div>
            <Link
              href="/contact"
              onClick={closeOffer}
              className="btn-glow w-full justify-center !py-3.5"
            >
              Claim Offer Now <ArrowRight size={16} />
            </Link>
            <button
              onClick={closeOffer}
              className="mt-4 text-slate-500 text-sm hover:text-slate-300 transition-colors"
            >
              No thanks, I&apos;ll pay full price
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
