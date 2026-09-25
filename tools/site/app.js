// 目录抽屉、本页目录高亮、全文搜索
(() => {
  const body = document.body;
  const btn = document.querySelector('.menu-btn');
  const scrim = document.querySelector('.scrim');

  // ---------- 手机目录抽屉 ----------
  const setNav = open => {
    body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
  };
  btn.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  scrim.addEventListener('click', () => setNav(false));

  // 当前页在侧栏里滚到可见处
  // 只滚动侧栏本身，不带动整个页面
  const side = document.getElementById('sidebar');
  const active = side.querySelector('a.active');
  if (active) side.scrollTop = active.offsetTop - side.clientHeight / 2;

  // ---------- 本页目录高亮 ----------
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map(a => [decodeURIComponent(a.hash.slice(1)), a]));
    const heads = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);
    const visible = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      let cur = heads.find(h => visible.has(h));
      if (!cur) cur = [...heads].reverse().find(h => h.getBoundingClientRect().top < 120);
      tocLinks.forEach(a => a.classList.remove('active'));
      if (cur) map.get(cur.id)?.classList.add('active');
    }, { rootMargin: '-60px 0px -70% 0px' });
    heads.forEach(h => io.observe(h));
  }

  // ---------- 全文搜索 ----------
  const input = document.getElementById('q');
  const box = document.getElementById('results');
  let index = null, loading = null, sel = -1;

  const load = () => loading ||= fetch('/search-index.json').then(r => r.json()).then(d => (index = d));
  const escHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function snippet(text, terms) {
    const lower = text.toLowerCase();
    let pos = -1;
    for (const t of terms) { pos = lower.indexOf(t); if (pos >= 0) break; }
    const start = Math.max(0, pos - 30);
    let s = (start > 0 ? '…' : '') + text.slice(start, start + 110) + (start + 110 < text.length ? '…' : '');
    s = escHtml(s);
    const re = new RegExp('(' + terms.map(t => escRe(escHtml(t))).join('|') + ')', 'gi');
    return s.replace(re, '<mark>$1</mark>');
  }

  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const res = [];
    for (const e of index) {
      const h = e.h.toLowerCase(), p = e.p.toLowerCase(), t = e.t.toLowerCase();
      if (!terms.every(term => t.includes(term) || h.includes(term) || p.includes(term))) continue;
      let score = 0;
      for (const term of terms) {
        if (p.includes(term)) score += 6;
        if (h.includes(term)) score += 4;
        if (t.includes(term)) score += 1;
      }
      res.push({ e, score });
    }
    res.sort((a, b) => b.score - a.score);
    return res.slice(0, 30).map(({ e }) => ({ ...e, terms }));
  }

  function render(list, q) {
    sel = -1;
    if (!q.trim()) { box.hidden = true; return; }
    box.hidden = false;
    if (!list.length) { box.innerHTML = `<div class="empty">没有找到“${escHtml(q)}”</div>`; return; }
    box.innerHTML = list.map(r => `<a href="${escHtml(r.u)}">
      <div class="r-title">${escHtml(r.h)}</div>
      ${r.h !== r.p ? `<div class="r-path">${escHtml(r.p)}</div>` : ''}
      <div class="r-snip">${snippet(r.t, r.terms)}</div></a>`).join('');
  }

  let timer;
  input.addEventListener('focus', load);
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => { await load(); render(search(input.value), input.value); }, 120);
  });
  input.addEventListener('keydown', e => {
    const items = [...box.querySelectorAll('a')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((a, i) => a.classList.toggle('sel', i === sel));
      items[sel].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      const a = items[sel >= 0 ? sel : 0];
      if (a) location.href = a.href;
    } else if (e.key === 'Escape') {
      box.hidden = true; input.blur();
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) box.hidden = true; });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault(); input.focus();
    }
  });
  // 点搜索结果跳到同页锚点时，收起结果
  box.addEventListener('click', () => { box.hidden = true; setNav(false); });
})();
