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
    const profilePath = join(studentsDir, name, 'profile.md');
    if (existsSync(profilePath)) {
      const m = readFileSync(profilePath, 'utf8').match(/\*\*Grade:\*\*\s*(\d+)/);
      if (m) grade = m[1];
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

    students.push({ name, grade, entries });
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
