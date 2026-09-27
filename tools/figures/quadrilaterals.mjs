// 第五部分“四边形”的图。
import { C, f, svg, text, line, seg, dot, poly, rightAngle, tick, label, angleMark, arc, dir } from './lib.mjs';

const files = {};
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const along = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
// 平行记号：在线段 ab 中点画 n 个指向 b 的小箭头
function par(a, b, n = 1, o = {}) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn = [-u[1], u[0]];
  const m = along(a, b, o.at ?? 0.5);
  let s = '';
  for (let i = 0; i < n; i++) {
    const c = add(m, [(i - (n - 1) / 2) * 6 * u[0], (i - (n - 1) / 2) * 6 * u[1]]);
    const p1 = [c[0] - 6 * u[0] + 5 * nn[0], c[1] - 6 * u[1] + 5 * nn[1]], p2 = [c[0] - 6 * u[0] - 5 * nn[0], c[1] - 6 * u[1] - 5 * nn[1]];
    s += `<polyline points="${f(p1[0])},${f(p1[1])} ${f(c[0])},${f(c[1])} ${f(p2[0])},${f(p2[1])}" stroke="${o.color || C.blue}" stroke-width="1.8" fill="none"/>`;
  }
  return s;
}
// 绕点 o 旋转 180° 的动画：内容从原位置转到对称位置。初始（PDF）画成转过去的状态
const spin = (o, body, dur = 7) =>
  `<g transform="rotate(180 ${f(o[0])} ${f(o[1])})">${body}<animateTransform attributeName="transform" type="rotate" values="0 ${f(o[0])} ${f(o[1])};0 ${f(o[0])} ${f(o[1])};180 ${f(o[0])} ${f(o[1])};180 ${f(o[0])} ${f(o[1])};0 ${f(o[0])} ${f(o[1])}" keyTimes="0;0.15;0.5;0.85;1" dur="${dur}s" repeatCount="indefinite"/></g>`;
const names = (pts, offs, o = {}) => pts.map(([p, s], i) => label(p, s, ...offs[i], o)).join('');

// ---------- 四边形家族 ----------
{
  const out = [];
  const icon = {
    q: (c) => poly([[c[0] - 30, c[1] + 16], [c[0] + 34, c[1] + 16], [c[0] + 22, c[1] - 18], [c[0] - 18, c[1] - 12]]),
    p: (c) => poly([[c[0] - 34, c[1] + 16], [c[0] + 20, c[1] + 16], [c[0] + 34, c[1] - 16], [c[0] - 20, c[1] - 16]]),
    r: (c) => poly([[c[0] - 32, c[1] + 16], [c[0] + 32, c[1] + 16], [c[0] + 32, c[1] - 16], [c[0] - 32, c[1] - 16]]),
    h: (c) => poly([[c[0], c[1] + 20], [c[0] + 32, c[1]], [c[0], c[1] - 20], [c[0] - 32, c[1]]]),
    s: (c) => poly([[c[0] - 18, c[1] + 18], [c[0] + 18, c[1] + 18], [c[0] + 18, c[1] - 18], [c[0] - 18, c[1] - 18]]),
  };
  const N = { q: [240, 40, '四边形'], p: [240, 145, '平行四边形'], r: [110, 250, '矩形'], h: [370, 250, '菱形'], s: [240, 355, '正方形'] };
  for (const [k, [x, y, name]] of Object.entries(N)) {
    out.push(icon[k]([x, y]), text(x, y + 38, name, { anchor: 'middle', size: 14 }));
  }
  // at：标注的基线起点（相对箭头中点的偏移），放在箭头外侧，避免压线
  const arrow = (p, q, cap, side, at = [side * 8, 4]) => {
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], nn = [-u[1], u[0]];
    const h = [q[0] - 8 * u[0], q[1] - 8 * u[1]];
    const m = mid(p, q);
    return seg(p, h, { color: C.soft, w: 1.5 }) +
      `<polygon points="${f(q[0])},${f(q[1])} ${f(h[0] + 4 * nn[0])},${f(h[1] + 4 * nn[1])} ${f(h[0] - 4 * nn[0])},${f(h[1] - 4 * nn[1])}" fill="${C.soft}" stroke="none"/>` +
      text(m[0] + at[0], m[1] + at[1], cap, { anchor: side > 0 ? 'start' : 'end', color: C.emph, size: 12 });
  };
  out.push(arrow([240, 86], [240, 120], '两组对边分别平行', 1));
  out.push(arrow([205, 190], [140, 228], '有一个角是直角', -1, [-12, -8]));
  out.push(arrow([275, 190], [340, 226], '一组邻边相等', 1, [12, -8]));
  out.push(arrow([140, 295], [205, 332], '一组邻边相等', -1, [-8, 18]));
  out.push(arrow([340, 295], [275, 332], '有一个角是直角', 1, [8, 18]));
  files['quadrilaterals-family.svg'] = svg(480, 405, out.join('\n'));
}

