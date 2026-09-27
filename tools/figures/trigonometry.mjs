// 第八部分“锐角三角函数”的图。
import { C, f, rad, svg, text, line, dot, poly, arc, angleMark, rightAngle, label } from './lib.mjs';

const files = {};
const at = (p, len, deg) => [p[0] + len * Math.cos(rad(deg)), p[1] - len * Math.sin(rad(deg))];

// ---------- 角一定，比值就一定：一组相似的直角三角形 ----------
{
  const A = [30, 200], a = 33;
  const ds = [120, 200, 280], names = ['', '′', '″'];
  const out = [line(A[0], A[1], 300, A[1]), line(A[0], A[1], ...at(A, 300, a))];
  ds.forEach((d, i) => {
    const B = at(A, d, a), Cc = [B[0], A[1]];
    out.push(line(B[0], B[1], Cc[0], Cc[1], { color: i === 0 ? C.emph : C.ink, w: i === 0 ? 2.5 : 1.5 }), rightAngle(Cc, A, B, { size: 8 }));
    out.push(label(B, 'B' + names[i], -8, -8), label(Cc, 'C' + names[i], 0, 18));
  });
  // 动画：垂线沿斜边滑动
  const B0 = at(A, ds[0], a), B1 = at(A, 290, a);
  out.push(`<line x1="${f(B0[0])}" y1="${f(B0[1])}" x2="${f(B0[0])}" y2="${A[1]}" stroke="${C.emph}" stroke-width="2.5"><animate attributeName="x1" values="${f(B0[0])};${f(B0[0])};${f(B1[0])};${f(B1[0])};${f(B0[0])}" keyTimes="0;0.15;0.5;0.7;1" dur="8s" repeatCount="indefinite"/><animate attributeName="x2" values="${f(B0[0])};${f(B0[0])};${f(B1[0])};${f(B1[0])};${f(B0[0])}" keyTimes="0;0.15;0.5;0.7;1" dur="8s" repeatCount="indefinite"/><animate attributeName="y1" values="${f(B0[1])};${f(B0[1])};${f(B1[1])};${f(B1[1])};${f(B0[1])}" keyTimes="0;0.15;0.5;0.7;1" dur="8s" repeatCount="indefinite"/></line>`);
  out.push(angleMark(A, [300, A[1]], at(A, 100, a), { r: 26, color: C.blue }));
  out.push(label(A, 'A', -10, 16));
  files['trigonometry-similar.svg'] = svg(320, 225, out.join('\n'));
}

// ---------- 定义：对边、邻边、斜边 ----------
{
  const A = [40, 190], Cc = [300, 190], B = [300, 40];
  const out = [];
  out.push(line(B[0], B[1], Cc[0], Cc[1], { color: C.emph, w: 3 }), line(A[0], A[1], Cc[0], Cc[1], { color: C.blue, w: 3 }), line(A[0], A[1], B[0], B[1], { w: 2.5 }));
  out.push(rightAngle(Cc, A, B), angleMark(A, Cc, B, { r: 28, color: C.ink }));
  out.push(label(A, 'A', -10, 16), label(B, 'B', 0, -8), label(Cc, 'C', 10, 16));
  out.push(text(B[0] + 10, 118, 'a', { italic: true, color: C.emph }), text(B[0] + 10, 138, '∠A 的对边', { color: C.emph, size: 12 }));
  out.push(text(170, 212, 'b', { italic: true, color: C.blue, anchor: 'middle' }), text(200, 212, '∠A 的邻边', { color: C.blue, size: 12 }));
  out.push(text(150, 104, 'c', { italic: true, anchor: 'end' }), text(146, 122, '斜边', { size: 12, anchor: 'end' }));
  files['trigonometry-definition.svg'] = svg(380, 225, out.join('\n'));
}

