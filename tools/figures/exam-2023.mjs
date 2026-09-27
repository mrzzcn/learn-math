// 附录“2023 年河南中考数学”的图，按原卷重画。
import { C, f, svg, text, line, seg, dot, poly, polyline, circle, arc, label, rightAngle, angleMark, plot } from './lib.mjs';

const files = {};
const I = { italic: true };
const dash = '6 4';
const S3 = Math.sqrt(3);
const rd = d => (d * Math.PI) / 180;

// 坐标轴（带箭头），X、Y 把数学坐标换成像素
function frame(ox, oy, u, x0, x1, y0, y1, o = {}) {
  const X = x => ox + u * x, Y = y => oy - u * y;
  const col = o.color || C.ink, w = o.w || 1.5;
  const out = [line(X(x0), oy, X(x1), oy, { color: col, w }), line(ox, Y(y0), ox, Y(y1), { color: col, w })];
  out.push(`<polygon points="${f(X(x1) + 8)},${f(oy)} ${f(X(x1))},${f(oy - 4)} ${f(X(x1))},${f(oy + 4)}" fill="${col}" stroke="none"/>`);
  out.push(`<polygon points="${f(ox)},${f(Y(y1) - 8)} ${f(ox - 4)},${f(Y(y1))} ${f(ox + 4)},${f(Y(y1))}" fill="${col}" stroke="none"/>`);
  out.push(text(X(x1) + 4, oy + 18, 'x', I), text(ox + 8, Y(y1) - 2, 'y', I));
  return { X, Y, body: out.join('\n') };
}

// ---------- 第 2 题：鹅颈瓶 ----------
{
  const cx = 80;
  // 右半边轮廓（从瓶口到瓶底），左半边对称
  const R = [[9, 12], [6, 18], [5, 40], [7, 62], [22, 90], [36, 118], [34, 146], [22, 164], [18, 170]];
  const smooth = pts => {
    // Catmull-Rom 转成三次贝塞尔，画光滑的瓶身
    let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d;
  };
  const right = R.map(([dx, y]) => [cx + dx, y]), left = R.map(([dx, y]) => [cx - dx, y]);
  const out = [];
  out.push(`<path d="${smooth(right)}" stroke="${C.ink}" stroke-width="2" fill="none"/>`, `<path d="${smooth(left)}" stroke="${C.ink}" stroke-width="2" fill="none"/>`);
  out.push(`<ellipse cx="${cx}" cy="12" rx="9" ry="2.5" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`);
  out.push(line(cx - 18, 170, cx + 18, 170), line(cx - 20, 176, cx + 20, 176), line(cx - 18, 170, cx - 20, 176, { w: 1.5 }), line(cx + 18, 170, cx + 20, 176, { w: 1.5 }));
  // “正面”箭头
  out.push(line(40, 212, 46, 192, { w: 1.5 }), `<polygon points="47,186 42,194 50,195" fill="${C.ink}" stroke="none"/>`);
  out.push(text(52, 210, '正面', { size: 13 }));
  files['exam-2023-02.svg'] = svg(160, 225, out.join('\n'));
}

// ---------- 第 4 题：直线 AB、CD 相交于点 O ----------
{
  const O = [170, 110];
  const at = (deg, len) => [O[0] + len * Math.cos(rd(deg)), O[1] - len * Math.sin(rd(deg))];
  const A = at(180, 140), B = at(0, 140), Cc = at(80, 90), D = at(260, 120), E = at(230, 130);
  const out = [seg(A, B), seg(Cc, D), seg(O, E)];
  out.push(arc(O, 20, 0, 80, { w: 1.5 }), arc(O, 20, 230, 260, { w: 1.5 }));
  out.push(text(O[0] + 20, O[1] - 14, '1', { size: 14 }), text(at(245, 44)[0], at(245, 44)[1] + 5, '2', { anchor: 'middle', size: 14 }));
  out.push(label(O, 'O', -16, -10), label(A, 'A', -12, 5), label(B, 'B', 12, 5), label(Cc, 'C', 2, -8), label(D, 'D', -8, 18), label(E, 'E', -10, 16));
  files['exam-2023-04.svg'] = svg(340, 255, out.join('\n'));
}