// ---------- 平行四边形的性质：连一条对角线 ----------
const PG = { A: [100, 40], B: [50, 180], C: [290, 180], D: [340, 40] };
{
  const { A, B, C: Cc, D } = PG;
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { color: C.soft, w: 1.5, dash: '6 4' }));
  out.push(angleMark(A, Cc, B, { r: 30 }), angleMark(Cc, A, D, { r: 30 }));
  out.push(angleMark(A, D, Cc, { r: 22, color: C.blue, n: 2 }), angleMark(Cc, B, A, { r: 22, color: C.blue, n: 2 }));
  out.push(par(A, D, 1), par(B, Cc, 1), par(B, A, 2), par(Cc, D, 2));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D']], [[-8, -8], [-10, 16], [10, 16], [8, -8]]));
  files['quadrilaterals-parallelogram.svg'] = svg(380, 205, out.join('\n'));
}

// ---------- 平行四边形是中心对称图形 ----------
{
  const { A, B, C: Cc, D } = PG, O = mid(A, Cc);
  const out = [];
  out.push(spin(O, poly([A, B, Cc, D], { fill: C.blueFill, color: C.blue, w: 1.5 }) + seg(A, Cc, { color: C.blue, w: 1 }) + seg(B, D, { color: C.blue, w: 1 })));
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { w: 1.5 }), seg(B, D, { w: 1.5 }));
  out.push(tick(A, O, 1), tick(O, Cc, 1), tick(B, O, 2, { color: C.blue }), tick(O, D, 2, { color: C.blue }));
  out.push(dot(...O, C.emph));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-8, -8], [-10, 16], [10, 16], [8, -8], [0, 22]]));
  files['quadrilaterals-center.svg'] = svg(380, 205, out.join('\n'));
}

// ---------- 平行四边形的判定 ----------
{
  const out = [];
  const pg = (x0, y0) => ({ A: [x0 + 30, y0], B: [x0, y0 + 70], C: [x0 + 140, y0 + 70], D: [x0 + 170, y0] });
  const cap = (x0, y0, s) => text(x0 + 85, y0 + 110, s, { anchor: 'middle', size: 13 });
  // 点名和表格里的推理一致：A 左上、B 左下、C 右下、D 右上
  const abcd = ({ A, B, C: Cc, D }) => names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D']], [[-8, -8], [-10, 16], [10, 16], [8, -8]]);
  const dashAC = ({ A, C: Cc }) => seg(A, Cc, { color: C.soft, w: 1.2, dash: '5 4' });   // 表格里“连接 AC”
  {
    const x0 = 30, y0 = 25, P = pg(x0, y0), { A, B, C: Cc, D } = P;
    out.push(dashAC(P), abcd(P));
    out.push(poly([A, B, Cc, D]), tick(A, D, 1), tick(B, Cc, 1), tick(A, B, 2, { color: C.blue }), tick(D, Cc, 2, { color: C.blue }), cap(x0, y0, '两组对边分别相等'));
  }
  {
    const x0 = 260, y0 = 25, P = pg(x0, y0), { A, B, C: Cc, D } = P;
    out.push(dashAC(P), abcd(P));
    out.push(poly([A, B, Cc, D]), seg(A, D, { color: C.emph, w: 2.5 }), seg(B, Cc, { color: C.emph, w: 2.5 }));
    out.push(par(A, D, 1, { at: 0.35 }), par(B, Cc, 1, { at: 0.35 }), tick(A, D, 1), tick(B, Cc, 1), cap(x0, y0, '一组对边平行且相等'));
  }
  {
    const x0 = 30, y0 = 180, P = pg(x0, y0), { A, B, C: Cc, D } = P;
    out.push(abcd(P));
    out.push(poly([A, B, Cc, D]), angleMark(A, B, D, { r: 16 }), angleMark(Cc, D, B, { r: 16 }), angleMark(B, Cc, A, { r: 16, color: C.blue, n: 2 }), angleMark(D, A, Cc, { r: 16, color: C.blue, n: 2 }), cap(x0, y0, '两组对角分别相等'));
  }
  {
    const x0 = 260, y0 = 180, P = pg(x0, y0), { A, B, C: Cc, D } = P, O = mid(A, Cc);
    out.push(abcd(P), names([[O, 'O']], [[0, 18]]), dot(...O));
    out.push(poly([A, B, Cc, D]), seg(A, Cc, { w: 1.5 }), seg(B, D, { w: 1.5 }));
    out.push(tick(A, O, 1), tick(O, Cc, 1), tick(B, O, 2, { color: C.blue }), tick(O, D, 2, { color: C.blue }), cap(x0, y0, '对角线互相平分'));
  }
  files['quadrilaterals-tests.svg'] = svg(470, 310, out.join('\n'));
}

