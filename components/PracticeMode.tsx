'use client';

import React, { useState, useEffect } from 'react';
import { BugType, PracticeExercise, CheckResult, SupportedLanguage } from '@/lib/types';
import { recordBugAttempt } from '@/lib/storage';
import {
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Lightbulb,
  Cpu,
  BarChart3,
  Layers,
  ChevronDown
} from 'lucide-react';

interface PracticeModeProps {
  initialBugType: BugType;
  initialLanguage: SupportedLanguage;
  onGoToDashboard: () => void;
}

const ALL_BUG_TYPES: BugType[] = [
  'off-by-one',
  'null/undefined',
  'type-mismatch',
  'scope',
  'async/promise',
  'infinite-loop',
  'syntax',
  'logic',
  'other'
];

export default function PracticeMode({
  initialBugType,
  initialLanguage,
  onGoToDashboard
}: PracticeModeProps) {
  const [bugType, setBugType] = useState<BugType>(initialBugType || 'off-by-one');
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage || 'javascript');
  const [exercise, setExercise] = useState<PracticeExercise | null>(null);
  const [studentCode, setStudentCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a practice exercise
  const fetchNewExercise = async (targetBugType = bugType, targetLang = language) => {
    setIsGenerating(true);
    setCheckResult(null);
    setHintsRevealed(0);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugType: targetBugType,
          language: targetLang
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to generate drill');
      }

      setExercise(json.data);
      setStudentCode(json.data.buggy_code);
    } catch (err: any) {
      console.error('Error generating exercise:', err);
      setErrorMessage(err.message || 'Unable to generate exercise');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchNewExercise(initialBugType, initialLanguage);
  }, [initialBugType, initialLanguage]);

  // Request progressive hint (max 2)
  const handleRequestHint = () => {
    if (hintsRevealed < 2) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  // Reset code to initial buggy snippet
  const handleResetCode = () => {
    if (exercise) {
      setStudentCode(exercise.buggy_code);
      setCheckResult(null);
    }
  };

  // Submit fix for AI evaluation
  const handleSubmitFix = async () => {
    if (!exercise || !studentCode.trim() || isChecking) return;

    setIsChecking(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/practice/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugType: exercise.bug_type,
          language: exercise.language,
          originalBuggyCode: exercise.buggy_code,
          studentFixedCode: studentCode,
          hintsUsedCount: hintsRevealed,
          exerciseHints: exercise.hints
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to check answer');
      }

      const result: CheckResult = json.data;
      setCheckResult(result);

      // Record in local weakness storage
      recordBugAttempt(exercise.bug_type, result.is_correct);

      // If incorrect and hint was returned by AI, reveal hint if not already revealed
      if (!result.is_correct && hintsRevealed < 2) {
        setHintsRevealed((prev) => Math.min(prev + 1, 2));
      }
    } catch (err: any) {
      console.error('Error verifying answer:', err);
      setErrorMessage(err.message || 'Failed to evaluate answer');
    } finally {
      setIsChecking(false);
    }
  };

  const linesCount = studentCode ? studentCode.split('\n').length : 1;

  return (
    <div data-testid="practice-mode-container" className="space-y-6 animate-in fade-in duration-500">
      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Adaptive Drill:</span>
              <span
                data-testid="practice-target-badge"
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full uppercase badge-${bugType.replace('/', '-')}`}
              >
                {bugType}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Practice Mode: Cement the Mental Model
            </h2>
          </div>
        </div>

        {/* Change Bug Type Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">Drill Type:</span>
            <select
              data-testid="select-practice-bug-type"
              value={bugType}
              onChange={(e) => {
                const newBt = e.target.value as BugType;
                setBugType(newBt);
                fetchNewExercise(newBt, language);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {ALL_BUG_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <button
            data-testid="btn-generate-drill"
            onClick={() => fetchNewExercise(bugType, language)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700 disabled:opacity-50"
            title="Generate a new randomized scenario"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">New Drill</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Loading State during drill synthesis */}
      {isGenerating && (
        <div className="p-12 text-center rounded-2xl border border-cyan-500/30 bg-[#0a0f1d] space-y-3">
          <Cpu className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-mono font-bold text-white">Synthesizing Adaptive Bug Scenario...</h4>
          <p className="text-xs text-slate-400 font-mono">
            Gemini is formulating a novel &quot;{bugType}&quot; challenge with real-world edge cases.
          </p>
        </div>
      )}

      {exercise && !isGenerating && (
        <div className="space-y-6">
          {/* Scenario & Expected Behavior Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 p-5 rounded-2xl bg-[#0b101e] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                <Layers className="w-4 h-4" />
                <span>{exercise.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {exercise.scenario}
              </p>
            </div>

            <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                  Expected Invariant
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {exercise.expected_behavior}
                </p>
              </div>
              <div className="mt-3 text-[11px] font-mono text-slate-500">
                Fix the faulty statement in the editor below.
              </div>
            </div>
          </div>

          {/* Student Editor Box */}
          <div className="rounded-2xl border border-slate-800 bg-[#090d18] overflow-hidden shadow-xl">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200 font-semibold uppercase">
                  Interactive Fix Sandbox ({exercise.language})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span>{linesCount} lines</span>
                <button
                  data-testid="btn-reset-code"
                  onClick={handleResetCode}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  title="Reset to initial buggy snippet"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="relative min-h-[220px]">
              <textarea
                data-testid="practice-editor"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                className="w-full min-h-[220px] p-4 font-mono text-xs sm:text-sm bg-[#060a12] text-slate-100 resize-y focus:outline-none focus:ring-1 focus:ring-amber-500/50 leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Action Bar: Hints & Submit */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border-t border-slate-800">
              {/* Hint Request Controls */}
              <div className="flex items-center gap-2">
                <button
                  data-testid="btn-request-hint"
                  onClick={handleRequestHint}
                  disabled={hintsRevealed >= 2}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
                    hintsRevealed >= 2
                      ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-amber-950/60 text-amber-300 border-amber-700/60 hover:bg-amber-900/60 cursor-pointer'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {hintsRevealed === 0
                      ? 'Request Hint 1'
                      : hintsRevealed === 1
                      ? 'Request Hint 2'
                      : 'Max Hints Used (2/2)'}
                  </span>
                </button>
                <span className="text-[11px] font-mono text-slate-500">
                  {hintsRevealed}/2 Hints Unlocked
                </span>
              </div>

              {/* Submit Fix Button */}
              <button
                data-testid="btn-submit-fix"
                onClick={handleSubmitFix}
                disabled={isChecking || !studentCode.trim()}
                className={`py-2 px-5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                  isChecking || !studentCode.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer'
                }`}
              >
                <Sparkles className={`w-4 h-4 fill-current ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'AI EVALUATING FIX...' : 'SUBMIT FIX FOR VERIFICATION'}</span>
              </button>
            </div>
          </div>

          {/* Progressive Hints Accordion / Cards */}
          {hintsRevealed > 0 && (
            <div className="space-y-2 animate-in fade-in duration-300">
              {hintsRevealed >= 1 && (
                <div
                  data-testid="hint-1-card"
                  className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-mono font-bold text-amber-400">
                      Hint 1: Conceptual Invariant Clue
                    </h5>
                    <p className="text-xs text-amber-200/90 mt-0.5">{exercise.hints[0]}</p>
                  </div>
                </div>
              )}

              {hintsRevealed >= 2 && (
                <div
                  data-testid="hint-2-card"
                  className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3"
                >
                  <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-mono font-bold text-cyan-400">
                      Hint 2: Surgical Target Pointer
                    </h5>
                    <p className="text-xs text-cyan-200/90 mt-0.5">{exercise.hints[1]}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Evaluation Result Feedback Banner */}
          {checkResult && (
            <div
              data-testid="practice-result-banner"
              className={`p-6 rounded-2xl border animate-in zoom-in-95 duration-300 shadow-xl ${
                checkResult.is_correct
                  ? 'bg-gradient-to-r from-emerald-950/50 to-slate-900 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                  : 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 mt-0.5 ${
                      checkResult.is_correct
                        ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400'
                        : 'bg-amber-950 border border-amber-500/60 text-amber-400'
                    }`}
                  >
                    {checkResult.is_correct ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-mono">
                        {checkResult.is_correct
                          ? 'INVARIANT RESTORED: BUG RESOLVED'
                          : 'INVARIANT VIOLATION PERSISTS'}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                        AI Verified
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {checkResult.feedback}
                    </p>
                    {checkResult.explanation && (
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        &gt; {checkResult.explanation}
                      </p>
                    )}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  {checkResult.is_correct ? (
                    <>
                      <button
                        data-testid="btn-next-exercise"
                        onClick={() => fetchNewExercise(bugType, language)}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <span>Next Drill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        data-testid="btn-view-dashboard"
                        onClick={onGoToDashboard}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Profile</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (hintsRevealed < 2) setHintsRevealed((prev) => prev + 1);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      {hintsRevealed < 2 ? 'Unlock Hint' : 'Try Another Edit'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
