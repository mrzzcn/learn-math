// 第十一部分“以数解形”的图。
import { C, f, svg, text, line, dot, poly, circle, axes, plot, rightAngle, tick } from './lib.mjs';

const files = {};
// 带下标的点名，如 D₁(−4, 2)：字母、下标、坐标分成三段文字，从 (x, y) 起向右排
const subLabel = (x, y, name, i, rest, o = {}) => {
  const size = o.size || 12, col = o.color || C.ink, w = size * 0.95 + size * 0.6 + size * 0.3 * rest.length;
  const x0 = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
  return text(x0, y, name, { italic: true, color: col, size }) + text(x0 + size * 0.75, y + 4, String(i), { color: col, size: size - 3 })
    + text(x0 + size * 0.75 + size * 0.6, y, rest, { color: col, size });
};

// ---------- 用距离公式判断三角形的形状 ----------
{
  const { X, Y, body } = axes({ ox: 50, oy: 230, u: 40, xmin: -0.5, xmax: 5.5, ymin: -0.5, ymax: 5 });
  const P = ([x, y]) => [X(x), Y(y)];
  const A = [1, 1], B = [4, 2], Cc = [0, 4];
  const out = [body];
  out.push(poly([P(A), P(B), P(Cc)], { fill: C.blueFill }));
  // AB 的水平、竖直分量
  out.push(line(X(1), Y(1), X(4), Y(1), { color: C.emph, w: 1.5, dash: '5 3' }), line(X(4), Y(1), X(4), Y(2), { color: C.emph, w: 1.5, dash: '5 3' }));
  out.push(text(X(2.5), Y(1) + 16, '3', { anchor: 'middle', color: C.emph, size: 13 }), text(X(4) + 8, Y(1.5) + 5, '1', { color: C.emph, size: 13 }));
  out.push(rightAngle(P(A), P(B), P(Cc), { size: 11 }));
  out.push(dot(...P(A)), dot(...P(B)), dot(...P(Cc)));
  out.push(text(X(1) - 8, Y(1) + 18, 'A(1, 1)', { anchor: 'middle', size: 12 }), text(X(4) + 8, Y(2) - 6, 'B(4, 2)', { size: 12 }), text(X(0) + 10, Y(4) - 6, 'C(0, 4)', { size: 12 }));
  files['number-to-shape-distance.svg'] = svg(320, 280, out.join('\n'));
}

// ---------- 平行四边形的第四个顶点 ----------
{
  const ax = axes({ ox: 200, oy: 130, u: 34, xmin: -5, xmax: 5, ymin: -3, ymax: 3, ticks: false });
  const { X, Y } = ax;
  const P = ([x, y]) => [X(x), Y(y)];
  const A = [-1, 0], B = [3, 0], Cc = [0, 2];
  const D1 = [-4, 2], D2 = [2, -2], D3 = [4, 2];
  // 原点的 O 挪到右下方，避开虚线 D1D2；刻度数字避开 A、B、C 三个点
  const out = [ax.body.replace(/<text x="194" y="146"([^>]*)text-anchor="end"([^>]*)>O<\/text>/, '<text x="206" y="146"$1$2>O</text>')];
  const fmt = v => (v < 0 ? '−' + -v : String(v));
  for (const x of [-5, -4, -3, -2, 1, 2, 4]) out.push(text(X(x), Y(0) + 16, fmt(x), { anchor: 'middle', color: C.soft, size: 11 }));
  for (const y of [3, 1, -1, -2, -3]) out.push(text(X(0) - 6, Y(y) + 4, fmt(y), { anchor: 'end', color: C.soft, size: 11 }));
  out.push(poly([P(A), P(B), P(Cc)], { fill: C.emphFill }));
  const d = { color: C.blue, w: 1.5, dash: '6 4' };
  out.push(line(...P(D1), ...P(A), d), line(...P(D1), ...P(Cc), d));
  out.push(line(...P(D2), ...P(A), d), line(...P(D2), ...P(B), d));
  out.push(line(...P(D3), ...P(B), d), line(...P(D3), ...P(Cc), d));
  for (const p of [A, B, Cc]) out.push(dot(...P(p)));
  for (const p of [D1, D2, D3]) out.push(dot(...P(p), C.blue));
  out.push(text(X(-1) - 6, Y(0) - 8, 'A', { anchor: 'end', italic: true }), text(X(3) + 8, Y(0) + 17, 'B', { italic: true }), text(X(0) + 8, Y(2) - 8, 'C', { italic: true }));
  out.push(subLabel(X(-4), Y(2) - 10, 'D', 1, '(−4, 2)', { anchor: 'middle', color: C.blue, size: 12 }));
  out.push(subLabel(X(2) + 8, Y(-2) + 14, 'D', 2, '(2, −2)', { color: C.blue, size: 12 }));
  out.push(subLabel(X(4), Y(2) - 10, 'D', 3, '(4, 2)', { anchor: 'middle', color: C.blue, size: 12 }));
  files['number-to-shape-parallelogram.svg'] = svg(400, 260, out.join('\n'));
}

