'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/lib/types';
import { DEMO_BUGS } from '@/lib/demo-data';
import { Play, Sparkles, Trash2, Code2, AlertTriangle, ChevronDown } from 'lucide-react';

interface CodeInputSectionProps {
  code: string;
  setCode: (code: string) => void;
  errorMessage: string;
  setErrorMessage: (err: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onSelectDemoBugById: (id: string) => void;
}

export default function CodeInputSection({
  code,
  setCode,
  errorMessage,
  setErrorMessage,
  language,
  setLanguage,
  onAnalyze,
  isLoading,
  onSelectDemoBugById
}: CodeInputSectionProps) {
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  const linesCount = code ? code.split('\n').length : 1;

  const handleClear = () => {
    setCode('');
    setErrorMessage('');
  };

  return (
    <section id="code-input-section" className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Target Language:</span>
            <select
              data-testid="select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="javascript">JavaScript (Node/Browser)</option>
              <option value="python">Python 3</option>
              <option value="java">Java (JVM)</option>
              <option value="cpp">C++ (GCC/Clang)</option>
            </select>
          </div>
        </div>

        {/* Demo Bugs Selector & Reset */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              data-testid="btn-demo-bug"
              onClick={() => setShowDemoDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/80 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Demo Bug</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>

            {showDemoDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-2xl p-2 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  Select a Preloaded Hackathon Bug
                </div>
                {DEMO_BUGS.map((demo) => (
                  <button
                    key={demo.id}
                    data-testid={`demo-option-${demo.id}`}
                    onClick={() => {
                      onSelectDemoBugById(demo.id);
                      setShowDemoDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-cyan-950/60 hover:border-cyan-800/50 border border-transparent transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-slate-200 group-hover:text-cyan-300">
                      <span>{demo.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {demo.bugType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{demo.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            data-testid="btn-clear"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            title="Clear Inputs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* 1-Click Quick Demo Bug Pills for Instant Hackathon Testing */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-[11px] font-mono text-slate-400">1-Click Demo Bugs:</span>
        {DEMO_BUGS.map((demo) => (
          <button
            key={demo.id}
            data-testid={`btn-quick-demo-${demo.id}`}
            onClick={() => onSelectDemoBugById(demo.id)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{demo.title.split(':')[0]}: {demo.bugType}</span>
          </button>
        ))}
      </div>

      {/* Editor & Error Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Input */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-[#0a0f1d] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-200 font-semibold uppercase">{language} Source Code</span>
            </div>
            <span>{linesCount} {linesCount === 1 ? 'line' : 'lines'}</span>
          </div>

          <div className="relative flex-1 min-h-[220px]">
            <textarea
              data-testid="input-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your buggy ${language} code here...\nfunction example() {\n  // Buggy logic here\n}`}
              className="w-full h-full min-h-[220px] p-4 font-mono text-xs sm:text-sm bg-[#080d1a] text-slate-100 resize-y focus:outline-none focus:ring-1 focus:ring-cyan-500/50 leading-relaxed placeholder:text-slate-600"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Error Message Input + Submit CTA */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0a0f1d] overflow-hidden flex-1 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200 font-semibold">Error Message / Terminal Output</span>
            </div>

            <textarea
              data-testid="input-error"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="e.g. TypeError: Cannot read property of undefined at line 4 or unexpected output..."
              className="w-full flex-1 min-h-[140px] p-3 font-mono text-xs bg-[#080d1a] text-amber-200/90 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-slate-600 leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Big Action Button */}
          <button
            data-testid="btn-analyze"
            onClick={onAnalyze}
            disabled={isLoading || !code.trim()}
            className={`w-full py-3.5 px-4 rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isLoading || !code.trim()
                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(0,242,254,0.4)] cursor-pointer'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'ANALYZING INCIDENT...' : 'RUN FORENSIC AUTOPSY'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
