// 把 content/ 下的 Markdown 编译成静态网站，输出到 dist/。
// 用法：
//   node tools/build.mjs                 编译网站（PDF 见 tools/pdf.mjs）
//   node tools/build.mjs --merge FILE    按 SUMMARY.md 的顺序合并成一个 Markdown 文件（做 PDF 用）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import config from '../site.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(ROOT, 'tools', 'site');
const SITE_TITLE = config.title;
const PDF_FILE = path.join(ROOT, 'output', `${SITE_TITLE}.pdf`);   // tools/pdf.mjs 的输出
const PDF_URL = '/downloads/guide.pdf';
// 只在网页上出现、不排进 PDF 的页面
const WEB_ONLY = new Set(['download.md']);

// ---------- 目录 ----------

// SUMMARY.md：“## 标题”开一个分组，“- [标题](路径)”是一页
function readSummary() {
  const groups = [];
  let cur = { title: null, pages: [] };
  groups.push(cur);
  for (const line of fs.readFileSync(path.join(CONTENT, 'SUMMARY.md'), 'utf8').split('\n')) {
    const g = line.match(/^##\s+(.+)/);
    if (g) { cur = { title: g[1].trim(), pages: [] }; groups.push(cur); continue; }
    const p = line.match(/^\s*-\s+\[(.+?)\]\((.+?)\)/);
    if (p) cur.pages.push({ label: p[1], file: p[2] });
  }
  return groups.filter(g => g.pages.length);
}

const urlOf = file => {
  const f = file.replace(/\.md$/, '');
  if (f === 'index') return '/';
  return '/' + f.replace(/(^|\/)index$/, '') + (f.endsWith('index') ? '' : '/');
};
const outOf = url => path.join(DIST, url, 'index.html');

// ---------- 工具函数 ----------

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = s => s.replace(/<[^>]+>/g, '').replace(/\*\*|__|`/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim();

function slugify(text, used) {
  let s = plain(text).toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[^\p{L}\p{N}\-]/gu, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'section';
  let id = s, n = 2;
  while (used.has(id)) id = `${s}-${n++}`;
  used.add(id);
  return id;
}

const PART_NO = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };

// ---------- 读页面、收集标题 ----------

function loadPages(groups) {
  const pages = [];
  groups.forEach((g, gi) => {
    const part = (g.title && g.title.match(/第([一二三四五六七八九十])部分/)) ? PART_NO[g.title.match(/第([一二三四五六七八九十])部分/)[1]] : null;
    g.pages.forEach((p, pi) => {
      const src = fs.readFileSync(path.join(CONTENT, p.file), 'utf8');
      const used = new Set();
      const headings = [];
      let fence = false;
      for (const line of src.split('\n')) {
        if (line.startsWith('```')) fence = !fence;
        const m = !fence && line.match(/^(#{1,6})\s+(.+)/);
        if (m) headings.push({ level: m[1].length, text: plain(m[2]), id: slugify(m[2], used) });
      }
      const title = headings.find(h => h.level === 1)?.text || p.label;
      pages.push({ ...p, src, title, headings, url: urlOf(p.file), group: g, groupIndex: gi, first: pi === 0, part });
    });
  });
  return pages;
}

// ---------- 交叉引用：“见第一部分‘某个标题’”自动变成链接 ----------

