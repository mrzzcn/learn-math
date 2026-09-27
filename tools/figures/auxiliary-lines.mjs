// 第十一部分“辅助线从哪里来”的图。
import { C, f, svg, text, line, dot, poly, circle, angleMark, rightAngle, tick } from './lib.mjs';

const files = {};
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
// 点 p 到直线 ab 的垂足
const foot = (p, a, b) => {
  const d = [b[0] - a[0], b[1] - a[1]], t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
  return [a[0] + t * d[0], a[1] + t * d[1]];
};

// ---------- 倍长中线：△ADC 绕 D 旋转 180° 到 △EDB ----------
{
  const u = 36, ox = 50, oy = 110;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const ax = 13 / 3, ay = Math.sqrt(25 - ax * ax);
  const A = R([ax, ay]), B = R([0, 0]), Cc = R([6, 0]), D = R([3, 0]), E = R([6 - ax, -ay]);
  const out = [];
  // 转动的 △ADC：初始画成转完的样子（△EDB）
  const rot = a => `${a} ${f(D[0])} ${f(D[1])}`;
  out.push(`<g transform="rotate(${rot(180)})">${poly([A, D, Cc], { fill: C.blueFill, color: C.blue, w: 1.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${[180, 180, 0, 0, 180].map(rot).join(';')}" keyTimes="0;0.3;0.5;0.8;1" dur="8s" repeatCount="indefinite"/></g>`);
  out.push(poly([A, B, Cc]), line(...A, ...D, { color: C.ink, w: 2 }));
  out.push(line(...D, ...E, { color: C.blue, w: 2, dash: '6 4' }), line(...B, ...E, { color: C.blue, w: 2, dash: '6 4' }));
  out.push(tick(B, D, 1), tick(D, Cc, 1), tick(A, D, 2, { color: C.blue }), tick(D, E, 2, { color: C.blue }));
  for (const p of [A, B, Cc, D, E]) out.push(dot(...p, C.ink, 3));
  out.push(text(A[0], A[1] - 8, 'A', { italic: true, anchor: 'middle' }), text(B[0] - 8, B[1] + 4, 'B', { italic: true, anchor: 'end' }), text(Cc[0] + 8, Cc[1] + 4, 'C', { italic: true }));
  out.push(text(D[0] + 8, D[1] + 16, 'D', { italic: true }), text(E[0], E[1] + 18, 'E', { italic: true, anchor: 'middle' }));
  out.push(text(...mid(A, B).map((v, i) => v + [-6, -4][i]), '5', { anchor: 'end', size: 13 }), text(...mid(A, Cc).map((v, i) => v + [8, -2][i]), '3', { size: 13 }));
  files['auxiliary-lines-median.svg'] = svg(320, 220, out.join('\n'));
}

