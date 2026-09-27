// 第六部分“平移、轴对称与旋转”的图。
import { C, f, svg, text, line, dot, poly, polyline, axes, arc, angleMark, rightAngle, tick, circle, rad } from './lib.mjs';

const files = {};
const num = v => (v < 0 ? '−' + -v : String(v));
const coord = (name, x, y) => `<tspan font-style="italic">${name}</tspan>(${num(x)}, ${num(y)})`;

// ---------- 平移：坐标网格上的三角形 ----------
{
  const { X, Y, body } = axes({ ox: 190, oy: 190, u: 30, xmin: -5.5, xmax: 5.5, ymin: -2, ymax: 5 });
  const out = [body];
  const a = 5, b = 2;
  const P = (x, y) => [X(x), Y(y)];
  const src = [[-4, 0], [-1, -1], [-2, 2]], dst = src.map(([x, y]) => [x + a, y + b]);
  const names = ['A', 'B', 'C'];
  src.forEach((p, i) => out.push(line(...P(...p), ...P(...dst[i]), { color: C.soft, w: 1.2, dash: '4 4' })));
  out.push(poly(src.map(p => P(...p))), poly(dst.map(p => P(...p)), { color: C.blue, dash: '6 4' }));
  // 原三角形用实线留在原处；移动的是虚线副本，初始（PDF）画在平移后的位置
  const dx = f(a * 30), dy = f(-b * 30);
  out.push(`<g transform="translate(${dx} ${dy})">${poly(src.map(p => P(...p)), { fill: C.blueFill, color: C.blue, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${dx} ${dy};${dx} ${dy}" keyTimes="0;0.2;0.65;1" dur="6s" repeatCount="indefinite"/></g>`);
  const offs = [[-12, -6], [-2, 18], [-12, -6]], offs2 = [[6, 18], [8, 14], [-4, -8]];
  src.forEach((p, i) => { out.push(dot(...P(...p))); out.push(text(P(...p)[0] + offs[i][0], P(...p)[1] + offs[i][1], names[i], { italic: true, anchor: 'middle' })); });
  dst.forEach((p, i) => { out.push(dot(...P(...p), C.blue)); out.push(text(P(...p)[0] + offs2[i][0], P(...p)[1] + offs2[i][1], names[i] + '′', { italic: true, anchor: 'middle', color: C.blue })); });
  files['transformations-translate.svg'] = svg(370, 270, out.join('\n'));
}

// ---------- 轴对称：关于 y 轴翻折 ----------
{
  const { X, Y, body } = axes({ ox: 190, oy: 170, u: 28, xmin: -6.2, xmax: 6.2, ymin: -1, ymax: 5 });
  const out = [body];
  const P = (x, y) => [X(x), Y(y)];
  const src = [[-5, 1], [-1, 2], [-3, 4]], dst = src.map(([x, y]) => [-x, y]);
  const names = ['A', 'B', 'C'];
  src.forEach((p, i) => out.push(line(...P(...p), ...P(...dst[i]), { color: C.emph, w: 1.2, dash: '4 4' })));
  src.forEach(p => out.push(rightAngle(P(0, p[1]), P(1, p[1]), P(0, p[1] + 1), { size: 7 })));
  out.push(poly(src.map(p => P(...p))), poly(dst.map(p => P(...p)), { color: C.blue, dash: '6 4' }));
  const ox = X(0);
  const inner = poly(src.map(([x, y]) => [X(x) - ox, Y(y)]), { fill: C.blueFill, color: C.blue, w: 2.5, dash: '6 4' });
  out.push(`<g transform="translate(${f(ox)} 0)"><g transform="scale(-1 1)"><animateTransform attributeName="transform" type="scale" values="1 1;1 1;-1 1;-1 1;1 1" keyTimes="0;0.15;0.5;0.85;1" dur="7s" repeatCount="indefinite"/>${inner}</g></g>`);
  const offs = [[-10, 16], [0, 18], [-12, -6]];
  src.forEach((p, i) => { out.push(dot(...P(...p))); out.push(text(P(...p)[0] + offs[i][0], P(...p)[1] + offs[i][1], names[i], { italic: true, anchor: 'middle' })); });
  dst.forEach((p, i) => { out.push(dot(...P(...p), C.blue)); out.push(text(P(...p)[0] - offs[i][0], P(...p)[1] + offs[i][1], names[i] + '′', { italic: true, anchor: 'middle', color: C.blue })); });
  files['transformations-reflect.svg'] = svg(390, 215, out.join('\n'));
}

