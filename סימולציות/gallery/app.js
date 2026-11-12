/* ==========================================================================
   gallery/app.js — מצייר את הגלריה מתוך window.SIMULATIONS (simulationsData.js)
   אין צורך לערוך את הקובץ הזה כדי להוסיף סימולציות. עורכים רק את simulationsData.js.
   ========================================================================== */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const sims = (window.SIMULATIONS || []).slice().sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  const state = { cat: 'הכול', q: '' };

  /* ---------- ערכת נושא (כהה/בהיר) ---------- */
  $('themeBtn').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  /* ---------- עזרים ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = u => /^(https?:)?\/\//.test(u) ? u : encodeURI(u);          // תמיכה בשמות קבצים בעברית ועם רווחים
  const he = n => n === 1 ? 'סימולציה אחת' : n + ' סימולציות';

  /* ---------- כפתורי הסינון (לפי category) ---------- */
  function buildFilters() {
    const cats = ['הכול', ...new Set(sims.map(s => s.category).filter(Boolean))];
    $('filters').innerHTML = cats.map(c => {
      const n = c === 'הכול' ? sims.length : sims.filter(s => s.category === c).length;
      return `<button type="button" role="tab" data-cat="${esc(c)}"
        class="filter rounded-xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5">${esc(c)}<span class="mr-1.5 opacity-60">${n}</span></button>`;
    }).join('');
    $('filters').addEventListener('click', e => {
      const b = e.target.closest('[data-cat]'); if (!b) return;
      state.cat = b.dataset.cat; render();
    });
  }
  function paintFilters() {
    document.querySelectorAll('.filter').forEach(b => {
      const on = b.dataset.cat === state.cat;
      b.setAttribute('aria-selected', on);
      b.className = 'filter rounded-xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ' + (on
        ? 'border-transparent bg-gradient-to-l from-neon-blue to-neon-violet text-white shadow-lg shadow-neon-violet/25'
        : 'border-slate-300 bg-white/80 text-slate-700 backdrop-blur hover:border-neon-violet hover:text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 dark:hover:text-white');
    });
  }

  /* ---------- כרטיסייה ---------- */
  function card(s, i) {
    const accent = s.accent || '#38bdf8';
    const thumb = s.thumbnailUrl
      ? `<img src="${url(s.thumbnailUrl)}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover object-center">`
      : `<div class="auto absolute inset-0" style="background:radial-gradient(circle at 30% 30%, ${accent}, transparent 60%), radial-gradient(circle at 75% 70%, #a855f7, transparent 55%), #0b1020"></div>`;
    return `
      <article class="card group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04]"
        style="--accent:${esc(accent)}; transition-delay:${Math.min(i, 8) * 70}ms">
        <span aria-hidden="true" class="absolute inset-x-0 top-0 z-10 h-[3px]" style="background:linear-gradient(90deg, transparent, ${esc(accent)}, transparent)"></span>
        <button type="button" data-open="${esc(s.id)}" class="thumb relative block aspect-video w-full shrink-0 overflow-hidden bg-[#0b1020]" aria-label="הפעל ${esc(s.title)}">
          ${thumb}
          <span class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></span>
          ${s.category ? `<span class="absolute right-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">${esc(s.category)}</span>` : ''}
          <span class="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span class="grid h-14 w-14 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/40">
              <svg class="ml-[-3px] h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </span>
        </button>
        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-lg font-bold leading-snug">${esc(s.title)}</h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">${esc(s.description)}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            ${(s.tags || []).map(t => `<span class="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">#${esc(t)}</span>`).join('')}
          </div>
          <button type="button" data-open="${esc(s.id)}"
            class="play mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-neon-violet/70 bg-transparent px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-transparent hover:bg-gradient-to-l hover:from-neon-blue hover:to-neon-violet hover:text-white hover:shadow-lg hover:shadow-neon-violet/30 dark:text-violet-200">
            הפעל סימולציה
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16 5v14L5 12z"/></svg>
          </button>
        </div>
      </article>`;
  }

  /* ---------- ציור הגלריה ---------- */
  function render() {
    const q = state.q.trim().toLowerCase();
    const list = sims.filter(s =>
      (state.cat === 'הכול' || s.category === state.cat) &&
      (!q || [s.title, s.description, s.category, ...(s.tags || [])].join(' ').toLowerCase().includes(q)));
    $('grid').innerHTML = list.map(card).join('');
    $('empty').classList.toggle('hidden', list.length > 0);
    paintFilters();
    reveal();
  }

  /* אנימציית כניסה כשהכרטיסייה נכנסת למסך */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 }) : null;
  function reveal() {
    document.querySelectorAll('#grid .card').forEach(c => io ? io.observe(c) : c.classList.add('in'));
  }

  /* הילה שעוקבת אחרי העכבר על הכרטיסייה */
  $('grid').addEventListener('pointermove', e => {
    const c = e.target.closest('.card'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* ---------- חלון ההפעלה ----------
     הכתובת מתעדכנת ל-#sim=<id>, ולכן כפתור "אחורה" של הדפדפן סוגר את החלון,
     ואפשר גם לשלוח למישהו קישור ישיר לסימולציה. */
  let lastFocus = null;
  function openSim(id, push) {
    const s = sims.find(x => x.id === id); if (!s) return;
    lastFocus = document.activeElement;
    $('modalTitle').textContent = s.title;
    $('modalNewTab').href = url(s.simulationUrl);
    $('loader').classList.remove('hidden');
    $('frame').src = url(s.simulationUrl);
    $('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (push) history.pushState({ sim: id }, '', '#sim=' + encodeURIComponent(id));
    setTimeout(() => $('modal').querySelector('[data-close]:not(.modal-backdrop)').focus(), 50);
  }
  function closeSim(fromHistory) {
    if ($('modal').classList.contains('hidden')) return;
    $('modal').classList.add('hidden');
    $('frame').src = 'about:blank';                  // עוצר את הסימולציה (אנימציות, צלילים)
    document.body.style.overflow = '';
    if (!fromHistory && location.hash.startsWith('#sim=')) history.back();
    if (lastFocus) lastFocus.focus();
  }
  $('frame').addEventListener('load', () => $('loader').classList.add('hidden'));
  $('grid').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openSim(b.dataset.open, true); });
  $('modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSim(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSim(false); });
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#sim=(.+)$/);
    if (m) openSim(decodeURIComponent(m[1]), false); else closeSim(true);
  });

  /* ---------- אתחול ---------- */
  $('simCount').textContent = he(sims.length) + ' אינטראקטיביות';
  $('search').addEventListener('input', e => { state.q = e.target.value; render(); });
  buildFilters(); render();
  const m = location.hash.match(/^#sim=(.+)$/); if (m) openSim(decodeURIComponent(m[1]), false);
})();
