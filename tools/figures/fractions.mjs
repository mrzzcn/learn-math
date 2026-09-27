// 第三部分“分式”的图。
import { C, f, svg, text, line, dot, poly, axes, plot } from './lib.mjs';

const files = {};
const rect = (x, y, w, h, o = {}) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { w: 1.5, ...o });

// ---------- 分式的基本性质：2/3 = 4/6 ----------
{
  const x0 = 40, W = 270, h = 32, y1 = 30, y2 = 90, out = [];
  for (let i = 0; i < 3; i++) out.push(rect(x0 + (i * W) / 3, y1, W / 3, h, { fill: i < 2 ? C.emphFill : 'none', color: C.ink }));
  for (let i = 0; i < 6; i++) out.push(rect(x0 + (i * W) / 6, y2, W / 6, h, { fill: i < 4 ? C.blueFill : 'none', color: C.ink }));
  out.push(line(x0 + (2 * W) / 3, y1 - 10, x0 + (2 * W) / 3, y2 + h + 10, { color: C.soft, w: 1, dash: '4 3' }));
  out.push(text(x0 + W + 16, y1 + h / 2 + 5, '2/3', { color: C.emph, size: 15 }));
  out.push(text(x0 + W + 16, y2 + h / 2 + 5, '4/6', { color: C.blue, size: 15 }));
  files['fractions-equivalent.svg'] = svg(360, 140, out.join('\n'));
}

// ---------- 面积为 12 的长方形：另一边是 12/x（动画） ----------
{
  const { X, Y, body } = axes({ ox: 40, oy: 270, u: 32, xmin: 0, xmax: 7.5, ymin: 0, ymax: 7.5 });
  const out = [body];
  out.push(plot(x => 12 / x, 1.6, 7.4, X, Y, { color: C.soft, w: 1.5, dash: '5 4' }));
  for (const w of [2, 4, 6]) {
    out.push(rect(X(0), Y(12 / w), w * 32, (12 / w) * 32, { color: C.blue, w: 1, dash: '4 3' }));
    out.push(dot(X(w), Y(12 / w), C.blue, 3.5));
  }
  // 动的长方形：宽 x 在 2～6 之间来回变，高始终是 12/x
  const ws = [];
  for (let k = 0; k <= 20; k++) ws.push(3 + 3 * Math.sin((k / 20) * Math.PI * 2) * (k <= 10 ? 1 : 1 / 3));
  const vals = attr => ws.map(w => f(attr(w))).join(';');
  const anim = (a, fn) => `<animate attributeName="${a}" values="${vals(fn)}" dur="10s" repeatCount="indefinite"/>`;
  out.push(`<rect x="${X(0)}" y="${f(Y(4))}" width="${3 * 32}" height="${4 * 32}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2">${anim('y', w => Y(12 / w))}${anim('width', w => w * 32)}${anim('height', w => (12 / w) * 32)}</rect>`);
  out.push(`<circle cx="${X(3)}" cy="${f(Y(4))}" r="5" fill="${C.emph}" stroke="none">${anim('cx', w => X(w))}${anim('cy', w => Y(12 / w))}</circle>`);
  out.push(text(X(2.3), Y(7) + 4, 'y = 12/x', { color: C.soft, size: 13 }));
  // 标注跟着长方形走：面积 12 在中间，x 在底边内侧，12/x 在右边外侧
  const lab = (t, a) => t.replace('</text>', `${a.map(([k, fn]) => anim(k, fn)).join('')}</text>`);
  out.push(lab(text(X(1.5), Y(1.5) + 5, '12', { anchor: 'middle', color: C.emph, size: 15 }), [['x', w => X(w / 2)], ['y', w => Y(6 / w - 0.5) + 5]]));
  out.push(lab(text(X(1.5), Y(0) - 8, 'x', { anchor: 'middle', italic: true, color: C.emph, size: 15 }), [['x', w => X(w / 2)]]));
  out.push(lab(text(X(3) + 6, Y(1.5) + 5, '12/<tspan font-style="italic">x</tspan>', { color: C.emph, size: 15 }), [['x', w => X(w) + 6], ['y', w => Y(6 / w - 0.5) + 5]]));
  files['fractions-rectangle.svg'] = svg(320, 310, out.join('\n'));
}

export default files;