// ---------- 第 6 题：点 A、B、C 在 ⊙O 上 ----------
{
  const O = [110, 110], r = 85;
  const at = deg => [O[0] + r * Math.cos(rd(deg)), O[1] - r * Math.sin(rd(deg))];
  const A = at(-5), B = at(105), Cc = at(205);
  const out = [circle(O[0], O[1], r), seg(Cc, A), seg(Cc, B), seg(O, A), seg(O, B), dot(...O, C.ink, 3)];
  out.push(label(O, 'O', -12, 14), label(A, 'A', 12, 5), label(B, 'B', -2, -8), label(Cc, 'C', -12, 8));
  files['exam-2023-06.svg'] = svg(220, 215, out.join('\n'));
}

// ---------- 第 8 题：三部影片 ----------
{
  const names = [['童年', '周恩来'], ['我心', '飞扬'], ['穿过', '雨林']];
  const w = 90, h = 128, gap = 22, x0 = 10, y0 = 10;
  const out = [];
  names.forEach(([a, b], i) => {
    const x = x0 + i * (w + gap);
    out.push(`<rect x="${x}" y="${y0}" width="${w}" height="${h}" fill="${C.blueFill}" stroke="${C.ink}" stroke-width="1.5"/>`);
    out.push(text(x + w / 2, y0 + 56, a, { anchor: 'middle', size: 18 }), text(x + w / 2, y0 + 82, b, { anchor: 'middle', size: 18 }));
  });
  files['exam-2023-08.svg'] = svg(2 * x0 + 3 * w + 2 * gap, h + 2 * y0, out.join('\n'));
}

// ---------- 第 9 题：y = ax² + bx 的图象 ----------
{
  const { X, Y, body } = frame(60, 110, 40, -1.4, 4.2, -2.3, 2.3);
  const fn = x => -0.6 * x * (x - 2.6);
  const out = [body, plot(fn, -0.55, 3.2, X, Y)];
  out.push(line(X(1.3), Y(2.3), X(1.3), Y(-2.2), { w: 1.2, dash: '5 4' }));
  // 标注 x = −b/(2a)
  const tx = X(1.3) + 8, ty = Y(1.9);
  out.push(text(tx, ty, 'x = −', I));
  out.push(text(tx + 48, ty - 9, 'b', { ...I, anchor: 'middle', size: 13 }), line(tx + 38, ty - 5, tx + 58, ty - 5, { w: 1 }), text(tx + 48, ty + 9, '2a', { ...I, anchor: 'middle', size: 13 }));
  out.push(text(X(0) - 14, Y(0) + 16, 'O', I));
  files['exam-2023-09.svg'] = svg(260, 210, out.join('\n'));
}