// ---------- 斜边为 1：对边就是 sin A，邻边就是 cos A ----------
{
  const A = [40, 230], R = 220;
  // 角度随时间的变化：35 → 80 → 10 → 35，每段之间停一下
  const keys = [[0, 35], [0.1, 35], [0.35, 80], [0.45, 80], [0.8, 10], [0.9, 10], [1, 35]];
  const T = [], V = [];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, a0] = keys[i], [t1, a1] = keys[i + 1];
    const n = a0 === a1 ? 1 : Math.ceil(Math.abs(a1 - a0) / 2.5);
    for (let k = 0; k < n; k++) { T.push(t0 + ((t1 - t0) * k) / n); V.push(a0 + ((a1 - a0) * k) / n); }
  }
  T.push(1); V.push(35);
  const kt = T.map(t => +t.toFixed(4)).join(';'), dur = 12;
  const an = (attr, fn) => `<animate attributeName="${attr}" values="${V.map(a => f(fn(a))).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const bx = a => A[0] + R * Math.cos(rad(a)), by = a => A[1] - R * Math.sin(rad(a));
  const a0 = 35;
  // “sin A”平时写在红色对边的左侧（避开虚线圆弧），角很大、三角形很窄时换到右侧（避开斜边）
  const sx = a => (a < 55 ? bx(a) - 44 : bx(a) + 8);
  const out = [];
  out.push(arc(A, R, 0, 90, { color: C.soft, w: 1, dash: '4 3' }));
  out.push(line(A[0], A[1], A[0] + R + 20, A[1], { color: C.soft, w: 1 }));
  out.push(`<line x1="${A[0]}" y1="${A[1]}" x2="${f(bx(a0))}" y2="${A[1]}" stroke="${C.blue}" stroke-width="3">${an('x2', bx)}</line>`);
  out.push(`<line x1="${f(bx(a0))}" y1="${f(by(a0))}" x2="${f(bx(a0))}" y2="${A[1]}" stroke="${C.emph}" stroke-width="3">${an('x1', bx)}${an('x2', bx)}${an('y1', by)}</line>`);
  out.push(`<line x1="${A[0]}" y1="${A[1]}" x2="${f(bx(a0))}" y2="${f(by(a0))}" stroke="${C.ink}" stroke-width="2.5">${an('x2', bx)}${an('y2', by)}</line>`);
  const ra = a => { const x = bx(a); return `${f(x - 10)},${A[1]} ${f(x - 10)},${A[1] - 10} ${f(x)},${A[1] - 10}`; };
  out.push(`<polyline points="${ra(a0)}" stroke="${C.ink}" stroke-width="1.2" fill="none"><animate attributeName="points" values="${V.map(ra).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></polyline>`);
  out.push(`<circle cx="${f(bx(a0))}" cy="${f(by(a0))}" r="4" fill="${C.ink}">${an('cx', bx)}${an('cy', by)}</circle>`);
  out.push(`<text x="${f(sx(a0))}" y="${f((by(a0) + A[1]) / 2 + 5)}" fill="${C.emph}" font-style="italic">sin A${an('x', sx)}${an('y', a => (by(a) + A[1]) / 2 + 5)}</text>`);
  out.push(`<text x="${f((A[0] + bx(a0)) / 2)}" y="${A[1] + 20}" fill="${C.blue}" font-style="italic" text-anchor="middle">cos A${an('x', a => (A[0] + bx(a)) / 2)}</text>`);
  out.push(`<text x="${f((A[0] + bx(a0)) / 2 - 8)}" y="${f((A[1] + by(a0)) / 2 - 6)}" fill="${C.ink}" text-anchor="end">1${an('x', a => (A[0] + bx(a)) / 2 - 8)}${an('y', a => (A[1] + by(a)) / 2 - 6)}</text>`);
  out.push(label(A, 'A', -10, 16), text(A[0] + R, A[1] + 20, '1', { anchor: 'middle', color: C.soft, size: 12 }), text(A[0] - 8, A[1] - R + 4, '1', { anchor: 'end', color: C.soft, size: 12 }));
  files['trigonometry-unit.svg'] = svg(320, 260, out.join('\n'));
}

