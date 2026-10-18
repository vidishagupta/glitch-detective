'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CodeInputSection from '@/components/CodeInputSection';
import InvestigatingLoader from '@/components/InvestigatingLoader';
import BugAutopsy from '@/components/BugAutopsy';
import AiArchitectureModal from '@/components/AiArchitectureModal';
import { BugAnalysis, SupportedLanguage } from '@/lib/types';
import { DEMO_BUGS } from '@/lib/demo-data';
import { AlertCircle, Sparkles, Terminal } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'autopsy' | 'practice' | 'dashboard'>('autopsy');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState(DEMO_BUGS[0].code);
  const [errorMessage, setErrorMessage] = useState(DEMO_BUGS[0].errorMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<BugAnalysis | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Load a demo bug by ID
  const handleSelectDemoBugById = (id: string) => {
    const found = DEMO_BUGS.find((b) => b.id === id);
    if (found) {
      setCode(found.code);
      setErrorMessage(found.errorMessage);
      setLanguage(found.language);
      setAnalysis(found.precomputedAnalysis);
      setApiError(null);
      setActiveTab('autopsy');
    }
  };

  // One-click demo loader from Hero
  const handleHeroDemoBug = () => {
    handleSelectDemoBugById('js-off-by-one');
    const el = document.getElementById('code-input-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToEditor = () => {
    const el = document.getElementById('code-input-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Execute Analysis via Server-side API
  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setApiError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          errorMessage,
          language
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete analysis');
      }

      setAnalysis(json.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setApiError(err.message || 'Analysis could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <Hero
          onScrollToEditor={handleScrollToEditor}
          onSelectDemoBug={handleHeroDemoBug}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* API Error Callout */}
          {apiError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold font-mono">Forensic Pipeline Notice</p>
                <p className="text-xs text-red-300">{apiError}</p>
              </div>
            </div>
          )}

          {/* Autopsy Tab (Phase 1) */}
          {activeTab === 'autopsy' && (
            <div className="space-y-6">
              <CodeInputSection
                code={code}
                setCode={setCode}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                language={language}
                setLanguage={setLanguage}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                onSelectDemoBugById={handleSelectDemoBugById}
              />

              {isLoading && <InvestigatingLoader />}

              {analysis && !isLoading && (
                <BugAutopsy
                  analysis={analysis}
                  originalCode={code}
                  language={language}
                  onGoToPractice={() => setActiveTab('practice')}
                />
              )}
            </div>
          )}

          {/* Practice Tab Placeholder (Prepared for Phase 2) */}
          {activeTab === 'practice' && (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">
                Practice Mode Engine Ready
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Phase 1 complete! Click &quot;Bug Autopsy&quot; to test the analysis engine, or proceed to Phase 2 to unlock adaptive dynamic drills and the AI hint oracle.
              </p>
              <button
                onClick={() => setActiveTab('autopsy')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all"
              >
                Return to Autopsy View
              </button>
            </div>
          )}

          {/* Dashboard Tab Placeholder (Prepared for Phase 3) */}
          {activeTab === 'dashboard' && (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-[#0a0f1d] space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">
                Weakness Profile Dashboard
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Weakness metrics dashboard with Recharts radar and accuracy breakdowns will be linked in Phase 3.
              </p>
              <button
                onClick={() => setActiveTab('autopsy')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all"
              >
                Return to Autopsy View
              </button>
            </div>
          )}
        </div>
      </main>

      {/* AI Pipeline Architecture Modal */}
      <AiArchitectureModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a12] py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            GLITCH DETECTIVE © 2026 // GLITCHATHON BUILD WITH AI
          </p>
          <p className="text-slate-400">
            Powered by Google Gemini 2.5 Flash &bull; Next.js 16 &bull; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
