// 第五部分“三角形”的图。
import { C, f, rad, svg, text, line, seg, dot, poly, polyline, arc, dir, angleMark, rightAngle, tick, label } from './lib.mjs';

const files = {};
const add = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const unit = (p, q) => { const l = len(p, q); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
const meet = (p1, p2, q1, q2) => {
  const d1 = sub(p2, p1), d2 = sub(q2, q1), den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((q1[0] - p1[0]) * d2[1] - (q1[1] - p1[1]) * d2[0]) / den;
  return add(p1, d1, t);
};
const foot = (p, a, b) => { const u = unit(a, b), t = (p[0] - a[0]) * u[0] + (p[1] - a[1]) * u[1]; return add(a, u, t); };
// 扇形：顶点 v，两边指向 a、b（取小于 180° 的一边）
const sector = (v, a, b, r, fill) => {
  const u1 = unit(v, a), u2 = unit(v, b), p = add(v, u1, r), q = add(v, u2, r);
  const cross = u1[0] * u2[1] - u1[1] * u2[0];
  return `<path d="M ${f(v[0])} ${f(v[1])} L ${f(p[0])} ${f(p[1])} A ${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${f(q[0])} ${f(q[1])} Z" fill="${fill}" stroke="none"/>`;
};
const num = (v, a, b, s, r, color = C.ink) => {
  const u1 = unit(v, a), u2 = unit(v, b), m = unit([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]);
  return text(v[0] + r * m[0], v[1] + r * m[1] + 5, s, { anchor: 'middle', color, size: 13 });
};
const GRAYFILL = 'rgba(87,96,106,0.16)';

// ---------- 三角形的边和角 ----------
{
  const A = [120, 30], B = [40, 180], Cc = [320, 180];
  const out = [poly([A, B, Cc])];
  const side = (p, q, s, dx, dy) => { const m = mid(p, q); return text(m[0] + dx, m[1] + dy, s, { anchor: 'middle', italic: true, color: C.blue }); };
  out.push(side(B, Cc, 'a', 0, 20), side(Cc, A, 'b', 12, -6), side(A, B, 'c', -14, -2));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 6), label(Cc, 'C', 10, 6));
  files['triangles-basic.svg'] = svg(360, 205, out.join('\n'));
}

// ---------- 三边关系：C 越靠近 AB，AC + CB 越接近 AB ----------
{
  // C 原来的位置用实线留作参照；移动的 C 和折线 AC + CB 用虚线，初始停在靠近 AB 的位置（PDF 里显示这一帧）
  const A = [40, 170], B = [340, 170], cx = 150, y0 = 50, ys = [150, 150, 50, 50, 150], kt = '0;0.15;0.5;0.65;1', dur = 8;
  const out = [];
  out.push(seg(A, B, { color: C.emph, w: 3 }));
  const pts = y => `${A[0]},${A[1]} ${cx},${y} ${B[0]},${B[1]}`;
  out.push(polyline([A, [cx, y0], B], { color: C.blue, w: 2.5 }), dot(cx, y0), label([cx, y0], 'C', 0, -10));
  out.push(`<polyline points="${pts(ys[0])}" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 4" stroke-linejoin="round"><animate attributeName="points" values="${ys.map(pts).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></polyline>`);
  out.push(`<circle cx="${cx}" cy="${ys[0]}" r="4" fill="${C.blue}"><animate attributeName="cy" values="${ys.join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></circle>`);
  out.push(dot(...A), dot(...B), label(A, 'A', 0, 20), label(B, 'B', 0, 20));
  files['triangles-sides.svg'] = svg(380, 195, out.join('\n'));
}

// ---------- 高：锐角三角形和钝角三角形 ----------
{
  const out = [];
  {
    const A = [100, 30], B = [30, 170], Cc = [220, 170], D = foot(A, B, Cc);
    out.push(poly([A, B, Cc]), seg(A, D, { color: C.emph, w: 2.5 }), rightAngle(D, A, Cc));
    out.push(label(A, 'A', 0, -10), label(B, 'B', -8, 18), label(Cc, 'C', 8, 18), label(D, 'D', 0, 20));
  }
  {
    const A = [290, 40], B = [350, 170], Cc = [480, 170], D = foot(A, B, Cc);
    out.push(poly([A, B, Cc]), line(D[0] - 15, D[1], B[0], B[1], { color: C.soft, w: 1.5, dash: '5 4' }), seg(A, D, { color: C.emph, w: 2.5 }), rightAngle(D, A, Cc));
    out.push(label(A, 'A', 0, -10), label(B, 'B', 0, 20), label(Cc, 'C', 8, 18), label(D, 'D', 0, 20));
  }
  files['triangles-altitude.svg'] = svg(510, 200, out.join('\n'));
}

