// 第八部分“投影与视图”的图。
import { C, f, rad, svg, text, line, dot, poly, circle, arc, angleMark, rightAngle, label } from './lib.mjs';

const files = {};
const arrow = (a, b, o = {}) => {
  const col = o.color || C.soft, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-u[1], u[0]];
  const base = [b[0] - 9 * u[0], b[1] - 9 * u[1]];
  return line(a[0], a[1], base[0], base[1], { color: col, w: o.w || 1.5, dash: o.dash }) +
    `<polygon points="${f(b[0])},${f(b[1])} ${f(base[0] + 4 * n[0])},${f(base[1] + 4 * n[1])} ${f(base[0] - 4 * n[0])},${f(base[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`;
};

// ---------- 平行投影和中心投影 ----------
{
  const g = 180, h = 50, out = [];
  // 平行投影：光线方向相同
  const v = [0.6, 1];
  out.push(line(20, g, 210, g, { color: C.soft, w: 1.5 }));
  for (const x of [60, 140]) {
    const top = [x, g - h], end = [x + h * v[0] / v[1], g];
    out.push(line(top[0] - 90 * v[0], top[1] - 90 * v[1], end[0], end[1], { color: C.blue, w: 1, dash: '5 4' }));
    out.push(line(x, g, x, g - h, { w: 3 }), line(x, g, end[0], g, { color: C.emph, w: 3 }));
  }
  out.push(text(115, g + 24, '平行投影：光线平行', { anchor: 'middle', size: 13 }));
  // 中心投影：光线从一点出发
  const L = [290, 40], H = g - L[1];
  out.push(line(250, g, 460, g, { color: C.soft, w: 1.5 }), line(L[0], L[1], L[0], g, { color: C.soft, w: 1.5 }));
  for (const x of [330, 390]) {
    const d = x - L[0], s = (h * d) / (H - h), end = [x + s, g];
    out.push(line(L[0], L[1], end[0], end[1], { color: C.blue, w: 1, dash: '5 4' }));
    out.push(line(x, g, x, g - h, { w: 3 }), line(x, g, end[0], g, { color: C.emph, w: 3 }));
  }
  out.push(`<circle cx="${L[0]}" cy="${L[1]}" r="7" fill="#f2c94c" stroke="${C.ink}" stroke-width="1"/>`);
  out.push(text(355, g + 24, '中心投影：光线从一点出发', { anchor: 'middle', size: 13 }));
  files['projection-light.svg'] = svg(470, 215, out.join('\n'));
}

