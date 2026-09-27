// 第五部分“勾股定理”的图。
import { C, f, svg, text, line, seg, dot, poly, rightAngle, tick, label, arc, angleMark } from './lib.mjs';

const files = {};
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const along = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const TRI = '#dbe5f1'; // 拼图用的三角形：不透明的浅蓝，移动时能盖住后面的面积

// ---------- 从哪里来：方格纸上三边的正方形 ----------
// 直角顶点 C 在格点 (0, 0)，CA = 4 沿横线，CB = 3 沿竖线；斜边上的正方形四个顶点也都在格点上：
// B(0, 3)、A(4, 0)、(7, 4)、(3, 7)。它斜放着，格线把它切得零零碎碎，没法直接数。
// 两张图共用这些形状，坐标原点和单位长度各自设定（setP）
let PY = { u: 26, ox: 114, oy: 218 };
const setP = o => { PY = o; };
const PP = (x, y) => [PY.ox + PY.u * x, PY.oy - PY.u * y];
const gridPaper = (x0, x1, y0, y1) => {
  const g = [];
  for (let x = x0; x <= x1; x++) g.push(seg(PP(x, y0), PP(x, y1), { color: C.grid, w: 1 }));
  for (let y = y0; y <= y1; y++) g.push(seg(PP(x0, y), PP(x1, y), { color: C.grid, w: 1 }));
  return g.join('');
};
const SQ = () => ({
  leg3: [PP(0, 0), PP(0, 3), PP(-3, 3), PP(-3, 0)],   // BC 左边，边长 3
  leg4: [PP(0, 0), PP(4, 0), PP(4, -4), PP(0, -4)],   // AC 下面，边长 4
  hyp: [PP(4, 0), PP(7, 4), PP(3, 7), PP(0, 3)],      // AB 外侧，边长 5
});
const ctr = q => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2 + 6];
const cellLines = (x0, x1, y0, y1) => {
  const g = [];
  for (let x = x0 + 1; x < x1; x++) g.push(seg(PP(x, y0), PP(x, y1), { color: C.blue, w: 0.7, extra: ' opacity="0.5"' }));
  for (let y = y0 + 1; y < y1; y++) g.push(seg(PP(x0, y), PP(x1, y), { color: C.blue, w: 0.7, extra: ' opacity="0.5"' }));
  return g.join('');
};
const triangleABC = () => [poly([PP(0, 0), PP(4, 0), PP(0, 3)], { w: 2.5 }), rightAngle(PP(0, 0), PP(4, 0), PP(0, 3)),
  label(PP(0, 0), 'C', -10, 16), label(PP(4, 0), 'A', 10, 16), label(PP(0, 3), 'B', -10, -6)].join('');

// 图一：两条直角边上的正方形能数格子，斜边上的不能
{
  setP({ u: 26, ox: 114, oy: 218 });
  const Q = SQ();
  const out = [gridPaper(-4, 8, -5, 8)];
  out.push(poly(Q.leg3, { fill: C.blueFill, color: C.blue, w: 1.5 }), cellLines(-3, 0, 0, 3));
  out.push(poly(Q.leg4, { fill: C.blueFill, color: C.blue, w: 1.5 }), cellLines(0, 4, -4, 0));
  out.push(poly(Q.hyp, { fill: C.emphFill, color: C.emph, w: 1.5 }));
  out.push(triangleABC());
  out.push(text(...ctr(Q.leg3), '9', { anchor: 'middle', color: C.blue, size: 16 }), text(...ctr(Q.leg4), '16', { anchor: 'middle', color: C.blue, size: 16 }));
  out.push(text(...ctr(Q.hyp), '?', { anchor: 'middle', color: C.emph, size: 22 }));
  files['pythagorean-squares.svg'] = svg(332, 358, out.join('\n'));
}

