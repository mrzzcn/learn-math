// 第十一部分“分类讨论”的图。
import { C, f, svg, text, line, dot, poly, circle, arc, axes, angleMark } from './lib.mjs';

const files = {};
// 带下标的点名：字母、下标、其余文字分三段，从 x 起向右排
const subLabel = (x, y, name, i, rest = '', o = {}) => {
  const size = o.size || 13, col = o.color || C.ink;
  return text(x, y, name, { italic: true, color: col, size }) + text(x + size * 0.75, y + 4, String(i), { color: col, size: size - 3 })
    + (rest ? text(x + size * 0.75 + size * 0.6, y, rest, { color: col, size }) : '');
};

// ---------- 等腰三角形两边 3 和 7：哪条是腰 ----------
{
  const u = 17, out = [];
  // 左：腰 7、底 3
  const B = [60, 170], Cc = [60 + 3 * u, 170], A = [60 + 1.5 * u, 170 - Math.sqrt(49 - 2.25) * u];
  out.push(poly([A, B, Cc], { fill: C.blueFill }));
  out.push(text((A[0] + B[0]) / 2 - 8, (A[1] + B[1]) / 2, '7', { anchor: 'end', size: 13 }), text((A[0] + Cc[0]) / 2 + 8, (A[1] + Cc[1]) / 2, '7', { size: 13 }), text((B[0] + Cc[0]) / 2, B[1] + 18, '3', { anchor: 'middle', size: 13 }));
  out.push(text((B[0] + Cc[0]) / 2, 206, '腰 7，底 3', { anchor: 'middle', color: C.blue, size: 12 }));
  // 右：腰 3、底 7，两段 3 碰不到一起
  const P = [200, 170], Q = [200 + 7 * u, 170], r = 3 * u;
  out.push(line(...P, ...Q, { color: C.ink, w: 2 }));
  out.push(arc(P, r, 0, 90, { color: C.soft, w: 1, dash: '4 3' }), arc(Q, r, 90, 180, { color: C.soft, w: 1, dash: '4 3' }));
  const a = 55 * Math.PI / 180;
  out.push(line(...P, P[0] + r * Math.cos(a), P[1] - r * Math.sin(a), { color: C.emph, w: 2 }), line(...Q, Q[0] - r * Math.cos(a), Q[1] - r * Math.sin(a), { color: C.emph, w: 2 }));
  out.push(text(P[0] + r * Math.cos(a) / 2 - 8, P[1] - r * Math.sin(a) / 2, '3', { anchor: 'end', size: 13, color: C.emph }), text(Q[0] - r * Math.cos(a) / 2 + 8, Q[1] - r * Math.sin(a) / 2, '3', { size: 13, color: C.emph }), text((P[0] + Q[0]) / 2, P[1] + 18, '7', { anchor: 'middle', size: 13 }));
  out.push(text((P[0] + Q[0]) / 2, 206, '腰 3，底 7：围不成三角形', { anchor: 'middle', color: C.emph, size: 12 }));
  files['case-analysis-isosceles.svg'] = svg(400, 220, out.join('\n'));
}

// ---------- 坐标系中找等腰三角形的第三个顶点：两圆一线 ----------
{
  const { X, Y, body } = axes({ ox: 195, oy: 185, u: 28, xmin: -6.4, xmax: 7.7, ymin: -1.3, ymax: 5.6 });
  const out = [body];
  const O = [0, 0], A = [3, 4];
  const P = ([x, y]) => [X(x), Y(y)];
  // 以 O 为圆心、以 A 为圆心，半径都是 5（只画 x 轴附近和上方的部分）
  out.push(arc(P(O), 5 * 28, -3, 183, { color: C.blue, w: 1.2, dash: '5 4' }));
  out.push(arc(P(A), 5 * 28, 162, 378, { color: C.emph, w: 1.2, dash: '5 4' }));
  // OA 的垂直平分线
  const M = [1.5, 2], d = [0.8, -0.6];
  out.push(line(X(M[0] - 3.2 * d[0]), Y(M[1] - 3.2 * d[1]), X(M[0] + 4.4 * d[0]), Y(M[1] + 4.4 * d[1]), { color: C.ink, w: 1.2, dash: '2 3' }));
  out.push(line(...P(O), ...P(A), { color: C.ink, w: 2.5 }));
  out.push(dot(...P(A)), text(X(3) + 8, Y(4) + 4, 'A(3, 4)', { size: 12 }));
  const Ps = [[5, 0, C.blue], [-5, 0, C.blue], [6, 0, C.emph], [25 / 6, 0, C.ink]];
  Ps.forEach(([x, y, col], i) => out.push(dot(X(x), Y(y), col, 4.5)));
  out.push(subLabel(X(-5) - 22, Y(0) - 8, 'P', 1, '', { color: C.blue }), subLabel(X(5) + 5, Y(0) - 8, 'P', 2, '', { color: C.blue }));
  out.push(subLabel(X(6) - 2, Y(0) + 34, 'P', 3, '', { color: C.emph }), subLabel(X(25 / 6) - 10, Y(0) + 34, 'P', 4, '', { color: C.ink }));
  files['case-analysis-coordinates.svg'] = svg(440, 240, out.join('\n'));
}