// ---------- 抛物线上的点与三角形面积：铅垂高 ----------
{
  const { X, Y, body } = axes({ ox: 90, oy: 230, u: 48, xmin: -1.6, xmax: 4, ymin: -0.8, ymax: 4.5, ticks: false });
  const g = x => -x * x + 2 * x + 3, l = x => 3 - x;
  const out = [body];
  // 刻度数字只标不和抛物线、A、B、C 重叠的几个
  for (const x of [1, 2]) out.push(text(X(x), Y(0) + 16, String(x), { anchor: 'middle', color: C.soft, size: 11 }));
  for (const y of [1, 2, 4]) out.push(text(X(0) - 6, Y(y) + 4, String(y), { anchor: 'end', color: C.soft, size: 11 }));
  out.push(plot(g, -1.4, 3.3, X, Y, { color: C.ink, w: 2, ymin: -0.8 }));
  out.push(line(X(0), Y(3), X(3), Y(0), { color: C.blue, w: 2 }));
  // 水平宽 OB
  out.push(line(X(0), Y(0) + 26, X(3), Y(0) + 26, { color: C.soft, w: 1 }), line(X(0), Y(0) + 20, X(0), Y(0) + 32, { color: C.soft, w: 1 }), line(X(3), Y(0) + 20, X(3), Y(0) + 32, { color: C.soft, w: 1 }));
  out.push(text(X(1.5), Y(0) + 42, '3', { anchor: 'middle', color: C.soft, size: 12 }));
  // t 的取值：1.5 → 2.7 → 0.3 → 1.5
  const ts = [];
  const push = (a, b, n) => { for (let i = 0; i < n; i++) ts.push(a + ((b - a) * i) / n); };
  push(1.5, 1.5, 3); push(1.5, 2.7, 12); push(2.7, 2.7, 3); push(2.7, 0.3, 24); push(0.3, 0.3, 3); push(0.3, 1.5, 12); ts.push(1.5);
  const dur = 14, kt = ts.map((_, i) => f((i / (ts.length - 1)) * 1000) / 1000).join(';');
  const an = (attr, vals) => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const t0 = 1.5;
  const tri = t => [[X(t), Y(g(t))], [X(3), Y(0)], [X(0), Y(3)]].map(p => p.map(f).join(',')).join(' ');
  out.push(`<polygon points="${tri(t0)}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="1.5">${an('points', ts.map(tri).join(';'))}</polygon>`);
  const xs = ts.map(t => f(X(t))).join(';');
  out.push(`<line x1="${f(X(t0))}" y1="${f(Y(g(t0)))}" x2="${f(X(t0))}" y2="${f(Y(l(t0)))}" stroke="${C.emph}" stroke-width="3">${an('x1', xs)}${an('x2', xs)}${an('y1', ts.map(t => f(Y(g(t)))).join(';'))}${an('y2', ts.map(t => f(Y(l(t)))).join(';'))}</line>`);
  out.push(`<line x1="${f(X(t0))}" y1="${f(Y(l(t0)))}" x2="${f(X(t0))}" y2="${f(Y(0))}" stroke="${C.soft}" stroke-width="1" stroke-dasharray="3 3">${an('x1', xs)}${an('x2', xs)}${an('y1', ts.map(t => f(Y(l(t)))).join(';'))}</line>`);
  out.push(`<circle cx="${f(X(t0))}" cy="${f(Y(g(t0)))}" r="4.5" fill="${C.emph}" stroke="none">${an('cx', xs)}${an('cy', ts.map(t => f(Y(g(t)))).join(';'))}</circle>`);
  out.push(`<circle cx="${f(X(t0))}" cy="${f(Y(l(t0)))}" r="4" fill="${C.blue}" stroke="none">${an('cx', xs)}${an('cy', ts.map(t => f(Y(l(t)))).join(';'))}</circle>`);
  out.push(`<text x="${f(X(t0) + 8)}" y="${f(Y(g(t0)) - 8)}" fill="${C.emph}" stroke="none" font-style="italic">P${an('x', ts.map(t => f(X(t) + 8)).join(';'))}${an('y', ts.map(t => f(Y(g(t)) - 8)).join(';'))}</text>`);
  out.push(`<text x="${f(X(t0) - 8)}" y="${f(Y(l(t0)) + 16)}" fill="${C.blue}" stroke="none" font-style="italic" text-anchor="end">Q${an('x', ts.map(t => f(X(t) - 8)).join(';'))}${an('y', ts.map(t => f(Y(l(t)) + 16)).join(';'))}</text>`);
  out.push(dot(X(-1), Y(0)), dot(X(3), Y(0)), dot(X(0), Y(3)));
  out.push(text(X(-1) - 4, Y(0) - 8, 'A', { anchor: 'end', italic: true }), text(X(3) + 6, Y(0) - 8, 'B', { italic: true }), text(X(0) - 8, Y(3) - 6, 'C', { anchor: 'end', italic: true }));
  files['number-to-shape-area.svg'] = svg(340, 290, out.join('\n'));
}

