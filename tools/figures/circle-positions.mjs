// 第九部分“与圆有关的位置关系”的图。
import { C, f, svg, text, line, seg, dot, poly, circle, arc, angleMark, rightAngle, tick, rad, axes } from './lib.mjs';

const files = {};
const P = (O, r, d) => [O[0] + r * Math.cos(rad(d)), O[1] - r * Math.sin(rad(d))];
const out_ = (O, r, d, s, k = 15, o = {}) => { const p = P(O, r + k, d); return text(p[0], p[1] + 5, s, { italic: true, anchor: 'middle', ...o }); };
const lab = (p, s, dx, dy, o = {}) => text(p[0] + dx, p[1] + dy, s, { italic: true, anchor: 'middle', ...o });
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
// 点 p 到直线 ab 的垂足
const foot = (p, a, b) => { const d = [b[0] - a[0], b[1] - a[1]], t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [a[0] + t * d[0], a[1] + t * d[1]]; };

// ---------- 点和圆：比较 d 和 r ----------
{
  const O = [140, 115], r = 80;
  const A = P(O, 42, 205), B = P(O, r, 300), Cc = P(O, 125, 25);
  const out = [circle(...O, r)];
  for (const X of [A, B, Cc]) out.push(seg(O, X, { color: C.blue, w: 1.5, dash: '5 4' }));
  out.push(dot(...A, C.emph), dot(...B, C.emph), dot(...Cc, C.emph), dot(...O));
  out.push(lab(A, 'A', -12, 4), lab(B, 'B', 10, 16), lab(Cc, 'C', 12, 4), lab(O, 'O', -10, -8));
  files['circle-positions-point.svg'] = svg(320, 220, out.join('\n'));
}

// ---------- 不在同一直线上的三点确定一个圆 ----------
{
  const O = [165, 135], r = 100;
  const A = P(O, r, 210), B = P(O, r, 100), Cc = P(O, r, 330);
  const out = [circle(...O, r, { color: C.soft, w: 1.5 }), poly([A, B, Cc])];
  // 两条垂直平分线：从中点穿过 O 再延长
  for (const [p, q, n] of [[A, B, 1], [B, Cc, 2]]) {
    const m = mid(p, q), l = dist(m, O), u = [(O[0] - m[0]) / l, (O[1] - m[1]) / l];
    const s = [m[0] - 30 * u[0], m[1] - 30 * u[1]], e = [O[0] + 70 * u[0], O[1] + 70 * u[1]];
    out.push(seg(s, e, { color: C.blue, w: 1.5, dash: '6 4' }), rightAngle(m, q, O, { size: 8 }), tick(p, m, n), tick(m, q, n));
  }
  out.push(dot(...A), dot(...B), dot(...Cc), dot(...O, C.emph));
  out.push(out_(O, r, 210, 'A'), out_(O, r, 100, 'B'), out_(O, r, 330, 'C'), lab(O, 'O', 0, 20, { color: C.emph }));
  files['circle-positions-three-points.svg'] = svg(330, 260, out.join('\n'));
}

// ---------- 外心的位置 ----------
{
  const r = 58, cases = [
    { a: 90, b: 215, c: 325, name: '锐角三角形' },
    { a: 105, b: 180, c: 0, name: '直角三角形' },
    { a: 270, b: 195, c: 345, name: '钝角三角形' },
  ];
  const out = [];
  cases.forEach((k, i) => {
    const O = [85 + i * 160, 90];
    const A = P(O, r, k.a), B = P(O, r, k.b), Cc = P(O, r, k.c);
    out.push(circle(...O, r, { color: C.soft, w: 1.2 }), poly([A, B, Cc], { w: 2 }));
    if (i === 1) out.push(rightAngle(A, B, Cc, { size: 8 }));
    for (const X of [A, B, Cc]) out.push(seg(O, X, { color: C.blue, w: 1.2, dash: '4 3' }), dot(...X, C.ink, 3));
    out.push(dot(...O, C.emph));
    out.push(out_(O, r, k.a, 'A', 12), out_(O, r, k.b, 'B', 12), out_(O, r, k.c, 'C', 12));
    out.push(text(O[0] + (i === 2 ? 0 : i === 1 ? 10 : -15), O[1] + (i === 2 ? -8 : i === 1 ? 18 : -3), 'O', { italic: true, anchor: 'middle', color: C.emph, size: 13 }));
    out.push(text(O[0], O[1] + r + 38, k.name, { anchor: 'middle', size: 13, color: C.soft }));
  });
  files['circle-positions-circumcenter.svg'] = svg(490, 200, out.join('\n'));
}

