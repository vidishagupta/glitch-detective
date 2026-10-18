'use client';

import React from 'react';
import { X, Cpu, ShieldCheck, Terminal, Layers, RefreshCw, Sparkles } from 'lucide-react';

interface AiArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiArchitectureModal({ isOpen, onClose }: AiArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        data-testid="ai-architecture-modal"
        className="relative w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-[#0a0f1d] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,242,254,0.2)] max-h-[90vh] overflow-y-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono">
                AI Pipeline Architecture & Verification
              </h3>
              <p className="text-xs text-cyan-300/80">
                GLITCHATHON Evaluation Transparency Panel
              </p>
            </div>
          </div>

          <button
            data-testid="btn-close-ai-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Prompts Pipeline Architecture */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Three Specialized AI Prompt Pipelines</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400">PROMPT 1</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">Autopsy</span>
              </div>
              <h5 className="text-xs font-bold text-slate-100">Root-Cause Analysis</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Deconstructs buggy code, isolates faulty line index, and extracts the core invariant failure.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-400">PROMPT 2</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Generate</span>
              </div>
              <h5 className="text-xs font-bold text-slate-100">Adaptive Practice Synthesis</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Generates a completely novel exercise sharing the identical bug taxonomy archetype.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-400">PROMPT 3</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">Check</span>
              </div>
              <h5 className="text-xs font-bold text-slate-100">Evaluator & Hint Oracle</h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                Verifies student submission, provides surgical feedback, and conditionally unlocks progressive hints.
              </p>
            </div>
          </div>
        </div>

        {/* Schema Enforcement & Resilience */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Strict JSON Schema Validation & Auto-Retry Loop</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All AI responses are forced into strict JSON MIME types (<code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded font-mono">application/json</code>) with typed schemas. If a raw stream contains extraneous syntax or formatting anomalies, the server executes an automatic zero-temperature corrective retry prompt before returning.
          </p>
        </div>

        {/* Privacy & Key Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Key Leakage</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              API keys are sealed strictly in server-side Next.js route handlers (<code className="text-slate-300 font-mono">.env.local</code>). No keys or sensitive credentials ever touch the browser client bundle.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-mono font-semibold mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Local Weakness Storage</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Weakness tracking runs entirely in student browser localStorage. Zero tracking, zero login wall, instant frictionless hackathon usage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            data-testid="btn-ack-close-ai-modal"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
