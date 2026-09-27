// 第一部分“定义、命题与定理”的图。
import { C, f, svg, text, line, dot, angleMark, rightAngle, rad } from './lib.mjs';

const files = {};
const at = (O, len, deg) => [O[0] + len * Math.cos(rad(deg)), O[1] - len * Math.sin(rad(deg))];

// ---------- 垂直的定义：有一个角是直角 ----------
{
  const O = [170, 110], L = 110;
  const out = [];
  const A = at(O, L + 30, 180), B = at(O, L + 30, 0), Cc = at(O, L - 20, 90), D = at(O, L - 20, 270);
  out.push(line(A[0], A[1], B[0], B[1]), line(Cc[0], Cc[1], D[0], D[1]));
  out.push(rightAngle(O, B, Cc, { color: C.emph, size: 16 }));
  out.push(text(A[0] - 4, A[1] + 5, 'A', { anchor: 'end', italic: true }), text(B[0] + 6, B[1] + 5, 'B', { italic: true }));
  out.push(text(Cc[0], Cc[1] - 8, 'C', { anchor: 'middle', italic: true }), text(D[0], D[1] + 18, 'D', { anchor: 'middle', italic: true }));
  out.push(text(O[0] - 8, O[1] + 20, 'O', { anchor: 'end', italic: true }));
  files['propositions-definition.svg'] = svg(340, 220, out.join('\n'));
}

// ---------- 对顶角相等 ----------
{
  const O = [170, 100], L = 140, t = 28;
  const A = at(O, L, 180 + t), B = at(O, L, t), Cc = at(O, L, 180 - t), D = at(O, L, -t);
  const out = [line(A[0], A[1], B[0], B[1]), line(Cc[0], Cc[1], D[0], D[1])];
  // ∠1：左侧（OA 与 OC 之间），∠3：右侧（OB 与 OD 之间），∠2：上方（OC 与 OB 之间）
  out.push(angleMark(O, A, Cc, { r: 24, color: C.emph }), angleMark(O, B, D, { r: 24, color: C.emph }));
  out.push(angleMark(O, Cc, B, { r: 20, color: C.blue }));
  out.push(text(O[0] - 42, O[1] + 5, '1', { anchor: 'middle', color: C.emph }), text(O[0] + 42, O[1] + 5, '3', { anchor: 'middle', color: C.emph }));
  out.push(text(O[0], O[1] - 30, '2', { anchor: 'middle', color: C.blue }));
  out.push(dot(...O));
  out.push(text(A[0] - 4, A[1] + 12, 'A', { anchor: 'end', italic: true }), text(B[0] + 6, B[1], 'B', { italic: true }));
  out.push(text(Cc[0] - 4, Cc[1], 'C', { anchor: 'end', italic: true }), text(D[0] + 6, D[1] + 12, 'D', { italic: true }));
  out.push(text(O[0], O[1] + 24, 'O', { anchor: 'middle', italic: true }));
  files['propositions-vertical.svg'] = svg(340, 200, out.join('\n'));
}

// ---------- 反例：相等的角不一定是对顶角 ----------
{
  const O = [50, 170], L = 250;
  const A = at(O, L, 0), Cc = at(O, 220, 30), B = at(O, 165, 60);
  const out = [line(O[0], O[1], A[0], A[1]), line(O[0], O[1], B[0], B[1]), line(O[0], O[1], Cc[0], Cc[1])];
  out.push(angleMark(O, A, Cc, { r: 44, color: C.emph }), angleMark(O, Cc, B, { r: 44, color: C.emph }));
  const m1 = at(O, 62, 15), m2 = at(O, 62, 45);
  out.push(text(m1[0], m1[1] + 5, '1', { anchor: 'middle', color: C.emph }), text(m2[0], m2[1] + 5, '2', { anchor: 'middle', color: C.emph }));
  out.push(dot(...O));
  out.push(text(O[0] - 8, O[1] + 16, 'O', { anchor: 'end', italic: true }), text(A[0] + 6, A[1] + 5, 'A', { italic: true }));
  out.push(text(Cc[0] + 6, Cc[1] + 5, 'C', { italic: true }), text(B[0] + 6, B[1], 'B', { italic: true }));
  files['propositions-counterexample.svg'] = svg(330, 200, out.join('\n'));
}

// ---------- 互逆：同位角相等 ⇄ 两直线平行 ----------
{
  const ya = 70, yb = 170, xl = 30, xr = 400;
  const M = [190, ya], N = [150, yb];
  const u = [M[0] - N[0], M[1] - N[1]], ul = Math.hypot(...u), e = [u[0] / ul, u[1] / ul];
  const P = [M[0] + 45 * e[0], M[1] + 45 * e[1]], Q = [N[0] - 45 * e[0], N[1] - 45 * e[1]];
  const out = [line(xl, ya, xr, ya), line(xl, yb, xr, yb), line(P[0], P[1], Q[0], Q[1])];
  // ∠1、∠2 都在交点的右上方
  out.push(angleMark(M, [xr, ya], P, { r: 22, color: C.emph }), angleMark(N, [xr, yb], M, { r: 22, color: C.emph }));
  const l1 = [M[0] + 30, M[1] - 12], l2 = [N[0] + 30, N[1] - 12];
  out.push(text(l1[0], l1[1], '1', { anchor: 'middle', color: C.emph }), text(l2[0], l2[1], '2', { anchor: 'middle', color: C.emph }));
  out.push(text(xr + 6, ya + 5, 'a', { italic: true }), text(xr + 6, yb + 5, 'b', { italic: true }), text(P[0] + 6, P[1], 'c', { italic: true }));
  files['propositions-converse.svg'] = svg(420, 220, out.join('\n'));
}

// ---------- 反例：不平行的两条直线被截，同旁内角不互补 ----------
{
  const N = [150, 200], M = at(N, 130, 80); // c 从 N 向上偏右，∠2 = 80°
  const aDir = -30; // a 向右下倾斜：∠1 在 MN 方向（260°）和 a 向右的方向（330°）之间，是 70°
  const b = [[30, N[1]], [430, N[1]]];
  const aL = at(M, 90, aDir + 180), aR = at(M, 290, aDir);
  const P = at(M, 35, 80), Q = at(N, 40, 260);
  const out = [line(...b[0], ...b[1]), line(...aL, ...aR), line(...P, ...Q)];
  out.push(angleMark(M, N, aR, { r: 22, color: C.emph }), angleMark(N, M, b[1], { r: 22, color: C.blue }));
  const t1 = at(M, 40, 295), t2 = at(N, 40, 40);
  out.push(text(t1[0], t1[1] + 5, '1', { anchor: 'middle', color: C.emph }), text(t2[0], t2[1] + 5, '2', { anchor: 'middle', color: C.blue }));
  out.push(text(t1[0] + 12, t1[1] + 5, '70°', { color: C.emph, size: 13 }), text(t2[0] + 12, t2[1] + 5, '80°', { color: C.blue, size: 13 }));
  out.push(dot(...M, C.ink, 3), dot(...N, C.ink, 3));
  out.push(text(aL[0] - 4, aL[1] + 5, 'a', { anchor: 'end', italic: true }), text(b[0][0] - 4, b[0][1] + 5, 'b', { anchor: 'end', italic: true }), text(P[0] + 6, P[1], 'c', { italic: true }));
  files['propositions-cointerior.svg'] = svg(450, 250, out.join('\n'));
}

export default files;
