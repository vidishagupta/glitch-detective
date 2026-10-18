import { NextRequest, NextResponse } from 'next/server';
import { analyzeBugWithAI } from '@/lib/gemini';
import { SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, errorMessage, language } = body;

    if (!code || typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please paste your buggy code to start the autopsy.' },
        { status: 400 }
      );
    }

    const validLanguages: SupportedLanguage[] = ['javascript', 'python', 'java', 'cpp'];
    const chosenLang: SupportedLanguage = validLanguages.includes(language) ? language : 'javascript';

    const analysis = await analyzeBugWithAI(code, errorMessage || '', chosenLang);

    return NextResponse.json({
      success: true,
      data: analysis,
      modelUsed: process.env.GEMINI_API_KEY ? 'gemini-2.5-flash / gemini-1.5-flash' : 'offline-forensic-engine'
    });
  } catch (error: any) {
    console.error('Error in /api/analyze route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while analyzing the code.'
      },
      { status: 500 }
    );
  }
}
