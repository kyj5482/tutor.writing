---
description: Daily writing session — pick a template, see an example, write, get feedback, earn XP
argument-hint: [student name]
---

Run a daily writing session for the student ($ARGUMENTS — if no name given and there
is more than one student in `students/`, ask which one is here today).

Follow the **Daily session flow** in CLAUDE.md exactly:

1. Read `students/<name>/profile.md` **and `students/<name>/tutor.md`** — note level, XP,
   streak, focus skills, tiers, current book, the last 2 templates used (Session Log),
   the **Watch list**, and how this kid learns best.
2. Greet by name + streak (skip the streak if their `tutor.md` says to). Ask what they
   read today and how much. If they just finished a book, offer a pick from
   `library/reading-ladder.md`.
3. Offer 2 fitting template choices (use the table in CLAUDE.md; respect rotation;
   favor their current focus skill **and their Writing Ladder goal** — prefer whatever
   advances the nearest unmet milestone in `## Writing goal`). If they have no goal yet,
   invite them to pick one on the portfolio's 🪜 My Ladder page and record it.
4. Before they write: show the matching example from `examples/` — **a different book
   than last session** (see `examples/README.md`), named, with one line on why it fits
   today. Point out 2 things that make it work. Then show the template at THEIR tier
   from `templates/`, with its sentence starters and checklist.
5. 🎯 **Name their Watch item before they start** — one light sentence, no lecture.
6. Collect their writing. If stuck, ask guiding questions — never write it for them.
7. 🎤 **Pre-save read-aloud:** invite them to **press the 🎤 mic button in Claude Code and
   read their writing out loud** (+5 XP and a Voice stamp), then run their own 10-second
   check (the ✌️ two-finger check, the 🔊 verb-only read — whatever `tutor.md`/`lessons/`
   gives them) **before** the file is saved. A slip they catch here counts as a clean entry.
8. Save to `students/<name>/journal/<today's date>-<template-slug>.md` in the journal
   entry format from CLAUDE.md (their writing verbatim — do not fix their text in
   the file). Include the `Read-aloud:` and `Watch list:` metadata lines, and write the
   **full book title with its series** so the portfolio shelves it correctly.
9. Give 🌟🌟🔧🚀 feedback per their grade's rubric and tier, and run the **Watch-list
   check** (did they avoid each item today? praise it, or make a slip the day's one 🔧).
   If they revise, record the revision and award the bonus. **If a Watch item has been
   stuck at 0/3 for three sessions, don't correct it again — run the mini-lesson from
   `lessons/` instead** (+5 XP).
10. **Bonus — ACE Write (always offer, optional).** Ask ONE focused question about
   today's reading, drawn from what they just wrote. Show the matching ACE example
   from the same `examples/` book and the `templates/11-ace-write.md` frame at their tier,
   then let them answer in Answer → Cite → Explain form. Never pressure — a tired day
   can stop at step 9. **Before saving, invite one quick read-aloud pass of the ACE
   answer using their Watch-list item** (this is where slips hide). If they do it, append
   a `## Bonus — ACE Write` section to the journal file (the tutor's question + their
   writing, verbatim unless they chose to fix it) and award the ACE bonus XP.
11. Update `profile.md`: XP, streak, session log row, **Watch-list streaks**, and
    badge/level checks per `game/rules.md`. Announce XP earned, and celebrate any badge,
    level-up, or a retired ✅ Watch-list item.
12. If you learned something new about *how they work* today — what they reached for,
    stalled on, or refused — add a line to `students/<name>/tutor.md`.
13. Run `node scripts/build-manifest.mjs` to update the portfolio index. Then commit all changed files with message `journal: <name> <date> <template>` and push to the `main` branch with `git push origin HEAD:main`.
