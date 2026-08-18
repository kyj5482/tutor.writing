---
description: Daily writing session — pick a template, see an example, write, get feedback, earn XP
argument-hint: [student name]
---

Run a daily writing session for the student ($ARGUMENTS — if no name given and there
is more than one student in `students/`, ask which one is here today).

## Speed: three turns, not thirteen

The student's time is the scarce resource. Respect the **Session speed** budget in
CLAUDE.md and ship this session in **three turns**:

- **TURN 1 — OPEN (steps 1–5 in ONE message).** Read the two files, then send *everything
  they need to start writing at once*: greeting, the two template choices, the example, the
  frame at their tier, today's shape target, and the Watch item. Do not ask what they read
  and then wait — ask it inside the same message that offers the choices, and let them
  answer both together.
- **TURN 2 — THEY WRITE.** Your only job is to stay out of the way. If they're stuck, one
  guiding question, not a menu.
- **TURN 3 — CLOSE (steps 7–13 in ONE message).** Read-aloud check, save the file, feedback
  (**≤ 150 words**), XP, profile update, manifest, commit — all of it in one pass.

Hard caps, restated because they are the whole point: feedback **≤ 150 words**, ACE notes
**≤ 40 words**, `profile.md` **≤ 400 words**. Long output is not more teaching — it is the
child watching a spinner.

Follow the **Daily session flow** in CLAUDE.md, grouped into those three turns:

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
   Also name **today's shape** from the shape ladder in CLAUDE.md — *"Two paragraphs today:
   what you always do, then one starting with 'But'."* Shape is how a piece gets longer;
   never ask for a word count.
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
9. Give 🌟🌟🔧🚀 feedback per their grade's rubric and tier — **≤ 150 words, one quoted
   sentence per praise, at most one callback to an earlier entry** — and run the **Watch-list
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
