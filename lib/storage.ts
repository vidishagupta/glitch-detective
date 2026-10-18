import { BugType, WeaknessStat } from './types';

const STORAGE_KEY = 'glitch_detective_attempts_v1';

export interface BugAttempt {
  id: string;
  bugType: BugType;
  isCorrect: boolean;
  timestamp: number;
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

export function getStoredAttempts(): BugAttempt[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read attempts from localStorage:', e);
    return [];
  }
}

export function recordBugAttempt(bugType: BugType, isCorrect: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAttempts();
    const newAttempt: BugAttempt = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bugType,
      isCorrect,
      timestamp: Date.now()
    };
    const updated = [newAttempt, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store attempt in localStorage:', e);
  }
}

export function computeWeaknessStats(): WeaknessStat[] {
  const attempts = getStoredAttempts();
  const statsMap: Record<BugType, { total: number; solved: number; lastTime: number }> = {
    'off-by-one': { total: 0, solved: 0, lastTime: 0 },
    'null/undefined': { total: 0, solved: 0, lastTime: 0 },
    'type-mismatch': { total: 0, solved: 0, lastTime: 0 },
    'scope': { total: 0, solved: 0, lastTime: 0 },
    'async/promise': { total: 0, solved: 0, lastTime: 0 },
    'infinite-loop': { total: 0, solved: 0, lastTime: 0 },
    'syntax': { total: 0, solved: 0, lastTime: 0 },
    'logic': { total: 0, solved: 0, lastTime: 0 },
    'other': { total: 0, solved: 0, lastTime: 0 }
  };

  attempts.forEach((a) => {
    if (statsMap[a.bugType]) {
      statsMap[a.bugType].total += 1;
      if (a.isCorrect) statsMap[a.bugType].solved += 1;
      if (a.timestamp > statsMap[a.bugType].lastTime) {
        statsMap[a.bugType].lastTime = a.timestamp;
      }
    }
  });

  return ALL_BUG_TYPES.map((bt) => {
    const s = statsMap[bt];
    const accuracy = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
    return {
      bugType: bt,
      totalAttempts: s.total,
      solved: s.solved,
      accuracyRate: accuracy,
      lastPracticed: s.lastTime > 0 ? new Date(s.lastTime).toLocaleDateString() : undefined
    };
  });
}

export function getWeakestBugType(): { bugType: BugType; accuracyRate: number; attempts: number } | null {
  const stats = computeWeaknessStats();
  const attempted = stats.filter((s) => s.totalAttempts > 0);

  if (attempted.length === 0) return null;

  // Sort by lowest accuracy first, then by highest total attempts
  attempted.sort((a, b) => {
    if (a.accuracyRate === b.accuracyRate) {
      return b.totalAttempts - a.totalAttempts;
    }
    return a.accuracyRate - b.accuracyRate;
  });

  return {
    bugType: attempted[0].bugType,
    accuracyRate: attempted[0].accuracyRate,
    attempts: attempted[0].totalAttempts
  };
}

export function seedDemoStatsIfEmpty(): void {
  if (typeof window === 'undefined') return;
  const attempts = getStoredAttempts();
  if (attempts.length === 0) {
    // Seed sample realistic student data so dashboard is immediately rich and visual
    const demoAttempts: BugAttempt[] = [
      { id: '1', bugType: 'off-by-one', isCorrect: false, timestamp: Date.now() - 3600000 * 5 },
      { id: '2', bugType: 'off-by-one', isCorrect: true, timestamp: Date.now() - 3600000 * 4 },
      { id: '3', bugType: 'off-by-one', isCorrect: false, timestamp: Date.now() - 3600000 * 3 },
      { id: '4', bugType: 'null/undefined', isCorrect: true, timestamp: Date.now() - 3600000 * 2 },
      { id: '5', bugType: 'null/undefined', isCorrect: true, timestamp: Date.now() - 3600000 * 1 },
      { id: '6', bugType: 'type-mismatch', isCorrect: true, timestamp: Date.now() - 1800000 },
      { id: '7', bugType: 'async/promise', isCorrect: false, timestamp: Date.now() - 900000 },
      { id: '8', bugType: 'async/promise', isCorrect: false, timestamp: Date.now() - 400000 }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoAttempts));
  }
}
