// 第二部分“有理数的运算”的图。
import { C, f, svg, text, line, dot, circle } from './lib.mjs';

const files = {};
const fmt = v => (v < 0 ? '−' + -v : String(v));

// 数轴：原点像素 ox，基线 y，单位 u 像素，画 [min, max]，整数处画刻度
function numberLine({ ox, y, u, min, max, skip = [] }) {
  const X = v => ox + u * v;
  const out = [line(X(min), y, X(max), y, { color: C.ink, w: 1.8 })];
  out.push(`<polygon points="${f(X(max) + 10)},${y} ${f(X(max))},${y - 5} ${f(X(max))},${y + 5}" fill="${C.ink}" stroke="none"/>`);
  for (let v = Math.ceil(min); v <= max; v++) {
    out.push(line(X(v), y - 5, X(v), y, { color: C.ink, w: 1.5 }));
    if (!skip.includes(v)) out.push(text(X(v), y + 20, fmt(v), { anchor: 'middle', color: C.soft, size: 13 }));
  }
  return { X, body: out.join('\n') };
}

// 水平箭头：从 x1 指向 x2
function arrow(x1, x2, y, color, w = 2.5) {
  const s = x2 > x1 ? 1 : -1;
  return line(x1, y, x2 - s * 8, y, { color, w }) +
    `<polygon points="${f(x2)},${y} ${f(x2 - s * 10)},${y - 5} ${f(x2 - s * 10)},${y + 5}" fill="${color}" stroke="none"/>`;
}

// ---------- 加法是在数轴上移动 ----------
{
  const out = [];
  const rows = [
    { y: 70, a: 2, b: 3, word: '向右 3' },
    { y: 170, a: 2, b: -5, word: '向左 5' },
  ];
  for (const { y, a, b, word } of rows) {
    const { X, body } = numberLine({ ox: 240, y, u: 36, min: -5.6, max: 6 });
    const end = a + b, col = b > 0 ? C.blue : C.emph;
    out.push(body);
    out.push(arrow(X(a), X(end), y - 24, col));
    out.push(text((X(a) + X(end)) / 2, y - 34, word, { anchor: 'middle', color: col, size: 13 }));
    out.push(line(X(a), y - 30, X(a), y, { color: C.soft, w: 1, dash: '3 3' }));
    out.push(dot(X(a), y, C.ink, 5), dot(X(end), y, col, 5));
    // 移动的点
    out.push(`<circle cx="${f(X(a))}" cy="${y}" r="5" fill="${col}" stroke="none"><animate attributeName="cx" values="${f(X(a))};${f(X(a))};${f(X(end))};${f(X(end))}" keyTimes="0;0.2;0.65;1" dur="6s" repeatCount="indefinite"/></circle>`);
  }
  files['rational-operations-add.svg'] = svg(480, 205, out.join('\n'));
}

// ---------- 减法：从 b 走到 a ----------
{
  const y = 80;
  const { X, body } = numberLine({ ox: 220, y, u: 40, min: -4.6, max: 5.4 });
  const out = [body];
  out.push(line(X(-2), y - 30, X(-2), y, { color: C.soft, w: 1, dash: '3 3' }), line(X(3), y - 30, X(3), y, { color: C.soft, w: 1, dash: '3 3' }));
  out.push(arrow(X(-2), X(3), y - 24, C.emph));
  out.push(text((X(-2) + X(3)) / 2, y - 34, '5', { anchor: 'middle', color: C.emph, size: 14 }));
  out.push(dot(X(-2), y, C.blue, 5), dot(X(3), y, C.emph, 5));
  files['rational-operations-sub.svg'] = svg(480, 115, out.join('\n'));
}

