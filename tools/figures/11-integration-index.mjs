// 第十一部分“总览：一体两面”的图。
import { C, f, svg, text, line } from './lib.mjs';

const files = {};
const box = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${o.fill || '#fff'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"/>`;
const arrow = (x1, y1, x2, y2, color) => {
  const l = Math.hypot(x2 - x1, y2 - y1), u = [(x2 - x1) / l, (y2 - y1) / l], n = [-u[1], u[0]];
  const b = [x2 - 9 * u[0], y2 - 9 * u[1]];
  return line(x1, y1, b[0], b[1], { color, w: 2 }) + `<polygon points="${f(x2)},${f(y2)} ${f(b[0] + 4.5 * n[0])},${f(b[1] + 4.5 * n[1])} ${f(b[0] - 4.5 * n[0])},${f(b[1] - 4.5 * n[1])}" fill="${color}" stroke="none"/>`;
};

{
  const out = [];
  // 数、形两个大框
  out.push(box(20, 20, 140, 76, { fill: C.blueFill, color: C.blue }), box(320, 20, 140, 76, { fill: C.emphFill, color: C.emph }));
  out.push(text(90, 52, '数', { anchor: 'middle', size: 20, color: C.blue }), text(90, 78, '数、式、方程、函数', { anchor: 'middle', size: 12, color: C.blue }));
  out.push(text(390, 52, '形', { anchor: 'middle', size: 20, color: C.emph }), text(390, 78, '图形、位置、变换', { anchor: 'middle', size: 12, color: C.emph }));
  // 两个方向
  out.push(arrow(318, 42, 162, 42, C.emph), text(240, 34, '以形助数', { anchor: 'middle', size: 13, color: C.emph }));
  out.push(arrow(162, 76, 318, 76, C.blue), text(240, 94, '以数解形', { anchor: 'middle', size: 13, color: C.blue }));
  // 桥：数轴、坐标系
  out.push(text(240, 60, '数轴 · 坐标系', { anchor: 'middle', size: 11, color: C.soft }));
  // 动点与函数：两边都用
  out.push(box(160, 130, 160, 40), text(240, 155, '动点与函数', { anchor: 'middle', size: 14 }));
  out.push(line(90, 98, 170, 130, { color: C.soft, w: 1.2, dash: '4 3' }), line(390, 98, 310, 130, { color: C.soft, w: 1.2, dash: '4 3' }));
  // 三种通用的方法
  out.push(line(20, 200, 460, 200, { color: C.grid, w: 1 }));
  out.push(text(240, 194, '贯穿各部分的方法', { anchor: 'middle', size: 12, color: C.soft }));
  const methods = ['方程思想与建模', '分类讨论', '辅助线从哪里来'];
  methods.forEach((s, i) => { const x = 20 + i * 150; out.push(box(x, 212, 140, 40, { color: C.soft }), text(x + 70, 237, s, { anchor: 'middle', size: 13 })); });
  files['11-integration-index.svg'] = svg(480, 270, out.join('\n'));
}

export default files;
