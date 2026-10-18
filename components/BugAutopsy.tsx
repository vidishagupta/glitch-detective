'use client';

import React, { useState } from 'react';
import { BugAnalysis, SupportedLanguage } from '@/lib/types';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Lightbulb,
  FileCode,
  Flame
} from 'lucide-react';

interface BugAutopsyProps {
  analysis: BugAnalysis;
  originalCode: string;
  language: SupportedLanguage;
  onGoToPractice: () => void;
}

export default function BugAutopsy({
  analysis,
  originalCode,
  language,
  onGoToPractice
}: BugAutopsyProps) {
  const [activeCodeTab, setActiveCodeTab] = useState<'faulty' | 'fixed'>('faulty');
  const [copied, setCopied] = useState(false);

  const handleCopyFixed = async () => {
    try {
      await navigator.clipboard.writeText(analysis.fixed_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  const originalLines = originalCode.split('\n');
  const fixedLines = analysis.fixed_code.split('\n');
  const faultyLines = analysis.line_numbers || [];

  return (
    <section
      data-testid="autopsy-view"
      className="space-y-6 pt-4 animate-in fade-in duration-500"
    >
      {/* Header Banner: Bug Classification & Practice CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a1428] border border-cyan-500/40 shadow-[0_0_25px_rgba(0,242,254,0.1)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950 border border-cyan-400/50 text-cyan-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Autopsy Verdict:</span>
              <span
                data-testid="badge-bug-type"
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase badge-${analysis.bug_type.replace('/', '-')}`}
              >
                {analysis.bug_type}
              </span>
              {analysis.severity && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 uppercase">
                  {analysis.severity}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Incident Deconstruction & Root-Cause
            </h2>
          </div>
        </div>

        {/* CTA to Practice Mode */}
        <button
          data-testid="btn-start-practice"
          onClick={onGoToPractice}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Practice &quot;{analysis.bug_type}&quot; Fixes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Diagnosis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plain English Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-2">
              <Search className="w-4 h-4" />
              <span>In Plain English</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {analysis.plain_english}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Diagnosed for student comprehension</span>
            <span className="text-cyan-400">0% fluff</span>
          </div>
        </div>

        {/* Root Cause Card */}
        <div className="p-5 rounded-2xl bg-[#0f172a]/90 border border-cyan-500/30 flex flex-col justify-between shadow-[0_0_20px_rgba(0,242,254,0.06)]">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase mb-2">
              <Flame className="w-4 h-4" />
              <span>The Deep Root Cause</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {analysis.root_cause}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Mechanics violated under the hood</span>
            <span className="text-amber-400">Core Invariant</span>
          </div>
        </div>
      </div>

      {/* Code Inspector: Highlighted Faulty Lines vs Fixed Code */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d18] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('faulty')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                activeCodeTab === 'faulty'
                  ? 'bg-red-950/80 text-red-300 border border-red-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faulty Source (Line {faultyLines.join(', ')} Highlighted)
            </button>
            <button
              onClick={() => setActiveCodeTab('fixed')}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                activeCodeTab === 'fixed'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Autopsy Fix (Clean Invariant)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="btn-copy-fix"
              onClick={handleCopyFixed}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Fix</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Renderer */}
        <div className="p-4 overflow-x-auto font-mono text-xs sm:text-sm bg-[#060a12] leading-relaxed">
          {activeCodeTab === 'faulty' ? (
            <div className="space-y-0.5">
              {originalLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isFaulty = faultyLines.includes(lineNum);
                return (
                  <div
                    key={lineNum}
                    className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors ${
                      isFaulty
                        ? 'bg-red-950/40 border-l-4 border-red-500 text-red-200'
                        : 'text-slate-300 hover:bg-slate-900/40'
                    }`}
                  >
                    <span
                      className={`w-7 text-right select-none text-[11px] font-mono shrink-0 ${
                        isFaulty ? 'text-red-400 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line || ' '}</span>
                    {isFaulty && (
                      <span
                        data-testid="autopsy-line-highlight"
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/60 shrink-0"
                      >
                        Bug Origin
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-0.5">
              {fixedLines.map((line, idx) => {
                const lineNum = idx + 1;
                return (
                  <div
                    key={lineNum}
                    className="flex items-start gap-4 px-2 py-0.5 rounded text-emerald-200/90 hover:bg-emerald-950/20"
                  >
                    <span className="w-7 text-right select-none text-[11px] font-mono text-emerald-600 shrink-0">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line || ' '}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Walkthrough */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 uppercase">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Step-by-Step Execution Walkthrough</span>
        </div>

        <div className="space-y-2">
          {analysis.walkthrough.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention Tip Callout */}
      {analysis.prevention_tip && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">
              Forensic Rule of Thumb (Never Make This Mistake Again)
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 font-sans">
              {analysis.prevention_tip}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
