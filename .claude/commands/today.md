---
description: Daily writing session — talk about today's book, see an example, write, get feedback, earn XP
argument-hint: [student name]
---

Run today's writing session for $ARGUMENTS (if no name is given and more than one student has
journal entries, ask who is here today).

**Read first, and only this:** `students/<name>/profile.md` and `students/<name>/tutor.md` —
level, streak, tiers, Watch list, **step-up plan**, last example, and how this kid learns.
Everything else waits until you know what they actually read today.

## Turn 1 — ASK (~80 words. No templates, no example, no frame.)

Greet by name — **Jia:** streak, level, the game. **Jaei:** level or craft, *never* the streak.
Then ask three things and **stop**:

- **What are you reading right now?**
- **How much did you get through today** — a few pages, about a chapter, a lot?
- **What happened in it?** (or *"what's the part you'd tell someone about?"*)

If they finished a book, congratulate it as the event it is and ask what's next — offer a pick
from `library/reading-ladder.md` only if they want one (Jia sources her own; ask before handing
her a list).

Their answer is what makes today's example, template and question specific instead of generic.
It costs one short turn and it is the reason the session feels like a conversation.

## Turn 2 — SET UP (one message: everything they need to start writing)

Open by reacting to what they said, like a reader — one or two real sentences, curiosity, not
praise-by-formula. Then:

1. **Two template choices** that fit today's reading amount (table in `CLAUDE.md`), weren't used
   in the last 2 sessions, and move the `## Step-up plan` forward. Say which one you'd pick, in
   half a line, and let them choose.
2. **The example — a different book from last session.** Check `Last example:` in the profile;
   the per-grade cycle and the pairing rules are in `examples/README.md`. Pull **one section**:
   ```bash
   sed -n '/^## 04 /,/^## 05 /p' examples/grade8-holes.md
   ```
   Name the book, say in one sentence why it pairs with *their* book today, point at **2** things
   that make it work, then: *"Now it's your turn — about YOUR book."* If they pick the other
   template, that section is in the same file — never a second book in one session.
3. **The frame at their tier** from `templates/` (the section, not the file), with its starters.
4. **Today's shape** — *"Two paragraphs. The second one starts with 'But'."* Say exactly where the
   break goes (**⇧+Enter** — plain Enter sends the message). Never a word count.
5. 🎯 **Today's one new move**, from the step-up plan, named so they can hear themselves doing it:
   *"Today's new move is a thesis — one sentence that says what the whole piece argues."*
6. 👀 **The Watch item** — one light sentence, no lecture.

One message. If their `tutor.md` says menus of tasks get skipped (Jia), ask for the hardest thing
**alone** and drop the rest.

## Turn 3 — they write

Stay out of the way. If they stall, **one** guiding question about their book — never a sentence
they could paste, never five suggestions.

## Turn 4 — CLOSE (one message: check → save → feedback → XP → commit)

1. 🎤 **Pre-save read-aloud.** Invite them by name to press the 🎤 mic button and read it out loud
   (*"+5 XP and a Voice stamp"*), then run **their** check from `tutor.md` / `lessons/`. A slip they
   catch here counts as a **clean** entry. Skipped is `⬜ skipped` — no guilt, no XP, offer it again
   tomorrow. Never score a dictation mishearing as their error: keep their typed text and take only
   the fixes they name out loud.
2. **Save** `students/<name>/journal/<date>-<template-slug>.md` in the `CLAUDE.md` format — their
   writing verbatim, with `Read-aloud:`, `Watch list:`, `Example shown:` and `New move:`, and the
   **full book title including its series**.
3. **Feedback, ≤ 150 words:** 🌟🌟 → 🔧 → 🚀. One quoted sentence per praise, and **name the move**
   (*"that's a concession — the ⚖️ Debater move, in an ordinary entry"*). One 🔧 only, on their own
   sentence. Run the Watch check on the main entry **and** the ACE. If an item has sat at 0/3 for
   three sessions, run the `/lesson` instead of correcting it an eighth time.
4. **Progress — one line:** *"① three paragraphs: done. Two steps left to 🏛️ Essay Writer."*
5. **XP with the arithmetic** (Jaei checks it and has been right every time), plus any level, badge,
   promoted shape or retired ✅ Watch item — those are the celebrations.
6. **Update `profile.md`:** XP, streak, session-log row, Watch streaks, `Last example:`, and tick
   the step-up plan (three clean sessions at a shape = promote it and say so).
7. Add **one line** to `tutor.md` only if today changed how you would teach them.
8. Run `node scripts/build-manifest.mjs`, commit everything **including `metrics/turns.jsonl`** with
   `journal: <name> <date> <template>`, and `git push origin HEAD:main`.

## Optional turn 5 — the ACE bonus

Offer it only if they still have energy, and offer it **alone**: put a mic prompt or a choice beside
it and the ACE always loses. One focused question drawn from what they just wrote (put the Watch
item's target **inside the question**), the frame from `templates/11-ace-write.md`, one read-aloud
pass, then append `## Bonus — ACE Write` to the journal file and award the bonus XP. A tired day
ends at turn 4 with no comment.

## The budget

4 turns, ≤ 60s of tutor typing each, ≤ 4 minutes total. Feedback ≤ 150 words · ACE notes ≤ 40.
Never `cat` a whole example or template file; never read `docs/`, `archive/`, or another student's
files. Check yourself afterwards with `node scripts/timing-report.mjs`.

*(The final turn's own timing row is written by the `Stop` hook after the commit, so it lands in the
next session's commit. That is expected — don't chase it.)*
