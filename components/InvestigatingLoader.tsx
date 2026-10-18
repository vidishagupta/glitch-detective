'use client';

import React, { useState, useEffect } from 'react';
import { Search, Terminal, Cpu, ShieldAlert } from 'lucide-react';

const ANALYSIS_PHASES = [
  'Parsing abstract syntax tree (AST)...',
  'Tracing runtime execution invariants...',
  'Isolating memory & boundary discrepancies...',
  'Querying Gemini AI forensic model...',
  'Synthesizing root-cause autopsy report...'
];

export default function InvestigatingLoader() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % ANALYSIS_PHASES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-testid="investigating-loader"
      className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#0a0f1d] p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(0,242,254,0.15)] my-6"
    >
      {/* Background scanline sweep */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      {/* Decorative radar circle */}
      <div className="relative mx-auto mb-6 flex items-center justify-center w-28 h-28 rounded-full border border-cyan-500/30 bg-cyan-950/20">
        {/* Outer pulse */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
        
        {/* Rotating radar needle */}
        <div className="absolute inset-1 rounded-full border border-cyan-500/20">
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-right radar-sweep absolute top-1/2 left-0" />
        </div>

        {/* Center icon */}
        <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 border border-cyan-400/50 text-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
          <Search className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="space-y-3 relative z-10 max-w-md mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase">
          <Cpu className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>INVESTIGATING CODE FAILURE...</span>
        </div>

        <h3 className="text-xl font-bold text-white font-mono tracking-tight">
          Forensic Code Autopsy in Progress
        </h3>

        <p className="text-sm text-cyan-300/80 font-mono h-6 transition-all duration-300">
          &gt; {ANALYSIS_PHASES[phaseIndex]}
        </p>

        {/* Mini progress ticks */}
        <div className="flex justify-center gap-1.5 pt-2">
          {ANALYSIS_PHASES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx <= phaseIndex
                  ? 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.6)]'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