// 图二：沿格线套一个 7 × 7 的大正方形，减去四个角上的直角三角形（其中一个就是 △ABC）
{
  setP({ u: 34, ox: 44, oy: 282 });
  const Q = SQ();
  const out = [gridPaper(-1, 8, -1, 8)];
  const frame = [PP(0, 0), PP(7, 0), PP(7, 7), PP(0, 7)];
  out.push(poly(frame, { color: C.blue, w: 2, dash: '7 4' }));
  out.push(poly(Q.hyp, { fill: C.emphFill, color: C.emph, w: 2 }));
  const tris = [
    [PP(0, 0), PP(4, 0), PP(0, 3)],   // △ABC 本身
    [PP(7, 0), PP(7, 4), PP(4, 0)],
    [PP(7, 7), PP(3, 7), PP(7, 4)],
    [PP(0, 7), PP(0, 3), PP(3, 7)],
  ];
  const dur = 8;
  tris.forEach((t, k) => {
    const t0 = (0.1 + k * 0.12).toFixed(2), t1 = (0.16 + k * 0.12).toFixed(2);
    const c = ctr([t[0], t[1], t[1], t[2]]);
    const g = poly(t, { fill: '#dbe5f1', color: C.ink, w: 1.2 }) + text((t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3 + 5, '6', { anchor: 'middle', color: C.soft, size: 13 });
    out.push(`<g>${g}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${t0};${t1};1" dur="${dur}s" repeatCount="indefinite"/></g>`);
  });
  out.push(triangleABC());
  out.push(text(...ctr(Q.hyp).map((v, i) => v - (i ? 4 : 0)), '25', { anchor: 'middle', color: C.emph, size: 18 }));
  // 大正方形每条边都分成 3 和 4 两段
  const lab = (x, y, s, dx = 0, dy = 0) => text(PP(x, y)[0] + dx, PP(x, y)[1] + dy, s, { anchor: 'middle', color: C.blue, size: 13 });
  out.push(lab(5.5, 0, '3', 0, 16), lab(7, 2, '4', 12, 4), lab(5, 7, '4', 0, -6), lab(0, 5, '4', -12, 4));
  out.push(lab(2, 0, '4', 0, 16), lab(7, 5.5, '3', 12, 4), lab(1.5, 7, '3', 0, -6), lab(0, 1.5, '3', -12, 4));
  files['pythagorean-frame.svg'] = svg(326, 326, out.join('\n'));
}

// ---------- 拼图证明：同样四个三角形，两种摆法 ----------
{
  const a = 3, b = 4, n = a + b, u = 26, top = 30;
  const panel = x0 => (x, y) => [x0 + u * x, top + u * (n - y)];
  const L = panel(30), R = panel(270);
  // 摆法一（中间空出边长 c 的正方形）：直角顶点、长 a 的直角边端点、长 b 的直角边端点
  const T1 = [[0, 0], [3, 0], [0, 4]], T2 = [[7, 0], [7, 3], [3, 0]], T3 = [[7, 7], [4, 7], [7, 3]], T4 = [[0, 7], [0, 4], [4, 7]];
  // 摆法二：T2 不动，其余三个平移（数学坐标里的平移量）
  const moves = [[T1, [0, 3]], [T2, [0, 0]], [T3, [-4, 0]], [T4, [3, -4]]];
  const out = [];
  // 左：摆法一
  out.push(poly([L(0, 0), L(7, 0), L(7, 7), L(0, 7)], { w: 2 }));
  out.push(poly([L(3, 0), L(7, 3), L(4, 7), L(0, 4)], { fill: C.emphFill, color: C.emph, w: 2 }));
  for (const T of [T1, T2, T3, T4]) out.push(poly(T.map(p => L(...p)), { fill: TRI, color: C.ink, w: 1.5 }));
  out.push(text(...L(3.5, 3.5).map((v, i) => v + (i ? 6 : 0)), 'c²', { anchor: 'middle', color: C.emph, size: 18 }));
  // 左图边上的 a、b、c
  out.push(text(...L(1.5, 0).map((v, i) => v + (i ? 18 : 0)), 'a', { anchor: 'middle', italic: true }), text(...L(5, 0).map((v, i) => v + (i ? 18 : 0)), 'b', { anchor: 'middle', italic: true }));
  out.push(text(...L(0, 2).map((v, i) => v - (i ? 0 : 12)), 'b', { anchor: 'middle', italic: true }), text(...L(0, 5.5).map((v, i) => v - (i ? 0 : 12)), 'a', { anchor: 'middle', italic: true }));
  out.push(text(...L(1.2, 1.7), 'c', { anchor: 'middle', italic: true, color: C.emph }));
  // 右：摆法二（空出 a² 和 b²），三角形从摆法一移过来
  out.push(poly([R(0, 0), R(7, 0), R(7, 7), R(0, 7)], { w: 2 }));
  const fade = `<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.85;1" dur="9s" repeatCount="indefinite"/>`;
  out.push(`<g>${poly([R(0, 0), R(3, 0), R(3, 3), R(0, 3)], { fill: C.blueFill, color: C.blue, w: 2 })}${poly([R(3, 3), R(7, 3), R(7, 7), R(3, 7)], { fill: C.blueFill, color: C.blue, w: 2 })}${text(...R(1.5, 1.5).map((v, i) => v + (i ? 6 : 0)), 'a²', { anchor: 'middle', color: C.blue, size: 18 })}${text(...R(5, 5).map((v, i) => v + (i ? 6 : 0)), 'b²', { anchor: 'middle', color: C.blue, size: 18 })}${fade}</g>`);
  for (const [T, d] of moves) {
    const dx = f(d[0] * u), dy = f(-d[1] * u);
    const body = poly(T.map(p => R(...p)), { fill: TRI, color: C.ink, w: 1.5 });
    if (!d[0] && !d[1]) { out.push(body); continue; }
    out.push(`<g transform="translate(${dx} ${dy})">${body}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${dx} ${dy};${dx} ${dy};0 0" keyTimes="0;0.15;0.45;0.85;1" dur="9s" repeatCount="indefinite"/></g>`);
  }
  out.push(text(...R(1.5, 0).map((v, i) => v + (i ? 18 : 0)), 'a', { anchor: 'middle', italic: true }), text(...R(5, 0).map((v, i) => v + (i ? 18 : 0)), 'b', { anchor: 'middle', italic: true }));
  out.push(text(...R(0, 1.5).map((v, i) => v - (i ? 0 : 12)), 'a', { anchor: 'middle', italic: true }), text(...R(0, 5).map((v, i) => v - (i ? 0 : 12)), 'b', { anchor: 'middle', italic: true }));
  files['pythagorean-rearrange.svg'] = svg(470, 240, out.join('\n'));
}

// ---------- 赵爽弦图 ----------
{
  const u = 40, x0 = 70, y0 = 20;
  const P = (x, y) => [x0 + u * x, y0 + u * (5 - y)];
  const rot = ([x, y]) => [5 - y, x]; // 绕中心 (2.5, 2.5) 逆时针转 90°
  let T = [[0, 0], [5, 0], [3.2, 2.4]]; // 斜边在下边，直角顶点 (3.2, 2.4)
  const tris = [];
  for (let k = 0; k < 4; k++) { tris.push(T); T = T.map(rot); }
  const inner = tris.map(t => t[2]);
  const out = [];
  out.push(poly([P(0, 0), P(5, 0), P(5, 5), P(0, 5)], { fill: C.emphFill, color: C.emph, w: 2.5 }));
  for (const t of tris) out.push(poly(t.map(p => P(...p)), { fill: TRI, color: C.ink, w: 1.5 }));
  out.push(poly(inner.map(p => P(...p)), { fill: '#ffffff', color: C.blue, w: 2 }));
  out.push(rightAngle(P(...tris[0][2]), P(0, 0), P(5, 0), { size: 8 }));
  // 第一个三角形的边：直角顶点到 (0,0) 长 4 = b，到 (5,0) 长 3 = a
  const t0 = tris[0].map(p => P(...p));
  out.push(text(t0[0][0] + (t0[2][0] - t0[0][0]) / 2 - 4, t0[0][1] + (t0[2][1] - t0[0][1]) / 2 - 8, 'b', { anchor: 'middle', italic: true }));
  out.push(text(t0[1][0] + (t0[2][0] - t0[1][0]) / 2 + 10, t0[1][1] + (t0[2][1] - t0[1][1]) / 2 + 2, 'a', { anchor: 'middle', italic: true }));
  out.push(text(...P(2.5, 0).map((v, i) => v + (i ? 18 : 0)), 'c', { anchor: 'middle', italic: true, color: C.emph }));
  const ic = inner.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  out.push(text(P(...ic)[0] + 38, P(...ic)[1] - 26, 'b − a', { anchor: 'start', color: C.blue, size: 12 }));
  out.push(line(P(...ic)[0] + 36, P(...ic)[1] - 30, P(...ic)[0] + 8, P(...ic)[1] - 8, { color: C.blue, w: 1 }));
  files['pythagorean-zhao.svg'] = svg(340, 240, out.join('\n'));
}

// ---------- 梯子下滑 ----------
{
  const s = 9, wx = 60, gy = 240; // 1 m = 9 像素，墙在 x = wx，地面 y = gy；云梯长 25 m
  const top = h => [wx, gy - s * h], foot = h => [wx + s * Math.sqrt(625 - h * h), gy];
  const h1 = 24, h2 = 20;
  const out = [];
  out.push(`<rect x="${wx - 14}" y="10" width="14" height="${gy - 10}" fill="${C.grid}" stroke="none"/>`);
  out.push(line(wx, 10, wx, gy, { w: 2 }), line(wx - 14, gy, 330, gy, { w: 2 }));
  out.push(seg(top(h1), foot(h1), { color: C.soft, w: 2, dash: '6 4' }));
  out.push(seg(top(h2), foot(h2), { color: C.emph, w: 3 }));
  // 动的梯子：顶端从 24 m 滑到 20 m，每一帧都保持长 25 m
  const hs = []; for (let i = 0; i <= 8; i++) hs.push(h1 - (h1 - h2) * i / 8);
  const seq = [...hs, ...hs.slice().reverse()];
  const kt = seq.map((_, i) => f(i < 9 ? 0.1 + 0.35 * i / 8 : 0.55 + 0.35 * (i - 9) / 8));
  const vals = g => [g(h1), ...seq.map(g), g(h1)].map(f).join(';');
  const keyTimes = ['0', ...kt, '1'].join(';');
  out.push(`<line x1="${wx}" y1="${f(top(h2)[1])}" x2="${f(foot(h2)[0])}" y2="${gy}" stroke="${C.blue}" stroke-width="3" opacity="0"><animate attributeName="y1" values="${vals(h => top(h)[1])}" keyTimes="${keyTimes}" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="${vals(h => foot(h)[0])}" keyTimes="${keyTimes}" dur="8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1" dur="8s" repeatCount="indefinite"/></line>`);
  out.push(rightAngle([wx, gy], [wx + 10, gy], [wx, gy - 10]));
  out.push(dot(...top(h1)), dot(...foot(h1)), dot(...top(h2), C.emph), dot(...foot(h2), C.emph));
  out.push(label([wx, gy], 'O', -10, 18), label(top(h1), 'A', -22, 6), label(foot(h1), 'B', 0, 20), label(top(h2), 'A′', -22, 6, { color: C.emph }), label(foot(h2), 'B′', 0, 20, { color: C.emph }));
  // 尺寸
  out.push(text(wx + 30, (top(h1)[1] + top(h2)[1]) / 2 + 5, '下滑 4 m', { size: 12, color: C.soft }));
  out.push(text((foot(h1)[0] + foot(h2)[0]) / 2, gy - 8, '？', { anchor: 'middle', size: 12, color: C.soft }));
  files['pythagorean-ladder.svg'] = svg(340, 270, out.join('\n'));
}

// ---------- 引葭赴岸：题干图只标池宽 10 和露出的 1；解法图标 x、x + 1、5 ----------
for (const solve of [false, true]) {
  const s = 13, cx = 190, wy = 60, depth = 12, half = 5;
  const A = [cx, wy + s * depth], Cc = [cx, wy], B = [cx + s * half, wy], D = [cx, wy - s];
  const th = Math.atan2(half, depth) * 180 / Math.PI;
  const out = [];
  out.push(`<rect x="${cx - s * half}" y="${wy}" width="${2 * s * half}" height="${s * depth}" fill="${C.blueFill}" stroke="none"/>`);
  out.push(line(cx - s * half - 60, wy, cx - s * half, wy, { w: 1.5 }), line(cx + s * half, wy, cx + s * half + 60, wy, { w: 1.5 }));
  out.push(`<polyline points="${f(cx - s * half)},${wy} ${f(cx - s * half)},${f(A[1])} ${f(cx + s * half)},${f(A[1])} ${f(cx + s * half)},${wy}" stroke="${C.ink}" stroke-width="1.5" fill="none"/>`);
  out.push(line(cx - s * half, wy, cx + s * half, wy, { color: C.blue, w: 1.2, dash: '5 4' }));
  out.push(seg(A, D, { color: C.soft, w: 2, dash: '6 4' }));
  out.push(`<g transform="rotate(${f(th)} ${A[0]} ${f(A[1])})">${seg(A, D, { color: C.ink, w: 3 })}<animateTransform attributeName="transform" type="rotate" values="0 ${A[0]} ${f(A[1])};0 ${A[0]} ${f(A[1])};${f(th)} ${A[0]} ${f(A[1])};${f(th)} ${A[0]} ${f(A[1])};0 ${A[0]} ${f(A[1])}" keyTimes="0;0.15;0.45;0.85;1" dur="7s" repeatCount="indefinite"/></g>`);
  out.push(seg(A, B, { color: C.emph, w: 2 }), rightAngle(Cc, B, A));
  out.push(dot(...A), dot(...Cc), dot(...B), dot(...D));
  out.push(label(A, 'A', 0, 20), label(Cc, 'C', -12, 16), label(B, 'B', 12, -6), label(D, 'D', 12, -2));
  out.push(text(cx - 8, wy - 1, '1', { anchor: 'end', size: 12 }));
  if (solve) {
    out.push(text(cx - 8, (A[1] + Cc[1]) / 2, 'x', { anchor: 'end', italic: true }), text((Cc[0] + B[0]) / 2, wy - 8, '5', { anchor: 'middle' }));
    out.push(text((A[0] + B[0]) / 2 + 12, (A[1] + B[1]) / 2, '<tspan font-style="italic">x</tspan> + 1', { color: C.emph })); // 只有 x 用斜体，免得 1 看成 l
  } else {
    // 池底下方的尺寸线：池宽 10 尺
    const yb = A[1] + 36, x0 = cx - s * half, x1 = cx + s * half;
    out.push(line(x0, yb, x1, yb, { color: C.soft, w: 1 }), line(x0, yb - 5, x0, yb + 5, { color: C.soft, w: 1 }), line(x1, yb - 5, x1, yb + 5, { color: C.soft, w: 1 }));
    out.push(text(cx, yb + 18, '10', { anchor: 'middle', color: C.soft }));
  }
  files[solve ? 'pythagorean-reed-solution.svg' : 'pythagorean-reed.svg'] = svg(360, solve ? 240 : 285, out.join('\n'));
}

// ---------- 折叠长方形 ----------
{
  const u = 20, x0 = 60, y0 = 30;
  const P = (x, y) => [x0 + u * x, y0 + u * (8 - y)];
  const A = [0, 8], B = [0, 0], Cc = [10, 0], D = [10, 8], E = [10, 3], F = [6, 0];
  const pA = P(...A), pE = P(...E);
  const ang = Math.atan2(pE[1] - pA[1], pE[0] - pA[0]) * 180 / Math.PI;
  const out = [];
  out.push(poly([P(...A), P(...B), P(...Cc), P(...D)]));
  out.push(poly([P(...A), P(...D), P(...E)], { color: C.soft, w: 1.5, dash: '5 4' }));
  // 翻折：沿 AE 做轴对称。初始（PDF）是折过去的状态 △AFE
  const body = poly([P(...A), P(...D), P(...E)], { fill: C.blueFill, color: C.blue, w: 2 });
  out.push(`<g transform="translate(${f(pA[0])} ${f(pA[1])}) rotate(${f(ang)})"><g transform="scale(1 -1)"><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 -1;1 -1;1 1" keyTimes="0;0.15;0.5;0.85;1" dur="7s" repeatCount="indefinite"/><g transform="rotate(${f(-ang)}) translate(${f(-pA[0])} ${f(-pA[1])})">${body}</g></g></g>`);
  out.push(seg(P(...A), P(...E), { color: C.blue, w: 2 }));
  out.push(label(P(...A), 'A', -10, -4), label(P(...B), 'B', -10, 16), label(P(...Cc), 'C', 10, 16), label(P(...D), 'D', 10, -4), label(P(...E), 'E', 12, 4), label(P(...F), 'F', 0, 18));
  out.push(text(P(0, 4)[0] - 8, P(0, 4)[1] + 4, '8', { anchor: 'end' }), text(P(5, 8)[0], P(5, 8)[1] - 8, '10', { anchor: 'middle' }));
  files['pythagorean-fold.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 逆定理：造一个直角三角形来比 ----------
{
  const u = 30;
  const tri = (x0, y0, ang) => { // 直角顶点在 (x0,y0) 时的另两个顶点；ang 不为 90 时画成“未知”的角
    const r = ang * Math.PI / 180;
    return { C: [x0, y0], B: [x0 + 4 * u, y0], A: [x0 + 3 * u * Math.cos(r), y0 - 3 * u * Math.sin(r)] };
  };
  const t1 = tri(40, 160, 90), t2 = tri(230, 160, 90);
  const out = [];
  out.push(poly([t1.A, t1.B, t1.C]), poly([t2.A, t2.B, t2.C]));
  out.push(rightAngle(t2.C, t2.B, t2.A));
  out.push(text(t1.C[0] + 14, t1.C[1] - 12, '?', { color: C.emph }));
  const lab = (t, pr) => [
    text(t.C[0] - 10, (t.A[1] + t.C[1]) / 2 + 4, 'b', { anchor: 'end', italic: true }),
    text((t.C[0] + t.B[0]) / 2, t.C[1] + 20, 'a', { anchor: 'middle', italic: true }),
    text((t.A[0] + t.B[0]) / 2 + 10, (t.A[1] + t.B[1]) / 2 - 4, pr ? 'c′' : 'c', { italic: true, color: pr ? C.blue : C.ink }),
    label(t.A, pr ? 'A′' : 'A', 0, -8), label(t.B, pr ? 'B′' : 'B', 10, 16), label(t.C, pr ? 'C′' : 'C', -10, 16),
  ].join('');
  out.push(lab(t1, false), lab(t2, true));
  out.push(tick(t1.A, t1.C, 1), tick(t2.A, t2.C, 1), tick(t1.C, t1.B, 2), tick(t2.C, t2.B, 2));
  files['pythagorean-converse.svg'] = svg(400, 190, out.join('\n'));
}

// ---------- 逆定理的例题：四边形 ABCD。题干图只画已知条件，解答图再连 AC、标出算出的 5 和直角 ----------
{
  const u = 17, x0 = 40, y0 = 200;
  const P = (x, y) => [x0 + u * x, y0 - u * y];
  const A = P(0, 3), B = P(0, 0), Cc = P(4, 0), D = P(11.2, 9.6);
  const fig = solved => {
    const out = [];
    out.push(poly([A, B, Cc, D]));
    if (solved) out.push(seg(A, Cc, { color: C.blue, w: 2, dash: '6 4' }), rightAngle(Cc, A, D, { color: C.blue }));
    out.push(rightAngle(B, Cc, A));
    out.push(label(A, 'A', -12, 0), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 10, -4));
    out.push(text(B[0] - 8, (A[1] + B[1]) / 2 + 4, '3', { anchor: 'end' }), text((B[0] + Cc[0]) / 2, B[1] + 18, '4', { anchor: 'middle' }));
    out.push(text((Cc[0] + D[0]) / 2 + 10, (Cc[1] + D[1]) / 2 + 8, '12'), text((A[0] + D[0]) / 2 - 8, (A[1] + D[1]) / 2 - 10, '13', { anchor: 'end' }));
    if (solved) out.push(text((A[0] + Cc[0]) / 2 + 8, (A[1] + Cc[1]) / 2 - 6, '5', { color: C.blue }));
    return svg(320, 230, out.join('\n'));
  };
  files['pythagorean-quad.svg'] = fig(false);
  files['pythagorean-quad-solution.svg'] = fig(true);
}

// ---------- 在数轴上找到 √13 ----------
{
  const u = 60, ox = 50, oy = 170;
  const X = x => ox + u * x;
  const r = Math.sqrt(13), th = Math.atan2(2, 3) * 180 / Math.PI;
  const O = [X(0), oy], A = [X(3), oy], B = [X(3), oy - 2 * u], Pp = [X(r), oy];
  const out = [];
  out.push(line(X(-0.6), oy, X(4.5), oy, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(4.5) + 8)},${oy} ${f(X(4.5))},${oy - 4} ${f(X(4.5))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  for (let i = 0; i <= 4; i++) out.push(line(X(i), oy, X(i), oy - 5, { color: C.axis, w: 1.5 }), text(X(i), oy + 18, String(i), { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(arc(O, u * r, th, 0, { color: C.soft, dash: '5 4' }));
  out.push(seg(A, B, { w: 2 }), seg(O, B, { color: C.emph, w: 2.5 }), rightAngle(A, O, B));
  out.push(dot(...O), dot(...B), dot(...Pp, C.emph, 5));
  out.push(label(O, 'O', -10, -8), label(A, 'A', 12, -8), label(B, 'B', 10, -6), label(Pp, 'P', 12, -8, { color: C.emph }));
  out.push(text(X(3) + 8, oy - u + 4, '2'), text(X(1.5) - 12, oy - u - 4, '√13', { anchor: 'middle', color: C.emph }));
  files['pythagorean-number-line.svg'] = svg(360, 205, out.join('\n'));
}

export default files;
