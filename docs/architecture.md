# Glitch Detective - Architecture Documentation

## Overview

**Glitch Detective** is a forensic code diagnostic and adaptive training application built for **GLITCHATHON 2026** under the **Build with AI** track. It bridges the gap between passive code copying and lifelong developer mastery by isolating the exact invariant failure in software bugs and drilling developers on identical bug archetypes.

---

## High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["Browser Client (Next.js 16 + React 19)"]
        UI["Dark Hacker/Detective UI"]
        AutopsyView["Bug Autopsy View (Faulty Line Highlight)"]
        PracticeSandbox["Interactive Sandbox (Code Editor & Hint Oracle)"]
        Dashboard["Weakness Profile (Recharts Radar & Bar Charts)"]
        LocalStorage[("Browser LocalStorage (Encrypted Attempts Store)")]
    end

    subgraph Server["Server-Side API Routes (Next.js App Router)"]
        RouteAnalyze["/api/analyze (POST)"]
        RouteGenerate["/api/practice/generate (POST)"]
        RouteCheck["/api/practice/check (POST)"]
        GeminiClient["Gemini AI Client (lib/gemini.ts)"]
        CuratedRepo["Curated Offline Drill Repository"]
    end

    subgraph AI["Google AI Cloud"]
        Gemini["Gemini 2.5 Flash / Gemini 1.5 Flash (Structured JSON Mode)"]
    end

    %% Client Interactions
    UI --> AutopsyView
    UI --> PracticeSandbox
    UI --> Dashboard

    %% Server Calls
    AutopsyView -->|"Buggy Code + Error"| RouteAnalyze
    PracticeSandbox -->|"Request Adaptive Drill"| RouteGenerate
    PracticeSandbox -->|"Submit Student Fix"| RouteCheck

    %% Server Logic
    RouteAnalyze --> GeminiClient
    RouteGenerate --> GeminiClient
    RouteCheck --> GeminiClient

    %% AI Pipeline
    GeminiClient -->|"Prompt 1: Autopsy Extraction"| Gemini
    GeminiClient -->|"Prompt 2: Drill Synthesis"| Gemini
    GeminiClient -->|"Prompt 3: Invariant Evaluation"| Gemini

    GeminiClient -.->|"Offline Fallback"| CuratedRepo

    %% Storage
    PracticeSandbox -->|"Record Solved/Failed"| LocalStorage
    LocalStorage -->|"Read Metrics"| Dashboard
```

---

## Forensic Pipeline Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Developer
    participant UI as Glitch Detective UI
    participant API as Next.js API Route (/api/analyze)
    participant Gemini as Google Gemini AI
    participant Storage as Browser LocalStorage

    Student->>UI: Pastes buggy code & terminal error
    UI->>API: POST /api/analyze { code, errorMessage, language }
    API->>Gemini: Prompt 1 (Analyze Root Cause & Enforce JSON Schema)
    Gemini-->>API: Validated JSON { plain_english, root_cause, bug_type, fixed_code, line_numbers, walkthrough }
    API-->>UI: Return Autopsy Data
    UI->>Student: Highlight faulty line & display forensic autopsy report

    Student->>UI: Clicks "Practice this Bug Type"
    UI->>API: POST /api/practice/generate { bugType, language }
    API->>Gemini: Prompt 2 (Synthesize novel scenario with identical bug invariant)
    Gemini-->>API: JSON { title, scenario, buggy_code, expected_behavior, hints }
    API-->>UI: Preload interactive practice sandbox

    Student->>UI: Edits code & clicks "Submit Fix"
    UI->>API: POST /api/practice/check { studentFixedCode, bugType }
    API->>Gemini: Prompt 3 (Verify invariant correction & generate hint feedback)
    Gemini-->>API: JSON { is_correct, feedback, hint_to_reveal, explanation }
    API-->>UI: Display evaluation verdict
    UI->>Storage: Log attempt & success in localStorage
    Storage-->>UI: Update Weakness Profile Radar & Bar metrics
```

---

## Core Components & Responsibilities

### 1. Presentation Layer (`components/`)
- **`Navbar.tsx`**: Navigation header with real-time status and trigger for the AI Architecture transparency modal.
- **`Hero.tsx`**: Problem definition, target audience breakdown, and quick 1-click demo entry points.
- **`CodeInputSection.tsx`**: Multi-language selection (JavaScript, Python, Java, C++), line counts, and 4 preloaded hackathon bugs.
- **`InvestigatingLoader.tsx`**: Forensic radar sweep animation signaling active background AST parsing and AI reasoning.
- **`BugAutopsy.tsx`**: Highlighted code block pinpointing the exact bug origin, plain-English summary, root-cause explanation, and copy-ready fix.
- **`PracticeMode.tsx`**: Interactive sandbox with progressive 2-stage hint oracle and instant AI verification.
- **`WeaknessProfile.tsx`**: Recharts RadarChart (multi-axis mastery polygon) and BarChart (attempts vs. solved), featured vulnerability card, and recommended practice launcher.
- **`AiArchitectureModal.tsx`**: Transparency panel detailing models, prompts, temperature, and zero-key leakage guarantees.

### 2. Forensic Server Layer (`app/api/` & `lib/`)
- **`lib/gemini.ts`**: Central client encapsulating the 3 specialized prompts, schema enforcement, zero-temperature JSON retry mechanism, and heuristic offline fallbacks.
- **`lib/types.ts`**: TypeScript definitions for the 9-archetype bug taxonomy (`off-by-one`, `null/undefined`, `type-mismatch`, `scope`, `async/promise`, `infinite-loop`, `syntax`, `logic`, `other`).
- **`lib/storage.ts`**: Client-side storage abstraction managing attempt logs and computing accuracy ratios.
- **`lib/demo-data.ts`**: Precomputed benchmark incidents for instant zero-latency demonstration.
- **`lib/practice-data.ts`**: Curated library of hands-on practice challenges across all languages.

---

## Security & Privacy Invariants

1. **Zero Key Exposure**:
   - `GEMINI_API_KEY` is loaded exclusively inside server-side Node.js route handlers.
   - The key is omitted from client bundles and never transmitted across HTTP to the browser.
2. **Deterministic Output Guarantee**:
   - Every AI request utilizes `responseMimeType: "application/json"`.
   - If an unexpected token occurs, an automatic corrective zero-temperature retry parses the AST.
3. **Student Privacy**:
   - Performance metrics and attempt counts are retained strictly inside browser `localStorage`.
   - No tracking cookies, no accounts, and no central database dependencies.