// ---------- 关于 x 轴、y 轴、原点对称的点 ----------
{
  const { X, Y, body } = axes({ ox: 175, oy: 145, u: 36, xmin: -4.2, xmax: 4.2, ymin: -3.2, ymax: 3.2 });
  const out = [body];
  const P = [X(3), Y(2)], A = [X(3), Y(-2)], B = [X(-3), Y(2)], Cc = [X(-3), Y(-2)];
  out.push(line(...P, ...A, { color: C.blue, w: 1.2, dash: '5 4' }), line(...P, ...B, { color: C.blue, w: 1.2, dash: '5 4' }));
  out.push(line(...B, ...Cc, { color: C.grid, w: 1 }), line(...A, ...Cc, { color: C.grid, w: 1 }));
  out.push(line(...P, ...Cc, { color: C.emph, w: 1.5, dash: '5 4' }));
  out.push(dot(...P, C.emph, 5), dot(...A, C.blue, 5), dot(...B, C.blue, 5), dot(...Cc, C.emph, 5), dot(X(0), Y(0), C.emph, 3.5));
  out.push(text(P[0] + 6, P[1] - 10, coord('P', 3, 2), { color: C.emph }));
  out.push(text(A[0] + 6, A[1] + 20, coord('A', 3, -2), { color: C.blue }));
  out.push(text(B[0] - 6, B[1] - 10, coord('B', -3, 2), { color: C.blue, anchor: 'end' }));
  out.push(text(Cc[0] - 6, Cc[1] + 20, coord('C', -3, -2), { color: C.emph, anchor: 'end' }));
  files['transformations-points.svg'] = svg(360, 290, out.join('\n'));
}