// ---------- 第 10 题：图 1 等边三角形，图 2 y 随 x 变化的图象 ----------
{
  const out = [];
  // 图 1
  const s = 110, B = [20, 150], Cc = [20 + s, 150], A = [20 + s / 2, 150 - (s * S3) / 2];
  out.push(poly([A, B, Cc]));
  out.push(label(A, 'A(P)', 0, -8), label(B, 'B', -6, 18), label(Cc, 'C', 6, 18));
  out.push(text(20 + s / 2, 185, '图 1', { anchor: 'middle', size: 13 }));
  // 图 2：P 先沿 A 到中心 O 的线段（PB = PC，y = 1），再沿 O 到 B 的线段
  const u = 22, ox = 200, oy = 150;
  const X = x => ox + u * x, Y = y => oy - u * 3 * y;
  out.push(line(ox - 10, oy, X(4 * S3) + 18, oy, { w: 1.5 }), line(ox, oy + 10, ox, Y(1.55), { w: 1.5 }));
  out.push(`<polygon points="${f(X(4 * S3) + 26)},${oy} ${f(X(4 * S3) + 18)},${oy - 4} ${f(X(4 * S3) + 18)},${oy + 4}" fill="${C.ink}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(1.55) - 8)} ${ox - 4},${f(Y(1.55))} ${ox + 4},${f(Y(1.55))}" fill="${C.ink}" stroke="none"/>`);
  const Ob = [3, S3], Bb = [0, 0], Cb = [6, 0], L = 2 * S3;
  const pts = [[X(0), Y(1)], [X(L), Y(1)]];
  for (let k = 1; k <= 60; k++) {
    const t = (L * k) / 60, P = [Ob[0] + (Bb[0] - Ob[0]) * t / L, Ob[1] + (Bb[1] - Ob[1]) * t / L];
    const y = Math.hypot(P[0] - Bb[0], P[1] - Bb[1]) / Math.hypot(P[0] - Cb[0], P[1] - Cb[1]);
    pts.push([X(L + t), Y(y)]);
  }
  out.push(polyline(pts));
  out.push(line(X(L), Y(1), X(L), oy, { w: 1.2, dash: '4 3' }));
  out.push(text(ox - 8, Y(1) + 5, '1', { anchor: 'end', size: 13 }), text(ox - 6, oy + 17, 'O', { ...I, anchor: 'end' }));
  out.push(text(X(L), oy + 18, '2√3', { anchor: 'middle', size: 13 }), text(X(2 * L) - 4, oy + 18, '4√3', { anchor: 'middle', size: 13 }));
  out.push(text(X(4 * S3) + 24, oy + 18, 'x', I), text(ox + 8, Y(1.55) - 2, 'y', I));
  out.push(text(X(L), 185, '图 2', { anchor: 'middle', size: 13 }));
  files['exam-2023-10.svg'] = svg(420, 200, out.join('\n'));
}

// ---------- 第 13 题：扇形统计图 ----------
{
  const O = [95, 95], r = 80;
  const parts = [['A', 8], ['B', 38], ['C', 26], ['D', 18], ['E', 10]];
  const out = [circle(O[0], O[1], r)];
  let a = 88;                                      // 从正上方开始，顺时针
  for (const [name, p] of parts) {
    const a1 = a - p * 3.6, mid = (a + a1) / 2;
    out.push(seg(O, [O[0] + r * Math.cos(rd(a)), O[1] - r * Math.sin(rd(a))], { w: 1.5 }));
    const lr = p < 12 ? 0.68 : 0.55;
    const L = [O[0] + lr * r * Math.cos(rd(mid)), O[1] - lr * r * Math.sin(rd(mid))];
    if (p < 12) {
      out.push(text(L[0], L[1] - 12, `${p}%`, { anchor: 'middle', size: 12 }), text(L[0], L[1] + 6, name, { anchor: 'middle', size: 12 }));
    } else {
      out.push(text(L[0], L[1] - 4, name, { anchor: 'middle', size: 13 }), text(L[0], L[1] + 14, `${p}%`, { anchor: 'middle', size: 13 }));
    }
    a = a1;
  }
  const lx = 200, ly = 30;
  out.push(`<rect x="${lx}" y="${ly}" width="120" height="124" fill="none" stroke="${C.ink}" stroke-width="1"/>`);
  ['A. x &lt; 200', 'B. 200 ≤ x &lt; 250', 'C. 250 ≤ x &lt; 300', 'D. 300 ≤ x &lt; 350', 'E. x ≥ 350'].forEach((s, i) => out.push(text(lx + 10, ly + 24 + i * 22, s, { size: 13 })));
  files['exam-2023-13.svg'] = svg(340, 190, out.join('\n'));
}

