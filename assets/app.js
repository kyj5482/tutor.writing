/* Writing portfolio — reads manifest.json + journal markdown files and renders them.
   No build step: works on GitHub Pages and with any static file server. */

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
};

const COVER_GRADIENTS = [
  ['#667eea', '#764ba2'], ['#f0648c', '#f9a26c'], ['#11998e', '#38ef7d'],
  ['#fc4a1a', '#f7b733'], ['#396afc', '#2948ff'], ['#b24592', '#f15f79'],
  ['#159957', '#155799'], ['#ee0979', '#ff6a00'], ['#7f00ff', '#e100ff'],
  ['#56ab2f', '#a8e063'],
];
const COVER_EMOJIS = ['📕', '📗', '📘', '📙', '📚', '🦉', '🦊', '🐉', '🚀', '🌋'];

/* Stamp Book — badges grouped into themed collection cards.
   Fill a whole card and the tutor awards the bonus XP (see game/rules.md). */
const BADGE_SETS = [
  {
    id: 'dedication', name: 'Dedication', emoji: '🔥', bonus: 50,
    blurb: 'Show up and keep the streak alive.',
    badges: [
      { name: 'First Words',     emoji: '🚀', how: 'Write your very first journal entry' },
      { name: 'Week of Fire',    emoji: '🔥', how: 'Reach a 7-day writing streak' },
      { name: 'Fortnight Force', emoji: '⚡', how: 'Reach a 14-day writing streak' },
      { name: 'Iron Quill',      emoji: '🏆', how: 'Reach a 30-day writing streak' },
    ],
  },
  {
    id: 'adventurer', name: 'Adventurer', emoji: '🗺️', bonus: 40,
    blurb: 'Explore every kind of writing and finish books.',
    badges: [
      { name: 'Template Tourist', emoji: '🎨', how: 'Use 5 different templates' },
      { name: 'Template Master',  emoji: '🗺️', how: 'Use all 10 templates' },
      { name: 'Bookworm',         emoji: '📚', how: 'Finish a book and write its Book Review' },
      { name: 'Double Trouble',   emoji: '🤝', how: 'Both writers post an entry on the same day' },
    ],
  },
  {
    id: 'wordsmith', name: 'Wordsmith', emoji: '✍️', bonus: 50,
    blurb: 'Sharpen your craft, one detail at a time.',
    badges: [
      { name: 'Detail Detective',   emoji: '🔍', how: '3 entries in a row full of specific details' },
      { name: 'Quote Catcher',      emoji: '💬', how: 'Use a direct quote from the book in 5 entries' },
      { name: 'Revision Butterfly', emoji: '🦋', how: 'Complete 5 stretch challenges' },
      { name: 'Tier Climber',       emoji: '⛰️', how: 'Get promoted to a new tier in any skill' },
    ],
  },
];
// Grand prize for filling every card.
const FULL_HOUSE = { emoji: '🌟', name: 'Full House', bonus: 50 };

/* Parent mode: unlocked with ?parent=true. Reveals the Weekly Reports view,
   which is kept out of the kids' everyday portfolio. */
const PARENT = new URLSearchParams(location.search).get('parent') === 'true';

