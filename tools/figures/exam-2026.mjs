// 附录“2026 年河南中考数学”的图，按原卷重画。
import { C, f, svg, text, line, seg, dot, poly, polyline, circle, arc, label, rightAngle, angleMark, axes, plot } from './lib.mjs';

const files = {};
const I = { italic: true };
const dash = '6 4';

// ---------- 第 2 题：正方体展开图 ----------
{
  const s = 40, x0 = 30, y0 = 20;
  const cells = [[0, 0, '共'], [0, 1, '建'], [1, 1, '美'], [2, 1, '丽'], [3, 1, '中'], [3, 2, '国']];
  const out = cells.map(([c, r, t]) => poly([[x0 + c * s, y0 + r * s], [x0 + (c + 1) * s, y0 + r * s], [x0 + (c + 1) * s, y0 + (r + 1) * s], [x0 + c * s, y0 + (r + 1) * s]], { w: 1.5 })
    + text(x0 + c * s + s / 2, y0 + r * s + s / 2 + 6, t, { anchor: 'middle', size: 18 }));
  files['exam-2026-02.svg'] = svg(220, 160, out.join('\n'));
}

// ---------- 第 5 题：关于直线 l 对称的两个三角形 ----------
{
  const lx = 180;
  const A = [140, 30], Cc = [60, 70], B = [95, 170];
  const m = p => [2 * lx - p[0], p[1]];
  const out = [line(lx, 15, lx, 190, { w: 1.5 })];
  out.push(poly([A, B, Cc]), poly([m(A), m(B), m(Cc)]));
  out.push(rightAngle(Cc, A, B), rightAngle(m(Cc), m(A), m(B)));
  out.push(text(lx + 4, 22, 'l', I));
  out.push(label(A, 'A', -6, -6), label(B, 'B', -4, 20), label(Cc, 'C', -12, 5));
  out.push(label(m(A), 'A′', 10, -6), label(m(B), 'B′', 6, 20), label(m(Cc), 'C′', 14, 5));
  files['exam-2026-05.svg'] = svg(360, 200, out.join('\n'));
}

// ---------- 第 6 题：AB ∥ CD ----------
{
  const yA = 40, yC = 180;
  const Cc = [70, yC], Q = [220, yA];            // 过点 C 的斜线交 AB 于 Q
  const k = (Q[0] - Cc[0]) / (yC - yA);
  const P = [Cc[0] + k * 55, yC - 55];           // 斜线上一点
  const R = [140, yA];                            // 另一条线段在 AB 上的端点
  const ext = [Cc[0] - k * 30, yC + 30];
  const out = [line(40, yA, 340, yA), line(Cc[0], yC, 340, yC)];
  out.push(seg(ext, Q), seg(R, P));
  out.push(angleMark(Cc, [340, yC], Q, { r: 22 }));
  out.push(angleMark(P, R, Q, { r: 22 }));
  out.push(angleMark(R, [40, yA], P, { r: 16 }));
  out.push(text(30, yA + 5, 'A', { ...I, anchor: 'end' }), text(350, yA + 5, 'B', I));
  out.push(text(Cc[0] - 10, yC + 5, 'C', { ...I, anchor: 'end' }), text(350, yC + 5, 'D', I));
  out.push(text(Cc[0] + 30, yC - 8, '1', { size: 13 }), text(P[0] + 12, P[1] - 22, '2', { size: 13 }), text(R[0] - 20, R[1] + 26, '3', { size: 13 }));
  files['exam-2026-06.svg'] = svg(370, 220, out.join('\n'));
}

// ---------- 第 9 题：坐标系中的矩形 OABC ----------
{
  const u = 60, ox = 40, oy = 170;
  const X = x => ox + u * x, Y = y => oy - u * y;
  const out = [line(ox - 10, oy, X(4.6), oy, { color: C.axis, w: 1.5 }), line(ox, oy + 10, ox, Y(2.6), { color: C.axis, w: 1.5 })];
  out.push(`<polygon points="${f(X(4.6) + 8)},${oy} ${f(X(4.6))},${oy - 4} ${f(X(4.6))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(2.6) - 8)} ${ox - 4},${f(Y(2.6))} ${ox + 4},${f(Y(2.6))}" fill="${C.axis}" stroke="none"/>`);
  const O = [X(0), Y(0)], A = [X(0), Y(2)], B = [X(4), Y(2)], Cc = [X(4), Y(0)], P = [X(2), Y(1)];
  out.push(poly([O, A, B, Cc]), seg(O, B), seg(A, Cc));
  out.push(text(X(4.6) + 4, oy + 18, 'x', I), text(ox - 14, Y(2.6) + 4, 'y', I));
  out.push(label(O, 'O', -12, 18), label(A, 'A', -12, 5), label(B, 'B', 10, -4), label(Cc, 'C', 0, 20), label(P, 'P', 0, 22));
  files['exam-2026-09.svg'] = svg(340, 200, out.join('\n'));
}