// ---------- 相似的对应关系：两种位置的 E ----------
{
  const u = 18, rad = d => (d * Math.PI) / 180;
  const panel = (ox, oy, k, title, col) => {
    const R = ([x, y]) => [ox + u * x, oy - u * y];
    const A = [0, 0], B = [6 * Math.cos(rad(238)), 6 * Math.sin(rad(238))], Cc = [8 * Math.cos(rad(302)), 8 * Math.sin(rad(302))];
    const D = [B[0] / 3, B[1] / 3], E = [Cc[0] * k, Cc[1] * k];
    const out = [poly([R(A), R(B), R(Cc)]), line(...R(D), ...R(E), { color: col, w: 2.5 })];
    // 相等的角：情况一 ∠ADE = ∠B，情况二 ∠ADE = ∠C
    out.push(angleMark(R(D), R(A), R(E), { color: col, r: 14 }));
    out.push(k > 0.3 ? angleMark(R(B), R(A), R(Cc), { color: col, r: 16 }) : angleMark(R(Cc), R(A), R(B), { color: col, r: 16 }));
    for (const p of [A, B, Cc, D, E]) out.push(dot(...R(p), C.ink, 3));
    out.push(text(R(A)[0], R(A)[1] - 8, 'A', { italic: true, anchor: 'middle' }), text(R(B)[0] - 8, R(B)[1] + 6, 'B', { italic: true, anchor: 'end' }), text(R(Cc)[0] + 8, R(Cc)[1] + 6, 'C', { italic: true }));
    out.push(text(R(D)[0] - 8, R(D)[1] + 2, 'D', { italic: true, anchor: 'end' }), text(R(E)[0] + 8, R(E)[1] + 2, 'E', { italic: true, color: col }));
    out.push(text(ox, oy + 6.78 * u + 30, title, { anchor: 'middle', color: col, size: 12 }));
    return out.join('\n');
  };
  files['case-analysis-similar.svg'] = svg(420, 200, panel(110, 22, 1 / 3, 'DE ∥ BC', C.blue) + '\n' + panel(310, 22, 1.5 / 8, '∠ADE = ∠C', C.emph));
}

// ---------- 两条平行弦：在圆心同侧还是两侧 ----------
{
  const u = 14, r = 5 * u;
  const panel = (cx, cy, yCD, title) => {
    const O = [cx, cy], P = ([x, y]) => [cx + u * x, cy - u * y];
    const out = [circle(cx, cy, r)];
    const A = P([-4, 3]), B = P([4, 3]), Cc = P([-3, yCD]), D = P([3, yCD]);
    out.push(line(...A, ...B, { color: C.blue, w: 2.5 }), line(...Cc, ...D, { color: C.emph, w: 2.5 }));
    out.push(line(...P([0, 0]), ...P([0, 3]), { color: C.blue, w: 1.2, dash: '4 3' }), line(...P([0, 0]), ...P([0, yCD]), { color: C.emph, w: 1.2, dash: '4 3' }));
    out.push(line(...O, ...B, { color: C.soft, w: 1 }), line(...O, ...D, { color: C.soft, w: 1 }));
    out.push(dot(...O, C.ink, 3), text(cx - 6, cy + 5, 'O', { italic: true, anchor: 'end', size: 13 }));
    for (const [p, s, dx] of [[A, 'A', -8], [B, 'B', 8], [Cc, 'C', -8], [D, 'D', 8]]) out.push(text(p[0] + dx, p[1] + (s === 'A' || s === 'B' ? -4 : yCD > 0 ? -4 : 14), s, { italic: true, anchor: dx < 0 ? 'end' : 'start', size: 13 }));
    out.push(text(cx + 5, cy - 1.5 * u + 4, '3', { color: C.blue, size: 12 }), text(cx - 5, cy - (yCD / 2) * u + 4, '4', { color: C.emph, size: 12, anchor: 'end' }));
    out.push(text(cx, cy + r + 24, title, { anchor: 'middle', color: C.soft, size: 12 }));
    return out.join('\n');
  };
  files['case-analysis-chords.svg'] = svg(380, 200, panel(100, 88, 4, '同侧：4 − 3 = 1') + '\n' + panel(280, 88, -4, '两侧：4 + 3 = 7'));
}

export default files;
