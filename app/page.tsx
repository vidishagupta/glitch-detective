'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CodeInputSection from '@/components/CodeInputSection';
import InvestigatingLoader from '@/components/InvestigatingLoader';
import BugAutopsy from '@/components/BugAutopsy';
import PracticeMode from '@/components/PracticeMode';
import WeaknessProfile from '@/components/WeaknessProfile';
import AiArchitectureModal from '@/components/AiArchitectureModal';
import { BugAnalysis, BugType, SupportedLanguage } from '@/lib/types';
import { DEMO_BUGS } from '@/lib/demo-data';
import { seedDemoStatsIfEmpty } from '@/lib/storage';
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
  const [practiceBugType, setPracticeBugType] = useState<BugType>('off-by-one');

  useEffect(() => {
    seedDemoStatsIfEmpty();
  }, []);

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
                  onGoToPractice={() => {
                    setPracticeBugType(analysis.bug_type);
                    setActiveTab('practice');
                  }}
                />
              )}
            </div>
          )}

          {/* Practice Tab (Phase 2) */}
          {activeTab === 'practice' && (
            <PracticeMode
              initialBugType={practiceBugType}
              initialLanguage={language}
              onGoToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {/* Dashboard Tab (Phase 3) */}
          {activeTab === 'dashboard' && (
            <WeaknessProfile
              onStartDrillForBugType={(bt) => {
                setPracticeBugType(bt);
                setActiveTab('practice');
              }}
            />
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
