// 数学公式：Markdown 里用 $...$ 写行内公式，用 $$...$$ 写独立成行的公式，内容是 LaTeX。
//   网页：MathJax 转成 SVG，嵌进 HTML。
//   PDF：独立公式同样转成 SVG；行内公式因为 pdfmake 不能把 SVG 放进一行文字里，
//        转成带斜体、上下标的文字片段（texToRuns），字母用 STIX Two Text 斜体。
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

// ---------- MathJax ----------

let doc = null, adaptor = null;
const cache = new Map();

// 返回 <svg …>…</svg> 字符串；宽高单位是 ex
export function texToSvg(tex, display = false) {
  const key = (display ? 'D' : 'I') + tex;
  if (cache.has(key)) return cache.get(key);
  if (!doc) {
    adaptor = liteAdaptor();
    RegisterHTMLHandler(adaptor);
    doc = mathjax.document('', {
      InputJax: new TeX({
        packages: AllPackages.filter(p => p !== 'bussproofs'),
        // 按国内教材的写法：全等用 ≌，相似用 ∽
        macros: { cong: '\\mathrel{\\unicode{x224C}}', sim: '\\mathrel{\\backsim}' },
      }),
      OutputJax: new SVG({ fontCache: 'none' }),
    });
  }
  const node = doc.convert(tex, { display });
  const svg = adaptor.innerHTML(node);
  if (/data-mjx-error|merror/.test(svg)) throw new Error(`公式有误：${tex}`);
  cache.set(key, svg);
  return svg;
}

// ---------- markdown-it 插件 ----------

export function mathPlugin(md) {
  // 行内：$...$。开头的 $ 后面、结尾的 $ 前面不能是空白；\$ 表示普通的美元符号
  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    const src = state.src, start = state.pos;
    if (src[start] !== '$' || src[start + 1] === '$') return false;
    if (/\s/.test(src[start + 1] || ' ')) return false;
    let end = start + 1;
    while ((end = src.indexOf('$', end)) !== -1) {
      if (src[end - 1] !== '\\' && !/\s/.test(src[end - 1])) break;
      end++;
    }
    if (end === -1) return false;
    const content = src.slice(start + 1, end);
    if (content.includes('\n\n')) return false;
    if (!silent) {
      const tok = state.push('math_inline', 'math', 0);
      tok.content = content;
      tok.markup = '$';
    }
    state.pos = end + 1;
    return true;
  });

  // 独立公式：一行 $$ ... $$，或以 $$ 开始、以 $$ 结束的多行
  md.block.ruler.before('fence', 'math_block', (state, startLine, endLine, silent) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    const first = state.src.slice(pos, max).trim();
    if (!first.startsWith('$$')) return false;
    if (silent) return true;
    let content, line = startLine;
    if (first.length > 4 && first.endsWith('$$')) {
      content = first.slice(2, -2);
    } else {
      const parts = [first.slice(2)];
      for (line = startLine + 1; line < endLine; line++) {
        const s = state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);
        if (s.trim().endsWith('$$')) { parts.push(s.trim().slice(0, -2)); break; }
        parts.push(s);
      }
      if (line >= endLine) return false;
      content = parts.join('\n');
    }
    const tok = state.push('math_block', 'math', 0);
    tok.block = true;
    tok.content = content.trim();
    tok.map = [startLine, line + 1];
    tok.markup = '$$';
    state.line = line + 1;
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
}

// 网页渲染规则
export function mathHtmlRules(md) {
  const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  // data-tex 保存原式，供全文搜索使用
  md.renderer.rules.math_inline = (tokens, i) => `<span class="math" data-tex="${attr(tokens[i].content)}">${texToSvg(tokens[i].content, false)}</span>`;
  md.renderer.rules.math_block = (tokens, i) => `<div class="math-display" data-tex="${attr(tokens[i].content)}">${texToSvg(tokens[i].content, true)}</div>\n`;
}

// ---------- PDF：行内公式转成文字片段 ----------

const SYMBOLS = {
  times: '×', div: '÷', pm: '±', mp: '∓', cdot: '·', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠',
  approx: '≈', pi: 'π', angle: '∠', triangle: '△', cong: '≌', sim: '∽', backsim: '∽', perp: '⊥', parallel: '∥', circ: '°',
  infty: '∞', because: '∵', therefore: '∴', in: '∈', cdots: '⋯', ldots: '…', dots: '…', lvert: '|', rvert: '|',
  vert: '|', mid: '|', rightarrow: '→', to: '→', Rightarrow: '⇒', leftarrow: '←', Leftrightarrow: '⇔',
  alpha: 'α', beta: 'β', gamma: 'γ', theta: 'θ', lambda: 'λ', mu: 'μ', sigma: 'σ', Delta: 'Δ', varphi: 'φ', phi: 'φ',
  '%': '%', '{': '{', '}': '}', '$': '$', '#': '#', '&': '&', ',': ' ', ';': ' ', ':': ' ', quad: '  ', qquad: '    ', ' ': ' ',
  prime: '′', odot: '⊙', square: '□', lt: '<', gt: '>', cap: '∩', cup: '∪', emptyset: '∅',
};
const BINARY = new Set(['+', '−', '=', '×', '÷', '±', '≤', '≥', '≠', '≈', '<', '>', '≌', '∽', '→', '⇒', '⇔', '·']);
const SKIP = new Set(['left', 'right', 'big', 'Big', 'bigl', 'bigr', 'displaystyle', 'limits', 'nolimits', '!']);

