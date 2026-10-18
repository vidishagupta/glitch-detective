import { NextRequest, NextResponse } from 'next/server';
import { generatePracticeExerciseWithAI } from '@/lib/gemini';
import { BugType, SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bugType, language } = body;

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

    const selectedBugType: BugType = validBugTypes.includes(bugType) ? bugType : 'off-by-one';
    const validLangs: SupportedLanguage[] = ['javascript', 'python', 'java', 'cpp'];
    const selectedLang: SupportedLanguage = validLangs.includes(language) ? language : 'javascript';

    const exercise = await generatePracticeExerciseWithAI(selectedBugType, selectedLang);

    return NextResponse.json({
      success: true,
      data: exercise
    });
  } catch (error: any) {
    console.error('Error in /api/practice/generate:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate practice drill.'
      },
      { status: 500 }
    );
  }
}
