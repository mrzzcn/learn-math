// 把 content/ 生成 A4 纵向 PDF（pdfmake）。
// 用法：
//   node tools/pdf.mjs                    全书 → output/<书名>.pdf（书名见 site.config.mjs）
//   node tools/pdf.mjs --only 1-part      只排文件名以此开头的页面（出样张）
//   node tools/pdf.mjs --sample           同 --only，路径前缀取 site.config.mjs 的 sample
//   node tools/pdf.mjs --out 文件名.pdf          指定输出文件
// 渲染规则和网站一致：交叉引用、句中加粗上色都复用 tools/build.mjs。
import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import pdfmake from 'pdfmake';
import { ROOT, CONTENT, SITE_TITLE, config, WEB_ONLY, readSummary, loadPages, makeXref, markInlineEmphasis } from './build.mjs';
import { ensureFonts } from './fonts.mjs';

// ---------- 参数 ----------

const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ONLY = opt('--only') || (args.includes('--sample') ? config.sample : null);
const OUT = path.resolve(ROOT, opt('--out') || path.join('output', ONLY ? `样张-${ONLY.replace(/\W+/g, '-')}.pdf` : `${SITE_TITLE}.pdf`));

// ---------- 版式常量（单位 pt，1 mm ≈ 2.835 pt） ----------

const MM = 2.835;
const PAGE = { width: 595.28, height: 841.89 };               // A4 纵向
const MARGIN = [18 * MM, 15 * MM, 12 * MM, 12 * MM];            // 左 上 右 下：左边保留装订余量，其余收窄
const CONTENT_W = PAGE.width - MARGIN[0] - MARGIN[2];
const C = {
  text: '#1f2328', soft: '#57606a', line: '#d9dde3', fill: '#f4f5f7', head: '#eef0f3',
  emph: '#cd4b30',   // 句中加粗，和网站的 --emph 相同
  accent: '#c62828', link: '#1f5fa8',
};

// ---------- 字体 ----------

const FONT = 'Noto Sans SC';

// ---------- 小工具 ----------

const pageKey = file => file.replace(/\.md$/, '').replace(/[^\w]+/g, '-');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 依据行：以 config.citePrefixes 开头的段落排成灰色小字
const CITE = new RegExp(`^(${config.citePrefixes.map(escRe).join('|')})`);
const decode = s => { try { return decodeURIComponent(s); } catch { return s; } };

// ---------- Markdown → pdfmake ----------

function makeMd() {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
  md.core.ruler.push('emphasis_color', markInlineEmphasis);
  return md;
}

// 把 inline token 的 children 转成 pdfmake 的文字片段；图片单独收集
function inlineToRuns(children, ctx) {
  const runs = [];
  const images = [];
  let bold = 0, hl = 0, em = 0, u = 0, link = null;
  const push = (text, extra = {}) => {
    if (!text) return;
    const r = { text };
    if (bold) r.bold = true;
    if (hl) r.color = C.emph;
    if (u) r.decoration = 'underline';
    if (link) Object.assign(r, link.attrs);
    Object.assign(r, extra);
    runs.push(r);
  };
  for (const t of children) {
    switch (t.type) {
      case 'text': push(t.content); break;
      case 'code_inline': push(t.content, { background: C.fill }); break;
      case 'softbreak': push(' '); break;
      case 'hardbreak': push('\n'); break;
      case 'strong_open': bold++; if ((t.attrGet('class') || '').includes('hl')) hl++; break;
      case 'strong_close': bold--; if (hl > bold) hl = bold; break;
      case 'em_open': em++; break;
      case 'em_close': em--; break;
      case 'html_inline': {
        const h = t.content.toLowerCase();
        if (/^<br\s*\/?>/.test(h)) push('\n');
        else if (h.startsWith('<u>')) u++;
        else if (h.startsWith('</u>')) u--;
        break;
      }
      case 'link_open': link = ctx.resolveLink(t.attrGet('href') || ''); break;
      case 'link_close':
        if (link?.after) runs.push(link.after);
        link = null;
        break;
      case 'image': images.push(ctx.image(t.attrGet('src'), t.content)); break;
      default: if (t.content) push(t.content);
    }
  }
  // 行首的换行去掉（单元格以 <br/> 开头的情况）
  while (runs.length && runText(runs[0]) === '\n') runs.shift();
  return { runs, images };
}

// 文字片段的纯文本（交叉引用后面的“（第 N 页）”是嵌套片段）
const runText = r => typeof r.text === 'string' ? r.text : Array.isArray(r.text) ? r.text.map(runText).join('') : '';

