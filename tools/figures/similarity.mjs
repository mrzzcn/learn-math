// 第八部分“相似”的图。
import { C, f, svg, text, line, seg, dot, poly, circle, arc, angleMark, rightAngle, tick, label, axes } from './lib.mjs';

const files = {};
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const add = (p, v) => [p[0] + v[0], p[1] + v[1]];

// ---------- 形状相同：只看角或只看边都不够 ----------
{
  const out = [];
  const s = 70, y0 = 30, y1 = y0 + s;
  // 正方形
  const Q = [[30, y1], [30 + s, y1], [30 + s, y0], [30, y0]];
  out.push(poly(Q));
  for (let i = 0; i < 4; i++) out.push(tick(Q[i], Q[(i + 1) % 4], 1));
  out.push(rightAngle(Q[0], Q[1], Q[3]));
  // 长方形：角和正方形一样，边不成比例
  const R = [[150, y1], [270, y1], [270, y0], [150, y0]];
  out.push(poly(R), rightAngle(R[0], R[1], R[3]), rightAngle(R[1], R[2], R[0]), rightAngle(R[2], R[3], R[1]), rightAngle(R[3], R[0], R[2]));
  out.push(rightAngle(Q[1], Q[2], Q[0]), rightAngle(Q[2], Q[3], Q[1]), rightAngle(Q[3], Q[0], Q[2]));
  // 菱形：边和正方形成比例，角不相等
  const h = s * Math.sin(Math.PI / 3), dx = s * Math.cos(Math.PI / 3);
  const M = [[330, y1], [330 + s, y1], [330 + s + dx, y1 - h], [330 + dx, y1 - h]];
  out.push(poly(M));
  for (let i = 0; i < 4; i++) out.push(tick(M[i], M[(i + 1) % 4], 1));
  out.push(angleMark(M[0], M[1], M[3], { r: 16 }), text(M[0][0] + 22, M[0][1] - 6, '60°', { size: 12, color: C.emph }));
  const cap = (x, a, b) => [text(x, 130, a, { anchor: 'middle' }), text(x, 150, b, { anchor: 'middle', size: 12, color: C.soft })].join('');
  out.push(cap(30 + s / 2, '正方形', ''), cap(210, '长方形', '角都相等，边不成比例'), cap(330 + (s + dx) / 2, '菱形', '边成比例，角不相等'));
  files['similarity-shapes.svg'] = svg(460, 160, out.join('\n'));
}

// ---------- 黄金矩形：截去一个正方形，剩下的和原来相似 ----------
{
  const L = 300, x = (Math.sqrt(5) - 1) / 2, w = L * x;
  const A = [30, 30 + w], B = [30 + L, 30 + w], Cc = [30 + L, 30], D = [30, 30];
  const E = [30 + w, A[1]], F = [30 + w, 30];
  const out = [];
  out.push(poly([E, B, Cc, F], { fill: C.blueFill, color: 'none', w: 0 }));
  // 继续截下去（虚线）：在剩下的长方形里反复截正方形
  let r = { x0: E[0], y0: 30, x1: B[0], y1: A[1] }, side = 0;
  for (let k = 0; k < 5; k++) {
    const wd = r.x1 - r.x0, ht = r.y1 - r.y0;
    if (side === 0) { const yy = r.y0 + wd; out.push(line(r.x0, yy, r.x1, yy, { color: C.soft, w: 1, dash: '4 3' })); r = { ...r, y0: yy }; }
    else if (side === 1) { const xx = r.x1 - ht; out.push(line(xx, r.y0, xx, r.y1, { color: C.soft, w: 1, dash: '4 3' })); r = { ...r, x1: xx }; }
    else if (side === 2) { const yy = r.y1 - wd; out.push(line(r.x0, yy, r.x1, yy, { color: C.soft, w: 1, dash: '4 3' })); r = { ...r, y1: yy }; }
    else { const xx = r.x0 + ht; out.push(line(xx, r.y0, xx, r.y1, { color: C.soft, w: 1, dash: '4 3' })); r = { ...r, x0: xx }; }
    side = (side + 1) % 4;
  }
  out.push(poly([A, B, Cc, D]), line(E[0], E[1], F[0], F[1], { color: C.emph, w: 2 }));
  out.push(poly([E, B, Cc, F], { color: C.blue, w: 2.5 }));
  out.push(label(A, 'A', -10, 16), label(B, 'B', 10, 16), label(Cc, 'C', 10, 0), label(D, 'D', -10, 0), label(E, 'E', 0, 18), label(F, 'F', 0, -8));
  out.push(text((A[0] + E[0]) / 2, A[1] + 18, 'x', { anchor: 'middle', italic: true, color: C.soft }));
  out.push(text((E[0] + B[0]) / 2, A[1] + 18, '1 − x', { anchor: 'middle', color: C.soft }));
  out.push(text(D[0] - 8, (A[1] + D[1]) / 2 + 5, 'x', { anchor: 'end', italic: true, color: C.soft }));
  files['similarity-golden.svg'] = svg(360, 30 + w + 30, out.join('\n'));
}