function makeXref(pages) {
  const byPart = {};
  for (const p of pages) if (p.part) {
    (byPart[p.part] ||= []).push(...p.headings.map(h => ({ ...h, page: p })));
  }
  const target = (part, name) => {
    const hs = byPart[part] || [];
    name = name.trim();
    const exact = hs.find(h => h.text === name) || hs.find(h => h.text.replace(/\s*★$/, '') === name);
    if (exact) return exact;
    // 最长前缀匹配：name 以标题开头（冒号形式“标题：子标题”），或标题以 name 开头
    let best = null;
    for (const h of hs) {
      if (name.startsWith(h.text) || h.text.startsWith(name)) {
        if (!best || h.text.length > best.text.length) best = h;
      }
    }
    // “A：B”：优先找到子标题 B
    const parts = name.split('：');
    if (parts.length > 1) {
      for (let i = parts.length - 1; i > 0; i--) {
        const tail = parts.slice(i).join('：');
        const hit = hs.find(h => h.text === tail) || hs.find(h => h.text.startsWith(tail) || tail.startsWith(h.text));
        if (hit && (!best || hit.text.length >= best.text.length)) { best = hit; break; }
      }
    }
    return best;
  };
  const href = h => h.level === 1 ? h.page.url : `${h.page.url}#${h.id}`;

  return (src, fromPage) => {
    let fence = false;
    return src.split('\n').map(line => {
      if (line.startsWith('```')) { fence = !fence; return line; }
      if (fence || /^#{1,6}\s/.test(line)) return line;
      // 引号形式：第一部分“某个标题”
      line = line.replace(/(?<!\[)第([一二三四五六七八九十])部分(“([^”]+)”)/g, (all, n, q, name) => {
        const h = target(PART_NO[n], name);
        if (!h) {
          const idx = pages.find(p => p.part === PART_NO[n] && p.first);
          return idx && idx.group.title.includes(name) ? `[${all}](${idx.url})` : all;
        }
        return `[${all}](${href(h)})`;
      });
      // 冒号形式（答案表里）：第一部分：某个标题：某个子标题
      line = line.replace(/(?<!\[)第([一二三四五六七八九十])部分：([^|；。（]+?)(?=\s*(\||；|。|（|<br\/>|$))/g, (all, n, name) => {
        const h = target(PART_NO[n], name);
        if (!h) {
          const idx = pages.find(p => p.part === PART_NO[n] && p.first);
          if (idx && idx.group.title.includes(name.trim())) return `[${all}](${idx.url})`;
          return all;
        }
        return `[${all}](${href(h)})`;
      });
      return line;
    }).join('\n');
  };
}

// ---------- 句中加粗上强调色 ----------
// 只给“句子中间”的加粗加 class="hl"（CSS 里是珊瑚色），下面这些保持普通加粗：
//   1. 表头行（th）里的加粗；表格第一列开头的加粗词（表头列的关键词，如“**术语** 解释”）。
//      第一列里句子中间的加粗照常上色，如“这里的 **关键词** 要注意。”
//   2. 标题里的加粗
//   3. 占满整段、整个列表项或整个单元格的加粗（包括只由几个加粗词和标点组成的，如“**甲**、**乙**”）
//   4. 以冒号结尾的标签式加粗，如“**构成：**”“**易错点：**”
//   5. 自成一整句的加粗：以 。！？.!? 结尾，且前面是段首、换行或句末标点，
//      如段首的主题句“**这一节讲……。** 后面的说明……”
const SENTENCE_END = /[。！？.!?]$/;
const BOUNDARY = /[。！？：；.!?:;\n]$/;

function markInlineEmphasis(state) {
  let inTh = false, inTd = false, inHeading = false, col = -1;
  for (const tok of state.tokens) {
    if (tok.type === 'tr_open') col = -1;
    if (tok.type === 'th_open') { inTh = true; col++; }
    if (tok.type === 'th_close') inTh = false;
    if (tok.type === 'td_open') { inTd = true; col++; }
    if (tok.type === 'td_close') inTd = false;
    if (tok.type === 'heading_open') inHeading = true;
    if (tok.type === 'heading_close') inHeading = false;
    if (tok.type !== 'inline' || !tok.children) continue;
    const inFirstCol = inTd && col === 0;
    if (inTh || inHeading) continue;

    const kids = tok.children;
    const textOf = t => t.type === 'text' || t.type === 'code_inline' ? t.content
      : (t.type === 'softbreak' || t.type === 'hardbreak' || (t.type === 'html_inline' && /^<br/i.test(t.content))) ? '\n' : '';
    // 整块只由几个加粗词和标点组成（如“**甲**、**乙**”），视同整块加粗
    let lvl = 0, outside = '';
    for (const k of kids) {
      if (k.type === 'strong_open') lvl++;
      else if (k.type === 'strong_close') lvl--;
      else if (!lvl) outside += textOf(k);
    }
    if (!outside.replace(/[\s、，,；;\/（）()]+/g, '')) continue;

    for (let i = 0; i < kids.length; i++) {
      if (kids[i].type !== 'strong_open') continue;
      let depth = 0, j = i;
      for (; j < kids.length; j++) {
        if (kids[j].type === 'strong_open') depth++;
        if (kids[j].type === 'strong_close' && --depth === 0) break;
      }
      const inner = kids.slice(i + 1, j).map(textOf).join('').trim();
      const before = kids.slice(0, i).map(textOf).join('').replace(/[ \t]+$/, '');
      const after = kids.slice(j + 1).map(textOf).join('').trim();
      const whole = !before.trim() && !after;                              // 3
      const label = /[：:]$/.test(inner);                                  // 4
      const sentence = SENTENCE_END.test(inner) && (!before.trim() || BOUNDARY.test(before)); // 5
      const keyTerm = inFirstCol && !before.trim();                         // 1
      if (!whole && !label && !sentence && !keyTerm) kids[i].attrJoin('class', 'hl');
      i = j;
    }
  }
}

// ---------- Markdown 渲染 ----------

function makeRenderer(page, pagesByFile) {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
  const dir = path.posix.dirname(page.file);
  const resolve = href => path.posix.normalize(path.posix.join(dir, href));

  let hi = 0;
  md.renderer.rules.heading_open = (tokens, i, opts, env, self) => {
    const h = page.headings[hi++];
    if (h) tokens[i].attrSet('id', h.id);
    return self.renderToken(tokens, i, opts);
  };
  md.renderer.rules.heading_close = (tokens, i, opts, env, self) => {
    const open = tokens[i - 2];
    const id = open?.attrGet('id');
    const lvl = +tokens[i].tag.slice(1);
    const anchor = id && lvl > 1 ? `<a class="anchor" href="#${id}" aria-label="本节链接">#</a>` : '';
    return anchor + self.renderToken(tokens, i, opts);
  };
  md.core.ruler.push('emphasis_color', markInlineEmphasis);
  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';
  const fenceDefault = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, i, opts, env, self) => {
    if (tokens[i].info.trim() === 'mermaid') { page.hasMermaid = true; return `<pre class="mermaid">${esc(tokens[i].content)}</pre>\n`; }
    return fenceDefault(tokens, i, opts, env, self);
  };
  // 站内 .md 链接 → 页面地址；外链新窗口打开
  md.renderer.rules.link_open = (tokens, i, opts, env, self) => {
    const t = tokens[i];
    const href = t.attrGet('href') || '';
    if (/^https?:\/\//.test(href)) {
      t.attrSet('target', '_blank'); t.attrSet('rel', 'noopener'); t.attrJoin('class', 'ext');
    } else if (href.endsWith('.pdf')) {
      t.attrSet('download', `${SITE_TITLE}.pdf`); t.attrJoin('class', 'btn');
    } else if (/\.md(#.*)?$/.test(href)) {
      const [f, hash] = href.split('#');
      const target = pagesByFile[resolve(f)];
      if (target) t.attrSet('href', target.url + (hash ? '#' + hash : ''));
    }
    return self.renderToken(tokens, i, opts);
  };
  // 图片：相对路径 → 站点绝对路径
  const imgDefault = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, i, opts, env, self) => {
    const t = tokens[i];
    const src = t.attrGet('src');
    if (src && !/^(https?:)?\//.test(src)) t.attrSet('src', '/' + resolve(src));
    t.attrSet('loading', 'lazy');
    return imgDefault(tokens, i, opts, env, self);
  };
  return md;
}

// ---------- 页面模板 ----------

function sidebar(groups, current) {
  return groups.map(g => {
    const items = g.pages.map(p => {
      const url = urlOf(p.file);
      const cls = url === current.url ? ' class="active" aria-current="page"' : '';
      return `<li><a href="${url}"${cls}>${esc(p.label)}</a></li>`;
    }).join('');
    if (!g.title) return `<ul class="nav-top">${items}</ul>`;
    const open = g.pages.some(p => urlOf(p.file) === current.url) ? ' open' : '';
    return `<details class="nav-group"${open}><summary>${esc(g.title)}</summary><ul>${items}</ul></details>`;
  }).join('\n');
}

function pageToc(page) {
  const hs = page.headings.filter(h => h.level === 2 || h.level === 3);
  if (hs.length < 2) return '';
  return `<nav class="toc" aria-label="本页目录"><div class="toc-title">本页目录</div><ul>${
    hs.map(h => `<li class="l${h.level}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ul></nav>`;
}

function childList(page, pages) {
  if (!page.first || !page.group.title) return '';
  const kids = pages.filter(p => p.group === page.group && p !== page);
  if (!kids.length) return '';
  return `<div class="child-list"><h2>本部分内容</h2><ol>${
    kids.map(p => `<li><a href="${p.url}">${esc(p.label)}</a></li>`).join('')}</ol></div>`;
}

function layout({ page, body, groups, prev, next, pages }) {
  const title = page.url === '/' ? SITE_TITLE : `${page.title} · ${SITE_TITLE}`;
  const crumb = page.group.title ? `<div class="crumb">${esc(page.group.title)}</div>` : '';
  const pager = `<nav class="pager">${
    prev ? `<a class="prev" href="${prev.url}"><span>上一页</span>${esc(prev.label)}</a>` : '<span></span>'}${
    next ? `<a class="next" href="${next.url}"><span>下一页</span>${esc(next.label)}</a>` : '<span></span>'}</nav>`;
  const mermaid = page.hasMermaid
    ? `<script type="module">import m from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';m.initialize({startOnLoad:true,theme:'neutral'});</script>`
    : '';
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(title)}</title>
<meta name="description" content="${esc(`${SITE_TITLE}：${config.audience}`)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<header class="topbar">
  <button class="menu-btn" aria-label="打开目录" aria-expanded="false">☰</button>
  <a class="brand" href="/">${esc(SITE_TITLE)}</a>
  <div class="search">
    <input type="search" id="q" placeholder="搜索全文" autocomplete="off" aria-label="搜索全文">
    <div class="results" id="results" hidden></div>
  </div>
</header>
<div class="layout">
  <aside class="sidebar" id="sidebar"><nav aria-label="目录">${sidebar(groups, page)}</nav></aside>
  <main class="main">
    <article class="markdown">${crumb}${body}${childList(page, pages)}</article>
    ${pager}
  </main>
  ${pageToc(page)}
</div>
<div class="scrim" hidden></div>
<script src="/assets/app.js" defer></script>
${mermaid}
</body>
</html>
`;
}

// ---------- 搜索索引 ----------

function searchEntries(page, html) {
  const out = [];
  const parts = html.split(/(?=<h[1-4][^>]*id=")/);
  for (const part of parts) {
    const m = part.match(/^<h([1-4])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/);
    const text = part.replace(/<a class="anchor"[^>]*>#<\/a>/g, '').replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const heading = m ? m[3].replace(/<[^>]+>/g, '').replace(/#$/, '').trim() : page.title;
    out.push({ u: page.url + (m && m[1] !== '1' ? '#' + m[2] : ''), p: page.title, h: heading, t: text });
  }
  return out;
}

// ---------- PDF 下载 ----------

// 把 output/ 里的 PDF 复制到 dist/downloads/，返回大小、页数、生成日期；没有 PDF 时返回 null
function copyPdf() {
  if (!fs.existsSync(PDF_FILE)) {
    console.warn(`warning: 没有找到 ${path.relative(ROOT, PDF_FILE)}，下载页不提供文件。先运行 pnpm pdf。`);
    return null;
  }
  const out = path.join(DIST, PDF_URL);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(PDF_FILE, out);
  const buf = fs.readFileSync(PDF_FILE);
  const stat = fs.statSync(PDF_FILE);
  return {
    size: stat.size < 1024 * 1024 ? Math.ceil(stat.size / 1024) + ' KB' : (stat.size / 1024 / 1024).toFixed(1) + ' MB',
    pages: (buf.toString('latin1').match(/\/Type \/Page\b/g) || []).length,
    date: stat.mtime.toISOString().slice(0, 10),
  };
}

// 下载页里的占位符：{{PDF_LINK}}、{{PDF_PAGES}}、{{PDF_SIZE}}、{{PDF_DATE}}
function fillPdfInfo(src, pdf) {
  if (!src.includes('{{PDF_')) return src;
  if (!pdf) return src.replace(/^.*\{\{PDF_LINK\}\}.*$/m, '> PDF 暂未生成，请稍后再来。').replace(/\{\{PDF_\w+\}\}/g, '—');
  return src
    .replace('{{PDF_LINK}}', `[下载 PDF](${PDF_URL})`)
    .replace(/\{\{PDF_PAGES\}\}/g, String(pdf.pages))
    .replace(/\{\{PDF_SIZE\}\}/g, pdf.size)
    .replace(/\{\{PDF_DATE\}\}/g, pdf.date);
}

// ---------- 主流程 ----------

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

function build() {
  const groups = readSummary();
  const pages = loadPages(groups);
  const pagesByFile = Object.fromEntries(pages.map(p => [p.file, p]));
  const xref = makeXref(pages);
  const unresolved = [];

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(path.join(CONTENT, 'images'), path.join(DIST, 'content-images-tmp'));
  fs.renameSync(path.join(DIST, 'content-images-tmp'), path.join(DIST, 'images'));
  copyDir(ASSETS, path.join(DIST, 'assets'));
  const pdf = copyPdf();

  // 图片在 content/images，页面在 content/<部分>/，渲染时路径解析到 /images/…
  const index = [];
  pages.forEach((page, i) => {
    const src = xref(fillPdfInfo(page.src, pdf), page);
    const md = makeRenderer(page, pagesByFile);
    let body = md.render(src).replace(/src="\/(\.\.\/)*images\//g, 'src="/images/');
    const html = layout({ page, body, groups, prev: pages[i - 1], next: pages[i + 1], pages });
    fs.mkdirSync(path.dirname(outOf(page.url)), { recursive: true });
    fs.writeFileSync(outOf(page.url), html);
    index.push(...searchEntries(page, body));
    // 检查：图片是否存在
    for (const m of body.matchAll(/<img[^>]+src="\/images\/([^"]+)"/g)) {
      if (!fs.existsSync(path.join(CONTENT, 'images', decodeURIComponent(m[1])))) unresolved.push(`${page.file}: 缺图片 ${m[1]}`);
    }
  });
  fs.writeFileSync(path.join(DIST, 'search-index.json'), JSON.stringify(index));

  // 404
  const nf = { ...pages[0], title: '页面不存在', url: '/404', headings: [], group: { title: null }, first: false };
  fs.writeFileSync(path.join(DIST, '404.html'),
    layout({ page: nf, body: '<h1>页面不存在</h1><p>这个地址没有内容。可以从左侧目录找，或者<a href="/">回到首页</a>。</p>', groups, pages }));

  console.log(`built ${pages.length} pages → dist/ (search index ${index.length} entries)`);
  const problems = [...unresolved, ...makeXrefProbe(pages)];
  if (problems.length) { console.log('warnings:'); problems.forEach(p => console.log('  ' + p)); }
}

// 单独跑一遍交叉引用，列出没解析到的
function makeXrefProbe(pages) {
  const out = [];
  const xref = makeXref(pages);
  for (const p of pages) {
    let fence = false;
    const res = xref(p.src, p).split('\n').filter(l => {
      if (l.startsWith('```')) { fence = !fence; return false; }
      return !fence && !/^#{1,6}\s/.test(l);
    }).join('\n');
    for (const m of res.matchAll(/(?<!\[)第[一二三四五六七八九十]部分(“[^”]+”|：[^|；。（\n]+)/g)) {
      // 已被转成链接的会带 [ 前缀，这里剩下的就是没解析的
      out.push(`${p.file}: 交叉引用未解析 ${m[0].slice(0, 40)}`);
    }
  }
  return out;
}

function merge(outFile) {
  const groups = readSummary();
  const pages = loadPages(groups);
  const text = pages.map(p => p.src.replace(/(\]\(|src=")(\.\.\/)+images\//g, '$1images/')).join('\n\n');
  fs.writeFileSync(path.join(ROOT, outFile), text);
  console.log(`merged ${pages.length} pages → ${outFile}`);
}

// 供 tools/pdf.mjs 复用
export { ROOT, CONTENT, SITE_TITLE, config, WEB_ONLY, readSummary, loadPages, makeXref, markInlineEmphasis, urlOf };

// 直接运行时才构建；被 import 时不执行
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args[0] === '--merge') merge(args[1] || 'guide.md');
  else build();
}
