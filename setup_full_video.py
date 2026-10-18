import os
import subprocess
import json
import asyncio
import edge_tts

BASE_DIR = r"C:\Users\Asus\glitch-detective-demo-video"
AUDIO_DIR = os.path.join(BASE_DIR, "audio")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

MASTER_VIDEO = os.path.join(OUTPUT_DIR, "glitch-detective-demo.mp4")
FULL_SUBTITLED_OUT = os.path.join(OUTPUT_DIR, "glitch-detective-demo-subtitled.mp4")
ASS_PATH = os.path.join(OUTPUT_DIR, "full_subtitles.ass")

VOICE = "en-US-GuyNeural"

SEGMENTS = [
    ("seg1_problem", [
        ("When student developers encounter code crashes, they often paste error messages into generic AI chatbots and blindly copy bandage fixes without understanding why their code broke.", "[THE PROBLEM] Students rely on blind AI bandage fixes"),
        ("When the identical bug appears again in an exam or technical interview, they get stuck.", "Without understanding the invariant, the bug remains unsolved"),
        ("The underlying failure remains a mystery.", "Underlying failure remains a mystery")
    ]),
    ("seg2_solution", [
        ("Welcome to Glitch Detective, an AI forensic debugger and adaptive training platform built for GLITCHATHON under the Build with AI track.", "[GLITCH DETECTIVE] AI Forensic Debugger & Trainer"),
        ("Designed for computer science students and bootcampers, Glitch Detective performs an automated surgical autopsy on your crash, diagnoses the mechanical invariant failure under the hood, and drills you on that exact archetype to build permanent mastery.", "Diagnoses broken invariants and builds permanent mastery")
    ]),
    ("seg3_autopsy", [
        ("Let's see it in action. On our live deployment, we load a classic JavaScript off-by-one loop bug that calculates a running cart total.", "[LIVE AUTOPSY] Analyzing off-by-one loop bug"),
        ("With one click, Glitch Detective runs a forensic autopsy powered by Google Gemini.", "Autopsy powered by Google Gemini 2.5 Flash"),
        ("Instantly, the faulty line is spotlighted in glowing red.", "Spotlights faulty line with exact failure location"),
        ("Instead of a superficial fix, the autopsy exposes the deep mechanical invariant: the loop condition accessed an out-of-bounds index, returning undefined and propagating NaN.", "Loop accessed out-of-bounds index returning undefined & NaN"),
        ("We get an plain-English explanation, the exact mechanical root cause, a step-by-step invariant trace, and an interactive side-by-side corrected diff.", "Plain-English explanation, trace, and corrected diff")
    ]),
    ("seg4_practice", [
        ("Understanding the diagnosis is only step one. Glitch Detective immediately unlocks Practice Mode.", "[PRACTICE MODE] Conquering the bug archetype"),
        ("Gemini's drill generator synthesizes a brand-new scenario with the identical bug archetype in an e-commerce inventory system.", "Synthesizes fresh scenario sharing identical archetype"),
        ("The student inspects the code in an interactive editor.", "Interactive code editor with live syntax support"),
        ("If they get stuck, our two-stage hint system provides progressive conceptual clues without spoiling the answer.", "2-Stage progressive hints without spoiling the answer"),
        ("Once fixed, Gemini's strict evaluator validates the invariant, confirming the bug is conquered and updating the student's mastery profile in real time.", "Gemini strict evaluator validates invariant in real time")
    ]),
    ("seg5_dashboard", [
        ("Over time, Glitch Detective builds a personalized Weakness Profile.", "[WEAKNESS PROFILE] Adaptive Mastery Dashboard"),
        ("The dynamic radar dashboard tracks performance across six core bug archetypes, from boundary errors to async race conditions.", "Tracks 6 bug archetypes from boundary to async races"),
        ("It pinpoints the user's weakest vulnerability and recommends targeted drills so students focus their practice exactly where it matters most.", "Pinpoints vulnerabilities & recommends targeted drills")
    ]),
    ("seg6_architecture", [
        ("Under the hood, Glitch Detective uses a three-prompt pipeline with Google Gemini 2.5 Flash and strict JSON schema guarantees with zero client key exposure.", "[ARCHITECTURE] Gemini 2.5 Flash + Zero Key Exposure"),
        ("Built with Next.js 16 and Tailwind CSS.", "Built with Next.js 16 App Router & Tailwind CSS"),
        ("Future improvements include browser WebAssembly sandboxes and GitHub PR bots.", "Roadmap: WebAssembly sandboxes & GitHub PR bots"),
        ("Try Glitch Detective live on Vercel today, and turn every crash into a masterclass!", "glitch-detective.vercel.app - Turn crashes into masterclasses")
    ])
]