// ---------- 平行于三角形一边的直线：A 字型和 8 字型 ----------
const aShape = (o, t, nums) => {
  const A = add(o, [90, 0]), B = add(o, [0, 160]), Cc = add(o, [190, 160]);
  const D = lerp(A, B, t), E = lerp(A, Cc, t);
  const out = [poly([A, B, Cc]), line(D[0], D[1], E[0], E[1], { color: C.emph, w: 2.5 }), line(B[0], B[1], Cc[0], Cc[1], { color: C.emph, w: 2.5 })];
  out.push(angleMark(D, A, E, { r: 14, color: C.blue }), angleMark(B, A, Cc, { r: 14, color: C.blue }));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16), label(D, 'D', -12, 4), label(E, 'E', 12, 4));
  if (nums) {
    const m = (p, q, s, dx, dy) => text((p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy, s, { anchor: 'middle', color: C.soft, size: 13 });
    out.push(m(A, D, nums[0], -14, 0), m(D, B, nums[1], -14, 0), m(B, Cc, nums[2], 0, 18));
  }
  return out.join('');
};
{
  const out = [aShape([30, 30], 0.45)];
  // 过 A 作 l ∥ BC（虚线）：l、DE、BC 三条平行线截直线 AB、AC
  const lLine = (x1, x2, y) => line(x1, y, x2, y, { color: C.blue, w: 1.5, dash: '6 4' }) + text(x2 + 4, y + 5, 'l', { italic: true, color: C.blue });
  out.push(lLine(40, 205, 30));
  // 8 字型：D、E 在 BA、CA 的延长线上
  const A = [340, 100], B = [280, 200], Cc = [420, 200];
  const D = lerp(A, B, -0.6), E = lerp(A, Cc, -0.6);
  out.push(line(B[0], B[1], D[0], D[1]), line(Cc[0], Cc[1], E[0], E[1]));
  out.push(line(D[0], D[1], E[0], E[1], { color: C.emph, w: 2.5 }), line(B[0], B[1], Cc[0], Cc[1], { color: C.emph, w: 2.5 }));
  out.push(angleMark(D, A, E, { r: 14, color: C.blue }), angleMark(B, A, Cc, { r: 14, color: C.blue }));
  out.push(label(A, 'A', 14, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16), label(D, 'D', 8, -6), label(E, 'E', -8, -6));
  out.push(lLine(255, 425, A[1]));
  out.push(text(120, 225, 'A 字型', { anchor: 'middle', color: C.soft, size: 13 }), text(350, 225, '8 字型', { anchor: 'middle', color: C.soft, size: 13 }));
  files['similarity-parallel.svg'] = svg(460, 235, out.join('\n'));
}

// ---------- 预备定理的证明：作 EF ∥ AB ----------
{
  const A = [150, 30], B = [40, 200], Cc = [330, 200], t = 0.4;
  const D = lerp(A, B, t), E = lerp(A, Cc, t);
  const F = [B[0] + (E[0] - D[0]), B[1]];
  const out = [poly([D, B, F, E], { fill: C.blueFill, color: 'none', w: 0 }), poly([A, B, Cc])];
  out.push(line(D[0], D[1], E[0], E[1], { color: C.emph, w: 2.5 }), line(E[0], E[1], F[0], F[1], { color: C.blue, w: 2, dash: '6 4' }));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16), label(D, 'D', -12, 4), label(E, 'E', 12, 2), label(F, 'F', 0, 18));
  files['similarity-lemma.svg'] = svg(370, 225, out.join('\n'));
}

