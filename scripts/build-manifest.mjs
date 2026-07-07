#!/usr/bin/env node
// Scans students/*/journal/*.md and writes manifest.json for the portfolio site.
// Run from the repository root: node scripts/build-manifest.mjs

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const version = Date.now();

const root = process.cwd();
const studentsDir = join(root, 'students');
const students = [];

if (existsSync(studentsDir)) {
  for (const name of readdirSync(studentsDir).sort()) {
    if (name.startsWith('_') || name.startsWith('.')) continue;
    const journalDir = join(studentsDir, name, 'journal');
    if (!existsSync(journalDir)) continue;

    let grade = null;
    let xp = null;
    let level = null;
    let streak = null;
    let badges = [];
    const profilePath = join(studentsDir, name, 'profile.md');
    if (existsSync(profilePath)) {
      const profile = readFileSync(profilePath, 'utf8');
      const g = profile.match(/\*\*Grade:\*\*\s*(\d+)/);
      if (g) grade = g[1];
      const x = profile.match(/\*\*XP:\*\*\s*(\d+)/);
      if (x) xp = Number(x[1]);
      const l = profile.match(/\*\*Level:\*\*\s*(\d+)/);
      if (l) level = Number(l[1]);
      const s = profile.match(/\*\*Current streak:\*\*\s*(\d+)/);
      if (s) streak = Number(s[1]);

      // Parse the "## Badges" section. Handles both list styles used in profiles:
      //   "- 🚀 **First Words** — first entry (2026-06-19)"
      //   "- 🚀 First Words (earned 2026-06-09 — note)"
      const badgeSection = (profile.match(/^##\s+Badges\s*$([\s\S]*?)(?:^##\s|$(?![\r\n]))/m)
        || profile.match(/^##\s+Badges\s*$([\s\S]*)/m) || [])[1] || '';
      for (const line of badgeSection.split('\n')) {
        const m = line.match(/^\s*[-*]\s+(.+)$/);
        if (!m) continue;
        let rest = m[1].trim();
        const emoji = (rest.match(/^(\S+)/) || [])[1] || null;
        const date = (rest.match(/(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
        let bname;
        const bold = rest.match(/\*\*(.+?)\*\*/);
        if (bold) bname = bold[1].trim();
        else bname = rest.split(/\s+—|\s+\(| - /)[0].replace(/^[^A-Za-z]+/, '').trim();
        if (bname) badges.push({ name: bname, emoji, date });
      }
    }

    const entries = [];
    for (const f of readdirSync(journalDir).sort()) {
      if (!f.endsWith('.md')) continue;
      const md = readFileSync(join(journalDir, f), 'utf8');

      const date = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
      const slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

      // "- **Book:** *Hatchet* (chapter 4)" -> book: "Hatchet", reading: "chapter 4"
      let book = null;
      let reading = null;
      const bookLine = md.match(/\*\*Book:\*\*\s*(.+)/);
      if (bookLine) {
        let raw = bookLine[1].trim();
        const paren = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
        if (paren) {
          raw = paren[1];
          reading = paren[2];
        }
        book = raw.replace(/[*_]/g, '').trim() || null;
      }

      const tier = (md.match(/Tier\s*(\d)/) || [])[1];
      const xp = (md.match(/\*\*XP earned:\*\*\s*(\d+)/) || [])[1];
      const hasRevision = /^## Revision/m.test(md) &&
        (md.split(/^## Revision.*$/m)[1] || '').trim().length > 0;
      const hasBonus = /^## Bonus/m.test(md) &&
        (md.split(/^## Bonus.*$/m)[1] || '').trim().length > 0;

      entries.push({
        file: `students/${name}/journal/${f}`,
        date,
        slug,
        book: book || 'Unknown book',
        reading,
        tier: tier ? Number(tier) : null,
        xp: xp ? Number(xp) : null,
        hasRevision,
        hasBonus,
      });
    }

    // Weekly feedback reports (parent-only view on the site).
    const reports = [];
    const feedbackDir = join(studentsDir, name, 'feedback');
    if (existsSync(feedbackDir)) {
      for (const f of readdirSync(feedbackDir).sort()) {
        if (!f.endsWith('.md')) continue;
        const date = (f.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
        const kind = f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '') || 'report';
        reports.push({ file: `students/${name}/feedback/${f}`, date, kind });
      }
    }

    // Prefer the authoritative total from profile.md; fall back to summing entries.
    if (xp === null) {
      xp = entries.reduce((n, e) => n + (e.xp || 0), 0);
    }

    students.push({ name, grade, xp, level, streak, badges, entries, reports });
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
  `${students.reduce((n, s) => n + s.entries.length, 0)} entr(ies) · cache-bust v=${version}`
);