// ---------- 特殊角：等腰直角三角形和半个等边三角形 ----------
{
  const u = 110, out = [];
  // 45°
  const P = [30, 190], Q = [30 + u, 190], R = [30 + u, 190 - u];
  out.push(poly([P, Q, R]), rightAngle(Q, P, R), angleMark(P, Q, R, { r: 24 }), angleMark(R, P, Q, { r: 24 }));
  out.push(text(P[0] + 30, P[1] - 6, '45°', { color: C.emph, size: 12 }), text(R[0] - 6, R[1] + 40, '45°', { color: C.emph, size: 12, anchor: 'end' }));
  out.push(text((P[0] + Q[0]) / 2, 210, '1', { anchor: 'middle' }), text(Q[0] + 8, (Q[1] + R[1]) / 2 + 5, '1'), text((P[0] + R[0]) / 2 - 8, (P[1] + R[1]) / 2 - 4, '√2', { anchor: 'end' }));
  // 30°、60°：边长为 2 的等边三角形的一半
  const v = 90, X = [220, 190], Y = [220 + v, 190], Z = [220 + v, 190 - v * Math.sqrt(3)], W = [220 + 2 * v, 190];
  out.push(line(Z[0], Z[1], W[0], W[1], { color: C.soft, w: 1.5, dash: '6 4' }), line(Y[0], Y[1], W[0], W[1], { color: C.soft, w: 1.5, dash: '6 4' }));
  out.push(poly([X, Y, Z]), rightAngle(Y, X, Z), angleMark(X, Y, Z, { r: 22 }), angleMark(Z, X, Y, { r: 26 }));
  out.push(text(X[0] + 26, X[1] - 6, '60°', { color: C.emph, size: 12 }), text(Z[0] - 5, Z[1] + 52, '30°', { color: C.emph, size: 12, anchor: 'end' }));
  out.push(text((X[0] + Y[0]) / 2, 210, '1', { anchor: 'middle' }), text(Y[0] + 8, (Y[1] + Z[1]) / 2 + 5, '√3'), text((X[0] + Z[0]) / 2 - 8, (X[1] + Z[1]) / 2 - 4, '2', { anchor: 'end' }));
  files['trigonometry-special.svg'] = svg(420, 220, out.join('\n'));
}

// ---------- 例 1：作高，把斜三角形分成两个直角三角形 ----------
// 题干图只画已知条件（trigonometry-oblique.svg），解答里的图再添上高 AD（trigonometry-altitude.svg）
for (const withD of [false, true]) {
  const s = 50, B = [30, 180], D = [30 + 2 * Math.sqrt(3) * s, 180], Cc = [D[0] + 2 * s, 180], A = [D[0], 180 - 2 * s];
  const out = [poly([A, B, Cc])];
  if (withD) out.push(line(A[0], A[1], D[0], D[1], { color: C.blue, w: 2, dash: '6 4' }), rightAngle(D, Cc, A));
  out.push(angleMark(B, Cc, A, { r: 30 }), angleMark(Cc, A, B, { r: 22 }));
  out.push(text(B[0] + 36, B[1] - 5, '30°', { color: C.emph, size: 12 }), text(Cc[0] - 28, Cc[1] - 6, '45°', { color: C.emph, size: 12, anchor: 'end' }));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16));
  if (withD) out.push(label(D, 'D', 0, 18));
  out.push(text((A[0] + Cc[0]) / 2 + 10, (A[1] + Cc[1]) / 2 - 4, '2√2', { color: C.soft, size: 13 }));
  files[withD ? 'trigonometry-altitude.svg' : 'trigonometry-oblique.svg'] = svg(340, 200, out.join('\n'));
}

