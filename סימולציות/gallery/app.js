/* ==========================================================================
   gallery/app.js: מצייר את האתר מתוך simulationsData.js
   - index.html: גלריית הקורסים (window.COURSES), כל קורס עם אנימציה משלו.
   - course.html?c=<id>: הסימולציות של הקורס לפי סדר הלימוד, וחלון הפעלה לכל סימולציה.
   אין צורך לערוך את הקובץ הזה כדי להוסיף סימולציה או קורס. עורכים רק את simulationsData.js.
   ========================================================================== */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const sims = window.SIMULATIONS || [], courses = window.COURSES || [];
  const byId = id => sims.find(s => s.id === id);

  /* ---------- ערכת נושא (כהה/בהיר) ---------- */
  $('themeBtn').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  /* ---------- עזרים ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const url = u => /^(https?:)?\/\//.test(u) ? u : encodeURI(u);          // שמות קבצים בעברית ועם רווחים
  const he = n => n === 1 ? 'סימולציה אחת' : n + ' סימולציות';

  /* אנימציית כניסה כשהכרטיסייה נכנסת למסך, והילה שעוקבת אחרי העכבר */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 }) : null;
  function reveal(root) { root.querySelectorAll('.card').forEach(c => io ? io.observe(c) : c.classList.add('in')); }
  function glow(root) {
    root.addEventListener('pointermove', e => {
      const c = e.target.closest('.card'); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ======================================================================
     עמוד ראשי: גלריית הקורסים
     ====================================================================== */
  function courseCard(c, i) {
    const n = c.sims.filter(byId).length, accent = c.accent || '#38bdf8';
    return `
      <a href="course.html?c=${encodeURIComponent(c.id)}" class="card group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04]"
        style="--accent:${esc(accent)}; transition-delay:${Math.min(i, 8) * 80}ms" aria-label="לקורס ${esc(c.title)}">
        <span aria-hidden="true" class="absolute inset-x-0 top-0 z-10 h-[3px]" style="background:linear-gradient(90deg, transparent, ${esc(accent)}, transparent)"></span>
        <div class="thumb relative aspect-video w-full overflow-hidden bg-[#0b1020]">
          <img src="${url(c.thumbnailUrl)}" alt="" class="absolute inset-0 h-full w-full object-cover object-center">
          <span class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></span>
          <span class="absolute right-3 top-3 rounded-lg bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">${he(n)}</span>
        </div>
        <div class="flex flex-1 flex-col p-6">
          <h2 class="text-2xl font-bold leading-snug">${esc(c.title)}</h2>
          <p class="mt-2 flex-1 leading-relaxed text-slate-600 dark:text-slate-400">${esc(c.description)}</p>
          <span class="play mt-5 inline-flex items-center justify-center gap-2 self-start rounded-xl border border-neon-violet/70 px-5 py-2.5 text-sm font-semibold text-violet-700 transition group-hover:border-transparent group-hover:bg-gradient-to-l group-hover:from-neon-blue group-hover:to-neon-violet group-hover:text-white group-hover:shadow-lg group-hover:shadow-neon-violet/30 dark:text-violet-200">
            לסימולציות של הקורס
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 6l-6 6 6 6"/></svg>
          </span>
        </div>
      </a>`;
  }
  function home() {
    const list = courses.filter(c => c.sims.some(byId));
    $('courses').innerHTML = list.map(courseCard).join('');
    const total = list.reduce((t, c) => t + c.sims.filter(byId).length, 0);
    $('simCount').textContent = list.length + ' קורסים · ' + he(total) + ' אינטראקטיביות';
    reveal($('courses')); glow($('courses'));
    // קישורים ישנים מהצורה index.html#sim=<id> ממשיכים לעבוד: עוברים לדף הקורס ופותחים את הסימולציה
    const m = location.hash.match(/^#sim=(.+)$/);
    if (m) { const id = decodeURIComponent(m[1]), c = courses.find(c => c.sims.includes(id));
      if (c) location.replace('course.html?c=' + encodeURIComponent(c.id) + '#sim=' + encodeURIComponent(id)); }
  }

  /* ======================================================================
     דף קורס: הסימולציות לפי סדר הלימוד
     ====================================================================== */
  function simCard(s, i, accent) {
    return `
      <article class="card group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-white/[.04]"
        style="--accent:${esc(s.accent || accent)}; transition-delay:${Math.min(i, 8) * 70}ms">
        <span aria-hidden="true" class="absolute inset-x-0 top-0 z-10 h-[3px]" style="background:linear-gradient(90deg, transparent, ${esc(s.accent || accent)}, transparent)"></span>
        <button type="button" data-open="${esc(s.id)}" class="thumb relative block aspect-video w-full shrink-0 overflow-hidden bg-[#0b1020]" aria-label="הפעל ${esc(s.title)}">
          ${s.thumbnailUrl ? `<img src="${url(s.thumbnailUrl)}" alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover object-center">` : `<div class="auto absolute inset-0" style="background:radial-gradient(circle at 30% 30%, ${esc(accent)}, transparent 60%), #0b1020"></div>`}
          <span class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></span>
          <span class="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-lg font-extrabold text-white shadow-lg ring-2 ring-white/70" style="background:${esc(accent)}">${i + 1}</span>
          <span class="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover:opacity-100">
            <span class="grid h-14 w-14 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md ring-1 ring-white/40">
              <svg class="ml-[-3px] h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </span>
        </button>
        <div class="flex flex-1 flex-col p-5">
          <div class="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">שלב ${i + 1}</div>
          <h3 class="mt-1 text-lg font-bold leading-snug">${esc(s.title)}</h3>
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
  function coursePage() {
    const id = new URLSearchParams(location.search).get('c'), c = courses.find(x => x.id === id);
    if (!c) { $('courseTitle').textContent = 'הקורס לא נמצא'; $('courseDesc').innerHTML = '<a class="underline" href="index.html">חזרה לכל הקורסים</a>'; return; }
    const list = c.sims.map(byId).filter(Boolean), accent = c.accent || '#38bdf8';
    document.title = c.title + ' · LIMA';
    $('courseTitle').textContent = c.title; $('courseDesc').textContent = c.description;
    $('courseCount').textContent = he(list.length) + ' · לפי סדר הלימוד בקורס';
    $('courseArt').src = url(c.thumbnailUrl); $('courseArt').parentElement.style.setProperty('--accent', accent);
    $('simList').innerHTML = list.map((s, i) => simCard(s, i, accent)).join('');
    reveal($('simList')); glow($('simList'));
    modal(list);
  }

  /* ---------- חלון ההפעלה ----------
     הכתובת מתעדכנת ל-#sim=<id>, ולכן כפתור "אחורה" של הדפדפן סוגר את החלון,
     ואפשר גם לשלוח למישהו קישור ישיר לסימולציה. */
  function modal(list) {
    let lastFocus = null;
    function openSim(id, push) {
      const s = list.find(x => x.id === id); if (!s) return;
      lastFocus = document.activeElement;
      $('modalTitle').textContent = s.title;
      $('modalNewTab').href = url(s.simulationUrl);
      $('loader').classList.remove('hidden');
      $('frame').src = url(s.simulationUrl);
      $('modal').classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (push) history.pushState({ sim: id }, '', location.pathname + location.search + '#sim=' + encodeURIComponent(id));
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
    $('simList').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openSim(b.dataset.open, true); });
    $('modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSim(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSim(false); });
    window.addEventListener('popstate', () => {
      const m = location.hash.match(/^#sim=(.+)$/);
      if (m) openSim(decodeURIComponent(m[1]), false); else closeSim(true);
    });
    const m = location.hash.match(/^#sim=(.+)$/); if (m) openSim(decodeURIComponent(m[1]), false);
  }

  if ($('courses')) home();
  if ($('simList')) coursePage();
})();
