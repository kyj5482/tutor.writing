#!/usr/bin/env node
// Scans students/*/journal/*.md and writes manifest.json for the portfolio site.
// Run from the repository root: node scripts/build-manifest.mjs
//
// Beyond indexing entries, this also computes the signals the portfolio needs:
//   · series/volume shelving for the library (library/series.json)
//   · progress counters so unearned stamps can show HOW FAR ALONG they are
//   · writing-ladder evidence (word counts, paragraphs, quotes, counterarguments)
// Everything here is derived from files the tutor already writes — no new bookkeeping.

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const version = Date.now();
const root = process.cwd();

/* ---------------- series registry ---------------- */

let SERIES = [];
const seriesPath = join(root, 'library', 'series.json');
if (existsSync(seriesPath)) {
  try {
    SERIES = (JSON.parse(readFileSync(seriesPath, 'utf8')).series || []);
  } catch (err) {
    console.warn(`⚠️  library/series.json could not be parsed (${err.message}) — shelving every book standalone.`);
  }
}

const norm = (s) => (s || '')
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[–—]/g, '-')
  .replace(/\s+/g, ' ')
  .trim();

/** Split "The 39 Clues: Storm Warning by Linda Sue Park" into title + author. */
function splitAuthor(raw) {
  // "Into the Gauntlet by" — the journal left the author blank; drop the dangling "by".
  const s = raw.replace(/\s+by\s*$/i, '').trim();
  const m = s.match(/^(.*?)\s+by\s+(.*)$/i);
  if (!m) return { title: s, author: null };
  const author = m[2].trim();
  if (!author) return { title: m[1].trim(), author: null };
  return { title: m[1].trim(), author };
}

/** The ten daily templates, in order. Journal slugs sometimes omit the number. */
const TEMPLATE_IDS = [
  '01-summary', '02-prediction', '03-character-diary', '04-opinion',
  '05-letter-to-character', '06-rewrite-the-scene', '07-golden-line',
  '08-connection', '09-quick-write-321', '10-book-review',
];

/** "summary" / "1-summary" / "01-summary" all resolve to "01-summary". */
function canonicalTemplate(slug) {
  const bare = slug.replace(/^\d+-/, '');
  return TEMPLATE_IDS.find((id) => id === slug || id.slice(3) === bare || id.endsWith('-' + bare)) || slug;
}

/**
 * Resolve a raw book title to a canonical book: which series shelf it belongs on,
 * which volume it is, and the one title all its spellings collapse into.
 */
function resolveBook(rawTitle) {
  const t = norm(rawTitle);
  if (!t) return { key: 'unknown', title: 'Unknown book' };

  for (const s of SERIES) {
    let hit = (s.match || []).some((p) => new RegExp(p, 'i').test(t));
    let vol = null;

    // Strip the series prefix, then match what remains: "the 39 clues: storm warning" -> "storm warning"
    if (hit) {
      const rest = t.replace(/^[^:]*:\s*/, '');
      vol = (s.volumes || []).find((v) =>
        (v.aliases || []).some((a) => norm(a) === rest || norm(a) === t));
    }
    // A standalone volume title ("Neverseen") still belongs to its series.
    if (!vol) {
      const byAlias = (s.volumes || []).find((v) =>
        (v.aliases || []).some((a) => norm(a) === t));
      if (byAlias) { hit = true; vol = byAlias; }
    }
    if (!hit) continue;

    if (!vol) {
      // In the series, but the volume isn't named (e.g. just "The Land of Stories").
      return { key: `series:${norm(s.name)}`, title: s.name, short: s.name,
               series: s.name, seriesEmoji: s.emoji || '📚', seriesTotal: s.total || null, volume: null };
    }
    const title = s.titleStyle === 'full'
      ? `${s.name} and the ${vol.short}`
      : `${s.name}: ${vol.short}`;
    return {
      key: `${norm(s.name)}#${vol.n}`,
      title, short: vol.short,
      series: s.name, seriesEmoji: s.emoji || '📚', seriesTotal: s.total || null,
      volume: vol.n,
    };
  }
  // Standalone book.
  const clean = rawTitle.trim();
  return { key: `book:${t}`, title: clean, short: clean };
}

/* ---------------- entry text analysis ---------------- */

