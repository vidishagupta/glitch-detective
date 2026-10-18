import { NextRequest, NextResponse } from 'next/server';
import { checkStudentFixWithAI } from '@/lib/gemini';
import { BugType, SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bugType,
      language,
      originalBuggyCode,
      studentFixedCode,
      hintsUsedCount,
      exerciseHints
    } = body;

    if (!studentFixedCode || typeof studentFixedCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter your code fix before submitting.' },
        { status: 400 }
      );
    }

    const validBugTypes: BugType[] = [
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
    const targetBugType: BugType = validBugTypes.includes(bugType) ? bugType : 'off-by-one';
    const targetLang: SupportedLanguage = language || 'javascript';
    const hintsCount = typeof hintsUsedCount === 'number' ? hintsUsedCount : 0;
    const hintsArray: [string, string] = Array.isArray(exerciseHints) && exerciseHints.length >= 2
      ? [exerciseHints[0], exerciseHints[1]]
      : ['Inspect the boundary condition.', 'Trace the variable assignments.'];

    const checkResult = await checkStudentFixWithAI(
      targetBugType,
      targetLang,
      originalBuggyCode || '',
      studentFixedCode,
      hintsCount,
      hintsArray
    );

    return NextResponse.json({
      success: true,
      data: checkResult
    });
  } catch (error: any) {
    console.error('Error in /api/practice/check:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify code fix.'
      },
      { status: 500 }
    );
  }
}