// ---------- 例 1：AE = CF，证 BEDF 是平行四边形。题干图不画 BD，证明（思路二）的图再连 BD ----------
{
  const A = [100, 40], B = [50, 190], Cc = [310, 190], D = [360, 40];
  const O = mid(A, Cc), E = along(A, Cc, 0.22), F = along(A, Cc, 0.78);
  const fig = diag => {
    const out = [];
    out.push(poly([A, B, Cc, D]), seg(A, Cc, { w: 1.5 }));
    if (diag) out.push(seg(B, D, { color: C.blue, w: 1.5, dash: '6 4' }));
    out.push(poly([B, E, D, F], { color: C.emph, w: 2.5 }));
    out.push(tick(A, E, 1), tick(F, Cc, 1));
    out.push(dot(...E), dot(...F));
    if (diag) out.push(dot(...O, C.blue), tick(E, O, 2, { color: C.blue }), tick(O, F, 2, { color: C.blue }));
    const pts = [[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [E, 'E'], [F, 'F']], offs = [[-8, -8], [-10, 16], [10, 16], [8, -8], [-4, -10], [4, 20]];
    if (diag) { pts.push([O, 'O']); offs.push([0, 20]); }
    out.push(names(pts, offs));
    return svg(400, 215, out.join('\n'));
  };
  files['quadrilaterals-example.svg'] = fig(false);
  files['quadrilaterals-example-diagonal.svg'] = fig(true);
}

// ---------- 三角形的中位线：把 △ADE 绕 E 转 180° ----------
{
  const A = [150, 30], B = [50, 200], Cc = [300, 200];
  const D = mid(A, B), E = mid(A, Cc), F = sub([2 * E[0], 2 * E[1]], D);
  const out = [];
  out.push(spin(E, poly([A, D, E], { fill: C.blueFill, color: 'none', w: 0 })));
  out.push(poly([A, B, Cc]), seg(D, E, { color: C.emph, w: 2.5 }));
  out.push(seg(E, F, { color: C.soft, w: 1.5, dash: '6 4' }), seg(Cc, F, { color: C.soft, w: 1.5, dash: '6 4' }));
  out.push(tick(A, D, 1), tick(D, B, 1), tick(A, E, 2, { color: C.blue }), tick(E, Cc, 2, { color: C.blue }));
  out.push(dot(...D), dot(...E), dot(...F, C.soft));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [E, 'E'], [F, 'F']], [[0, -8], [-10, 16], [10, 16], [-12, 0], [-2, -10], [10, -2]]));
  files['quadrilaterals-midline.svg'] = svg(380, 225, out.join('\n'));
}

