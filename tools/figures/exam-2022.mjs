// 附录“2022 年河南中考数学”的图，按原卷重画。
import { C, f, svg, text, line, seg, dot, poly, polyline, circle, arc, label, rightAngle, angleMark } from './lib.mjs';

const files = {};
const I = { italic: true };
const dash = '6 4';

// 画坐标轴（不带网格和刻度）：原点 o，x 轴从 x0 到 x1，y 轴从 y0 到 y1（像素）
function bareAxes(o, x0, x1, y0, y1, oLabel = true) {
  const out = [line(x0, o[1], x1, o[1], { color: C.axis, w: 1.5 }), line(o[0], y0, o[0], y1, { color: C.axis, w: 1.5 })];
  out.push(`<polygon points="${f(x1 + 8)},${f(o[1])} ${f(x1)},${f(o[1] - 4)} ${f(x1)},${f(o[1] + 4)}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${f(o[0])},${f(y1 - 8)} ${f(o[0] - 4)},${f(y1)} ${f(o[0] + 4)},${f(y1)}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(x1 + 4, o[1] + 18, 'x', I), text(o[0] - 16, y1 + 6, 'y', I));
  if (oLabel) out.push(text(o[0] - 6, o[1] + 17, 'O', { ...I, anchor: 'end' }));
  return out.join('\n');
}

// ---------- 第 2 题：正方体展开图 ----------
{
  const s = 40, x0 = 20, y0 = 15;
  const cells = [[0, 0, '天'], [0, 1, '地'], [1, 1, '合'], [2, 1, '人'], [2, 2, '心'], [3, 2, '同']];
  const out = cells.map(([c, r, t]) => poly([[x0 + c * s, y0 + r * s], [x0 + (c + 1) * s, y0 + r * s], [x0 + (c + 1) * s, y0 + (r + 1) * s], [x0 + c * s, y0 + (r + 1) * s]], { w: 1.5 })
    + text(x0 + c * s + s / 2, y0 + r * s + s / 2 + 6, t, { anchor: 'middle', size: 18 }));
  files['exam-2022-02.svg'] = svg(200, 150, out.join('\n'));
}

// ---------- 第 3 题：直线 AB、CD 相交于 O，EO ⊥ CD ----------
{
  const O = [170, 112];
  const at = (len, deg) => [O[0] + len * Math.cos(deg * Math.PI / 180), O[1] - len * Math.sin(deg * Math.PI / 180)];
  const A = [30, 112], B = [320, 112], Cc = at(130, 144), D = at(130, -36), E = at(110, 54);
  const out = [seg(A, B), seg(Cc, D), seg(O, E)];
  out.push(rightAngle(O, E, Cc, { size: 11 }));
  out.push(angleMark(O, B, E, { r: 22, color: C.ink, w: 1.2 }), angleMark(O, A, Cc, { r: 22, color: C.ink, w: 1.2 }));
  out.push(text(O[0] + 30, O[1] - 8, '1', { size: 13 }), text(O[0] - 38, O[1] - 5, '2', { size: 13 }));
  out.push(label(A, 'A', -12, 5), label(B, 'B', 12, 5), label(Cc, 'C', -8, -4), label(D, 'D', 8, 14), label(E, 'E', 6, -6), label(O, 'O', -2, 20));
  files['exam-2022-03.svg'] = svg(350, 215, out.join('\n'));
}

// ---------- 第 5 题：菱形 ABCD，E 是 CD 的中点 ----------
{
  const s = 170, th = 68 * Math.PI / 180;
  const B = [40, 185], Cc = [B[0] + s, B[1]], A = [B[0] + s * Math.cos(th), B[1] - s * Math.sin(th)], D = [A[0] + s, A[1]];
  const O = [(A[0] + Cc[0]) / 2, (A[1] + Cc[1]) / 2], E = [(Cc[0] + D[0]) / 2, (Cc[1] + D[1]) / 2];
  const out = [poly([A, B, Cc, D]), seg(A, Cc), seg(B, D), seg(O, E)];
  out.push(label(A, 'A', -10, -4), label(B, 'B', -10, 12), label(Cc, 'C', 8, 16), label(D, 'D', 10, -4), label(O, 'O', -2, 20), label(E, 'E', 12, 4));
  files['exam-2022-05.svg'] = svg(320, 205, out.join('\n'));
}

// ---------- 第 7 题：打分情况扇形统计图 ----------
{
  const c = [150, 125], r = 85;
  const pt = (deg, rr = r) => [c[0] + rr * Math.cos(deg * Math.PI / 180), c[1] - rr * Math.sin(deg * Math.PI / 180)];
  // 从上方偏左开始，顺时针依次是 2 分、1 分、5 分、4 分、3 分
  const parts = [['2分', '10%', 10], ['1分', '5%', 5], ['5分', '15%', 15], ['4分', '45%', 45], ['3分', '25%', 25]];
  let a = 115;
  const out = [circle(c[0], c[1], r)];
  const mids = [];
  for (const [, , p] of parts) {
    out.push(seg(c, pt(a), { w: 1.5 }));
    mids.push(a - p * 1.8);
    a -= p * 3.6;
  }
  const lab = (p, s1, s2) => text(p[0], p[1], s1, { anchor: 'middle', size: 13 }) + text(p[0], p[1] + 16, s2, { anchor: 'middle', size: 13 });
  // 2 分、1 分扇形太窄，标签放在圆外，用引线连到扇形里
  const m2 = pt(mids[0], r * 0.7), m1 = pt(mids[1], r * 0.7);
  out.push(polyline([m2, [m2[0] - 8, 22], [70, 22]], { w: 1 }), lab([55, 18], '2分', '10%'));
  out.push(polyline([m1, [m1[0] + 12, 22], [235, 22]], { w: 1 }), lab([250, 18], '1分', '5%'));
  out.push(lab(pt(mids[2], r * 0.6), '5分', '15%'), lab(pt(mids[3], r * 0.5), '4分', '45%'), lab(pt(mids[4], r * 0.55), '3分', '25%'));
  files['exam-2022-07.svg'] = svg(310, 225, out.join('\n'));
}

// ---------- 第 9 题：坐标系中的正六边形 ----------
{
  const u = 50, o = [160, 130];
  const P = (x, y) => [o[0] + u * x, o[1] - u * y];
  const r3 = Math.sqrt(3);
  const A = P(1, r3), B = P(-1, r3), Cc = P(-2, 0), D = P(-1, -r3), E = P(1, -r3), F = P(2, 0), Pp = P(0, r3), O = P(0, 0);
  const out = [];
  out.push(poly([O, Pp, A], { fill: C.soft, color: C.ink, w: 1.5 }));
  out.push(bareAxes(o, 40, 280, 250, 20, false));
  out.push(poly([A, B, Cc, D, E, F]));
  out.push(label(A, 'A', 10, -4), label(B, 'B', -10, -4), label(Cc, 'C', -14, -6), label(D, 'D', -8, 18), label(E, 'E', 8, 18), label(F, 'F', 12, -6), label(Pp, 'P', 9, -5), label(O, 'O', -10, 18));
  files['exam-2022-09.svg'] = svg(310, 260, out.join('\n'));
}

// ---------- 第 10 题：图 1 电路 ----------
{
  const out = [];
  const L = 30, R = 250, T = 50, Bt = 150;
  // 上边：R1（可变电阻，斜箭头）和 R2（滑动变阻器）
  out.push(line(L, T, 55, T), poly([[55, T - 7], [95, T - 7], [95, T + 7], [55, T + 7]], { w: 1.5 }), line(95, T, 125, T));
  out.push(line(60, T + 14, 92, T - 16, { w: 1.2 }), `<polygon points="92,${T - 16} 84,${T - 14} 89,${T - 8}" fill="${C.ink}" stroke="none"/>`);
  out.push(poly([[125, T - 7], [165, T - 7], [165, T + 7], [125, T + 7]], { w: 1.5 }), line(165, T, 190, T));
  out.push(polyline([[190, T], [190, T - 22], [150, T - 22], [150, T - 11]], { w: 1.2 }), `<polygon points="150,${T - 7} 146,${T - 14} 154,${T - 14}" fill="${C.ink}" stroke="none"/>`);
  out.push(line(190, T, R, T), line(R, T, R, 85));
  // 右边：电流表
  out.push(circle(R, 100, 15, { w: 1.5 }), text(R, 105, 'A', { anchor: 'middle', size: 14 }), line(R, 115, R, Bt));
  // 下边：开关 S 和电源
  out.push(line(R, Bt, 150, Bt), dot(150, Bt, C.ink, 2.5), line(150, Bt, 118, Bt - 14, { w: 1.5 }), dot(118, Bt, C.ink, 2.5), line(118, Bt, 72, Bt));
  out.push(line(72, Bt - 12, 72, Bt + 12), line(64, Bt - 6, 64, Bt + 6, { w: 3 }), line(64, Bt, L, Bt), line(L, Bt, L, T));
  out.push(text(70, T + 26, 'R<tspan font-size="10" dy="3" font-style="normal">1</tspan>', I), text(138, T + 26, 'R<tspan font-size="10" dy="3" font-style="normal">2</tspan>', I));
  out.push(text(134, Bt + 20, 'S', { anchor: 'middle' }));
  out.push(text(140, 195, '图 1', { anchor: 'middle', color: C.soft }));
  files['exam-2022-10-a.svg'] = svg(322, 242, `<g transform="scale(1.15)">${out.join('\n')}</g>`);
}

// ---------- 第 10 题：图 2 R1 随 K 变化的图象 ----------
{
  const ox = 50, oy = 245, ux = 6, uy = 2;          // 横轴 1 格 = 2.5，纵轴 1 格 = 5
  const X = k => ox + ux * k, Y = r => oy - uy * r;
  const out = [];
  for (let k = 2.5; k <= 50 + 1e-9; k += 2.5) out.push(line(X(k), Y(0), X(k), Y(100), { color: k % 10 === 0 ? C.soft : C.grid, w: 1 }));
  for (let r = 5; r <= 100 + 1e-9; r += 5) out.push(line(X(0), Y(r), X(50), Y(r), { color: r % 20 === 0 ? C.soft : C.grid, w: 1 }));
  out.push(line(X(0), Y(0), X(58), Y(0), { color: C.axis, w: 1.5 }), line(X(0), Y(0), X(0), Y(112), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(58) + 8)},${oy} ${f(X(58))},${oy - 4} ${f(X(58))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(112) - 8)} ${ox - 4},${f(Y(112))} ${ox + 4},${f(Y(112))}" fill="${C.axis}" stroke="none"/>`);
  for (const k of [10, 20, 30, 40]) out.push(text(X(k), oy + 16, String(k), { anchor: 'middle', size: 12, color: C.soft }));
  for (const r of [20, 40, 60, 80, 100]) out.push(text(ox - 6, Y(r) + 4, String(r), { anchor: 'end', size: 12, color: C.soft }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', size: 12, color: C.soft }));
  out.push(text(ox + 6, Y(112) + 2, 'R<tspan font-size="10" dy="3" font-style="normal">1</tspan><tspan dy="-3" font-style="normal">/Ω</tspan>', I));
  out.push(text(X(58) + 8, oy + 34, 'K<tspan font-style="normal">/×10</tspan><tspan font-size="9" dy="-6" font-style="normal">−3</tspan><tspan dy="6" font-style="normal">mg/100mL</tspan>', { ...I, size: 12, anchor: 'end' }));
  // 按原图读出的点 (0,100)(10,60)(20,41)(30,29)(40,20)(48,15) 拟合成一条光滑曲线
  const R1 = k => 100 / (1 + 0.02303 * k) ** 2.4645;
  const dense = [];
  for (let k = 0; k <= 48 + 1e-9; k += 0.5) dense.push([X(k), Y(R1(k))]);
  out.push(polyline(dense, { w: 2 }));
  out.push(text(X(25), oy + 52, '图 2', { anchor: 'middle', color: C.soft }));
  files['exam-2022-10-b.svg'] = svg(440, 310, out.join('\n'));
}

// ---------- 第 10 题：图 3 信息窗 ----------
{
  const out = [poly([[10, 10], [350, 10], [350, 190], [10, 190]], { w: 1.5 })];
  out.push(text(180, 40, '信息窗', { anchor: 'middle', size: 17 }));
  const rows = [
    'M = 2200 × K × 10<tspan font-size="9" dy="-6">−3</tspan><tspan dy="6"> mg/100mL</tspan>',
    '（M 为血液酒精浓度，K 为呼气酒精浓度）',
    '非酒驾（M &lt; 20 mg/100mL）',
    '酒驾（20 mg/100mL ≤ M ≤ 80 mg/100mL）',
    '醉驾（M &gt; 80 mg/100mL）',
  ];
  rows.forEach((s, i) => out.push(text(24, 72 + i * 26, s, { size: 13 })));
  out.push(text(180, 215, '图 3', { anchor: 'middle', color: C.soft }));
  files['exam-2022-10-c.svg'] = svg(360, 225, out.join('\n'));
}

// ---------- 第 14 题：扇形 AOB 沿 OB 方向平移 ----------
{
  const u = 80, O = [40, 190];
  const P = (x, y) => [O[0] + u * x, O[1] - u * y];
  const A = P(0, 2), B = P(2, 0), O2 = P(1, 0), A2 = P(1, 2), B2 = P(3, 0), G = P(1, Math.sqrt(3));
  const R = 2 * u;
  const shade = `<path d="M ${f(A2[0])} ${f(A2[1])} A ${R} ${R} 0 0 1 ${f(B2[0])} ${f(B2[1])} L ${f(B[0])} ${f(B[1])} A ${R} ${R} 0 0 0 ${f(G[0])} ${f(G[1])} Z" fill="${C.soft}" stroke="none"/>`;
  const out = [shade];
  out.push(seg(O, A), seg(O, B2), seg(O2, A2));
  out.push(`<path d="M ${f(A[0])} ${f(A[1])} A ${R} ${R} 0 0 1 ${f(B[0])} ${f(B[1])}" stroke="${C.ink}" stroke-width="2"/>`);
  out.push(`<path d="M ${f(A2[0])} ${f(A2[1])} A ${R} ${R} 0 0 1 ${f(B2[0])} ${f(B2[1])}" stroke="${C.ink}" stroke-width="2"/>`);
  out.push(rightAngle(O, A, B, { size: 10 }));
  out.push(label(A, 'A', -10, 0), label(A2, 'A′', 4, -8), label(O, 'O', -8, 18), label(O2, 'O′', 0, 20), label(B, 'B', 0, 20), label(B2, 'B′', 4, 20));
  files['exam-2022-14.svg'] = svg(320, 215, out.join('\n'));
}

// ---------- 第 15 题：Rt△ABC，D 是 AB 的中点 ----------
{
  const u = 75, Cc = [50, 240];
  const P = (x, y) => [Cc[0] + u * x, Cc[1] - u * y];
  const s = 2 * Math.sqrt(2), t = 1 / Math.sqrt(2);
  const A = P(0, s), B = P(s, 0), D = P(s / 2, s / 2), Pp = P(0, 1), Q = P(t, t);
  const out = [poly([A, B, Cc]), seg(A, Q), seg(D, Q)];
  out.push(rightAngle(Cc, A, B, { size: 10 }), dot(...Pp, C.ink, 3));
  out.push(label(A, 'A', -10, 0), label(B, 'B', 10, 14), label(Cc, 'C', -10, 14), label(D, 'D', 10, -4), label(Pp, 'P', -12, 5), label(Q, 'Q', 12, 10));
  files['exam-2022-15.svg'] = svg(310, 265, out.join('\n'));
}

// ---------- 第 18 题：反比例函数图象上的点 A、B，AC 平分∠OAB ----------
{
  const u = 36, o = [50, 250];
  const P = (x, y) => [o[0] + u * x, o[1] - u * y];
  const A = P(2, 4), B = P(4, 2), O = P(0, 0);
  // C 在 x 轴上，AC 平分∠OAB
  const unit = (p, q) => { const d = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(...d); return d.map(v => v / l); };
  const a = unit([2, 4], [0, 0]), b = unit([2, 4], [4, 2]), dv = [a[0] + b[0], a[1] + b[1]];
  const xc = 2 - 4 / dv[1] * dv[0];
  const Cc = P(xc, 0);
  const curve = [];
  for (let x = 1.4; x <= 7.2; x += 0.05) curve.push(P(x, 8 / x));
  const out = [bareAxes(o, 30, 320, 270, 20), polyline(curve), seg(O, A), seg(A, B), seg(A, Cc)];
  out.push(label(A, 'A', 6, -8), label(B, 'B', 6, 20), label(Cc, 'C', 0, 20));
  files['exam-2022-18.svg'] = svg(340, 285, out.join('\n'));
}

// ---------- 第 19 题：测量拂云阁 DC 的高度 ----------
{
  const H = [40, 225], D = [40, 25], g = 237;          // H 是 D 的正下方与测角仪顶端同高的点，g 是地面
  const F = [H[0] + (H[1] - D[1]), H[1]], E = [H[0] + (H[1] - D[1]) / Math.tan(34 * Math.PI / 180), H[1]];
  const Cc = [40, g], B = [F[0], g], A = [E[0], g];
  const out = [seg(D, Cc), seg(Cc, A), seg(F, B, { w: 1.5 }), seg(E, A, { w: 1.5 }), seg(D, F), seg(D, E)];
  out.push(line(F[0] - 75, H[1], E[0], H[1], { dash, w: 1.2 }));
  out.push(rightAngle(Cc, D, A, { size: 10 }));
  out.push(angleMark(F, [F[0] - 50, H[1]], D, { r: 16, color: C.ink, w: 1.2 }), angleMark(E, [E[0] - 50, H[1]], D, { r: 16, color: C.ink, w: 1.2 }));
  out.push(text(F[0] - 22, H[1] - 6, '45°', { anchor: 'end', size: 13 }), text(E[0] - 22, H[1] - 6, '34°', { anchor: 'end', size: 13 }));
  out.push(label(D, 'D', -10, 0), label(Cc, 'C', -10, 16), label(B, 'B', 0, 18), label(A, 'A', 0, 18), label(F, 'F', 10, -4), label(E, 'E', 10, -4));
  files['exam-2022-19.svg'] = svg(E[0] + 30, 262, out.join('\n'));
}

// ---------- 第 21 题：喷水的抛物线 ----------
{
  const ux = 30, uy = 45, o = [40, 180];
  const P = (x, y) => [o[0] + ux * x, o[1] - uy * y];
  const fn = x => -0.1 * (x - 5) ** 2 + 3.2;
  const root = 5 + Math.sqrt(32);
  const curve = [];
  for (let x = 0; x <= root + 1e-9; x += 0.05) curve.push(P(x, fn(x)));
  curve.push(P(root, 0));
  const out = [bareAxes(o, 25, 390, 195, 12), polyline(curve)];
  out.push(line(o[0], P(0, 3.2)[1], P(5, 3.2)[0], P(5, 3.2)[1], { dash, w: 1.2 }), line(P(5, 0)[0], o[1], P(5, 3.2)[0], P(5, 3.2)[1], { dash, w: 1.2 }));
  out.push(text(o[0] - 6, P(0, 3.2)[1] + 5, '3.2', { anchor: 'end', size: 13 }), text(P(5, 0)[0], o[1] + 17, '5', { anchor: 'middle', size: 13 }));
  out.push(dot(...P(0, 0.7), C.ink, 3), label(P(0, 0.7), 'P', -12, 5));
  files['exam-2022-21.svg'] = svg(420, 205, out.join('\n'));
}

// ---------- 第 22 题：滚铁环 ----------
{
  const r = 75, O = [110, 110], g = O[1] + r;           // 1 cm = 3 像素
  const Cc = [O[0], g];
  const B = [O[0] + 0.6 * r, O[1] + 0.8 * r];              // ∠BOC 的余弦是 4/5
  const A = [B[0] + 225 * 0.8, B[1] - 225 * 0.6];          // AB = 75 cm，AB ⊥ OB
  const D = [A[0], g];
  const out = [circle(O[0], O[1], r), line(20, g, D[0] + 30, g), seg(B, A)];
  out.push(seg(O, Cc, { dash, w: 1.5 }), seg(O, B, { dash, w: 1.5 }), seg(A, D, { dash, w: 1.5 }));
  out.push(dot(...O, C.ink, 3));
  out.push(label(O, 'O', -10, -6), label(Cc, 'C', 0, 20), label(B, 'B', 2, -10), label(A, 'A', 10, -4), label(D, 'D', 0, 20));
  files['exam-2022-22.svg'] = svg(D[0] + 40, g + 30, out.join('\n'));
}

// ---------- 第 23 题：矩形、正方形的折叠 ----------
// 图 1：矩形，M 在 EF 上
{
  const h = 120, w = 240, B = [40, 150];
  const A = [B[0], B[1] - h], Cc = [B[0] + w, B[1]], D = [B[0] + w, B[1] - h];
  const E = [B[0], B[1] - h / 2], F = [B[0] + w, B[1] - h / 2];
  const M = [B[0] + Math.sqrt(h * h - (h / 2) ** 2), E[1]], P = [B[0] + h * Math.tan(Math.PI / 6), A[1]];
  const out = [poly([A, B, Cc, D]), seg(E, F, { dash, w: 1.5 }), seg(B, P, { dash, w: 1.5 }), seg(P, M), seg(B, M)];
  out.push(label(A, 'A', -10, 0), label(B, 'B', -10, 14), label(Cc, 'C', 10, 14), label(D, 'D', 10, 0), label(E, 'E', -10, 5), label(F, 'F', 10, 5), label(P, 'P', 0, -7), label(M, 'M', 4, -8));
  out.push(text(B[0] + w / 2, 190, '图 1', { anchor: 'middle', color: C.soft }));
  files['exam-2022-23-a.svg'] = svg(320, 200, out.join('\n'));
}
// 图 2、图 3：正方形，延长 PM 交 CD 于 Q
function squareFold(angleABM, name, caption) {
  const s = 200, B = [60, 230];
  const A = [B[0], B[1] - s], Cc = [B[0] + s, B[1]], D = [B[0] + s, B[1] - s];
  const E = [B[0], B[1] - s / 2], F = [B[0] + s, B[1] - s / 2];
  const t = angleABM * Math.PI / 180;
  const M = [B[0] + s * Math.sin(t), B[1] - s * Math.cos(t)];
  const P = [B[0] + s * Math.tan(t / 2), A[1]];
  const Q = [Cc[0], B[1] - s * Math.tan((Math.PI / 2 - t) / 2)];
  const out = [poly([A, B, Cc, D]), seg(E, F, { dash, w: 1.5 }), seg(B, P, { dash, w: 1.5 }), seg(P, Q), seg(B, M), seg(B, Q)];
  out.push(label(A, 'A', -10, 0), label(B, 'B', -10, 14), label(Cc, 'C', 10, 14), label(D, 'D', 10, 0), label(E, 'E', -10, 5), label(F, 'F', 11, 5), label(P, 'P', 2, -7), label(M, 'M', -10, -8), label(Q, 'Q', 11, 8));
  out.push(text(B[0] + s / 2, 270, caption, { anchor: 'middle', color: C.soft }));
  files[name] = svg(320, 280, out.join('\n'));
}
squareFold(60, 'exam-2022-23-b.svg', '图 2');
squareFold(2 * Math.atan(110 / 150) * 180 / Math.PI, 'exam-2022-23-c.svg', '图 3');

export default files;
