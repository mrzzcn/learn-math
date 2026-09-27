// 附录“2025 年河南中考数学”的图：按原卷重画。
import { C, f, svg, text, line, seg, dot, poly, polyline, circle, arc, angleMark, rightAngle, label, axes, plot } from './lib.mjs';

const files = {};
const lab = (p, s, dx, dy, o = {}) => label(p, s, dx, dy, o);
// 数学坐标 → 像素：原点 (ox, oy)，单位 u
const map = (ox, oy, u) => p => [ox + u * p[0], oy - u * p[1]];

// ---------- 第 2 题：展开图 ----------
{
  const out = [];
  const cx = 160;
  // 扇形：顶点在上，下边是弧；圆和弧相切
  const V2 = [cx, 12], r = 150, s2 = 62;
  const pt = a => [V2[0] + r * Math.cos((90 + a) * Math.PI / 180), V2[1] + r * Math.sin((90 + a) * Math.PI / 180)];
  const A1 = pt(s2), A2 = pt(-s2);
  out.push(`<path d="M ${f(A1[0])} ${f(A1[1])} L ${V2[0]} ${V2[1]} L ${f(A2[0])} ${f(A2[1])} A ${r} ${r} 0 0 1 ${f(A1[0])} ${f(A1[1])} Z" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linejoin="round"/>`);
  const cr = 52;   // 弧长约等于圆周长
  out.push(circle(V2[0], V2[1] + r + cr, cr));
  files['exam-2025-02-a.svg'] = svg(320, 12 + r + 2 * cr + 8, out.join('\n'));
}
{
  // 第 2 题选项：圆柱、长方体、三棱柱、圆锥
  const out = [];
  const w = 110;
  // A 圆柱
  {
    const x = 55, rx = 34, ry = 10, t = 25, b = 125;
    out.push(`<ellipse cx="${x}" cy="${t}" rx="${rx}" ry="${ry}" stroke="${C.ink}" stroke-width="2" fill="none"/>`);
    out.push(line(x - rx, t, x - rx, b), line(x + rx, t, x + rx, b));
    out.push(`<path d="M ${x - rx} ${b} A ${rx} ${ry} 0 0 0 ${x + rx} ${b}" stroke="${C.ink}" stroke-width="2" fill="none"/>`);
    out.push(`<path d="M ${x - rx} ${b} A ${rx} ${ry} 0 0 1 ${x + rx} ${b}" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>`);
    out.push(text(x, 158, 'A', { anchor: 'middle' }));
  }
  // B 长方体
  {
    const x0 = w + 20, y0 = 30, W = 60, H = 100, dx = 22, dy = -14;
    const p = (x, y) => [x0 + x, y0 + y];
    out.push(poly([p(0, 0), p(W, 0), p(W, H), p(0, H)]));
    out.push(`<polyline points="${[p(0, 0), p(dx, dy), p(W + dx, dy), p(W, 0)].map(v => v.map(f).join(',')).join(' ')}" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linejoin="round"/>`);
    out.push(seg(p(W + dx, dy), p(W + dx, H + dy)), seg(p(W + dx, H + dy), p(W, H)));
    out.push(seg(p(dx, dy), p(dx, H + dy), { w: 1.5, dash: '4 3' }), seg(p(dx, H + dy), p(0, H), { w: 1.5, dash: '4 3' }), seg(p(dx, H + dy), p(W + dx, H + dy), { w: 1.5, dash: '4 3' }));
    out.push(text(x0 + W / 2 + 8, 158, 'B', { anchor: 'middle' }));
  }
  // C 三棱柱
  {
    const x0 = 2 * w + 25, y0 = 25, H = 100;
    const a = [x0, y0], b = [x0 + 55, y0], c = [x0 + 30, y0 + 14];
    const lo = p => [p[0], p[1] + H];
    out.push(poly([a, b, c]));
    out.push(seg(a, lo(a)), seg(b, lo(b)), seg(c, lo(c)));
    out.push(seg(lo(a), lo(c)), seg(lo(c), lo(b)), seg(lo(a), lo(b), { w: 1.5, dash: '4 3' }));
    out.push(text(x0 + 28, 158, 'C', { anchor: 'middle' }));
  }
  // D 圆锥
  {
    const x = 3 * w + 55, rx = 32, ry = 10, t = 20, b = 125;
    out.push(line(x, t, x - rx, b), line(x, t, x + rx, b));
    out.push(`<path d="M ${x - rx} ${b} A ${rx} ${ry} 0 0 0 ${x + rx} ${b}" stroke="${C.ink}" stroke-width="2" fill="none"/>`);
    out.push(`<path d="M ${x - rx} ${b} A ${rx} ${ry} 0 0 1 ${x + rx} ${b}" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>`);
    out.push(text(x, 158, 'D', { anchor: 'middle' }));
  }
  files['exam-2025-02-b.svg'] = svg(4 * w, 168, out.join('\n'));
}

