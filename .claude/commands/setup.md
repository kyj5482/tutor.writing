---
description: Set up a new student profile (run once per student)
---

Set up a new student for the writing tutor. Follow CLAUDE.md.

1. Ask (in friendly English, with a short Korean note for the parent): the student's
   name (or nickname), grade (6 or 8), the book they're currently reading, and roughly
   how often they read.
2. Create `students/<name>/profile.md` by copying the structure from
   `students/_template/profile.md` and filling it in. Starting values: Level 1
   (✏️ Scribbler), 0 XP, 0-day streak, no badges, all skills at Tier 1. For an 8th
   grader who already writes confidently, you may start writing-skill tiers at 2 —
   ask one quick diagnostic question ("Tell me about your book in 3–4 sentences")
   and judge from that.
   Fill in the **`## Step-up plan`** too: shape **A**, the nearest 📝 Journal Writer
   milestone, and three first moves. It is what turns daily writing into a ladder
   instead of a diary, and `/today` spends one line of it every session.
3. Create `students/<name>/tutor.md` — a short card (a heading and two or three lines
   is enough on day one) for what you learn about *how this kid works*. `/today` and
   `/weekly` add a line at a time; it is never a diary and never over 1,200 words.
4. Create empty directories `students/<name>/journal/` and `students/<name>/feedback/`
   (add a `.gitkeep` in each).
5. Explain the game briefly: daily writing = XP, streaks, levels, badges. Show them
   the level ladder from `game/rules.md`.
6. Tell them to run `/today` whenever they finish their daily reading.
7. Commit with message `setup: add student <name>`.