// 把 LaTeX 拆成记号，再转成 { text, italics, sup, sub, math } 的片段
export function texToRuns(tex) {
  let i = 0;
  const out = [];
  const readGroup = () => {
    while (tex[i] === ' ') i++;
    if (tex[i] === '{') {
      let depth = 1, j = i + 1;
      for (; j < tex.length && depth; j++) { if (tex[j] === '\\') { j++; continue; } if (tex[j] === '{') depth++; if (tex[j] === '}') depth--; }
      const g = tex.slice(i + 1, j - 1); i = j; return g;
    }
    if (tex[i] === '\\') { const m = tex.slice(i).match(/^\\([A-Za-z]+|.)/); i += m[0].length; return m[0]; }
    return tex[i++] ?? '';
  };
  const readOptional = () => {
    if (tex[i] !== '[') return null;
    const j = tex.indexOf(']', i); const g = tex.slice(i + 1, j); i = j + 1; return g;
  };
  // 不需要加括号的部分：一个数、一个字母或它们的乘积（12、x、2x），没有运算符号和空格
  const atomic = s => { const t = texToRuns(s).map(x => x.text).join('').trim(); return !!t && !/[\s+−=×÷·<>≤≥\/]/.test(t); };
  const wrap = s => (atomic(s) ? texToRuns(s) : [{ text: '(' }, ...texToRuns(s), { text: ')' }]);
  // 分母更严格：只有一个数或一个字母才不加括号，2a 要写成 /(2a)，免得读成 (…/2)·a
  const single = s => /^([0-9.]+|[A-Za-zα-ωπ])$/.test(texToRuns(s).map(x => x.text).join('').trim());
  const wrapDen = s => (single(s) ? texToRuns(s) : [{ text: '(' }, ...texToRuns(s), { text: ')' }]);
  const pushChar = (ch, italic) => {
    if (BINARY.has(ch)) { out.push({ text: ` ${ch} `, op: true }); return; }
    out.push({ text: ch, italics: italic });
  };
  while (i < tex.length) {
    const ch = tex[i];
    if (ch === '\\') {
      const m = tex.slice(i).match(/^\\([A-Za-z]+|.)/);
      const name = m[1]; i += m[0].length;
      if (SKIP.has(name)) continue;
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        const a = readGroup(), b = readGroup();
        const frac = [...wrap(a), { text: '/' }, ...wrapDen(b)];
        // 分式后面紧跟字母、括号或根号（如 \frac{1}{2}x），整个分式加括号：(1/2)x
        if (/^\s*([A-Za-z(]|\\(sqrt|pi|left|alpha|beta|theta)\b)/.test(tex.slice(i))) out.push({ text: '(' }, ...frac, { text: ')' });
        else out.push(...frac);
      } else if (name === 'sqrt') {
        const n = readOptional(), a = readGroup();
        const root = [...(n ? [{ text: n, sup: true }] : []), { text: '√' }, ...(atomic(a) || /^[\w\\]+$/.test(a.trim()) ? texToRuns(a) : wrap(a))];
        // 根号后面紧跟字母、括号或另一个根号（如 \sqrt{3}R），文字里没有根号上的横线，
        // “√3R”会被读成 √(3R)，所以把整个根式加括号：(√3)R
        if (/^\s*([A-Za-z(]|\\(sqrt|pi|left|alpha|beta|theta)\b)/.test(tex.slice(i))) out.push({ text: '(' }, ...root, { text: ')' });
        else out.push(...root);
      } else if (name === 'text' || name === 'mathrm' || name === 'textrm' || name === 'operatorname') {
        out.push({ text: readGroup(), text_: true });
      } else if (name === 'overline' || name === 'widehat' || name === 'overset' || name === 'boldsymbol' || name === 'mathbf') {
        if (name === 'overset') readGroup();
        out.push(...texToRuns(readGroup()));
      } else if (name === 'sin' || name === 'cos' || name === 'tan' || name === 'log' || name === 'max' || name === 'min') {
        out.push({ text: name });
      } else if (SYMBOLS[name] !== undefined) {
        const s = SYMBOLS[name];
        if (/^[α-ωΔφ]$/.test(s)) out.push({ text: s, italics: true }); else pushChar(s, false);
      } else {
        out.push({ text: name });
      }
    } else if (ch === '^' || ch === '_') {
      i++;
      const g = readGroup();
      if (g === '\\circ') { out.push({ text: '°' }); continue; }
      for (const r of texToRuns(g)) out.push({ ...r, text: r.text.trim() || r.text, [ch === '^' ? 'sup' : 'sub']: true });
    } else if (ch === '{' || ch === '}') {
      i++;
    } else if (ch === '-') {
      i++; pushChar('−', false);
    } else if (ch === ' ') {
      i++;
    } else if (ch === '~') {
      i++; out.push({ text: ' ' });
    } else if (ch === "'") {
      i++; out.push({ text: '′' });
    } else if (ch === ',' ) {
      i++; out.push({ text: ', ' });
    } else {
      i++; pushChar(ch, /[A-Za-z]/.test(ch));
    }
  }
  // 开头的负号、括号后的负号不是二元运算，去掉两侧空格
  for (let k = 0; k < out.length; k++) {
    if (out[k].op && out[k].text.trim() === '−') {
      const prev = out[k - 1];
      if (!prev || prev.op || /[(\[,=]\s*$/.test(prev.text) || prev.text === '(') out[k].text = '−';
    }
  }
  // 合并相邻的同类片段
  const merged = [];
  for (const r of out) {
    const last = merged.at(-1);
    const same = last && !!last.italics === !!r.italics && !!last.sup === !!r.sup && !!last.sub === !!r.sub && !!last.text_ === !!r.text_;
    if (same) last.text += r.text; else merged.push({ ...r });
  }
  return merged.map(({ op, text_, ...r }) => ({ ...r, ...(text_ ? { plain: true } : {}) }));
}