// ---------- 第 4 题：量角器量六边形零件的内角 ----------
{
  const out = [];
  const P = [200, 162], R = 150, r0 = 118, r1 = 30;
  // 量角器：半圆外框、底边、内圈小半圆
  out.push(`<path d="M ${P[0] - R} ${P[1]} A ${R} ${R} 0 0 1 ${P[0] + R} ${P[1]}" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`);
  out.push(poly([[P[0] - R, P[1]], [P[0] + R, P[1]], [P[0] + R, P[1] + 12], [P[0] - R, P[1] + 12]], { w: 1.5 }));
  out.push(`<path d="M ${P[0] - r1} ${P[1]} A ${r1} ${r1} 0 0 1 ${P[0] + r1} ${P[1]}" stroke="${C.ink}" stroke-width="1" fill="none"/>`);
  for (let a = 0; a <= 180; a += 1) {
    const len = a % 10 === 0 ? 12 : a % 5 === 0 ? 8 : 4;
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    out.push(line(P[0] + R * c, P[1] - R * s, P[0] + (R - len) * c, P[1] - (R - len) * s, { w: 0.6, color: C.soft }));
    if (a % 10 === 0 && a > 0 && a < 180) out.push(line(P[0] + r1 * c, P[1] - r1 * s, P[0] + (r0 - 22) * c, P[1] - (r0 - 22) * s, { w: 0.5, color: C.soft }));
  }
  for (let a = 0; a <= 180; a += 10) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    // 外圈刻度从左往右 0→180，内圈从右往左 0→180
    out.push(text(P[0] + (R - 22) * c, P[1] - (R - 22) * s + 4, String(180 - a), { anchor: 'middle', size: 9, color: C.soft }));
    if (a > 0 && a < 180) out.push(text(P[0] + (r0 - 12) * c, P[1] - (r0 - 12) * s + 4, String(a), { anchor: 'middle', size: 9, color: C.soft }));
  }
  out.push(line(P[0] - R, P[1], P[0] + R, P[1], { w: 1.5 }));
  // 六边形零件：一个顶点在量角器中心，上边沿着量角器底边向右
  const s = 62, h = s * Math.sqrt(3) / 2;
  const hex = [P, [P[0] + s, P[1]], [P[0] + 1.5 * s, P[1] + h], [P[0] + s, P[1] + 2 * h], [P[0], P[1] + 2 * h], [P[0] - 0.5 * s, P[1] + h]];
  out.push(poly(hex, { fill: 'rgba(87,96,106,0.18)' }));
  const cx = P[0] + s / 2, cy = P[1] + h;
  for (let k = 0; k < 6; k++) { const a = k * 60 * Math.PI / 180; out.push(circle(cx + 36 * Math.cos(a), cy + 36 * Math.sin(a), 12, { fill: '#fff', w: 1.5 })); }
  // 左上边所在直线，向两边延长
  const u = [Math.cos(Math.PI / 3), -Math.sin(Math.PI / 3)];
  out.push(line(P[0] + R * u[0], P[1] + R * u[1], P[0] - 1.9 * s * u[0], P[1] - 1.9 * s * u[1], { w: 1.5 }));
  files['exam-2025-04.svg'] = svg(400, 292, out.join('\n'));
}