const state = {
  manifest: null,
  student: null,   // selected student object
  view: 'books',   // books | templates | timeline | stamps | reports
  bookFilter: null, // when drilled into one book
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

function templateInfo(slug) {
  if (TEMPLATES[slug]) return TEMPLATES[slug];
  // journal filenames may omit the number prefix, e.g. "summary" or "golden-line"
  const key = Object.keys(TEMPLATES).find((k) => k.slice(3) === slug || k.endsWith('-' + slug));
  if (key) return TEMPLATES[key];
  const pretty = slug.replace(/^\d+-/, '').replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { name: pretty, icon: '📝' };
}

/* Toggle the right-edge fade on the view menu when there's more to scroll to. */
function updateMenuFade() {
  const bar = document.querySelector('.viewbar');
  const track = bar && bar.querySelector('.viewbar-track');
  if (!track) return;
  const more = track.scrollWidth - track.clientWidth - track.scrollLeft > 2;
  bar.classList.toggle('can-scroll-right', more);
}

function renderMd(md) {
  if (window.marked) return marked.parse(md);
  // tiny fallback if the CDN is unreachable: escape + paragraphs
  const esc = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
}

/* Split a journal md file into { meta, sections: {writing, feedback, revision, bonus} } */
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

/* ---------- top bar ---------- */

function renderStudentTabs() {
  const wrap = $('#studentTabs');
  wrap.innerHTML = '';
  for (const s of state.manifest.students) {
    const btn = document.createElement('button');
    btn.className = 'student-tab' + (s === state.student ? ' active' : '');
    const label = s.grade ? `${s.name} · G${s.grade}` : s.name;
    btn.innerHTML = `<span class="tab-name">${label}</span>` +
      (s.xp != null ? `<span class="tab-xp">⭐ ${s.xp.toLocaleString()} XP</span>` : '');
    btn.onclick = () => { state.student = s; state.bookFilter = null; render(); };
    wrap.appendChild(btn);
  }
}

/* ---------- views ---------- */

function entryCard(e) {
  const t = templateInfo(e.slug);
  const btn = document.createElement('button');
  btn.className = 'entry-card';
  btn.innerHTML = `
    <span class="icon">${t.icon}</span>
    <span class="info">
      <span class="line1">${t.name}
        ${e.tier ? `<span class="chip">Tier ${e.tier}</span>` : ''}
        ${e.xp ? `<span class="chip">+${e.xp} XP</span>` : ''}
        ${e.hasRevision ? '<span class="chip">revised ✏️</span>' : ''}
        ${e.hasBonus ? '<span class="chip">ACE 🎯</span>' : ''}
      </span>
      <span class="line2">${fmtDate(e.date)} · ${e.book}${e.reading ? ' · ' + e.reading : ''}</span>
    </span>`;
  btn.onclick = () => openEntry(e);
  return btn;
}

function renderBooks() {
  const entries = state.student.entries;
  if (state.bookFilter) {
    const back = document.createElement('button');
    back.className = 'back-btn';
    back.textContent = '← All books';
    back.onclick = () => { state.bookFilter = null; render(); };
    app.appendChild(back);

    const list = entries.filter((e) => e.book === state.bookFilter)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const h = document.createElement('div');
    h.className = 'section-title';
    h.innerHTML = `📖 ${state.bookFilter} <span class="count">${list.length} entries</span>`;
    app.appendChild(h);

    const wrap = document.createElement('div');
    wrap.className = 'entry-list';
    list.forEach((e) => wrap.appendChild(entryCard(e)));
    app.appendChild(wrap);
    return;
  }

  const byBook = new Map();
  for (const e of entries) {
    if (!byBook.has(e.book)) byBook.set(e.book, []);
    byBook.get(e.book).push(e);
  }
  if (byBook.size === 0) return renderEmpty();

  const shelf = document.createElement('div');
  shelf.className = 'shelf';
  // most recently written-about books first
  const books = [...byBook.entries()].sort((a, b) => {
    const last = (es) => es.reduce((m, e) => (e.date > m ? e.date : m), '');
    return last(b[1]).localeCompare(last(a[1]));
  });
  for (const [book, es] of books) {
    const h = hashStr(book);
    const [c1, c2] = COVER_GRADIENTS[h % COVER_GRADIENTS.length];
    const emoji = COVER_EMOJIS[(h >>> 4) % COVER_EMOJIS.length];
    const cover = document.createElement('button');
    cover.className = 'book-cover';
    cover.style.background = `linear-gradient(150deg, ${c1}, ${c2})`;
    cover.innerHTML = `
      <span class="emoji">${emoji}</span>
      <span>
        <span class="title">${book}</span>
        <span class="meta">${es.length} ${es.length === 1 ? 'entry' : 'entries'} · last ${fmtDate(es.reduce((m, e) => (e.date > m ? e.date : m), '') || null)}</span>
      </span>`;
    cover.onclick = () => { state.bookFilter = book; render(); };
    shelf.appendChild(cover);
  }
  app.appendChild(shelf);
}

function renderTemplates() {
  const entries = state.student.entries;
  if (entries.length === 0) return renderEmpty();
  const bySlug = new Map();
  for (const e of entries) {
    if (!bySlug.has(e.slug)) bySlug.set(e.slug, []);
    bySlug.get(e.slug).push(e);
  }
  const slugs = [...bySlug.keys()].sort();
  for (const slug of slugs) {
    const t = templateInfo(slug);
    const list = bySlug.get(slug).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const h = document.createElement('div');
    h.className = 'section-title';
    h.innerHTML = `${t.icon} ${t.name} <span class="count">${list.length} entries</span>`;
    app.appendChild(h);
    const wrap = document.createElement('div');
    wrap.className = 'entry-list';
    list.forEach((e) => wrap.appendChild(entryCard(e)));
    app.appendChild(wrap);
  }
}

function renderTimeline() {
  const entries = [...state.student.entries]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (entries.length === 0) return renderEmpty();
  let currentMonth = '';
  let wrap = null;
  for (const e of entries) {
    const month = e.date ? e.date.slice(0, 7) : 'Undated';
    if (month !== currentMonth) {
      currentMonth = month;
      const h = document.createElement('div');
      h.className = 'section-title date-group';
      const d = new Date(month + '-01T00:00:00');
      h.textContent = isNaN(d) ? month
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      app.appendChild(h);
      wrap = document.createElement('div');
      wrap.className = 'entry-list';
      app.appendChild(wrap);
    }
    wrap.appendChild(entryCard(e));
  }
}

function renderStamps() {
  const earned = new Map();
  for (const b of (state.student.badges || [])) earned.set(b.name.toLowerCase(), b.date || null);

  const allBadges = BADGE_SETS.reduce((n, s) => n + s.badges.length, 0);
  const earnedInSets = BADGE_SETS.reduce((n, s) =>
    n + s.badges.filter((b) => earned.has(b.name.toLowerCase())).length, 0);
  const completedSets = BADGE_SETS.filter((s) =>
    s.badges.every((b) => earned.has(b.name.toLowerCase())));
  const allDone = completedSets.length === BADGE_SETS.length;
  const unlockedXp = completedSets.reduce((n, s) => n + s.bonus, 0) + (allDone ? FULL_HOUSE.bonus : 0);

  // ---- summary banner ----
  const banner = document.createElement('div');
  banner.className = 'stamp-summary';
  banner.innerHTML = `
    <div class="stamp-summary-main">
      <span class="stamp-summary-emoji">🏅</span>
      <div>
        <div class="stamp-summary-title">${state.student.name}'s Stamp Book</div>
        <div class="stamp-summary-sub">Fill a card to earn a bonus-XP coupon 🎟️</div>
      </div>
    </div>
    <div class="stamp-stats">
      <div class="stamp-stat"><b>${earnedInSets}/${allBadges}</b><span>stamps</span></div>
      <div class="stamp-stat"><b>${completedSets.length}/${BADGE_SETS.length}</b><span>cards done</span></div>
      <div class="stamp-stat"><b>+${unlockedXp}</b><span>bonus XP</span></div>
    </div>`;
  app.appendChild(banner);

  // ---- one card per set ----
  const grid = document.createElement('div');
  grid.className = 'stamp-grid';
  for (const set of BADGE_SETS) {
    const got = set.badges.filter((b) => earned.has(b.name.toLowerCase())).length;
    const done = got === set.badges.length;
    const card = document.createElement('div');
    card.className = 'stamp-card' + (done ? ' done' : '');

    const stamps = set.badges.map((b) => {
      const on = earned.has(b.name.toLowerCase());
      const date = on ? earned.get(b.name.toLowerCase()) : null;
      return `
        <div class="stamp ${on ? 'on' : 'off'}" title="${b.name} — ${b.how}">
          <span class="stamp-badge">${b.emoji}</span>
          <span class="stamp-name">${b.name}</span>
          <span class="stamp-foot">${on ? (date ? fmtDate(date) : 'Earned') : b.how}</span>
        </div>`;
    }).join('');

    card.innerHTML = `
      <div class="stamp-card-head">
        <span class="stamp-card-emoji">${set.emoji}</span>
        <div class="stamp-card-titles">
          <div class="stamp-card-name">${set.name}</div>
          <div class="stamp-card-blurb">${set.blurb}</div>
        </div>
        <span class="stamp-card-count">${got}/${set.badges.length}</span>
      </div>
      <div class="stamp-bar"><span style="width:${(got / set.badges.length) * 100}%"></span></div>
      <div class="stamp-slots">${stamps}</div>
      <div class="coupon ${done ? 'unlocked' : 'locked'}">
        ${done
          ? `🎟️ Coupon unlocked — <b>+${set.bonus} XP</b>!`
          : `🔒 Collect all ${set.badges.length} to unlock <b>+${set.bonus} XP</b>`}
      </div>`;
    grid.appendChild(card);
  }
  app.appendChild(grid);

  // ---- grand prize ----
  const grand = document.createElement('div');
  grand.className = 'stamp-grand ' + (allDone ? 'unlocked' : 'locked');
  grand.innerHTML = allDone
    ? `${FULL_HOUSE.emoji} <b>Full House!</b> Every card complete — <b>+${FULL_HOUSE.bonus} XP</b> grand bonus 🎉`
    : `${FULL_HOUSE.emoji} <b>Full House</b> — fill all ${BADGE_SETS.length} cards for a <b>+${FULL_HOUSE.bonus} XP</b> grand bonus`;
  app.appendChild(grand);
}

function renderReports() {
  if (!PARENT) return renderEmpty();
  const reports = [...(state.student.reports || [])]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const intro = document.createElement('div');
  intro.className = 'reports-intro';
  intro.innerHTML = `👪 <b>${state.student.name}'s weekly reports</b> — a parent-only view. ` +
    `Each report covers the last 7 days of writing, growth, focus for next week, and a Korean note.`;
  app.appendChild(intro);

  if (reports.length === 0) {
    const div = document.createElement('div');
    div.className = 'empty-state';
    div.innerHTML = 'No weekly reports yet.<br>They appear here after a <code>/weekly</code> review. 📊';
    app.appendChild(div);
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'entry-list';
  for (const r of reports) {
    const btn = document.createElement('button');
    btn.className = 'entry-card';
    const label = r.kind === 'weekly' ? 'Weekly report' : r.kind;
    btn.innerHTML = `
      <span class="icon">📊</span>
      <span class="info">
        <span class="line1">${label} <span class="chip">week ending ${r.date || '—'}</span></span>
        <span class="line2">${state.student.name} · click to read the full report</span>
      </span>`;
    btn.onclick = () => openReport(r);
    wrap.appendChild(btn);
  }
  app.appendChild(wrap);
}

function renderEmpty() {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = 'No journal entries yet.<br>Write your first one with <code>/today</code> — it will show up here! ✏️';
  app.appendChild(div);
}

function render() {
  renderStudentTabs();
  app.innerHTML = '';
  if (!state.student) return renderEmpty();
  document.querySelectorAll('.viewbtn').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === state.view));
  const activeBtn = document.querySelector('.viewbtn.active');
  if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center' });
  updateMenuFade();
  if (state.view === 'books') renderBooks();
  else if (state.view === 'templates') renderTemplates();
  else if (state.view === 'stamps') renderStamps();
  else if (state.view === 'reports') renderReports();
  else renderTimeline();
}