// ---------- 中点四边形：题干图、证明图（连 AC）、想一想的图（两条对角线） ----------
{
  const A = [50, 150], B = [150, 30], Cc = [340, 80], D = [280, 215];
  const E = mid(A, B), F = mid(B, Cc), G = mid(Cc, D), H = mid(D, A);
  const fig = mode => {
    const out = [];
    out.push(poly([A, B, Cc, D]));
    if (mode !== 'stem') out.push(seg(A, Cc, { color: mode === 'both' ? C.emph : C.soft, w: 1.5, dash: '6 4' }));
    if (mode === 'both') out.push(seg(B, D, { color: C.blue, w: 1.5, dash: '6 4' }));
    out.push(poly([E, F, G, H], { fill: C.blueFill, color: mode === 'both' ? C.ink : C.blue, w: 2.5 }));
    if (mode === 'proof') out.push(seg(E, F, { color: C.emph, w: 2.5 }), seg(H, G, { color: C.emph, w: 2.5 }));
    if (mode === 'both') out.push(seg(E, F, { color: C.emph, w: 2.5 }), seg(H, G, { color: C.emph, w: 2.5 }), seg(E, H, { color: C.blue, w: 2.5 }), seg(F, G, { color: C.blue, w: 2.5 }));
    out.push(tick(A, E, 1, { color: C.ink }), tick(E, B, 1, { color: C.ink }), tick(B, F, 2, { color: C.ink }), tick(F, Cc, 2, { color: C.ink }));
    out.push(tick(Cc, G, 3, { color: C.ink }), tick(G, D, 3, { color: C.ink }), tick(D, H, 4, { color: C.ink }), tick(H, A, 4, { color: C.ink }));
    out.push(dot(...E), dot(...F), dot(...G), dot(...H));
    out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [E, 'E'], [F, 'F'], [G, 'G'], [H, 'H']], [[-12, 4], [0, -8], [12, 0], [8, 16], [-12, -4], [4, -10], [12, 10], [-6, 18]]));
    return svg(370, 240, out.join('\n'));
  };
  files['quadrilaterals-varignon.svg'] = fig('stem');
  files['quadrilaterals-varignon-proof.svg'] = fig('proof');
  files['quadrilaterals-varignon-diagonals.svg'] = fig('both');
}

// ---------- 矩形 ----------
{
  const A = [60, 40], B = [60, 190], Cc = [320, 190], D = [320, 40], O = mid(A, Cc);
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { color: C.emph, w: 2.5 }), seg(B, D, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(A, B, D), rightAngle(B, Cc, A), rightAngle(Cc, D, B), rightAngle(D, A, Cc));
  out.push(tick(A, O, 1, { color: C.ink }), tick(O, Cc, 1, { color: C.ink }), tick(B, O, 1, { color: C.ink }), tick(O, D, 1, { color: C.ink }));
  out.push(dot(...O));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-10, -4], [-10, 16], [10, 16], [10, -4], [0, 22]]));
  files['quadrilaterals-rectangle.svg'] = svg(380, 215, out.join('\n'));
}

// ---------- 直角三角形斜边上的中线 ----------
{
  const A = [60, 50], B = [60, 190], Cc = [300, 190], D = [300, 50], O = mid(A, Cc);
  const out = [];
  out.push(spin(O, poly([A, B, Cc], { fill: C.blueFill, color: 'none', w: 0 })));
  out.push(seg(A, D, { color: C.soft, w: 1.5, dash: '6 4' }), seg(D, Cc, { color: C.soft, w: 1.5, dash: '6 4' }), seg(O, D, { color: C.soft, w: 1.5, dash: '6 4' }));
  out.push(poly([A, B, Cc]), seg(B, O, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(B, Cc, A));
  out.push(tick(A, O, 1), tick(O, Cc, 1), tick(B, O, 1));
  out.push(dot(...O));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-10, -4], [-10, 16], [10, 16], [10, -4], [2, -12]]));
  files['quadrilaterals-median.svg'] = svg(360, 215, out.join('\n'));
}

// ---------- 菱形 ----------
{
  const O = [180, 125], A = [105, 125], Cc = [255, 125], B = [180, 25], D = [180, 225];
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { color: C.blue, w: 1.5 }), seg(B, D, { color: C.blue, w: 1.5 }));
  out.push(tick(A, B, 1), tick(B, Cc, 1), tick(Cc, D, 1), tick(D, A, 1));
  out.push(rightAngle(O, Cc, B));
  const half = (v, p, q, r) => { const d0 = dir(v, p), d1 = dir(v, q); return arc(v, r, d0, d1 - Math.sign(d1 - d0) * 6, { color: C.emph, w: 1.5 }); };
  out.push(half(A, B, O, 22), half(A, D, O, 22), half(A, B, O, 26), half(A, D, O, 26));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-12, 5], [0, -8], [12, 5], [0, 20], [-8, 18]]));
  files['quadrilaterals-rhombus.svg'] = svg(360, 245, out.join('\n'));
}

// ---------- 正方形 ----------
{
  const A = [100, 30], B = [100, 210], Cc = [280, 210], D = [280, 30], O = mid(A, Cc);
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { color: C.blue, w: 1.5 }), seg(B, D, { color: C.blue, w: 1.5 }));
  out.push(rightAngle(A, B, D), rightAngle(B, Cc, A), rightAngle(Cc, D, B), rightAngle(D, A, Cc));
  out.push(tick(A, B, 1), tick(B, Cc, 1), tick(Cc, D, 1), tick(D, A, 1));
  out.push(rightAngle(O, Cc, D, { color: C.blue }));
  out.push(angleMark(B, Cc, O, { r: 28 }), text(B[0] + 34, B[1] - 8, '45°', { color: C.emph, size: 12 }));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-10, -4], [-10, 16], [10, 16], [10, -4], [-14, 5]]));
  files['quadrilaterals-square.svg'] = svg(380, 235, out.join('\n'));
}