const RE = {
  // A real quote from the book: 8+ characters inside quotation marks.
  quote: /["“][^"”\n]{8,}["”]/,
  // Arguing the other side — the move that separates an opinion from an argument.
  counter: /\b(some might say|some may say|some might argue|one could argue|others might|other people might|some people think|on the other hand|even though|although|critics might)\b/i,
  // Talking about how the author built it, not just what happened.
  craft: /\b(the author|the writer|point of view|1st person|3rd person|first person|third person|on purpose|chose the word|wrote it this way|the way (he|she|they) wrote)\b/i,
  // Holding two texts side by side.
  compare: /\b(compared to|in comparison|both books|unlike .{0,40}\b(book|story|novel)|the other book)\b/i,
};

function analyzeEntry(md) {
  const parts = md.split(/^## +/m);
  const sec = { writing: '', feedback: '', revision: '', bonus: '' };
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n');
    const head = (nl === -1 ? part : part.slice(0, nl)).trim().toLowerCase();
    const body = (nl === -1 ? '' : part.slice(nl + 1)).trim();
    if (head.startsWith('my writing')) sec.writing = body;
    else if (head.startsWith('tutor feedback')) sec.feedback = body;
    else if (head.startsWith('revision')) sec.revision = body;
    else if (head.startsWith('bonus')) sec.bonus = body;
  }

  const writing = sec.writing;
  // The bonus section starts with the tutor's question — only the student's answer counts.
  const bonusAnswer = sec.bonus.replace(/^\*\*Question:\*\*.*$/m, '');
  const scanned = `${writing}\n${bonusAnswer}`;

  const words = writing.split(/\s+/).filter(Boolean).length;
  const paragraphs = writing.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean).length;

  return {
    sections: sec,
    words,
    paragraphs,
    hasRevision: sec.revision.length > 0 && !/^no revision/i.test(sec.revision),
    hasBonus: bonusAnswer.trim().length > 0,
    quote: RE.quote.test(scanned),
    counter: RE.counter.test(scanned),
    craft: RE.craft.test(scanned),
    compare: RE.compare.test(scanned),
    excerpt: writing.replace(/\s+/g, ' ').slice(0, 180),
  };
}

/* ---------------- profile parsing ---------------- */

