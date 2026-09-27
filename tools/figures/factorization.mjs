// 第三部分“因式分解”的图。
import { C, f, svg, text, line, poly } from './lib.mjs';

const files = {};
const rect = (x, y, w, h, o = {}) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { w: 1.5, ...o });
const it = (x, y, s, o = {}) => text(x, y, s, { anchor: 'middle', italic: true, ...o });

// ---------- 面积块拼成长方形：x² + 3x + 2 = (x + 1)(x + 2)（动画） ----------
{
  const X = 100, u = 32, ox = 60, oy = 40, out = [];
  // 每块：拼好后的位置、散开时的位置、样式、标注
  const pieces = [
    { at: [ox, oy], from: [270, 24], w: X, h: X, fill: C.emphFill, col: C.emph, s: 'x²' },
    { at: [ox + X, oy], from: [390, 24], w: u, h: X, fill: C.blueFill, col: C.blue, s: 'x' },
    { at: [ox + X + u, oy], from: [432, 24], w: u, h: X, fill: C.blueFill, col: C.blue, s: 'x' },
    { at: [ox, oy + X], from: [270, 150], w: X, h: u, fill: C.blueFill, col: C.blue, s: 'x' },
    { at: [ox + X, oy + X], from: [390, 150], w: u, h: u, fill: 'rgba(87,96,106,0.12)', col: C.soft, s: '1' },
    { at: [ox + X + u, oy + X], from: [432, 150], w: u, h: u, fill: 'rgba(87,96,106,0.12)', col: C.soft, s: '1' },
  ];
  const kt = '0;0.2;0.5;0.8;1', dur = 8;
  for (const p of pieces) {
    // 散开时的位置：原来的面积块，用实线留着
    out.push(rect(p.from[0], p.from[1], p.w, p.h, { fill: p.fill, color: p.col, w: 1.5 }));
    out.push(it(p.from[0] + p.w / 2, p.from[1] + p.h / 2 + 5, p.s, { color: p.col, size: 13 }));
  }
  for (const p of pieces) {
    const dx = f(p.from[0] - p.at[0]), dy = f(p.from[1] - p.at[1]);
    // 移动的是虚线副本；PDF 里显示拼好的位置
    const body = rect(p.at[0], p.at[1], p.w, p.h, { fill: p.fill, color: p.col, w: 2, dash: '6 4' }) + it(p.at[0] + p.w / 2, p.at[1] + p.h / 2 + 5, p.s, { color: p.col });
    out.push(`<g>${body}<animateTransform attributeName="transform" type="translate" values="${dx} ${dy};${dx} ${dy};0 0;0 0;${dx} ${dy}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g>`);
  }
  // 长方形的两边
  const W = X + 2 * u, H = X + u;
  const dim = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { color: C.ink, w: 1 });
  out.push(dim(ox, oy + H + 14, ox + W, oy + H + 14), dim(ox, oy + H + 9, ox, oy + H + 19), dim(ox + W, oy + H + 9, ox + W, oy + H + 19));
  out.push(it(ox + W / 2, oy + H + 34, 'x + 2'));
  out.push(dim(ox - 14, oy, ox - 14, oy + H), dim(ox - 19, oy, ox - 9, oy), dim(ox - 19, oy + H, ox - 9, oy + H));
  out.push(it(ox - 20, oy + H / 2 + 5, 'x + 1', { anchor: 'end' }));
  files['factorization-tiles.svg'] = svg(480, 230, out.join('\n'));
}

// ---------- 十字相乘：2x² + 5x − 3 = (2x − 1)(x + 3) ----------
{
  const L = 70, R = 170, T = 66, B = 136, out = [];
  out.push(line(L + 22, T + 6, R - 22, B - 12, { color: C.blue, w: 2 }));
  out.push(line(L + 22, B - 12, R - 22, T + 6, { color: C.emph, w: 2 }));
  out.push(it(L, T + 5, '2x', { size: 17 }), it(L, B + 5, 'x', { size: 17 }), it(R, T + 5, '−1', { size: 17 }), it(R, B + 5, '3', { size: 17 }));
  out.push(text(230, T + 10, '2x · 3 = 6x', { italic: true, color: C.blue }));
  out.push(text(230, B, 'x · (−1) = −x', { italic: true, color: C.emph }));
  out.push(line(230, B + 14, 350, B + 14, { color: C.soft, w: 1 }));
  out.push(text(230, B + 36, '6x + (−x) = 5x', { italic: true }));
  out.push(text(L - 30, 24, '横着读：2x − 1 和 x + 3 是两个因式', { color: C.soft, size: 12 }));
  files['factorization-cross.svg'] = svg(380, 186, out.join('\n'));
}

export default files;