// ---------- 从对角线看四类平行四边形 ----------
{
  const O = [200, 140];
  const shape = (p, q, th) => {
    const u2 = [Math.cos(th * Math.PI / 180), -Math.sin(th * Math.PI / 180)];
    const A = [O[0] - p, O[1]], Cc = [O[0] + p, O[1]], B = [O[0] - q * u2[0], O[1] - q * u2[1]], D = [O[0] + q * u2[0], O[1] + q * u2[1]];
    return { A, B, C: Cc, D };
  };
  const S = [shape(120, 75, 55), shape(120, 120, 55), shape(120, 120, 90), shape(120, 75, 90)];
  const caps = ['平行四边形：对角线互相平分', '矩形：再加上对角线相等', '正方形：对角线相等且垂直', '菱形：再加上对角线垂直'];
  const dur = 12, kt = [0, 2, 3, 5, 6, 8, 9, 11, 12].map(t => f(t / dur)).join(';');
  const seq = [0, 0, 1, 1, 2, 2, 3, 3, 0];
  const pts = s => [s.A, s.B, s.C, s.D].map(p => p.map(f).join(',')).join(' ');
  const out = [];
  // 静态属性（PDF 只显示这一帧）用性质最全的正方形；网页上动画仍从平行四边形开始
  const P0 = S[2];
  out.push(`<polygon points="${pts(P0)}" fill="${C.blueFill}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"><animate attributeName="points" values="${seq.map(i => pts(S[i])).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></polygon>`);
  out.push(seg(P0.A, P0.C, { color: C.emph, w: 2.5 }));
  const an = (attr, g) => `<animate attributeName="${attr}" values="${seq.map(i => f(g(S[i]))).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  out.push(`<line x1="${f(P0.B[0])}" y1="${f(P0.B[1])}" x2="${f(P0.D[0])}" y2="${f(P0.D[1])}" stroke="${C.blue}" stroke-width="2.5">${an('x1', s => s.B[0])}${an('y1', s => s.B[1])}${an('x2', s => s.D[0])}${an('y2', s => s.D[1])}</line>`);
  out.push(dot(...O));
  // 各阶段的说明文字，轮流显示
  const win = [[0, 2.5], [2.5, 5.5], [5.5, 8.5], [8.5, 11.5]];
  caps.forEach((c, i) => {
    const [a, b] = win[i].map(t => f(t / dur));
    const anim = i === 0
      ? `<animate attributeName="opacity" values="1;0;1" keyTimes="0;${a === 0 ? b : a};${f(11.5 / dur)}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/>`
      : `<animate attributeName="opacity" values="0;1;0" keyTimes="0;${a};${b}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/>`;
    out.push(`<text x="200" y="288" fill="${C.ink}" stroke="none" text-anchor="middle" opacity="${i === 2 ? 1 : 0}">${c}${anim}</text>`);
  });
  files['quadrilaterals-diagonals.svg'] = svg(400, 300, out.join('\n'));
}

// ---------- 例 3：矩形中 ∠AOB = 60°。题干图只画条件；解法图涂出等边三角形 AOB ----------
for (const solve of [false, true]) {
  const u = 30, A = [60, 40], B = [60, 40 + 4 * u], Cc = [60 + 4 * Math.sqrt(3) * u, 40 + 4 * u], D = [60 + 4 * Math.sqrt(3) * u, 40], O = mid(A, Cc);
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc), seg(B, D));
  if (solve) out.push(poly([A, B, O], { fill: C.emphFill, color: C.emph, w: 2.5 }), tick(O, A, 1), tick(O, B, 1), tick(A, B, 1));
  out.push(rightAngle(B, Cc, A));
  out.push(angleMark(O, A, B, { r: 20 }), text(O[0] - 26, O[1] + 5, '60°', { anchor: 'end', color: C.emph, size: 12 }));
  out.push(text(A[0] - 8, (A[1] + B[1]) / 2 + 5, '4', { anchor: 'end' }));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-10, -4], [-10, 16], [10, 16], [10, -4], [0, 22]]));
  files[solve ? 'quadrilaterals-rectangle-solution.svg' : 'quadrilaterals-rectangle-example.svg'] = svg(340, 190, out.join('\n'));
}