function parseProfile(profile) {
  const out = { grade: null, xp: null, level: null, streak: null, bestStreak: null,
                badges: [], tiers: {}, goal: null, watch: [], lessons: 0, finishedTitles: [] };

  const grab = (re) => (profile.match(re) || [])[1] || null;
  out.grade = grab(/\*\*Grade:\*\*\s*(\d+)/);
  const xp = grab(/\*\*XP:\*\*\s*(\d+)/);
  const lv = grab(/\*\*Level:\*\*\s*(\d+)/);
  const st = grab(/\*\*Current streak:\*\*\s*(\d+)/);
  const best = grab(/\*\*Current streak:\*\*\s*\d+\s*days?\s*\(best:\s*(\d+)/);
  if (xp) out.xp = Number(xp);
  if (lv) out.level = Number(lv);
  if (st) out.streak = Number(st);
  if (best) out.bestStreak = Number(best);

  // ---- Badges. Every list item under "## Badges" counts, so only COMPLETED
  // stamp cards belong there; in-progress notes must not be list items.
  const badgeSection = (profile.match(/^##\s+Badges\s*$([\s\S]*?)(?:^##\s|$(?![\r\n]))/m)
    || profile.match(/^##\s+Badges\s*$([\s\S]*)/m) || [])[1] || '';
  for (const line of badgeSection.split('\n')) {
    const m = line.match(/^\s*[-*]\s+(.+)$/);
    if (!m) continue;
    const rest = m[1].trim();
    const emoji = (rest.match(/^(\S+)/) || [])[1] || null;
    const date = (rest.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
    const bold = rest.match(/\*\*(.+?)\*\*/);
    const name = bold ? bold[1].trim()
      : rest.split(/\s+—|\s+\(| - /)[0].replace(/^[^A-Za-z]+/, '').trim();
    if (name) out.badges.push({ name, emoji, date });
  }

  // ---- Skill tiers: "| Structure (…) | 2 | notes |"
  const tierSection = (profile.match(/^##\s+Skill tiers\s*$([\s\S]*?)(?:^##\s|$(?![\r\n]))/m) || [])[1] || '';
  for (const line of tierSection.split('\n')) {
    const m = line.match(/^\|\s*([A-Za-z]+)[^|]*\|\s*(\d)\s*\|/);
    if (m) out.tiers[m[1].toLowerCase()] = Number(m[2]);
  }

  // ---- Writing goal: "- **Aiming for:** essay — Essay Writer"
  // Scoped to the section AND anchored to the start of a bullet, so prose that merely
  // *quotes* the line ("replace it with `Aiming for: essay`") is never mistaken for it.
  const goalSection = (profile.match(/^##\s+Writing goal\s*$([\s\S]*?)(?:^##\s|$(?![\r\n]))/m) || [])[1] || '';
  const goalKey = (goalSection.match(/^\s*-\s*\*\*Aiming for:\*\*\s*([a-z]+)\b/mi) || [])[1];
  if (goalKey) out.goal = goalKey.toLowerCase();

  // ---- Watch list clean streaks: "- [ ] **item** — clean streak: 1/3"
  const watchSection = (profile.match(/^##\s+Watch list\s*$([\s\S]*?)(?:^##\s|$(?![\r\n]))/m) || [])[1] || '';
  for (const line of watchSection.split('\n')) {
    const m = line.match(/^\s*-\s*\[([ x])\]\s*\*\*(.+?)\*\*/);
    if (!m) continue;
    const streak = (line.match(/clean streak:\s*\**\s*(\d)\s*\/\s*3/) || [])[1];
    out.watch.push({ item: m[2].trim(), cleared: m[1] === 'x', streak: streak ? Number(streak) : 0 });
  }

  // ---- Mini-lessons completed (Session Log rows).
  out.lessons = (profile.match(/lesson:/gi) || []).length;

  // ---- Books the profile records as finished.
  const finished = grab(/\*\*Books finished:\*\*\s*(.+)/);
  if (finished) {
    const chunks = finished.includes(';') ? finished.split(';') : finished.split(/,(?![^(]*\))/);
    for (let c of chunks) {
      c = c.replace(/\([^)]*\)/g, '').trim();
      if (c) out.finishedTitles.push(splitAuthor(c).title);
    }
  }
  return out;
}

/* ---------------- build ---------------- */

const studentsDir = join(root, 'students');
const students = [];

if (existsSync(studentsDir)) {
  for (const name of readdirSync(studentsDir).sort()) {
    if (name.startsWith('_') || name.startsWith('.')) continue;
    const journalDir = join(studentsDir, name, 'journal');
    if (!existsSync(journalDir)) continue;

    const profilePath = join(studentsDir, name, 'profile.md');
    const prof = existsSync(profilePath)
      ? parseProfile(readFileSync(profilePath, 'utf8'))
      : parseProfile('');

    const entries = [];
    const books = new Map();

    for (const f of readdirSync(journalDir).sort()) {
      if (!f.endsWith('.md')) continue;
      const md = readFileSync(join(journalDir, f), 'utf8');
      const date = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
      const slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

      // "- **Book:** The 39 Clues: Storm Warning by Linda Sue Park (finished the book)"
      let rawBook = null, reading = null;
      const bookLine = md.match(/\*\*Book:\*\*\s*(.+)/);
      if (bookLine) {
        let raw = bookLine[1].trim();
        const paren = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
        if (paren) { raw = paren[1]; reading = paren[2]; }
        rawBook = raw.replace(/[*_]/g, '').trim() || null;
      }
      const { title: rawTitle, author } = splitAuthor(rawBook || '');
      const book = resolveBook(rawTitle);

      const a = analyzeEntry(md);
      const tier = (md.match(/Tier\s*(\d)/) || [])[1];
      const xp = (md.match(/\*\*XP earned:\*\*\s*(\d+)/) || [])[1];

      // Optional session-check metadata (see CLAUDE.md journal format).
      const readAloud = /\*\*Read-aloud:\*\*\s*✅/.test(md);
      const watchClean = /\*\*Watch list:\*\*\s*✅/.test(md);
      const watchSlip = /\*\*Watch list:\*\*\s*⚠️/.test(md);

      const entry = {
        file: `students/${name}/journal/${f}`,
        date, slug,
        book: book.title, bookKey: book.key, bookShort: book.short || book.title,
        series: book.series || null, seriesEmoji: book.seriesEmoji || null, volume: book.volume || null,
        author: author || null,
        reading,
        tier: tier ? Number(tier) : null,
        xp: xp ? Number(xp) : null,
        words: a.words, paragraphs: a.paragraphs,
        hasRevision: a.hasRevision, hasBonus: a.hasBonus,
        quote: a.quote, counter: a.counter, craft: a.craft, compare: a.compare,
        readAloud, watchClean, watchSlip,
        excerpt: a.excerpt,
      };
      entries.push(entry);

      if (!books.has(book.key)) {
        books.set(book.key, {
          key: book.key, title: book.title, short: book.short || book.title,
          series: book.series || null, seriesEmoji: book.seriesEmoji || null,
          seriesTotal: book.seriesTotal || null, volume: book.volume || null,
          author: author || null, entries: 0, words: 0,
          first: date, last: date, finished: false,
        });
      }
      const b = books.get(book.key);
      b.entries += 1;
      b.words += a.words;
      if (!b.author && author) b.author = author;
      if (date && (!b.first || date < b.first)) b.first = date;
      if (date && (!b.last || date > b.last)) b.last = date;
      if (reading && /finish/i.test(reading)) b.finished = true;
    }

    // A book the profile lists as finished, even if no entry's reading line said so.
    for (const t of prof.finishedTitles) {
      const r = resolveBook(t);
      if (books.has(r.key)) books.get(r.key).finished = true;
    }

    const bookList = [...books.values()].sort((a, b) => (b.last || '').localeCompare(a.last || ''));

    /* ---- progress counters (used by the Stamp Book and the Writing Ladder) ---- */
    const templatesUsed = [...new Set(entries.map((e) => canonicalTemplate(e.slug)))]
      .filter((t) => TEMPLATE_IDS.includes(t)).sort();
    const dates = [...new Set(entries.map((e) => e.date).filter(Boolean))].sort();

    let cleanRun = 0, bestClean = 0;
    for (const e of entries) {
      if (e.watchClean) { cleanRun += 1; bestClean = Math.max(bestClean, cleanRun); }
      else if (e.watchSlip) cleanRun = 0;
    }

    const count = (fn) => entries.filter(fn).length;
    const stats = {
      entries: entries.length,
      activeDays: dates.length,
      templatesUsed,
      revisions: count((e) => e.hasRevision),
      ace: count((e) => e.hasBonus),
      quotes: count((e) => e.quote),
      counter: count((e) => e.counter),
      craft: count((e) => e.craft),
      compare: count((e) => e.compare),
      tier3: count((e) => e.tier === 3),
      readAlouds: count((e) => e.readAloud),
      cleanEntries: count((e) => e.watchClean),
      cleanStreak: cleanRun,
      bestCleanStreak: bestClean,
      lessons: prof.lessons,
      bookReviews: count((e) => /book-review/.test(e.slug)),
      booksStarted: bookList.length,
      booksFinished: bookList.filter((b) => b.finished).length,
      maxWords: entries.reduce((m, e) => Math.max(m, e.words), 0),
      totalWords: entries.reduce((m, e) => m + e.words, 0),
      maxParagraphs: entries.reduce((m, e) => Math.max(m, e.paragraphs), 0),
      // An argued, multi-paragraph piece — the actual shape of an essay.
      essayShaped: count((e) => e.paragraphs >= 3 && e.words >= 200),
      debateShaped: count((e) => e.counter && e.paragraphs >= 2),
      bestStreak: prof.bestStreak,
      streak: prof.streak,
    };

    const reports = [];
    const feedbackDir = join(studentsDir, name, 'feedback');
    if (existsSync(feedbackDir)) {
      for (const f of readdirSync(feedbackDir).sort()) {
        if (!f.endsWith('.md')) continue;
        reports.push({
          file: `students/${name}/feedback/${f}`,
          date: (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null,
          kind: f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '') || 'report',
        });
      }
    }

    const xp = prof.xp !== null ? prof.xp : entries.reduce((n, e) => n + (e.xp || 0), 0);

    students.push({
      name, grade: prof.grade, xp, level: prof.level, streak: prof.streak,
      badges: prof.badges, tiers: prof.tiers, goal: prof.goal, watch: prof.watch,
      stats, books: bookList, entries, reports,
    });
  }
}

const manifest = { generated: new Date().toISOString(), students };
writeFileSync(join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// Stamp index.html with ?v=<timestamp> so mobile browsers always fetch fresh assets.
const indexPath = join(root, 'index.html');
let html = readFileSync(indexPath, 'utf8');
html = html
  .replace(/(href="assets\/style\.css)(?:\?v=\d+)?(")/g, `$1?v=${version}$2`)
  .replace(/(src="assets\/app\.js)(?:\?v=\d+)?(")/g, `$1?v=${version}$2`);
writeFileSync(indexPath, html);

console.log(
  `manifest.json: ${students.length} student(s), ` +
  `${students.reduce((n, s) => n + s.entries.length, 0)} entr(ies), ` +
  `${students.reduce((n, s) => n + s.books.length, 0)} book(s) · cache-bust v=${version}`
);