// ---------- 取对角线的中点，构造两条中位线：EF < (AB + CD) / 2 ----------
{
  const u = 38, ox = 40, oy = 170;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const a = [0.5, 3.5], b = [0, 0], c = [7, 0], ab = Math.hypot(0.5, 3.5);
  const d = [7 + ab * Math.cos((120 * Math.PI) / 180), ab * Math.sin((120 * Math.PI) / 180)];
  const A = R(a), B = R(b), Cc = R(c), D = R(d), E = mid(A, D), F = mid(B, Cc), G = mid(B, D);
  const out = [poly([A, B, Cc, D])];
  out.push(line(...B, ...D, { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(line(...E, ...F, { color: C.emph, w: 2.5 }));
  out.push(line(...E, ...G, { color: C.blue, w: 2, dash: '6 4' }), line(...G, ...F, { color: C.blue, w: 2, dash: '6 4' }));
  for (const p of [A, B, Cc, D, E, F, G]) out.push(dot(...p, C.ink, 3));
  out.push(text(A[0] - 8, A[1] - 4, 'A', { italic: true, anchor: 'end' }), text(B[0] - 8, B[1] + 14, 'B', { italic: true, anchor: 'end' }), text(Cc[0] + 8, Cc[1] + 14, 'C', { italic: true }), text(D[0] + 8, D[1] - 4, 'D', { italic: true }));
  out.push(text(E[0], E[1] - 8, 'E', { italic: true, anchor: 'middle' }), text(F[0], F[1] + 18, 'F', { italic: true, anchor: 'middle' }), text(G[0] - 6, G[1] + 16, 'G', { italic: true, anchor: 'end', color: C.blue }));
  files['auxiliary-lines-midline.svg'] = svg(360, 200, out.join('\n'));
}

// ---------- 两个直角三角形共用斜边 BC：连中点 ----------
{
  const u = 30, ox = 40, oy = 210;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const A = R([3, 6]), B = R([0, 0]), Cc = R([8, 0]);
  const E = foot(B, A, Cc), F = foot(Cc, A, B), M = mid(B, Cc);
  const out = [poly([A, B, Cc])];
  out.push(line(...B, ...E, { color: C.ink, w: 1.5 }), line(...Cc, ...F, { color: C.ink, w: 1.5 }));
  out.push(rightAngle(E, B, Cc, { size: 9 }), rightAngle(F, Cc, B, { size: 9 }));
  out.push(line(...M, ...E, { color: C.emph, w: 2, dash: '6 4' }), line(...M, ...F, { color: C.emph, w: 2, dash: '6 4' }));
  out.push(tick(B, M, 1), tick(M, Cc, 1), tick(M, E, 1), tick(M, F, 1));
  for (const p of [A, B, Cc, E, F, M]) out.push(dot(...p, C.ink, 3));
  out.push(text(A[0], A[1] - 8, 'A', { italic: true, anchor: 'middle' }), text(B[0] - 8, B[1] + 4, 'B', { italic: true, anchor: 'end' }), text(Cc[0] + 8, Cc[1] + 4, 'C', { italic: true }));
  out.push(text(E[0] + 8, E[1] - 2, 'E', { italic: true }), text(F[0] - 8, F[1] - 2, 'F', { italic: true, anchor: 'end' }), text(M[0], M[1] + 18, 'M', { italic: true, anchor: 'middle', color: C.emph }));
  files['auxiliary-lines-hypotenuse.svg'] = svg(320, 240, out.join('\n'));
}

// ---------- 见切线，连半径 ----------
{
  const u = 34, ox = 150, oy = 170, r = 3;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const c = [r * Math.cos(Math.PI / 3), r * Math.sin(Math.PI / 3)], dirT = [-Math.sin(Math.PI / 3), Math.cos(Math.PI / 3)];
  const a = [-r, 0], s = (a[0] - c[0]) * dirT[0] + (a[1] - c[1]) * dirT[1];
  const d = [c[0] + s * dirT[0], c[1] + s * dirT[1]];
  const O = R([0, 0]), A = R(a), B = R([r, 0]), Cc = R(c), D = R(d);
  const T1 = R([c[0] + (s + 0.9) * dirT[0], c[1] + (s + 0.9) * dirT[1]]), T2 = R([c[0] - 1.6 * dirT[0], c[1] - 1.6 * dirT[1]]);
  const out = [circle(...O, r * u)];
  out.push(line(...A, ...B, { color: C.ink, w: 2 }), line(...T1, ...T2, { color: C.ink, w: 2 }));
  out.push(line(...A, ...D, { color: C.ink, w: 2 }), line(...A, ...Cc, { color: C.ink, w: 2 }));
  out.push(line(...O, ...Cc, { color: C.blue, w: 2, dash: '6 4' }));
  out.push(rightAngle(D, A, Cc, { size: 9 }), rightAngle(Cc, O, D, { size: 9, color: C.blue }));
  out.push(angleMark(A, D, Cc, { r: 26 }), angleMark(A, Cc, B, { r: 26 }), angleMark(Cc, A, O, { r: 26 }));
  for (const p of [O, A, B, Cc, D]) out.push(dot(...p, C.ink, 3));
  out.push(text(O[0], O[1] + 18, 'O', { italic: true, anchor: 'middle' }), text(A[0] - 8, A[1] + 5, 'A', { italic: true, anchor: 'end' }), text(B[0] + 8, B[1] + 5, 'B', { italic: true }));
  out.push(text(Cc[0] + 8, Cc[1] - 4, 'C', { italic: true }), text(D[0] - 12, D[1] + 8, 'D', { italic: true, anchor: 'end' }));
  files['auxiliary-lines-tangent.svg'] = svg(320, 290, out.join('\n'));
}

export default files;
