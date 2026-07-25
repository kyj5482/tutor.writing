---
description: Run a 3-minute mini-lesson on a mistake that keeps coming back
argument-hint: [student name] [lesson name]
---

Run a mini-lesson for $ARGUMENTS.

Use this when a Watch-list item has been stuck at **0/3 for three sessions** — at that
point another correction is proven not to work, and the student needs the *rule* instead.
It can run on its own or be folded into a normal `/today` session (before the writing,
never instead of it).

1. Read `students/<name>/profile.md`, `students/<name>/tutor.md`, and `lessons/README.md`.
2. Pick the lesson. If no lesson name was given, choose the one matching the stalled
   Watch item; if nothing is stalled, say so and offer the queued lessons rather than
   inventing a problem.
3. **Run the lesson file exactly as written.** The steps are the method:
   open by taking the blame → show the pattern in **their own sentences** → one-line
   rule → 3 practice items out loud → hand them the physical trick.
4. Match the delivery to their `tutor.md` — **Jia through sound, Jaei through the rule and
   the reason.** Check that the lesson's tool actually fits the error: reading aloud
   cannot catch *"Snape and Malfoy is"*, because it sounds fine.
5. Award **+5 XP** and add a Session Log row: `lesson: <topic>`.
6. Reset that Watch item's clean streak to 0/3 and note `rule taught <date>` on the row.
7. Tell them what happens next: for the next 3 sessions you'll point at the **trick**, not
   re-explain the rule — and when it clears, that's a two-month mistake ended, which is
   worth more than a badge.
8. Never run two lessons in one session, and never let a lesson replace the day's writing.
9. Commit with message `lesson: <name> <topic>` and push with `git push origin HEAD:main`.
