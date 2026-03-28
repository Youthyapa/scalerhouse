// components/layout/SocialFloatBar.tsx
import { useEffect, useState } from 'react';

const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/scalerhouse',
    color: '#1877F2',
    glow: 'rgba(24,119,242,0.6)',
    active: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/scalerhouse',
    color: '#0A66C2',
    glow: 'rgba(10,102,194,0.6)',
    active: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/scalerhouse',
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.6)',
    active: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@scalerhouse',
    color: '#FF0000',
    glow: 'rgba(255,0,0,0.6)',
    active: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/scalerhouse',
    color: '#e2e8f0',
    glow: 'rgba(226,232,240,0.5)',
    active: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SocialFloatBar() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    const t = setTimeout(() => setMounted(true), 600);
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  if (!mounted) return null;
  return isMobile ? <MobileBar /> : <DesktopBar />;
}

/* ─── DESKTOP: vertical stack above WhatsApp FAB ─── */
function DesktopBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      position: 'fixed',
      right: '28px',
      // WhatsApp FAB: bottom 28px + height 60px + gap 10px
      bottom: '98px',
      zIndex: 9990,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '0',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {/* Icons panel */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(9,20,50,0.97) 0%, rgba(12,24,48,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05)',
      }}>
        {socials.map((s, i) => (
          <DesktopIcon key={s.name} social={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function DesktopIcon({ social, index }: { social: typeof socials[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={social.href}
      target={social.active ? '_blank' : '_self'}
      rel="noopener noreferrer"
      aria-label={`Follow ScalerHouse on ${social.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row-reverse', // label on left, icon on right
        textDecoration: 'none',
        position: 'relative',
        borderTop: index > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
        background: hovered
          ? `linear-gradient(90deg, ${social.color}18, ${social.color}08)`
          : 'transparent',
        transition: 'background 0.25s ease',
      }}
    >
      {/* Icon column */}
      <div style={{
        width: '50px',
        height: '46px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transform: hovered ? 'translateX(-4px)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <span style={{
          color: hovered ? social.color : (social.active ? '#94a3b8' : '#475569'),
          transition: 'color 0.25s ease, filter 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'scale(1.25) rotateY(-15deg) rotateX(-5deg)' : 'scale(1)',
          filter: hovered && social.active ? `drop-shadow(0 0 10px ${social.color})` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {social.svg}
        </span>
      </div>

      {/* Slide-out label — appears to the left on hover */}
      <div style={{
        maxWidth: hovered ? '110px' : '0',
        opacity: hovered ? 1 : 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        paddingLeft: hovered ? '14px' : '0',
        transition: 'max-width 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease, padding 0.35s ease',
        fontSize: '12px',
        fontWeight: '700',
        color: social.active ? social.color : '#475569',
        letterSpacing: '0.3px',
        textShadow: hovered && social.active ? `0 0 14px ${social.color}80` : 'none',
      }}>
        {social.active ? social.name : `${social.name} soon`}
      </div>

      {/* Left glow accent on hover */}
      {hovered && social.active && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '15%',
          height: '70%',
          width: '2px',
          borderRadius: '2px',
          background: `linear-gradient(180deg, transparent, ${social.color}, transparent)`,
          boxShadow: `0 0 10px ${social.color}`,
        }} />
      )}
    </a>
  );
}

/* ─── MOBILE: horizontal row beside WhatsApp FAB ─── */
function MobileBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      position: 'fixed',
      // WhatsApp FAB: right 28px + width 60px + gap 10px = 98px
      right: '98px',
      bottom: '28px',
      zIndex: 9990,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '8px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(60px)',
      transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {socials.map((s) => (
        <MobileIcon key={s.name} social={s} />
      ))}
    </div>
  );
}

function MobileIcon({ social }: { social: typeof socials[0] }) {
  const [pressed, setPressed] = useState(false);

  return (
    <a
      href={social.href}
      target={social.active ? '_blank' : '_self'}
      rel="noopener noreferrer"
      aria-label={`Follow ScalerHouse on ${social.name}`}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setTimeout(() => setPressed(false), 250)}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        background: pressed && social.active
          ? `radial-gradient(circle, ${social.color}40, ${social.color}10)`
          : 'linear-gradient(135deg, rgba(9,20,50,0.95), rgba(15,30,60,0.9))',
        border: `1.5px solid ${pressed && social.active ? social.color + '80' : 'rgba(0,212,255,0.2)'}`,
        color: social.active ? (pressed ? social.color : '#94a3b8') : '#374151',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: pressed && social.active
          ? `0 0 20px ${social.glow}, 0 4px 16px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.05)',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: pressed ? 'scale(0.88)' : 'scale(1)',
        position: 'relative',
      }}
    >
      {social.svg}
      {/* Active badge dot */}
      {social.active && (
        <span style={{
          position: 'absolute',
          bottom: '1px',
          right: '1px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: social.color,
          border: '1.5px solid rgba(9,20,50,0.9)',
          boxShadow: `0 0 6px ${social.color}`,
        }} />
      )}
    </a>
  );
}