// ---------- x 轴上使 ∠APB 为直角的点：以 AB 为直径的圆 ----------
{
  const { X, Y, body } = axes({ ox: 40, oy: 200, u: 44, xmin: -0.5, xmax: 6.2, ymin: -0.8, ymax: 4.2 });
  const P = ([x, y]) => [X(x), Y(y)];
  const A = [1, 3], B = [5, 1], M = [3, 2], P1 = [2, 0], P2 = [4, 0];
  const out = [body];
  out.push(circle(X(M[0]), Y(M[1]), Math.sqrt(5) * 44, { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(line(...P(A), ...P(B), { color: C.ink, w: 2 }));
  out.push(line(...P(P1), ...P(A), { color: C.emph, w: 2 }), line(...P(P1), ...P(B), { color: C.emph, w: 2 }));
  out.push(line(...P(P2), ...P(A), { color: C.blue, w: 2 }), line(...P(P2), ...P(B), { color: C.blue, w: 2 }));
  out.push(rightAngle(P(P1), P(A), P(B), { size: 9, color: C.emph }), rightAngle(P(P2), P(A), P(B), { size: 9, color: C.blue }));
  out.push(dot(...P(A)), dot(...P(B)), dot(...P(M), C.soft, 3), dot(...P(P1), C.emph), dot(...P(P2), C.blue));
  out.push(text(X(1) - 6, Y(3) - 8, 'A(1, 3)', { anchor: 'end', size: 12 }), text(X(5) + 8, Y(1) - 6, 'B(5, 1)', { size: 12 }));
  out.push(subLabel(X(2) - 4, Y(0) + 32, 'P', 1, '(2, 0)', { anchor: 'end', color: C.emph, size: 12 }), subLabel(X(4) + 4, Y(0) + 32, 'P', 2, '(4, 0)', { color: C.blue, size: 12 }));
  files['number-to-shape-right-angle.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 用坐标证明：斜边上的中线等于斜边的一半 ----------
{
  const { X, Y, body } = axes({ ox: 50, oy: 200, u: 40, xmin: -0.4, xmax: 6.8, ymin: -0.4, ymax: 4.6, ticks: false, grid: false });
  const P = ([x, y]) => [X(x), Y(y)];
  const Cc = [0, 0], A = [6, 0], B = [0, 4], M = [3, 2];
  const out = [body.replace(/<text[^>]*>O<\/text>/, '')];
  out.push(poly([P(Cc), P(A), P(B)], { w: 2 }));
  out.push(line(...P(Cc), ...P(M), { color: C.emph, w: 2.5 }));
  out.push(rightAngle(P(Cc), P(A), P(B), { size: 12 }));
  out.push(tick(P(A), P(M), 1, { color: C.blue }), tick(P(M), P(B), 1, { color: C.blue }));
  out.push(line(X(3), Y(2), X(3), Y(0), { color: C.soft, w: 1, dash: '3 3' }), line(X(3), Y(2), X(0), Y(2), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(dot(...P(A)), dot(...P(B)), dot(...P(M), C.emph));
  out.push(text(X(6), Y(0) + 20, 'A(2a, 0)', { anchor: 'middle', size: 13 }), text(X(0) + 10, Y(4) - 4, 'B(0, 2b)', { size: 13 }), text(X(3) + 10, Y(2) - 6, 'M(a, b)', { color: C.emph, size: 13 }));
  out.push(text(X(0) - 8, Y(0) + 32, 'C(0, 0)', { size: 13, anchor: 'middle' }));
  files['number-to-shape-median.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 例 5 想一想：延长 CM 到 D，ACBD 是矩形 ----------
{
  const Cc = [50, 200], A = [290, 200], B = [50, 40], D = [290, 40], M = [170, 120];
  const out = [];
  out.push(line(...B, ...D, { color: C.blue, w: 1.5, dash: '6 4' }), line(...A, ...D, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(poly([Cc, A, B], { w: 2 }));
  out.push(line(...Cc, ...M, { color: C.emph, w: 2.5 }), line(...M, ...D, { color: C.emph, w: 2, dash: '6 4' }));
  out.push(rightAngle(Cc, A, B, { size: 12 }));
  out.push(tick(Cc, M, 2, { color: C.emph }), tick(M, D, 2, { color: C.emph }), tick(A, M, 1, { color: C.blue }), tick(M, B, 1, { color: C.blue }));
  out.push(dot(...Cc), dot(...A), dot(...B), dot(...D), dot(...M, C.emph));
  out.push(text(Cc[0] - 8, Cc[1] + 16, 'C', { italic: true, anchor: 'middle' }), text(A[0] + 8, A[1] + 16, 'A', { italic: true, anchor: 'middle' }));
  out.push(text(B[0] - 8, B[1] - 6, 'B', { italic: true, anchor: 'middle' }), text(D[0] + 8, D[1] - 6, 'D', { italic: true, anchor: 'middle', color: C.blue }));
  out.push(text(M[0], M[1] + 24, 'M', { italic: true, anchor: 'middle', color: C.emph }));
  files['number-to-shape-median-rect.svg'] = svg(340, 230, out.join('\n'));
}

export default files;
