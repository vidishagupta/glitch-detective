export type BugType =
  | 'off-by-one'
  | 'null/undefined'
  | 'type-mismatch'
  | 'scope'
  | 'async/promise'
  | 'infinite-loop'
  | 'syntax'
  | 'logic'
  | 'other';

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp';

export interface BugAnalysis {
  plain_english: string;
  root_cause: string;
  bug_type: BugType;
  fixed_code: string;
  line_numbers: number[];
  walkthrough: string[];
  prevention_tip?: string;
  severity?: 'critical' | 'high' | 'medium';
}

export interface DemoBug {
  id: string;
  title: string;
  language: SupportedLanguage;
  code: string;
  errorMessage: string;
  bugType: BugType;
  description: string;
  precomputedAnalysis: BugAnalysis;
}

export interface PracticeExercise {
  id: string;
  bug_type: BugType;
  language: SupportedLanguage;
  title: string;
  buggy_code: string;
  scenario: string;
  expected_behavior: string;
  hints: [string, string];
  test_cases_description?: string;
}

export interface CheckResult {
  is_correct: boolean;
  feedback: string;
  hint_to_reveal?: string;
  explanation: string;
}

export interface WeaknessStat {
  bugType: BugType;
  totalAttempts: number;
  solved: number;
  accuracyRate: number; // 0 to 100
  lastPracticed?: string;
}