// 估算一段文字的“显示宽度”，中文算 1，英文算 0.55
function textWidthUnits(s) {
  let n = 0;
  for (const ch of s) n += /[⺀-鿿＀-￯　-〿]/.test(ch) ? 1 : 0.55;
  return n;
}

function tokensToContent(tokens, ctx) {
  const out = [];
  let i = 0;

  const block = (until) => {
    const items = [];
    while (i < tokens.length && tokens[i].type !== until) {
      const node = one();
      if (node) Array.isArray(node) ? items.push(...node) : items.push(node);
    }
    i++; // 跳过 close
    return items;
  };

  const one = () => {
    const t = tokens[i];
    switch (t.type) {
      case 'heading_open': {
        const level = +t.tag.slice(1);
        const inline = tokens[i + 1];
        i += 3;
        return ctx.heading(level, inlineToRuns(inline.children, ctx).runs);
      }
      case 'paragraph_open': {
        const inline = tokens[i + 1];
        i += 3;
        const { runs, images } = inlineToRuns(inline.children, ctx);
        const nodes = [];
        const txt = runs.map(runText).join('').trim();
        if (txt) {
          const p = { text: runs, style: 'p' };
          if (config.citePrefixes.length && CITE.test(txt)) p.style = 'cite';
          if (t.hidden) p.margin = [0, 0, 0, 2];   // 紧凑列表里的段落
          nodes.push(p);
        }
        for (const img of images) nodes.push({ ...img, margin: [0, 4, 0, 10] });
        return nodes;
      }
      case 'bullet_list_open':
      case 'ordered_list_open': {
        const ordered = t.type === 'ordered_list_open';
        const start = +(t.attrGet('start') || 1);
        i++;
        const items = [];
        while (tokens[i].type === 'list_item_open') {
          i++;
          const body = block('list_item_close');
          items.push(body.length === 1 ? body[0] : { stack: body });
        }
        i++; // list close
        const list = ordered ? { ol: items, start } : { ul: items };
        return { ...list, margin: [0, 0, 0, 6], markerColor: C.soft };
      }
      case 'blockquote_open': {
        i++;
        const body = block('blockquote_close');
        return {
          table: { widths: ['*'], body: [[{ stack: body, color: C.soft, margin: [8, 4, 4, 0] }]] },
          layout: {
            hLineWidth: () => 0, vLineWidth: k => (k === 0 ? 3 : 0), vLineColor: () => C.accent,
            fillColor: () => C.fill, paddingLeft: () => 4, paddingRight: () => 6,
          },
          margin: [0, 2, 0, 10],
        };
      }
      case 'fence':
      case 'code_block': {
        i++;
        return {
          table: { widths: ['*'], body: [[{ text: t.content.replace(/\n$/, ''), style: 'code', preserveLeadingSpaces: true }]] },
          layout: { hLineWidth: () => 0, vLineWidth: () => 0, fillColor: () => C.fill, paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 6, paddingBottom: () => 6 },
          margin: [0, 2, 0, 10],
        };
      }
      case 'table_open': return table();
      case 'hr': i++; return { canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_W, y2: 0, lineWidth: 0.6, lineColor: C.line }], margin: [0, 8, 0, 12] };
      case 'html_block': i++; return null;
      default: i++; return null;
    }
  };

  const table = () => {
    i++;
    const rows = [];
    let headerRows = 0, inHead = false;
    while (tokens[i].type !== 'table_close') {
      const t = tokens[i];
      if (t.type === 'thead_open') inHead = true;
      if (t.type === 'thead_close') inHead = false;
      if (t.type === 'tr_open') { rows.push({ head: inHead, cells: [] }); if (inHead) headerRows++; }
      if (t.type === 'th_open' || t.type === 'td_open') {
        const inline = tokens[i + 1];
        const { runs, images } = inlineToRuns(inline.children, ctx);
        const align = (t.attrGet('style') || '').match(/text-align:(\w+)/)?.[1];
        rows.at(-1).cells.push({ runs, images, head: t.type === 'th_open', align });
        i += 2;
      }
      i++;
    }
    i++;

    // 列宽：按每列最长一行的显示宽度分配，图片列给够图片宽度
    const ncol = Math.max(...rows.map(r => r.cells.length));
    const need = Array(ncol).fill(2);
    // 每列至少放得下最长的英文单词，避免单词被拆到两行
    const minPt = Array(ncol).fill(28);
    rows.forEach(r => r.cells.forEach((c, k) => {
      const lines = c.runs.map(runText).join('').split('\n');
      const longest = Math.max(...lines.map(textWidthUnits), 0);
      let w = Math.min(longest, c.head ? 14 : 28);
      if (c.images.length) {
        w = Math.max(w, Math.max(...c.images.map(im => im.width)) / 9.5);
        minPt[k] = Math.max(minPt[k], Math.max(...c.images.map(im => im.width)) + 12);   // 图片不能超出单元格
      }
      need[k] = Math.max(need[k], w);
      for (const run of c.runs) for (const word of runText(run).match(/[A-Za-z'’.\-]+/g) || []) {
        minPt[k] = Math.max(minPt[k], word.length * (run.bold || c.head ? 5.9 : 5.4) + 12);
      }
    }));
    const total = need.reduce((a, b) => a + b, 0);
    const avail = CONTENT_W - ncol * 12;   // 减去内边距
    // 先按需要分配，再把低于最小宽度的列补足，差额从其他列按比例扣
    let widths = need.map(w => (avail * w) / total);
    for (let pass = 0; pass < 3; pass++) {
      const short = widths.map((w, k) => Math.max(0, minPt[k] - w));
      const deficit = short.reduce((a, b) => a + b, 0);
      if (deficit < 0.5) break;
      const flexible = widths.map((w, k) => (short[k] ? 0 : w - minPt[k]));
      const room = flexible.reduce((a, b) => a + Math.max(0, b), 0);
      widths = widths.map((w, k) => short[k] ? minPt[k] : w - deficit * Math.max(0, flexible[k]) / (room || 1));
    }
    const scale = avail / widths.reduce((a, b) => a + b, 0);

    const body = rows.map(r => {
      const cells = r.cells.map(c => {
        const stack = [];
        if (c.runs.length) stack.push({ text: c.runs, alignment: c.align });
        for (const im of c.images) stack.push({ ...im, margin: [0, 3, 0, 0] });
        const cell = stack.length === 1 ? stack[0] : { stack };
        if (c.head) { cell.style = 'th'; cell.fillColor = C.head; }
        return cell;
      });
      while (cells.length < ncol) cells.push({ text: '' });
      return cells;
    });
    return {
      table: { headerRows, keepWithHeaderRows: headerRows ? 1 : 0, dontBreakRows: true, widths: widths.map(w => w * scale), body },
      layout: 'grid',
      style: 'table',
      margin: [0, 2, 0, 12],
    };
  };

  while (i < tokens.length) {
    const node = one();
    if (node) Array.isArray(node) ? out.push(...node) : out.push(node);
  }
  return out;
}

// ---------- 组装全书 ----------

async function main() {
  await ensureFonts();

  const groups = readSummary();
  let pages = loadPages(groups).filter(p => !WEB_ONLY.has(p.file));   // 下载页等只在网页上出现
  const allPages = pages;
  if (ONLY) pages = pages.filter(p => p.file.startsWith(ONLY));
  if (!pages.length) throw new Error(`--only ${ONLY} 没有匹配的页面`);

  const xref = makeXref(allPages);
  const byUrl = Object.fromEntries(allPages.map(p => [p.url, p]));
  const included = new Set(pages.map(p => p.file));
  const md = makeMd();

  // 排两遍：第一遍排版后从节点上读出每节标题落在哪一页，第二遍据此画页眉
  const buildDoc = (headingPage) => {
  const sections = [];      // { id, part, title }
  const keepSpace = new Map();   // 标题 id → 标题下方至少要留的空间（pt）

  const content = [];

  // 封面
  content.push(
    { text: SITE_TITLE, style: 'coverTitle', margin: [0, 230, 0, 12] },
    { text: config.subtitle, style: 'coverSub' },
    { text: ONLY ? `样张：${pages.map(p => p.label).join('、')}` : config.audience, style: 'coverSub', margin: [0, 6, 0, 0] },
    { text: `生成日期：${new Date().toISOString().slice(0, 10)}`, style: 'coverDate', absolutePosition: { x: MARGIN[0], y: PAGE.height - 110 } },
    { text: '', pageBreak: 'after' },
  );

  // 目录：手工表格，页码用 pageReference 自动回填，每行下面一条点线
  const tocRows = [];
  let lastGroup = null;
  for (const p of pages) {
    if (p.group !== lastGroup && p.group.title) {
      tocRows.push([{ text: p.group.title, bold: true, margin: [0, 6, 0, 0], colSpan: 2 }, {}]);
      lastGroup = p.group;
    }
    const id = pageKey(p.file);
    tocRows.push([
      { text: p.label, linkToDestination: id, margin: [p.group.title ? 12 : 0, 0, 0, 0] },
      { pageReference: id, alignment: 'right', linkToDestination: id, color: C.soft },
    ]);
  }
  content.push(
    { text: '目录', style: 'tocTitle' },
    {
      table: { widths: ['*', 36], body: tocRows },
      layout: {
        hLineWidth: (k, node) => (k === 0 || k === node.table.body.length ? 0 : 0.5),
        hLineColor: () => '#c9ced6',
        hLineStyle: () => ({ dash: { length: 1, space: 2 } }),
        vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 3, paddingBottom: () => 3,
      },
      pageBreak: 'after',
    },
  );

  // 正文
  let prevGroup = null;
  pages.forEach((page, pi) => {
    const key = pageKey(page.file);
    const partTitle = page.group.title || SITE_TITLE;
    let hIndex = 0;
    const ctx = {
      heading(level, runs) {
        const h = page.headings[hIndex++];
        const id = level === 1 ? key : `${key}--${h?.id}`;
        const text = runs.length ? runs : [{ text: h?.text || '' }];
        if (level === 1) {
          sections.push({ id, part: partTitle, title: page.label });
          const startsPart = page.group !== prevGroup;
          prevGroup = page.group;
          return {
            text, id, style: startsPart && page.first ? 'partTitle' : 'h1',
            pageBreak: startsPart && pi > 0 ? 'before' : undefined,
            headlineLevel: 1,
          };
        }
        return { text, id, style: `h${Math.min(level, 4)}`, headlineLevel: level };
      },
      resolveLink(href) {
        if (/^https?:\/\//.test(href)) return { attrs: { link: href, color: C.link } };
        const [u, hash] = href.split('#');
        const target = byUrl[u];
        if (!target || !included.has(target.file)) return { attrs: {} };   // 样张里不包含的页，当普通文字
        const id = hash ? `${pageKey(target.file)}--${decode(hash)}` : pageKey(target.file);
        return {
          attrs: { linkToDestination: id, color: C.link },
          // 第一遍用三位数占位，第二遍填入第一遍排出的实际页码（pageReference 会留出过宽的空白）
          after: { text: `（第 ${headingPage[id] ?? '000'} 页）`, color: C.soft, fontSize: 8.5 },
        };
      },
      image(src, alt) {
        const file = path.resolve(CONTENT, path.dirname(page.file), src);
        const isQr = /\/qr-/.test(file);
        const inCellWidth = isQr ? 24 * MM : 36 * MM;
        if (file.endsWith('.svg')) {
          const svg = fs.readFileSync(file, 'utf8');
          const vb = svg.match(/viewBox="[\d.\s-]+ ([\d.]+) ([\d.]+)"/);
          const natural = vb ? +vb[1] : 180;
          const width = natural > 300 ? Math.min(CONTENT_W, natural * 0.75) : inCellWidth;
          return { svg, width, font: FONT };
        }
        return { image: file, width: inCellWidth };
      },
    };
    const src = xref(page.src, page);
    const nodes = tokensToContent(md.parse(src, {}), ctx);
    // 紧跟表格的标题：要放得下表头和第一行，第一行有图片时更高
    nodes.forEach((n, k) => {
      const next = nodes[k + 1];
      if (!n.headlineLevel || !(next?.table && next.style === 'table')) return;
      const firstRow = next.table.body[next.table.headerRows] || [];
      const hasImage = JSON.stringify(firstRow).includes('"svg"') || JSON.stringify(firstRow).includes('"image"');
      keepSpace.set(n.id, hasImage ? 150 : 80);
    });
    content.push(...nodes);
  });

  // ---------- 文档定义 ----------

  const firstBodyPage = 3;   // 1 封面，2 起目录（目录可能不止一页，页眉页脚从正文所在页判断）
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: MARGIN,
    info: { title: SITE_TITLE, author: SITE_TITLE, subject: config.audience },
    defaultStyle: { font: FONT, fontSize: 10.5, lineHeight: 1.22, color: C.text },
    styles: {
      coverTitle: { fontSize: 30, bold: true, alignment: 'center' },
      coverSub: { fontSize: 13, color: C.soft, alignment: 'center' },
      coverDate: { fontSize: 10, color: C.soft, alignment: 'center' },
      tocTitle: { fontSize: 20, bold: true, margin: [0, 0, 0, 14] },
      partTitle: { fontSize: 22, bold: true, margin: [0, 0, 0, 14] },
      h1: { fontSize: 16.5, bold: true, margin: [0, 18, 0, 8] },
      h2: { fontSize: 13.5, bold: true, margin: [0, 12, 0, 6] },
      h3: { fontSize: 12, bold: true, margin: [0, 10, 0, 4] },
      h4: { fontSize: 11, bold: true, margin: [0, 8, 0, 4] },
      p: { margin: [0, 0, 0, 7], alignment: 'justify' },
      cite: { fontSize: 8.5, color: C.soft, margin: [0, 2, 0, 8], lineHeight: 1.15 },
      table: { fontSize: 9.3, lineHeight: 1.18 },
      th: { bold: true },
      code: { fontSize: 9.5, lineHeight: 1.2 },
    },
    content,
    // 标题不落在页底
    pageBreakBefore(node) {
      if (!node.headlineLevel || !node.id || !node.startPosition) return false;
      // 标题下方剩余空间不够放标题和紧跟的内容时，整体挪到下一页：
      // 后面是正文时留约两行；后面是表格时按表头加第一行估算。
      const pos = node.startPosition;
      const left = pos.pageInnerHeight * (1 - pos.verticalRatio);
      return left < (keepSpace.get(node.id) ?? 46);
    },
    header(currentPage) {
      const bodyStart = Math.min(...Object.values(headingPage), Infinity);
      if (currentPage < Math.max(firstBodyPage, bodyStart)) return null;
      // 本页有新开始的节，取第一个；否则取之前最后开始的节
      let cur = sections.find(s => headingPage[s.id] === currentPage) || null;
      if (!cur) for (const s of sections) { const pg = headingPage[s.id]; if (pg && pg < currentPage) cur = s; }
      if (!cur) return null;
      return {
        columns: [
          { text: cur.part, alignment: 'left' },
          { text: cur.title, alignment: 'right' },
        ],
        fontSize: 8.5, color: C.soft, margin: [MARGIN[0], 7 * MM, MARGIN[2], 0],
      };
    },
    footer(currentPage) {
      if (currentPage === 1) return null;
      return { text: String(currentPage), alignment: 'center', fontSize: 9, color: C.soft, margin: [0, 4 * MM, 0, 0] };
    },
  };
  return { docDefinition, content };
  };

  pdfmake.setFonts({
    [FONT]: {
      normal: path.join(ROOT, 'tools/fonts/NotoSansSC-Regular.ttf'),
      bold: path.join(ROOT, 'tools/fonts/NotoSansSC-Bold.ttf'),
      italics: path.join(ROOT, 'tools/fonts/NotoSansSC-Regular.ttf'),
      bolditalics: path.join(ROOT, 'tools/fonts/NotoSansSC-Bold.ttf'),
    },
  });
  pdfmake.setUrlAccessPolicy(() => false);                              // 不下载任何网络资源
  pdfmake.setLocalAccessPolicy(p => path.resolve(p).startsWith(ROOT));  // 只读项目内文件
  pdfmake.addTableLayouts({
    grid: {
      hLineWidth: () => 0.6, vLineWidth: () => 0.6,
      hLineColor: () => C.line, vLineColor: () => C.line,
      paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 4, paddingBottom: () => 4,
    },
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const t0 = Date.now();
  // 第一遍：只为拿到各节标题的页码
  const first = buildDoc({});
  await pdfmake.createPdf(first.docDefinition).getBuffer();
  const headingPage = {};
  for (const n of first.content) if (n.id && n.positions?.length) headingPage[n.id] = n.positions[0].pageNumber;
  // 第二遍：带页眉正式输出
  const second = buildDoc(headingPage);
  await pdfmake.createPdf(second.docDefinition).write(OUT);
  // 核对：第二遍的实际页码要和填进去的页码一致（填入的数字比占位短，极少数情况下会让排版挪动）
  const moved = second.content.filter(n => n.id && n.positions?.length && n.positions[0].pageNumber !== headingPage[n.id]);
  if (moved.length) console.warn(`警告：${moved.length} 个标题的页码在第二遍发生变化，交叉引用页码可能差一页：`, moved.slice(0, 5).map(n => n.id));
  console.log(`pdf: ${pages.length} 节内容 → ${path.relative(ROOT, OUT)}（${((Date.now() - t0) / 1000).toFixed(1)} s）`);
}

main().catch(e => { console.error(e); process.exit(1); });
