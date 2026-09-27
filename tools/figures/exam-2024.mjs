// 附录“2024 年河南中考数学”的图，按原卷重画。
import { C, f, svg, text, line, seg, dot, poly, polyline, circle, arc, label, rightAngle, angleMark, axes, plot } from './lib.mjs';

const files = {};
const I = { italic: true };
const dash = '6 4';
const gray = '#d0d4d9';
const arrowHead = (p, deg, color = C.ink, s = 8) => {
  const r = (deg * Math.PI) / 180, u = [Math.cos(r), -Math.sin(r)], n = [-u[1], u[0]];
  const b = [p[0] - s * u[0], p[1] - s * u[1]];
  return `<polygon points="${[p, [b[0] + (s / 2) * n[0], b[1] + (s / 2) * n[1]], [b[0] - (s / 2) * n[0], b[1] - (s / 2) * n[1]]].map(q => q.map(f).join(',')).join(' ')}" fill="${color}" stroke="none"/>`;
};
const inter = (p1, p2, p3, p4) => {          // 直线 p1p2 与直线 p3p4 的交点
  const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [p4[0] - p3[0], p4[1] - p3[1]];
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((p3[0] - p1[0]) * d2[1] - (p3[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// ---------- 第 1 题：数轴 ----------
{
  const X = x => 130 + 60 * x, y = 50;
  const out = [line(X(-1.8), y, X(2.6), y, { w: 1.5 }), arrowHead([X(2.6) + 8, y], 0)];
  for (const x of [-1, 0, 1, 2]) {
    out.push(dot(X(x), y, C.ink, 3.5));
    out.push(text(X(x), y + 22, x < 0 ? '−' + -x : String(x), { anchor: 'middle' }));
  }
  out.push(text(X(-1), y - 12, 'P', { ...I, anchor: 'middle' }));
  files['exam-2024-01.svg'] = svg(340, 85, out.join('\n'));
}

// ---------- 第 3 题：方向角 ----------
{
  const J = [90, 190], Y = [240, 70];           // 甲、乙
  const out = [];
  out.push(line(J[0], J[1], J[0], 40, { w: 1.5, dash: '5 4' }), arrowHead([J[0], 32], 90));
  out.push(line(Y[0], 150, Y[0], 20, { w: 1.5, dash: '5 4' }), arrowHead([Y[0], 12], 90));
  out.push(seg(J, Y));
  out.push(angleMark(J, [J[0], 40], Y, { r: 22, color: C.ink }));
  out.push(angleMark(Y, J, [Y[0], 150], { r: 18, color: C.ink }));
  out.push(text(J[0], 24, '北', { anchor: 'middle' }), text(Y[0] + 18, 20, '北', { anchor: 'middle' }));
  out.push(text(J[0], J[1] + 22, '甲', { anchor: 'middle' }), text(Y[0] + 10, Y[1] + 4, '乙'));
  out.push(text(J[0] + 6, J[1] - 30, '50°', { size: 13 }), text(Y[0] - 16, Y[1] + 34, '1', { size: 13 }));
  files['exam-2024-03.svg'] = svg(320, 220, out.join('\n'));
}

// ---------- 第 4 题：包装盒（正六棱柱）和四个选项 ----------
{
  // 正六棱柱，正面对着读者，从下方箭头方向看
  const cx = 160, top = 40, h = 110, R = 70, k = 0.28;   // k：俯视压缩
  const P = a => [cx + R * Math.cos((a * Math.PI) / 180), R * k * Math.sin((a * Math.PI) / 180)];
  const angs = [0, 60, 120, 180, 240, 300];
  const T = angs.map(a => { const p = P(a); return [p[0], top + p[1]]; });
  const B = angs.map(a => { const p = P(a); return [p[0], top + h + p[1]]; });
  const out = [poly(T, { w: 1.8 })];
  // 看得见的竖棱：0°、60°、120°、180°（下方三块侧面）
  for (const i of [0, 1, 2, 3]) out.push(seg(T[i], B[i], { w: 1.8 }));
  out.push(polyline([B[0], B[1], B[2], B[3]], { w: 1.8 }));
  out.push(line(cx, top + h + R * k + 50, cx, top + h + R * k + 14, { w: 1.5 }), arrowHead([cx, top + h + R * k + 8], 90));
  files['exam-2024-04-a.svg'] = svg(320, 250, out.join('\n'));
}
{
  const out = [];
  const w = 100, hh = 80, y0 = 20, gap = 30;
  const xs = [20, 20 + w + gap, 20 + 2 * (w + gap), 20 + 3 * (w + gap)];
  const rect = x => poly([[x, y0], [x + w, y0], [x + w, y0 + hh], [x, y0 + hh]], { w: 1.5 });
  out.push(rect(xs[0]), line(xs[0] + 25, y0, xs[0] + 25, y0 + hh, { w: 1.5 }), line(xs[0] + 75, y0, xs[0] + 75, y0 + hh, { w: 1.5 }));
  out.push(rect(xs[1]), line(xs[1] + 50, y0, xs[1] + 50, y0 + hh, { w: 1.5 }));
  out.push(rect(xs[2]));
  const hc = [xs[3] + w / 2, y0 + hh / 2], hr = 46;
  out.push(poly([0, 60, 120, 180, 240, 300].map(a => [hc[0] + hr * Math.cos((a * Math.PI) / 180), hc[1] + hr * Math.sin((a * Math.PI) / 180)]), { w: 1.5 }));
  ['A', 'B', 'C', 'D'].forEach((s, i) => out.push(text(xs[i] + w / 2, y0 + hh + 30, s, { anchor: 'middle' })));
  files['exam-2024-04-b.svg'] = svg(540, 135, out.join('\n'));
}

// ---------- 第 6 题：平行四边形 ABCD ----------
{
  const A = [90, 30], D = [350, 30], B = [20, 170], Cc = [280, 170];
  const O = mid(A, Cc), E = mid(O, Cc);
  const F = inter(E, [E[0] + (B[0] - A[0]), E[1] + (B[1] - A[1])], B, Cc);
  const out = [poly([A, D, Cc, B]), seg(A, Cc), seg(B, D), seg(E, F)];
  out.push(label(A, 'A', -4, -8), label(D, 'D', 10, -4), label(B, 'B', -10, 12), label(Cc, 'C', 8, 18));
  out.push(label(O, 'O', 0, -10), label(E, 'E', 12, -4), label(F, 'F', -2, 20));
  files['exam-2024-06.svg'] = svg(380, 200, out.join('\n'));
}

// ---------- 第 8 题：三张豫剧卡片 ----------
{
  const out = [];
  const names = ['豫剧·花木兰', '豫剧·七品芝麻官', '豫剧·朝阳沟'];
  names.forEach((s, i) => {
    const x = 20 + i * 130, y = 15, w = 110, h = 150;
    out.push(poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { w: 1.5 }));
    out.push(poly([[x + 6, y + 6], [x + w - 6, y + 6], [x + w - 6, y + h - 6], [x + 6, y + h - 6]], { w: 1, color: C.soft }));
    [...s].forEach((ch, k) => out.push(text(x + 20, y + 26 + k * 16, ch, { anchor: 'middle', size: 12 })));
  });
  files['exam-2024-08.svg'] = svg(410, 180, out.join('\n'));
}

// ---------- 第 9 题：⊙O 与等边三角形 ABC ----------
{
  const O = [160, 120], R = 90;
  const pt = a => [O[0] + R * Math.cos((a * Math.PI) / 180), O[1] - R * Math.sin((a * Math.PI) / 180)];
  const A = pt(90), B = pt(210), Cc = pt(330), D = pt(270);
  const shade = `<path d="M ${f(D[0])} ${f(D[1])} L ${f(B[0])} ${f(B[1])} A ${R} ${R} 0 0 1 ${f(Cc[0])} ${f(Cc[1])} Z" fill="${gray}" stroke="none"/>`;
  const out = [shade, circle(O[0], O[1], R), poly([A, B, Cc]), seg(B, D), seg(D, Cc)];
  out.push(arc(D, R, 30, 150, { w: 2 }));
  out.push(dot(...O, C.ink, 2.5));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -14, 6), label(Cc, 'C', 14, 6), label(D, 'D', 0, 20), label(O, 'O', 0, -10));
  files['exam-2024-09.svg'] = svg(320, 240, out.join('\n'));
}

// ---------- 第 10 题：图 1 电流与总功率，图 2 热量与电流 ----------
{
  const ox = 40, oy = 150;
  const out = [line(ox, oy, 260, oy, { color: C.axis, w: 1.5 }), arrowHead([268, oy], 0, C.axis), line(ox, oy, ox, 20, { color: C.axis, w: 1.5 }), arrowHead([ox, 12], 90, C.axis)];
  const Px = ox + 140, Iy = oy - 60;
  out.push(line(ox, oy, 250, oy - 60 * (210 / 140)));
  out.push(line(ox, Iy, Px, Iy, { w: 1.2, dash: '4 3' }), line(Px, Iy, Px, oy, { w: 1.2, dash: '4 3' }));
  out.push(text(ox - 8, Iy + 5, '2', { anchor: 'end' }), text(Px, oy + 20, '440', { anchor: 'middle' }), text(ox - 8, oy + 18, 'O', { ...I, anchor: 'end' }));
  out.push(text(272, oy + 20, '<tspan font-style="italic">P</tspan>/W'), text(ox + 6, 16, '<tspan font-style="italic">I</tspan>/A'));
  files['exam-2024-10-a.svg'] = svg(320, 180, out.join('\n'));
}
{
  const ox = 40, oy = 150;
  const out = [line(ox, oy, 230, oy, { color: C.axis, w: 1.5 }), arrowHead([238, oy], 0, C.axis), line(ox, oy, ox, 20, { color: C.axis, w: 1.5 }), arrowHead([ox, 12], 90, C.axis)];
  const pts = [];
  for (let k = 0; k <= 60; k++) { const x = k / 60 * 150; pts.push([ox + x, oy - (x * x) / 180]); }
  out.push(polyline(pts));
  out.push(text(ox - 8, oy + 18, 'O', { ...I, anchor: 'end' }), text(236, oy + 22, '<tspan font-style="italic">I</tspan>/A'), text(ox + 6, 16, '<tspan font-style="italic">Q</tspan>/J'));
  files['exam-2024-10-b.svg'] = svg(320, 180, out.join('\n'));
}

// ---------- 第 12 题：宣传板报得分情况 ----------
{
  const ox = 60, oy = 190, u = 8, bw = 26;
  const X = s => ox + 50 + (s - 7) * 50;
  const out = [text(170, 20, '宣传板报得分情况', { anchor: 'middle' }), text(170, 40, '（满分10分）', { anchor: 'middle', size: 13 })];
  for (const v of [5, 10, 15]) {
    out.push(line(ox, oy - v * u, X(10) + 40, oy - v * u, { color: C.soft, w: 1, dash: '4 3' }));
    out.push(text(ox - 8, oy - v * u + 5, String(v), { anchor: 'end' }));
  }
  out.push(line(X(10) + 40, oy - 15 * u, X(10) + 40, oy, { color: C.soft, w: 1, dash: '4 3' }));
  [[7, 3], [8, 6], [9, 13], [10, 9]].forEach(([s, n]) => {
    out.push(poly([[X(s) - bw / 2, oy], [X(s) - bw / 2, oy - n * u], [X(s) + bw / 2, oy - n * u], [X(s) + bw / 2, oy]], { fill: gray, w: 1.5 }));
    out.push(text(X(s), oy + 20, String(s), { anchor: 'middle' }));
  });
  out.push(line(ox, oy, ox, 52, { w: 1.5 }), arrowHead([ox, 46], 90));
  out.push(polyline([[ox, oy], [ox + 6, oy - 6], [ox + 12, oy + 6], [ox + 18, oy]], { w: 1.5 }), line(ox + 18, oy, X(10) + 70, oy, { w: 1.5 }), arrowHead([X(10) + 78, oy], 0));
  out.push(text(ox - 8, oy + 5, '0', { anchor: 'end' }), text(ox - 10, 52, '班数', { anchor: 'end' }), text(X(10) + 60, oy + 20, '分数/分'));
  files['exam-2024-12.svg'] = svg(380, 215, out.join('\n'));
}

// ---------- 第 14 题：正方形 ABCD 折叠 ----------
{
  const u = 17, ox = 100, oy = 200;
  const X = x => ox + u * x, Y = y => oy - u * y;
  const P = (x, y) => [X(x), Y(y)];
  const A = P(-2, 0), B = P(8, 0), Cc = P(8, 10), D = P(-2, 10), E = P(3, 10), F = P(0, 6);
  const out = [line(X(-3), oy, X(10), oy, { color: C.axis, w: 1.5 }), arrowHead([X(10) + 8, oy], 0, C.axis)];
  out.push(line(ox, Y(-0.6), ox, Y(11.2), { color: C.axis, w: 1.5 }), arrowHead([ox, Y(11.2) - 8], 90, C.axis));
  out.push(seg(A, D), seg(D, E), seg(B, E), seg(E, F), seg(F, B));
  out.push(seg(E, Cc, { w: 1.5, dash: '5 4' }), seg(Cc, B, { w: 1.5, dash: '5 4' }));
  out.push(text(X(10) + 6, oy + 18, 'x', I), text(ox + 8, Y(11.2) - 4, 'y', I));
  out.push(label(A, 'A', -8, 18), label(P(0, 0), 'O', 10, 18), label(B, 'B', 4, 18), label(Cc, 'C', 10, -4), label(D, 'D', -10, -4), label(E, 'E', 0, -8), label(F, 'F', -10, 4));
  files['exam-2024-14.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 第 15 题：CD 绕点 C 旋转，BE ⊥ AD ----------
{
  const s = 60, A = [30, 190], B = [30 + 3 * Math.SQRT2 * s, 190];
  const Cc = [(A[0] + B[0]) / 2, 190 - 1.5 * Math.SQRT2 * s];
  const D = [Cc[0] + 0.12 * s, Cc[1] + 0.99 * s];
  const u = [D[0] - A[0], D[1] - A[1]], L = Math.hypot(...u), e = [u[0] / L, u[1] / L];
  const t = (B[0] - A[0]) * e[0] + (B[1] - A[1]) * e[1];
  const E = [A[0] + t * e[0], A[1] + t * e[1]];
  const out = [poly([A, B, Cc]), seg(Cc, D), seg(A, E), seg(B, E)];
  out.push(rightAngle(Cc, A, B), rightAngle(E, A, B));
  out.push(label(A, 'A', -10, 12), label(B, 'B', 10, 12), label(Cc, 'C', 0, -8), label(D, 'D', 2, 20), label(E, 'E', 6, -8));
  files['exam-2024-15.svg'] = svg(330, 215, out.join('\n'));
}

// ---------- 第 17 题：比赛得分统计图 ----------
{
  const ox = 60, oy = 290, u = 5.4, dx = 50;
  const X = i => ox + dx * (i + 1), Y = v => oy - u * v;
  const jia = [24, 28, 24, 28, 28, 27], yi = [20, 14, 28, 30, 32, 32];
  const out = [text(200, 20, '比赛得分统计图', { anchor: 'middle' })];
  for (let v = 5; v <= 35; v += 5) {
    out.push(line(ox, Y(v), X(6) + 40, Y(v), { color: C.soft, w: 1, dash: '4 3' }));
    out.push(text(ox - 8, Y(v) + 5, String(v), { anchor: 'end', size: 13 }));
  }
  out.push(line(X(6) + 40, Y(35), X(6) + 40, oy, { color: C.soft, w: 1, dash: '4 3' }));
  out.push(line(ox, oy, X(6) + 70, oy, { w: 1.5 }), arrowHead([X(6) + 78, oy], 0), line(ox, oy, ox, Y(38), { w: 1.5 }), arrowHead([ox, Y(38) - 6], 90));
  out.push(text(ox - 8, oy + 5, '0', { anchor: 'end', size: 13 }), text(ox - 6, Y(38) - 4, '得分', { anchor: 'end' }), text(X(6) + 40, oy + 22, '场次', { anchor: 'middle' }));
  ['一', '二', '三', '四', '五', '六'].forEach((s, i) => out.push(text(X(i), oy + 22, s, { anchor: 'middle' })));
  out.push(polyline(jia.map((v, i) => [X(i), Y(v)]), { w: 1.5, dash: '5 4' }));
  out.push(polyline(yi.map((v, i) => [X(i), Y(v)]), { w: 2 }));
  const tri = (p, r = 6) => `<polygon points="${[[p[0], p[1] - r], [p[0] - r * 0.87, p[1] + r * 0.5], [p[0] + r * 0.87, p[1] + r * 0.5]].map(q => q.map(f).join(',')).join(' ')}" fill="${C.ink}" stroke="none"/>`;
  jia.forEach((v, i) => out.push(dot(X(i), Y(v), C.ink, 4)));
  yi.forEach((v, i) => out.push(tri([X(i), Y(v)])));
  // 数据标注：甲
  const jOff = [-12, -12, 22, 22, 22, 22];
  jia.forEach((v, i) => out.push(text(X(i), Y(v) + jOff[i], String(v), { anchor: 'middle', size: 13 })));
  const yOff = [22, 22, -12, -12, -12, -12];
  yi.forEach((v, i) => out.push(text(X(i), Y(v) + yOff[i], String(v), { anchor: 'middle', size: 13 })));
  // 图例
  out.push(text(150, 44, '甲', { anchor: 'middle' }), line(120, 56, 180, 56, { w: 1.5, dash: '5 4' }), dot(150, 56, C.ink, 4));
  out.push(text(280, 44, '乙', { anchor: 'middle' }), line(250, 56, 310, 56, { w: 2 }), tri([280, 56]));
  files['exam-2024-17.svg'] = svg(460, 320, out.join('\n'));
}

// ---------- 第 18 题：网格中的矩形 ABCD ----------
function grid18(withCurve) {
  const u = 30, ox = 40, oy = 250;
  const X = x => ox + u * x, Y = y => oy - u * y;
  const out = [];
  for (let x = 1; x <= 10; x++) out.push(line(X(x), Y(0), X(x), Y(7), { color: C.soft, w: 1, dash: '3 3' }));
  for (let y = 1; y <= 7; y++) out.push(line(X(0), Y(y), X(10), Y(y), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(ox, oy, X(10.8), oy, { w: 1.5 }), arrowHead([X(10.8) + 8, oy], 0), line(ox, oy, ox, Y(7.7), { w: 1.5 }), arrowHead([ox, Y(7.7) - 8], 90));
  for (let x = 1; x <= 10; x++) out.push(text(X(x), oy + 20, String(x), { anchor: 'middle', size: 13 }));
  for (let y = 1; y <= 7; y++) out.push(text(ox - 8, Y(y) + 5, String(y), { anchor: 'end', size: 13 }));
  out.push(text(ox - 8, oy + 20, 'O', { ...I, anchor: 'end' }), text(X(10.8) + 8, oy + 20, 'x', I), text(ox - 16, Y(7.7), 'y', I));
  const A = [X(3), Y(2)], B = [X(9), Y(2)], Cc = [X(9), Y(6)], D = [X(3), Y(6)], E = [X(6), Y(4)];
  out.push(poly([A, B, Cc, D]), seg(A, Cc), seg(B, D));
  if (withCurve) {
    out.push(plot(x => 6 / x, 0.88, 10.3, X, Y, { color: C.emph }));
    for (const [x, y] of [[1, 6], [2, 3], [6, 1]]) out.push(dot(X(x), Y(y), C.emph, 4));
    out.push(dot(...A, C.emph, 4));
  }
  out.push(label(A, 'A', -10, 18), label(B, 'B', 10, 18), label(Cc, 'C', 10, -6), label(D, 'D', -10, -6), label(E, 'E', 14, -6));
  return svg(400, 280, out.join('\n'));
}
files['exam-2024-18-a.svg'] = grid18(false);
files['exam-2024-18-b.svg'] = grid18(true);

// ---------- 第 19 题：Rt△ABC，CD 为斜边中线，BE ∥ DC ----------
function fig19(withConstruction) {
  const s = 30, g = 325, A = [30, g], B = [30 + 10 * s, g], D = mid(A, B);
  const th = (105 * Math.PI) / 180, Cc = [D[0] + 5 * s * Math.cos(th), g - 5 * s * Math.sin(th)];
  const E = inter(A, Cc, B, [B[0] + (Cc[0] - D[0]), B[1] + (Cc[1] - D[1])]);
  const out = [seg(A, B), seg(A, E), seg(B, E), seg(Cc, D), seg(Cc, B)];
  out.push(rightAngle(Cc, A, B));
  if (withConstruction) {
    const F = inter(Cc, [Cc[0] + 1, Cc[1]], B, E), M = [F[0] + 55, Cc[1]];
    const r = 45, angA = Math.atan2(A[1] - Cc[1], Cc[0] - A[0]) * 180 / Math.PI;   // ∠A 的度数
    out.push(seg(Cc, M, { color: C.emph }));
    out.push(arc(A, r, -8, angA + 12, { color: C.soft }));
    out.push(arc(Cc, r, -12, angA + 12, { color: C.soft }));
    const P1 = [Cc[0] + r * Math.cos(angA * Math.PI / 180), Cc[1] - r * Math.sin(angA * Math.PI / 180)];
    const chord = 2 * r * Math.sin((angA * Math.PI) / 360);
    out.push(arc(P1, chord, angA / 2 - 90 - 14, angA / 2 - 90 + 14, { color: C.soft }));   // 以 CE 上的交点为圆心、弦长为半径，交出 CM 上的点
    out.push(label(F, 'F', 10, -8), label(M, 'M', 6, -8));
  }
  out.push(label(A, 'A', -10, 18), label(B, 'B', 10, 18), label(D, 'D', 0, 20), label(Cc, 'C', -12, -4), label(E, 'E', 10, -4));
  return svg(380, 355, out.join('\n'));
}
files['exam-2024-19-a.svg'] = fig19(false);
files['exam-2024-19-b.svg'] = fig19(true);

// ---------- 第 20 题：塑像与视角 ----------
{
  // 图 1
  const g = 200, eye = 175, D = [30, eye];
  const px0 = 250, px1 = 330, ptop = 120;           // 底座
  const B = [(px0 + px1) / 2, ptop], A = [B[0], 30], Cc = [B[0], g], E = [px1 + 10, eye];
  const out = [line(20, g, 360, g, { w: 1.5 })];
  out.push(poly([[px0, ptop], [px1, ptop], [px1, g], [px0, g]], { fill: gray, w: 1.5 }));
  out.push(poly([[B[0] - 9, ptop], [B[0] + 9, ptop], [B[0] + 7, 45], [B[0] - 7, 45]], { fill: gray, w: 1.5 }), circle(B[0], 38, 8, { fill: gray, w: 1.5 }));
  out.push(seg(D, A, { w: 1.5, dash: '5 4' }), seg(D, B, { w: 1.5, dash: '5 4' }), seg(D, E, { w: 1.5, dash: '5 4' }));
  out.push(dot(...D, C.ink, 3.5), dot(...A, C.ink, 3.5), dot(...B, C.ink, 3.5), dot(...Cc, C.ink, 3.5));
  const dA = Math.atan2(D[1] - A[1], A[0] - D[0]) * 180 / Math.PI, dB = Math.atan2(D[1] - B[1], B[0] - D[0]) * 180 / Math.PI;
  out.push(arc(D, 90, dB, dA, { w: 1.2 }));
  out.push(text(D[0] + 96, D[1] - 50, '视角', { size: 13 }));
  out.push(label(A, 'A', -12, 0), label(B, 'B', 20, -2), label(Cc, 'C', 0, 20), label(D, 'D', -12, 8), label(E, 'E', 10, 5));
  files['exam-2024-20-a.svg'] = svg(380, 225, out.join('\n'));
}
function fig20b(withM) {
  const u = 16, px = 170, ey = 230;                   // P 的像素位置，水平视线 DE 的高度
  const X = x => px + u * x, Y = y => ey - u * y;
  const r3 = Math.sqrt(3);
  const P = [X(0), Y(0)], H = [X(6), Y(0)], A = [X(6), Y(6 * r3)], B = [X(6), Y(2 * r3)];
  const O = [X(0), Y(4 * r3)], R = 4 * r3 * u;
  const D = [X(-8.6), Y(0)], E = [X(9.4), Y(0)], Cc = [X(6), Y(-1.8)];
  const out = [circle(O[0], O[1], R)];
  out.push(line(X(-9.4), Y(0), X(9.4), Y(0), { w: 1.5, dash: '5 4' }), line(X(-9.4), Cc[1], X(9.4), Cc[1], { w: 1.5 }));
  out.push(seg(A, Cc), seg(P, A), seg(P, B));
  out.push(seg(D, A, { w: 1.5, dash: '5 4' }), seg(D, B, { w: 1.5, dash: '5 4' }));
  if (withM) {
    // DA 与圆的另一个交点 M（靠近 D 的那个）
    const d = [A[0] - D[0], A[1] - D[1]], fq = [D[0] - O[0], D[1] - O[1]];
    const a = d[0] ** 2 + d[1] ** 2, b = 2 * (d[0] * fq[0] + d[1] * fq[1]), c = fq[0] ** 2 + fq[1] ** 2 - R * R;
    const t = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a), M = [D[0] + t * d[0], D[1] + t * d[1]];
    out.push(seg(M, B, { w: 1.5, dash: '5 4', color: C.emph }));
    out.push(label(M, 'M', -12, -2));
  }
  out.push(label(A, 'A', 12, -2), label(B, 'B', 12, 0), label(H, 'H', 12, -6), label(Cc, 'C', 0, 20), label(P, 'P', 0, 20), label(D, 'D', -4, 20), label(E, 'E', 10, 5));
  return svg(340, 280, out.join('\n'));
}
files['exam-2024-20-b.svg'] = fig20b(false);
files['exam-2024-20-c.svg'] = fig20b(true);

// ---------- 第 23 题 ----------
{
  // 图 1：四个用三角板拼成的四边形。每个图的坐标以左下角为原点，向上为正
  const sc = 0.9, out = [];
  const draw = (ox, quad, diag, rights, name) => {
    const cxw = Math.max(...quad.map(q => q[0]));
    const T = p => [ox + p[0] * sc, 160 - p[1] * sc];
    out.push(poly(quad.map(T)), seg(T(diag[0]), T(diag[1])));
    for (const [v, a, b] of rights) out.push(rightAngle(T(v), T(a), T(b)));
    out.push(text(ox + cxw * sc / 2, 195, name, { anchor: 'middle' }));
  };
  const L = 100, a = 70, r3 = Math.sqrt(3);
  // ①：两个等腰直角三角形拼成平行四边形
  draw(20, [[0, L], [L, L], [2 * L, 0], [L, 0]], [[L, L], [L, 0]], [[[L, L], [0, L], [L, 0]], [[L, 0], [L, L], [2 * L, 0]]], '①');
  // ②：两个含 30° 角的直角三角形，斜边重合
  const ap = [a * r3 / 2, 1.5 * a];
  draw(260, [[0, 0], [0, a], ap, [a * r3, 0]], [[0, a], [a * r3, 0]], [[[0, 0], [0, a], [a * r3, 0]], [ap, [0, a], [a * r3, 0]]], '②');
  // ③：等腰直角三角形 + 含 30° 角的直角三角形（直角顶点在拼接处）
  const J = [L, 0], sh = (L * Math.SQRT2) / r3, Rp = [L + sh / Math.SQRT2, sh / Math.SQRT2];
  draw(430, [[0, 0], [0, L], Rp, J], [[0, L], J], [[[0, 0], [0, L], J], [J, [0, L], Rp]], '③');
  // ④：含 30° 角的直角三角形 + 等腰直角三角形，斜边重合
  const ap4 = [(r3 + 1) / 2 * a, (r3 + 1) / 2 * a];
  draw(650, [[0, 0], [0, a], ap4, [a * r3, 0]], [[0, a], [a * r3, 0]], [[[0, 0], [0, a], [a * r3, 0]], [ap4, [0, a], [a * r3, 0]]], '④');
  files['exam-2024-23-a.svg'] = svg(780, 210, out.join('\n'));
}
function fig23b(withAux) {
  const th = (24.5 * Math.PI) / 180, m = 250, n = 145;
  const Cc = [withAux ? 420 : 300, 170];
  const B = [Cc[0] - m, Cc[1]];
  const D = [Cc[0] + n * Math.cos(Math.PI - 2 * th), Cc[1] - n * Math.sin(Math.PI - 2 * th)];
  const AC = (m + n) / (2 * Math.cos(th));
  const A = [Cc[0] + AC * Math.cos(Math.PI - th), Cc[1] - AC * Math.sin(Math.PI - th)];
  const out = [poly([A, B, Cc, D]), seg(A, Cc)];
  if (withAux) {
    const E = [B[0] - n, B[1]], F = [A[0], Cc[1]];
    out.push(seg(E, B, { w: 1.5, dash: '5 4' }), seg(E, A, { w: 1.5, dash: '5 4' }), seg(A, F, { w: 1.5, dash: '5 4' }));
    out.push(rightAngle(F, Cc, A));
    out.push(label(E, 'E', -10, 6), label(F, 'F', 2, 20));
  }
  out.push(label(A, 'A', -10, -6), label(B, 'B', -8, 18), label(Cc, 'C', 10, 16), label(D, 'D', 8, -8));
  return svg(withAux ? 460 : 340, 200, out.join('\n'));
}
files['exam-2024-23-b.svg'] = fig23b(false);
{
  const u = 45, B = [70, 170], A = [70, 170 - 3 * u], Cc = [70 + 4 * u, 170];
  const out = [poly([A, B, Cc]), rightAngle(B, A, Cc)];
  out.push(label(A, 'A', -10, -2), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16));
  files['exam-2024-23-c.svg'] = svg(320, 195, out.join('\n'));
}
files['exam-2024-23-d.svg'] = fig23b(true);

export default files;