// ---------- 乘以 −1：翻到原点的另一侧 ----------
{
  const y = 110, ry = 55;
  const { X, body } = numberLine({ ox: 240, y, u: 46, min: -4.6, max: 4.6, skip: [-3, 3] });
  const out = [body];
  out.push(text(X(3) + 10, y + 20, '3', { color: C.emph, size: 13 }), text(X(-3) - 10, y + 20, '−3', { anchor: 'end', color: C.blue, size: 13 }));
  const rx = X(3) - X(0), cx = X(0);
  out.push(`<path d="M ${f(X(3))} ${y} A ${f(rx)} ${ry} 0 0 0 ${f(X(-3))} ${y}" stroke="${C.blue}" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>`);
  out.push(`<path d="M ${f(X(-3))} ${y} A ${f(rx)} ${ry} 0 0 0 ${f(X(3))} ${y}" stroke="${C.emph}" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>`);
  // 箭头：上弧到 −3，下弧到 3
  out.push(`<polygon points="${f(X(-3))},${y - 6} ${f(X(-3) - 5)},${y - 16} ${f(X(-3) + 5)},${y - 16}" fill="${C.blue}" stroke="none"/>`);
  out.push(`<polygon points="${f(X(3))},${y + 6} ${f(X(3) - 5)},${y + 16} ${f(X(3) + 5)},${y + 16}" fill="${C.emph}" stroke="none"/>`);
  out.push(text(cx, y - ry - 8, '× (−1)', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text(cx, y + ry + 18, '× (−1)', { anchor: 'middle', color: C.emph, size: 13 }));
  out.push(dot(X(3), y, C.emph, 5), dot(X(-3), y, C.blue, 5));
  // 沿两段弧移动的点：先上弧到 −3，停一下，再下弧回到 3
  const pts = [], kts = [];
  const push = (t, k) => { pts.push(`${f(cx + rx * Math.cos(t) - X(3))} ${f(y - ry * Math.sin(t) - y)}`); kts.push(f3(k)); };
  const f3 = v => +v.toFixed(3);
  push(0, 0); push(0, 0.1);
  for (let i = 1; i <= 20; i++) push((Math.PI * i) / 20, 0.1 + 0.3 * i / 20);
  push(Math.PI, 0.5);
  for (let i = 1; i <= 20; i++) push(Math.PI + (Math.PI * i) / 20, 0.5 + 0.3 * i / 20);
  push(2 * Math.PI, 1);
  out.push(`<g><circle cx="${f(X(3))}" cy="${y}" r="5" fill="${C.ink}" stroke="none"/><animateTransform attributeName="transform" type="translate" values="${pts.join(';')}" keyTimes="${kts.join(';')}" dur="8s" repeatCount="indefinite"/></g>`);
  files['rational-operations-neg.svg'] = svg(480, 200, out.join('\n'));
}

// ---------- 近似数 2.4 代表的范围 ----------
{
  const y = 90, x0 = 40, u = 2000;
  const X = v => x0 + u * (v - 2.3);
  const out = [line(X(2.3), y, X(2.5), y, { color: C.ink, w: 1.8 })];
  out.push(`<polygon points="${f(X(2.5) + 12)},${y} ${f(X(2.5) + 2)},${y - 5} ${f(X(2.5) + 2)},${y + 5}" fill="${C.ink}" stroke="none"/>`);
  for (let i = 0; i <= 20; i++) {
    const v = 2.3 + i / 100, major = i % 5 === 0;
    out.push(line(X(v), y - (major ? 7 : 4), X(v), y, { color: C.ink, w: major ? 1.5 : 1 }));
    if (major) out.push(text(X(v), y + 20, v.toFixed(2), { anchor: 'middle', color: C.soft, size: 13 }));
  }
  out.push(line(X(2.35), y, X(2.45), y, { color: C.emph, w: 5 }));
  out.push(dot(X(2.35), y, C.emph, 5.5));
  out.push(circle(X(2.45), y, 5, { color: C.emph, w: 2, fill: '#ffffff' }));
  out.push(dot(X(2.4), y, C.blue, 4));
  out.push(text(X(2.4), y - 36, '四舍五入后都是 2.4', { anchor: 'middle', color: C.emph, size: 13 }));
  out.push(line(X(2.35), y - 26, X(2.45), y - 26, { color: C.emph, w: 1 }), line(X(2.35), y - 30, X(2.35), y - 22, { color: C.emph, w: 1 }), line(X(2.45), y - 30, X(2.45), y - 22, { color: C.emph, w: 1 }));
  files['rational-operations-round.svg'] = svg(480, 125, out.join('\n'));
}

export default files;
