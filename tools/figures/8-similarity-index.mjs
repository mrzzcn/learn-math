// 第八部分总览“从全等到相似”的图。
import { C, f, svg, text, line } from './lib.mjs';

const files = {};

const arrow = (a, b, o = {}) => {
  const col = o.color || C.soft, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-u[1], u[0]];
  const base = [b[0] - 9 * u[0], b[1] - 9 * u[1]];
  return line(a[0], a[1], base[0], base[1], { color: col, w: o.w || 1.5, dash: o.dash }) +
    `<polygon points="${f(b[0])},${f(b[1])} ${f(base[0] + 4 * n[0])},${f(base[1] + 4 * n[1])} ${f(base[0] - 4 * n[0])},${f(base[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`;
};
const box = (cx, cy, s, o = {}) => {
  const w = o.w || s.length * 14 + 24, h = 34, col = o.color || C.ink;
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${h}" rx="6" fill="${o.fill || 'none'}" stroke="${col}" stroke-width="${o.sw || 1.5}"/>` +
    text(cx, cy + 5, s, { anchor: 'middle', color: col });
};

// ---------- 本部分的结构 ----------
{
  const out = [];
  const y1 = 40, y2 = 145, y3 = 250;
  out.push(box(120, y1, '平行线分线段成比例', { w: 170 }), box(380, y1, '全等三角形', { w: 120 }));
  out.push(box(250, y2, '相似三角形', { color: C.emph, fill: C.emphFill, w: 130, sw: 2 }));
  out.push(box(90, y3, '锐角三角函数', { w: 130 }), box(250, y3, '位似', { w: 90 }), box(410, y3, '投影', { w: 90 }));
  out.push(arrow([140, y1 + 17], [220, y2 - 17], { color: C.blue }), text(150, 98, '推出判定', { anchor: 'end', color: C.blue, size: 12 }));
  out.push(arrow([365, y1 + 17], [280, y2 - 17], { color: C.blue }), text(342, 98, '边相等换成边成比例', { color: C.blue, size: 12 }));
  out.push(arrow([220, y2 + 17], [110, y3 - 17], { color: C.emph }), text(132, 196, '直角三角形：', { anchor: 'end', color: C.emph, size: 12 }), text(132, 212, '角定了，边的比就定了', { anchor: 'end', color: C.emph, size: 12 }));
  out.push(arrow([250, y2 + 17], [250, y3 - 17], { color: C.emph }), text(256, 204, '位置特殊', { color: C.emph, size: 12 }));
  out.push(arrow([280, y2 + 17], [390, y3 - 17], { color: C.emph }), text(352, 196, '光线平行或共点：', { color: C.emph, size: 12 }), text(352, 212, '影长成比例', { color: C.emph, size: 12 }));
  files['8-similarity-index.svg'] = svg(480, 275, out.join('\n'));
}

export default files;
