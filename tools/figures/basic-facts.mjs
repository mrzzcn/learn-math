// 第一部分“基本事实”的图。
import { C, f, svg, text, line, dot, poly, polyline, angleMark, rightAngle, tick, rad, dir } from './lib.mjs';

const files = {};
const at = (O, len, deg) => [O[0] + len * Math.cos(rad(deg)), O[1] - len * Math.sin(rad(deg))];
const through = (P, deg, len) => { const p = at(P, len, deg), q = at(P, len, deg + 180); return [p, q]; };
// 两条直线 P + t·u 和 Q + s·v 的交点
const meet = (P, u, Q, v) => {
  const det = u[0] * -v[1] - u[1] * -v[0];
  const t = ((Q[0] - P[0]) * -v[1] - (Q[1] - P[1]) * -v[0]) / det;
  return [P[0] + t * u[0], P[1] + t * u[1]];
};

// ---------- 两点确定一条直线 ----------
{
  const A = [120, 120], B = [300, 70];
  const d = dir(A, B);
  const out = [];
  for (const k of [-70, -40, 50, 75, 100]) {
    const [p, q] = through(A, d + k, 75);
    out.push(line(p[0], p[1], q[0], q[1], { color: C.soft, w: 1.2, dash: '5 4' }));
  }
  // 绕 A 转动的直线：转一圈，经过 B 时停一下
  const [rp, rq] = through(A, d, 110);
  const rot = a => `${f(a)} ${A[0]} ${A[1]}`;
  out.push(`<g transform="rotate(${rot(0)})">${line(rp[0], rp[1], rq[0], rq[1], { color: C.blue, w: 1.5 })}<animateTransform attributeName="transform" type="rotate" values="${rot(0)};${rot(0)};${rot(-180)};${rot(-180)}" keyTimes="0;0.35;0.95;1" dur="8s" repeatCount="indefinite"/></g>`);
  const [p, q] = [at(A, 110, d + 180), at(A, 300, d)];
  out.push(line(p[0], p[1], q[0], q[1], { color: C.emph, w: 2.5 }));
  out.push(dot(...A), dot(...B));
  out.push(text(A[0] + 26 * Math.cos(rad(220)), A[1] - 26 * Math.sin(rad(220)) + 5, 'A', { anchor: 'middle', italic: true }), text(B[0] + 2, B[1] + 22, 'B', { anchor: 'middle', italic: true }));
  files['basic-facts-two-points.svg'] = svg(420, 230, out.join('\n'));
}

// ---------- 两点之间，线段最短 ----------
{
  const A = [50, 130], B = [350, 110];
  const out = [];
  const Cp = [200, 40]; // 折线 ACB 的拐点，和线段 AB 围成三角形
  out.push(polyline([A, Cp, B], { color: C.soft, w: 1.5, dash: '6 4' }));
  const curve = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60; curve.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t + 70 * Math.sin(Math.PI * t) - 20 * Math.sin(2 * Math.PI * t)]); }
  out.push(polyline(curve, { color: C.soft, w: 1.5, dash: '6 4' }));
  out.push(line(A[0], A[1], B[0], B[1], { color: C.emph, w: 3 }));
  out.push(dot(...A), dot(...B));
  out.push(dot(...Cp, C.soft, 3.5));
  out.push(text(A[0] - 8, A[1] + 5, 'A', { anchor: 'end', italic: true }), text(B[0] + 8, B[1] + 5, 'B', { italic: true }), text(Cp[0], Cp[1] - 10, 'C', { anchor: 'middle', italic: true }));
  files['basic-facts-shortest.svg'] = svg(400, 220, out.join('\n'));
}

