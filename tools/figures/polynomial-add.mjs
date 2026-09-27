// 第三部分“整式的加减”的图。
import { C, svg, text, line, poly } from './lib.mjs';

const files = {};
// ---------- 合并同类项：3a + 2a = 5a ----------
{
  const x0 = 60, y0 = 50, w = 44, h = 80, out = [];
  for (let i = 0; i < 5; i++) {
    const x = x0 + i * w, blue = i < 3;
    out.push(poly([[x, y0], [x + w, y0], [x + w, y0 + h], [x, y0 + h]], { fill: blue ? C.blueFill : C.emphFill, color: blue ? C.blue : C.emph, w: 1.5 }));
    out.push(text(x + w / 2, y0 + h + 18, '1', { anchor: 'middle', color: C.soft, size: 12 }));
  }
  out.push(text(x0 - 12, y0 + h / 2 + 5, 'a', { anchor: 'end', italic: true }));
  // 上方：3a、2a
  const brace = (xa, xb, y, col) => line(xa + 2, y, xb - 2, y, { color: col, w: 1.5 }) + line(xa + 2, y - 5, xa + 2, y + 5, { color: col, w: 1.5 }) + line(xb - 2, y - 5, xb - 2, y + 5, { color: col, w: 1.5 });
  out.push(brace(x0, x0 + 3 * w, y0 - 14, C.blue), text(x0 + 1.5 * w, y0 - 22, '3a', { anchor: 'middle', color: C.blue, italic: true }));
  out.push(brace(x0 + 3 * w, x0 + 5 * w, y0 - 14, C.emph), text(x0 + 4 * w, y0 - 22, '2a', { anchor: 'middle', color: C.emph, italic: true }));
  // 下方：5a
  out.push(brace(x0, x0 + 5 * w, y0 + h + 34, C.ink), text(x0 + 2.5 * w, y0 + h + 56, '5a', { anchor: 'middle', italic: true }));
  files['polynomial-add-like-terms.svg'] = svg(340, 200, out.join('\n'));
}

// ---------- 台阶形的周长：2a + 2b ----------
// 带下标的字母，如 x₁
const sub = (x, y, name, i, col, anchor = 'middle') =>
  `<text x="${x}" y="${y}" fill="${col}" stroke="none" text-anchor="${anchor}" font-size="14"><tspan font-style="italic">${name}</tspan><tspan dy="4" font-size="10">${i}</tspan></text>`;
const stairs = { x0: 50, y0: 30, ws: [70, 90, 80], hs: [40, 60, 50] };
stairs.W = stairs.ws.reduce((s, v) => s + v);
stairs.H = stairs.hs.reduce((s, v) => s + v);
// 三段横的、三段竖的台阶面：[x1, y1, x2, y2]
{
  const { x0, y0, ws, hs } = stairs;
  let x = x0, y = y0;
  stairs.hor = []; stairs.ver = [];
  for (let i = 0; i < 3; i++) {
    stairs.hor.push([x, y, x + ws[i], y]); x += ws[i];
    stairs.ver.push([x, y, x, y + hs[i]]); y += hs[i];
  }
}
// 题干的图：只画台阶形和底边 a、左边 b
{
  const { x0, y0, W, H, hor, ver } = stairs, out = [];
  out.push(line(x0, y0 + H, x0 + W, y0 + H), line(x0, y0, x0, y0 + H));
  for (const s of [...hor, ...ver]) out.push(line(...s));
  out.push(text(x0 + W / 2, y0 + H + 22, 'a', { anchor: 'middle', italic: true }));
  out.push(text(x0 - 12, y0 + H / 2 + 5, 'b', { anchor: 'end', italic: true }));
  files['polynomial-add-stairs.svg'] = svg(340, 220, out.join('\n'));
}
// 解法的图：标出各段台阶面，横的平移到顶边，竖的平移到右边（动画；原位置保留实线，移动的是虚线副本，PDF 里显示平移后的位置）
{
  const { x0, y0, W, H, hor, ver } = stairs, out = [];
  out.push(line(x0, y0 + H, x0 + W, y0 + H, { color: C.blue, w: 2.5 }), line(x0, y0, x0, y0 + H, { color: C.emph, w: 2.5 }));
  for (const s of hor) out.push(line(...s, { color: C.blue, w: 2.5 }));
  for (const s of ver) out.push(line(...s, { color: C.emph, w: 2.5 }));
  const dur = 8, kt = '0;0.15;0.45;0.75;1';
  const moving = (s, dx, dy, col) => {
    const end = `${dx} ${dy}`;
    return `<g transform="translate(${end})">${line(...s, { color: col, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${end};${end};0 0" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g>`;
  };
  hor.forEach((s, i) => { if (s[1] !== y0) out.push(moving(s, 0, y0 - s[1], C.blue)); });
  ver.forEach((s, i) => { if (s[0] !== x0 + W) out.push(moving(s, x0 + W - s[0], 0, C.emph)); });
  hor.forEach((s, i) => out.push(sub((s[0] + s[2]) / 2, s[1] - 8, 'x', i + 1, C.blue)));
  ver.forEach((s, i) => out.push(sub(s[0] + (i === 2 ? 8 : -8), (s[1] + s[3]) / 2 + 5, 'y', i + 1, C.emph, i === 2 ? 'start' : 'end')));
  out.push(text(x0 + W / 2, y0 + H + 22, 'a', { anchor: 'middle', italic: true, color: C.blue }));
  out.push(text(x0 - 12, y0 + H / 2 + 5, 'b', { anchor: 'end', italic: true, color: C.emph }));
  files['polynomial-add-stairs-move.svg'] = svg(340, 220, out.join('\n'));
}

export default files;