// ---------- 旋转：绕点 O 逆时针旋转 90° ----------
{
  const u = 32, O = [136, 200];
  const P = ([x, y]) => [O[0] + u * x, O[1] - u * y];
  const src = [[3, 1], [5, 1], [4, 3]], dst = src.map(([x, y]) => [-y, x]);
  const names = ['A', 'B', 'C'];
  const out = [];
  const rA = Math.hypot(3, 1) * u, a0 = Math.atan2(1, 3) * 180 / Math.PI;
  out.push(arc(O, rA, a0, a0 + 90, { color: C.soft, w: 1, dash: '4 4' }));
  out.push(poly(src.map(P)), poly(dst.map(P), { color: C.blue, dash: '6 4' }));
  // OB、OB′、OC、OC′ 也画出来（细虚线），它们同样相等、夹角同样是 90°
  for (const i of [1, 2]) out.push(line(...O, ...P(src[i]), { color: C.soft, w: 1, dash: '3 3' }), line(...O, ...P(dst[i]), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(...O, ...P(src[0]), { color: C.emph, w: 2 }), line(...O, ...P(dst[0]), { color: C.emph, w: 2 }));
  out.push(angleMark(O, P(src[0]), P(dst[0]), { r: 22 }));
  const am = (a0 + 45) * Math.PI / 180;
  out.push(text(O[0] + 40 * Math.cos(am), O[1] - 40 * Math.sin(am) + 4, '90°', { color: C.emph, size: 13, anchor: 'middle' }));
  // 旋转的三角形：初始画成旋转后的位置。屏幕上逆时针是负角
  const rot = a => `${a} ${O[0]} ${O[1]}`;
  out.push(`<g transform="rotate(${rot(-90)})">${poly(src.map(P), { fill: C.blueFill, color: C.blue, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${rot(0)};${rot(0)};${rot(-90)};${rot(-90)}" keyTimes="0;0.2;0.7;1" dur="7s" repeatCount="indefinite"/></g>`);
  const offs = [[6, 18], [12, 5], [0, -10]];
  src.forEach((p, i) => { out.push(dot(...P(p))); out.push(text(P(p)[0] + offs[i][0], P(p)[1] + offs[i][1], names[i], { italic: true, anchor: 'middle' })); });
  const offs2 = [[-14, 12], [0, -10], [-14, 4]];
  dst.forEach((p, i) => { out.push(dot(...P(p), C.blue)); out.push(text(P(p)[0] + offs2[i][0], P(p)[1] + offs2[i][1], names[i] + '′', { italic: true, anchor: 'middle', color: C.blue })); });
  out.push(dot(...O, C.ink, 4.5), text(O[0] - 6, O[1] + 18, 'O', { italic: true }));
  files['transformations-rotate.svg'] = svg(340, 230, out.join('\n'));
}

// ---------- 中心对称：绕点 O 旋转 180° ----------
{
  const u = 28, O = [185, 125];
  const P = ([x, y]) => [O[0] + u * x, O[1] - u * y];
  const src = [[-5, 1], [-3, 3], [-2, 0]], dst = src.map(([x, y]) => [-x, -y]);
  const names = ['A', 'B', 'C'];
  const out = [];
  src.forEach((p, i) => out.push(line(...P(p), ...P(dst[i]), { color: C.emph, w: 1.2, dash: '4 4' })));
  out.push(poly(src.map(P)), poly(dst.map(P), { color: C.blue, dash: '6 4' }));
  const rot = a => `${a} ${O[0]} ${O[1]}`;
  out.push(`<g transform="rotate(${rot(-180)})">${poly(src.map(P), { fill: C.blueFill, color: C.blue, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${rot(0)};${rot(0)};${rot(-180)};${rot(-180)}" keyTimes="0;0.2;0.7;1" dur="7s" repeatCount="indefinite"/></g>`);
  const offs = [[-12, 4], [0, -10], [2, 18]];
  src.forEach((p, i) => { out.push(dot(...P(p))); out.push(text(P(p)[0] + offs[i][0], P(p)[1] + offs[i][1], names[i], { italic: true, anchor: 'middle' })); });
  dst.forEach((p, i) => { out.push(dot(...P(p), C.blue)); out.push(text(P(p)[0] - offs[i][0], P(p)[1] - offs[i][1] + (i === 1 ? 10 : i === 2 ? 0 : 8), names[i] + '′', { italic: true, anchor: 'middle', color: C.blue })); });
  out.push(dot(...O, C.emph, 4.5), text(O[0] + 2, O[1] - 10, 'O', { italic: true, color: C.emph }));
  files['transformations-central.svg'] = svg(370, 250, out.join('\n'));
}

// ---------- 常见图形的对称轴和对称中心 ----------
{
  const out = [];
  const axis = (p, q) => line(...p, ...q, { color: C.blue, w: 1.2, dash: '5 4' });
  const center = (x, y) => dot(x, y, C.emph, 4);
  const cap = (x, s) => text(x, 150, s, { anchor: 'middle', size: 13 });
  // 等腰三角形
  { const cx = 50; out.push(axis([cx, 22], [cx, 128]), poly([[cx, 30], [cx - 38, 118], [cx + 38, 118]]), cap(cx, '等腰三角形')); }
  // 平行四边形
  { const cx = 150, cy = 75; out.push(poly([[cx - 45, cy + 32], [cx + 20, cy + 32], [cx + 45, cy - 32], [cx - 20, cy - 32]]), center(cx, cy), cap(cx, '平行四边形')); }
  // 矩形
  { const cx = 255, cy = 75; out.push(axis([cx, cy - 46], [cx, cy + 46]), axis([cx - 56, cy], [cx + 56, cy]), poly([[cx - 45, cy - 32], [cx + 45, cy - 32], [cx + 45, cy + 32], [cx - 45, cy + 32]]), center(cx, cy), cap(cx, '矩形')); }
  // 正五边形
  { const cx = 360, cy = 80, r = 42; const pts = [0, 1, 2, 3, 4].map(k => [cx + r * Math.cos(rad(90 + 72 * k)), cy - r * Math.sin(rad(90 + 72 * k))]);
    for (let k = 0; k < 5; k++) { const a = rad(90 + 72 * k); out.push(axis([cx + 52 * Math.cos(a), cy - 52 * Math.sin(a)], [cx - 52 * Math.cos(a), cy + 52 * Math.sin(a)])); }
    out.push(poly(pts), cap(cx, '正五边形')); }
  // 正六边形
  { const cx = 465, cy = 78, r = 42; const pts = [0, 1, 2, 3, 4, 5].map(k => [cx + r * Math.cos(rad(60 * k)), cy - r * Math.sin(rad(60 * k))]);
    for (let k = 0; k < 6; k++) { const a = rad(30 * k); out.push(axis([cx + 52 * Math.cos(a), cy - 52 * Math.sin(a)], [cx - 52 * Math.cos(a), cy + 52 * Math.sin(a)])); }
    out.push(poly(pts), center(cx, cy), cap(cx, '正六边形')); }
  files['transformations-shapes.svg'] = svg(520, 165, out.join('\n'));
}

// ---------- 例题：正方形中的旋转 ----------
// 题干的图只画题目给的条件；解法的图再画出旋转得到的 △ABG（动画：△ADF 绕 A 顺时针转 90°）
for (const sol of [false, true]) {
  const u = 40, ox = 110, oy = 280;
  const P = ([x, y]) => [ox + u * x, oy - u * y];
  const A = [0, 6], B = [0, 0], Cc = [6, 0], D = [6, 6], E = [3, 0], F = [6, 4], G = [-2, 0];
  const out = [];
  out.push(poly([P(A), P(E), P(F)], { fill: C.emphFill, color: 'none', w: 0 }));
  out.push(poly([P(A), P(B), P(Cc), P(D)]));
  out.push(line(...P(A), ...P(E)), line(...P(A), ...P(F)), line(...P(E), ...P(F), { color: C.emph, w: 2.5 }));
  out.push(angleMark(P(A), P(E), P(F), { r: 34 }));
  out.push(text(P(A)[0] + 30, P(A)[1] + 46, '45°', { color: C.emph, size: 12 }));
  if (sol) {
    // 原来的 △ADF 留在原处（实线）；旋转的是虚线副本，初始画成转过去的状态。屏幕上顺时针是正角
    out.push(poly([P(A), P(D), P(F)], { fill: C.blueFill, color: 'none', w: 0 }));
    out.push(line(...P(G), ...P(B), { color: C.blue, w: 2 }), line(...P(A), ...P(G), { color: C.blue, w: 2 }));
    const rot = a => `${a} ${f(P(A)[0])} ${f(P(A)[1])}`;
    out.push(`<g transform="rotate(${rot(90)})">${poly([P(A), P(D), P(F)], { fill: C.blueFill, color: C.blue, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${rot(0)};${rot(0)};${rot(90)};${rot(90)}" keyTimes="0;0.2;0.7;1" dur="7s" repeatCount="indefinite"/></g>`);
  }
  const lab = (p, s, dx, dy, col = C.ink) => text(P(p)[0] + dx, P(p)[1] + dy, s, { italic: true, anchor: 'middle', color: col });
  for (const p of [A, B, Cc, D, E, F]) out.push(dot(...P(p), C.ink, 3.5));
  out.push(lab(A, 'A', -10, -8), lab(B, 'B', 0, 20), lab(Cc, 'C', 8, 20), lab(D, 'D', 10, -8), lab(E, 'E', 0, 20), lab(F, 'F', 12, 5));
  if (sol) out.push(dot(...P(G), C.blue, 3.5), lab(G, 'G', 0, 20, C.blue));
  files[sol ? 'transformations-square-rotate.svg' : 'transformations-square.svg'] = svg(400, 320, out.join('\n'));
}

// ---------- 找旋转中心：两条垂直平分线的交点 ----------
{
  const u = 30, O = [150, 215];
  const P = ([x, y]) => [O[0] + u * x, O[1] - u * y];
  const src = [[3, 1], [5, 1], [4, 3]], dst = src.map(([x, y]) => [-y, x]);
  const out = [];
  out.push(poly(src.map(P), { color: C.soft, w: 1.5 }), poly(dst.map(P), { color: C.soft, w: 1.5 }));
  // AA′、BB′ 及它们的垂直平分线（都经过 O）
  for (const i of [0, 1]) {
    const a = src[i], b = dst[i], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    out.push(line(...P(a), ...P(b), { color: C.ink, w: 1.5, dash: '5 4' }));
    const k = 1.35; // 垂直平分线从 O 画到 M 再往外伸一点
    out.push(line(...O, ...P([m[0] * k, m[1] * k]), { color: C.blue, w: 1.8 }));
    out.push(line(...P([-m[0] * 0.25, -m[1] * 0.25]), ...O, { color: C.blue, w: 1.8 }));
    out.push(rightAngle(P(m), P(a), P([m[0] * 2, m[1] * 2]), { size: 7 }));
    out.push(tick(P(a), P(m), i + 1), tick(P(m), P(b), i + 1));
  }
  const names = ['A', 'B'], offs = [[8, 16], [10, 5]], offs2 = [[-14, 4], [-14, 0]];
  [0, 1].forEach(i => {
    out.push(dot(...P(src[i])), text(P(src[i])[0] + offs[i][0], P(src[i])[1] + offs[i][1], names[i], { italic: true, anchor: 'middle' }));
    out.push(dot(...P(dst[i]), C.blue), text(P(dst[i])[0] + offs2[i][0], P(dst[i])[1] + offs2[i][1], names[i] + '′', { italic: true, anchor: 'middle', color: C.blue }));
  });
  out.push(dot(...O, C.emph, 4.5), text(O[0] + 10, O[1] + 12, 'O', { italic: true, color: C.emph }));
  files['transformations-center.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 图案：一个基本图形绕中心旋转 ----------
{
  const u = 32, O = [160, 150];
  const P = ([x, y]) => [O[0] + u * x, O[1] - u * y];
  const blade = [[0, 0], [0, 4], [2, 2]];
  const rotp = ([x, y], k) => { let p = [x, y]; for (let i = 0; i < k; i++) p = [-p[1], p[0]]; return p; };
  const out = [];
  for (let k = 1; k < 4; k++) out.push(poly(blade.map(p => P(rotp(p, k))), { fill: C.blueFill, color: C.blue, w: 2 }));
  out.push(poly(blade.map(P), { fill: C.emphFill, color: C.emph, w: 2.5 }));
  // 高亮的基本图形依次转到 90°、180°、270°，每个位置停一下（屏幕上逆时针为负角）
  const r = a => `${a} ${O[0]} ${O[1]}`;
  const vals = [0, 0, -90, -90, -180, -180, -270, -270, -360].map(r).join(';');
  out.push(`<g>${poly(blade.map(P), { fill: 'none', color: C.emph, w: 3, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="${vals}" keyTimes="0;0.1;0.2;0.35;0.45;0.6;0.7;0.85;1" dur="10s" repeatCount="indefinite"/></g>`);
  out.push(dot(...O, C.ink, 4), text(O[0] + 12, O[1] - 2, 'O', { italic: true }));
  files['transformations-pattern.svg'] = svg(320, 300, out.join('\n'));
}

// ---------- 函数图象的平移：y = x² 向右平移 2 个单位 ----------
{
  const { X, Y, body } = axes({ ox: 110, oy: 220, u: 32, xmin: -3, xmax: 5.5, ymin: -0.8, ymax: 5.5 });
  const out = [body];
  const par = h => { const pts = []; for (let x = h - 2.3; x <= h + 2.3 + 1e-9; x += 0.05) pts.push([X(x), Y((x - h) ** 2)]); return pts; };
  // 原图象用实线留在原处；平移的是虚线副本，初始（PDF）画在平移后的位置
  out.push(polyline(par(0), { color: C.blue, w: 2.5 }));
  const d = f(2 * 32);
  out.push(`<g transform="translate(${d} 0)">${polyline(par(0), { color: C.emph, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${d} 0;${d} 0" keyTimes="0;0.2;0.65;1" dur="6s" repeatCount="indefinite"/></g>`);
  // 对应点 P(2, 4) → P′(4, 4)，O → (2, 0)
  out.push(line(X(2), Y(4), X(4) - 6, Y(4), { color: C.ink, w: 1.5 }));
  out.push(`<polygon points="${f(X(4) - 2)},${f(Y(4))} ${f(X(4) - 10)},${f(Y(4) - 4)} ${f(X(4) - 10)},${f(Y(4) + 4)}" fill="${C.ink}" stroke="none"/>`);
  out.push(dot(X(2), Y(4), C.blue, 4), dot(X(4), Y(4), C.emph, 4), dot(X(2), Y(0), C.emph, 4));
  out.push(text(X(2) - 8, Y(4) + 4, coord('P', 2, 4), { anchor: 'end', color: C.blue, size: 13 }));
  out.push(text(X(4) + 8, Y(4) + 4, coord('P′', 4, 4), { color: C.emph, size: 13 }));
  out.push(text(X(2), Y(0) + 32, '(2, 0)', { color: C.emph, size: 12, anchor: 'middle' }));
  out.push(text(X(-2.3) + 12, Y(5.29) + 2, 'y = x²', { color: C.blue, size: 13 }));
  out.push(text(X(4.3) + 6, Y(5.29) + 12, 'y = (x − 2)²', { color: C.emph, size: 13 }));
  files['transformations-graph.svg'] = svg(360, 262, out.join('\n'));
}

export default files;