// ---------- 中线：分成面积相等的两部分 ----------
{
  const A = [120, 30], B = [30, 180], Cc = [310, 180], D = mid(B, Cc);
  const out = [poly([A, B, D], { fill: C.emphFill, color: 'none', w: 0 }), poly([A, D, Cc], { fill: C.blueFill, color: 'none', w: 0 })];
  out.push(poly([A, B, Cc]), seg(A, D, { color: C.emph, w: 2.5 }), tick(B, D, 1, { color: C.ink }), tick(D, Cc, 1, { color: C.ink }));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -8, 18), label(Cc, 'C', 8, 18), label(D, 'D', 0, 20));
  files['triangles-median.svg'] = svg(340, 205, out.join('\n'));
}

// ---------- 角平分线 ----------
{
  const A = [110, 30], B = [30, 180], Cc = [320, 180];
  const ab = len(A, B), ac = len(A, Cc), D = [(B[0] * ac + Cc[0] * ab) / (ab + ac), (B[1] * ac + Cc[1] * ab) / (ab + ac)];
  const out = [poly([A, B, Cc]), seg(A, D, { color: C.emph, w: 2.5 })];
  out.push(angleMark(A, B, D, { r: 26, color: C.emph, w: 2 }), angleMark(A, D, Cc, { r: 32, color: C.emph, w: 2 }));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -8, 18), label(Cc, 'C', 8, 18), label(D, 'D', 0, 20));
  files['triangles-bisector.svg'] = svg(350, 205, out.join('\n'));
}

// ---------- 稳定性 ----------
{
  const out = [];
  // 四边形：上边绕下面两个钉子转动，四条边长度不变
  const P = [40, 170], Q = [180, 170], L = 110;
  const top = th => { const d = [L * Math.cos(rad(th)), -L * Math.sin(rad(th))]; return [add(P, d), add(Q, d)]; };
  const pts = th => { const [R, S] = top(th); return [P, Q, S, R].map(p => p.map(f).join(',')).join(' '); };
  const ths = [65, 65, 90, 115, 115, 90, 65], kt = '0;0.1;0.3;0.5;0.6;0.8;1';
  // 原来的长方形用实线留作参照，变形的框架用虚线
  out.push(poly([P, Q, ...top(90).reverse()], { fill: C.blueFill }));
  out.push(`<polygon points="${pts(65)}" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 4" stroke-linejoin="round"><animate attributeName="points" values="${ths.map(pts).join(';')}" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/></polygon>`);
  out.push(dot(...P), dot(...Q));
  out.push(text(110, 200, '四边形：形状会变', { anchor: 'middle', size: 13, color: C.soft }));
  // 三角形
  const A = [360, 60], B = [290, 170], Cc = [430, 170];
  out.push(poly([A, B, Cc], { fill: C.emphFill }), dot(...A), dot(...B), dot(...Cc));
  out.push(text(360, 200, '三角形：形状不变', { anchor: 'middle', size: 13, color: C.soft }));
  files['triangles-stability.svg'] = svg(470, 215, out.join('\n'));
}

// ---------- 内角和：过 A 作 BC 的平行线 ----------
{
  const A = [170, 40], B = [50, 190], Cc = [330, 190], D = [20, 40], E = [370, 40];
  const out = [];
  out.push(sector(B, Cc, A, 36, C.emphFill), sector(A, D, B, 36, C.emphFill));
  out.push(sector(Cc, A, B, 36, C.blueFill), sector(A, Cc, E, 36, C.blueFill));
  out.push(sector(A, B, Cc, 26, GRAYFILL));
  // 动画：∠B 绕 AB 的中点转 180° 到 ∠1 的位置，∠C 绕 AC 的中点转到 ∠2 的位置
  const M1 = mid(A, B), M2 = mid(A, Cc), kt = '0;0.2;0.55;1';
  const spin = m => `<animateTransform attributeName="transform" type="rotate" values="0 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])}" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/>`;
  out.push(`<g>${sector(B, Cc, A, 36, C.emphFill)}${angleMark(B, Cc, A, { r: 36, color: C.emph, w: 2 })}${spin(M1)}</g>`);
  out.push(`<g>${sector(Cc, A, B, 36, C.blueFill)}${angleMark(Cc, A, B, { r: 36, color: C.blue, w: 2 })}${spin(M2)}</g>`);
  out.push(poly([A, B, Cc]), line(D[0], D[1], E[0], E[1], { color: C.ink, w: 1.5, dash: '6 4' }));
  out.push(angleMark(A, D, B, { r: 36, color: C.emph, w: 2 }), angleMark(A, Cc, E, { r: 36, color: C.blue, w: 2 }));
  out.push(num(A, D, B, '1', 50, C.emph), num(A, Cc, E, '2', 50, C.blue));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 0, -8), label(E, 'E', 0, -8));
  files['triangles-angle-sum.svg'] = svg(390, 215, out.join('\n'));
}

