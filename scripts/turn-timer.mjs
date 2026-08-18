#!/usr/bin/env node
/**
 * Turn timer — measures how long the *tutor* takes, not how long the child takes.
 *
 * Wired to two hooks:
 *   UserPromptSubmit → `start`   the child has sent something; the LLM begins working
 *   Stop             → `stop`    the LLM has finished its turn
 *
 * One turn = Stop − UserPromptSubmit, which includes model time AND the tool calls
 * (file reads, writes, git) made inside the turn — i.e. exactly the latency the child
 * sits through. The gap between a Stop and the *next* UserPromptSubmit is the child
 * reading and typing, and it is never inside a measured interval, so student time is
 * excluded by construction rather than by estimation.
 *
 * Writes one JSONL row per turn to metrics/turns.jsonl. Analyse with
 * `node scripts/timing-report.mjs`.
 *
 * Hooks must never break a session: every failure path exits 0 silently.
 */

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATE_DIR = join(root, '.metrics-state');
const LOG = join(root, 'metrics', 'turns.jsonl');

const mode = process.argv[2];

/** Read all of stdin. Hooks always get JSON, but tolerate an empty pipe. */
function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function parse(raw) {
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

/** Session ids come from the harness; keep them filesystem-safe regardless. */
const safe = (s) => String(s || 'unknown').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 120);

/**
 * The prompt text lives under different keys depending on harness version, and on
 * some events it is absent entirely. Any of these is fine; absence is also fine.
 */
function promptOf(j) {
  const p = j.prompt ?? j.user_prompt ?? j.message ?? j.text ?? '';
  return typeof p === 'string' ? p : '';
}

try {
  const j = parse(readStdin());
  const session = safe(j.session_id);
  const stateFile = join(STATE_DIR, `${session}.json`);

  if (mode === 'start') {
    mkdirSync(STATE_DIR, { recursive: true });
    const prompt = promptOf(j);
    writeFileSync(
      stateFile,
      JSON.stringify({
        startedAt: Date.now(),
        // Kept short: this is a label for grouping, not a transcript.
        prompt: prompt.replace(/\s+/g, ' ').trim().slice(0, 160),
      }),
    );
  } else if (mode === 'stop') {
    if (!existsSync(stateFile)) process.exit(0); // Stop without a prompt (resume, /clear) — nothing to time.
    const st = parse(readFileSync(stateFile, 'utf8'));
    if (!st.startedAt) process.exit(0);

    const ms = Date.now() - st.startedAt;
    // A turn longer than an hour means the machine slept or the session was abandoned.
    // Record it as-is but flag it so the report can drop it instead of skewing a median.
    const row = {
      ts: new Date().toISOString(),
      session,
      ms,
      prompt: st.prompt || '',
      suspect: ms > 3_600_000 || ms < 0 ? true : undefined,
    };
    mkdirSync(dirname(LOG), { recursive: true });
    appendFileSync(LOG, JSON.stringify(row) + '\n');
    rmSync(stateFile, { force: true });
  }
} catch {
  // Never surface a timing failure into the child's session.
}

process.exit(0);
