/* Writing portfolio — reads manifest.json + journal markdown files and renders them.
   No build step: works on GitHub Pages and with any static file server.

   Five things this site is for:
     📚 Library  — every book you've read, shelved by series. Your bookshelf.
     🪜 Ladder   — pick the level you want to write at, and watch yourself climb.
     🏅 Stamps   — collect stamps; unearned ones show HOW FAR you've come.
     🔎 Notes    — search everything you've ever written, and reuse it.
     📅 Timeline — the whole story, newest first.
*/

const TEMPLATES = {
  '01-summary':            { name: 'Summary',               icon: '📋' },
  '02-prediction':         { name: 'Prediction',            icon: '🔮' },
  '03-character-diary':    { name: 'Character Diary',       icon: '📔' },
  '04-opinion':            { name: 'Opinion / Response',    icon: '💭' },
  '05-letter-to-character':{ name: 'Letter to a Character', icon: '✉️' },
  '06-rewrite-the-scene':  { name: 'Rewrite the Scene',     icon: '🎬' },
  '07-golden-line':        { name: 'Golden Line',           icon: '✨' },
  '08-connection':         { name: 'Connection',            icon: '🔗' },
  '09-quick-write-321':    { name: 'Quick Write 3-2-1',     icon: '⚡' },
  '10-book-review':        { name: 'Book Review',           icon: '⭐' },
  // Growth templates — these climb the top of the ladder. Not part of "all 10 templates".
  '12-essay':              { name: 'Essay',                 icon: '🏛️', growth: true },
  '13-debate':             { name: 'Debate',                icon: '⚖️', growth: true },
  '14-craft-analysis':     { name: 'Craft Analysis',        icon: '🔬', growth: true },
  '15-comparative-essay':  { name: 'Comparative Essay',     icon: '🎓', growth: true },
};
/* The ten DAILY templates only — this is what "Template Master" counts. */
const TEMPLATE_IDS = Object.keys(TEMPLATES).filter((k) => !TEMPLATES[k].growth);

const COVER_GRADIENTS = [
  ['#667eea', '#764ba2'], ['#f0648c', '#f9a26c'], ['#11998e', '#38ef7d'],
  ['#fc4a1a', '#f7b733'], ['#396afc', '#2948ff'], ['#b24592', '#f15f79'],
  ['#159957', '#155799'], ['#ee0979', '#ff6a00'], ['#7f00ff', '#e100ff'],
  ['#56ab2f', '#a8e063'],
];
const COVER_EMOJIS = ['📕', '📗', '📘', '📙', '📚', '🦉', '🦊', '🐉', '🚀', '🌋'];

/* ============================================================================
   THE WRITING LADDER
   Seven stages from "I wrote a paragraph" to "I can argue across two books".
   Every milestone is measured from writing that already exists — nothing here
   is a guess, and nothing needs new bookkeeping.
   ========================================================================== */

const LADDER = [
  {
    id: 1, key: 'journal', emoji: '📝', name: 'Journal Writer', ko: '일기 작가',
    tagline: 'Say what happened, in your own clear sentences.',
    move: 'Real names and one specific detail — not "he did stuff".',
    sample: 'Today I read chapter four. Harry found a diary in the flooded bathroom, and when he wrote in it, the diary wrote back. That was the creepiest part of the whole chapter.',
    milestones: [
      { label: 'Write 3 entries', now: (s) => s.stats.entries, need: 3 },
      { label: 'Try 2 different templates', now: (s) => s.stats.templatesUsed.length, need: 2 },
      { label: 'Structure skill at Tier 1', now: (s) => s.tiers.structure || 0, need: 1, unit: 'tier' },
    ],
  },
  {
    id: 2, key: 'paragraph', emoji: '🧩', name: 'Paragraph Builder', ko: '문단 만들기',
    tagline: 'One paragraph, in order, that goes somewhere.',
    move: 'A topic sentence, order words (first / after that / finally), and a because.',
    sample: 'Today\'s part of <i>Order of the Phoenix</i> was about Harry losing control. <b>First</b>, Snape made him do Occlumency lessons. <b>After that</b>, Harry felt like he was getting worse instead of better. <b>Finally</b>, Umbridge became Headmistress <b>because</b> Dumbledore took the blame for the DA.',
    milestones: [
      { label: 'Structure skill at Tier 2', now: (s) => s.tiers.structure || 0, need: 2, unit: 'tier' },
      { label: 'Explanation skill at Tier 2', now: (s) => s.tiers.explanation || 0, need: 2, unit: 'tier' },
      { label: 'Write 10 entries', now: (s) => s.stats.entries, need: 10 },
      { label: 'Try 5 different templates', now: (s) => s.stats.templatesUsed.length, need: 5 },
    ],
  },
  {
    id: 3, key: 'evidence', emoji: '🔍', name: 'Evidence Writer', ko: '근거로 쓰기',
    tagline: 'Don\'t just say it — prove it with the book.',
    move: 'Claim → a real quote in "quotation marks" → why it matters.',
    sample: 'Snape is hiding which side he is really on. In the book, he tells Malfoy, <b>"I can\'t break the Unbreakable Vow."</b> <b>This shows</b> that even if Snape wanted to help Dumbledore, the magic itself would kill him — so his choice was taken away before the story even started.',
    milestones: [
      { label: 'Evidence skill at Tier 2', now: (s) => s.tiers.evidence || 0, need: 2, unit: 'tier' },
      { label: 'Use a real quote in 5 entries', now: (s) => s.stats.quotes, need: 5 },
      { label: 'Finish 10 ACE bonus rounds', now: (s) => s.stats.ace, need: 10 },
      { label: 'Write one 120-word entry', now: (s) => s.stats.maxWords, need: 120, unit: 'words' },
    ],
  },
  {
    id: 4, key: 'essay', emoji: '🏛️', name: 'Essay Writer', ko: '에세이 작가',
    tagline: 'More than a paragraph — an argument with a shape.',
    move: 'Thesis → 2 evidence paragraphs → an ending that adds something new.',
    sample: 'Camp Green Lake is not a rehabilitation program, it is unpaid labor with a slogan on top.<br><br>The adults repeat that digging "turns a bad boy into a good boy" — but notice what that lets them skip. Nobody ever asks a boy what he did, or whether he did it.<br><br>That is the real function of the motto: it turns a question about justice into a question about sweat.',
    template: '12-essay',
    build: 3,
    milestones: [
      { label: 'Evidence skill at Tier 3', now: (s) => s.tiers.evidence || 0, need: 3, unit: 'tier' },
      { label: 'Write 5 Tier-3 entries', now: (s) => s.stats.tier3, need: 5 },
      { label: 'Write an entry with 3 paragraphs', now: (s) => s.stats.maxParagraphs, need: 3, unit: 'paragraphs' },
      { label: 'Write a full essay (3 paragraphs, 200+ words)', now: (s) => s.stats.essayShaped, need: 1 },
    ],
  },
  {
    id: 5, key: 'debater', emoji: '⚖️', name: 'Debater', ko: '토론하기',
    tagline: 'Argue the other side better than they can — then answer it.',
    move: 'Concede what\'s true in the other view, then show why yours still wins.',
    sample: '<b>Some might argue</b> this makes Katniss less heroic, and I understand the objection: choosing freely is what makes a sacrifice mean something. <b>But I\'d say the opposite.</b> A person who has to weigh saving their sister has a choice. Katniss has a reflex — and the Capitol installed it.',
    template: '13-debate',
    build: 2,
    milestones: [
      { label: 'Style skill at Tier 3', now: (s) => s.tiers.style || 0, need: 3, unit: 'tier' },
      { label: 'Argue the other side in 5 entries', now: (s) => s.stats.counter, need: 5 },
      { label: 'Write 3 argued, multi-paragraph pieces', now: (s) => s.stats.debateShaped, need: 3 },
      { label: 'Write one 300-word entry', now: (s) => s.stats.maxWords, need: 300, unit: 'words' },
    ],
  },
  {
    id: 6, key: 'critic', emoji: '🔬', name: 'Critic', ko: '비평가',
    tagline: 'Not what happened — how the author built it.',
    move: 'Name a technique, prove it with the text, say what it costs and buys.',
    sample: 'Sachar runs three timelines and never explains how they connect. That changes what suspense means here: we aren\'t waiting to find out what happened, we\'re waiting for Stanley to catch up to what we already know. It costs him pacing in the middle — and buys an ending you feel a beat before he does.',
    template: '14-craft-analysis',
    build: 2,
    milestones: [
      { label: 'All four skills at Tier 3', now: (s) => [ 'structure', 'evidence', 'explanation', 'style' ].filter((k) => (s.tiers[k] || 0) >= 3).length, need: 4, unit: 'skills' },
      { label: 'Analyze the author\'s craft in 5 entries', now: (s) => s.stats.craft, need: 5 },
      { label: 'Review 3 books you finished', now: (s) => s.stats.bookReviews, need: 3 },
      { label: 'Write one 450-word entry', now: (s) => s.stats.maxWords, need: 450, unit: 'words' },
    ],
  },
  {
    id: 7, key: 'scholar', emoji: '🎓', name: 'Scholar', ko: '연구자',
    tagline: 'One argument, held across two books. This is university writing.',
    move: 'A question worth asking, answered with evidence from more than one text.',
    sample: 'Both <i>Holes</i> and <i>The Hunger Games</i> hand their heroes a system that claims to be fair. Sachar hides the unfairness in a slogan; Collins broadcasts it as entertainment. The difference is who is asked to look away — and in Collins, it turns out to be us.',
    template: '15-comparative-essay',
    build: 4,
    milestones: [
      { label: 'Compare two books in 2 entries', now: (s) => s.stats.compare, need: 2 },
      { label: 'Write 10 full essays', now: (s) => s.stats.essayShaped, need: 10 },
      { label: 'Finish 15 books', now: (s) => s.stats.booksFinished, need: 15 },
      { label: 'Write one 650-word entry', now: (s) => s.stats.maxWords, need: 650, unit: 'words' },
    ],
  },
];

