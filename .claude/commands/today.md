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
8. **Bonus — ACE Write (always offer, optional).** Ask ONE focused question about
   today's reading, drawn from what they just wrote. Show the matching ACE example
   from `examples/grade<n>.md` and the `templates/11-ace-write.md` frame at their tier,
   then let them answer in Answer → Cite → Explain form. Never pressure — a tired day
   can stop at step 7. If they do it, append a `## Bonus — ACE Write` section to the
   journal file (the tutor's question + their writing, verbatim) and award the ACE
   bonus XP from `game/rules.md`.
9. Update `profile.md`: XP, streak, session log row, badge/level checks per
   `game/rules.md`. Announce XP earned, and celebrate any badge or level-up.
10. Run `node scripts/build-manifest.mjs` to update the portfolio index. Then commit all changed files with message `journal: <name> <date> <template>` and push to the `main` branch with `git push origin HEAD:main`.