// ---------- 第 14 题：PA 与 ⊙O 相切于点 A ----------
{
  const u = 12, O = [80, 75], A = [80, 75 + 5 * u], P = [80 + 12 * u, 75 + 5 * u];
  const B = [O[0] + (5 / 13) * (P[0] - O[0]), O[1] + (5 / 13) * (P[1] - O[1])];
  const Cc = [A[0] + (10 / 3) * u, A[1]];
  const out = [circle(O[0], O[1], 5 * u), seg(O, A), seg(O, P), seg(A, P), seg(Cc, B), dot(...O, C.ink, 3)];
  out.push(label(O, 'O', -10, -6), label(A, 'A', -4, 20), label(P, 'P', 10, 18), label(B, 'B', 8, -6), label(Cc, 'C', 2, 20));
  files['exam-2023-14.svg'] = svg(250, 170, out.join('\n'));
}

// ---------- 第 17 题：服务质量得分统计图 ----------
{
  const jia = [7, 8, 6, 8, 7, 5, 8, 6, 8, 7], yi = [4, 8, 10, 6, 9, 5, 7, 5, 10, 6];
  const ox = 50, oy = 190, ux = 34, uy = 18;
  const X = i => ox + ux * i, Y = v => oy - 20 - uy * (v - 3);   // 0 到 4 之间折断
  const out = [];
  for (let v = 4; v <= 10; v++) out.push(line(ox, Y(v), X(10.6), Y(v), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(ox, oy, X(10.8), oy, { w: 1.5 }), line(ox, oy, ox, Y(4) + 10, { w: 1.5 }), line(ox, Y(4) - 2, ox, Y(11), { w: 1.5 }));
  out.push(polyline([[ox, Y(4) + 10], [ox - 5, Y(4) + 6], [ox + 5, Y(4) + 2], [ox, Y(4) - 2]], { w: 1.5 }));
  out.push(`<polygon points="${f(X(10.8) + 8)},${oy} ${f(X(10.8))},${oy - 4} ${f(X(10.8))},${oy + 4}" fill="${C.ink}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(11) - 8)} ${ox - 4},${f(Y(11))} ${ox + 4},${f(Y(11))}" fill="${C.ink}" stroke="none"/>`);
  out.push(text(ox - 8, oy + 5, '0', { anchor: 'end', size: 12 }));
  for (const v of [4, 6, 8, 10]) out.push(text(ox - 8, Y(v) + 4, String(v), { anchor: 'end', size: 12 }));
  for (let i = 1; i <= 10; i++) out.push(text(X(i), oy + 18, String(i), { anchor: 'middle', size: 12 }));
  out.push(text(ox - 8, Y(11) - 6, '得分', { anchor: 'middle', size: 12 }), text(X(10.8) + 12, oy + 18, '种植户编号', { size: 12 }));
  out.push(polyline(jia.map((v, i) => [X(i + 1), Y(v)]), { color: C.ink }));
  jia.forEach((v, i) => out.push(dot(X(i + 1), Y(v), C.ink, 3.5)));
  out.push(polyline(yi.map((v, i) => [X(i + 1), Y(v)]), { color: C.blue, dash: '6 4' }));
  const tri = (x, y, col) => `<polygon points="${f(x)},${f(y - 5)} ${f(x - 4.5)},${f(y + 3.5)} ${f(x + 4.5)},${f(y + 3.5)}" fill="${col}" stroke="none"/>`;
  yi.forEach((v, i) => out.push(tri(X(i + 1), Y(v), C.blue)));
  // 图例
  out.push(text(X(2), 18, '甲', { size: 13 }), line(X(2) + 18, 14, X(2) + 58, 14, { w: 2 }), dot(X(2) + 38, 14, C.ink, 3.5));
  out.push(text(X(5), 18, '乙', { size: 13, color: C.blue }), line(X(5) + 18, 14, X(5) + 58, 14, { color: C.blue, dash: '6 4' }), tri(X(5) + 38, 14, C.blue));
  files['exam-2023-17.svg'] = svg(500, 215, out.join('\n'));
}

// ---------- 第 18 题：△ABC，点 D 在 AC 上，AD = AB ----------
{
  const A = [70, 25], B = [35, 165], Cc = [225, 165];
  const ab = Math.hypot(B[0] - A[0], B[1] - A[1]), ac = Math.hypot(Cc[0] - A[0], Cc[1] - A[1]);
  const D = [A[0] + (Cc[0] - A[0]) * ab / ac, A[1] + (Cc[1] - A[1]) * ab / ac];
  const out = [poly([A, B, Cc]), dot(...D, C.ink, 3.5)];
  out.push(label(A, 'A', -4, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 10, -6));
  files['exam-2023-18.svg'] = svg(260, 190, out.join('\n'));
}

// ---------- 第 19 题：“鱼形”图案 ----------
{
  const u = 55, ox = 190, oy = 162;
  const { X, Y, body } = frame(ox, oy, u, -3.3, 4.3, -2.6, 2.6);
  const k = S3, xb = -0.8;
  const Ap = [S3, 1], Cp = [S3, -1], Dp = [2 * S3, 0], Bp = [xb, k / xb], Fp = [xb, -k / xb], Ep = [2 * xb, 0];
  const P = p => [X(p[0]), Y(p[1])];
  const out = [body];
  // 阴影：菱形 AOCD 去掉扇形 AOC；△OBF
  out.push(`<path d="M ${P(Ap).map(f).join(' ')} L ${P(Dp).map(f).join(' ')} L ${P(Cp).map(f).join(' ')} A ${2 * u} ${2 * u} 0 0 0 ${P(Ap).map(f).join(' ')} Z" fill="${C.emphFill}" stroke="none"/>`);
  out.push(poly([P([0, 0]), P(Bp), P(Fp)], { fill: C.emphFill, w: 0 }));
  out.push(plot(x => k / x, 0.62, 4.2, X, Y, { ymax: 2.8 }), plot(x => k / x, -3.3, -0.62, X, Y, { ymin: -2.8 }));
  out.push(poly([P([0, 0]), P(Ap), P(Dp), P(Cp)]), poly([P([0, 0]), P(Bp), P(Ep), P(Fp)]), seg(P(Bp), P(Fp)));
  out.push(arc([X(0), Y(0)], 2 * u, -30, 30, { w: 2 }));
  out.push(label(P(Ap), 'A', 4, -10), label(P(Cp), 'C', 0, 20), label(P(Dp), 'D', 4, 20), label(P(Ep), 'E', -10, -6), label(P(Fp), 'F', -8, -6), label(P(Bp), 'B', -10, 12));
  out.push(text(X(0) + 6, Y(0) + 18, 'O', I));
  files['exam-2023-19.svg'] = svg(440, 320, out.join('\n'));
}

// ---------- 第 20 题：测高仪测树高 ----------
{
  const G = [80, 330], F = [80, 230], A = [380, 230];
  const th = Math.atan(2 / 3);                     // ∠BAH，tan = BH / AB = 20 / 30
  const E = [80, 230 - 300 * Math.tan(th)];
  const s = 60;
  const uAB = [-Math.sin(th), Math.cos(th)], uAD = [Math.cos(th), Math.sin(th)];
  const B = [A[0] + s * uAB[0], A[1] + s * uAB[1]], D = [A[0] + s * uAD[0], A[1] + s * uAD[1]];
  const Cc = [B[0] + s * uAD[0], B[1] + s * uAD[1]];
  const H = [B[0] + (2 / 3) * s * uAD[0], B[1] + (2 / 3) * s * uAD[1]];
  const M = [A[0], H[1] + 20];
  const out = [];
  // 树冠：三层三角形
  const tiers = [[E[1] + 5, E[1] + 60, 34], [E[1] + 35, E[1] + 100, 44], [E[1] + 75, E[1] + 140, 54]];
  for (const [top, bot, hw] of tiers) out.push(poly([[80, top], [80 - hw, bot], [80 + hw, bot]], { fill: '#c9ccd1', color: '#c9ccd1', w: 1 }));
  out.push(`<rect x="72" y="${f(E[1] + 140)}" width="16" height="${f(G[1] - E[1] - 140)}" fill="#8c9096" stroke="none"/>`);
  out.push(seg(E, G, { w: 2 }));
  out.push(`<path d="M 20 ${G[1] + 2} Q 240 ${G[1] - 4} 460 ${G[1] - 14}" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`);
  out.push(seg(F, A, { w: 1.5, dash }), seg(E, A, { w: 1.5, dash }));
  out.push(rightAngle(F, A, G), rightAngle(G, [200, G[1]], F));
  out.push(poly([A, B, Cc, D], { fill: '#ffffff' }), seg(A, M, { w: 1.5 }), dot(...M, C.ink, 3.5));
  out.push(label(E, 'E', -12, 4), label(F, 'F', -14, 6), label(G, 'G', 0, 20), label(A, 'A', 4, -8), label(B, 'B', -12, 6), label(D, 'D', 12, 0));
  out.push(label(Cc, 'C', 12, 12), label(H, 'H', 10, 2), label(M, 'M', -12, 12));
  files['exam-2023-20.svg'] = svg(470, 360, out.join('\n'));
}

// ---------- 第 22 题：羽毛球的两种击球线路 ----------
{
  const { X, Y, body } = frame(40, 230, 55, -0.4, 6, -0.3, 3.8);
  const out = [body];
  out.push(plot(x => -0.4 * (x - 1) ** 2 + 3.2, 0, 2.75, X, Y), plot(x => -0.4 * x + 2.8, 0, 2.75, X, Y));
  out.push(line(X(3), Y(0), X(3), Y(1.3), { w: 2.5 }));
  out.push(line(X(5), Y(0), X(5), Y(0) - 7, { w: 1.5 }));
  out.push(text(X(0) - 8, Y(0) + 18, 'O', { ...I, anchor: 'end' }), text(X(0) - 8, Y(2.8) + 5, 'P', { ...I, anchor: 'end' }));
  out.push(label([X(3), Y(0)], 'A', 0, 20), label([X(5), Y(0)], 'C', 0, 20), label([X(3), Y(1.3)], 'B', 10, -4));
  out.push(text(X(0.9), Y(3.35) - 6, 'y = a(x − 1)² + 3.2', { ...I, size: 13 }));
  out.push(text(X(0.4), Y(1.75) + 4, 'y = −0.4x + 2.8', { ...I, size: 13 }));
  files['exam-2023-22.svg'] = svg(400, 260, out.join('\n'));
}

// ---------- 第 23 题图 1：网格中的四个三角形 ----------
{
  const u = 30, ox = 20 + 4 * u, oy = 20 + 3 * u;
  const X = x => ox + u * x, Y = y => oy - u * y;
  const out = [];
  for (let x = -4; x <= 8; x++) out.push(line(X(x), Y(-3), X(x), Y(3), { color: C.soft, w: 0.8, dash: '3 3' }));
  for (let y = -3; y <= 3; y++) out.push(line(X(-4), Y(y), X(8), Y(y), { color: C.soft, w: 0.8, dash: '3 3' }));
  out.push(line(X(-4.2), Y(0), X(8.3), Y(0), { w: 1.5 }), line(X(0), Y(-3.2), X(0), Y(3.3), { w: 1.5 }), line(X(4), Y(-3.2), X(4), Y(3.3), { w: 1.5 }));
  out.push(`<polygon points="${f(X(8.3) + 8)},${f(Y(0))} ${f(X(8.3))},${f(Y(0) - 4)} ${f(X(8.3))},${f(Y(0) + 4)}" fill="${C.ink}" stroke="none"/>`);
  out.push(`<polygon points="${f(X(0))},${f(Y(3.3) - 8)} ${f(X(0) - 4)},${f(Y(3.3))} ${f(X(0) + 4)},${f(Y(3.3))}" fill="${C.ink}" stroke="none"/>`);
  const tris = [
    [[-1, 1], [-2, 2], [-3, 1.5], ''],
    [[1, 1], [2, 2], [3, 1.5], '1'],
    [[1, -1], [2, -2], [3, -1.5], '2'],
    [[7, 1], [6, 2], [5, 1.5], '3'],
  ];
  const sub = (s, n) => n ? `${s}<tspan font-size="10" dy="4">${n}</tspan>` : s;
  for (const [a, b, c, n] of tris) {
    out.push(poly([[X(a[0]), Y(a[1])], [X(b[0]), Y(b[1])], [X(c[0]), Y(c[1])]], { w: 1.5 }));
    const up = a[1] > 0;
    out.push(label([X(a[0]), Y(a[1])], sub('A', n), n === '3' ? 8 : 4, up ? 18 : -6));
    out.push(label([X(b[0]), Y(b[1])], sub('B', n), 0, up ? -6 : 18));
    out.push(label([X(c[0]), Y(c[1])], sub('C', n), n === '3' ? -2 : n ? 8 : -10, up ? -6 : 16));
  }
  out.push(text(X(0) - 6, Y(0) + 16, 'O', { ...I, anchor: 'end' }), text(X(4) + 6, Y(0) + 16, 'M', I));
  out.push(text(X(8.3) + 4, Y(0) + 18, 'x', I), text(X(0) + 8, Y(3.3) - 2, 'y', I), text(X(4) + 6, Y(3.3) + 4, 'l', I));
  files['exam-2023-23-a.svg'] = svg(X(8.3) + 20, Y(-3) + 20, out.join('\n'));
}

// ---------- 第 23 题图 2：▱ABCD 与 P、P1、P2、P3 ----------
const sub = (s, n) => `${s}<tspan font-size="10" dy="4">${n}</tspan>`;
{
  const u = 50, ox = 40, oy = 210;
  const P = p => [ox + u * p[0], oy - u * p[1]];
  const al = rd(60), A = [0, 0], B = [4, 0], D = [3 * Math.cos(al), 3 * Math.sin(al)], Cq = [B[0] + D[0], D[1]];
  const Pp = [2.15, -1.67], P1 = [Pp[0], -Pp[1]];
  const refl = (p, a, d) => { const t = (p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]; const q = [a[0] + t * d[0], a[1] + t * d[1]]; return [2 * q[0] - p[0], 2 * q[1] - p[1]]; };
  const P2 = refl(P1, A, [Math.cos(al), Math.sin(al)]), P3 = [P1[0], 2 * D[1] - P1[1]];
  const out = [poly([P(A), P(B), P(Cq), P(D)]), seg(P(A), P(Pp)), seg(P(A), P(P2))];
  for (const q of [Pp, P1, P2, P3]) out.push(dot(...P(q), C.ink, 3));
  out.push(label(P(A), 'A', -12, 6), label(P(B), 'B', 6, 18), label(P(Cq), 'C', 10, -2), label(P(D), 'D', -4, -8));
  out.push(label(P(Pp), 'P', 12, 8), label(P(P1), sub('P', 1), 14, 14), label(P(P2), sub('P', 2), -14, -2), label(P(P3), sub('P', 3), 14, -4));
  files['exam-2023-23-b.svg'] = svg(350, 320, out.join('\n'));
}

// ---------- 第 23 题备用图 ----------
{
  const u = 58, ox = 30, oy = 185;
  const P = p => [ox + u * p[0], oy - u * p[1]];
  const al = rd(60), A = [0, 0], B = [4, 0], D = [3 * Math.cos(al), 3 * Math.sin(al)], Cq = [B[0] + D[0], D[1]];
  const ray = [4.3 * Math.cos(rd(-15)), 4.3 * Math.sin(rd(-15))], Pp = [1.6 * Math.cos(rd(-15)), 1.6 * Math.sin(rd(-15))];
  const out = [poly([P(A), P(B), P(Cq), P(D)]), seg(P(A), P(ray)), dot(...P(Pp), C.ink, 3)];
  out.push(label(P(A), 'A', -12, 6), label(P(B), 'B', 8, 16), label(P(Cq), 'C', 10, -2), label(P(D), 'D', -4, -8), label(P(Pp), 'P', 0, 20));
  files['exam-2023-23-c.svg'] = svg(380, 260, out.join('\n'));
}

export default files;
