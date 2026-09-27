// 第五部分总览页的图：各页之间的关系。
import { C, svg, text, line } from './lib.mjs';

const files = {};
{
  const out = [];
  const box = (x, y, w, h, title, sub, o = {}) => {
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"/>`);
    out.push(text(x + w / 2, y + 24, title, { anchor: 'middle', size: o.size || 14, color: o.color || C.ink }));
    out.push(text(x + w / 2, y + 43, sub, { anchor: 'middle', size: 11, color: C.soft }));
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  const arrow = (x1, y1, x2, y2, o = {}) => {
    const l = Math.hypot(x2 - x1, y2 - y1), u = [(x2 - x1) / l, (y2 - y1) / l], n = [-u[1], u[0]];
    const b = [x2 - 8 * u[0], y2 - 8 * u[1]];
    out.push(line(x1, y1, b[0], b[1], { color: o.color || C.soft, w: 1.5, dash: o.dash }));
    out.push(`<polygon points="${x2},${y2} ${b[0] + 4 * n[0]},${b[1] + 4 * n[1]} ${b[0] - 4 * n[0]},${b[1] - 4 * n[1]}" fill="${o.color || C.soft}" stroke="none"/>`);
  };
  const h = 54;
  // 第一行：直线形的部件
  const a = box(20, 20, 150, h, '几何图形初步', '点、线、角');
  const b = box(205, 20, 150, h, '相交线与平行线', '由角判定平行');
  const c = box(390, 20, 150, h, '三角形', '三边关系、内角和');
  // 第二行：枢纽
  const d = box(205, 118, 150, h, '全等三角形', '证明线段、角相等', { color: C.emph, fill: C.emphFill, w: 2 });
  // 第三行：应用
  const w3 = 128, xs = [10, 145, 280, 415];
  const e = box(xs[0], 216, w3, h, '轴对称与等腰三角形', '垂直平分线', { size: 13 });
  const g = box(xs[1], 216, w3, h, '勾股定理', '直角三角形的三边', { size: 13 });
  const q = box(xs[2], 216, w3, h, '四边形', '平行四边形家族', { size: 13 });
  const k = box(xs[3], 216, w3, h, '尺规作图', '作法的依据', { color: C.blue, size: 13 });
  arrow(a.x + a.w, a.cy, b.x, b.cy);
  arrow(b.x + b.w, b.cy, c.x, c.cy);
  arrow(c.cx, c.y + c.h, d.x + d.w, d.cy);
  for (const t of [e, g, q, k]) arrow(d.cx + (t.cx - d.cx) * 0.25, d.y + d.h, t.cx, t.y);
  files['5-geometry-index-map.svg'] = svg(555, 290, out.join('\n'));
}

export default files;
