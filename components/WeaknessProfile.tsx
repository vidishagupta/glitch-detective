'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { computeWeaknessStats, getWeakestBugType, seedDemoStatsIfEmpty } from '@/lib/storage';
import { BugType, WeaknessStat } from '@/lib/types';
import {
  ShieldAlert,
  Sparkles,
  RotateCcw,
  BarChart3,
  Radar as RadarIcon,
  Award,
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface WeaknessProfileProps {
  onStartDrillForBugType: (bugType: BugType) => void;
}

export default function WeaknessProfile({ onStartDrillForBugType }: WeaknessProfileProps) {
  const [stats, setStats] = useState<WeaknessStat[]>([]);
  const [weakest, setWeakest] = useState<{ bugType: BugType; accuracyRate: number; attempts: number } | null>(null);
  const [chartView, setChartView] = useState<'radar' | 'bar'>('radar');
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    const computed = computeWeaknessStats();
    setStats(computed);
    const weak = getWeakestBugType();
    setWeakest(weak);
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, []);

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('glitch_detective_attempts_v1');
      loadData();
    }
  };

  const handleLoadDemoBenchmarks = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('glitch_detective_attempts_v1');
      seedDemoStatsIfEmpty();
      loadData();
    }
  };

  const totalAttempts = stats.reduce((acc, s) => acc + s.totalAttempts, 0);
  const totalSolved = stats.reduce((acc, s) => acc + s.solved, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0;

  // Find strongest bug type
  const attemptedStats = stats.filter((s) => s.totalAttempts > 0);
  const strongest = attemptedStats.length > 0
    ? [...attemptedStats].sort((a, b) => b.accuracyRate - a.accuracyRate)[0]
    : null;

  // Prepare data for Recharts
  const radarData = stats.map((s) => ({
    category: s.bugType,
    Accuracy: s.accuracyRate,
    Attempts: s.totalAttempts * 10 // scaled for visibility
  }));

  const barData = stats.map((s) => ({
    name: s.bugType,
    Solved: s.solved,
    Failed: s.totalAttempts - s.solved,
    Attempts: s.totalAttempts
  }));

  const recommendedBugType: BugType = weakest?.bugType || 'off-by-one';

  // Detective title based on solved count
  const getDetectiveTitle = (solved: number) => {
    if (solved >= 10) return 'Chief Forensics Inspector';
    if (solved >= 5) return 'Senior Bug Detective';
    if (solved >= 2) return 'Junior Incident Responder';
    return 'Forensic Trainee';
  };

  if (!isMounted) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs">
        Loading Weakness Profile...
      </div>
    );
  }

  return (
    <div data-testid="dashboard-container" className="space-y-6 animate-in fade-in duration-500">
      {/* Top Banner & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Diagnostic Analytics:</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase">
                {getDetectiveTitle(totalSolved)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Weakness Profile & Skill Radar
            </h2>
          </div>
        </div>

        {/* Data Reset & Benchmarks */}
        <div className="flex items-center gap-2">
          <button
            data-testid="btn-load-demo-benchmarks"
            onClick={handleLoadDemoBenchmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Load Hackathon Sample Benchmarks"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Load Sample Benchmarks</span>
          </button>

          <button
            data-testid="btn-reset-stats"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
            title="Reset All Local Metrics"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Total Drills</span>
            <p data-testid="stat-total-attempts" className="text-2xl font-bold font-mono text-white mt-1">
              {totalAttempts}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Overall Accuracy</span>
            <p data-testid="stat-accuracy-rate" className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {overallAccuracy}%
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Top Mastery</span>
            <p className="text-sm font-bold font-mono text-cyan-300 mt-1 truncate max-w-[130px]">
              {strongest ? strongest.bugType : 'None yet'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Weakest Area</span>
            <p className="text-sm font-bold font-mono text-red-400 mt-1 truncate max-w-[130px]">
              {weakest ? weakest.bugType : 'Balanced'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Weakest Bug Type Featured Card + Recommended Next Practice Action */}
      <div
        data-testid="card-weakest-bug"
        className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-[#150a18] border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-500/60 flex items-center justify-center text-red-400 shrink-0 mt-1">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-red-400">
                CRITICAL VULNERABILITY DETECTED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800">
                High Failure Rate
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              Archetype: &quot;{recommendedBugType}&quot;
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              {weakest
                ? `You have attempted this bug pattern ${weakest.attempts} times with an accuracy of only ${weakest.accuracyRate}%. AI recommends a targeted reinforcement drill to recalibrate your mental model.`
                : 'No acute vulnerability identified yet. Practice various bug types to establish your forensic baseline.'}
            </p>
          </div>
        </div>

        {/* Action Button: Recommended Next Practice */}
        <button
          data-testid="btn-recommended-practice"
          onClick={() => onStartDrillForBugType(recommendedBugType)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Recommended Next Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Charts Section: Radar & Bar Charts */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d18] p-5 sm:p-6 shadow-xl space-y-4">
        {/* Chart View Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Diagnostic Visualization
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setChartView('radar')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-all ${
                chartView === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RadarIcon className="w-3.5 h-3.5" />
              <span>Skill Radar</span>
            </button>

            <button
              onClick={() => setChartView('bar')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-all ${
                chartView === 'bar'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Attempts vs Solved</span>
            </button>
          </div>
        </div>

        {/* Render Chosen Chart */}
        <div className="w-full h-80 pt-2">
          {chartView === 'radar' ? (
            <div data-testid="chart-radar" className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis
                    dataKey="category"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#334155"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar
                    name="Mastery Accuracy (%)"
                    dataKey="Accuracy"
                    stroke="#00f2fe"
                    fill="#00f2fe"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0f1d',
                      borderColor: '#00f2fe',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div data-testid="chart-bar" className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0f1d',
                      borderColor: '#a855f7',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }} />
                  <Bar dataKey="Solved" fill="#10b981" radius={[4, 4, 0, 0]} name="Solved Drills" />
                  <Bar dataKey="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed Drills" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Bug Category Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#090d18] overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-200 uppercase">
            Taxonomy Breakdown & Accuracy Index
          </span>
          <span className="text-[11px] font-mono text-slate-400">9 Bug Archetypes Tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Bug Archetype</th>
                <th className="py-2.5 px-4">Attempts</th>
                <th className="py-2.5 px-4">Solved</th>
                <th className="py-2.5 px-4">Success Rate</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats.map((s) => (
                <tr key={s.bugType} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold badge-${s.bugType.replace('/', '-')}`}>
                      {s.bugType}
                    </span>
                  </td>
                  <td className="py-3 px-4">{s.totalAttempts}</td>
                  <td className="py-3 px-4 text-emerald-400">{s.solved}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.accuracyRate >= 70
                              ? 'bg-emerald-400'
                              : s.accuracyRate >= 40
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${s.accuracyRate}%` }}
                        />
                      </div>
                      <span className="text-[11px]">{s.accuracyRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onStartDrillForBugType(s.bugType)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 text-[11px] transition-all cursor-pointer"
                    >
                      Practice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