// ---------- 梯形、等腰梯形、直角梯形 ----------
{
  const out = [];
  const shapes = [
    { dx: 10, A: [50, 40], D: [120, 40], B: [20, 130], C: [150, 130], name: '梯形' },
    { dx: 195, A: [55, 40], D: [115, 40], B: [20, 130], C: [150, 130], name: '等腰梯形', legs: true },
    { dx: 380, A: [20, 40], D: [100, 40], B: [20, 130], C: [150, 130], name: '直角梯形', right: true },
  ];
  for (const sh of shapes) {
    const t = p => [p[0] + sh.dx, p[1]];
    const [A, D, B, Cc] = [t(sh.A), t(sh.D), t(sh.B), t(sh.C)];
    out.push(poly([A, D, Cc, B]));
    out.push(par(A, D, 1), par(B, Cc, 1));
    if (sh.legs) out.push(tick(A, B, 1), tick(D, Cc, 1));
    if (sh.right) out.push(rightAngle(B, A, Cc), rightAngle(A, B, D));
    out.push(label(A, 'A', -6, -8), label(D, 'D', 6, -8), label(B, 'B', -8, 16), label(Cc, 'C', 8, 16));
    out.push(text((B[0] + Cc[0]) / 2, 170, sh.name, { anchor: 'middle', color: C.soft, size: 13 }));
  }
  files['quadrilaterals-trapezoid.svg'] = svg(550, 180, out.join('\n'));
}

// ---------- 平行线间的距离处处相等 ----------
{
  const y1 = 50, y2 = 150, P = [110, y1], Q = [290, y1], M = [110, y2], N = [290, y2];
  const out = [];
  out.push(line(20, y1, 400, y1), line(20, y2, 400, y2));
  out.push(text(392, y1 - 8, 'a', { italic: true, anchor: 'end' }), text(392, y2 - 8, 'b', { italic: true, anchor: 'end' }));
  out.push(seg(P, M, { color: C.emph, w: 2.5 }), seg(Q, N, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(M, [400, y2], P), rightAngle(N, [400, y2], Q));
  out.push(tick(P, M, 1), tick(Q, N, 1));
  out.push(dot(...P), dot(...Q), dot(...M), dot(...N));
  out.push(names([[P, 'P'], [Q, 'Q'], [M, 'M'], [N, 'N']], [[0, -10], [0, -10], [0, 22], [0, 22]]));
  files['quadrilaterals-parallel-distance.svg'] = svg(420, 185, out.join('\n'));
}

// ---------- 例 4：菱形的对角线 AC = 6，BD = 8，求 AB 边上的高 ----------
{
  const u = 26, O = [180, 125];
  const P = (x, y) => [O[0] + u * x, O[1] - u * y];
  const A = P(-3, 0), Cc = P(3, 0), B = P(0, 4), D = P(0, -4);
  const H = P(-3 + 3.6 * 0.6, 3.6 * 0.8); // C 到 AB 的垂足
  const out = [];
  out.push(poly([A, B, Cc, D]), seg(A, Cc, { color: C.blue, w: 1.5 }), seg(B, D, { color: C.blue, w: 1.5 }));
  out.push(poly([A, O, B], { fill: C.emphFill, color: 'none', w: 0 }), seg(A, B, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(O, Cc, B));
  out.push(seg(Cc, H, { color: C.soft, w: 1.5, dash: '6 4' }), rightAngle(H, B, Cc, { size: 8 }));
  out.push(text(...mid(A, O).map((v, i) => v + (i ? 18 : 0)), '3', { anchor: 'middle', color: C.blue }), text(O[0] + 8, O[1] - 14, '4', { color: C.blue }));
  out.push(text(mid(A, B)[0] - 12, mid(A, B)[1] - 2, '5', { anchor: 'end', color: C.emph }));
  out.push(text(mid(H, Cc)[0] + 10, mid(H, Cc)[1] - 10, 'h', { italic: true, color: C.soft }));
  out.push(names([[A, 'A'], [B, 'B'], [Cc, 'C'], [D, 'D'], [O, 'O']], [[-12, 5], [0, -8], [12, 5], [0, 20], [8, 18]]));
  files['quadrilaterals-rhombus-example.svg'] = svg(360, 250, out.join('\n'));
}

export default files;
