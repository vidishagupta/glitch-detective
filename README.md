# 🕵️‍♂️ Glitch Detective

> **Stop guessing fixes. Decode why code breaks, then master the bug.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Hackathon](https://img.shields.io/badge/GLITCHATHON-Build_with_AI-00f2fe)](https://github.com)

---

## 📌 The Problem & Who It Helps

When student developers encounter code crashes or syntax exceptions, they often copy the error into AI chat bots and paste back bandage fixes without understanding the underlying failure. Consequently, when the same bug pattern appears again in an interview or project, they get stuck.

**Glitch Detective** solves this through a forensic, pedagogy-first learning loop:
1. **Performs an AI Autopsy**: Isolates the exact mechanical root-cause invariant that failed under the hood rather than just handing out a surface-level patch.
2. **Dynamic Retesting**: Immediately generates a novel scenario with the identical bug archetype to drill the student's retention.
3. **Adaptive Profiling**: Tracks personal failure tendencies on a multi-axis skill radar to turn weaknesses into strengths.

**Built for**: Computer science students, bootcampers, hackathon builders, and self-taught developers.

---

## ✨ Key Features

### 1. 🔍 Bug Autopsy
- **Multi-Language Support**: JavaScript, Python, Java, and C++.
- **Faulty Line Highlighting**: Pinpoints the exact 1-indexed line where the bug originates with visual alerts.
- **Root-Cause vs. Plain English**:
  - *Plain English*: Zero-jargon, conceptual overview for rapid mental orientation.
  - *The Deep Root Cause*: The mechanical failure under the hood (e.g. pointer dereference, type coercion, off-by-one arithmetic, unsigned integer underflow).
- **Execution Walkthrough**: Chronological step-by-step breakdown of how the program reached the failure state.
- **Side-by-Side Clean Fix**: Compare faulty code against the verified solution with 1-click clipboard copy.
- **Forensic Rule of Thumb**: Practical heuristics to ensure students never repeat the mistake.

### 2. ⚡ Practice Mode & AI Hint Oracle
- **Adaptive Drill Synthesis**: Generates a brand-new scenario with the identical bug archetype.
- **Interactive Sandbox**: In-browser code editor with instant reset capability.
- **Progressive Hint Oracle**:
  - *Hint 1*: Conceptual heuristic clue without spoiling the answer.
  - *Hint 2*: Surgical line pointer directing attention to the invariant.
  - Hard limit of 2 hints to encourage independent problem-solving.
- **Instant AI Verification**: Verifies student solutions, ensures no regressions, and rewards verified invariants.

### 3. 📊 Weakness Profile Dashboard
- **Recharts Skill Radar**: Multi-axis radar polygon showcasing mastery (0–100%) across 9 core bug archetypes.
- **Attempts vs. Solved Bar Chart**: Visual comparative breakdown of historical practice attempts.
- **Identified Vulnerability Card**: Automatically isolates the student's weakest bug pattern with failure analytics.
- **Recommended Next Practice**: One-click action button that launches a targeted practice drill on the student's weakest area.
- **Taxonomy Breakdown Table**: Complete breakdown of attempts, successes, and accuracy rates.

---

## 🤖 How AI Is Used (Judging Criterion)

Glitch Detective implements a visible, multi-stage AI pipeline designed for deterministic reliability:

### 1. Three Specialized Prompt Pipelines
| Prompt Pipeline | Role | Purpose |
| :--- | :--- | :--- |
| **Prompt 1: Autopsy** | Forensic Investigator | Extracts line numbers, root cause, walkthrough, and bug classification |
| **Prompt 2: Drill Generator** | Curriculum Architect | Synthesizes a fresh, realistic scenario sharing the same bug archetype |
| **Prompt 3: Evaluator** | Strict Code Reviewer | Evaluates student fixes, verifies invariants, and delivers hint feedback |

### 2. Strict JSON Schema Output & Auto-Retry Loop
- AI calls utilize Google Gemini's native `responseMimeType: "application/json"`.
- If a malformed payload or stream disconnection occurs, the server automatically issues a zero-temperature corrective retry prompt.

### 3. Zero Key Exposure & Client Privacy
- API keys reside solely on the server in `.env.local` (accessed through Next.js App Router handlers).
- Zero user data or keys are sent to the client.
- Student attempt statistics are stored privately in browser `localStorage`.

---

## 🛠️ Tech Stack & "Built With" List

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev/) (with Gemini 1.5 Flash fallback)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (tested on Node v24)
- npm v9+

### 1. Clone the Repository
```bash
git clone https://github.com/vidishagupta/glitch-detective.git
cd glitch-detective
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no key is provided, the app will gracefully run using high-fidelity offline forensic analysis for all demo scenarios).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Live Deployment & Demo

- **Live Application URL**: [https://glitch-detective.vercel.app](https://glitch-detective.vercel.app)
- **Deployment Status**: Active on Vercel Edge Serverless
- **Full Demo Video (2:40, 1080p Subtitled)**: [glitch-detective-demo-full.mp4](./glitch-detective-demo-full.mp4) (Direct Stream: [https://glitch-detective.vercel.app/demo.mp4](https://glitch-detective.vercel.app/demo.mp4))
- **Short Teaser Video (0:29, 1080p Subtitled)**: [glitch-detective-demo-short.mp4](./glitch-detective-demo-short.mp4)

### How to Deploy Your Own on Vercel
1. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"** &gt; **"Import"**.
2. Select the repository: **`vidishagupta/glitch-detective`**.
3. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key` (get one free at [aistudio.google.com](https://aistudio.google.com/))
4. Click **"Deploy"**. Vercel will automatically build the Next.js App Router application.

---

## 📸 Screenshots & Workflow

1. **Root-Cause Autopsy**: Faulty line highlighted in glowing red with step-by-step invariant trace.
2. **Interactive Practice Sandbox**: Novel drill scenario with 2-stage progressive hint oracle.
3. **Weakness Profile**: Real-time Recharts skill radar and identified vulnerability recommendations.
4. **AI Architecture Panel**: Full transparency into prompt workflows and JSON schema validation.

---

## 🔮 Future Improvements

- [ ] **Interactive REPL execution**: Real WebAssembly runtime (Pyodide / QuickJS) to execute code directly in browser.
- [ ] **GitHub PR Bot**: Automated GitHub Action that reviews failing PRs with Glitch Detective autopsies.
- [ ] **Collaborative Pair Forensics**: Real-time collaborative debugging rooms for study groups.
- [ ] **Spaced Repetition Schedule**: Daily notification reminders for previously failed bug archetypes.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Built with ❤️ during GLITCHATHON 2026.
