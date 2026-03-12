import React from 'react';

/**
 * Global animated background — layered effects:
 * 1. Slow-drifting gradient orbs (cyan, blue, purple)
 * 2. Subtle dot grid overlay
 * 3. Shooting star lines
 * 4. Noise grain texture
 */
export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        /* ── Orbs ── */
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

        /* ── Shooting stars ── */
        @keyframes shoot {
          0%   { transform: translateX(-100%) translateY(0); opacity: 0; }
          5%   { opacity: 1; }
          100% { transform: translateX(110vw) translateY(40px); opacity: 0; }
        }

        /* ── Floating particles ── */
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-120px) scale(0.6); opacity: 0; }
        }

        /* ── Pulse ring ── */
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(2.4);  opacity: 0; }
        }

        /* Global BG orbs */
        .bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .bg-orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: orb-drift-1 18s ease-in-out infinite;
        }
        .bg-orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 30%; right: -80px;
          animation: orb-drift-2 22s ease-in-out infinite;
        }
        .bg-orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          bottom: 10%; left: 20%;
          animation: orb-drift-3 26s ease-in-out infinite;
        }
        .bg-orb-4 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
          top: 60%; right: 25%;
          animation: orb-drift-1 30s ease-in-out infinite reverse;
        }

        /* Grid overlay */
        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* Shooting stars */
        .star-line {
          position: fixed;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent);
          pointer-events: none;
          z-index: 0;
          border-radius: 999px;
        }
        .star-1 { width: 160px; top: 15%; animation: shoot 8s linear 0s  infinite; }
        .star-2 { width: 100px; top: 42%; animation: shoot 12s linear 3s  infinite; }
        .star-3 { width: 200px; top: 68%; animation: shoot 9s  linear 6s  infinite; }
        .star-4 { width: 130px; top: 80%; animation: shoot 15s linear 10s infinite; }

        /* Pulse rings */
        .pulse-ring {
          position: fixed;
          border-radius: 50%;
          border: 1px solid rgba(6,182,212,0.12);
          pointer-events: none;
          z-index: 0;
          animation: pulse-ring 6s ease-out infinite;
          width: 400px; height: 400px;
        }
        .pulse-ring-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .pulse-ring-2 { top: 60%; right: 10%; animation-delay: 2s; }
        .pulse-ring-3 { top: 40%; left: 50%; animation-delay: 4s; }
      `}</style>

      {/* Gradient orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />
      <div className="bg-orb bg-orb-4" aria-hidden="true" />

      {/* Subtle grid */}
      <div className="bg-grid" aria-hidden="true" />

      {/* Shooting stars */}
      <div className="star-line star-1" aria-hidden="true" />
      <div className="star-line star-2" aria-hidden="true" />
      <div className="star-line star-3" aria-hidden="true" />
      <div className="star-line star-4" aria-hidden="true" />

      {/* Pulse rings */}
      <div className="pulse-ring pulse-ring-1" aria-hidden="true" />
      <div className="pulse-ring pulse-ring-2" aria-hidden="true" />
      <div className="pulse-ring pulse-ring-3" aria-hidden="true" />
    </>
  );
}
