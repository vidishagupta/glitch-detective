'use client';

import React from 'react';
import { Bug, Search, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onScrollToEditor: () => void;
  onSelectDemoBug: () => void;
}

export default function Hero({ onScrollToEditor, onSelectDemoBug }: HeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0b101d] via-[#080c14] to-[#080c14] py-10 sm:py-14">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Glow orb */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>GLITCHATHON 2026 // BUILD WITH AI TRACK</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Don&apos;t just patch code.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Autopsy the glitch.
            </span>
          </h1>

          {/* Tagline & Problem */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Students often copy-paste AI fixes without understanding the underlying failure.
            <span className="text-cyan-300 font-medium"> Glitch Detective</span> performs a surgical root-cause autopsy on your crash, isolates the exact invariant that broke, and immediately drills you on custom exercises so the bug never catches you again.
          </p>

          {/* Who it helps 3-pillar banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>ROOT CAUSE AUTOPSY</span>
              </div>
              <p className="text-xs text-slate-400">
                Uncovers the exact mechanical breakdown under the hood, not just a superficial bandage.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVE RETESTING</span>
              </div>
              <p className="text-xs text-slate-400">
                Immediately spins up a fresh scenario with the identical bug archetype to test retention.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WEAKNESS PROFILE</span>
              </div>
              <p className="text-xs text-slate-400">
                Maps your personal error tendencies to guide targeted algorithmic improvement.
              </p>
            </div>
          </div>

          {/* Quick CTA row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              data-testid="hero-btn-start"
              onClick={onScrollToEditor}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all font-mono font-semibold flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              <span>Investigate Your Bug</span>
            </button>

            <button
              data-testid="hero-btn-demo"
              onClick={onSelectDemoBug}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-slate-300 bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all font-mono flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Load 1-Click Demo Bug</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