// ---------- 表格里的三张小图：仰角和俯角、坡度、方位角 ----------
// 放在表格单元格里，PDF 中缩到 36 mm 宽，所以画布只有 170 像素宽，文字用 12 号
{
  const O = [28, 62], out = [];
  out.push(line(O[0], O[1], 160, O[1], { color: C.soft, w: 1.2, dash: '5 4' }));
  const up = at(O, 135, 28), dn = at(O, 135, -22);
  out.push(line(O[0], O[1], ...up, { color: C.blue, w: 2 }), line(O[0], O[1], ...dn, { color: C.emph, w: 2 }));
  out.push(arc(O, 36, 0, 28, { color: C.blue, w: 2 }), arc(O, 36, -22, 0, { color: C.emph, w: 2 }));
  out.push(text(O[0] + 42, O[1] - 5, '仰角', { color: C.blue, size: 12 }), text(O[0] + 42, O[1] + 15, '俯角', { color: C.emph, size: 12 }));
  out.push(text(158, O[1] - 5, '水平线', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(dot(...O), text(O[0], O[1] + 44, '眼睛', { anchor: 'middle', size: 11, color: C.soft }));
  files['trigonometry-angles-cell.svg'] = svg(170, 120, out.join('\n'));
}
{
  // 坡度：铅直高度 h 与水平宽度 l 的比，坡角 α
  const B = [18, 100], Cc = [150, 100], A = [150, 34], out = [];
  out.push(poly([B, Cc, A], { fill: C.blueFill, color: C.ink, w: 1.5 }));
  out.push(line(B[0], B[1], A[0], A[1], { color: C.emph, w: 2.5 }));
  out.push(rightAngle(Cc, B, A, { size: 8 }), arc(B, 30, 0, Math.atan2(B[1] - A[1], A[0] - B[0]) * 180 / Math.PI, { color: C.blue, w: 1.8 }));
  out.push(text(B[0] + 34, B[1] - 5, 'α', { italic: true, color: C.blue, size: 12 }));
  out.push(text(Cc[0] + 5, (Cc[1] + A[1]) / 2 + 4, 'h', { italic: true, size: 13 }), text((B[0] + Cc[0]) / 2, B[1] + 15, 'l', { italic: true, size: 13, anchor: 'middle' }));
  out.push(text((B[0] + A[0]) / 2 - 6, (B[1] + A[1]) / 2 - 6, '坡面', { anchor: 'end', color: C.emph, size: 11 }));
  out.push(text(18, 22, 'i = h : l', { size: 12 }));
  files['trigonometry-slope-cell.svg'] = svg(170, 120, out.join('\n'));
}
{
  // 方位角：北偏东 60°，从正北方向往东量 60°
  const O = [85, 64], r = 48, out = [];
  const dir = (deg, len) => at(O, len, deg);
  for (const [deg, name, dx, dy] of [[90, '北', 0, -4], [-90, '南', 0, 13], [0, '东', 5, 4], [180, '西', -5, 4]]) {
    const p = dir(deg, r);
    out.push(line(O[0], O[1], ...p, { color: C.soft, w: 1.2, dash: deg === 90 ? '' : '4 3' }));
    out.push(text(p[0] + dx, p[1] + dy, name, { anchor: deg === 0 ? 'start' : deg === 180 ? 'end' : 'middle', size: 12, color: deg === 90 ? C.ink : C.soft }));
  }
  const P = dir(30, r + 6);
  out.push(line(O[0], O[1], ...P, { color: C.emph, w: 2.2 }), dot(...P, C.emph, 3));
  out.push(arc(O, 22, 90, 30, { color: C.blue, w: 1.8 }));
  const lab = dir(62, 32);
  out.push(text(lab[0] + 2, lab[1] + 2, '60°', { size: 11, color: C.blue }));
  out.push(dot(...O));
  files['trigonometry-bearing-cell.svg'] = svg(170, 125, out.join('\n'));
}

// ---------- 例 2：两次测仰角 ----------
{
  const s = 5, h = 10 * (Math.sqrt(3) + 1), g = 190;
  const D = [340, g], Cc = [340, g - h * s], B = [340 - h * s, g], A = [340 - h * Math.sqrt(3) * s, g];
  const out = [line(A[0] - 30, g, 360, g, { color: C.soft, w: 1.5 })];
  out.push(line(A[0], A[1], Cc[0], Cc[1], { color: C.blue, w: 1.5, dash: '6 4' }), line(B[0], B[1], Cc[0], Cc[1], { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(line(Cc[0], Cc[1], D[0], D[1], { w: 3 }), line(A[0], A[1], B[0], B[1], { color: C.emph, w: 3 }), rightAngle(D, B, Cc));
  out.push(angleMark(A, D, Cc, { r: 30 }), angleMark(B, D, Cc, { r: 22 }));
  out.push(text(A[0] + 36, g - 5, '30°', { color: C.emph, size: 12 }), text(B[0] + 28, g - 6, '45°', { color: C.emph, size: 12 }));
  out.push(label(A, 'A', 0, 18), label(B, 'B', 0, 18), label(Cc, 'C', 10, 0), label(D, 'D', 8, 18));
  out.push(text((A[0] + B[0]) / 2, g + 18, '20 m', { anchor: 'middle', color: C.emph, size: 12 }));
  files['trigonometry-elevation.svg'] = svg(380, 210, out.join('\n'));
}

// ---------- 例 3：堤坝的横截面 ----------
// 题干图（trigonometry-dike.svg）只画梯形和已知数据，堤高 6 m 用右侧的尺寸线表示；
// 解答里的图（trigonometry-slope.svg）再添上高 DE、CF
for (const withH of [false, true]) {
  const s = 14, g = 150;
  const A = [20, g], D = [20 + 6 * s, g - 6 * s], Cc = [D[0] + 4 * s, D[1]], B = [Cc[0] + 6 * Math.sqrt(3) * s, g];
  const E = [D[0], g], F = [Cc[0], g];
  const out = [poly([A, B, Cc, D], { fill: C.blueFill })];
  if (withH) {
    out.push(line(D[0], D[1], E[0], E[1], { color: C.soft, w: 1.5, dash: '5 4' }), line(Cc[0], Cc[1], F[0], F[1], { color: C.soft, w: 1.5, dash: '5 4' }));
    out.push(rightAngle(E, A, D, { size: 8 }), rightAngle(F, B, Cc, { size: 8 }));
  }
  out.push(line(B[0], B[1], Cc[0], Cc[1], { color: C.emph, w: 3 }), angleMark(B, A, Cc, { r: 34 }), text(B[0] - 40, B[1] - 8, 'α', { italic: true, color: C.emph, anchor: 'end' }));
  out.push(label(A, 'A', -6, 16), label(B, 'B', 6, 16), label(Cc, 'C', 6, -8), label(D, 'D', -6, -8));
  if (withH) out.push(label(E, 'E', 0, 16), label(F, 'F', 0, 16));
  out.push(text((D[0] + Cc[0]) / 2, D[1] - 8, '4 m', { anchor: 'middle', color: C.soft, size: 12 }));
  if (withH) out.push(text(D[0] + 6, (D[1] + E[1]) / 2 + 4, '6 m', { color: C.soft, size: 12 }));
  else {
    // 堤高：从堤顶引细虚线到右侧，画竖直的尺寸线
    const x = B[0] + 18;
    out.push(line(Cc[0] + 4, D[1], x + 6, D[1], { color: C.soft, w: 1, dash: '3 3' }), line(B[0] + 4, g, x + 6, g, { color: C.soft, w: 1, dash: '3 3' }));
    out.push(line(x, D[1], x, g, { color: C.soft, w: 1 }), line(x - 4, D[1], x + 4, D[1], { color: C.soft, w: 1 }), line(x - 4, g, x + 4, g, { color: C.soft, w: 1 }));
    out.push(text(x + 6, (D[1] + g) / 2 + 4, '6 m', { color: C.soft, size: 12 }));
  }
  out.push(text((A[0] + D[0]) / 2 - 10, (A[1] + D[1]) / 2, 'i = 1 : 1', { anchor: 'end', size: 12 }), text((B[0] + Cc[0]) / 2 + 10, (B[1] + Cc[1]) / 2 - 6, 'i = 1 : √3', { size: 12, color: C.emph }));
  files[withH ? 'trigonometry-slope.svg' : 'trigonometry-dike.svg'] = svg(withH ? 360 : 400, 175, out.join('\n'));
}

// ---------- 例 4：方位角 ----------
// 题干图（trigonometry-ship.svg）不画垂线 CH；解答里的图（trigonometry-bearing.svg）再添上 CH
for (const withH of [false, true]) {
  const s = 8, g = 200, A = [40, g], B = [40 + 20 * s, g];
  const Cc = at(B, 20 * s, 60), H = [Cc[0], g];
  const out = [];
  out.push(line(B[0], g, 340, g, { color: C.soft, w: 1.5, dash: '6 4' }));
  if (withH) out.push(line(Cc[0], Cc[1], H[0], H[1], { color: C.soft, w: 1.5, dash: '6 4' }), rightAngle(H, B, Cc, { size: 8 }));
  for (const p of [A, B]) {
    out.push(line(p[0], p[1], p[0], p[1] - 150, { color: C.soft, w: 1.2 }), `<polygon points="${p[0]},${p[1] - 158} ${p[0] - 4},${p[1] - 148} ${p[0] + 4},${p[1] - 148}" fill="${C.soft}" stroke="none"/>`, text(p[0], p[1] - 164, '北', { anchor: 'middle', color: C.soft, size: 12 }));
  }
  out.push(line(A[0], A[1], B[0], B[1], { color: C.emph, w: 3 }), line(A[0], A[1], Cc[0], Cc[1]), line(B[0], B[1], Cc[0], Cc[1]));
  out.push(arc(A, 44, 30, 90, { color: C.blue, w: 1.5 }), arc(B, 34, 60, 90, { color: C.blue, w: 1.5 }));
  out.push(text(A[0] + 26, A[1] - 48, '60°', { color: C.blue, size: 12 }), text(B[0] + 12, B[1] - 50, '30°', { color: C.blue, size: 12, anchor: 'middle' }));
  out.push(label(A, 'A', -6, 18), label(B, 'B', 0, 18), label(Cc, 'C', 8, -6));
  if (withH) out.push(label(H, 'H', 6, 18));
  out.push(text((A[0] + B[0]) / 2, g + 18, '20 海里', { anchor: 'middle', color: C.emph, size: 12 }), text(344, g + 5, '东', { color: C.soft, size: 12 }));
  files[withH ? 'trigonometry-bearing.svg' : 'trigonometry-ship.svg'] = svg(370, 225, out.join('\n'));
}

export default files;
