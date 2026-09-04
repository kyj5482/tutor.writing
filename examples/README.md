# Example library

Every template, demonstrated on real books. The student sees one of these **before** they write,
so they know what the finished thing looks like — and so the example doubles as a book
recommendation at their grade level.

## Pick today's book in 10 seconds

1. Read `Last example:` in the student's `profile.md`.
2. Take the **next book in their grade's cycle** — never the one they saw last session.
3. If a *different* book in the cycle pairs better with what they're reading **today**, jump to it
   (that's the point of the cycle, not a violation of it) — just never land back on last session's.
4. Pull only the section you need, never the whole file:
   `sed -n '/^## 04 /,/^## 05 /p' examples/grade8-holes.md`
5. Record it: `Example shown:` in the journal metadata, `Last example:` in the profile.

| Grade | The cycle (in order) |
|-------|----------------------|
| **6 — Jia** | `grade6-hatchet` → `grade6-percy-jackson` → `grade6-a-wrinkle-in-time` → *(repeat)* |
| **8 — Jaei** | `grade8-the-giver` → `grade8-holes` → `grade8-the-hunger-games` → *(repeat)* |

Growth templates (12–15) have their own files — see the third table below. They sit **outside** the
cycle: use them on a build day, and let the cycle continue from where it was.

> **Why a cycle and not just a rule.** "Never the same book twice running" was the rule from day one
> and it was broken anyway — *Holes* showed up three times in five sessions and the students stopped
> reading the examples. An intention with no record isn't a rule. The record is `Last example:`.

**Say which book it is, and say it as a recommendation:** *"This one's from* Holes *— same kind of
clue-hunting as your 39 Clues, so watch how he handles the quote."* That single sentence is how a
reader finds their next book, and both of these students choose their own.

## The books

### Grade 6

| File | Book | Flavor | Best paired with |
|------|------|--------|------------------|
| `grade6-hatchet.md` | *Hatchet* — Gary Paulsen | survival, spare, one boy alone | action days, short chapters, "nothing happened but everything happened" |
| `grade6-percy-jackson.md` | *The Lightning Thief* — Rick Riordan | funny, fast, hidden-world fantasy | **Harry Potter and any magic-school / chosen-one book** |
| `grade6-a-wrinkle-in-time.md` | *A Wrinkle in Time* — Madeleine L'Engle | strange, quiet, big ideas | quote-hunting days, character feelings, thoughtful chapters |

### Grade 8

| File | Book | Flavor | Best paired with |
|------|------|--------|------------------|
| `grade8-the-giver.md` | *The Giver* — Lois Lowry | dystopia, controlled society, unease | theme work, "something is wrong here" books |
| `grade8-holes.md` | *Holes* — Louis Sachar | puzzle-box plot, braided timelines, dry humor | **The 39 Clues, mysteries, anything with clues that click together** |
| `grade8-the-hunger-games.md` | *The Hunger Games* — Suzanne Collins | dystopia, spectacle, moral traps | **Maze Runner / Scorch Trials, KOTLC, survival, high-stakes series** |

### Growth templates (12–15) — both grades

| File | Covers | Books used |
|------|--------|-----------|
| `grade6-growth.md` | 12 Essay · 13 Debate · 14 Craft Analysis · 15 Comparative | *Percy Jackson* (+ *Hatchet* for the comparison) |
| `grade6-debate-hatchet.md` | **13 Debate (second book)** | *Hatchet* |
| `grade6-essay-hatchet.md` | **12 Essay (second book)** | *Hatchet* |
| `grade8-growth.md` | 12 Essay · 13 Debate · 14 Craft Analysis · 15 Comparative | *Holes* (+ *The Hunger Games* for the comparison) |
| `grade8-essay-the-giver.md` | **12 Essay (second book)** | *The Giver* |
| `grade8-craft-analysis-hunger-games.md` | **14 Craft Analysis (second book)** | *The Hunger Games* |
| `grade8-comparative-giver-scorch-trials.md` | **15 Comparative Essay (second pair)** | *The Giver* + *The Scorch Trials* |

These deliberately reuse books the student has already seen shorter examples of, so they can flip
back and see the same thinking at journal length and at essay length. **Each example notes the
day-by-day build it came from — show that line.** A 340-word essay looks impossible until you see
it labelled "three normal sessions".

> **Two structural gaps, both found the hard way.** A template that is someone's *ladder goal* gets
> written most weeks, so one example for it means the same book every week (*Holes*, three times in
> five sessions). And a 4-day build shows its example four sessions running (15 Comparative,
> 2026-08-03). Both are fixed by adding a **second book for that template** — never by a fourth
> showing of the first one. **Template 12 got its second book on 2026-09-04** (*Hatchet* for
> grade 6, *The Giver* for grade 8) — ahead of the gap this time, because both students' step-up
> plans put an essay day in every week. **13 Debate at grade 8 is now the only single-example
> template left**; fix it the same way the first time a debate build repeats.

## Rules for picking one

1. **Never the same example book two sessions in a row.** The cycle above does this for you.
2. **Pair it to what they're reading today.** If Jia is deep in a magic-school book, Percy Jackson
   shows her a hidden-world story making the same move hers is making. If Jaei just finished a
   *39 Clues*, *Holes* shows him a clue-puzzle played at the top level.
3. **Rotate flavor, not just title.** Three hidden-world fantasies in a row is still monotony with
   three different covers. Follow a loud book with a quiet one.
4. **Say which book it is and why you picked it today** — one sentence (see above).
5. **The example is a demo, not a target.** Always follow it with *"Now it's your turn — about YOUR
   book"*, and say out loud that the examples are good, not perfect.
6. **Point at the move the student is working on today.** Grade 6 sets put the quote in the **main
   writing**, never saved for the bonus round. Grade 8 sets let characters **speak in their own
   words** instead of reporting what they said (templates 03, 06 and 07 show it most clearly). If a
   student's focus skill moves somewhere the library doesn't demonstrate, that's a sign the library
   needs another book — not that the student needs another correction.

## Adding a book

Copy the structure of any existing file: a header paragraph saying exactly how much of the book the
imaginary student read, a note about the tier, then all 11 templates in order (01–10 plus 11 ACE
Write). Then add it to the cycle table at the top — a book that isn't in the cycle won't get shown.

Two hard rules:

- **Only add books you can get factually right.** These are teaching materials — a wrong character
  name or an invented quote teaches the student something false about a real book. Books you
  half-remember belong in `library/reading-ladder.md` as recommendations, not here as examples.
- **Write them at Tier 2 for grade 6 and Tier 2–3 for grade 8**, and mark any example written a
  tier higher. Examples that are too polished stop being reachable.
