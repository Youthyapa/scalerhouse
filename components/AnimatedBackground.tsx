import React from 'react';

/**
 * Global premium animated background — layered effects:
 * 1. Slow-drifting gradient orbs (cyan, blue, purple)
 * 2. Subtle dot grid overlay
 * 3. Rotating glow rings (like the founder section)
 * 4. Spinning conic gradient halos
 * 5. Breathing aurora blobs
 */
export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        /* ── Orb drift ── */
        @keyframes orb-drift-1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(80px, -60px) scale(1.1); }
          66%  { transform: translate(-40px, 80px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-2 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(-90px, 50px) scale(1.15); }
          75%  { transform: translate(60px, -90px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orb-drift-3 {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(40px, 70px) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* ── Rotate glow ring ── */
        @keyframes spin-ring {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-ring-rev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        /* ── Breathe ── */
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.12); }
        }

        /* ── Aurora shimmer ── */
        @keyframes aurora {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Pulse expand ── */
        @keyframes pulse-out {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }

        /* ─────────── Orbs ─────────── */
        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .bg-orb-1 {
          width: 640px; height: 640px;
          background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
          top: -120px; left: -100px;
          animation: orb-drift-1 20s ease-in-out infinite;
        }
        .bg-orb-2 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 35%; right: -100px;
          animation: orb-drift-2 24s ease-in-out infinite;
        }
        .bg-orb-3 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          bottom: 8%; left: 18%;
          animation: orb-drift-3 28s ease-in-out infinite;
        }
        .bg-orb-4 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
          top: 65%; right: 22%;
          animation: orb-drift-1 32s ease-in-out infinite reverse;
        }

        /* ─────────── Grid ─────────── */
        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%);
        }

        /* ─────────── Rotating glow rings ─────────── */
        .glow-ring {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          top: 50%; left: 50%;
        }

        /* Ring 1 – top-left corner, large, slow */
        .glow-ring-1 {
          width: 560px; height: 560px;
          top: 8%; left: 4%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(6,182,212,0.30) 60deg,
            transparent 120deg
          );
          filter: blur(24px);
          animation: spin-ring 12s linear infinite;
        }

        /* Ring 2 – right side, medium, reverse */
        .glow-ring-2 {
          width: 380px; height: 380px;
          top: 45%; right: 2%; left: auto;
          transform: translate(50%, -50%);
          background: conic-gradient(
            from 90deg,
            transparent 0deg,
            rgba(99,102,241,0.28) 70deg,
            transparent 140deg
          );
          filter: blur(20px);
          animation: spin-ring-rev 9s linear infinite;
        }

        /* Ring 3 – bottom-left, smaller */
        .glow-ring-3 {
          width: 300px; height: 300px;
          bottom: 12%; left: 6%; top: auto;
          transform: translate(-50%, 50%);
          background: conic-gradient(
            from 180deg,
            transparent 0deg,
            rgba(168,85,247,0.25) 80deg,
            transparent 160deg
          );
          filter: blur(18px);
          animation: spin-ring 16s linear infinite;
        }

        /* Ring 4 – center-right floating  */
        .glow-ring-4 {
          width: 240px; height: 240px;
          top: 25%; right: 28%; left: auto;
          transform: translate(50%, -50%);
          background: conic-gradient(
            from 270deg,
            transparent 0deg,
            rgba(34,211,238,0.22) 90deg,
            transparent 180deg
          );
          filter: blur(14px);
          animation: spin-ring-rev 7s linear infinite;
        }

        /* ─────────── Aurora bands ─────────── */
        .aurora-band {
          position: fixed;
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
          background-size: 400% 400%;
          animation: aurora 18s ease infinite;
        }
        .aurora-top {
          width: 100%; height: 180px;
          top: 0; left: 0;
          background: linear-gradient(90deg,
            rgba(6,182,212,0.08),
            rgba(99,102,241,0.06),
            rgba(59,130,246,0.08),
            rgba(6,182,212,0.04)
          );
        }
        .aurora-bot {
          width: 100%; height: 180px;
          bottom: 0; left: 0;
          background: linear-gradient(90deg,
            rgba(168,85,247,0.06),
            rgba(6,182,212,0.08),
            rgba(99,102,241,0.06),
            rgba(168,85,247,0.04)
          );
          animation-delay: -9s;
        }

        /* ─────────── Breathe spot ─────────── */
        .breathe-spot {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(40px);
          animation: breathe 7s ease-in-out infinite;
        }
        .breathe-spot-1 {
          width: 200px; height: 200px;
          background: rgba(6,182,212,0.12);
          top: 50%; left: 50%;
          animation-delay: 0s;
        }
        .breathe-spot-2 {
          width: 160px; height: 160px;
          background: rgba(99,102,241,0.10);
          top: 20%; right: 40%; left: auto;
          animation-delay: -3.5s;
        }

        /* ─────────── Expand pulse ring ─────────── */
        .expand-ring {
          position: fixed;
          border-radius: 50%;
          border: 1px solid rgba(6,182,212,0.15);
          pointer-events: none;
          z-index: 0;
          width: 320px; height: 320px;
          animation: pulse-out 7s ease-out infinite;
        }
        .expand-ring-1 { top: 18%; left: 12%; animation-delay: 0s; }
        .expand-ring-2 { top: 65%; right: 10%; left: auto; animation-delay: 2.5s; border-color: rgba(99,102,241,0.15); }
        .expand-ring-3 { top: 40%; left: 48%; animation-delay: 5s; border-color: rgba(168,85,247,0.12); }
      `}</style>

      {/* Gradient orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />
      <div className="bg-orb bg-orb-4" aria-hidden="true" />

      {/* Grid */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Rotating glow rings — like the founder section effect */}
      <div className="glow-ring glow-ring-1" aria-hidden="true" />
      <div className="glow-ring glow-ring-2" aria-hidden="true" />
      <div className="glow-ring glow-ring-3" aria-hidden="true" />
      <div className="glow-ring glow-ring-4" aria-hidden="true" />

      {/* Aurora shimmer bands at top & bottom */}
      <div className="aurora-band aurora-top" aria-hidden="true" />
      <div className="aurora-band aurora-bot" aria-hidden="true" />

      {/* Breathing glow spots */}
      <div className="breathe-spot breathe-spot-1" aria-hidden="true" />
      <div className="breathe-spot breathe-spot-2" aria-hidden="true" />

      {/* Expanding pulse rings */}
      <div className="expand-ring expand-ring-1" aria-hidden="true" />
      <div className="expand-ring expand-ring-2" aria-hidden="true" />
      <div className="expand-ring expand-ring-3" aria-hidden="true" />
    </>
  );
}
