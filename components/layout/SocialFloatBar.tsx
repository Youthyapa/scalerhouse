// components/layout/SocialFloatBar.tsx
'use client';
import { useState, useEffect } from 'react';

const socials = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/scalerhouse',
    color: '#1877F2',
    glow: 'rgba(24,119,242,0.55)',
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
    glow: 'rgba(10,102,194,0.55)',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    color: '#E1306C',
    glow: 'rgba(225,48,108,0.55)',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: '#',
    color: '#FF0000',
    glow: 'rgba(255,0,0,0.55)',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    color: '#000000',
    glow: 'rgba(120,120,120,0.55)',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function SocialFloatBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        top: '50%',
        transform: `translateY(-50%) translateX(${visible ? '0' : '-100%'})`,
        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0',
      }}
    >
      {/* Follow Us Label */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15,31,61,0.95), rgba(29,78,216,0.85))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,212,255,0.25)',
          borderLeft: 'none',
          borderBottom: 'none',
          borderRadius: '0 10px 0 0',
          padding: '7px 14px 7px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '4px 0 20px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: '700',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #00d4ff, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}
        >
          Follow Us
        </span>
        <span style={{ fontSize: '10px' }}>✦</span>
      </div>

      {/* Icons Container */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(9,20,45,0.96) 0%, rgba(15,31,61,0.97) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,212,255,0.18)',
          borderLeft: 'none',
          borderTop: 'none',
          borderRadius: '0 0 14px 0',
          overflow: 'hidden',
          boxShadow: '6px 0 32px rgba(0,0,0,0.4), 4px 0 20px rgba(0,212,255,0.08)',
          padding: '6px 0',
        }}
      >
        {socials.map((s, i) => (
          <SocialIcon key={s.name} social={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ social, index }: { social: typeof socials[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isPlaceholder = social.href === '#';

  return (
    <a
      href={social.href}
      target={isPlaceholder ? '_self' : '_blank'}
      rel="noopener noreferrer"
      aria-label={`Follow us on ${social.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        padding: '0',
        textDecoration: 'none',
        overflow: 'hidden',
        position: 'relative',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: `transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      {/* Icon pill */}
      <div
        style={{
          width: '46px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: hovered
            ? `linear-gradient(135deg, ${social.color}30, ${social.color}18)`
            : 'transparent',
          transition: 'background 0.25s ease',
          // 3D depth effect
          boxShadow: hovered
            ? `inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px ${social.glow}`
            : 'none',
        }}
      >
        {/* Glowing dot indicator */}
        <div
          style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: isPlaceholder ? 'rgba(100,116,139,0.5)' : social.color,
            boxShadow: hovered && !isPlaceholder ? `0 0 8px ${social.color}` : 'none',
            transition: 'box-shadow 0.25s ease',
          }}
        />
        {/* Icon */}
        <div
          style={{
            color: hovered ? social.color : (isPlaceholder ? '#64748b' : '#94a3b8'),
            transition: 'color 0.25s ease, transform 0.3s ease, filter 0.3s ease',
            transform: hovered ? 'scale(1.2) rotateY(10deg)' : 'scale(1) rotateY(0deg)',
            filter: hovered && !isPlaceholder ? `drop-shadow(0 0 8px ${social.color})` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Simulate 3D perspective
            perspective: '200px',
          }}
        >
          {social.svg}
        </div>
      </div>

      {/* Hover label slide-in */}
      <div
        style={{
          maxWidth: hovered ? '90px' : '0px',
          opacity: hovered ? 1 : 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'max-width 0.3s ease, opacity 0.2s ease',
          paddingRight: hovered ? '12px' : '0',
          fontSize: '12px',
          fontWeight: '600',
          color: isPlaceholder ? '#64748b' : social.color,
          letterSpacing: '0.3px',
          textShadow: hovered && !isPlaceholder ? `0 0 12px ${social.color}60` : 'none',
        }}
      >
        {isPlaceholder ? `${social.name} soon` : social.name}
      </div>

      {/* Bottom separator */}
      {index < socials.length - 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10px',
            right: '0',
            height: '1px',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
      )}
    </a>
  );
}