def format_ass_time(seconds):
    hours = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = seconds % 60
    return f"{hours}:{mins:02d}:{secs:05.2f}"

async def generate_subtitles():
    print("Generating ASS subtitle events with exact sentence timings...")
    
    durations_json = os.path.join(AUDIO_DIR, "durations.json")
    with open(durations_json, "r", encoding="utf-8") as f:
        dur_data = json.load(f)
    seg_durations = {k: v["duration"] for k, v in dur_data["segments"].items()}

    ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Segoe UI,34,&H00FFFFFF,&H000000FF,&H00000000,&HB0000000,-1,0,0,0,100,100,0,0,3,2,0,2,60,60,75,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    t_cursor = 3.5  # 3.5s title card offset

    for seg_id, items in SEGMENTS:
        seg_total_dur = seg_durations[seg_id]
        full_text = " ".join([text for text, _ in items])
        
        # Get live sentence boundary offsets from edge_tts
        comm = edge_tts.Communicate(full_text, VOICE)
        sentence_offsets = []
        async for chunk in comm.stream():
            if chunk.get("type") == "SentenceBoundary":
                sentence_offsets.append({
                    "start": chunk["offset"] / 1e7,
                    "dur": chunk["duration"] / 1e7,
                    "text": chunk["text"]
                })
        
        if len(sentence_offsets) == len(items):
            for i, item in enumerate(sentence_offsets):
                st = t_cursor + item["start"]
                et = st + item["dur"]
                # Visual badge and text
                badge = items[i][1]
                events.append((st, et, f"{{\\b1\\c&H38BDF8&}}{badge}{{\\r}}\\N{item['text']}"))
        else:
            # Fallback proportional distribution
            seg_part_dur = seg_total_dur / len(items)
            for i, (text, badge) in enumerate(items):
                st = t_cursor + i * seg_part_dur
                et = st + seg_part_dur - 0.2
                events.append((st, et, f"{{\\b1\\c&H38BDF8&}}{badge}{{\\r}}\\N{text}"))

        t_cursor += seg_total_dur

    with open(ASS_PATH, "w", encoding="utf-8") as f:
        f.write(ass_header)
        for st, et, line in events:
            f.write(f"Dialogue: 0,{format_ass_time(st)},{format_ass_time(et)},Default,,0,0,0,,{line}\n")

    print(f"Subtitles written to: {ASS_PATH}")

def burn_subtitles():
    print(f"Burning subtitles into full-length video: {FULL_SUBTITLED_OUT}...")
    rel_ass = "full_subtitles.ass"
    cmd = [
        "ffmpeg", "-y",
        "-i", MASTER_VIDEO,
        "-vf", f"ass=filename={rel_ass}",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-c:a", "copy",
        FULL_SUBTITLED_OUT
    ]
    subprocess.run(cmd, cwd=OUTPUT_DIR, check=True)
    print("==================================================")
    print(f"[SUCCESS] Full-length demo video ready: {FULL_SUBTITLED_OUT}")
    print("==================================================")

def main():
    asyncio.run(generate_subtitles())
    burn_subtitles()

if __name__ == "__main__":
    main()