// ---------- 外角 ----------
{
  const A = [120, 40], B = [40, 180], Cc = [250, 180], D = [380, 180];
  const E = add(Cc, unit(B, A), 120);
  const out = [line(Cc[0], Cc[1], D[0], D[1], { color: C.ink, w: 2 }), seg(Cc, E, { color: C.soft, w: 1.5, dash: '6 4' }), poly([A, B, Cc])];
  out.push(sector(A, B, Cc, 28, C.emphFill), angleMark(A, B, Cc, { r: 28, color: C.emph, w: 2 }));
  out.push(sector(B, Cc, A, 30, C.blueFill), angleMark(B, Cc, A, { r: 30, color: C.blue, w: 2 }));
  out.push(sector(Cc, A, E, 28, C.emphFill), angleMark(Cc, A, E, { r: 28, color: C.emph, w: 2 }));
  out.push(sector(Cc, E, D, 30, C.blueFill), angleMark(Cc, E, D, { r: 30, color: C.blue, w: 2 }));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cc, 'C', 0, 20), label(D, 'D', 0, 20), label(E, 'E', 8, -4));
  files['triangles-exterior.svg'] = svg(400, 205, out.join('\n'));
}

// ---------- 多边形内角和：从一个顶点出发分成三角形 ----------
{
  const out = [];
  const fills = [C.emphFill, C.blueFill, GRAYFILL, C.emphFill];
  const reg = (cx, cy, r, n) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rad(90 + 360 * i / n)), cy - r * Math.sin(rad(90 + 360 * i / n))]);
  [[5, 100, '五边形：3 个三角形'], [6, 310, '六边形：4 个三角形']].forEach(([n, cx, cap]) => {
    const P = reg(cx, 100, 80, n);
    for (let i = 1; i < n - 1; i++) out.push(poly([P[0], P[i], P[i + 1]], { fill: fills[i - 1], color: 'none', w: 0 }));
    out.push(poly(P));
    for (let i = 2; i < n - 1; i++) out.push(seg(P[0], P[i], { color: C.emph, w: 1.8 }));
    out.push(dot(...P[0], C.emph));
    out.push(text(cx, 205, cap, { anchor: 'middle', size: 13, color: C.soft }));
  });
  files['triangles-polygon.svg'] = svg(410, 220, out.join('\n'));
}

// ---------- 多边形外角和：把外角拼在一起是一个周角 ----------
{
  const V = [[70, 190], [230, 200], [290, 110], [190, 40], [60, 90]];
  const n = V.length, fills = [C.emphFill, C.blueFill, GRAYFILL, 'rgba(205,75,48,0.30)', 'rgba(31,95,168,0.28)'];
  const out = [];
  const ext = [];
  for (let i = 0; i < n; i++) {
    const prev = V[(i + n - 1) % n], v = V[i], next = V[(i + 1) % n];
    const u = unit(prev, v), e = add(v, u, 50);
    out.push(seg(v, e, { color: C.soft, w: 1.2, dash: '5 4' }));
    out.push(sector(v, e, next, 34, fills[i]));
    out.push(num(v, e, next, String(i + 1), 44));
    const a = Math.acos(u[0] * unit(v, next)[0] + u[1] * unit(v, next)[1]) * 180 / Math.PI;
    ext.push(a);
  }
  out.push(poly(V));
  // 拼在一起
  const Pc = [420, 120];
  let t = 0;
  ext.forEach((a, i) => {
    const u = [Math.cos(rad(t)), -Math.sin(rad(t))], w = [Math.cos(rad(t + a)), -Math.sin(rad(t + a))];
    out.push(sector(Pc, add(Pc, u), add(Pc, w), 50, fills[i]), seg(Pc, add(Pc, u, 50), { color: C.soft, w: 1 }));
    out.push(num(Pc, add(Pc, u), add(Pc, w), String(i + 1), 32));
    t += a;
  });
  out.push(arc(Pc, 50, 0, 359.9, { color: C.ink, w: 1.5 }), dot(...Pc, C.ink, 3));
  files['triangles-exterior-sum.svg'] = svg(490, 240, out.join('\n'));
  files._ext = ext;
}

