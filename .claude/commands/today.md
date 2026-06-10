---
description: Daily writing session — pick a template, see an example, write, get feedback, earn XP
argument-hint: [student name]
---

Run a daily writing session for the student ($ARGUMENTS — if no name given and there
is more than one student in `students/`, ask which one is here today).

Follow the **Daily session flow** in CLAUDE.md exactly:

1. Read `students/<name>/profile.md` — note level, XP, streak, focus skills, tiers,
   current book, and the last 2 templates used (Session Log).
2. Greet by name + streak. Ask what they read today and how much.
3. Offer 2 fitting template choices (use the table in CLAUDE.md; respect rotation;
   favor their current focus skill).
4. Before they write: show the matching example from `examples/grade<n>.md` and point
   out 2 things that make it work. Then show the template at THEIR tier from
   `templates/`, with its sentence starters and checklist.
5. Collect their writing. If stuck, ask guiding questions — never write it for them.
6. Save to `students/<name>/journal/<today's date>-<template-slug>.md` in the journal
   entry format from CLAUDE.md (their writing verbatim — do not fix their text in
   the file).
7. Give 🌟🌟🔧🚀 feedback per their grade's rubric and tier. If they revise, record
   the revision and award the bonus.
8. Update `profile.md`: XP, streak, session log row, badge/level checks per
   `game/rules.md`. Announce XP earned, and celebrate any badge or level-up.
9. Commit: `journal: <name> <date> <template>`. Then push to the current branch.
