// 第四部分“不等式与不等式组”的图。
import { C, f, svg, text, line, dot } from './lib.mjs';

const files = {};
const fmt = v => (v < 0 ? '−' + -v : String(v));

// 数轴：原点像素 ox，行高 y，单位 u，范围 [a, b]；labels 为 false 时不写刻度数字，为对象时按 { 值: 文字 } 写
function numberLine(ox, y, u, a, b, labels = true) {
  const X = v => ox + u * v, out = [];
  out.push(line(X(a) - 12, y, X(b) + 12, y, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(b) + 20)},${y} ${f(X(b) + 12)},${y - 4} ${f(X(b) + 12)},${y + 4}" fill="${C.axis}" stroke="none"/>`);
  if (labels === true) for (let v = a; v <= b; v++) {
    out.push(line(X(v), y - 4, X(v), y, { color: C.axis, w: 1.2 }));
    out.push(text(X(v), y + 18, fmt(v), { anchor: 'middle', color: C.soft, size: 11 }));
  } else if (labels) for (const [v, s] of Object.entries(labels)) {
    out.push(line(X(+v), y - 4, X(+v), y, { color: C.axis, w: 1.2 }));
    out.push(text(X(+v), y + 18, s, { anchor: 'middle', color: C.soft, size: 13, italic: true }));
  }
  return { X, body: out.join('') };
}
// 端点：实心（含）或空心（不含）
const end = (x, y, solid, col) => `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${solid ? col : 'white'}" fill-opacity="${solid ? 1 : 0}" stroke="${col}" stroke-width="2"/>`;
// 解集：从端点 x0 向 dir（1 向右，−1 向左）画到 x1，高度 h（在数轴上方 h 像素）
function ray(X, y, v, toV, h, solid, col) {
  const x0 = X(v), x1 = X(toV), top = y - h;
  return line(x0, y - 5, x0, top, { color: col, w: 1.5 }) + line(x0, top, x1, top, { color: col, w: 2.5 }) + end(x0, y, solid, col);
}

// ---------- 两边乘 −1：数轴上的位置关于原点对称，先后顺序反过来 ----------
{
  const out = [];
  const { X, body } = numberLine(210, 90, 42, -4, 4);
  out.push(body);
  // 弧线：1 → −1，3 → −3
  const arcTo = (v, h) => `<path d="M ${f(X(v))} 82 Q ${f(X(0))} ${82 - h} ${f(X(-v))} 82" stroke="${C.soft}" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/>`;
  out.push(arcTo(1, 50), arcTo(3, 130));
  out.push(text(X(0), 46, '× (−1)', { anchor: 'middle', color: C.soft, size: 12 }));
  for (const v of [1, 3]) out.push(dot(X(v), 90, C.blue, 5.5), dot(X(-v), 90, C.emph, 5.5));
  // 动画：蓝点沿数轴移到对称位置
  for (const v of [1, 3]) out.push(`<circle cx="${f(X(v))}" cy="90" r="5.5" fill="${C.blue}" stroke="none" opacity="0.6"><animate attributeName="cx" values="${f(X(v))};${f(X(v))};${f(X(-v))};${f(X(-v))};${f(X(v))}" keyTimes="0;0.15;0.5;0.8;1" dur="7s" repeatCount="indefinite"/></circle>`);
  out.push(text(X(2), 132, '1 &lt; 3', { anchor: 'middle', color: C.blue, size: 13 }), text(X(-2), 132, '−1 > −3', { anchor: 'middle', color: C.emph, size: 13 }));
  files['inequality-flip.svg'] = svg(420, 145, out.join('\n'));
}

// ---------- 解集在数轴上的表示 ----------
{
  const out = [];
  const rows = [
    { y: 50, v: -1, to: 4.3, solid: true, label: 'x ≥ −1' },
    { y: 120, v: 2, to: -4.3, solid: false, label: 'x &lt; 2' },
  ];
  for (const r of rows) {
    const { X, body } = numberLine(240, r.y, 34, -4, 4);
    out.push(body, ray(X, r.y, r.v, r.to, 16, r.solid, C.emph));
    out.push(text(20, r.y + 4, r.label, { color: C.emph, size: 14 }));
  }
  files['inequality-solution.svg'] = svg(420, 150, out.join('\n'));
}

// ---------- 不等式组的四种情况（a < b） ----------
{
  const out = [];
  const a = -1, b = 1.5, lo = -3.5, hi = 4;
  const rows = [
    { s1: ['>', a], s2: ['>', b], res: 'x > b', seg: [b, hi], open: [false, false] },
    { s1: ['<', a], s2: ['<', b], res: 'x &lt; a', seg: [lo, a] },
    { s1: ['>', a], s2: ['<', b], res: 'a &lt; x &lt; b', seg: [a, b] },
    { s1: ['<', a], s2: ['>', b], res: '无解', seg: null },
  ];
  rows.forEach((r, i) => {
    const y = 58 + i * 64;
    const { X, body } = numberLine(260, y, 36, lo, hi, { [a]: 'a', [b]: 'b' });
    out.push(body);
    if (r.seg) out.push(`<rect x="${f(X(r.seg[0]))}" y="${y - 24}" width="${f(X(r.seg[1]) - X(r.seg[0]))}" height="24" fill="${C.emphFill}" stroke="none"/>`);
    const toEnd = op => (op === '>' ? hi + 0.3 : lo - 0.3);
    out.push(ray(X, y, r.s1[1], toEnd(r.s1[0]), 12, false, C.blue));
    out.push(ray(X, y, r.s2[1], toEnd(r.s2[0]), 22, false, C.emph));
    const op = o => (o === '<' ? '&lt;' : '&gt;');
    const nm = v => (v === a ? 'a' : 'b');
    out.push(text(12, y - 4, `x ${op(r.s1[0])} ${nm(r.s1[1])}，x ${op(r.s2[0])} ${nm(r.s2[1])}`, { size: 13 }));
    out.push(text(500, y - 4, r.res, { anchor: 'end', color: C.emph, size: 13 }));
  });
  files['inequality-system-cases.svg'] = svg(505, 300, out.join('\n'));
}

// ---------- 例：−3 ≤ x < 3 ----------
{
  const out = [];
  const y = 70;
  const { X, body } = numberLine(210, y, 34, -5, 5);
  out.push(body);
  out.push(`<rect x="${f(X(-3))}" y="${y - 26}" width="${f(X(3) - X(-3))}" height="26" fill="${C.emphFill}" stroke="none"/>`);
  out.push(ray(X, y, 3, -5.4, 12, false, C.blue));
  out.push(ray(X, y, -3, 5.4, 24, true, C.emph));
  out.push(text(X(5.4), y - 30, 'x ≥ −3', { anchor: 'end', color: C.emph, size: 13 }));
  out.push(text(X(-5.4), y - 18, 'x &lt; 3', { color: C.blue, size: 13 }));
  files['inequality-system-example.svg'] = svg(420, 100, out.join('\n'));
}

export default files;
