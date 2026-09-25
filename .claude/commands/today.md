---
description: School-day session — fix one sentence from yesterday, log today's reading, earn XP (about 10 minutes)
argument-hint: [student name]
---

Run today's school-day session for $ARGUMENTS (if no name is given and more than one student has
journal entries, ask who is here today).

**School nights are short, so this session does two jobs in one sitting:** the student **logs
today's reading** (template 16, the Reading Log) and, in the same message, **fixes one sentence
from yesterday's log** — the grammar or sentence-structure lesson rides along with the writing
they were going to do anyway. Nothing is corrected tonight that can be fixed by the student
tomorrow. The long session — example, template choice, shape, ACE — is `/weekend`.

## Turn 0 — read, in one parallel batch (no message yet)

Make these three reads **at the same time**, in one tool batch:

```bash
cat students/<name>/profile.md
cat students/<name>/tutor.md
f=$(ls students/<name>/journal/*.md | tail -1); echo "$f"
sed -n '/^## My writing/,/^## Tutor feedback/p;/^## Revision/,/^## Bonus/p' "$f"
```

That is everything. No examples, no `docs/`, no archive. The Reading Log frame at their tier is
short enough to write from memory of `templates/16-reading-log.md`; `sed` the tier section only
if unsure.

**Build the 🔧 fix card from that last entry** — unless its `## Revision` already has a
`Fixed the next day` block (then skip the card, no comment). After a gap it is still their last
entry: call it *"your last log"*, not *"yesterday's"*.

1. **Pick ONE rule, at most two sentences that break it.** In this order:
   - a **Watch-list** slip in that entry (the fix card is the best Watch tool there is);
   - **sentence structure** — run-on or comma splice, fragment, two ideas that want *because* /
     *but* / *so*, a sentence that loses its subject;
   - **grammar** — agreement, tense shift, *much/many*, *a/an*, possessive `'s`, capitals on a
     title or a name, end marks.
   Skip anything the entry's `## Revision` already fixed, and never a mic-transcription error.
   Nothing wrong at all? Make it a **polish card**: join two short sentences with *because /
   although / when*, or trade a vague word (*good · bad · thing · stuff*) for a precise one.
2. **Quote their sentence exactly** — never the corrected version. They make the fix.
3. **Teach it their way** (`tutor.md` wins over this list):
   - **Jia — sound errors** (endings, tense, word choice): *"Read it out loud — what do you hear?"*
     **Silent marks** (`'s`, quotation marks, capitals): name the rule in one line, then have her
     **type** it. The mic cannot fix a mark.
   - **Jaei — ask before you tell:** *"What rule does this break?"* One line of rule only if he
     misses it. Never point at the word — point at the check.
4. **The rule, one line, in words they can reuse:** *"If you can count them, it's **many**."*

## Turn 1 — OPEN (one message, ≤ 120 words)

1. **Greet by name** — **Jia:** streak, level, the game. **Jaei:** level or craft, *never* the
   streak. One line. After a gap: welcome back warmly, the streak restarts, nothing else about it.
2. **① 🔧 Yesterday's fix (+5 XP)** — their sentence in a quote block, the question from step 3,
   and *"retype the sentence, fixed."* Put the XP right beside it; a number is what gets a small
   task done.
3. **② 📖 Today's log** — the three lines at their tier, as a fill-in frame:
   ```
   📖 Read: ______ (how much?)
   🎬 What happened: ______
   💭 My take: I think ______ because ______.
   ```
   If the step-up plan's next move **fits in one sentence** (a *because*, a short quote, a
   concession — *"Some might say ___, but ___"*), name it as 🎯 **today's move** inside *My take*.
   Paragraphs and shapes wait for `/weekend`.
4. 👀 **Watch item** — one light line.
5. **How to send:** *"① first, then ⇧+Enter twice, then ②. When it's typed, 🎤 read your log out
   loud before you send (+5)."*