// ---------- 判定的证明思路：把小三角形放进大三角形 ----------
{
  const A = [100, 30], B = [30, 200], Cc = [230, 200], t = 0.6;
  const D = lerp(A, B, t), E = lerp(A, Cc, t);
  const shift = [195, 20];
  const A2 = add(A, shift), B2 = add(D, shift), C2 = add(E, shift);
  const out = [poly([A, B, Cc]), line(D[0], D[1], E[0], E[1], { color: C.blue, w: 1.5, dash: '6 4' })];
  out.push(label(A, 'A', 0, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16), label(D, 'D', -12, 4), label(E, 'E', 12, 4));
  // △A′B′C′ 实线留在原处；AD = A′B′ 用相同的记号
  out.push(poly([A2, B2, C2], { fill: C.emphFill, color: C.emph }), label(A2, 'A′', 0, -8, { color: C.emph }), label(B2, 'B′', -12, 12, { color: C.emph }), label(C2, 'C′', 12, 12, { color: C.emph }));
  out.push(tick(A, D, 1), tick(A2, B2, 1));
  // 移动的是虚线副本：属性里的初始位置设在 △ADE 处，PDF 不播放动画时起止两个位置都看得到
  const copy = poly([A2, B2, C2], { color: C.emph, w: 2, dash: '6 4' });
  out.push(`<g transform="translate(${-shift[0]} ${-shift[1]})">${copy}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${-shift[0]} ${-shift[1]};${-shift[0]} ${-shift[1]};0 0" keyTimes="0;0.2;0.5;0.8;1" dur="7s" repeatCount="indefinite"/></g>`);
  files['similarity-proof.svg'] = svg(410, 225, out.join('\n'));
}

// ---------- 面积比是相似比的平方 ----------
{
  const out = [];
  const tri = (o, s) => [o, add(o, [s, 0]), add(o, [0.35 * s, -0.8 * s])];
  const draw = (o, k, u) => {
    const [P, Q, R] = tri(o, k * u);
    out.push(poly([P, Q, R], { fill: C.emphFill }));
    for (let i = 1; i < k; i++) {
      const t = i / k;
      out.push(seg(lerp(P, Q, t), lerp(P, R, t), { w: 1, color: C.soft }), seg(lerp(Q, P, t), lerp(Q, R, t), { w: 1, color: C.soft }), seg(lerp(R, P, t), lerp(R, Q, t), { w: 1, color: C.soft }));
    }
    out.push(poly([P, Q, R]));
  };
  const u = 40, base = 150;
  draw([20, base], 1, u); draw([100, base], 2, u); draw([220, base], 3, u);
  const cap = (x, a, b) => text(x, base + 22, a, { anchor: 'middle', size: 13 }) + text(x, base + 40, b, { anchor: 'middle', size: 12, color: C.soft });
  out.push(cap(20 + u / 2, '相似比 1', '面积 1 份'), cap(100 + u, '相似比 2', '面积 4 份'), cap(220 + 1.5 * u, '相似比 3', '面积 9 份'));
  files['similarity-area.svg'] = svg(360, 200, out.join('\n'));
}

// ---------- 例 1：A 字型求线段长 ----------
{
  files['similarity-example.svg'] = svg(320, 225, aShape([60, 30], 0.6, ['3', '2', '10']));
}

// ---------- 例 2：直角三角形斜边上的高 ----------
{
  const s = 30, A = [30, 180], B = [30 + 10 * s, 180], D = [30 + 3.6 * s, 180], Cc = [D[0], 180 - 4.8 * s];
  const out = [poly([A, B, Cc]), line(Cc[0], Cc[1], D[0], D[1], { color: C.emph, w: 2.5 })];
  out.push(rightAngle(Cc, A, B), rightAngle(D, B, Cc));
  out.push(angleMark(A, B, Cc, { r: 20, color: C.blue }), angleMark(Cc, D, B, { r: 20, color: C.blue }));
  out.push(label(A, 'A', -10, 16), label(B, 'B', 10, 16), label(Cc, 'C', 0, -8), label(D, 'D', 0, 18));
  files['similarity-right.svg'] = svg(360, 205, out.join('\n'));
}