// ---------- 直线 l 上的点 P：OP² = d² + t² ----------
{
  const O = [150, 92], r = 72, d = 42, out = [];
  const y = O[1] + d, H = [O[0], y], Pp = [O[0] + 118, y];
  out.push(poly([O, H, Pp], { fill: C.emphFill, color: 'none', w: 0 }));
  out.push(circle(...O, r, { w: 2 }));
  out.push(line(30, y, 320, y, { w: 2 }), text(322, y + 5, 'l', { italic: true, size: 15 }));
  out.push(seg(O, H, { color: C.blue, w: 2.5 }), rightAngle(H, Pp, O, { size: 9 }));
  out.push(seg(O, Pp, { color: C.emph, w: 2, dash: '6 4' }), seg(H, Pp, { color: C.ink, w: 3 }));
  out.push(dot(...O), dot(...H), dot(...Pp, C.emph));
  out.push(lab(O, 'O', -12, -6), lab(H, 'H', -10, 18), lab(Pp, 'P', 0, 20, { color: C.emph }));
  out.push(text(O[0] - 8, (O[1] + y) / 2 + 5, 'd', { italic: true, color: C.blue, size: 15, anchor: 'end' }));
  // |t| 标在 HP 下方、圆外的那一段，OP 标在斜边靠 P 的一端上方，避开圆周
  out.push(text(Pp[0] - 26, y + 20, '|t|', { italic: true, size: 15, anchor: 'middle' }));
  out.push(text(Pp[0] - 22, y - 16, 'OP', { italic: true, color: C.emph, size: 13, anchor: 'middle' }));
  files['circle-positions-line-point.svg'] = svg(340, 190, out.join('\n'));
}

// ---------- 直线和圆：相离、相切、相交 ----------
{
  const r = 50, cases = [[72, '相离：d &gt; r'], [50, '相切：d = r'], [26, '相交：d &lt; r']];
  const out = [];
  cases.forEach(([d, name], i) => {
    const O = [85 + i * 160, 75], y = O[1] + d;
    out.push(circle(...O, r), line(O[0] - 75, y, O[0] + 75, y, { color: C.emph, w: 2 }));
    out.push(seg(O, [O[0], y], { color: C.blue, w: 1.5, dash: '5 4' }), rightAngle([O[0], y], [O[0] + 10, y], O, { size: 7 }));
    const R = P(O, r, 145);
    out.push(seg(O, R, { color: C.soft, w: 1.5 }), text((O[0] + R[0]) / 2 - 2, (O[1] + R[1]) / 2 - 5, 'r', { italic: true, anchor: 'middle', color: C.soft }));
    out.push(text(O[0] + 8, (O[1] + y) / 2 + (d === 26 ? 2 : 6), 'd', { italic: true, color: C.blue }));
    if (d < r) { const h = Math.sqrt(r * r - d * d); out.push(dot(O[0] - h, y, C.emph), dot(O[0] + h, y, C.emph)); }
    if (d === r) out.push(dot(O[0], y, C.emph));
    out.push(dot(...O), text(O[0] - 12, O[1] + 4, 'O', { italic: true, anchor: 'middle', size: 13 }));
    out.push(text(O[0] + 78, y + 4, 'l', { italic: true, color: C.emph }));
    out.push(text(O[0], 180, name, { anchor: 'middle', size: 13, color: C.soft }));
  });
  files['circle-positions-line.svg'] = svg(490, 195, out.join('\n'));
}

// ---------- 用方程看交点个数 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 170, u: 20, xmin: -7, xmax: 7, ymin: -7, ymax: 7, ticks: false });
  const out = [body, circle(X(0), Y(0), 5 * 20, { w: 2 })];
  out.push(text(X(5) + 4, Y(0) + 16, '5', { color: C.soft, size: 12 }), text(X(-5) - 4, Y(0) + 16, '−5', { anchor: 'end', color: C.soft, size: 12 }));
  const lines = [[3, C.emph, 'y = 3'], [5, C.blue, 'y = 5'], [-6, C.ink, 'y = −6']];
  for (const [k, col, s] of lines) {
    out.push(line(X(-7), Y(k), X(7), Y(k), { color: col, w: 2 }), text(X(7) + 8, Y(k) + 5, s, { italic: true, color: col, size: 13 }));
  }
  out.push(dot(X(-4), Y(3), C.emph), dot(X(4), Y(3), C.emph), dot(X(0), Y(5), C.blue));
  out.push(text(X(-4) - 4, Y(3) - 8, '(−4, 3)', { anchor: 'end', color: C.emph, size: 12 }), text(X(4) + 4, Y(3) - 8, '(4, 3)', { color: C.emph, size: 12 }));
  files['circle-positions-equation.svg'] = svg(410, 340, out.join('\n'));
}