**No example, no template menu, no ACE.** If they finished a book today, say it's a big day and
offer `/weekend` for the Book Review or a one-day essay — then run the log anyway if they'd
rather keep it short.

If `tutor.md` says multi-task messages get skipped (Jia): keep ① to **one sentence to retype**,
number it, XP beside it. If she skips it, **do not re-ask** — it rolls to tomorrow's card.

## Turn 2 — they write

Stay out of the way. A stall gets **one** question about their book — never a sentence they could
paste. If only the log comes back, that is a complete session.

## Turn 3 — CLOSE (one message: check → save → feedback → XP → commit)

1. **Score the fix.** Their retyped sentence obeys the rule → ✅ **fixed** (+5). Half-fixed or a
   new slip in it → say what's left in one line, `⬜ not yet` — no XP, no second ask. If they
   caught it only because you said *read it aloud*, it still counts: that is the tool working.
2. **Check today's log** — Watch item on the log; read-aloud as in `/weekend` (a slip they catch
   at the mic is clean; never score a mishearing). **Do not correct today's log.** Note its best
   fix candidate to yourself — tomorrow's card will find it again from the file.
3. **Save today's log** as `students/<name>/journal/<date>-16-reading-log.md`:
   ```markdown
   # YYYY-MM-DD — Reading Log

   - **Book:** <full title, including the series> by <Author> (<pages/chapters today>)
   - **Template:** 16 Reading Log, Tier <n>
   - **XP earned:** <n> (base 10 + <bonuses>)
   - **Read-aloud:** ✅ read aloud before saving   ← or `⬜ skipped`
   - **Watch list:** ✅ clean   ← or `⚠️ slipped — <item>`
   - **Yesterday's fix:** <rule> — "<their original words>" (<date of that entry>) — ✅ fixed   ← or `⬜ not yet` / `⬜ skipped`
   - **New move:** <only if a one-sentence move was asked> — ✅ landed / ⬜ next time

   ## My writing

   <the log, exactly as typed — never corrected>

   ## Tutor feedback

   <the close feedback below>
   ```
4. **Append the fix to yesterday's file** — at the end of its `## Revision` section, or a new
   `## Revision` section placed before `## Bonus` (or at the end):
   ```markdown
   **Fixed the next day (YYYY-MM-DD)** — <rule, one line>:

   > <their retyped sentence, exactly as typed>
   ```
   Only if ✅ fixed. The original stays untouched in `## My writing` — the file now shows the slip
   and the fix side by side, which is the whole lesson.
5. **Feedback, ≤ 80 words:**
   ```
   🔧✅ Yesterday's fix — the rule in one line, and that they own it now
   🌟 One thing in today's log — quote it, and NAME THE MOVE
   ```
   No 🔧 on today's log, no stretch. Tonight's slip is tomorrow's card.
6. **XP with the arithmetic:** base 10 · Tier 2 +5 / Tier 3 +10 · fix +5 · read-aloud +5 ·
   streak milestones. Then any level-up, badge or retired Watch item — those are the celebrations.
7. **Update `profile.md`:** XP, streak, `Last entry:`, session-log row (note ≤ 12 words: book +
   the fix rule), Watch streaks. Tick the step-up plan only if today's move was one of its lines.
   The same fix rule on **two cards in one week** → put it on the Watch list (if there is room);
   already on it at 0/3 for three sessions → `/lesson`.
8. One line in `tutor.md` only if today changed how you would teach them.
9. `node scripts/build-manifest.mjs`, then commit **both journal files, the profile and
   `metrics/turns.jsonl`** as `journal: <name> <date> reading log` and `git push origin HEAD:main`.

## The budget

**3 turns** · ≤ 45s of tutor typing a turn · ≤ 2½ minutes for the whole session · Turn 1
≤ 120 words · close ≤ 80 words. The student's side is about **10 minutes**: a minute on the fix,
the rest on the log. Check with `node scripts/timing-report.mjs`.