// ---------- 例 3：影子测高 ----------
{
  const s = 20, g = 190;
  const B = [60, g], A = [60, g - 8 * s], Cc = [60 + 6 * s, g];
  const E = [260, g], D = [260, g - 1.6 * s], F = [260 + 1.2 * s, g];
  const out = [line(20, g, 330, g, { color: C.soft, w: 1.5 })];
  out.push(line(A[0], A[1], Cc[0], Cc[1], { color: C.blue, w: 1.5, dash: '6 4' }), line(D[0], D[1], F[0], F[1], { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(line(A[0], A[1], B[0], B[1], { w: 3 }), line(D[0], D[1], E[0], E[1], { w: 3 }));
  out.push(line(B[0], B[1], Cc[0], Cc[1], { color: C.emph, w: 3 }), line(E[0], E[1], F[0], F[1], { color: C.emph, w: 3 }));
  out.push(rightAngle(B, A, Cc), rightAngle(E, D, F));
  out.push(angleMark(Cc, A, B, { r: 20, color: C.blue }), angleMark(F, D, E, { r: 12, color: C.blue }));
  // 平行的太阳光
  for (let i = 0; i < 3; i++) { const p = [150 + i * 50, 20], v = [Cc[0] - A[0], Cc[1] - A[1]], l = Math.hypot(...v); out.push(line(p[0], p[1], p[0] + 36 * v[0] / l, p[1] + 36 * v[1] / l, { color: C.soft, w: 1 })); }
  out.push(label(A, 'A', -10, 4), label(B, 'B', -10, 16), label(Cc, 'C', 0, 18), label(D, 'D', -10, 4), label(E, 'E', -6, 18), label(F, 'F', 6, 18));
  out.push(text((B[0] + Cc[0]) / 2, g - 8, '6 m', { anchor: 'middle', color: C.emph, size: 12 }));
  out.push(text(D[0] - 10, (D[1] + E[1]) / 2 + 4, '1.6 m', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text((E[0] + F[0]) / 2 + 8, g + 34, '1.2 m', { anchor: 'middle', color: C.emph, size: 12 }));
  files['similarity-shadow.svg'] = svg(350, 230, out.join('\n'));
}

// ---------- 例 4：测河宽（8 字型） ----------
{
  const s = 2.6, bank = 170, far = bank - 60 * s;
  const Q = [60, bank], P = [60, far], R = [60 + 40 * s, bank], S = [60 + 60 * s, bank], T = [S[0], bank + 30 * s];
  const out = [];
  out.push(`<rect x="20" y="${f(far - 12)}" width="310" height="${f(bank - far + 12)}" fill="${C.blueFill}" stroke="none"/>`);
  out.push(line(20, bank, 330, bank, { color: C.soft, w: 1.5 }), line(20, far, 330, far, { color: C.soft, w: 1.5 }));
  out.push(line(P[0], P[1], Q[0], Q[1], { color: C.emph, w: 2.5 }), line(Q[0], Q[1], S[0], S[1]), line(S[0], S[1], T[0], T[1]));
  out.push(line(P[0], P[1], T[0], T[1], { color: C.ink, w: 1.5, dash: '6 4' }));
  out.push(rightAngle(Q, P, R), rightAngle(S, R, T));
  out.push(angleMark(R, Q, P, { r: 14, color: C.blue }), angleMark(R, S, T, { r: 14, color: C.blue }));
  out.push(dot(...P), dot(...Q), dot(...R), dot(...S), dot(...T));
  out.push(label(P, 'P', -12, 4), label(Q, 'Q', -12, 16), label(R, 'R', -10, 17), label(S, 'S', 12, -6), label(T, 'T', 12, 4));
  out.push(text((Q[0] + R[0]) / 2, bank + 18, '40 m', { anchor: 'middle', color: C.soft, size: 12 }), text((R[0] + S[0]) / 2, bank - 7, '20 m', { anchor: 'middle', color: C.soft, size: 12 }), text(S[0] + 8, (S[1] + T[1]) / 2 + 12, '30 m', { color: C.soft, size: 12 }));
  out.push(text(300, far + 30, '河', { anchor: 'middle', color: C.blue, size: 13 }));
  files['similarity-river.svg'] = svg(350, T[1] + 20, out.join('\n'));
}

// ---------- 位似：以 O 为中心放大到 2 倍 ----------
{
  const O = [25, 205], k = 2;
  const A = [70, 110], B = [70, 175], Cc = [130, 170];
  const img = p => lerp(O, p, k);
  const [A2, B2, C2] = [A, B, Cc].map(img);
  const out = [];
  for (const p of [A2, B2, C2]) out.push(line(O[0], O[1], ...lerp(O, p, 1.08), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(poly([A2, B2, C2], { color: C.blue }), poly([A, B, Cc]));
  // 动画：三角形从 O 出发放大（线宽不随缩放变化）
  const tri = `<polygon points="${[A, B, Cc].map(p => [p[0] - O[0], p[1] - O[1]].map(f).join(',')).join(' ')}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
  out.push(`<g transform="translate(${O[0]} ${O[1]})"><g>${tri}<animateTransform attributeName="transform" type="scale" values="1;1;${k};${k};1" keyTimes="0;0.15;0.5;0.8;1" dur="7s" repeatCount="indefinite"/></g></g>`);
  out.push(dot(...O));
  out.push(label(O, 'O', -10, 16), label(A, 'A', -10, -2), label(B, 'B', -10, 14), label(Cc, 'C', 6, 18));
  out.push(label(A2, 'A′', -12, 6, { color: C.blue }), label(B2, 'B′', 14, -4, { color: C.blue }), label(C2, 'C′', 10, 18, { color: C.blue }));
  files['similarity-homothety.svg'] = svg(320, 225, out.join('\n'));
}

// ---------- 坐标系中的位似 ----------
{
  const { X, Y, body } = axes({ ox: 140, oy: 170, u: 28, xmin: -4.5, xmax: 7, ymin: -3, ymax: 5, ticks: false });
  const P = [[2, 4], [6, 4], [4, 2]];
  const pts = s => P.map(([x, y]) => [X(s * x), Y(s * y)]);
  const out = [body];
  // 刻度数字：跳过紧挨原点 O 的 −1 和挨着 x 轴箭头的 7
  const fmt = v => (v < 0 ? '−' + -v : String(v));
  for (let x = -4; x <= 6; x++) if (x && x !== -1) out.push(text(X(x), Y(0) + 16, fmt(x), { anchor: 'middle', color: C.soft, size: 11 }));
  for (let y = -3; y <= 5; y++) if (y && y !== -1) out.push(text(X(0) - 6, Y(y) + 4, fmt(y), { anchor: 'end', color: C.soft, size: 11 }));
  for (const [x, y] of P) out.push(line(X(-x / 2), Y(-y / 2), X(x), Y(y), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(poly(pts(1), { fill: C.blueFill, color: C.blue }), poly(pts(0.5), { fill: C.emphFill, color: C.emph }), poly(pts(-0.5), { fill: C.emphFill, color: C.emph }));
  const n = ['A', 'B', 'C'];
  const off = [[-8, -8], [10, -4], [4, 18]];
  pts(1).forEach((p, i) => out.push(label(p, n[i], off[i][0], off[i][1], { color: C.blue })));
  pts(0.5).forEach((p, i) => out.push(label(p, n[i] + '′', [-8, -6, 4][i], [-8, -7, 18][i], { color: C.emph, size: 13 })));
  pts(-0.5).forEach((p, i) => out.push(label(p, n[i] + '″', [6, -6, -12][i], [18, 18, 2][i], { color: C.emph, size: 13 })));
  files['similarity-coordinates.svg'] = svg(360, 270, out.join('\n'));
}

// ---------- 坐标系中的位似：为什么对应点是 (kx, ky) ----------
// 以 k = 2 为例：A(3, 2)，A′(6, 4)。从 A、A′ 向 x 轴作垂线，两个直角三角形位似，直角边都乘 k。
{
  const { X, Y, body } = axes({ ox: 30, oy: 190, u: 38, xmin: 0, xmax: 7, ymin: 0, ymax: 4.6, ticks: false, grid: false });
  const A = [X(3), Y(2)], A2 = [X(6), Y(4)], M = [X(3), Y(0)], M2 = [X(6), Y(0)], O = [X(0), Y(0)];
  const out = [body];
  out.push(line(...O, ...A2, { color: C.soft, w: 1, dash: '4 3' }));
  out.push(poly([O, M2, A2], { fill: C.blueFill, color: C.blue, w: 2 }), poly([O, M, A], { fill: C.emphFill, color: C.emph, w: 2 }));
  out.push(rightAngle(M, O, A, { size: 8 }), rightAngle(M2, O, A2, { size: 8 }));
  out.push(dot(...A, C.emph), dot(...A2, C.blue));
  out.push(label(A, 'A(x, y)', -34, -4, { color: C.emph, size: 13 }), label(A2, 'A′(kx, ky)', -44, -4, { color: C.blue, size: 13 }));
  out.push(text(A[0] + 6, (A[1] + M[1]) / 2 + 5, 'y', { italic: true, color: C.emph, size: 13 }), text(A2[0] + 6, (A2[1] + M2[1]) / 2 + 5, 'ky', { italic: true, color: C.blue, size: 13 }));
  // 横向的两段：x 和 kx，画成坐标轴下方的尺寸线
  const dim = (x1, x2, y, s, color) => line(x1, y, x2, y, { color, w: 1 }) + line(x1, y - 4, x1, y + 4, { color, w: 1 }) + line(x2, y - 4, x2, y + 4, { color, w: 1 }) + text((x1 + x2) / 2, y + 14, s, { italic: true, anchor: 'middle', color, size: 13 });
  out.push(dim(O[0], M[0], O[1] + 26, 'x', C.emph), dim(O[0], M2[0], O[1] + 54, 'kx', C.blue));
  files['similarity-coordinates-why.svg'] = svg(330, 270, out.join('\n'));
}

// ---------- 合比：两条边按同样的比例切开 ----------
// A 字型：AD = 2，DB = 3，AE = 4，EC = 6，DE ∥ BC。两条边都分成 5 份，D、E 都在第 2 份处。
{
  const out = [];
  const A = [230, 26], u = 46;                         // AB 上 1 个单位 = 46 像素（AC 上每单位画成一半长，两条边画得差不多长）
  const dirB = [-Math.sin(0.42), Math.cos(0.42)], dirC = [Math.sin(0.62), Math.cos(0.62)];
  const onB = t => [A[0] + dirB[0] * u * t, A[1] + dirB[1] * u * t];        // t：AB 上的长度
  const onC = t => [A[0] + dirC[0] * u * 0.5 * t, A[1] + dirC[1] * u * 0.5 * t]; // AC 上每单位画短一些，免得图太大
  const B = onB(5), Cc = onC(10), D = onB(2), E = onC(4);
  // 两条边：AD、AE 珊瑚色，DB、EC 蓝色
  out.push(seg(B, Cc, { w: 2 }), seg(D, E, { w: 2, color: C.ink, dash: '6 4' }));
  out.push(seg(A, D, { color: C.emph, w: 4 }), seg(D, B, { color: C.blue, w: 4 }));
  out.push(seg(A, E, { color: C.emph, w: 4 }), seg(E, Cc, { color: C.blue, w: 4 }));
  // 每条边的 5 份刻度
  const tickAt = (p, dir) => { const n = [-dir[1], dir[0]]; return line(p[0] - 5 * n[0], p[1] - 5 * n[1], p[0] + 5 * n[0], p[1] + 5 * n[1], { color: C.ink, w: 1 }); };
  for (let k = 1; k < 5; k++) out.push(tickAt(onB(k), dirB), tickAt(onC(2 * k), dirC));
  out.push(dot(...A), dot(...B), dot(...Cc), dot(...D), dot(...E));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', -14, 4), label(E, 'E', 14, 4));
  // 长度
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const lenL = (p, q, s, color) => text(mid(p, q)[0] - 14, mid(p, q)[1] + 4, s, { anchor: 'end', color, size: 13 });
  const lenR = (p, q, s, color) => text(mid(p, q)[0] + 14, mid(p, q)[1] + 4, s, { color, size: 13 });
  out.push(lenL(A, D, '2', C.emph), lenL(D, B, '3', C.blue), lenR(A, E, '4', C.emph), lenR(E, Cc, '6', C.blue));
  files['similarity-ratio-parts.svg'] = svg(460, 280, out.join('\n'));
}

export default files;