/* ============================================================================
   STAMP BOOK
   Every badge carries a `progress` so an UNEARNED stamp still shows how far
   along you are — and, where the goal is a set (all 10 templates), exactly
   which pieces are still missing.
   ========================================================================== */

const BADGE_SETS = [
  {
    id: 'dedication', name: 'Dedication', emoji: '🔥', bonus: 50,
    blurb: 'Show up and keep the streak alive.',
    badges: [
      { name: 'First Words', emoji: '🚀', how: 'Write your very first journal entry',
        progress: (s) => ({ now: s.stats.entries, need: 1, unit: 'entry' }) },
      { name: 'Week of Fire', emoji: '🔥', how: 'Reach a 7-day writing streak',
        progress: (s) => ({ now: s.stats.bestStreak || 0, need: 7, unit: 'day streak' }) },
      { name: 'Fortnight Force', emoji: '⚡', how: 'Reach a 14-day writing streak',
        progress: (s) => ({ now: s.stats.bestStreak || 0, need: 14, unit: 'day streak' }) },
      { name: 'Iron Quill', emoji: '🏆', how: 'Reach a 30-day writing streak',
        progress: (s) => ({ now: s.stats.bestStreak || 0, need: 30, unit: 'day streak' }) },
    ],
  },
  {
    id: 'adventurer', name: 'Adventurer', emoji: '🗺️', bonus: 40,
    blurb: 'Explore every kind of writing and finish books.',
    badges: [
      { name: 'Template Tourist', emoji: '🎨', how: 'Use 5 different templates',
        progress: (s) => ({ now: s.stats.templatesUsed.length, need: 5, unit: 'templates',
          remaining: missingTemplates(s) }) },
      { name: 'Template Master', emoji: '🗺️', how: 'Use all 10 templates',
        progress: (s) => ({ now: s.stats.templatesUsed.length, need: 10, unit: 'templates',
          remaining: missingTemplates(s) }) },
      { name: 'Bookworm', emoji: '📚', how: 'Finish a book and write its Book Review',
        progress: (s) => ({ now: s.stats.bookReviews, need: 1, unit: 'review' }) },
      { name: 'Double Trouble', emoji: '🤝', how: 'Both writers post an entry on the same day',
        progress: (s) => ({ now: sameDayCount(s), need: 1, unit: 'shared day' }) },
    ],
  },
  {
    id: 'wordsmith', name: 'Wordsmith', emoji: '✍️', bonus: 50,
    blurb: 'Sharpen your craft, one detail at a time.',
    badges: [
      { name: 'Detail Detective', emoji: '🔍', how: '3 entries in a row full of specific details' },
      { name: 'Quote Catcher', emoji: '💬', how: 'Use a direct quote from the book in 5 entries',
        progress: (s) => ({ now: s.stats.quotes, need: 5, unit: 'entries with a quote' }) },
      { name: 'Revision Butterfly', emoji: '🦋', how: 'Complete 5 stretch challenges',
        progress: (s) => ({ now: s.stats.revisions, need: 5, unit: 'revisions' }) },
      { name: 'Tier Climber', emoji: '⛰️', how: 'Get promoted to a new tier in any skill',
        progress: (s) => ({ now: Object.values(s.tiers || {}).filter((t) => t >= 2).length, need: 1, unit: 'promotion' }) },
    ],
  },
  {
    id: 'voice', name: 'Voice', emoji: '🎤', bonus: 40, isVoice: true,
    blurb: 'Read it out loud before you save. This is how mistakes stop coming back.',
    badges: [
      { name: 'First Listen', emoji: '🎤', how: 'Read one entry aloud with the 🎤 mic button before saving',
        progress: (s) => ({ now: s.stats.readAlouds, need: 1, unit: 'read-aloud' }) },
      { name: 'Sound Check', emoji: '🔊', how: 'Read 5 entries aloud before saving',
        progress: (s) => ({ now: s.stats.readAlouds, need: 5, unit: 'read-alouds' }) },
      { name: 'Clean Sweep', emoji: '🧹', how: '3 entries in a row with no Watch-list slip',
        progress: (s) => ({ now: s.stats.bestCleanStreak, need: 3, unit: 'clean in a row' }) },
      { name: 'Rule Learner', emoji: '🎓', how: 'Finish a mini-lesson on a mistake that keeps coming back',
        progress: (s) => ({ now: s.stats.lessons, need: 1, unit: 'lesson' }) },
    ],
  },
  {
    id: 'scholar', name: 'Scholar', emoji: '🏛️', bonus: 60,
    blurb: 'Grow from a paragraph into a real essay.',
    badges: [
      { name: 'Paragraph Pro', emoji: '🧱', how: 'Write an entry with 3 or more paragraphs',
        progress: (s) => ({ now: s.stats.maxParagraphs, need: 3, unit: 'paragraphs' }) },
      { name: 'Long Haul', emoji: '📜', how: 'Write a single entry of 250 words or more',
        progress: (s) => ({ now: s.stats.maxWords, need: 250, unit: 'words' }) },
      { name: 'Both Sides', emoji: '⚖️', how: 'Argue the other side in 5 entries',
        progress: (s) => ({ now: s.stats.counter, need: 5, unit: 'entries' }) },
      { name: 'Craft Critic', emoji: '🔬', how: 'Write about HOW the author built it in 5 entries',
        progress: (s) => ({ now: s.stats.craft, need: 5, unit: 'entries' }) },
    ],
  },
];
const FULL_HOUSE = { emoji: '🌟', name: 'Full House', bonus: 50 };