// ---------- 第 6 题：网格 ----------
{
  const u = 66, T = map(40, 225, u);
  const out = [];
  for (let x = 0; x <= 4; x++) out.push(seg(T([x, 0]), T([x, 3]), { color: C.soft, w: 1, dash: '4 3' }));
  for (let y = 0; y <= 3; y++) out.push(seg(T([0, y]), T([4, y]), { color: C.soft, w: 1, dash: '4 3' }));
  const A = T([4, 3]), B = T([0, 2]), Cc = T([0, 0]), D = T([2, 2.5]), E = T([2, 1.5]);
  out.push(poly([A, B, Cc]), seg(D, E));
  out.push(lab(A, 'A', 10, -2), lab(B, 'B', -12, 5), lab(Cc, 'C', -10, 14), lab(D, 'D', 8, -6), lab(E, 'E', 10, 14));
  files['exam-2025-06.svg'] = svg(340, 255, out.join('\n'));
}

// ---------- 第 8 题：四张卡片 ----------
{
  const out = [];
  const chars = ['美', '丽', '山', '河'];
  chars.forEach((ch, i) => {
    const x = 10 + i * 105, y = 10, W = 88, H = 104;
    out.push(poly([[x + 5, y + 5], [x + W + 5, y + 5], [x + W + 5, y + H + 5], [x + 5, y + H + 5]], { w: 1, color: C.soft }));
    out.push(poly([[x, y], [x + W, y], [x + W, y + H], [x, y + H]], { w: 1.5, fill: '#fff' }));
    out.push(poly([[x + 6, y + 8], [x + 24, y + 8], [x + 24, y + H - 8], [x + 6, y + H - 8]], { w: 0, fill: C.ink }));
    ['甲', '骨', '文', '「', ch, '」'].forEach((c, k) => out.push(text(x + 15, y + 24 + k * 13, c, { anchor: 'middle', size: 11, color: '#fff' })));
    out.push(text(x + 56, y + 66, ch, { anchor: 'middle', size: 36 }));
  });
  files['exam-2025-08.svg'] = svg(430, 125, out.join('\n'));
}

// ---------- 第 9 题：菱形折叠 ----------
{
  const k = 3 * Math.SQRT2, T = map(20, 150, 24);
  const B = T([0, 0]), Cc = T([6, 0]), A = T([k, k]), D = T([6 + k, k]), E = T([k, 0]), F = T([2 * k, 0]);
  const out = [];
  out.push(seg(B, A, { dash: '5 4', w: 1.5 }), seg(B, E, { dash: '5 4', w: 1.5 }));
  out.push(seg(A, D), seg(D, Cc), seg(E, F), seg(A, E), seg(A, F));
  out.push(lab(A, 'A', 0, -8), lab(D, 'D', 8, -6), lab(B, 'B', -4, 18), lab(E, 'E', 0, 18), lab(Cc, 'C', 0, 18), lab(F, 'F', 2, 18));
  files['exam-2025-09.svg'] = svg(320, 180, out.join('\n'));
}

