---
description: Weekly feedback report for a student (last 7 days of journal entries)
argument-hint: [student name]
---

Write the weekly feedback report for $ARGUMENTS (if no name given, do it for every
student who has journal entries this week).

Follow the **Weekly feedback** section of CLAUDE.md:

1. Read the student's `profile.md` and ALL journal entries from the last 7 days in
   `students/<name>/journal/`.
2. Write `students/<name>/feedback/<today's date>-weekly.md` with the 7 required
   sections: Week in numbers · Growth I noticed (quote their early-week vs.
   late-week sentences) · Focus for next week (ONE growth skill + mini-example) · Tier
   check · Watch-list check (clean streaks; retire at 3/3; add recurring slips) ·
   Badges & level · 부모님께 (Korean note for the parent).
3. Apply updates to `profile.md`: new focus skill, any tier promotions, the **Watch
   list** (advance/retire/add items), and the +15 XP bonus if they wrote 5+ entries
   this week.
4. Share the report in chat — the growth section and the Korean parent note are the
   highlights.
5. Commit: `feedback: <name> weekly <date>`, then push with `git push origin HEAD:main`.