/* ---------- entry modal ---------- */

async function openEntry(e) {
  const t = templateInfo(e.slug);
  const body = $('#modalBody');
  body.innerHTML = '<div class="empty-state">Loading…</div>';
  $('#modal').classList.remove('hidden');
  try {
    const md = await loadEntryMd(e.file);
    const sections = parseEntry(md);
    body.innerHTML = `
      <h1 style="margin:0 0 4px">${t.icon} ${t.name}</h1>
      <div class="entry-meta">
        <span class="chip">📅 ${fmtDate(e.date)}</span>
        <span class="chip">📖 ${e.book}</span>
        ${e.reading ? `<span class="chip">${e.reading}</span>` : ''}
        ${e.tier ? `<span class="chip">Tier ${e.tier}</span>` : ''}
        ${e.xp ? `<span class="chip">+${e.xp} XP</span>` : ''}
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
      </div>` : ''}
    `;
  } catch (err) {
    body.innerHTML = `<div class="empty-state">Could not load this entry.<br><code>${err.message}</code></div>`;
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
    body.innerHTML = `<div class="empty-state">Could not load this report.<br><code>${err.message}</code></div>`;
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
    b.onclick = () => { state.view = b.dataset.view; state.bookFilter = null; render(); };
  });
  const track = document.querySelector('.viewbar-track');
  if (track) track.addEventListener('scroll', updateMenuFade, { passive: true });
  window.addEventListener('resize', updateMenuFade);
  try {
    await loadManifest();
    state.student = state.manifest.students[0] || null;
    render();
  } catch (err) {
    app.innerHTML = `<div class="empty-state">⚠️ ${err.message}</div>`;
  }
}

boot();
