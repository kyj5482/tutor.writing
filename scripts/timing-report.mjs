#!/usr/bin/env node
/**
 * Reads metrics/turns.jsonl and reports how long the tutor takes per session.
 *
 * Only LLM time is in the data — see scripts/turn-timer.mjs — so these numbers are
 * the latency the student actually sits through, with their own typing excluded.
 *
 *   node scripts/timing-report.mjs           # /today and /weekend sessions
 *   node scripts/timing-report.mjs --all     # every session
 *   node scripts/timing-report.mjs --json    # machine-readable
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOG = join(root, 'metrics', 'turns.jsonl');

const args = new Set(process.argv.slice(2));
const showAll = args.has('--all');
const asJson = args.has('--json');

if (!existsSync(LOG)) {
  console.log('No timings yet — metrics/turns.jsonl will appear after the next session.');
  process.exit(0);
}

const rows = readFileSync(LOG, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  })
  .filter((r) => r && typeof r.ms === 'number' && !r.suspect);

/* A session is a /today (or /weekend) session if any of its prompts invoked the skill. Sessions are
 * grouped by id, and the first timestamp orders them. */
const sessions = new Map();
for (const r of rows) {
  let s = sessions.get(r.session);
  if (!s) sessions.set(r.session, (s = { id: r.session, turns: [], isToday: false, first: r.ts }));
  s.turns.push(r);
  if (r.ts < s.first) s.first = r.ts;
  if (/(^|\s|\/)(today|weekend)\b/i.test(r.prompt || '')) s.isToday = true;
  if (/(^|\s|\/)weekend\b/i.test(r.prompt || '')) s.kind = 'weekend';
  // The student's name usually rides along with the invocation.
  const who = (r.prompt || '').match(/\b(Jia|Jaei)\b/i);
  if (who && !s.who) s.who = who[1];
}

const list = [...sessions.values()]
  .filter((s) => showAll || s.isToday)
  .sort((a, b) => a.first.localeCompare(b.first))
  .map((s) => {
    const ms = s.turns.map((t) => t.ms);
    return {
      id: s.id,
      who: s.who || '—',
      kind: s.kind || (s.isToday ? 'today' : '—'),
      date: s.first.slice(0, 10),
      turns: ms.length,
      totalMs: ms.reduce((a, b) => a + b, 0),
      maxMs: Math.max(...ms),
    };
  });

const fmt = (ms) => {
  const s = ms / 1000;
  return s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s`;
};
const median = (a) => {
  if (!a.length) return 0;
  const x = [...a].sort((p, q) => p - q);
  const m = x.length >> 1;
  return x.length % 2 ? x[m] : (x[m - 1] + x[m]) / 2;
};
const pct = (a, p) => {
  if (!a.length) return 0;
  const x = [...a].sort((q, r) => q - r);
  return x[Math.min(x.length - 1, Math.floor((p / 100) * x.length))];
};

if (asJson) {
  console.log(JSON.stringify({ sessions: list }, null, 2));
  process.exit(0);
}

if (!list.length) {
  console.log(
    showAll
      ? 'No sessions recorded yet.'
      : 'No /today or /weekend sessions recorded yet. Run with --all to see every session.',
  );
  process.exit(0);
}

/* /today: 3 turns (open → they write → close). /weekend: 4, and a 5th is the optional ACE round. */
const TURN_BUDGET = 5;

const label = showAll ? 'all sessions' : '/today + /weekend sessions';
console.log(`\n📊 Tutor LLM time — ${label} (student typing excluded)\n`);
console.log('  date        who    kind      turns   total LLM   slowest turn');
console.log('  ' + '─'.repeat(62));
for (const s of list) {
  console.log(
    `  ${s.date}  ${s.who.padEnd(5)}  ${s.kind.padEnd(8)}  ${String(s.turns).padStart(4)}   ${fmt(s.totalMs).padStart(9)}   ${fmt(s.maxMs).padStart(11)}`,
  );
}

const totals = list.map((s) => s.totalMs);
const turns = list.map((s) => s.turns);
const maxes = list.map((s) => s.maxMs);

console.log(`\n  Summary over ${list.length} session(s)`);
console.log(`    total LLM time   median ${fmt(median(totals))} · mean ${fmt(totals.reduce((a, b) => a + b, 0) / totals.length)} · p90 ${fmt(pct(totals, 90))}`);
console.log(`    turns/session    median ${median(turns)} · budget ${TURN_BUDGET} ${median(turns) <= TURN_BUDGET ? '✅' : '⚠️  over budget'}`);
console.log(`    slowest turn     median ${fmt(median(maxes))} · worst ${fmt(Math.max(...maxes))} · budget 45s /today · 60s /weekend`);
console.log(`    session total    budget 2m 30s /today · 4m 00s /weekend`);
console.log(
  `\n  The budget in CLAUDE.md: /today is three turns — open → they write → close;\n` +
    `  /weekend is four — ask → set up → they write → close (five with the ACE bonus).\n` +
    `  More than that means a message got split up — the fix is fewer, fuller\n` +
    `  messages, not faster typing.\n`,
);
