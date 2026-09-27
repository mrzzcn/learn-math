// 第五部分“尺规作图”的图。作图过程用动画一步一步画出来；PDF 里显示全部作图痕迹。
import { C, f, rad, svg, text, line, seg, dot, poly, dir, angleMark, rightAngle, tick, label } from './lib.mjs';

const files = {};
const add = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const unit = (p, q) => { const l = len(p, q); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const at = (c, r, d) => [c[0] + r * Math.cos(rad(d)), c[1] - r * Math.sin(rad(d))];
// 两圆的交点（圆心 p、q，半径 r1、r2）中离点 ref 较远的一个
const cc = (p, r1, q, r2, ref) => {
  const d = len(p, q), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a);
  const u = unit(p, q), m = add(p, u, a);
  const x1 = [m[0] - h * u[1], m[1] + h * u[0]], x2 = [m[0] + h * u[1], m[1] - h * u[0]];
  return len(x1, ref) > len(x2, ref) ? x1 : x2;
};
const meet = (p1, p2, q1, q2) => {
  const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [q2[0] - q1[0], q2[1] - q1[1]];
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((q1[0] - p1[0]) * d2[1] - (q1[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};

// 动画：dur 秒一轮；t0、t1 是 0～1 之间的时刻
const anim = dur => {
  const k = (t0, t1) => `0;${f(t0 * 1000) / 1000};${f(t1 * 1000) / 1000};1`;
  // 在 t0 时刻出现
  const show = (body, t0, t1 = t0 + 0.02) => `<g>${body}<animate attributeName="opacity" values="0;0;1;1" keyTimes="${k(t0, t1)}" dur="${dur}s" repeatCount="indefinite"/></g>`;
  // 在 [t0, t1] 里逐渐画出一条路径
  const draw = (d, t0, t1, o = {}) => `<path d="${d}" pathLength="1" fill="none" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}>${o.dash ? `<animate attributeName="opacity" values="0;0;1;1" keyTimes="${k(t0, t1)}" dur="${dur}s" repeatCount="indefinite"/>` : `<animate attributeName="stroke-dasharray" values="0 1;0 1;1 0;1 0" keyTimes="${k(t0, t1)}" dur="${dur}s" repeatCount="indefinite"/>`}</path>`;
  return { show, draw };
};
// 圆弧路径（数学方向的角度，a0 → a1 逆时针）
const arcD = (c, r, a0, a1) => {
  const p0 = at(c, r, a0), p1 = at(c, r, a1);
  return `M ${f(p0[0])} ${f(p0[1])} A ${f(r)} ${f(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${f(p1[0])} ${f(p1[1])}`;
};
// 以 q 为圆心、经过点 x 的一小段弧（弧长约 span 像素）
const arcAround = (q, x, span = 56) => { const r = len(q, x), d = dir(q, x), h = (span / 2 / r) * 180 / Math.PI; return arcD(q, r, d - h, d + h); };
const segD = (p, q) => `M ${f(p[0])} ${f(p[1])} L ${f(q[0])} ${f(q[1])}`;
const TRACE = { color: C.soft, w: 1.3 };
const RESULT = { color: C.emph, w: 2.5 };

// ---------- 作一条线段等于已知线段 ----------
{
  const { show, draw } = anim(10);
  const a0 = [40, 40], a1 = [190, 40], A = [40, 130], B = [190, 130];
  const out = [seg(a0, a1), dot(...a0, C.ink, 3), dot(...a1, C.ink, 3), text(115, 30, 'a', { italic: true, anchor: 'middle' })];
  out.push(draw(arcAround(a0, a1, 40), 0.05, 0.15, TRACE));
  out.push(draw(segD(A, [380, 130]), 0.2, 0.32, { w: 2 }), show(dot(...A) + label(A, 'A', 0, 22) + text(372, 122, 'M', { italic: true }), 0.2));
  out.push(draw(arcAround(A, B, 60), 0.4, 0.55, TRACE));
  out.push(show(seg(A, B, RESULT) + dot(...B) + label(B, 'B', 12, 22), 0.62));
  files['construction-segment.svg'] = svg(400, 160, out.join('\n'));
}

// ---------- 作一个角等于已知角 ----------
{
  const { show, draw } = anim(14);
  const O = [40, 170], ang = 50, L = 160, r = 70;
  const Cp = at(O, r, 0), D = at(O, r, ang);
  const O2 = [250, 170], C2 = at(O2, r, 0), D2 = at(O2, r, ang);
  const out = [seg(O, at(O, L, 0)), seg(O, at(O, L, ang)), dot(...O)];
  out.push(label(O, 'O', -4, 20), label(at(O, L, 0), 'A', 0, 20), label(at(O, L, ang), 'B', 10, 4));
  out.push(draw(arcD(O, r, -12, ang + 14), 0.04, 0.16, TRACE), show(dot(...Cp, C.ink, 3) + dot(...D, C.ink, 3) + label(Cp, 'C', 6, 20) + label(D, 'D', -14, -8), 0.16));
  out.push(draw(segD(O2, at(O2, 180, 0)), 0.2, 0.28, { w: 2 }), show(dot(...O2) + label(O2, 'O′', -4, 20) + label(at(O2, 180, 0), 'A′', 0, 20), 0.2));
  out.push(draw(arcD(O2, r, -12, ang + 20), 0.32, 0.44, TRACE), show(dot(...C2, C.ink, 3) + label(C2, 'C′', 8, 20), 0.44));
  out.push(show(seg(Cp, D, { color: C.blue, w: 1.5, dash: '5 4' }), 0.48));
  out.push(draw(arcAround(C2, D2, 50), 0.52, 0.62, TRACE));
  out.push(show(dot(...D2, C.ink, 3) + label(D2, 'D′', -22, -12) + seg(C2, D2, { color: C.blue, w: 1.5, dash: '5 4' }), 0.64));
  const B2 = at(O2, 180, ang);
  out.push(draw(segD(O2, B2), 0.68, 0.78, RESULT), show(label(B2, 'B′', 12, 4), 0.78));
  out.push(show(angleMark(O, Cp, D, { r: 28, color: C.emph, w: 2 }) + angleMark(O2, C2, D2, { r: 28, color: C.emph, w: 2 }), 0.8));
  files['construction-angle.svg'] = svg(440, 200, out.join('\n'));
}

// ---------- 作角的平分线 ----------
{
  const { show, draw } = anim(14);
  const O = [40, 200], ang = 70, L = 240, r = 80, s = 90;
  const M = at(O, r, 0), N = at(O, r, ang), P = cc(M, s, N, s, O);
  const out = [seg(O, at(O, L, 0)), seg(O, at(O, L * 0.8, ang)), dot(...O)];
  out.push(label(O, 'O', -4, 20), label(at(O, L, 0), 'A', 0, 20), label(at(O, L * 0.8, ang), 'B', 10, 4));
  out.push(draw(arcD(O, r, -10, ang + 12), 0.04, 0.18, TRACE), show(dot(...M, C.ink, 3) + dot(...N, C.ink, 3) + label(M, 'M', 4, 20) + label(N, 'N', -14, 4), 0.18));
  out.push(draw(arcAround(M, P, 60), 0.24, 0.36, TRACE), draw(arcAround(N, P, 60), 0.4, 0.52, TRACE));
  out.push(show(dot(...P, C.ink, 3) + label(P, 'C', 14, -12), 0.54));
  const end = add(O, unit(O, P), 250);
  out.push(draw(segD(O, end), 0.58, 0.7, RESULT));
  out.push(show(seg(M, P, { color: C.blue, w: 1.5, dash: '5 4' }) + seg(N, P, { color: C.blue, w: 1.5, dash: '5 4' }), 0.74));
  out.push(show(angleMark(O, M, P, { r: 36, color: C.emph, w: 2 }) + angleMark(O, P, N, { r: 42, color: C.emph, w: 2 }), 0.78));
  files['construction-bisector.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 作线段的垂直平分线 ----------
{
  const { show, draw } = anim(12);
  const A = [80, 150], B = [300, 150], r = 140;
  const P = cc(A, r, B, r, [0, 1000]), Q = cc(A, r, B, r, [0, -1000]), M = mid(A, B);
  const top = P[1] < Q[1] ? P : Q, bot = P[1] < Q[1] ? Q : P;
  const out = [seg(A, B), dot(...A), dot(...B), label(A, 'A', -12, 5), label(B, 'B', 12, 5)];
  const da = dir(A, top), db = dir(B, top);
  out.push(draw(arcD(A, r, -da - 14, da + 14), 0.05, 0.22, TRACE), draw(arcD(B, r, db - 14, 360 - db + 14), 0.27, 0.44, TRACE));
  out.push(show(dot(...top, C.ink, 3) + dot(...bot, C.ink, 3) + label(top, 'C', 20, 2) + label(bot, 'D', 20, 12), 0.47));
  out.push(draw(segD(add(top, unit(bot, top), 20), add(bot, unit(top, bot), 20)), 0.52, 0.64, RESULT));
  out.push(show(dot(...M) + label(M, 'M', 12, 18) + rightAngle(M, B, top), 0.67));
  // 说明依据时连的 CA、CB、DA、DB：两次画弧的半径相同，四条都等于 r
  const blueD = (p, q) => seg(p, q, { color: C.blue, w: 1.5, dash: '5 4' }) + tick(p, q, 1, { color: C.blue });
  out.push(show(blueD(A, top) + blueD(B, top) + blueD(A, bot) + blueD(B, bot) + tick(A, M, 2, { color: C.ink }) + tick(M, B, 2, { color: C.ink }), 0.72));
  files['construction-perp-bisector.svg'] = svg(380, 280, out.join('\n'));
}

// ---------- 过直线上一点作垂线 ----------
{
  const { show, draw } = anim(12);
  const y = 170, P = [200, y], r = 70, s = 100;
  const A = [P[0] - r, y], B = [P[0] + r, y], Cp = cc(A, s, B, s, [0, 1000]);
  const out = [line(20, y, 380, y), text(372, y - 8, 'l', { italic: true }), dot(...P), label(P, 'P', 10, 20)];
  out.push(draw(arcD(P, r, 168, 192), 0.05, 0.12, TRACE), draw(arcD(P, r, -12, 12), 0.13, 0.2, TRACE));
  out.push(show(dot(...A, C.ink, 3) + dot(...B, C.ink, 3) + label(A, 'A', -12, 22) + label(B, 'B', 12, 22), 0.2));
  out.push(draw(arcAround(A, Cp, 60), 0.26, 0.38, TRACE), draw(arcAround(B, Cp, 60), 0.42, 0.54, TRACE));
  out.push(show(dot(...Cp, C.ink, 3) + label(Cp, 'C', 22, 5), 0.56));
  out.push(draw(segD([P[0], 30], [P[0], 196]), 0.6, 0.72, RESULT), show(rightAngle(P, B, [P[0], 30]), 0.75));
  out.push(show(seg(A, Cp, { color: C.blue, w: 1.5, dash: '5 4' }) + seg(B, Cp, { color: C.blue, w: 1.5, dash: '5 4' }), 0.78));
  files['construction-perp-on.svg'] = svg(400, 205, out.join('\n'));
}

// ---------- 过直线外一点作垂线 ----------
{
  const { show, draw } = anim(12);
  const y = 150, P = [200, 50], r = 130, s = 110;
  const h = Math.sqrt(r * r - (y - P[1]) ** 2), A = [P[0] - h, y], B = [P[0] + h, y];
  const Cp = cc(A, s, B, s, P), D = [P[0], y];
  const out = [line(20, y, 380, y), text(372, y - 8, 'l', { italic: true }), dot(...P), label(P, 'P', 0, -10)];
  out.push(draw(arcAround(P, A, 50), 0.05, 0.13, TRACE), draw(arcAround(P, B, 50), 0.14, 0.22, TRACE));
  out.push(show(dot(...A, C.ink, 3) + dot(...B, C.ink, 3) + label(A, 'A', -14, 18) + label(B, 'B', 14, 18), 0.22));
  out.push(draw(arcAround(A, Cp, 60), 0.28, 0.4, TRACE), draw(arcAround(B, Cp, 60), 0.44, 0.56, TRACE));
  out.push(show(dot(...Cp, C.ink, 3) + label(Cp, 'C', 22, 5), 0.58));
  out.push(draw(segD(P, add(Cp, [0, 1], 20)), 0.62, 0.74, RESULT), show(rightAngle(D, B, P) + dot(...D, C.ink, 3) + label(D, 'D', -12, 18), 0.77));
  out.push(show(seg(P, A, { color: C.blue, w: 1.5, dash: '5 4' }) + seg(P, B, { color: C.blue, w: 1.5, dash: '5 4' }), 0.8));
  files['construction-perp-off.svg'] = svg(400, 260, out.join('\n'));
}

// ---------- 已知三边作三角形 ----------
{
  const { show, draw } = anim(14);
  const a = 160, b = 120, c = 100;
  const out = [];
  [[a, 'a', 30], [b, 'b', 55], [c, 'c', 80]].forEach(([l, s, yy]) => out.push(line(40, yy, 40 + l, yy), dot(40, yy, C.ink, 3), dot(40 + l, yy, C.ink, 3), text(28, yy + 5, s, { italic: true, anchor: 'middle' })));
  const B = [40, 230], Cp = [40 + a, 230], A = cc(B, c, Cp, b, [0, 1000]);
  out.push(draw(segD(B, [360, 230]), 0.04, 0.14, { w: 2 }), show(dot(...B) + label(B, 'B', -4, 20) + text(352, 222, 'M', { italic: true }), 0.04));
  out.push(draw(arcAround(B, Cp, 40), 0.18, 0.26, TRACE), show(dot(...Cp) + label(Cp, 'C', 12, 20), 0.27));
  out.push(draw(arcAround(B, A, 70), 0.32, 0.44, TRACE), draw(arcAround(Cp, A, 70), 0.48, 0.6, TRACE));
  out.push(show(dot(...A) + label(A, 'A', 0, -12), 0.62));
  out.push(draw(segD(B, A), 0.66, 0.72, RESULT), draw(segD(Cp, A), 0.72, 0.78, RESULT), show(seg(B, Cp, RESULT), 0.66));
  files['construction-triangle-sss.svg'] = svg(380, 260, out.join('\n'));
}

// ---------- 例 1：读作图痕迹（作 ∠BAC 的平分线） ----------
{
  const B = [40, 210], Cp = [340, 210];
  const A = meet(B, at(B, 1, 40), Cp, at(Cp, 1, 120));
  const r = 50, s = 45, M = add(A, unit(A, B), r), N = add(A, unit(A, Cp), r), P = cc(M, s, N, s, A);
  const D = meet(A, P, B, Cp);
  const out = [poly([A, B, Cp])];
  const T = { color: C.soft, w: 1.2 };
  out.push(`<path d="${arcD(A, r, dir(A, B) - 8, dir(A, Cp) + 8)}" fill="none" stroke="${T.color}" stroke-width="${T.w}"/>`);
  out.push(`<path d="${arcAround(M, P, 44)}" fill="none" stroke="${T.color}" stroke-width="${T.w}"/>`, `<path d="${arcAround(N, P, 44)}" fill="none" stroke="${T.color}" stroke-width="${T.w}"/>`);
  out.push(seg(A, D, { color: C.emph, w: 2.2 }));
  out.push(dot(...M, C.ink, 3), dot(...N, C.ink, 3), dot(...P, C.ink, 3), dot(...D));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cp, 'C', 10, 16), label(D, 'D', 0, 20), label(M, 'M', -16, 2), label(N, 'N', 12, 4), label(P, 'P', 16, 5));
  out.push(angleMark(B, Cp, A, { r: 30, color: C.blue, w: 1.8 }), angleMark(Cp, A, B, { r: 26, color: C.blue, w: 1.8 }));
  out.push(text(B[0] + 38, B[1] - 8, '40°', { color: C.blue, size: 12 }), text(Cp[0] - 36, Cp[1] - 10, '60°', { color: C.blue, size: 12, anchor: 'end' }));
  files['construction-example-trace.svg'] = svg(380, 235, out.join('\n'));
}

// ---------- 例 2：AB 的垂直平分线交 BC 于 D ----------
{
  const u = 40, B = [40, 250], Cp = [40 + 8 * u, 250];
  const A = add(Cp, [-Math.cos(rad(60)), -Math.sin(rad(60))], 5 * u);
  const r = 0.56 * len(A, B), P1 = cc(A, r, B, r, [0, 1000]), P2 = cc(A, r, B, r, [0, -1000]), E = mid(A, B);
  const D = meet(P1, P2, B, Cp);
  const lo = P1[1] > P2[1] ? P1 : P2, hi = P1[1] > P2[1] ? P2 : P1;
  const T = { color: C.soft, w: 1.2 };
  const out = [poly([A, B, Cp])];
  for (const [q, x] of [[A, lo], [B, lo], [A, hi], [B, hi]]) out.push(`<path d="${arcAround(q, x, 40)}" fill="none" stroke="${T.color}" stroke-width="${T.w}"/>`);
  out.push(seg(add(hi, unit(D, hi), 16), add(D, unit(hi, D), 16), { color: C.blue, w: 1.5 }), seg(A, D, { color: C.emph, w: 2.2 }));
  out.push(dot(...E, C.ink, 3), dot(...D));
  out.push(label(A, 'A', 6, -10), label(B, 'B', -10, 16), label(Cp, 'C', 10, 16), label(D, 'D', 8, 20), label(E, 'E', -12, -4));
  out.push(text((A[0] + Cp[0]) / 2 + 12, (A[1] + Cp[1]) / 2, '5', { color: C.soft, size: 13 }), text(130, B[1] + 32, '8', { color: C.soft, size: 13, anchor: 'middle' }));
  // BC 的长用尺寸线标出（BC 的中点离 D 太近，数字直接写在边上会像是 BD 的长）
  const dy = B[1] + 28, TK = { color: C.soft, w: 1 };
  out.push(line(B[0], dy, 120, dy, TK), line(140, dy, Cp[0], dy, TK), line(B[0], dy - 5, B[0], dy + 5, TK), line(Cp[0], dy - 5, Cp[0], dy + 5, TK));
  files['construction-example-perp.svg'] = svg(400, 310, out.join('\n'));
  files._check = { AB: len(A, B) / u, DB: len(D, B) / u, DA: len(D, A) / u, DC: len(D, Cp) / u, lo };
}

// ---------- 用作等角的方法作平行线 ----------
{
  const y = 190, Q = [110, y], th = 60, r = 42;
  const P = at(Q, 110, th), S = at(Q, 175, th), Qlow = at(Q, 30, th + 180);
  const C1 = at(Q, r, 0), D1 = at(Q, r, th), D2 = at(P, r, th), C2 = at(P, r, 0);
  const T = { color: C.soft, w: 1.2 }, path = d => `<path d="${d}" fill="none" stroke="${T.color}" stroke-width="${T.w}"/>`;
  const out = [line(20, y, 400, y), text(392, y - 8, 'l', { italic: true, anchor: 'end' })];
  out.push(seg(Qlow, S, { w: 1.5 }));
  out.push(path(arcD(Q, r, -10, th + 12)), path(arcD(P, r, -12, th + 12)), path(arcAround(D2, C2, 36)));
  out.push(seg(C1, D1, { color: C.blue, w: 1.2, dash: '4 3' }), seg(C2, D2, { color: C.blue, w: 1.2, dash: '4 3' }));
  out.push(line(P[0] - 90, P[1], 400, P[1], RESULT), text(392, P[1] - 8, 'm', { italic: true, anchor: 'end', color: C.emph }));
  out.push(angleMark(Q, C1, D1, { r: 20, w: 2 }), angleMark(P, C2, D2, { r: 20, w: 2 }));
  out.push(text(Q[0] + 26, Q[1] - 6, '1', { color: C.emph, size: 12 }), text(P[0] + 26, P[1] - 6, '2', { color: C.emph, size: 12 }));
  out.push(dot(...Q), dot(...P), label(Q, 'Q', -12, 18), label(P, 'P', -14, -6));
  files['construction-parallel.svg'] = svg(420, 215, out.join('\n'));
}

// ---------- 已知两边和其中一边的对角：可能作出两个三角形 ----------
{
  const B = [40, 190], c = 150, b = 110, ang = 40;
  const A = at(B, c, ang), h = B[1] - A[1], dx = Math.sqrt(b * b - h * h);
  const Cp = [A[0] - dx, B[1]], D = [A[0] + dx, B[1]];
  const out = [line(B[0], B[1], 360, B[1]), text(352, B[1] - 8, 'M', { italic: true })];
  out.push(`<path d="${arcD(A, b, -90 - Math.atan2(dx, h) * 180 / Math.PI - 10, -90 + Math.atan2(dx, h) * 180 / Math.PI + 10)}" fill="none" stroke="${C.soft}" stroke-width="1.2"/>`);
  out.push(seg(B, A, { w: 2 }), seg(A, Cp, { color: C.emph, w: 2.2 }), seg(A, D, { color: C.blue, w: 2.2 }));
  out.push(angleMark(B, [360, B[1]], A, { r: 24, color: C.ink }));
  out.push(text((B[0] + A[0]) / 2 - 8, (B[1] + A[1]) / 2 - 4, 'c', { italic: true, anchor: 'end' }));
  out.push(text((A[0] + Cp[0]) / 2 + 6, (A[1] + Cp[1]) / 2 + 14, 'b', { italic: true, color: C.emph }), text((A[0] + D[0]) / 2 + 8, (A[1] + D[1]) / 2 + 4, 'b', { italic: true, color: C.blue }));
  out.push(dot(...A), dot(...B), dot(...Cp), dot(...D));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -4, 20), label(Cp, 'C', 0, 20, { color: C.emph }), label(D, 'D', 0, 20, { color: C.blue }));
  files['construction-ssa.svg'] = svg(380, 215, out.join('\n'));
}

const chk = files._check; delete files._check;
if (Math.abs(chk.AB - 7) > 1e-9 || Math.abs(chk.DB - chk.DA) > 1e-9) throw new Error('例 2 数据不对');
export default files;
