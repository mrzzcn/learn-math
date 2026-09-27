// 第五部分“相交线与平行线”的图。
import { C, f, rad, svg, text, line, seg, dot, poly, arc, dir, angleMark, rightAngle, label } from './lib.mjs';

const files = {};
const add = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
const unit = (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
// 两条直线 p1p2、q1q2 的交点
const meet = (p1, p2, q1, q2) => {
  const d1 = [p2[0] - p1[0], p2[1] - p1[1]], d2 = [q2[0] - q1[0], q2[1] - q1[1]];
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((q1[0] - p1[0]) * d2[1] - (q1[1] - p1[1]) * d2[0]) / den;
  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};
// 扇形：顶点 v，从方向 u1 转到方向 u2（取小于 180° 的那一边）
const sector = (v, u1, u2, r, fill) => {
  const a = add(v, u1, r), b = add(v, u2, r);
  const cross = u1[0] * u2[1] - u1[1] * u2[0];
  return `<path d="M ${f(v[0])} ${f(v[1])} L ${f(a[0])} ${f(a[1])} A ${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${f(b[0])} ${f(b[1])} Z" fill="${fill}" stroke="none"/>`;
};
// 角的数字：放在两个方向夹角的平分方向上
const num = (v, u1, u2, s, r = 22, color = C.ink) => {
  const m = unit([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]);
  const half = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2;
  r = Math.min(Math.max(r, 12 / Math.sin(half)), 44);
  return text(v[0] + r * m[0], v[1] + r * m[1] + 5, s, { anchor: 'middle', color, size: 13 });
};
const neg = u => [-u[0], -u[1]];

// ---------- 对顶角 ----------
{
  const O = [200, 125], at = (l, d) => [O[0] + l * Math.cos(rad(d)), O[1] - l * Math.sin(rad(d))];
  const A = at(170, 200), B = at(170, 20), Cc = at(120, 120), D = at(120, 300);
  const out = [seg(A, B), seg(Cc, D)];
  out.push(arc(O, 22, 120, 200, { color: C.emph, w: 2 }), arc(O, 22, 300, 380, { color: C.emph, w: 2 }));
  out.push(arc(O, 16, 20, 120, { color: C.blue, w: 2 }), arc(O, 16, 200, 300, { color: C.blue, w: 2 }));
  const n = (d, s, col) => { const p = at(38, d); return text(p[0], p[1] + 5, s, { anchor: 'middle', color: col, size: 13 }); };
  out.push(n(160, '1', C.emph), n(70, '2', C.blue), n(340, '3', C.emph), n(225, '4', C.blue));
  out.push(dot(...O), label(at(30, 262), 'O', 0, 5), label(A, 'A', -10, 4), label(B, 'B', 10, 4), label(Cc, 'C', -12, 4), label(D, 'D', 12, 4));
  files['lines-vertical.svg'] = svg(400, 250, out.join('\n'));
}

// ---------- 垂线段最短 ----------
{
  const y = 160, P = [200, 40], O = [200, y], A = [90, y], B = [330, y];
  const out = [line(20, y, 400, y), text(392, y - 8, 'l', { italic: true })];
  out.push(seg(P, A, { color: C.soft, w: 1.5, dash: '5 4' }), seg(P, B, { color: C.soft, w: 1.5, dash: '5 4' }));
  // 动点 Q：初始停在 O 右边（PDF 里显示这一帧），移到 O 停一下，再到左边，回到起点。PQ 用虚线表示移动的部分
  const x0 = 290, xs = `${x0};${x0};200;200;60;60;${x0};${x0}`, kt = '0;0.1;0.3;0.42;0.65;0.75;0.93;1', op = '1;1;0;0;1;1;1;1';
  const an = (attr, v) => `<animate attributeName="${attr}" values="${v}" keyTimes="${kt}" dur="10s" repeatCount="indefinite"/>`;
  out.push(`<line x1="${P[0]}" y1="${P[1]}" x2="${x0}" y2="${y}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 4">${an('x2', xs)}</line>`);
  out.push(`<circle cx="${x0}" cy="${y}" r="4.5" fill="${C.blue}">${an('cx', xs)}</circle>`);
  out.push(`<text x="${x0}" y="${y + 22}" fill="${C.blue}" font-style="italic" text-anchor="middle">Q${an('x', xs)}${an('opacity', op)}</text>`);
  out.push(seg(P, O, { color: C.emph, w: 3 }), rightAngle(O, P, B, { size: 11 }));
  out.push(dot(...P), dot(...O), dot(...A), dot(...B));
  out.push(label(P, 'P', 0, -10), label(O, 'O', -12, 20), label(A, 'A', 0, 22), label(B, 'B', 0, 22));
  files['lines-perpendicular.svg'] = svg(420, 200, out.join('\n'));
}

// ---------- 三线八角 ----------
const threeLines = (dx = 0, dy = 0, s = 1) => {
  const T = p => [dx + s * p[0], dy + s * p[1]];
  const a1 = T([20, 60]), a2 = T([400, 76]), b1 = T([20, 196]), b2 = T([400, 176]), c1 = T([150, 16]), c2 = T([290, 240]);
  const E = meet(a1, a2, c1, c2), F = meet(b1, b2, c1, c2);
  const ua = unit(a1, a2), ub = unit(b1, b2), uc = unit(c1, c2);
  return { a1, a2, b1, b2, c1, c2, E, F, ua, ub, uc };
};
{
  const { a1, a2, b1, b2, c1, c2, E, F, ua, ub, uc } = threeLines();
  const out = [seg(a1, a2), seg(b1, b2), seg(c1, c2)];
  // E 处：1 右上，2 左上，3 左下，4 右下；F 处：5～8 同样排列
  const q = [[ua, neg(uc)], [neg(ua), neg(uc)], [neg(ua), uc], [ua, uc]];
  q.forEach(([u1, u2], i) => out.push(num(E, u1, u2, String(i + 1), 20)));
  const qb = [[ub, neg(uc)], [neg(ub), neg(uc)], [neg(ub), uc], [ub, uc]];
  qb.forEach(([u1, u2], i) => out.push(num(F, u1, u2, String(i + 5), 20)));
  out.push(dot(...E), dot(...F));
  out.push(text(a2[0] + 6, a2[1] + 5, 'a', { italic: true }), text(b2[0] + 6, b2[1] + 5, 'b', { italic: true }), text(c2[0] + 6, c2[1], 'c', { italic: true }));
  files['lines-eight-angles.svg'] = svg(420, 250, out.join('\n'));
}

// ---------- 同位角、内错角、同旁内角 ----------
{
  const out = [];
  const names = ['同位角', '内错角', '同旁内角'];
  names.forEach((nm, k) => {
    const { a1, a2, b1, b2, c1, c2, E, F, ua, ub, uc } = threeLines(k * 190, 0, 0.45);
    out.push(seg(a1, a2, { color: C.soft, w: 1.5 }), seg(b1, b2, { color: C.soft, w: 1.5 }), seg(c1, c2, { color: C.soft, w: 1.5 }));
    const L = 70, r = 22;
    let pairs, rays;
    if (k === 0) { pairs = [[E, ua, neg(uc)], [F, ub, neg(uc)]]; rays = [[E, ua], [F, ub]]; }
    if (k === 1) { pairs = [[E, neg(ua), uc], [F, ub, neg(uc)]]; rays = [[E, neg(ua)], [F, ub]]; }
    if (k === 2) { pairs = [[E, neg(ua), uc], [F, neg(ub), neg(uc)]]; rays = [[E, neg(ua)], [F, neg(ub)]]; }
    for (const [v, u1, u2] of pairs) out.push(sector(v, u1, u2, r, C.emphFill), angleMark(v, add(v, u1, 10), add(v, u2, 10), { r, color: C.emph, w: 2 }));
    const top = k === 0 ? add(E, neg(uc), 26) : E;
    out.push(seg(top, F, { color: C.emph, w: 2.5 }));
    for (const [v, u] of rays) out.push(seg(v, add(v, u, L), { color: C.emph, w: 2.5 }));
    out.push(text(k * 190 + 95, 138, nm, { anchor: 'middle', size: 13 }));
  });
  files['lines-angle-pairs.svg'] = svg(570, 150, out.join('\n'));
}

// ---------- 平行公理：过直线外一点只有一条平行线 ----------
{
  const P = [210, 60], y = 160;
  const out = [line(20, y, 400, y), text(392, y - 8, 'b', { italic: true })];
  for (const d of [30, -35]) {
    const u = [Math.cos(rad(d)), -Math.sin(rad(d))];
    const t = (y - P[1]) / u[1];
    const Q = add(P, u, t), R = add(P, u, t > 0 ? -t * 0.5 : -t * 0.5);
    out.push(seg(add(P, u, -Math.abs(t) * 0.7 * Math.sign(t)), add(P, u, t * 1.15), { color: C.soft, w: 1.2, dash: '5 4' }));
    out.push(dot(...Q, C.soft, 3));
  }
  out.push(`<g>${line(20, P[1], 400, P[1], { color: C.emph, w: 2.5 })}<animateTransform attributeName="transform" type="rotate" values="0 ${P[0]} ${P[1]};0 ${P[0]} ${P[1]};-12 ${P[0]} ${P[1]};-12 ${P[0]} ${P[1]};12 ${P[0]} ${P[1]};12 ${P[0]} ${P[1]};0 ${P[0]} ${P[1]}" keyTimes="0;0.2;0.4;0.5;0.8;0.9;1" dur="9s" repeatCount="indefinite"/></g>`);
  out.push(text(24, P[1] - 8, 'a', { italic: true, color: C.emph }));
  out.push(dot(...P), label(P, 'P', 0, -10));
  files['lines-parallel-axiom.svg'] = svg(420, 200, out.join('\n'));
}

// ---------- 用三角尺和直尺画平行线 ----------
{
  const y = 170, h = 110, w = 90, lean = 40, d = 130, x0 = 70;
  const tri = x => [[x, y], [x + w, y], [x + lean, y - h]];
  const u = unit([x0, y], [x0 + lean, y - h]);
  const out = [];
  out.push(poly([[20, y], [420, y], [420, y + 22], [20, y + 22]], { fill: 'rgba(87,96,106,0.10)', color: C.soft, w: 1.2 }));
  out.push(text(410, y + 16, '直尺', { anchor: 'end', color: C.soft, size: 12 }));
  for (const [x, nm] of [[x0, 'a'], [x0 + d, 'b']]) {
    const p0 = add([x, y], u, -30), p1 = add([x, y], u, 170);
    out.push(seg(p0, p1, { color: C.blue, w: 2 }), text(p1[0] + 6, p1[1] + 4, nm, { italic: true, color: C.blue }));
  }
  out.push(poly(tri(x0), { fill: 'rgba(31,35,40,0.06)', color: C.ink, w: 1.5 }));
  out.push(`<g transform="translate(${d} 0)">${poly(tri(x0), { color: C.ink, w: 1.5, dash: '5 4' })}<animateTransform attributeName="transform" type="translate" values="${d} 0;${d} 0;0 0;0 0;${d} 0" keyTimes="0;0.15;0.45;0.65;1" dur="8s" repeatCount="indefinite"/></g>`);
  // 同位角
  for (const [x, s] of [[x0, '1'], [x0 + d, '2']]) {
    const v = [x, y];
    out.push(angleMark(v, [x + 10, y], add(v, u, 10), { r: 20, color: C.emph, w: 2 }), num(v, [1, 0], u, s, 30, C.emph));
  }
  files['lines-slide.svg'] = svg(440, 200, out.join('\n'));
}

// ---------- 性质的推导：假如同位角不相等 ----------
{
  // 教材画法：a、b 画成平行（都水平），假设中作出的 a′ 画斜
  const tilt = 8, ua2 = [Math.cos(rad(tilt)), -Math.sin(rad(tilt))], ub = [1, 0];
  const b1 = [20, 200], b2 = [420, 200], c1 = [120, 20], c2 = [260, 225];
  const uc = unit(c1, c2), E = meet([0, 70], [1, 70], c1, c2), F = meet(b1, b2, c1, c2);
  const out = [seg(b1, b2), seg(c1, c2), line(20, 70, 420, 70)];
  const e1 = add(E, ua2, -100), e2 = add(E, ua2, 250);
  out.push(seg(e1, e2, { color: C.blue, w: 1.8, dash: '6 4' }));
  out.push(angleMark(E, add(E, [1, 0], 10), add(E, neg(uc), 10), { r: 26, color: C.emph, w: 2 }));
  out.push(angleMark(E, add(E, ua2, 10), add(E, neg(uc), 10), { r: 38, color: C.blue, w: 2 }));
  out.push(angleMark(F, add(F, ub, 10), add(F, neg(uc), 10), { r: 26, color: C.blue, w: 2 }));
  out.push(num(E, [1, 0], neg(uc), '1', 15, C.emph), num(F, ub, neg(uc), '2', 38, C.blue));
  out.push(dot(...E), dot(...F), label(E, 'E', -14, 18), label(F, 'F', -14, 18));
  out.push(text(412, 64, 'a', { italic: true, anchor: 'end' }), text(b2[0], b2[1] - 8, 'b', { italic: true, anchor: 'end' }), text(c2[0] + 6, c2[1], 'c', { italic: true }));
  out.push(text(e2[0], e2[1] - 8, 'a′', { italic: true, color: C.blue, anchor: 'end' }));
  files['lines-property.svg'] = svg(440, 235, out.join('\n'));
}

// ---------- 例 2：拐角（题干图，和解法中过 E 作 EF ∥ AB 的图） ----------
for (const withF of [false, true]) {
  const y1 = 40, y2 = 200, xr = 300;
  const A = [30, y1], B = [xr, y1], Cc = [30, y2], D = [xr, y2];
  const uB = [Math.cos(rad(220)), -Math.sin(rad(220))], uD = [Math.cos(rad(150)), -Math.sin(rad(150))];
  const E = meet(B, add(B, uB), D, add(D, uD)), Fp = [E[0] + 110, E[1]];
  const out = [seg(A, B), seg(Cc, D), seg(B, E), seg(D, E)];
  out.push(angleMark(B, A, E, { r: 26, color: C.emph, w: 2 }), angleMark(D, Cc, E, { r: 30, color: C.blue, w: 2 }));
  if (withF) {
    out.push(line(E[0] - 20, E[1], Fp[0] + 20, Fp[1], { color: C.soft, w: 1.5, dash: '6 4' }));
    out.push(angleMark(E, B, Fp, { r: 30, color: C.emph, w: 2 }), angleMark(E, Fp, D, { r: 24, color: C.blue, w: 2 }));
  }
  out.push(text(B[0] - 52, B[1] + 18, '40°', { color: C.emph, size: 12 }), text(D[0] - 60, D[1] - 6, '30°', { color: C.blue, size: 12 }));
  for (const p of withF ? [A, B, Cc, D, E, Fp] : [A, B, Cc, D, E]) out.push(dot(...p, C.ink, 3));
  out.push(label(A, 'A', 0, -8), label(B, 'B', 0, -8), label(Cc, 'C', 0, 20), label(D, 'D', 0, 20), label(E, 'E', -12, -8));
  if (withF) out.push(label(Fp, 'F', 0, -8));
  files[withF ? 'lines-example-bend-ef.svg' : 'lines-example-bend.svg'] = svg(340, 230, out.join('\n'));
}

// ---------- 例 2 的另一种辅助线：延长 BE 交 CD 于 G ----------
{
  const y1 = 40, y2 = 200, xr = 300;
  const A = [30, y1], B = [xr, y1], Cc = [30, y2], D = [xr, y2];
  const uB = [Math.cos(rad(220)), -Math.sin(rad(220))], uD = [Math.cos(rad(150)), -Math.sin(rad(150))];
  const E = meet(B, add(B, uB), D, add(D, uD)), G = meet(B, E, Cc, D);
  const out = [seg(A, B), seg(Cc, D), seg(B, E), seg(D, E), seg(E, G, { color: C.soft, w: 1.5, dash: '6 4' })];
  out.push(angleMark(B, A, E, { r: 26, color: C.emph, w: 2 }), angleMark(G, D, E, { r: 26, color: C.emph, w: 2 }));
  out.push(angleMark(D, Cc, E, { r: 30, color: C.blue, w: 2 }));
  out.push(text(B[0] - 52, B[1] + 18, '40°', { color: C.emph, size: 12 }), text(D[0] - 60, D[1] - 6, '30°', { color: C.blue, size: 12 }));
  for (const p of [A, B, Cc, D, E, G]) out.push(dot(...p, C.ink, 3));
  out.push(label(A, 'A', 0, -8), label(B, 'B', 0, -8), label(Cc, 'C', 0, 20), label(D, 'D', 0, 20), label(E, 'E', -12, -6), label(G, 'G', 0, 20));
  files['lines-example-bend-2.svg'] = svg(340, 230, out.join('\n'));
}

// ---------- 例 1：先判定，再用性质 ----------
{
  const ya = 60, yb = 180;
  const c1 = [95, 20], c2 = [165, 225];
  const E = meet([0, ya], [1, ya], c1, c2), F = meet([0, yb], [1, yb], c1, c2), uc = unit(c1, c2);
  const G = [340, ya], ud = [Math.cos(rad(255)), -Math.sin(rad(255))];
  const H = add(G, ud, (yb - ya) / ud[1]);
  const out = [line(20, ya, 430, ya), line(20, yb, 430, yb), seg(c1, c2), seg(add(G, ud, -40), add(H, ud, 45))];
  out.push(angleMark(E, [E[0] + 10, ya], add(E, neg(uc), 10), { r: 20, color: C.emph, w: 2 }), angleMark(F, [F[0] + 10, yb], add(F, neg(uc), 10), { r: 20, color: C.emph, w: 2 }));
  out.push(num(E, [1, 0], neg(uc), '1', 30, C.emph), num(F, [1, 0], neg(uc), '2', 30, C.emph));
  out.push(angleMark(G, [G[0] - 10, ya], add(G, ud, 10), { r: 18, color: C.blue, w: 2 }), angleMark(H, [H[0] - 10, yb], add(H, neg(ud), 10), { r: 18, color: C.blue, w: 2 }));
  out.push(num(G, [-1, 0], ud, '3', 30, C.blue), num(H, [-1, 0], neg(ud), '4', 30, C.blue));
  out.push(text(425, ya - 8, 'a', { italic: true, anchor: 'end' }), text(425, yb - 8, 'b', { italic: true, anchor: 'end' }), text(c1[0] - 8, c1[1] + 8, 'c', { italic: true, anchor: 'end' }));
  const dTop = add(G, ud, -40);
  out.push(text(dTop[0] + 8, dTop[1] + 8, 'd', { italic: true }));
  files['lines-example-judge.svg'] = svg(440, 240, out.join('\n'));
}

export default files;