// ---------- 第 10 题：团扇，PA、PB 与 ⊙O 相切 ----------
{
  const O = [160, 80], r = 60, OP = 2 * r;       // ∠APB = 60°，所以 OP = 2r
  const P = [O[0], O[1] + OP];
  const A = [O[0] - r * Math.cos(Math.PI / 6), O[1] + r * Math.sin(Math.PI / 6)];
  const B = [O[0] + r * Math.cos(Math.PI / 6), O[1] + r * Math.sin(Math.PI / 6)];
  const out = [circle(O[0], O[1], r)];
  out.push(arc(O, r, 210, 330, { w: 4 }));
  out.push(seg(P, A, { w: 1.5, dash }), seg(P, B, { w: 1.5, dash }));
  out.push(line(O[0], O[1], O[0], O[1] + r, { w: 1.5, dash: '3 3' }), line(O[0], O[1] + r, P[0], P[1]));
  out.push(dot(...O, C.ink, 2.5));
  out.push(label(O, 'O', -10, -6), label(A, 'A', -12, 2), label(B, 'B', 12, 2), label(P, 'P', 0, 20));
  files['exam-2026-10.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 第 13 题：AB 为 ⊙O 的直径 ----------
{
  const O = [160, 110], r = 90;
  const at = d => [O[0] + r * Math.cos(d * Math.PI / 180), O[1] - r * Math.sin(d * Math.PI / 180)];
  const A = at(180), B = at(0), Cc = at(100), D = at(240);  // ∠ADC = ∠ABC = 40°，所以 C 在 100° 处
  const out = [circle(O[0], O[1], r), seg(A, B), seg(A, Cc), seg(Cc, B), seg(A, D), seg(D, Cc), dot(...O, C.ink, 2.5)];
  out.push(label(A, 'A', -12, 5), label(B, 'B', 12, 5), label(Cc, 'C', 0, -8), label(D, 'D', -6, 18), label(O, 'O', 0, 18));
  files['exam-2026-13.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 第 14 题：钢琴键盘的一部分 ----------
{
  const w = 32, h = 130, x0 = 10, y0 = 15, n = 10;
  const out = [];
  for (let i = 0; i < n; i++) out.push(poly([[x0 + i * w, y0], [x0 + (i + 1) * w, y0], [x0 + (i + 1) * w, y0 + h], [x0 + i * w, y0 + h]], { w: 1.2 }));
  // 黑键：在第 1、2、4、5、6、8、9 个白键右侧（C D E F G A B 循环，从 C 开始）
  const black = [0, 1, 3, 4, 5, 7, 8];
  for (const i of black) out.push(`<rect x="${f(x0 + (i + 1) * w - 10)}" y="${y0}" width="20" height="${h * 0.6}" fill="${C.ink}" stroke="none"/>`);
  const names = { 3: 'F', 4: 'G', 5: 'A', 6: 'B' };
  for (const [i, s] of Object.entries(names)) out.push(text(x0 + (+i + 0.5) * w, y0 + h - 12, s, { anchor: 'middle', size: 15 }));
  files['exam-2026-14.svg'] = svg(n * w + 20, h + 30, out.join('\n'));
}

// ---------- 第 15 题：AB = AC，CD 是角平分线 ----------
{
  const u = 30, ox = 160, oy = 170;
  const P = (x, y) => [ox + u * x, oy - u * y];
  const A = P(0, 4), B = P(-3, 0), Cc = P(3, 0);
  // 角平分线 CD：D 分 AB 为 AD : DB = CA : CB = 5 : 6
  const D = [A[0] + (B[0] - A[0]) * 5 / 11, A[1] + (B[1] - A[1]) * 5 / 11];
  const out = [poly([A, B, Cc]), seg(Cc, D)];
  out.push(label(A, 'A', 0, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', -12, 0));
  files['exam-2026-15.svg'] = svg(320, 195, out.join('\n'));
}

// ---------- 第 16 题：数轴 ----------
function numberLine(extra = '') {
  const u = 40, ox = 170, y = 50;
  const out = [line(20, y, 320, y, { w: 1.5 }), `<polygon points="330,${y} 320,${y - 5} 320,${y + 5}" fill="${C.ink}" stroke="none"/>`];
  for (let k = -3; k <= 3; k++) out.push(line(ox + u * k, y, ox + u * k, y - 6, { w: 1.5 }), text(ox + u * k, y + 20, k < 0 ? '−' + -k : String(k), { anchor: 'middle', size: 13 }));
  return svg(340, 80, out.join('\n') + extra);
}
files['exam-2026-16-a.svg'] = numberLine();
{
  const u = 40, ox = 170, y = 50;
  const L = ox - 2 * u, R = ox + u;
  const e = [
    // x ≤ 1：从 1 向左
    polyline([[R, y], [R, y - 26], [ox - 3.6 * u, y - 26]], { color: C.emph, w: 2 }),
    // x ≥ −2：从 −2 向右
    polyline([[L, y], [L, y - 16], [ox + 2.4 * u, y - 16]], { color: C.blue, w: 2 }),
    dot(L, y, C.ink, 4), dot(R, y, C.ink, 4),
  ].join('\n');
  files['exam-2026-16-b.svg'] = numberLine('\n' + e);
}

// ---------- 第 17 题：测试成绩统计图 ----------
{
  const jia = [6, 6, 7, 6, 8, 8, 7, 8, 7, 8], yi = [4, 9, 6, 5, 9, 9, 6, 9, 7, 7];
  const ox = 50, oy = 200, ux = 34, uy = 15;
  const X = i => ox + ux * i, Y = v => oy - uy * v;
  const out = [];
  for (const v of [2, 4, 6, 8, 10]) out.push(line(ox, Y(v), X(10.6), Y(v), { color: C.soft, w: 1, dash: '3 3' }), text(ox - 8, Y(v) + 4, String(v), { anchor: 'end', size: 12 }));
  out.push(line(ox, oy, X(10.8), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(11.6), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${ox},${f(Y(11.6) - 8)} ${ox - 4},${f(Y(11.6))} ${ox + 4},${f(Y(11.6))}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${f(X(10.8) + 8)},${oy} ${f(X(10.8))},${oy - 4} ${f(X(10.8))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(ox - 8, oy + 16, '0', { anchor: 'end', size: 12 }), text(ox + 6, Y(11.6) + 2, '成绩/投进次数', { size: 12 }), text(X(10.8) + 12, oy + 16, '组别', { size: 12 }));
  for (let i = 1; i <= 10; i++) out.push(text(X(i), oy + 16, String(i), { anchor: 'middle', size: 12 }));
  out.push(polyline(jia.map((v, i) => [X(i + 1), Y(v)])), polyline(yi.map((v, i) => [X(i + 1), Y(v)]), { color: C.blue, dash: '5 3' }));
  jia.forEach((v, i) => out.push(dot(X(i + 1), Y(v), C.ink, 3)));
  yi.forEach((v, i) => out.push(`<rect x="${f(X(i + 1) - 3)}" y="${f(Y(v) - 3)}" width="6" height="6" fill="${C.blue}" stroke="none"/>`));
  // 数据标签：较大的写在上方，较小的写在下方
  for (let i = 0; i < 10; i++) {
    const a = jia[i], b = yi[i], hiJ = a >= b;
    out.push(text(X(i + 1), hiJ ? Y(a) - 7 : Y(a) + 16, String(a), { anchor: 'middle', size: 12 }));
    out.push(text(X(i + 1), hiJ ? Y(b) + 16 : Y(b) - 7, String(b), { anchor: 'middle', size: 12, color: C.blue }));
  }
  // 图例
  out.push(line(X(3), 18, X(3) + 28, 18), dot(X(3) + 14, 18, C.ink, 3), text(X(3) + 34, 23, '甲', { size: 13 }));
  out.push(line(X(5), 18, X(5) + 28, 18, { color: C.blue, dash: '5 3' }), `<rect x="${f(X(5) + 11)}" y="15" width="6" height="6" fill="${C.blue}" stroke="none"/>`, text(X(5) + 34, 23, '乙', { size: 13, color: C.blue }));
  files['exam-2026-17.svg'] = svg(460, 225, out.join('\n'));
}

// ---------- 第 19 题：平行四边形 ABCD ----------
{
  const A = [120, 25], D = [290, 25], B = [40, 125], Cc = [210, 125], E = [112, 125];
  const out = [poly([A, B, Cc, D]), seg(A, E)];
  out.push(label(A, 'A', 0, -8), label(D, 'D', 8, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(E, 'E', 0, 20));
  files['exam-2026-19.svg'] = svg(320, 150, out.join('\n'));
}

// ---------- 第 20 题：图 1 v 与 t，图 2 路程与时间 ----------
{
  const { X, Y, body } = axes({ ox: 40, oy: 215, u: 44, xmin: -0.3, xmax: 4.8, ymin: -0.3, ymax: 4.6, grid: false, xlabel: 't/h', ylabel: 'v/(km/h)' });
  const out = [body];
  out.push(line(X(0), Y(4), X(2), Y(4), { color: C.soft, w: 1, dash: '4 3' }), line(X(2), Y(0), X(2), Y(4), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(line(X(0), Y(2), X(4), Y(2), { color: C.soft, w: 1, dash: '4 3' }), line(X(4), Y(0), X(4), Y(2), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(plot(t => 8 / t, 1.8, 4.6, X, Y));
  files['exam-2026-20-a.svg'] = svg(320, 245, out.join('\n'));
}
{
  const ox = 40, oy = 190, ux = 150, uy = 19;
  const X = t => ox + ux * t, Y = y => oy - uy * y;
  const out = [line(ox - 8, oy, X(2.3), oy, { color: C.axis, w: 1.5 }), line(ox, oy + 8, ox, Y(9.4), { color: C.axis, w: 1.5 })];
  out.push(`<polygon points="${f(X(2.3) + 8)},${oy} ${f(X(2.3))},${oy - 4} ${f(X(2.3))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(9.4) - 8)} ${ox - 4},${f(Y(9.4))} ${ox + 4},${f(Y(9.4))}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(X(2.3) + 4, oy + 18, 't/h', { color: C.soft, italic: true }), text(ox + 8, Y(9.4) - 2, 'y/km', { color: C.soft, italic: true }), text(ox - 6, oy + 16, 'O', { anchor: 'end', italic: true, color: C.soft, size: 12 }));
  const g = { color: C.soft, w: 1, dash: '4 3' };
  out.push(line(ox, Y(4), X(0.75), Y(4), g), line(ox, Y(8), X(2), Y(8), g));
  for (const t of [0.75, 1.25]) out.push(line(X(t), oy, X(t), Y(4), g));
  for (const t of [1.75, 2]) out.push(line(X(t), oy, X(t), Y(8), g));
  for (const t of [0.25, 0.75, 1.25, 1.75, 2]) out.push(text(X(t), oy + 16, String(t), { anchor: 'middle', size: 11, color: C.soft }));
  for (const v of [4, 8]) out.push(text(ox - 6, Y(v) + 4, String(v), { anchor: 'end', size: 11, color: C.soft }));
  out.push(polyline([[X(0), Y(0)], [X(2), Y(8)]]));
  out.push(polyline([[X(0.25), Y(0)], [X(0.75), Y(4)], [X(1.25), Y(4)], [X(1.75), Y(8)]]));
  files['exam-2026-20-b.svg'] = svg(420, 220, out.join('\n'));
}

// ---------- 第 21 题：地下车库入口 ----------
function garage(sign, withB2, withH = false) {
  const top = 110, bot = 200;
  const A = [70, bot], B = [260, top], B2 = [380, top], Cc = [150, top], D = [450, top];
  const out = [];
  // 楼和限高标志
  out.push(poly([[60, 20], [140, 20], [140, top], [60, top]], { w: 1.5 }));
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) out.push(poly([[70 + c * 22, 35 + r * 30], [86 + c * 22, 35 + r * 30], [86 + c * 22, 49 + r * 30], [70 + c * 22, 49 + r * 30]], { w: 1.2 }));
  out.push(circle(170, 60, 18, { w: 2 }), circle(170, 60, 14, { w: 1 }), text(170, 64, sign, { anchor: 'middle', size: 10 }));
  out.push(line(45, top, Cc[0], top, { w: 1.5 }));
  if (withB2) {
    out.push(line(Cc[0], top, B2[0], top, { w: 1.2, dash }), line(B2[0], top, D[0] + 20, top, { w: 1.5 }));
    out.push(seg(A, B, { w: 1.2, dash }), seg(A, B2));
    out.push(label(B2, 'B′', 0, -8));
  } else {
    out.push(line(Cc[0], top, B[0], top, { w: 1.2, dash }), line(B[0], top, D[0] + 20, top, { w: 1.5 }));
    out.push(seg(A, B));
  }
  out.push(line(20, bot, A[0], bot, { w: 1.5 }), line(A[0], bot, 440, bot, { w: 1.2, dash }));
  if (withH) {
    // 解答图：过点 A 作 AH ⊥ CD
    const H = [A[0], top];
    out.push(seg(A, H, { w: 1.2, dash: '3 3' }), rightAngle(H, [H[0] + 10, top], A), label(H, 'H', -10, 20));
  }
  out.push(label(B, 'B', 0, -8), label(Cc, 'C', 0, 20), label(D, 'D', 0, -8), label([30, bot], 'E', 0, -8), label(A, 'A', -6, -8), label([450, bot], 'F', 0, 5));
  out.push(text(410, top + 20, '车库入口地面', { anchor: 'middle', size: 12 }), text(40, bot + 18, '车库地面', { anchor: 'middle', size: 12 }));
  return svg(480, 225, out.join('\n'));
}
files['exam-2026-21-a.svg'] = garage('2.7m', false);
files['exam-2026-21-b.svg'] = garage('?m', true);
files['exam-2026-21-d.svg'] = garage('?m', true, true);
{
  const out = [];
  for (const [x, s] of [[60, '2.7m'], [240, '? m']]) out.push(circle(x, 50, 38, { w: 3 }), circle(x, 50, 31, { w: 1.2 }), text(x, 57, s, { anchor: 'middle', size: 18 }));
  out.push(line(110, 50, 180, 50), `<polygon points="190,50 178,44 178,56" fill="${C.ink}" stroke="none"/>`);
  files['exam-2026-21-c.svg'] = svg(320, 100, out.join('\n'));
}

// ---------- 第 23 题：菱形 ABCD，AB 绕点 A 旋转到 AE ----------
function rhombus(al, extend) {
  const u = 40, ox = 100, oy = 30;
  const P = ([x, y]) => [ox + u * x, oy - u * y];
  const r = d => d * Math.PI / 180;
  const a = [0, 0], b = [4 * Math.cos(r(240)), 4 * Math.sin(r(240))], d = [4, 0], c = [b[0] + 4, b[1]];
  const e = [4 * Math.cos(r(240 + al)), 4 * Math.sin(r(240 + al))];
  const v = [e[0] - d[0], e[1] - d[1]], l = Math.hypot(...v), w = v.map(x => x / l);
  const t = (b[0] - e[0]) * w[0] + (b[1] - e[1]) * w[1];
  const h = [e[0] + 2 * t * w[0], e[1] + 2 * t * w[1]];
  const end = extend ? [h[0] + 0.6 * w[0], h[1] + 0.6 * w[1]] : h;
  const [A, B, Cc, D, E, H, End] = [a, b, c, d, e, h, end].map(P);
  const out = [poly([A, B, Cc, D]), seg(A, E), seg(B, E), seg(B, H), seg(Cc, H), seg(D, End)];
  out.push(label(A, 'A', -4, -8), label(D, 'D', 8, -8), label(B, 'B', -12, 5), label(Cc, 'C', 12, extend ? 5 : 14), label(E, 'E', extend ? 4 : 12, extend ? 18 : 12), label(H, 'H', extend ? 10 : 8, 16));
  const ys = [A, B, Cc, D, E, End].map(p => p[1]);
  return svg(320, Math.ceil(Math.max(...ys) + 30), out.join('\n'));
}
files['exam-2026-23-a.svg'] = rhombus(30, true);
files['exam-2026-23-b.svg'] = rhombus(100, false);

export default files;