// ---------- 过一点有且只有一条直线与已知直线垂直 ----------
{
  const y = 170, P = [200, 60], O = [200, y];
  const out = [line(30, y, 380, y)];
  out.push(line(P[0], P[1] - 30, O[0], y + 30, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(O, [380, y], P, { color: C.emph }));
  // 绕 P 转动的直线，只有竖直时和 l 垂直
  const rot = a => `${a} ${P[0]} ${P[1]}`;
  out.push(`<g transform="rotate(${rot(35)})">${line(P[0], P[1] - 40, P[0], y + 50, { color: C.blue, w: 1.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${rot(35)};${rot(0)};${rot(0)};${rot(-35)};${rot(0)};${rot(0)};${rot(35)}" keyTimes="0;0.2;0.35;0.55;0.75;0.9;1" dur="8s" repeatCount="indefinite"/></g>`);
  out.push(dot(...P), dot(...O));
  out.push(text(P[0] - 10, P[1] - 4, 'P', { anchor: 'end', italic: true }), text(O[0] + 8, O[1] + 20, 'O', { italic: true }), text(380, y + 20, 'l', { italic: true }));
  files['basic-facts-perpendicular.svg'] = svg(410, 220, out.join('\n'));
}

// ---------- 过直线外一点有且只有一条直线与这条直线平行 ----------
{
  const y = 170, P = [210, 90], h = y - P[1];
  const out = [line(20, y, 400, y)];
  for (const s of [1, -1]) {
    const a = 25 * s;
    const X = P[0] - (s * h) / Math.tan(rad(25));
    const [p, q] = through(P, a, 200);
    out.push(line(p[0], p[1], q[0], q[1], { color: C.soft, w: 1.2, dash: '5 4' }));
    out.push(dot(X, y, C.soft, 3.5));
  }
  const rot = a => `${a} ${P[0]} ${P[1]}`;
  out.push(`<g transform="rotate(${rot(0)})">${line(P[0] - 190, P[1], P[0] + 190, P[1], { color: C.blue, w: 1.5 })}<animateTransform attributeName="transform" type="rotate" values="${rot(0)};${rot(0)};${rot(-25)};${rot(-25)};${rot(25)};${rot(25)};${rot(0)}" keyTimes="0;0.2;0.4;0.5;0.8;0.9;1" dur="9s" repeatCount="indefinite"/></g>`);
  out.push(line(20, P[1], 400, P[1], { color: C.emph, w: 2.5 }));
  out.push(dot(...P));
  out.push(text(P[0], P[1] - 12, 'P', { anchor: 'middle', italic: true }), text(404, y + 5, 'l', { italic: true }), text(404, P[1] + 5, 'm', { italic: true, color: C.emph }));
  files['basic-facts-parallel.svg'] = svg(420, 230, out.join('\n'));
}

// ---------- 同位角相等，两直线平行 ----------
// ---------- 例题：内错角相等，两直线平行 ----------
// mode：'corr' 同位角；'alt' 例 2 题干（只有 ∠1、∠2）；'altProof' 例 2 思路（加上 ∠3）
const transversal = (mode) => {
  const ya = 70, yb = 170, xl = 30, xr = 400;
  const M = [210, ya], N = [160, yb];
  const u = [M[0] - N[0], M[1] - N[1]], ul = Math.hypot(...u), e = [u[0] / ul, u[1] / ul];
  const P = [M[0] + 45 * e[0], M[1] + 45 * e[1]], Q = [N[0] - 45 * e[0], N[1] - 45 * e[1]];
  const out = [line(xl, ya, xr, ya), line(xl, yb, xr, yb), line(P[0], P[1], Q[0], Q[1])];
  if (mode === 'corr') {
    out.push(angleMark(M, [xr, ya], P, { r: 22, color: C.emph }), angleMark(N, [xr, yb], M, { r: 22, color: C.emph }));
    out.push(text(M[0] + 30, M[1] - 12, '1', { anchor: 'middle', color: C.emph }), text(N[0] + 30, N[1] - 12, '2', { anchor: 'middle', color: C.emph }));
  } else if (mode === 'alt') {
    out.push(angleMark(N, [xr, yb], M, { r: 22, color: C.emph }), angleMark(M, [xl, ya], N, { r: 22, color: C.emph }));
    out.push(text(N[0] + 30, N[1] - 12, '1', { anchor: 'middle', color: C.emph }), text(M[0] - 30, M[1] + 20, '2', { anchor: 'middle', color: C.emph }));
  } else {
    // ∠1：N 处，b 的上方、c 的右侧；∠2：M 处，a 的下方、c 的左侧；∠3：M 处，a 的上方、c 的右侧
    out.push(angleMark(N, [xr, yb], M, { r: 22, color: C.emph }));
    out.push(angleMark(M, [xl, ya], N, { r: 22, color: C.blue }), angleMark(M, [xr, ya], P, { r: 22, color: C.blue }));
    out.push(text(N[0] + 30, N[1] - 12, '1', { anchor: 'middle', color: C.emph }));
    out.push(text(M[0] - 30, M[1] + 20, '2', { anchor: 'middle', color: C.blue }), text(M[0] + 30, M[1] - 12, '3', { anchor: 'middle', color: C.blue }));
  }
  out.push(text(xr + 6, ya + 5, 'a', { italic: true }), text(xr + 6, yb + 5, 'b', { italic: true }), text(P[0] + 6, P[1], 'c', { italic: true }));
  out.push(dot(...M, C.ink, 3), dot(...N, C.ink, 3), text(M[0] - 14, M[1] - 8, 'M', { anchor: 'middle', italic: true }), text(N[0] + 16, N[1] + 18, 'N', { anchor: 'middle', italic: true }));
  return svg(420, 220, out.join('\n'));
};
files['basic-facts-corresponding.svg'] = transversal('corr');
files['basic-facts-alternate.svg'] = transversal('alt');
files['basic-facts-alternate-proof.svg'] = transversal('altProof');

// ---------- 由基本事实 4、5 推出“两直线平行，同位角相等”（反证法的图） ----------
// 画的是假设的情况：∠1 ≠ ∠2。a′ 按 ∠3 = ∠2 作出，和 b 平行；a 因此看起来和 b 不平行
{
  const ya = 70, yb = 170, xl = 30, xr = 400;
  const M = [210, ya], N = [160, yb];
  const u = [M[0] - N[0], M[1] - N[1]], ul = Math.hypot(...u), e = [u[0] / ul, u[1] / ul];
  const P = [M[0] + 62 * e[0], M[1] + 62 * e[1]], Q = [N[0] - 45 * e[0], N[1] - 45 * e[1]];
  const tilt = 7; // a 相对 a′ 的倾斜角（度）
  const aL = [xl, ya + (M[0] - xl) * Math.tan(rad(tilt))], aR = [xr, ya - (xr - M[0]) * Math.tan(rad(tilt))];
  const out = [line(xl, yb, xr, yb), line(P[0], P[1], Q[0], Q[1])];
  out.push(line(xl, ya, xr, ya, { color: C.blue, w: 2, dash: '7 5' }));
  out.push(line(...aL, ...aR));
  // ∠2（N 处）和 ∠3（M 处，c 与 a′ 之间）相等，蓝色；∠1（M 处，c 与 a 之间）红色
  out.push(angleMark(N, [xr, yb], M, { r: 22, color: C.blue }), angleMark(M, [xr, ya], P, { r: 20, color: C.blue }));
  out.push(angleMark(M, aR, P, { r: 40, color: C.emph }));
  const at2 = (v, deg, r) => [v[0] + r * Math.cos(rad(deg)), v[1] - r * Math.sin(rad(deg)) + 5];
  const d3 = dir(M, P) / 2, d1 = (dir(M, aR) + dir(M, P)) / 2;
  out.push(text(N[0] + 30, N[1] - 12, '2', { anchor: 'middle', color: C.blue }), text(...at2(M, d3 - 8, 30), '3', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text(...at2(M, d1, 52), '1', { anchor: 'middle', color: C.emph, size: 13 }));
  out.push(text(xr + 6, aR[1] + 5, 'a', { italic: true }), text(xr + 6, ya + 5, 'a′', { italic: true, color: C.blue }), text(xr + 6, yb + 5, 'b', { italic: true }), text(P[0] + 6, P[1], 'c', { italic: true }));
  out.push(dot(...M, C.ink, 3), dot(...N, C.ink, 3), text(M[0] - 14, M[1] - 8, 'M', { anchor: 'middle', italic: true }), text(N[0] + 16, N[1] + 18, 'N', { anchor: 'middle', italic: true }));
  files['basic-facts-corresponding-property.svg'] = svg(430, 220, out.join('\n'));
}

// ---------- SSS、SAS、ASA ----------
{
  const out = [];
  const shape = [[0, 0], [-40, 95], [70, 95]]; // A、B、C 相对位置
  const names = ['SSS', 'SAS', 'ASA'];
  names.forEach((nm, i) => {
    const ox = 60 + i * 165, oy = 30;
    const [A, B, Cc] = shape.map(p => [ox + p[0], oy + p[1]]);
    out.push(poly([A, B, Cc]));
    if (nm === 'SSS') out.push(tick(A, B, 1), tick(B, Cc, 2), tick(A, Cc, 3));
    if (nm === 'SAS') out.push(tick(A, B, 1), tick(B, Cc, 2), angleMark(B, Cc, A, { r: 20, color: C.blue }));
    if (nm === 'ASA') out.push(tick(B, Cc, 2), angleMark(B, Cc, A, { r: 20, color: C.blue }), angleMark(Cc, A, B, { r: 20, n: 2, color: C.blue }));
    out.push(text(A[0], A[1] - 8, 'A', { anchor: 'middle', italic: true }), text(B[0] - 8, B[1] + 14, 'B', { anchor: 'end', italic: true }), text(Cc[0] + 8, Cc[1] + 14, 'C', { italic: true }));
    out.push(text(ox + 15, oy + 135, nm, { anchor: 'middle', color: C.soft }));
  });
  files['basic-facts-congruence.svg'] = svg(490, 180, out.join('\n'));
}

// ---------- 平行线分线段成比例 ----------
{
  const ys = [50, 110, 200], xl = 20, xr = 430;
  const out = ys.map(y => line(xl, y, xr, y));
  const m = [[90, 20], [150, 230]], n = [[260, 20], [390, 230]];
  const on = (L, y) => { const t = (y - L[0][1]) / (L[1][1] - L[0][1]); return [L[0][0] + t * (L[1][0] - L[0][0]), y]; };
  const [A, B, Cc] = ys.map(y => on(m, y)), [D, E, F] = ys.map(y => on(n, y));
  out.push(line(...m[0], ...m[1], { color: C.soft, w: 1.5 }), line(...n[0], ...n[1], { color: C.soft, w: 1.5 }));
  out.push(line(...A, ...B, { color: C.blue, w: 3.5 }), line(...D, ...E, { color: C.blue, w: 3.5 }));
  out.push(line(...B, ...Cc, { color: C.emph, w: 3.5 }), line(...E, ...F, { color: C.emph, w: 3.5 }));
  for (const p of [A, B, Cc, D, E, F]) out.push(dot(...p));
  out.push(text(A[0] - 10, A[1] - 6, 'A', { anchor: 'end', italic: true }), text(B[0] - 10, B[1] - 6, 'B', { anchor: 'end', italic: true }), text(Cc[0] - 10, Cc[1] - 6, 'C', { anchor: 'end', italic: true }));
  out.push(text(D[0] - 10, D[1] - 6, 'D', { anchor: 'end', italic: true }), text(E[0] - 10, E[1] - 6, 'E', { anchor: 'end', italic: true }), text(F[0] - 10, F[1] - 6, 'F', { anchor: 'end', italic: true }));
  out.push(text(xr + 6, ys[0] + 5, 'a', { italic: true }), text(xr + 6, ys[1] + 5, 'b', { italic: true }), text(xr + 6, ys[2] + 5, 'c', { italic: true }));
  out.push(text(m[1][0] + 4, m[1][1] + 4, 'm', { italic: true, color: C.soft }), text(n[1][0] + 4, n[1][1] + 4, 'n', { italic: true, color: C.soft }));
  files['basic-facts-proportion.svg'] = svg(450, 250, out.join('\n'));
}

export default files;