// ---------- 例 1：路灯下的影子 ----------
{
  const s = 30, g = 200, x0 = 40;
  const X = d => x0 + d * s;
  const A = [X(0), g - 4.5 * s], B = [X(0), g];
  const pos = d => ({ top: [X(d), g - 1.5 * s], foot: [X(d), g], end: [X(d * 1.5), g] });
  const p1 = pos(4), p2 = pos(7);
  const out = [line(20, g, 380, g, { color: C.soft, w: 1.5 })];
  out.push(line(A[0], A[1], B[0], B[1], { w: 3 }), `<circle cx="${A[0]}" cy="${A[1]}" r="6" fill="#f2c94c" stroke="${C.ink}" stroke-width="1"/>`);
  // 原位置：△CDE 用实线固定不动，光线 AE 也是实线
  out.push(line(A[0], A[1], ...p1.end, { color: C.blue, w: 1.5 }));
  out.push(line(...p1.top, ...p1.foot, { w: 3 }), line(...p1.foot, ...p1.end, { color: C.emph, w: 3 }));
  // 移动的虚线三角形和虚线光线：从 D 走到 D′ 再走回来。
  // 属性里的初始位置设在 D′ 处，PDF 不播放动画时就显示第二个位置
  const kt = 'keyTimes="0;0.15;0.5;0.8;1" dur="8s" repeatCount="indefinite"';
  const mv = (attr, a, b) => `<animate attributeName="${attr}" values="${f(a)};${f(a)};${f(b)};${f(b)};${f(a)}" ${kt}/>`;
  const dashed = (x1, y1, x2, y2, color, w, anims) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-dasharray="6 4">${anims}</line>`;
  out.push(dashed(A[0], A[1], p2.end[0], g, C.blue, 1.5, mv('x2', p1.end[0], p2.end[0])));
  out.push(dashed(p2.top[0], p2.top[1], p2.foot[0], g, C.ink, 2.5, mv('x1', p1.top[0], p2.top[0]) + mv('x2', p1.foot[0], p2.foot[0])));
  out.push(dashed(p2.foot[0], g, p2.end[0], g, C.emph, 2.5, mv('x1', p1.foot[0], p2.foot[0]) + mv('x2', p1.end[0], p2.end[0])));
  out.push(label(A, 'A', -12, 4), label(B, 'B', 0, 18), label(p1.top, 'C', 10, -6), label(p1.foot, 'D', 0, 18), label(p1.end, 'E', 0, 18));
  out.push(label(p2.top, 'C′', 12, -6, { color: C.soft }), label(p2.foot, 'D′', 0, 18, { color: C.soft }), label(p2.end, 'E′', 0, 18, { color: C.soft }));
  const lab = (x, y, s2, o = {}) => text(x, y, s2, { anchor: 'middle', color: C.soft, size: 12, ...o });
  out.push(lab((B[0] + p1.foot[0]) / 2, g + 18, '4 m'), lab((p1.foot[0] + p1.end[0]) / 2, g + 18, '2 m', { color: C.emph }), lab(p1.top[0] - 8, (p1.top[1] + g) / 2 + 10, '1.5 m', { anchor: 'end' }));
  out.push(lab((p1.foot[0] + p2.foot[0]) / 2, g + 50, '3 m'), line(p1.foot[0], g + 38, p2.foot[0], g + 38, { color: C.soft, w: 1 }), line(p1.foot[0], g + 33, p1.foot[0], g + 43, { color: C.soft, w: 1 }), line(p2.foot[0], g + 33, p2.foot[0], g + 43, { color: C.soft, w: 1 }));
  files['projection-lamp.svg'] = svg(390, 260, out.join('\n'));
}

// ---------- 正投影：线段的影子有多长 ----------
{
  const g = 170, out = [line(20, g, 400, g, { color: C.soft, w: 1.5 })];
  const proj = (A, B, names) => {
    out.push(line(A[0], A[1], A[0], g, { color: C.blue, w: 1, dash: '4 3' }), line(B[0], B[1], B[0], g, { color: C.blue, w: 1, dash: '4 3' }));
    out.push(line(A[0], A[1], B[0], B[1], { w: 2.5 }), line(A[0], g, B[0], g, { color: C.emph, w: 3.5 }));
    out.push(dot(...A), dot(...B), dot(A[0], g, C.emph), dot(B[0], g, C.emph));
  };
  const A1 = [40, 80], B1 = [140, 80];
  proj(A1, B1);
  out.push(label(A1, 'A', 0, -8), label(B1, 'B', 0, -8), label([A1[0], g], 'A′', 0, 18, { color: C.emph }), label([B1[0], g], 'B′', 0, 18, { color: C.emph }));
  const A2 = [190, 110], B2 = [190 + 100 * Math.cos(rad(40)), 110 - 100 * Math.sin(rad(40))];
  out.push(line(A2[0], A2[1], B2[0] + 10, A2[1], { color: C.soft, w: 1, dash: '4 3' }));
  proj(A2, B2);
  out.push(arc(A2, 24, 0, 40, { color: C.blue, w: 1.5 }), text(A2[0] + 30, A2[1] - 6, 'α', { italic: true, color: C.blue }));
  out.push(label(A2, 'A', -10, 0), label(B2, 'B', 0, -8), label([A2[0], g], 'A′', 0, 18, { color: C.emph }), label([B2[0], g], 'B′', 0, 18, { color: C.emph }));
  const A3 = [350, 60], B3 = [350, 140];
  out.push(line(A3[0], B3[1], A3[0], g, { color: C.blue, w: 1, dash: '4 3' }), line(A3[0], A3[1], B3[0], B3[1], { w: 2.5 }), dot(...A3), dot(...B3), dot(A3[0], g, C.emph, 5));
  out.push(label(A3, 'A', 12, 4), label(B3, 'B', 12, 4), label([A3[0], g], 'A′(B′)', 0, 18, { color: C.emph }));
  files['projection-orthographic.svg'] = svg(410, 195, out.join('\n'));
}

// ---------- 一个几何体（斜着画） ----------
// 下层：长 3、宽 2、高 1 的长方体；上层：靠后左的长 1、宽 1、高 2 的长方体。x 向右，y 向后，z 向上。
{
  const s = 45, ox = 70, oy = 205, c = 0.5 * Math.cos(rad(45));
  const P = (x, y, z) => [ox + s * x + s * c * y, oy - s * z - s * c * y];
  const face = (pts, fill) => poly(pts.map(p => P(...p)), { fill, color: C.ink, w: 1.8 });
  const box = (x0, x1, y0, y1, z0, z1) => [
    face([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], '#ffffff'),
    face([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], '#eef1f4'),
    face([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], '#dde2e8'),
  ].join('');
  const out = [box(0, 3, 0, 2, 0, 1), box(0, 1, 1, 2, 1, 3)];
  // 看的方向
  const fr = P(1.5, 0, 0.5), lf = P(0, 1, 0.5), tp = P(2, 1, 1);
  out.push(arrow([fr[0] - 30, fr[1] + 30], [fr[0] - 2, fr[1] + 2], { color: C.emph, w: 2 }), text(fr[0] - 34, fr[1] + 44, '主视', { anchor: 'middle', color: C.emph, size: 12 }));
  out.push(arrow([lf[0] - 50, lf[1]], [lf[0] - 4, lf[1]], { color: C.blue, w: 2 }), text(lf[0] - 54, lf[1] + 4, '左视', { anchor: 'end', color: C.blue, size: 12 }));
  out.push(arrow([tp[0], tp[1] - 60], [tp[0], tp[1] - 4], { color: C.soft, w: 2 }), text(tp[0] + 6, tp[1] - 50, '俯视', { color: C.soft, size: 12 }));
  files['projection-solid.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 看不见的轮廓线画虚线：中间打了竖直圆孔的木块 ----------
{
  const s = 40, ox = 30, oy = 170, c = 0.5 * Math.cos(rad(45));
  // 木块：长 3、宽 2、高 1.5，正中间一个直径 1 的竖直圆孔。x 向右，y 向后，z 向上
  const P = (x, y, z) => [ox + s * x + s * c * y, oy - s * z - s * c * y];
  const face = (pts, fill) => poly(pts.map(p => P(...p)), { fill, color: C.ink, w: 1.8 });
  const H = 1.5, out = [];
  out.push(face([[0, 0, 0], [3, 0, 0], [3, 0, H], [0, 0, H]], '#ffffff'), face([[0, 0, H], [3, 0, H], [3, 2, H], [0, 2, H]], '#eef1f4'), face([[3, 0, 0], [3, 2, 0], [3, 2, H], [3, 0, H]], '#dde2e8'));
  // 顶面上的圆孔（斜二测里画成椭圆）
  const hc = P(1.5, 1, H);
  out.push(`<ellipse cx="${f(hc[0])}" cy="${f(hc[1])}" rx="${f(s * 0.5)}" ry="${f(s * c * 0.5)}" fill="#ffffff" stroke="${C.ink}" stroke-width="1.5"/>`);
  out.push(text(P(1.5, 0, 0)[0], oy + 22, '木块', { anchor: 'middle', size: 13 }));
  // 主视图：长方形，孔的两条轮廓线看不见，画成竖直虚线
  const M = [200, 50], w = 3 * s * 0.8, h = H * s * 0.8, hole = 1 * s * 0.8;
  out.push(`<rect x="${M[0]}" y="${M[1]}" width="${f(w)}" height="${f(h)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`);
  for (const x of [M[0] + (w - hole) / 2, M[0] + (w + hole) / 2]) out.push(line(x, M[1], x, M[1] + h, { color: C.emph, w: 1.8, dash: '5 4' }));
  out.push(text(M[0] + w / 2, M[1] + h + 20, '主视图', { anchor: 'middle', size: 13 }));
  // 俯视图：长方形里一个圆，孔从上面看得见，画实线
  const T = [200, M[1] + h + 40], d = 2 * s * 0.8;
  out.push(`<rect x="${T[0]}" y="${T[1]}" width="${f(w)}" height="${f(d)}" fill="none" stroke="${C.ink}" stroke-width="2"/>`, circle(T[0] + w / 2, T[1] + d / 2, hole / 2, { w: 2 }));
  out.push(text(T[0] + w / 2, T[1] + d + 20, '俯视图', { anchor: 'middle', size: 13 }));
  files['projection-hole.svg'] = svg(320, T[1] + d + 30, out.join('\n'));
}