// ---------- 切线：经过半径外端并且垂直于半径 ----------
{
  const O = [120, 125], r = 75, a = 40;
  const A = P(O, r, a), t = [Math.sin(rad(a)), Math.cos(rad(a))];
  const L0 = [A[0] - 115 * t[0], A[1] - 115 * t[1]], L1 = [A[0] + 90 * t[0], A[1] + 90 * t[1]];
  const B = [A[0] - 75 * t[0], A[1] - 75 * t[1]];
  const out = [circle(...O, r), seg(L0, L1, { color: C.emph, w: 2 }), seg(O, A, { w: 2 }), seg(O, B, { color: C.blue, w: 1.5, dash: '5 4' })];
  out.push(rightAngle(A, O, L1), dot(...O), dot(...A), dot(...B, C.blue));
  out.push(lab(O, 'O', -4, 20), lab(A, 'A', 14, 10), lab(B, 'B', -14, 2), lab(L1, 'l', 8, 0, { color: C.emph }));
  files['circle-positions-tangent.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 例 1：证明 DC 是切线 ----------
// 题干图（circle-positions-example.svg）只画已知条件；证明里的图（circle-positions-example-solution.svg）再连接 OC，标出直角
for (const withOC of [false, true]) {
  const O = [110, 125], r = 70;
  const A = P(O, r, 180), B = P(O, r, 0), Cc = P(O, r, 60), D = [O[0] + 2 * r, O[1]];
  const out = [circle(...O, r), seg(A, D), seg(A, Cc), seg(Cc, D, { color: C.emph, w: 2.5 })];
  if (withOC) out.push(seg(O, Cc, { color: C.blue, w: 1.8, dash: '6 4' }), rightAngle(Cc, O, D));
  out.push(angleMark(A, D, Cc, { r: 26 }), angleMark(D, A, Cc, { r: 26 }));
  out.push(text(A[0] + 30, A[1] - 6, '30°', { color: C.emph, size: 12 }), text(D[0] - 30, D[1] - 6, '30°', { color: C.emph, size: 12, anchor: 'end' }));
  for (const p of [A, B, Cc, D, O]) out.push(dot(...p));
  out.push(lab(A, 'A', -14, 5), lab(B, 'B', 4, 18), lab(Cc, 'C', 0, -10), lab(D, 'D', 12, 5), lab(O, 'O', 0, 18));
  files[withOC ? 'circle-positions-example-solution.svg' : 'circle-positions-example.svg'] = svg(320, 215, out.join('\n'));
}

// ---------- 过两点作圆：圆心在 AB 的垂直平分线上，有无数个 ----------
{
  const A = [120, 212], B = [220, 212], M = mid(A, B), out = [];
  const centers = [[M[0], 267], [M[0], 182], [M[0], 117]];
  const cols = [C.soft, C.blue, C.emph];
  centers.forEach((O, i) => out.push(circle(...O, dist(O, A), { color: cols[i], w: 1.5 })));
  out.push(line(M[0], 4, M[0], 346, { color: C.ink, w: 1.2, dash: '6 4' }), rightAngle(M, B, [M[0], 10], { size: 8 }), tick(A, M, 1), tick(M, B, 1));
  out.push(seg(A, B, { w: 2 }), dot(...A), dot(...B));
  centers.forEach((O, i) => out.push(dot(...O, cols[i], 3.5)));
  out.push(lab(A, 'A', -16, 5), lab(B, 'B', 16, 5));
  files['circle-positions-two-points.svg'] = svg(340, 350, out.join('\n'));
}

// ---------- 过圆外一点作切线：以 OP 为直径的圆和 ⊙O 交于 A、B ----------
{
  const O = [100, 125], r = 62, Pp = [310, 125], Mid = mid(O, Pp), R2 = dist(O, Pp) / 2;
  const th = (Math.acos(r / (Pp[0] - O[0])) * 180) / Math.PI;
  const A = P(O, r, th), B = P(O, r, -th);
  const out = [circle(...O, r), circle(...Mid, R2, { color: C.blue, w: 1.5, dash: '6 4' }), seg(O, Pp, { color: C.soft, w: 1.2 })];
  out.push(seg(Pp, A, { color: C.emph, w: 2 }), seg(Pp, B, { color: C.emph, w: 2 }), seg(O, A, { w: 1.5 }), seg(O, B, { w: 1.5 }));
  out.push(rightAngle(A, O, Pp), rightAngle(B, O, Pp));
  for (const p of [A, B, O, Pp]) out.push(dot(...p));
  out.push(dot(...Mid, C.blue, 3));
  out.push(lab(A, 'A', -4, -10), lab(B, 'B', -4, 20), lab(O, 'O', -14, 5), lab(Pp, 'P', 12, 5));
  files['circle-positions-tangent-construct.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 切线长定理 ----------
{
  const O = [100, 120], r = 62, Pp = [310, 120];
  const th = (Math.acos(r / (Pp[0] - O[0])) * 180) / Math.PI;
  const A = P(O, r, th), B = P(O, r, -th);
  const out = [circle(...O, r), seg(Pp, A, { w: 2 }), seg(Pp, B, { w: 2 }), seg(O, A, { color: C.soft, w: 1.5, dash: '5 4' }), seg(O, B, { color: C.soft, w: 1.5, dash: '5 4' }), seg(O, Pp, { color: C.blue, w: 1.5, dash: '6 4' })];
  out.push(rightAngle(A, O, Pp), rightAngle(B, O, Pp), tick(Pp, A, 1), tick(Pp, B, 1));
  out.push(angleMark(Pp, A, O, { r: 34, color: C.blue }), angleMark(Pp, O, B, { r: 38, color: C.blue }));
  for (const p of [A, B, O, Pp]) out.push(dot(...p));
  out.push(lab(A, 'A', -4, -10), lab(B, 'B', -4, 20), lab(O, 'O', -14, 5), lab(Pp, 'P', 12, 5));
  files['circle-positions-tangent-length.svg'] = svg(340, 240, out.join('\n'));
}

// ---------- 三角形的内切圆 ----------
{
  const A = [150, 30], B = [40, 210], Cc = [320, 210];
  const a = dist(B, Cc), b = dist(A, Cc), c = dist(A, B), s = a + b + c;
  const I = [(a * A[0] + b * B[0] + c * Cc[0]) / s, (a * A[1] + b * B[1] + c * Cc[1]) / s];
  const D = foot(I, B, Cc), E = foot(I, A, Cc), F = foot(I, A, B), r = dist(I, D);
  const out = [circle(...I, r, { color: C.emph }), poly([A, B, Cc])];
  for (const V of [A, B, Cc]) out.push(seg(V, I, { color: C.blue, w: 1.3, dash: '5 4' }));
  for (const [X, p] of [[D, Cc], [E, Cc], [F, B]]) out.push(seg(I, X, { color: C.emph, w: 1.5 }), rightAngle(X, p, I, { size: 7 }));
  out.push(angleMark(A, B, I, { r: 20, color: C.blue }), angleMark(A, I, Cc, { r: 24, color: C.blue }));
  out.push(angleMark(B, Cc, I, { r: 26, n: 2, color: C.blue }), angleMark(B, I, A, { r: 26, n: 2, color: C.blue }));
  for (const p of [A, B, Cc, D, E, F, I]) out.push(dot(...p, C.ink, 3.5));
  out.push(lab(A, 'A', 0, -10), lab(B, 'B', -12, 8), lab(Cc, 'C', 12, 8), lab(D, 'D', 0, 20), lab(E, 'E', 12, -4), lab(F, 'F', -12, -4), lab(I, 'I', 4, -10));
  files['circle-positions-incircle.svg'] = svg(360, 235, out.join('\n'));
}

// ---------- 例 2：直角三角形的内切圆（题干图：只画已知条件） ----------
{
  const u = 20, Cc = [60, 200], A = [60, 200 - 8 * u], B = [60 + 6 * u, 200];
  const I = [Cc[0] + 2 * u, Cc[1] - 2 * u], r = 2 * u;
  const out = [circle(...I, r, { color: C.emph }), poly([A, B, Cc])];
  out.push(rightAngle(Cc, A, B));
  for (const p of [A, B, Cc, I]) out.push(dot(...p, C.ink, 3.5));
  out.push(lab(A, 'A', 0, -10), lab(B, 'B', 12, 6), lab(Cc, 'C', -12, 8), lab(I, 'I', 0, -8));
  out.push(text(Cc[0] + 3 * u, Cc[1] + 20, '6', { anchor: 'middle', color: C.soft, size: 13 }), text(Cc[0] - 14, Cc[1] - 4 * u + 4, '8', { anchor: 'middle', color: C.soft, size: 13 }));
  files['circle-positions-right-incircle.svg'] = svg(320, 240, out.join('\n'));
}

// ---------- 例 2 的两种解法（和上图同一个直角三角形） ----------
const rightIncircle = () => {
  const u = 20, Cc = [60, 200], A = [60, 200 - 8 * u], B = [60 + 6 * u, 200];
  const I = [Cc[0] + 2 * u, Cc[1] - 2 * u], r = 2 * u;
  return { u, A, B, Cc, I, r, D: [I[0], Cc[1]], E: [Cc[0], I[1]], F: foot(I, A, B) };
};
const names = ({ A, B, Cc, D, E, F, I }, iAt = [-2, -9]) => [lab(A, 'A', 0, -10), lab(B, 'B', 12, 6), lab(Cc, 'C', -12, 8), lab(D, 'D', 0, 20), lab(E, 'E', -12, 5), lab(F, 'F', 12, -4), lab(I, 'I', ...iAt)].join('');   // iAt：点 I 名字的偏移
const rLab = (p, q, dx, dy) => text((p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy, 'r', { italic: true, color: C.blue, size: 14, anchor: 'middle' });
{
  // 解法一：面积。连接 IA、IB、IC，分成三个小三角形，高都是 r
  const g = rightIncircle(), { A, B, Cc, D, E, F, I, r } = g, out = [];
  out.push(poly([I, B, Cc], { fill: C.blueFill, color: 'none', w: 0 }), poly([I, Cc, A], { fill: C.emphFill, color: 'none', w: 0 }), poly([I, A, B], { fill: 'rgba(87,96,106,0.12)', color: 'none', w: 0 }));
  out.push(circle(...I, r, { color: C.emph, w: 1.5 }), poly([A, B, Cc]));
  out.push(seg(I, A, { w: 1.5 }), seg(I, B, { w: 1.5 }), seg(I, Cc, { w: 1.5 }));
  out.push(seg(I, D, { color: C.blue, w: 1.8, dash: '4 3' }), seg(I, E, { color: C.blue, w: 1.8, dash: '4 3' }), seg(I, F, { color: C.blue, w: 1.8, dash: '4 3' }));
  out.push(rightAngle(Cc, A, B), rightAngle(D, B, I, { size: 7 }), rightAngle(E, A, I, { size: 7 }), rightAngle(F, B, I, { size: 7 }));
  out.push(rLab(I, D, 9, 4), rLab(I, E, 0, -6), rLab(I, F, -2, -8));
  for (const p of [A, B, Cc, D, E, F, I]) out.push(dot(...p, C.ink, 3.5));
  out.push(names(g, [-15, 9]));   // I 的名字放在 IE 和 IC 之间，避开三条连线
  files['circle-positions-right-incircle-area.svg'] = svg(320, 240, out.join('\n'));
}
{
  // 解法二：切线长。IDCE 是正方形，CD = CE = r；BD = BF = 6 − r，AE = AF = 8 − r
  const g = rightIncircle(), { A, B, Cc, D, E, F, I, r } = g, out = [];
  out.push(poly([I, D, Cc, E], { fill: C.blueFill, color: C.blue, w: 1.5 }));
  out.push(circle(...I, r, { color: C.emph, w: 1.5 }), poly([A, B, Cc]));
  out.push(rightAngle(Cc, A, B));
  // 相等的切线长：BD、BF 一条短线，AE、AF 两条短线
  out.push(tick(B, D, 1, { color: C.ink }), tick(B, F, 1, { color: C.ink }), tick(A, E, 2, { color: C.ink }), tick(A, F, 2, { color: C.ink }));
  const seglab = (p, q, s2, dx, dy, o = {}) => text((p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy, s2, { anchor: 'middle', size: 13, ...o });
  // “6 − r”：数字正体，字母 r 斜体
  const exprlab = (p, q, n, dx, dy) => `<text x="${f((p[0] + q[0]) / 2 + dx)}" y="${f((p[1] + q[1]) / 2 + dy)}" fill="${C.ink}" stroke="none" text-anchor="middle" font-size="13">${n} − <tspan font-style="italic">r</tspan></text>`;
  out.push(seglab(Cc, D, 'r', 0, 18, { italic: true, color: C.blue, size: 14 }), seglab(Cc, E, 'r', -12, 5, { italic: true, color: C.blue, size: 14 }));
  out.push(exprlab(D, B, 6, 0, 20), exprlab(E, A, 8, -28, 5));
  out.push(exprlab(B, F, 6, 22, 4), exprlab(F, A, 8, 24, 4));
  for (const p of [A, B, Cc, D, E, F, I]) out.push(dot(...p, C.ink, 3.5));
  out.push(names(g));
  files['circle-positions-right-incircle-tangent.svg'] = svg(320, 240, out.join('\n'));
}

export default files;