// ---------- 第 10 题：摩擦系数与车速 ----------
{
  const ox = 50, oy = 200, ux = 2.6;
  const Y = m => 150 - (m - 0.65) * 520;   // 纵轴从 0.65 起画，下面用折线表示省略
  const X = v => ox + ux * v;
  const mu = v => 0.7 + 0.2 * Math.exp(-v / 18.03);
  const out = [];
  out.push(line(ox - 5, oy, X(92), oy, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(92) + 8)},${oy} ${f(X(92))},${oy - 4} ${f(X(92))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polyline points="${ox},${oy} ${ox},${oy - 12} ${ox - 5},${oy - 16} ${ox + 5},${oy - 22} ${ox},${oy - 26} ${ox},12" stroke="${C.axis}" stroke-width="1.5" fill="none"/>`);
  out.push(`<polygon points="${ox},4 ${ox - 4},12 ${ox + 4},12" fill="${C.axis}" stroke="none"/>`);
  const pts = []; for (let v = 0; v <= 72; v += 0.5) pts.push([X(v), Y(mu(v))]);
  out.push(polyline(pts));
  for (const [v, m] of [[25, 0.75], [60, 0.71]]) {
    out.push(line(ox, Y(m), X(v), Y(m), { color: C.soft, w: 1, dash: '4 3' }), line(X(v), Y(m), X(v), oy, { color: C.soft, w: 1, dash: '4 3' }));
    out.push(text(X(v), oy + 18, String(v), { anchor: 'middle', size: 13 }), text(ox - 6, Y(m) + 5, String(m), { anchor: 'end', size: 13 }));
  }
  out.push(text(ox - 6, Y(0.9) + 5, '0.9', { anchor: 'end', size: 13 }));
  out.push(text(ox - 10, oy + 18, 'O', { italic: true, anchor: 'end', size: 13 }));
  out.push(text(ox + 8, 14, 'μ', { italic: true }));
  out.push(text(X(92) + 4, oy + 18, '<tspan font-style="italic">v</tspan>/(km/h)', { size: 13 }));
  files['exam-2025-10.svg'] = svg(390, 225, out.join('\n'));
}

// ---------- 第 14 题：割圆术 ----------
{
  const T = map(40, 150, 64);
  const r = 4, c30 = Math.sqrt(3) / 2;
  const O = T([0, 0]), E = T([4, 0]), A = T([4 * c30, 2]), B = T([4 * c30, -2]), D = T([4, 2]), Cc = T([4, -2]), F = T([4 * c30, 0]);
  const out = [];
  // 阴影：线段 AF、FE 和弧 EA 围成
  out.push(`<path d="M ${f(A[0])} ${f(A[1])} L ${f(F[0])} ${f(F[1])} L ${f(E[0])} ${f(E[1])} A ${r * 64} ${r * 64} 0 0 0 ${f(A[0])} ${f(A[1])} Z" fill="rgba(87,96,106,0.35)" stroke="none"/>`);
  out.push(`<path d="M ${f(A[0])} ${f(A[1])} A ${r * 64} ${r * 64} 0 0 1 ${f(B[0])} ${f(B[1])}" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`);
  out.push(seg(O, A), seg(O, B), seg(O, E), poly([A, D, Cc, B]), seg(B, E));
  out.push(lab(O, 'O', -12, 5), lab(A, 'A', -8, -6), lab(B, 'B', -8, 16), lab(D, 'D', 10, -6), lab(Cc, 'C', 10, 16), lab(E, 'E', 12, 5), lab(F, 'F', -10, 18));
  files['exam-2025-14.svg'] = svg(330, 300, out.join('\n'));
}

// ---------- 第 15 题 ----------
{
  const T = map(25, 150, 40);
  const B = T([0, 0]), Cc = T([8, 0]), A = T([4, 3]), P = T([5.3, 0]);
  const out = [poly([A, B, Cc]), seg(A, P)];
  out.push(lab(A, 'A', 0, -8), lab(B, 'B', -8, 16), lab(Cc, 'C', 8, 16), lab(P, 'P', 0, 18));
  files['exam-2025-15.svg'] = svg(370, 178, out.join('\n'));
}

// ---------- 第 17 题：得分统计图 ----------
{
  const ox = 50, oy = 200, uy = 6, bw = 22;
  const g7 = [10, 15, 6, 10, 9], g8 = [7, 9, 23, 6, 5];
  const out = [];
  out.push(`<defs><pattern id="hatch2025" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#fff"/><line x1="0" y1="0" x2="0" y2="5" stroke="${C.ink}" stroke-width="2"/></pattern></defs>`);
  out.push(line(ox, oy, ox + 330, oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, oy - 26 * uy - 20, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${ox + 338},${oy} ${ox + 330},${oy - 4} ${ox + 330},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${oy - 26 * uy - 28} ${ox - 4},${oy - 26 * uy - 20} ${ox + 4},${oy - 26 * uy - 20}" fill="${C.axis}" stroke="none"/>`);
  for (let v = 5; v <= 25; v += 5) out.push(line(ox - 4, oy - v * uy, ox, oy - v * uy, { color: C.axis, w: 1 }), text(ox - 8, oy - v * uy + 4, String(v), { anchor: 'end', size: 12 }));
  out.push(text(ox - 8, oy + 4, '0', { anchor: 'end', size: 12 }));
  out.push(text(ox - 4, oy - 26 * uy - 26, '人数', { anchor: 'end', size: 13 }));
  out.push(text(ox + 342, oy + 18, '得分/分', { size: 13 }));
  [6, 7, 8, 9, 10].forEach((s, i) => {
    const x = ox + 30 + i * 60;
    out.push(`<rect x="${x}" y="${oy - g7[i] * uy}" width="${bw}" height="${g7[i] * uy}" fill="url(#hatch2025)" stroke="${C.ink}" stroke-width="1.2"/>`);
    out.push(`<rect x="${x + bw}" y="${oy - g8[i] * uy}" width="${bw}" height="${g8[i] * uy}" fill="#fff" stroke="${C.ink}" stroke-width="1.2"/>`);
    out.push(text(x + bw / 2, oy - g7[i] * uy - 5, String(g7[i]), { anchor: 'middle', size: 12 }), text(x + 1.5 * bw, oy - g8[i] * uy - 5, String(g8[i]), { anchor: 'middle', size: 12 }));
    out.push(text(x + bw, oy + 18, String(s), { anchor: 'middle', size: 13 }));
  });
  const ly = 22;
  out.push(`<rect x="${ox + 120}" y="${ly - 11}" width="14" height="12" fill="url(#hatch2025)" stroke="${C.ink}" stroke-width="1"/>`, text(ox + 138, ly, '七年级', { size: 13 }));
  out.push(`<rect x="${ox + 200}" y="${ly - 11}" width="14" height="12" fill="#fff" stroke="${C.ink}" stroke-width="1"/>`, text(ox + 218, ly, '八年级', { size: 13 }));
  out.push(text(ox + 175, oy + 44, '得分统计图', { anchor: 'middle', size: 13 }));
  files['exam-2025-17.svg'] = svg(440, 255, out.join('\n'));
}

// ---------- 第 18 题：一副三角板与反比例函数 ----------
{
  const T = map(150, 210, 40);
  const s3 = Math.sqrt(3);
  const O = T([0, 0]), A = T([0, 4]), B = T([-4 / s3, 4]), Cc = T([2, 2]), D = T([-1, 4]);
  const out = [];
  out.push(line(T([-3.4, 0])[0], O[1], T([4.6, 0])[0], O[1], { color: C.axis, w: 1.5 }));
  out.push(line(O[0], T([0, -0.9])[1], O[0], T([0, 4.8])[1], { color: C.axis, w: 1.5 }));
  const xe = T([4.6, 0]), ye = T([0, 4.8]);
  out.push(`<polygon points="${f(xe[0] + 8)},${f(xe[1])} ${f(xe[0])},${f(xe[1] - 4)} ${f(xe[0])},${f(xe[1] + 4)}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${f(ye[0])},${f(ye[1] - 8)} ${f(ye[0] - 4)},${f(ye[1])} ${f(ye[0] + 4)},${f(ye[1])}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(xe[0] + 4, xe[1] + 18, 'x', { italic: true, color: C.soft }), text(ye[0] + 8, ye[1], 'y', { italic: true, color: C.soft }));
  out.push(poly([O, A, B], { fill: 'rgba(87,96,106,0.22)' }), poly([O, A, Cc], { fill: 'rgba(87,96,106,0.22)' }));
  out.push(circle(...T([-0.72, 2.9]), 14, { fill: '#fff', w: 1.5 }), circle(...T([0.7, 2.2]), 14, { fill: '#fff', w: 1.5 }));
  out.push(plot(x => 4 / x, 0.95, 4.5, ...[p => T([p, 0])[0], p => T([0, p])[1]], { ymax: 4.3 }));
  out.push(dot(...D, C.ink, 2.5));
  out.push(lab(O, 'O', -10, 18), lab(A, 'A', 10, -4), lab(B, 'B', -6, -6), lab(D, 'D', 0, -8), lab(Cc, 'C', 12, 0));
  files['exam-2025-18.svg'] = svg(350, 250, out.join('\n'));
}

// ---------- 第 19 题：以 BC 为直径的圆 ----------
{
  const R = 100, T = map(130, 130, R);
  const B = T([-1, 0]), Cc = T([1, 0]), A = T([-0.4, 0.8]), D = T([1.6, 0.8]), E = T([0.6, 0.8]);
  const out = [circle(130, 130, R), poly([A, B, Cc, D])];
  out.push(lab(A, 'A', -2, -8), lab(E, 'E', 2, -8), lab(D, 'D', 10, -4), lab(B, 'B', -10, 5), lab(Cc, 'C', 10, 14));
  files['exam-2025-19-a.svg'] = svg(320, 245, out.join('\n'));
}
{
  // 第 19 题答案：作 BC 的垂直平分线，与 BC 的交点就是圆心 O
  const R = 100, T = map(130, 145, R);
  const B = T([-1, 0]), Cc = T([1, 0]), A = T([-0.4, 0.8]), D = T([1.6, 0.8]), E = T([0.6, 0.8]), O = T([0, 0]);
  const out = [circle(130, 145, R), poly([A, B, Cc, D])];
  const rr = 1.3 * R, hy = Math.sqrt(rr * rr - R * R);
  // 两组弧：以 B、C 为圆心、同一半径画弧，交于 BC 上下两点
  const ang = Math.atan2(hy, R) * 180 / Math.PI;
  out.push(arc(B, rr, ang - 12, ang + 12, { color: C.soft, w: 1.2 }), arc(B, rr, -ang - 12, -ang + 12, { color: C.soft, w: 1.2 }));
  out.push(arc(Cc, rr, 180 - ang - 12, 180 - ang + 12, { color: C.soft, w: 1.2 }), arc(Cc, rr, 180 + ang - 12, 180 + ang + 12, { color: C.soft, w: 1.2 }));
  out.push(line(O[0], O[1] - hy - 14, O[0], O[1] + hy + 14, { color: C.blue, w: 1.5 }));
  out.push(seg(A, O, { color: C.emph }), seg(E, Cc, { color: C.emph }), dot(...O));
  out.push(lab(A, 'A', -8, -6), lab(E, 'E', 8, -8), lab(D, 'D', 10, -4), lab(B, 'B', -10, 5), lab(Cc, 'C', 10, 14), lab(O, 'O', -8, 18));
  files['exam-2025-19-b.svg'] = svg(320, 295, out.join('\n'));
}

// ---------- 第 21 题：测量纪念碑的高度（示意图，不按比例） ----------
{
  const gy = 220;
  const F = [30, gy], M = [62, gy], D = [95, gy], Cc = [390, gy];
  const N = [M[0], gy - 42], A = [Cc[0], 20], B = [Cc[0], N[1]];
  const tE = (D[0] - N[0]) / (A[0] - N[0]), E = [D[0], N[1] + tE * (A[1] - N[1])];
  const out = [];
  out.push(line(10, gy, 480, gy, { w: 1.5 }));
  // 台阶平台
  const px0 = 290, px1 = 430, top = N[1], steps = 6, sw = 7;
  const st = [[px0 - steps * sw, gy]];
  const hStep = (gy - top) / steps;
  for (let i = 0; i < steps; i++) { const x = px0 - (steps - i) * sw, y = gy - (i + 1) * hStep; st.push([x, gy - i * hStep], [x, y], [x + sw, y]); }
  st.push([px0, top], [px1, top]);
  for (let i = 0; i < steps; i++) { const x = px1 + i * sw, y = top + i * hStep; st.push([x, y], [x, y + hStep], [x + sw, y + hStep]); }
  st.push([px1 + steps * sw, gy]);
  out.push(polyline(st.slice(1), { w: 1.5 }));
  out.push(seg(A, B), seg(M, N), seg(D, E));
  out.push(seg(B, Cc, { dash: '4 3', w: 1.2 }), seg(N, B, { dash: '4 3', w: 1.2 }), seg(N, A, { dash: '4 3', w: 1.2 }), seg(D, A, { dash: '4 3', w: 1.2 }), seg(F, E, { dash: '4 3', w: 1.2 }));
  out.push(rightAngle(B, A, [B[0] - 10, B[1]], { size: 8 }));
  out.push(lab(A, 'A', 8, -2), lab(B, 'B', 12, -4), lab(Cc, 'C', 0, 20), lab(D, 'D', 2, 20), lab(M, 'M', 0, 20), lab(F, 'F', -4, 20), lab(N, 'N', -10, -2), lab(E, 'E', -2, -8));
  files['exam-2025-21.svg'] = svg(490, 245, out.join('\n'));
}

// ---------- 第 22 题：坐标系 ----------
{
  const cfg = { ox: 170, oy: 165, u: 36, xmin: -4, xmax: 4, ymin: -4, ymax: 4 };
  const { body } = axes(cfg);
  files['exam-2025-22-a.svg'] = svg(345, 330, body.replace(/stroke="#e3e6ea"/g, `stroke="${C.soft}" stroke-dasharray="3 3"`));
}
{
  // 第 22 题答案：y = x^2 + 2x − 2 的图象
  const cfg = { ox: 170, oy: 165, u: 36, xmin: -4, xmax: 4, ymin: -4, ymax: 4 };
  const { X, Y, body } = axes(cfg);
  const fn = x => x * x + 2 * x - 2;
  const out = [body, plot(fn, -4, 2, X, Y, { ymax: 4.2, color: C.emph })];
  for (const x of [-3, -2, -1, 0, 1]) out.push(dot(X(x), Y(fn(x)), C.emph, 3));
  files['exam-2025-22-b.svg'] = svg(345, 330, out.join('\n'));
}

// ---------- 第 23 题：图 1、图 2 ----------
function fig23(theta, full, ox, oy, lenA, lenB) {
  // O 为原点，OB 沿 x 轴负方向，OA 与 OB 夹角 theta，OC 为角平分线
  const rad = d => d * Math.PI / 180, a = rad(theta), h = a / 2;
  const u = 60, T = map(ox, oy, u);
  const dirA = [-Math.cos(a), Math.sin(a)], dirC = [-Math.cos(h), Math.sin(h)];
  const oc = 4.2;
  const Cm = [oc * dirC[0], oc * dirC[1]], Dm = [Cm[0], 0];
  const dotp = (p, q) => p[0] * q[0] + p[1] * q[1];
  const Em = [dirA[0] * dotp(Dm, dirA), dirA[1] * dotp(Dm, dirA)];
  const out = [];
  const O = T([0, 0]);
  out.push(line(...T([-lenB, 0]), ...O));
  out.push(seg(O, T([lenA * dirA[0], lenA * dirA[1]])));
  out.push(seg(O, T([(oc + 0.5) * dirC[0], (oc + 0.5) * dirC[1]])));
  const C_ = T(Cm), D_ = T(Dm);
  out.push(seg(C_, D_), rightAngle(D_, C_, O, { size: 8 }));
  out.push(lab(O, 'O', 4, 18), lab(T([-lenB, 0]), 'B', -2, 18), lab(T([lenA * dirA[0], lenA * dirA[1]]), 'A', full ? -10 : 10, 4), lab(C_, 'C', 6, -8), lab(D_, 'D', 2, 18));
  if (full) {
    const L = [Em[0] - Dm[0], Em[1] - Dm[1]], ln = Math.hypot(...L), ud = [L[0] / ln, L[1] / ln];
    const s = dotp([Cm[0] - Dm[0], Cm[1] - Dm[1]], ud), Gm = [Dm[0] + s * ud[0], Dm[1] + s * ud[1]];
    const E_ = T(Em), G_ = T(Gm);
    // F：直线 DE 与 OC 的交点
    const det = ud[0] * (-dirC[1]) - ud[1] * (-dirC[0]);
    const ss = ((-Dm[0]) * (-dirC[1]) - (-Dm[1]) * (-dirC[0])) / det;
    const F_ = T([Dm[0] + ss * ud[0], Dm[1] + ss * ud[1]]);
    out.push(seg(D_, T([Em[0] + 0.25 * ud[0], Em[1] + 0.25 * ud[1]])), seg(C_, G_));
    out.push(rightAngle(E_, D_, O, { size: 7 }), rightAngle(G_, C_, D_, { size: 7 }));
    out.push(lab(E_, 'E', 10, -4), lab(G_, 'G', 4, -8), lab(F_, 'F', 0, -10));
  }
  return out.join('\n');
}
files['exam-2025-23-a.svg'] = svg(370, 300, fig23(70, true, 340, 275, 4.4, 5.2));
files['exam-2025-23-b.svg'] = svg(400, 290, fig23(112, false, 300, 260, 3.6, 4.5));

// 第 23 题答案图：钝角时补全图形，E 在 AO 的延长线上，F 在 CO 的延长线上；虚线 CH 是辅助线
{
  const theta = 112, rad = d => d * Math.PI / 180, a = rad(theta), h = a / 2;
  const T = map(300, 222, 60);
  const dirA = [-Math.cos(a), Math.sin(a)], dirC = [-Math.cos(h), Math.sin(h)];
  const dotp = (p, q) => p[0] * q[0] + p[1] * q[1];
  const sc = (k, v) => [k * v[0], k * v[1]];
  const oc = 3.6, lenA = 3.6, lenB = 4.5;
  const Cm = sc(oc, dirC), Dm = [Cm[0], 0];
  const Em = sc(dotp(Dm, dirA), dirA), Hm = sc(dotp(Cm, dirA), dirA);
  const L = [Em[0] - Dm[0], Em[1] - Dm[1]], ln = Math.hypot(...L), ud = [L[0] / ln, L[1] / ln];
  const Gm = [Dm[0] + dotp([Cm[0] - Dm[0], Cm[1] - Dm[1]], ud) * ud[0], Dm[1] + dotp([Cm[0] - Dm[0], Cm[1] - Dm[1]], ud) * ud[1]];
  // F：直线 DE 与直线 OC 的交点（在 CO 的延长线上）
  const det = ud[0] * (-dirC[1]) - ud[1] * (-dirC[0]);
  const ss = ((-Dm[0]) * (-dirC[1]) - (-Dm[1]) * (-dirC[0])) / det;
  const Fm = [Dm[0] + ss * ud[0], Dm[1] + ss * ud[1]];
  const O = T([0, 0]), A_ = T(sc(lenA, dirA)), C_ = T(Cm), D_ = T(Dm), E_ = T(Em), G_ = T(Gm), H_ = T(Hm), F_ = T(Fm);
  const out = [];
  out.push(line(...T([-lenB, 0]), ...O), seg(E_, A_));
  out.push(seg(T(sc(oc + 0.4, dirC)), F_));
  out.push(seg(C_, D_), seg(G_, F_), seg(C_, G_));
  out.push(seg(C_, H_, { w: 1.5, dash: '6 4' }));
  out.push(rightAngle(D_, C_, O, { size: 8 }), rightAngle(E_, D_, O, { size: 7 }), rightAngle(G_, C_, D_, { size: 7 }), rightAngle(H_, C_, O, { size: 7 }));
  out.push(lab(O, 'O', 10, -6), lab(T([-lenB, 0]), 'B', -2, 18), lab(A_, 'A', 10, 4), lab(C_, 'C', 6, -8), lab(D_, 'D', -4, 18),
    lab(E_, 'E', -6, 16), lab(G_, 'G', -14, -4), lab(H_, 'H', 10, 4), lab(F_, 'F', 8, 6));
  files['exam-2025-23-c.svg'] = svg(400, 305, out.join('\n'));
}

export default files;
