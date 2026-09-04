---
description: Weekly feedback report for a student (last 7 days of journal entries)
argument-hint: [student name]
---

Write the weekly report for $ARGUMENTS (if no name is given, do it for every student with
journal entries this week).

Read `students/<name>/profile.md`, `students/<name>/tutor.md`, and **all** journal entries from
the last 7 days. This is the one command allowed to read widely — it is not a session, and no
child is waiting on it.

## Write `students/<name>/feedback/<date>-weekly.md`

1. **Week in numbers** — entries, streak, XP earned, templates used, example books shown.
2. **Growth I noticed** — 2–3 concrete improvements, quoting their **own** sentences from early
   in the week versus late in the week. This is the section they read; make it specific.
3. **Focus for next week** — ONE *growth* skill (a tier-up move), stated kid-friendly, with a
   mini-example. Recurring *mechanical* slips do not belong here — they go on the Watch list.
4. **Tier check** — promote a tier if earned (celebrate it), or name what's still missing. Then
   the **Writing Ladder**: current stage, how many steps closer they got to their
   `## Writing goal` this week, and the **one nearest unmet milestone**. No goal recorded yet →
   show them the 🪜 My Ladder page and invite them to pick one; never assign one.
5. **Step-up check** — did every session name a new move, and did the shape hold? Report it
   plainly: *"three sessions at Shape B, all clean — you're on Shape C now."* Then **rewrite the
   `## Step-up plan`** in the profile: the shape, the nearest milestone, and the next three
   sessions in order, including **one essay-shaped day** (a growth template, or a one-day
   12 Essay). A week with no new move anywhere is the report's main finding — say so and fix the
   plan, don't scold the kid.
6. **Watch-list check** — each item's clean streak; retire anything at 3/3 (🎉) and say what it
   cost to get there; add an item if the same concrete error appeared in 2+ entries (say **where**
   — it is usually the ACE answer). **An item stuck at 0/3 for three sessions is not reported
   again: schedule the `/lesson` and say so.** Rules: `docs/watch-list.md`.
7. **Badges & level** — anything unlocked this week.
8. **부모님께** — 3–5 sentences in Korean: what improved, what next week's focus is, and how they
   can help (e.g. *"이번 주는 근거 문장 쓰기에 집중합니다"*).

## Then, outside the report

- **Update `profile.md`:** focus skill, tier promotions, Watch list, the rewritten step-up plan,
  and +15 XP if they wrote 5+ entries this week.
- **Update `tutor.md`.** A week of writing is the best evidence there is about *how this kid
  works* — what they reached for unprompted, what they declined, what made them light up. Add or
  revise **one line**; stale personalization is a generic tutor with extra files.
- **Re-curate `library/reading-ladder.md`** if they finished or abandoned a book, so the "what
  next?" answer exists before they ask for it.
- **Audit the example rotation** — if the same book appeared twice this week, say so and fix the
  cycle in `examples/README.md`. If a template keeps recurring because it is their ladder goal,
  the fix is a second example book for that template.
- Share the highlights in chat: the growth section and the Korean note.
- Run `node scripts/build-manifest.mjs`, commit `feedback: <name> weekly <date>`, and push with
  `git push origin HEAD:main`.
