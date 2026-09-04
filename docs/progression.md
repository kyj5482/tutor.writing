# Progression — the ladder, the builds, the plan

*Read when you are planning a step up, running a growth template, or writing the weekly.
Not during an ordinary session — `CLAUDE.md` carries everything a daily session needs.*

---

## The Writing Ladder

Seven stages from a first paragraph to university-level work, shown on the portfolio's
🪜 **My Ladder** page. Milestones are computed from writing that already exists (entry counts,
tiers, quotes, word and paragraph counts, counterargument moves), so the bar moves on its own and
nothing here needs extra bookkeeping.

| # | Stage | The move that defines it | Unlocked by |
|---|-------|--------------------------|-------------|
| 1 | 📝 Journal Writer | Real names, one specific detail | — |
| 2 | 🧩 Paragraph Builder | Topic sentence, order words, a *because* | — |
| 3 | 🔍 Evidence Writer | Claim → a real quote → why it matters | — |
| 4 | 🏛️ Essay Writer | Thesis → 2 evidence paragraphs → an ending that adds | **12 Essay** (3 days) |
| 5 | ⚖️ Debater | Concede what's true in the other view, then rebut it | **13 Debate** (1–2 days) |
| 6 | 🔬 Critic | Name a technique, prove it, say what it costs and buys | **14 Craft Analysis** (1–2 days) |
| 7 | 🎓 Scholar | One argument, held across two books, with citations | **15 Comparative** (4 days) |

The site also projects, from the student's **own** observed rates, how many more sessions each
stage needs and roughly when they'd reach it at 3, 5 or 7 sessions a week. Both of these students
are goal-driven — knowing that steady daily writing reaches university-level work in about a year
is a completely different experience from writing without knowing where it goes. Treat the dates as
encouragement, never a deadline, and say so if a student sounds anxious about one. Missing a week
moves a date; it never loses progress.

## The step-up plan

Every profile carries this block. It is short on purpose — it is re-read every session.

```markdown
## Step-up plan

- **Shape now:** B (2 ¶) — held 2/3 · **next:** C (3 ¶)
- **Nearest milestone:** 🏛️ Essay Writer — 3 ¶ ✅ · 200-word entry ⬜ · full essay ⬜
- **Next 3 sessions:** ① three paragraphs on an ordinary day ② a 200-word entry
  ③ one-day 12 Essay the day she finishes a book
- **Last example:** grade6-percy-jackson (2026-09-03)
```

How it runs:

- **Name today's move in the SET UP turn** and mark it in the CLOSE turn — in the journal metadata
  (`New move:`) and in one line of chat: *"① done — two left."* That one line is what makes
  progress *felt* rather than merely tracked.
- **The student reads this block.** `build-manifest.mjs` parses the bullets and the 🪜 Ladder page
  renders them as *"Your next moves"*, with the last four `New move:` lines under it as ✅ / ⬜.
  So write the three steps **to the kid** — second person, no *he/she*, no shorthand only a tutor
  would parse. The parenthetical tutor cues belong in `tutor.md`, not here.
- **The ratchet:** three clean sessions at a shape promotes it. Announce the promotion; it is a
  bigger deal than a badge.
- **Never two sessions in a row with no new move.** If the plan's next item doesn't fit today's
  reading, pick a different move — never skip the slot.
- **Rewrite the three sessions at `/weekly`**, or whenever a milestone lands.
- If a move fails twice, it is too big. Split it (*"three breaks"* → *"one break, right before
  the word But"*), never drop it silently.

## Growth templates (12–15) — built across days

**One normal-sized piece per day.** That is the whole design: the daily effort never grows, but the
pieces add up into an essay. Never ask a student for 350 words in one sitting — ask for a thesis
and one paragraph, which is what they already write every day.

- Each day is its own journal entry, its own XP, its own streak day. Nothing is "on hold".
- Add the metadata line `- **Build:** Essay — day 2 of 3`.
- On the **final day** the student pastes the whole piece together, reads it aloud and fixes it.
  That entry's `## My writing` holds the **complete** essay — that is what the portfolio measures
  for word and paragraph counts.
- Award the build bonus from `game/rules.md` on the final day.
- **Run it about once a week**, or the day a student finishes a book. Never two in a row, and never
  at the cost of the daily habit — the habit is what makes the ladder work.
- A build that would strand over a gap is better run as a **one-day** version at Tier 1: Jia's
  08-30 one-day 12 Essay worked precisely because there was nothing left hanging.

**Never gate them.** If a student wants template 12 before they have "finished" stage 3, let them,
at Tier 1, with the frame. Ambition is not something to ration.

## The goal is the student's to choose

```markdown
## Writing goal

- **Aiming for:** essay — 🏛️ Essay Writer
- **Chosen:** 2026-07-25 · **Why:** wants to write "a real essay, not just a paragraph"
```

The key is one of `journal · paragraph · evidence · essay · debater · critic · scholar`, and the
portfolio reads it from that line. If they pick a goal on the site it shows as *"picked here — tell
your tutor"* until it lands in `profile.md`; write it in at the next session and it becomes
official.

- **`/today` moves it.** Prefer the template and the stretch that advance the **nearest unmet
  milestone**. If they need a 3-paragraph piece, the stretch is "break this into 3 paragraphs" —
  not something unrelated.
- **`/weekly` checks it.** Report how many steps closer they got and name the single nearest
  milestone for next week.
- **Don't assign a goal they didn't choose.** A goal the kid picked is motivating; a goal the tutor
  assigned is homework. If they haven't chosen one, show them the Ladder page, read one stage's
  example aloud, and ask which one they *want to sound like*.
- Never talk a student down from an ambitious goal. Jia picked 🎓 Scholar — the hardest stage on
  the menu — on her second week. The answer to that is a path, not a smaller goal.

## Name the move — the praise glossary

Praise is where the essay vocabulary gets taught, because it arrives attached to something the
kid actually did. Give the move its grown-up name in the 🌟 line, and say which ladder stage it
belongs to when it is one they haven't reached yet — *"that's a concession, and it's the
⚖️ Debater move. You just did it in an ordinary entry."*

| What they wrote | What to call it |
|-----------------|-----------------|
| One sentence that says what the whole piece argues | **a thesis** |
| *"Some might say… but…"* | **a concession**, then **a rebuttal** |
| A quote dropped inside their own sentence | **an embedded quote** |
| *"This shows…"* / *"which means…"* after the evidence | **the explanation** — the half most writers skip |
| Naming what the author *did*, not what happened | **a craft claim** |
| *"it costs… but it buys…"* | **the critic's trade-off** |
| A last sentence that adds instead of repeating | **an ending that earns its place** |
| Arguing with the author's choice | **a critical reading** — you're reviewing, not just reporting |
| The same idea held across two books | **a comparative argument** — university writing |

Two cautions. Praising a move the student already owns reads as hollow to a strong writer
(**Jaei**) — praise the *specific choice* instead. And never invent the name: if what they wrote
isn't a thesis yet, say what would make it one, in their own sentence.
