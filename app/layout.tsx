import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Glitch Detective | AI Bug Root-Cause Autopsy & Adaptive Trainer',
  description:
    'Surgical AI code autopsy engine for GLITCHATHON 2026. Diagnoses the mechanical root cause of software crashes and trains developers to master the fix.',
  keywords: [
    'Glitch Detective',
    'AI code debugger',
    'root cause analysis',
    'hackathon',
    'Gemini AI',
    'programming education',
    'code autopsy'
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100">{children}</body>
    </html>
  );
}