/* Parent mode: unlocked with ?parent=true. */
const PARENT = new URLSearchParams(location.search).get('parent') === 'true';

const state = {
  manifest: null,
  student: null,
  view: 'library',
  seriesFilter: null,
  bookFilter: null,
  query: '',
  templateFilter: null,
  corpus: null,      // lazily-loaded full text of every entry, for search
  mdCache: {},
};

const $ = (sel) => document.querySelector(sel);
const app = $('#app');

/* ---------- helpers ---------- */

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function canonicalTemplate(slug) {
  const bare = slug.replace(/^\d+-/, '');
  return TEMPLATE_IDS.find((id) => id === slug || id.slice(3) === bare || id.endsWith('-' + bare)) || slug;
}

function templateInfo(slug) {
  const id = canonicalTemplate(slug);
  if (TEMPLATES[id]) return TEMPLATES[id];
  const pretty = slug.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return { name: pretty, icon: '📝' };
}

function missingTemplates(s) {
  const used = new Set(s.stats.templatesUsed);
  return TEMPLATE_IDS.filter((id) => !used.has(id)).map((id) => TEMPLATES[id].name);
}

/** Days where BOTH writers posted — the Double Trouble condition. */
function sameDayCount(s) {
  const others = (state.manifest?.students || []).filter((x) => x.name !== s.name);
  if (!others.length) return 0;
  const mine = new Set(s.entries.map((e) => e.date));
  const theirs = new Set(others.flatMap((o) => o.entries.map((e) => e.date)));
  return [...mine].filter((d) => d && theirs.has(d)).length;
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function renderMd(md) {
  if (window.marked) return marked.parse(md);
  const e = esc(md);
  return e.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function parseEntry(md) {
  const parts = md.split(/^## +/m);
  const out = { writing: '', feedback: '', revision: '', bonus: '' };
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n');
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim().toLowerCase();
    const body = nl === -1 ? '' : part.slice(nl + 1).trim();
    if (heading.startsWith('my writing')) out.writing = body;
    else if (heading.startsWith('tutor feedback')) out.feedback = body;
    else if (heading.startsWith('revision')) out.revision = body;
    else if (heading.startsWith('bonus')) out.bonus = body;
  }
  return out;
}

function updateMenuFade() {
  const bar = document.querySelector('.viewbar');
  const track = bar && bar.querySelector('.viewbar-track');
  if (!track) return;
  bar.classList.toggle('can-scroll-right', track.scrollWidth - track.clientWidth - track.scrollLeft > 2);
}

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

function bar(pct, cls) {
  return `<div class="pbar ${cls || ''}"><span style="width:${Math.max(0, Math.min(100, pct))}%"></span></div>`;
}

/* ---------- ladder logic ---------- */

function milestoneState(m, s) {
  const now = m.now(s);
  return { now, need: m.need, done: now >= m.need, label: m.label, unit: m.unit };
}

function stageState(stage, s) {
  const ms = stage.milestones.map((m) => milestoneState(m, s));
  const done = ms.filter((m) => m.done).length;
  return { ms, done, total: ms.length, complete: done === ms.length,
           pct: Math.round((done / ms.length) * 100) };
}

/** Highest stage whose milestones are all met (0 = not started). */
function currentStage(s) {
  let cur = 0;
  for (const st of LADDER) {
    if (stageState(st, s).complete) cur = st.id; else break;
  }
  return cur;
}

/* ---------- "how far can I get?" projection ----------
   Estimates how many more sessions each remaining stage needs, using the student's OWN
   observed rates — how often they actually land a quote, an ACE round, a Tier-3 entry.
   It is an estimate and the UI says so, but it is built from their real history, not a
   guess, and its whole job is to answer: if I keep doing this every day, where does it go? */

/** How often this student produces X per entry (floored so nothing reads as "never"). */
function rateOf(s, key) {
  if (!s.stats.entries) return 0.3;
  return Math.max(0.12, (s.stats[key] || 0) / s.stats.entries);
}

/** Which stat a milestone accumulates, so we can use that stat's real rate. */
const MILESTONE_STAT = {
  'Write 3 entries': 'entries', 'Write 10 entries': 'entries',
  'Use a real quote in 5 entries': 'quotes',
  'Finish 10 ACE bonus rounds': 'ace',
  'Write 5 Tier-3 entries': 'tier3',
  'Write a full essay (3 paragraphs, 200+ words)': 'essayShaped',
  'Write 10 full essays': 'essayShaped',
  'Argue the other side in 5 entries': 'counter',
  'Write 3 argued, multi-paragraph pieces': 'debateShaped',
  'Analyze the author\'s craft in 5 entries': 'craft',
  'Review 3 books you finished': 'bookReviews',
  'Compare two books in 2 entries': 'compare',
  'Finish 15 books': 'booksFinished',
};

/** Sessions still needed for one milestone.
    `stage` matters: if a milestone needs something the student has literally never done,
    their observed rate is 0 — which means "hasn't tried yet", not "can't". When the stage
    has a growth template, we estimate one success per build instead. */
function sessionsFor(m, s, stage) {
  if (m.now >= m.need) return 0;
  const gap = m.need - m.now;

  // A tier promotion takes ~3 entries showing the skill, plus the weekly that confirms it.
  if (m.unit === 'tier' || m.unit === 'skills') return gap * 4;

  // "Longest entry" / "most paragraphs" aren't collected — they're stretched.
  // Assume each attempt grows the ceiling ~20%, and they attempt every other session.
  if (m.unit === 'words' || m.unit === 'paragraphs') {
    const from = Math.max(m.now, 1);
    const attempts = Math.max(1, Math.ceil(Math.log(m.need / from) / Math.log(1.2)));
    return attempts * 2;
  }

  // Everything else accumulates — divide the gap by how often they actually land it.
  const stat = MILESTONE_STAT[m.label];
  let rate = stat ? rateOf(s, stat) : 0.5;
  // Never done it, but a template exists for it → one success per build, not "never".
  if (stat && !s.stats[stat] && stage && stage.build) rate = 1 / stage.build;
  return Math.ceil(gap / rate);
}

/** Sessions to finish a stage. Milestones progress in parallel, but not perfectly. */
function stageSessions(stage, s) {
  const list = stageState(stage, s).ms.map((m) => sessionsFor(m, s, stage));
  if (!list.length) return 0;
  const max = Math.max(...list);
  const rest = list.reduce((n, x) => n + x, 0) - max;
  return Math.round(max + rest * 0.3);
}

/** Entries per week over the last 8 weeks — their actual current habit. */
function observedPace(s) {
  const dates = s.entries.map((e) => e.date).filter(Boolean).sort();
  if (dates.length < 2) return 3;
  const cutoff = new Date(Date.now() - 56 * 864e5).toISOString().slice(0, 10);
  const recent = dates.filter((d) => d >= cutoff);
  if (recent.length < 2) return 3;
  const span = (new Date(recent[recent.length - 1]) - new Date(recent[0])) / 864e5 + 1;
  return Math.max(1, Math.min(7, (recent.length / span) * 7));
}

function paceKey(s) { return `pace:${s.name}`; }

/** Cumulative roadmap: every stage above the current one, with a projected date. */
function projection(s, perWeek) {
  const cur = currentStage(s);
  let cumulative = 0;
  return LADDER.filter((st) => st.id > cur).map((st) => {
    const need = stageSessions(st, s);
    cumulative += need;
    const weeks = cumulative / perWeek;
    const when = new Date(Date.now() + weeks * 7 * 864e5);
    return { stage: st, sessions: need, total: cumulative, weeks, when };
  });
}

function fmtWhen(d, weeks) {
  if (weeks < 1.5) return 'this week';
  if (weeks < 5) return `${Math.round(weeks)} weeks`;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function goalKey(s) { return `goal:${s.name}`; }

function chosenGoal(s) {
  // The tutor's profile.md is authoritative; a locally-picked goal is the fallback.
  if (s.goal) {
    const st = LADDER.find((x) => x.key === s.goal);
    if (st) return { stage: st, official: true };
  }
  const local = localStorage.getItem(goalKey(s));
  const st = LADDER.find((x) => x.key === local);
  if (st) return { stage: st, official: false };
  return null;
}

function setGoal(s, key) {
  localStorage.setItem(goalKey(s), key);
  render();
}

/* ---------- top bar ---------- */

function renderStudentTabs() {
  const wrap = $('#studentTabs');
  wrap.innerHTML = '';
  for (const s of state.manifest.students) {
    const btn = el('button', 'student-tab' + (s === state.student ? ' active' : ''));
    const label = s.grade ? `${s.name} · G${s.grade}` : s.name;
    btn.innerHTML = `<span class="tab-name">${esc(label)}</span>` +
      (s.xp != null ? `<span class="tab-xp">⭐ ${s.xp.toLocaleString()} XP</span>` : '');
    btn.onclick = () => {
      state.student = s; state.bookFilter = null; state.seriesFilter = null;
      state.query = ''; state.templateFilter = null; render();
    };
    wrap.appendChild(btn);
  }
}

/* ---------- shared pieces ---------- */

function entryCard(e) {
  const t = templateInfo(e.slug);
  const btn = el('button', 'entry-card');
  btn.innerHTML = `
    <span class="icon">${t.icon}</span>
    <span class="info">
      <span class="line1">${esc(t.name)}
        ${e.tier ? `<span class="chip">Tier ${e.tier}</span>` : ''}
        ${e.xp ? `<span class="chip">+${e.xp} XP</span>` : ''}
        ${e.words ? `<span class="chip">${e.words}w</span>` : ''}
        ${e.hasRevision ? '<span class="chip">revised ✏️</span>' : ''}
        ${e.hasBonus ? '<span class="chip">ACE 🎯</span>' : ''}
        ${e.readAloud ? '<span class="chip voice">read aloud 🎤</span>' : ''}
        ${e.build ? `<span class="chip build">🧱 ${esc(e.build)}</span>` : ''}
      </span>
      <span class="line2">${fmtDate(e.date)} · ${esc(e.book)}${e.reading ? ' · ' + esc(e.reading) : ''}</span>
    </span>`;
  btn.onclick = () => openEntry(e);
  return btn;
}

function backButton(label, fn) {
  const b = el('button', 'back-btn', esc(label));
  b.onclick = fn;
  return b;
}

/* ============================================================================
   VIEW — MY LIBRARY
   ========================================================================== */

function renderLibrary() {
  const s = state.student;
  if (!s.books.length) return renderEmpty();

  if (state.bookFilter) return renderBookDetail();
  if (state.seriesFilter) return renderSeriesDetail();

  const seriesMap = new Map();
  const singles = [];
  for (const b of s.books) {
    if (!b.series) { singles.push(b); continue; }
    if (!seriesMap.has(b.series)) {
      seriesMap.set(b.series, { name: b.series, emoji: b.seriesEmoji || '📚', total: b.seriesTotal, books: [] });
    }
    seriesMap.get(b.series).books.push(b);
  }

  const finished = s.stats.booksFinished;
  const head = el('div', 'lib-head');
  head.innerHTML = `
    <div class="lib-head-main">
      <span class="lib-head-emoji">🏛️</span>
      <div>
        <div class="lib-head-title">${esc(s.name)}'s Library</div>
        <div class="lib-head-sub">Every book you've written about lives here — and so do your notes.</div>
      </div>
    </div>
    <div class="lib-stats">
      <div class="lib-stat"><b>${s.books.length}</b><span>books</span></div>
      <div class="lib-stat"><b>${finished}</b><span>finished</span></div>
      <div class="lib-stat"><b>${seriesMap.size}</b><span>series</span></div>
      <div class="lib-stat"><b>${s.stats.totalWords.toLocaleString()}</b><span>words written</span></div>
    </div>`;
  app.appendChild(head);

  // --- series shelves ---
  const series = [...seriesMap.values()].sort((a, b) =>
    lastDate(b.books).localeCompare(lastDate(a.books)));

  if (series.length) {
    app.appendChild(el('div', 'section-title', '📚 Series <span class="count">tap to open the shelf</span>'));
    const grid = el('div', 'series-grid');
    for (const sr of series) {
      const read = new Set(sr.books.map((b) => b.volume).filter(Boolean));
      const total = sr.total || sr.books.length;
      const h = hashStr(sr.name);
      const [c1, c2] = COVER_GRADIENTS[h % COVER_GRADIENTS.length];

      // A chip per volume: read ones are solid, the rest are ghosts you can still collect.
      let chips = '';
      if (sr.total) {
        for (let n = 1; n <= sr.total; n++) {
          chips += `<span class="vol-chip ${read.has(n) ? 'read' : ''}">${n}</span>`;
        }
      }
      const card = el('button', 'series-card');
      card.style.setProperty('--c1', c1);
      card.style.setProperty('--c2', c2);
      card.innerHTML = `
        <div class="series-top">
          <span class="series-emoji">${sr.emoji}</span>
          <div class="series-titles">
            <div class="series-name">${esc(sr.name)}</div>
            <div class="series-meta">${sr.books.length} of ${total} written about · ${sr.books.filter((b) => b.finished).length} finished</div>
          </div>
        </div>
        ${bar((sr.books.length / total) * 100, 'series-bar')}
        ${chips ? `<div class="vol-chips">${chips}</div>` : ''}`;
      card.onclick = () => { state.seriesFilter = sr.name; render(); };
      grid.appendChild(card);
    }
    app.appendChild(grid);
  }

  if (singles.length) {
    app.appendChild(el('div', 'section-title', '📕 Standalone books'));
    app.appendChild(bookShelf(singles));
  }
}

function lastDate(books) {
  return books.reduce((m, b) => ((b.last || '') > m ? b.last : m), '');
}

function bookShelf(books) {
  const shelf = el('div', 'shelf');
  for (const b of books) {
    const h = hashStr(b.key);
    const [c1, c2] = COVER_GRADIENTS[h % COVER_GRADIENTS.length];
    const emoji = COVER_EMOJIS[(h >>> 4) % COVER_EMOJIS.length];
    const cover = el('button', 'book-cover' + (b.finished ? ' finished' : ''));
    cover.style.background = `linear-gradient(150deg, ${c1}, ${c2})`;
    cover.innerHTML = `
      ${b.finished ? '<span class="finished-flag">✅ finished</span>' : ''}
      ${b.volume ? `<span class="vol-flag">#${b.volume}</span>` : ''}
      <span class="emoji">${emoji}</span>
      <span>
        <span class="title">${esc(b.short || b.title)}</span>
        <span class="meta">${b.entries} ${b.entries === 1 ? 'entry' : 'entries'}${b.author ? ' · ' + esc(b.author) : ''}</span>
      </span>`;
    cover.onclick = () => { state.bookFilter = b.key; render(); };
    shelf.appendChild(cover);
  }
  return shelf;
}

function renderSeriesDetail() {
  const s = state.student;
  const books = s.books.filter((b) => b.series === state.seriesFilter)
    .sort((a, b) => (a.volume || 99) - (b.volume || 99));
  const meta = books[0] || {};
  app.appendChild(backButton('← All books', () => { state.seriesFilter = null; render(); }));

  const total = meta.seriesTotal || books.length;
  const read = new Set(books.map((b) => b.volume).filter(Boolean));
  const missing = [];
  if (meta.seriesTotal) {
    for (let n = 1; n <= meta.seriesTotal; n++) if (!read.has(n)) missing.push(n);
  }

  const h = el('div', 'section-title');
  h.innerHTML = `${meta.seriesEmoji || '📚'} ${esc(state.seriesFilter)} <span class="count">${books.length} of ${total}</span>`;
  app.appendChild(h);
  app.appendChild(bookShelf(books));

  if (missing.length) {
    const note = el('div', 'series-missing');
    note.innerHTML = `📖 Still to write about in this series: ${missing.map((n) => `<b>#${n}</b>`).join(' · ')}`;
    app.appendChild(note);
  }
}

function renderBookDetail() {
  const s = state.student;
  const book = s.books.find((b) => b.key === state.bookFilter);
  if (!book) { state.bookFilter = null; return renderLibrary(); }
  const list = s.entries.filter((e) => e.bookKey === book.key)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  app.appendChild(backButton(book.series ? `← ${book.series}` : '← All books', () => {
    state.bookFilter = null;
    if (!book.series) state.seriesFilter = null; else state.seriesFilter = book.series;
    render();
  }));

  const h2 = hashStr(book.key);
  const [c1, c2] = COVER_GRADIENTS[h2 % COVER_GRADIENTS.length];
  const head = el('div', 'book-head');
  head.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  head.innerHTML = `
    <div class="book-head-inner">
      <div class="book-head-title">${esc(book.title)}</div>
      <div class="book-head-meta">
        ${book.author ? `<span>✍️ ${esc(book.author)}</span>` : ''}
        ${book.series ? `<span>${book.seriesEmoji || '📚'} ${esc(book.series)}${book.volume ? ` #${book.volume}` : ''}</span>` : ''}
        <span>${book.finished ? '✅ Finished' : '📖 Reading'}</span>
        <span>📝 ${book.entries} ${book.entries === 1 ? 'entry' : 'entries'}</span>
        <span>🔤 ${book.words.toLocaleString()} words</span>
        <span>📅 ${fmtDate(book.first)}${book.last !== book.first ? ' → ' + fmtDate(book.last) : ''}</span>
      </div>
    </div>`;
  app.appendChild(head);

  app.appendChild(el('div', 'section-title', '📔 My notes on this book <span class="count">tap any note to open it</span>'));
  const notes = el('div', 'note-list');
  for (const e of list) {
    const t = templateInfo(e.slug);
    const n = el('button', 'note-card');
    n.innerHTML = `
      <div class="note-head"><span>${t.icon} ${esc(t.name)}</span><span class="note-date">${fmtDate(e.date)}</span></div>
      <div class="note-excerpt">${esc(e.excerpt)}${e.excerpt && e.excerpt.length >= 180 ? '…' : ''}</div>`;
    n.onclick = () => openEntry(e);
    notes.appendChild(n);
  }
  app.appendChild(notes);
}

/* ============================================================================
   VIEW — MY LADDER
   ========================================================================== */

function renderLadder() {
  const s = state.student;
  const cur = currentStage(s);
  const goal = chosenGoal(s);
  const goalStage = goal ? goal.stage : null;

  // ---- hero ----
  const now = LADDER.find((x) => x.id === cur);
  const next = LADDER.find((x) => x.id === cur + 1);
  const hero = el('div', 'ladder-hero');
  hero.innerHTML = `
    <div class="ladder-hero-now">
      <div class="ladder-hero-label">You write like a</div>
      <div class="ladder-hero-stage">${now ? now.emoji + ' ' + esc(now.name) : '🌱 Just getting started'}</div>
      <div class="ladder-hero-ko">${now ? esc(now.ko) : ''}</div>
    </div>
    ${goalStage ? `
      <div class="ladder-hero-goal">
        <div class="ladder-hero-label">Your goal</div>
        <div class="ladder-hero-stage">${goalStage.emoji} ${esc(goalStage.name)}</div>
        <div class="ladder-hero-ko">${goal.official ? '✅ official — your tutor is tracking this' : '📌 picked here — tell your tutor to make it official'}</div>
      </div>` : `
      <div class="ladder-hero-goal empty">
        <div class="ladder-hero-label">No goal picked yet</div>
        <div class="ladder-hero-stage">🎯 Choose one below</div>
        <div class="ladder-hero-ko">Pick the level you WANT to write at</div>
      </div>`}`;
  app.appendChild(hero);

  // ---- progress toward the goal ----
  if (goalStage) {
    const stages = LADDER.filter((x) => x.id <= goalStage.id);
    const all = stages.flatMap((x) => stageState(x, s).ms);
    const done = all.filter((m) => m.done).length;
    const pct = Math.round((done / all.length) * 100);
    const track = el('div', 'goal-track');
    track.innerHTML = `
      <div class="goal-track-top">
        <b>${done} of ${all.length}</b> steps toward ${goalStage.emoji} ${esc(goalStage.name)}
        <span class="goal-pct">${pct}%</span>
      </div>
      ${bar(pct, 'big')}
      <div class="goal-track-foot">Every <code>/today</code> session moves this bar. Every <code>/weekly</code> checks it.</div>`;
    app.appendChild(track);
  }

  // ---- the next thing to do ----
  if (next) {
    const st = stageState(next, s);
    const todo = st.ms.filter((m) => !m.done);
    if (todo.length) {
      const focus = el('div', 'next-up');
      focus.innerHTML = `
        <div class="next-up-title">🎯 Closest thing to your next level — ${next.emoji} ${esc(next.name)}</div>
        <div class="next-up-list">${todo.slice(0, 3).map((m) => `
          <div class="next-up-item">
            <span class="next-up-label">${esc(m.label)}</span>
            <span class="next-up-num">${m.now} / ${m.need}${m.unit ? ' ' + esc(m.unit) : ''}</span>
            ${bar((m.now / m.need) * 100)}
          </div>`).join('')}</div>`;
      app.appendChild(focus);
    }
  }

  // ---- where daily writing actually takes you ----
  renderProjection(s);

  // ---- the ladder itself ----
  app.appendChild(el('div', 'section-title',
    '🪜 The whole climb <span class="count">tap a level to make it your goal</span>'));

  const wrap = el('div', 'ladder');
  for (const stage of [...LADDER].reverse()) {
    const st = stageState(stage, s);
    const isNow = stage.id === cur;
    const isGoal = goalStage && stage.id === goalStage.id;
    const reached = stage.id <= cur;

    const card = el('div', 'stage' +
      (reached ? ' reached' : '') + (isNow ? ' current' : '') + (isGoal ? ' goal' : ''));
    card.innerHTML = `
      <div class="stage-rail"><span class="stage-dot">${reached ? '✓' : stage.id}</span></div>
      <div class="stage-body">
        <div class="stage-head">
          <div class="stage-titles">
            <div class="stage-name">${stage.emoji} ${esc(stage.name)}
              ${isNow ? '<span class="stage-flag now">you are here</span>' : ''}
              ${isGoal ? '<span class="stage-flag goal">your goal</span>' : ''}
            </div>
            <div class="stage-ko">${esc(stage.ko)} · ${esc(stage.tagline)}</div>
          </div>
          <div class="stage-count">${st.done}/${st.total}</div>
        </div>
        ${bar(st.pct)}
        <div class="stage-move">🔑 <b>The move:</b> ${esc(stage.move)}</div>
        ${stage.template ? `<div class="stage-tpl">📄 Unlocked with template
          <b>${TEMPLATES[stage.template].icon} ${esc(TEMPLATES[stage.template].name)}</b>
          — built over a few days, one normal-sized piece each day.</div>` : ''}
        <details class="stage-sample">
          <summary>👀 See what this level sounds like</summary>
          <blockquote>${stage.sample}</blockquote>
        </details>
        <div class="stage-ms">${st.ms.map((m) => `
          <div class="ms ${m.done ? 'done' : ''}">
            <span class="ms-tick">${m.done ? '✅' : '⬜'}</span>
            <span class="ms-label">${esc(m.label)}</span>
            <span class="ms-num">${m.done ? 'done' : `${m.now}/${m.need}`}</span>
          </div>`).join('')}</div>
        ${isGoal ? '<button class="stage-goal-btn" disabled>🎯 This is your goal</button>'
          : reached ? '<div class="stage-cleared">✅ You already write at this level</div>'
          : '<button class="stage-goal-btn">🎯 Make this my goal</button>'}
      </div>`;
    const btn = card.querySelector('.stage-goal-btn');
    if (btn && !isGoal) btn.onclick = () => setGoal(s, stage.key);
    wrap.appendChild(card);
  }
  app.appendChild(wrap);

  const tip = el('div', 'ladder-tip');
  tip.innerHTML = `💡 Picked a goal? Say it out loud in your next session — ` +
    `<code>/today</code> — so your tutor writes it into your profile and aims every ` +
    `session at it. Then <code>/weekly</code> checks how much closer you got.`;
  app.appendChild(tip);
}

/** "If I keep writing N days a week, how far do I actually get?" */
function renderProjection(s) {
  const observed = observedPace(s);
  const saved = Number(localStorage.getItem(paceKey(s)));
  const perWeek = [3, 5, 7].includes(saved) ? saved
    : [3, 5, 7].reduce((a, b) => (Math.abs(b - observed) < Math.abs(a - observed) ? b : a));

  const rows = projection(s, perWeek);
  const wrap = el('div', 'proj');

  if (!rows.length) {
    wrap.innerHTML = `<div class="proj-head"><div class="proj-title">📈 Where this takes you</div></div>
      <div class="proj-top">🎓 You've reached the top of the ladder. Now it's about depth, not level.</div>`;
    app.appendChild(wrap);
    return;
  }

  const last = rows[rows.length - 1];
  wrap.innerHTML = `
    <div class="proj-head">
      <div>
        <div class="proj-title">📈 Where this takes you</div>
        <div class="proj-sub">You're writing about <b>${observed.toFixed(1)} days a week</b> right now.
          What if you kept it up?</div>
      </div>
      <div class="pace-picker">
        ${[3, 5, 7].map((n) => `<button class="pace-btn${n === perWeek ? ' active' : ''}" data-pace="${n}">${n}×/week</button>`).join('')}
      </div>
    </div>

    <div class="proj-headline">
      Write <b>${perWeek} days a week</b> and you'll be writing
      <b>${last.stage.emoji} ${esc(last.stage.name)}</b>-level work
      — ${last.stage.id === 7 ? 'a university-level comparative essay' : esc(last.stage.tagline)} —
      by <b>${fmtWhen(last.when, last.weeks)}</b>.
    </div>

    <div class="proj-rows">
      ${rows.map((r) => `
        <div class="proj-row">
          <span class="proj-emoji">${r.stage.emoji}</span>
          <span class="proj-name">${esc(r.stage.name)}
            ${r.stage.template ? `<span class="proj-tpl">${TEMPLATES[r.stage.template].name}</span>` : ''}
          </span>
          <span class="proj-sessions">~${r.total} session${r.total === 1 ? '' : 's'}</span>
          <span class="proj-when">${fmtWhen(r.when, r.weeks)}</span>
        </div>`).join('')}
    </div>

    <div class="proj-foot">These are estimates from <i>your own</i> pace — how often you
      actually land a quote, an ACE round, a Tier-3 entry. Write more often and every date
      moves closer. Skip a week and nothing is lost; the dates just shift.</div>`;

  wrap.querySelectorAll('.pace-btn').forEach((b) => {
    b.onclick = () => { localStorage.setItem(paceKey(s), b.dataset.pace); render(); };
  });
  app.appendChild(wrap);
}

/* ============================================================================
   VIEW — STAMP BOOK
   ========================================================================== */

function badgeState(b, s, earned) {
  const key = b.name.toLowerCase();
  if (earned.has(key)) return { kind: 'earned', date: earned.get(key) };
  if (!b.progress) return { kind: 'locked' };
  const p = b.progress(s);
  if (p.now >= p.need) return { kind: 'ready', ...p };
  return { kind: 'progress', ...p };
}

function renderStamps() {
  const s = state.student;
  const earned = new Map();
  for (const b of (s.badges || [])) earned.set(b.name.toLowerCase(), b.date || null);

  const allBadges = BADGE_SETS.reduce((n, x) => n + x.badges.length, 0);
  const earnedInSets = BADGE_SETS.reduce((n, x) =>
    n + x.badges.filter((b) => earned.has(b.name.toLowerCase())).length, 0);
  const completedSets = BADGE_SETS.filter((x) => x.badges.every((b) => earned.has(b.name.toLowerCase())));
  const allDone = completedSets.length === BADGE_SETS.length;
  const unlockedXp = completedSets.reduce((n, x) => n + x.bonus, 0) + (allDone ? FULL_HOUSE.bonus : 0);
  const readyCount = BADGE_SETS.reduce((n, x) =>
    n + x.badges.filter((b) => badgeState(b, s, earned).kind === 'ready').length, 0);

  const banner = el('div', 'stamp-summary');
  banner.innerHTML = `
    <div class="stamp-summary-main">
      <span class="stamp-summary-emoji">🏅</span>
      <div>
        <div class="stamp-summary-title">${esc(s.name)}'s Stamp Book</div>
        <div class="stamp-summary-sub">Fill a card to earn a bonus-XP coupon 🎟️</div>
      </div>
    </div>
    <div class="stamp-stats">
      <div class="stamp-stat"><b>${earnedInSets}/${allBadges}</b><span>stamps</span></div>
      <div class="stamp-stat"><b>${completedSets.length}/${BADGE_SETS.length}</b><span>cards done</span></div>
      <div class="stamp-stat"><b>+${unlockedXp}</b><span>bonus XP</span></div>
    </div>`;
  app.appendChild(banner);

  if (readyCount) {
    const ready = el('div', 'ready-note');
    ready.innerHTML = `🔔 <b>${readyCount} stamp${readyCount > 1 ? 's look' : ' looks'} ready!</b> ` +
      `You've hit the number — ask your tutor to check it in your next <code>/today</code> session.`;
    app.appendChild(ready);
  }

  // The read-aloud guide leads the page: it's the one stamp you can start earning today.
  app.appendChild(el('div', 'voice-panel wide', voicePanel()));

  const grid = el('div', 'stamp-grid');
  for (const set of BADGE_SETS) {
    const got = set.badges.filter((b) => earned.has(b.name.toLowerCase())).length;
    const done = got === set.badges.length;
    const card = el('div', 'stamp-card' + (done ? ' done' : ''));

    const stamps = set.badges.map((b) => {
      const st = badgeState(b, s, earned);
      let foot = '', pct = 0, cls = 'off';
      if (st.kind === 'earned') {
        cls = 'on'; foot = st.date ? fmtDate(st.date) : 'Earned'; pct = 100;
      } else if (st.kind === 'ready') {
        cls = 'ready'; foot = `Ready! ${st.now}/${st.need} — ask your tutor`; pct = 100;
      } else if (st.kind === 'progress') {
        cls = 'off'; pct = (st.now / st.need) * 100;
        foot = `${st.now} / ${st.need} ${esc(st.unit || '')}`;
      } else {
        foot = b.how;
      }
      const remaining = (st.remaining && st.remaining.length && st.kind !== 'earned')
        ? `<div class="stamp-remaining">Still needed: ${st.remaining.map((r) => `<span>${esc(r)}</span>`).join('')}</div>`
        : '';
      return `
        <div class="stamp ${cls}" title="${esc(b.name)} — ${esc(b.how)}">
          <span class="stamp-badge">${b.emoji}</span>
          <span class="stamp-name">${esc(b.name)}</span>
          <span class="stamp-how">${esc(b.how)}</span>
          ${st.kind === 'progress' || st.kind === 'ready' ? bar(pct, 'mini') : ''}
          <span class="stamp-foot">${foot}</span>
          ${remaining}
        </div>`;
    }).join('');

    card.innerHTML = `
      <div class="stamp-card-head">
        <span class="stamp-card-emoji">${set.emoji}</span>
        <div class="stamp-card-titles">
          <div class="stamp-card-name">${esc(set.name)}</div>
          <div class="stamp-card-blurb">${esc(set.blurb)}</div>
        </div>
        <span class="stamp-card-count">${got}/${set.badges.length}</span>
      </div>
      ${bar((got / set.badges.length) * 100, 'stamp-bar')}
      <div class="stamp-slots">${stamps}</div>
      <div class="coupon ${done ? 'unlocked' : 'locked'}">
        ${done ? `🎟️ Coupon unlocked — <b>+${set.bonus} XP</b>!`
               : `🔒 Collect all ${set.badges.length} to unlock <b>+${set.bonus} XP</b>`}
      </div>`;
    grid.appendChild(card);
  }
  app.appendChild(grid);

  const grand = el('div', 'stamp-grand ' + (allDone ? 'unlocked' : 'locked'));
  grand.innerHTML = allDone
    ? `${FULL_HOUSE.emoji} <b>Full House!</b> Every card complete — <b>+${FULL_HOUSE.bonus} XP</b> grand bonus 🎉`
    : `${FULL_HOUSE.emoji} <b>Full House</b> — fill all ${BADGE_SETS.length} cards for a <b>+${FULL_HOUSE.bonus} XP</b> grand bonus`;
  app.appendChild(grand);
}

/** The how-to that makes the Voice card actionable instead of decorative. */
function voicePanel() {
  return `
      <div class="voice-panel-title">🎤 Earn a Voice stamp today — it takes 10 seconds</div>
      <ol class="voice-steps">
        <li>Finish writing, but <b>don't save yet</b>.</li>
        <li>Press the <b>🎤 microphone button</b> in Claude Code.</li>
        <li><b>Read your writing out loud.</b> Slowly. Listen to the verbs.</li>
        <li>Fix anything that sounded wrong — <b>a mistake you catch counts as clean</b>.</li>
        <li>Now save. Your tutor marks <code>Read-aloud ✅</code> and the stamp is yours.</li>
      </ol>
      <div class="voice-why">Why it works: you fix almost every mistake the moment you
      <i>hear</i> it. Reading aloud <b>after</b> saving is a correction; reading aloud
      <b>before</b> saving is a clean entry. Same ten seconds — completely different result.</div>`;
}

/* ============================================================================
   VIEW — SEARCH ("my notes")
   ========================================================================== */

async function loadCorpus() {
  if (state.corpus) return state.corpus;
  const s = state.student;
  const out = [];
  await Promise.all(s.entries.map(async (e) => {
    try {
      const md = await loadEntryMd(e.file);
      const sec = parseEntry(md);
      out.push({ e, text: `${sec.writing}\n${sec.revision}\n${sec.bonus}` });
    } catch { out.push({ e, text: e.excerpt || '' }); }
  }));
  state.corpus = out;
  return out;
}

function renderSearch() {
  const s = state.student;
  const head = el('div', 'search-head');
  head.innerHTML = `
    <div class="search-title">🔎 My notes</div>
    <div class="search-sub">Everything you've ever written, searchable. Find an old idea and use it again.</div>
    <input id="searchInput" class="search-input" type="search" placeholder="Search your writing… (try a character's name)" value="${esc(state.query)}">
    <div class="tpl-filters">
      <button class="tpl-chip${state.templateFilter ? '' : ' active'}" data-tpl="">All</button>
      ${s.stats.templatesUsed.map((id) => `
        <button class="tpl-chip${state.templateFilter === id ? ' active' : ''}" data-tpl="${id}">
          ${TEMPLATES[id] ? TEMPLATES[id].icon + ' ' + esc(TEMPLATES[id].name) : esc(id)}
        </button>`).join('')}
    </div>`;
  app.appendChild(head);

  const results = el('div', 'search-results');
  app.appendChild(results);

  const input = head.querySelector('#searchInput');
  head.querySelectorAll('.tpl-chip').forEach((c) => {
    c.onclick = () => { state.templateFilter = c.dataset.tpl || null; render(); };
  });

  const run = async () => {
    const q = state.query.trim().toLowerCase();
    let list = s.entries;
    if (state.templateFilter) list = list.filter((e) => canonicalTemplate(e.slug) === state.templateFilter);

    if (!q) {
      results.innerHTML = '';
      const wrap = el('div', 'entry-list');
      [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        .forEach((e) => wrap.appendChild(entryCard(e)));
      results.appendChild(wrap);
      return;
    }

    results.innerHTML = '<div class="empty-state">Searching all your writing…</div>';
    const corpus = await loadCorpus();
    const keys = new Set(list.map((e) => e.file));
    const hits = corpus.filter((c) => keys.has(c.e.file) && c.text.toLowerCase().includes(q))
      .sort((a, b) => (b.e.date || '').localeCompare(a.e.date || ''));

    results.innerHTML = '';
    if (!hits.length) {
      results.appendChild(el('div', 'empty-state',
        `Nothing found for “${esc(state.query)}”.<br>Try a character's name, or a word you remember writing.`));
      return;
    }
    results.appendChild(el('div', 'section-title',
      `${hits.length} ${hits.length === 1 ? 'note' : 'notes'} mention “${esc(state.query)}”`));
    const wrap = el('div', 'note-list');
    for (const { e, text } of hits) {
      const t = templateInfo(e.slug);
      const i = text.toLowerCase().indexOf(q);
      const from = Math.max(0, i - 70);
      const snippet = (from > 0 ? '…' : '') + text.slice(from, i + q.length + 110).replace(/\s+/g, ' ') + '…';
      const marked = esc(snippet).replace(new RegExp(esc(state.query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'),
        (m) => `<mark>${m}</mark>`);
      const n = el('button', 'note-card');
      n.innerHTML = `
        <div class="note-head"><span>${t.icon} ${esc(t.name)} · ${esc(e.book)}</span><span class="note-date">${fmtDate(e.date)}</span></div>
        <div class="note-excerpt">${marked}</div>`;
      n.onclick = () => openEntry(e);
      wrap.appendChild(n);
    }
    results.appendChild(wrap);
  };

  let timer = null;
  input.addEventListener('input', () => {
    state.query = input.value;
    clearTimeout(timer);
    timer = setTimeout(run, 220);
  });
  run();
  if (state.query) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
}

/* ============================================================================
   VIEW — TIMELINE / REPORTS / EMPTY
   ========================================================================== */

function renderTimeline() {
  const entries = [...state.student.entries].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!entries.length) return renderEmpty();
  let currentMonth = '', wrap = null;
  for (const e of entries) {
    const month = e.date ? e.date.slice(0, 7) : 'Undated';
    if (month !== currentMonth) {
      currentMonth = month;
      const d = new Date(month + '-01T00:00:00');
      app.appendChild(el('div', 'section-title date-group',
        isNaN(d) ? month : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })));
      wrap = el('div', 'entry-list');
      app.appendChild(wrap);
    }
    wrap.appendChild(entryCard(e));
  }
}

function renderReports() {
  if (!PARENT) return renderEmpty();
  const reports = [...(state.student.reports || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  app.appendChild(el('div', 'reports-intro',
    `👪 <b>${esc(state.student.name)}'s weekly reports</b> — a parent-only view. Each report covers the last 7 days of writing, growth, focus for next week, and a Korean note.`));
  if (!reports.length) {
    app.appendChild(el('div', 'empty-state', 'No weekly reports yet.<br>They appear here after a <code>/weekly</code> review. 📊'));
    return;
  }
  const wrap = el('div', 'entry-list');
  for (const r of reports) {
    const btn = el('button', 'entry-card');
    btn.innerHTML = `
      <span class="icon">📊</span>
      <span class="info">
        <span class="line1">${r.kind === 'weekly' ? 'Weekly report' : esc(r.kind)} <span class="chip">week ending ${r.date || '—'}</span></span>
        <span class="line2">${esc(state.student.name)} · click to read the full report</span>
      </span>`;
    btn.onclick = () => openReport(r);
    wrap.appendChild(btn);
  }
  app.appendChild(wrap);
}

function renderEmpty() {
  app.appendChild(el('div', 'empty-state',
    'No journal entries yet.<br>Write your first one with <code>/today</code> — it will show up here! ✏️'));
}

/* ---------- router ---------- */

function render() {
  renderStudentTabs();
  app.innerHTML = '';
  if (!state.student) return renderEmpty();
  document.querySelectorAll('.viewbtn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === state.view));
  const activeBtn = document.querySelector('.viewbtn.active');
  if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center' });
  updateMenuFade();
  const views = {
    library: renderLibrary, ladder: renderLadder, stamps: renderStamps,
    search: renderSearch, reports: renderReports, timeline: renderTimeline,
  };
  (views[state.view] || renderTimeline)();
}

/* ---------- data ---------- */

async function loadManifest() {
  const res = await fetch('manifest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('manifest.json not found — run: node scripts/build-manifest.mjs');
  state.manifest = await res.json();
}

async function loadEntryMd(file) {
  if (!state.mdCache[file]) {
    const res = await fetch(file, { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not load ' + file);
    state.mdCache[file] = await res.text();
  }
  return state.mdCache[file];
}

/* ---------- modals ---------- */

async function openEntry(e) {
  const t = templateInfo(e.slug);
  const body = $('#modalBody');
  body.innerHTML = '<div class="empty-state">Loading…</div>';
  $('#modal').classList.remove('hidden');
  try {
    const md = await loadEntryMd(e.file);
    const sections = parseEntry(md);
    body.innerHTML = `
      <h1 style="margin:0 0 4px">${t.icon} ${esc(t.name)}</h1>
      <div class="entry-meta">
        <span class="chip">📅 ${fmtDate(e.date)}</span>
        <span class="chip">📖 ${esc(e.book)}</span>
        ${e.reading ? `<span class="chip">${esc(e.reading)}</span>` : ''}
        ${e.tier ? `<span class="chip">Tier ${e.tier}</span>` : ''}
        ${e.xp ? `<span class="chip">+${e.xp} XP</span>` : ''}
        <span class="chip">${e.words} words · ${e.paragraphs} ${e.paragraphs === 1 ? 'paragraph' : 'paragraphs'}</span>
        ${e.build ? `<span class="chip build">🧱 ${esc(e.build)}</span>` : ''}
        ${e.readAloud ? '<span class="chip voice">🎤 read aloud before saving</span>' : ''}
        ${e.watchClean ? '<span class="chip clean">✅ watch-list clean</span>' : ''}
      </div>
      <div class="entry-section">
        <h2>My writing</h2>
        <div class="writing-body">${renderMd(sections.writing || '_(empty)_')}</div>
      </div>
      ${sections.feedback ? `
      <div class="entry-section feedback-section">
        <h2>Tutor feedback</h2>
        <div class="feedback-body">${renderMd(sections.feedback)}</div>
      </div>` : ''}
      ${sections.revision ? `
      <div class="entry-section">
        <h2>My revision</h2>
        <div class="revision-body">${renderMd(sections.revision)}</div>
      </div>` : ''}
      ${sections.bonus ? `
      <div class="entry-section bonus-section">
        <h2>🎯 Bonus — ACE Write</h2>
        <div class="bonus-body">${renderMd(sections.bonus)}</div>
      </div>` : ''}`;
  } catch (err) {
    body.innerHTML = `<div class="empty-state">Could not load this entry.<br><code>${esc(err.message)}</code></div>`;
  }
}

async function openReport(r) {
  const body = $('#modalBody');
  body.innerHTML = '<div class="empty-state">Loading…</div>';
  $('#modal').classList.remove('hidden');
  try {
    const md = await loadEntryMd(r.file);
    body.innerHTML = `<div class="report-body">${renderMd(md)}</div>`;
  } catch (err) {
    body.innerHTML = `<div class="empty-state">Could not load this report.<br><code>${esc(err.message)}</code></div>`;
  }
}

/* ---------- boot ---------- */

function initFeedbackToggle() {
  const toggle = $('#feedbackToggle');
  const saved = localStorage.getItem('showFeedback');
  const show = saved === null ? true : saved === 'true';
  toggle.checked = show;
  document.body.classList.toggle('hide-feedback', !show);
  toggle.addEventListener('change', () => {
    localStorage.setItem('showFeedback', String(toggle.checked));
    document.body.classList.toggle('hide-feedback', !toggle.checked);
  });
}

function initModal() {
  $('#modalClose').onclick = () => $('#modal').classList.add('hidden');
  $('#modal').addEventListener('click', (ev) => {
    if (ev.target === $('#modal')) $('#modal').classList.add('hidden');
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') $('#modal').classList.add('hidden');
  });
}

async function boot() {
  initFeedbackToggle();
  initModal();
  if (PARENT) {
    document.body.classList.add('parent-mode');
    const badge = $('#parentBadge');
    if (badge) badge.hidden = false;
    document.querySelectorAll('.parent-only').forEach((el) => { el.hidden = false; });
  }
  document.querySelectorAll('.viewbtn').forEach((b) => {
    b.onclick = () => {
      state.view = b.dataset.view;
      state.bookFilter = null; state.seriesFilter = null;
      render();
    };
  });
  const track = document.querySelector('.viewbar-track');
  if (track) track.addEventListener('scroll', updateMenuFade, { passive: true });
  window.addEventListener('resize', updateMenuFade);
  try {
    await loadManifest();
    state.student = state.manifest.students[0] || null;
    render();
  } catch (err) {
    app.innerHTML = `<div class="empty-state">⚠️ ${esc(err.message)}</div>`;
  }
}

boot();
