---
description: School-night session (~10 min) — log today's reading while yesterday's sentence gets fixed on screen, earn XP
argument-hint: [student name]
---

Run tonight's school-night session for $ARGUMENTS (if no name is given and more than one student
has journal entries, ask who is here today).

**Two jobs, one sitting, at the same time.** The student starts writing tonight's **Reading Log**
(template 16) right away. **While they write**, a background `fix-card` subagent reads their
**last** entry and finds one grammar or sentence-structure fix. When it finishes, the card goes
up on screen — the student sees yesterday's sentence corrected, and the rule, **while they're still
typing today's**. No waiting on the tutor at either end.

This is the short cousin of `/today`: no example, no template menu, no shape, no ACE. Use `/today`
on free days and the day a book is finished — at least once a week.

## Turn 0 — read (no message yet)

```bash
cat students/<name>/profile.md students/<name>/tutor.md
ls students/<name>/journal/*.md | tail -1
```

That is everything. The frame is below; `templates/16-reading-log.md` is there only if unsure.

## Turn 1 — OPEN, then launch the fix card (≤ 90 words on screen)

**Write the message first**, so the student can start:

1. **Greet by name** — **Jia:** streak, level, the game. **Jaei:** level or craft, *never* the
   streak. One line. After a gap: welcome back warmly, the streak restarts, nothing else about it.
2. **📖 Tonight's log, at their tier** — as a fill-in frame:
   ```
   📖 Read: ______ (how much?)
   🎬 What happened: ______
   💭 My take: I think ______ because ______.
   ```
   Tier 2 adds *one detail that proves it*; Tier 3 adds *a short quote inside your sentence*.
   If the step-up plan's next move **fits in one sentence** (a *because*, a quote, a concession),
   name it as 🎯 **tonight's move** inside *My take*. Paragraphs and shapes wait for `/today`.
3. 👀 **Watch item** — one light line.
4. *"Start writing now — in a minute I'll put up a fix from yesterday's log. Keep going when it
   shows up."* **Nothing else.** No analysis of yesterday in this message.

**Then, in the same turn, launch the subagent in the background** — `Agent` with
`subagent_type: "fix-card"`, `run_in_background: true`, and a prompt that carries everything it
needs so it reads nothing else:

> Student: <name>, grade <n>. Last entry: `students/<name>/journal/<file>`.
> Watch list: <the ≤ 2 lines from the profile>. How they learn: <one line from tutor.md>.

End the turn. The student is writing.

## When the card arrives — post it (≤ 70 words, no question to answer)

The subagent's notification wakes you while they write. `SKIP` → post nothing. Otherwise put up:

```
🔧 Yesterday's fix — from your <book> log
✏️  <BEFORE>
✅  <AFTER>          ← changed words in bold
📏 <WHY>
👀 Before you send tonight's log: <CHECK>
⭐ +5 XP: <the ask — below>
```

The ask depends on the kid (`tutor.md` wins):

- **Jia** — the subagent's **USE** line: use the rule once in tonight's log. *A habit gets scored
  in the question, not in a slot* — so it is one concrete thing she can do, not *"remember this."*
  For a sound error (endings, tense), add *"🎤 read your log aloud before you send — you'll hear it."*
- **Jaei** — *"What's the rule? One line at the end of your log."* Naming the rule is his move;
  he learns from the rule, never from the repaired sentence alone.

Keep the card's lines short and put nothing after it — the student is mid-sentence. Keep **OTHERS**
to yourself; they are material for later cards and the Watch list.

**If their log arrives before the card:** don't wait. Take the subagent's result if it is already
in; otherwise build the card yourself from the entry's `## My writing` (same rules as
`.claude/agents/fix-card.md`) and put it at the top of the close. Ignore a late notification.

## Turn 2 — they write

Stay out of the way. A stall gets **one** question about their book — never a sentence they could
paste. If only the log comes back, that is a complete session.

## Turn 3 — CLOSE (one message: check → save → feedback → XP → commit)

1. **Score the fix-card ask.** Done → ✅ (+5). Not done → `⬜ not yet`, no XP, no second ask.
   A slip of the card's rule in tonight's log → say it in one line (it is tomorrow's card).
2. **Check tonight's log** — the Watch item; read-aloud if they did it (a slip they catch at the mic
   is clean; never score a mishearing). **Do not correct tonight's log** — tomorrow's card will.
3. **Save tonight's log** as `students/<name>/journal/<date>-16-reading-log.md`:
   ```markdown
   # YYYY-MM-DD — Reading Log

   - **Book:** <full title, including the series> by <Author> (<pages/chapters today>)
   - **Template:** 16 Reading Log, Tier <n>
   - **XP earned:** <n> (base 10 + <bonuses>)
   - **Read-aloud:** ✅ read aloud before saving   ← or `⬜ skipped`
   - **Watch list:** ✅ clean   ← or `⚠️ slipped — <item>`
   - **Fix card:** <rule> (from <date of that entry>) — ✅ done   ← or `⬜ not yet`
   - **New move:** <only if a one-sentence move was asked> — ✅ landed / ⬜ next time

   ## My writing

   <the log, exactly as typed — never corrected>

   ## Tutor feedback

   <the close feedback below>
   ```
4. **Add the fix to yesterday's file** — a `## Next-day fix` section at the very end:
   ```markdown
   ## Next-day fix

   **YYYY-MM-DD** — <RULE>: <WHY>

   > ✏️ <BEFORE>
   > ✅ <AFTER>
   ```
   `## My writing` above it stays untouched — the file now shows the slip and the fix side by side.
5. **Feedback, ≤ 80 words:** 🔧 the fix-card verdict in one line → 🌟 one thing in tonight's log,
   quoted, **with the move named**. No 🔧 on tonight's log, no stretch.
6. **XP with the arithmetic:** base 10 · Tier 2 +5 / Tier 3 +10 · fix card +5 · read-aloud +5 ·
   streak milestones. Then any level-up, badge or retired Watch item — those are the celebrations.
7. **Update `profile.md`:** XP, streak, `Last entry:`, session-log row (note ≤ 12 words: book +
   the fix rule), Watch streaks. Tick the step-up plan only if tonight's move was one of its lines.
   The same rule on **two cards in one week** → onto the Watch list (if there is room); already on
   it at 0/3 for three sessions → `/lesson`.
8. One line in `tutor.md` only if tonight changed how you would teach them.
9. `node scripts/build-manifest.mjs`, then commit **both journal files, the profile and
   `metrics/turns.jsonl`** as `journal: <name> <date> reading log` and `git push origin HEAD:main`.

## The budget

**3 turns the student waits on** (open → they write → close) — the card is posted while they
write, so it costs them nothing. ≤ 45s of tutor typing a turn · open ≤ 90 words · card ≤ 70 ·
close ≤ 80. Their side is about **10 minutes**. Check with `node scripts/timing-report.mjs`.