// ---------- 三视图的位置 ----------
{
  const s = 40, M = [40, 30], Lp = [200, 30], T = [40, 190];
  const pt = (o, x, y) => [o[0] + s * x, o[1] + s * y];
  const out = [];
  // 对齐的辅助线
  for (const x of [0, 3]) out.push(line(...pt(M, x, 3), ...pt(T, x, 0), { color: C.soft, w: 1, dash: '3 3' }));
  for (const y of [0, 3]) out.push(line(...pt(M, 3, y), ...pt(Lp, 0, y), { color: C.soft, w: 1, dash: '3 3' }));
  // 主视图：从前往后看，横向是长 x，竖向是高 z
  out.push(poly([[0, 3], [3, 3], [3, 2], [1, 2], [1, 0], [0, 0]].map(([x, y]) => pt(M, x, y))), line(...pt(M, 0, 2), ...pt(M, 1, 2)));
  // 左视图：从左往右看，前面在右边
  out.push(poly([[0, 3], [2, 3], [2, 2], [1, 2], [1, 0], [0, 0]].map(([x, y]) => pt(Lp, x, y))));
  // 俯视图：从上往下看，前面在下边
  out.push(poly([[0, 0], [3, 0], [3, 2], [0, 2]].map(([x, y]) => pt(T, x, y))), line(...pt(T, 1, 0), ...pt(T, 1, 1)), line(...pt(T, 0, 1), ...pt(T, 1, 1)));
  out.push(text(M[0] + 1.5 * s, 172, '主视图', { anchor: 'middle', size: 13 }), text(Lp[0] + s, 172, '左视图', { anchor: 'middle', size: 13 }), text(T[0] + 1.5 * s, T[1] + 2 * s + 22, '俯视图', { anchor: 'middle', size: 13 }));
  files['projection-views.svg'] = svg(320, 310, out.join('\n'));
}

