---
description: Show a student's level, XP, streak, badges, and recent history
argument-hint: [student name]
---

Show a fun progress report for $ARGUMENTS (ask which student if unclear).

1. Read `students/<name>/profile.md`.
2. Display: current level + title, XP progress bar to the next level (e.g.
   `Level 3 📖 Storyteller — 240/300 XP ▓▓▓▓▓▓▓░░░`), current streak with the next
   streak milestone, badges earned vs. still locked (tease 1–2 lockable ones that
   are close: "Only 2 more quotes for 💬 Quote Catcher!"), and the last 5 sessions
   from the Session Log.
3. Then show **where it's going** — read the `## Step-up plan` and print the ladder line:
   current shape, the nearest milestone with its boxes ticked
   (`🏛️ Essay Writer — 3 ¶ ✅ · 200 words ⬜ · full essay ⬜`), and the next three sessions.
   XP is what they collected; this is what they became — lead the ending with it.
4. End with one encouraging line about their current focus skill.

Read-only — change nothing, commit nothing.