// ---------- 重心：平行于 BC 的细条，中点都在中线 AD 上 ----------
{
  const A = [170, 30], B = [40, 200], Cc = [320, 200], D = mid(B, Cc), E = mid(A, Cc), F = mid(A, B);
  const G = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
  const out = [];
  for (let k = 1; k <= 6; k++) {
    const y = A[1] + (B[1] - A[1]) * k / 7;
    const L = meet(A, B, [0, y], [1, y]), R = meet(A, Cc, [0, y], [1, y]);
    out.push(seg(L, R, { color: C.blue, w: 1.2 }), dot(...mid(L, R), C.emph, 3));
  }
  out.push(poly([A, B, Cc]), seg(A, D, { color: C.emph, w: 2.2 }));
  out.push(seg(B, E, { color: C.soft, w: 1.3, dash: '5 4' }), seg(Cc, F, { color: C.soft, w: 1.3, dash: '5 4' }));
  out.push(dot(...G, C.ink, 4.5));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 0, 20), label(E, 'E', 10, -2), label(F, 'F', -10, -2), label(G, 'G', 12, 24));
  files['triangles-centroid.svg'] = svg(360, 225, out.join('\n'));
}

// ---------- 悬挂法找重心 ----------
{
  const V = [[40, 120], [90, 40], [210, 30], [300, 90], [270, 190], [150, 210], [70, 180]];
  // 多边形重心
  let A2 = 0, gx = 0, gy = 0;
  for (let i = 0; i < V.length; i++) {
    const [x0, y0] = V[i], [x1, y1] = V[(i + 1) % V.length], cr = x0 * y1 - x1 * y0;
    A2 += cr; gx += (x0 + x1) * cr; gy += (y0 + y1) * cr;
  }
  const G = [gx / (3 * A2), gy / (3 * A2)];
  const P1 = [90, 48], P2 = [288, 100];
  const out = [poly(V, { fill: 'rgba(87,96,106,0.10)' })];
  for (const P of [P1, P2]) out.push(seg(P, add(P, unit(P, G), len(P, G) + 90), { color: C.emph, w: 1.8, dash: '6 4' }));
  out.push(`<circle cx="${P1[0]}" cy="${P1[1]}" r="4" fill="white" stroke="${C.ink}" stroke-width="1.5"/>`, `<circle cx="${P2[0]}" cy="${P2[1]}" r="4" fill="white" stroke="${C.ink}" stroke-width="1.5"/>`);
  out.push(dot(...G, C.emph, 5), label(G, 'G', -2, 24, { color: C.emph }));
  out.push(label(P1, 'P', -12, -2), label(P2, 'Q', 22, 4));
  files['triangles-hang.svg'] = svg(340, 240, out.join('\n'));
}

// ---------- 例：∠B、∠C 的平分线交于 O ----------
{
  const B = [40, 240], Cc = [300, 240];
  const A = meet(B, add(B, [Math.cos(rad(60)), -Math.sin(rad(60))]), Cc, add(Cc, [-Math.cos(rad(50)), -Math.sin(rad(50))]));
  const O = meet(B, add(B, [Math.cos(rad(30)), -Math.sin(rad(30))]), Cc, add(Cc, [-Math.cos(rad(25)), -Math.sin(rad(25))]));
  const out = [poly([A, B, Cc]), seg(B, O, { color: C.blue, w: 2 }), seg(Cc, O, { color: C.blue, w: 2 })];
  out.push(angleMark(B, Cc, O, { r: 34, color: C.emph, w: 1.8 }), angleMark(B, O, A, { r: 40, color: C.emph, w: 1.8 }));
  out.push(angleMark(Cc, O, B, { r: 30, n: 2, color: C.emph, w: 1.8 }), angleMark(Cc, A, O, { r: 38, n: 2, color: C.emph, w: 1.8 }));
  out.push(angleMark(A, B, Cc, { r: 22, color: C.ink, w: 1.5 }), angleMark(O, B, Cc, { r: 18, color: C.blue, w: 1.5 }));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(O, 'O', 0, -10));
  files['triangles-example-bisectors.svg'] = svg(340, 265, out.join('\n'));
}

const ext = files._ext; delete files._ext;
if (Math.abs(ext.reduce((a, b) => a + b, 0) - 360) > 1e-6) throw new Error('外角和不是 360°');
export default files;
