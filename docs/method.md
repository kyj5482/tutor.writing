# Why the rules are what they are

*Background, not instructions. **Never read this during a session** — it is here so a future
change is made with the evidence, instead of re-deriving it from scratch or quietly undoing it.*

---

## 1. Speed — measured 2026-08-18, and again 2026-09-04

Tutor feedback grew from ~2× the student's word count in June to **5–10× in August**: one entry
took in 37 student words and sent back **1,790**. `profile.md` had reached **19,000 words**, all
of it read before the greeting. Neither child can read 1,790 words of analysis, so none of it was
teaching — it was only latency.

The 2026-09-04 numbers, from `metrics/turns.jsonl`:

```
2026-08-19  Jia   15 turns   9m 53s
2026-08-30  Jia    8 turns   7m 39s
2026-09-02  Jia   10 turns   9m 06s
```

Nine minutes of a fifteen-minute session spent watching a spinner. Two causes, both fixable and
neither of them the model's speed:

- **Re-reading.** `CLAUDE.md` alone was 5,336 words, plus the command file, plus whole example and
  template files, every session. Cut to ~2,000 words with the rationale moved here; examples and
  templates are now read one **section** at a time with `sed`.
- **Turn count.** The budget said 3 turns; sessions ran 8–15, because "ask what they read" and
  "here are your choices" were packed into one message and the kid answered only the first half,
  which then cost two extra round trips to unpick.

**The current budget is 4 turns and ≤ 4 minutes of tutor typing**, and 4 conversational turns beat
3 crammed ones both on wall-clock and on how the session feels. `scripts/timing-report.mjs` prints
it after every session; a drift is fixed upstream — fewer turns, shorter feedback, less re-reading.

## 2. Why the session got its questions back (2026-09-04)

The three-turn rewrite optimized the wrong thing. Asking *"what did you read?"* inside the same
message that offers templates, an example and a frame means the tutor is guessing at the pairing
while pretending to ask — and the child reads a wall of text before saying a word. **The first
message now asks and stops.** It costs one short turn and buys the thing the whole method rests
on: an example chosen for the book actually in their hands, and a tutor who reacted to what they
said before telling them what to do.

## 3. Examples: rotation is a mechanism, not an intention

The rule "never the same example book twice running" existed from the start and was broken anyway
— *Holes* appeared three times in five sessions, and the students stopped reading the examples.
An intention with no record is not a rule, so the book is now written into the journal metadata
(`Example shown:`) and the profile (`Last example:`), and `examples/README.md` carries a fixed
cycle per grade. Two structural gaps found the same way: a template that is someone's ladder goal
gets shown every week, and a 4-day build shows one example four sessions running. Both are fixed
with a **second book for that template**, never a fourth showing of the first one.

## 4. Length: why the pieces stopped growing

Measured 2026-08-18 across 59 entries. **Jia sat between 60 and 100 words for two months, and 27
of her 29 entries were a single unbroken paragraph.** Jaei went backwards — 137–181 words in June,
94–97 in August — while writing 254 words across a four-day build. The ceiling was never ability:
**nobody asked on a normal day.**

A word quota makes it worse; a kid padding to 120 words writes a worse piece than one writing 80
honest ones. **Length is a by-product of how many moves a piece is asked to make**, which is why
the shape ladder (A → B → C) asks for a *turn* or a *second claim* and lets the words arrive on
their own.

Two things that looked like student failure and were not:

- **The paragraph break, six sessions running.** Jia was told "press Enter twice". In Claude Code,
  **Enter sends the message** — the ask was impossible. Told **Shift+Enter** once (09-02), she did
  it on the next try and again the session after. *When a kid fails the same simple ask three
  times, suspect the ask.*
- **Retrofitting a container.** Jaei shown the pivot word *after* drafting → one block. Told to
  *"type the three breaks first, then fill them"* → three paragraphs, 187 words, unprompted.
  **Hand him the empty blocks before the content.**

## 5. Correction doesn't teach; the rule does

Jaei was handed the repaired sentence for compound subjects **seven times over two months** and his
clean streak never left 0/3. Shown five of his own sentences and asked what they had in common, he
answered on the first guess and never made the error again. A repaired sentence teaches you that
one sentence. Hence the escalation ladder in `docs/watch-list.md` and the `lessons/` folder.

**Match the tool to the error.** *"Snape and Malfoy is"* **sounds fine**, so reading aloud will
never catch it; quotation marks and `'s` are silent, so the ear can't find them either. Sound
errors get the ear, rule errors get the rule, silent marks get a count. Using the wrong tool is how
a mistake survives two months.

## 6. Personalization is not decoration

The two students need genuinely different sessions, and the evidence is in their own writing:

- **Jia** — her ear is excellent, her eye is not; she self-corrects on every read-aloud and catches
  nothing silently. Warm-up works. **Two rounds of questions, then save** — every decline came
  after the third ask. Menus of *choices* get picked; menus of *tasks* get skipped. Unclaimed XP
  shown as a number is the strongest lever on her card.
- **Jaei** — skip the warm-up, give him the harder tier by default, one improvement only, and
  never lean on the streak (his one weak number). Craft questions get his best writing; plot-recall
  questions get his weakest. He audits the XP ledger and has been right every time.

`students/<name>/tutor.md` is that evidence in card form. Stale personalization is just a generic
tutor with extra files, so a session that reveals something new adds **one line** — never a
paragraph.

## 7. Progression: why a "new move" is now mandatory

The measured failure of late August was not quality — the entries were fine. It was **flatness**:
a Book Review at Tier 2 followed by a Connection at Tier 2 followed by a Book Review at Tier 2,
each one competent, none of them harder than the last. A student who cannot feel the difficulty
moving stops believing the ladder is real, and the daily habit becomes a diary with XP attached.

So the ratchet is now structural rather than a matter of the tutor's memory: one **named** new move
per session, recorded in the journal metadata; a shape held until three clean sessions promote it;
a `## Step-up plan` in the profile naming the next three sessions in order; one essay-shaped day a
week. It also gives the praise something true to say — *"that's a thesis"* lands because the kid
was asked for a thesis twenty minutes earlier and delivered one.