// ---------- 例 2：小正方体堆成的几何体 ----------
const grid = (o, cells, u, nums) => {
  const out = [];
  cells.forEach(([c, r], i) => {
    out.push(`<rect x="${f(o[0] + c * u)}" y="${f(o[1] + r * u)}" width="${u}" height="${u}" fill="${nums ? '#ffffff' : C.blueFill}" stroke="${C.ink}" stroke-width="1.5"/>`);
    if (nums) out.push(text(o[0] + c * u + u / 2, o[1] + r * u + u / 2 + 6, nums[i], { anchor: 'middle', color: C.emph, size: 16 }));
  });
  return out.join('');
};
{
  const u = 28, out = [];
  const heights = [2, 3, 1], main = [];
  heights.forEach((h, c) => { for (let k = 0; k < h; k++) main.push([c, 2 - k]); });
  out.push(grid([40, 20], main, u));
  out.push(grid([200, 48], [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]], u));
  out.push(text(40 + 1.5 * u, 20 + 3 * u + 24, '主视图', { anchor: 'middle', size: 13 }), text(200 + 1.5 * u, 20 + 3 * u + 24, '俯视图', { anchor: 'middle', size: 13 }));
  files['projection-cubes.svg'] = svg(330, 140, out.join('\n'));
}
{
  const u = 36, out = [], cells = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]];
  out.push(grid([40, 20], cells, u, ['2', '3', '2', '3', '1']));
  out.push(grid([220, 20], cells, u, ['2', '3', '1', '1', '1']));
  out.push(text(40 + 1.5 * u, 20 + 2 * u + 24, '最多：11 个', { anchor: 'middle', size: 13 }), text(220 + 1.5 * u, 20 + 2 * u + 24, '最少：8 个（一种摆法）', { anchor: 'middle', size: 13 }));
  files['projection-cubes-answer.svg'] = svg(380, 125, out.join('\n'));
}

// ---------- 例 3：圆锥的三视图 ----------
{
  const s = 20, out = [];
  const tri = x0 => { const B1 = [x0, 110], B2 = [x0 + 6 * s, 110], Ap = [x0 + 3 * s, 110 - 4 * s]; return poly([B1, B2, Ap]); };
  out.push(tri(30), tri(190));
  out.push(line(90, 30, 90, 110, { color: C.soft, w: 1, dash: '4 3' }), text(96, 76, '4', { color: C.soft, size: 13 }), text(90, 128, '6', { anchor: 'middle', color: C.soft, size: 13 }));
  out.push(`<circle cx="90" cy="215" r="${3 * s}" fill="none" stroke="${C.ink}" stroke-width="2"/>`, dot(90, 215, C.ink, 3));
  out.push(text(90, 150, '主视图', { anchor: 'middle', size: 13 }), text(250, 150, '左视图', { anchor: 'middle', size: 13 }), text(90, 300, '俯视图', { anchor: 'middle', size: 13 }));
  files['projection-cone.svg'] = svg(320, 310, out.join('\n'));
}

// ---------- 制作模型：直三棱柱的展开图 ----------
{
  const s = 15, a = 4 * s, h = 6 * s, x0 = 40, y0 = 70, out = [];
  const rects = [0, 1, 2].map(i => [[x0 + i * a, y0], [x0 + (i + 1) * a, y0], [x0 + (i + 1) * a, y0 + h], [x0 + i * a, y0 + h]]);
  rects.forEach(r => out.push(poly(r)));
  const t = a * Math.sqrt(3) / 2, m = x0 + a;
  out.push(poly([[m, y0], [m + a, y0], [m + a / 2, y0 - t]], { fill: C.blueFill }), poly([[m, y0 + h], [m + a, y0 + h], [m + a / 2, y0 + h + t]], { fill: C.blueFill }));
  out.push(text(x0 + a / 2, y0 + h + 18, '4', { anchor: 'middle', color: C.soft, size: 12 }), text(x0 - 8, y0 + h / 2 + 4, '6', { anchor: 'end', color: C.soft, size: 12 }));
  files['projection-net.svg'] = svg(320, y0 + h + t + 20, out.join('\n'));
}

export default files;
