'use client';

import React from 'react';
import { Terminal, ShieldAlert, Cpu, Sparkles, BarChart3, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'autopsy' | 'practice' | 'dashboard';
  setActiveTab: (tab: 'autopsy' | 'practice' | 'dashboard') => void;
  onOpenAiModal: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenAiModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Terminal className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-mono">
                  GLITCH<span className="text-cyan-400">DETECTIVE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 uppercase">
                  v1.0 AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Root-Cause Diagnostic & Adaptive Training
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              data-testid="nav-autopsy"
              onClick={() => setActiveTab('autopsy')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'autopsy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Bug Autopsy</span>
            </button>

            <button
              data-testid="nav-practice"
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'practice'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Practice Mode</span>
            </button>

            <button
              data-testid="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Weakness Profile</span>
            </button>
          </nav>

          {/* AI Architecture & Hackathon Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              data-testid="btn-how-ai-works"
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-cyan-300 transition-all shadow-sm"
              title="Inspect AI Pipeline Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">How AI Was Used</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
