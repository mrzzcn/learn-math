// 第七部分总览“三种函数对照”的图。
import { C, svg, text, axes, plot, line } from './lib.mjs';

const files = {};

// ---------- 三种函数的图象并排 ----------
{
  const out = [];
  const u = 16, w = 170;
  const panels = [
    { name: '一次函数：直线', form: 'y = kx + b', col: C.blue, draw: (X, Y) => line(X(-4), Y(-3), X(3.5), Y(4.5), { color: C.blue, w: 2.5 }) },
    { name: '反比例函数：双曲线', form: 'y = k/x', col: C.emph, draw: (X, Y) => plot(x => 3 / x, -4.5, -0.5, X, Y, { color: C.emph, w: 2.5, ymin: -4.8, ymax: 4.8 }) + plot(x => 3 / x, 0.5, 4.5, X, Y, { color: C.emph, w: 2.5, ymin: -4.8, ymax: 4.8 }) },
    { name: '二次函数：抛物线', form: 'y = ax² + bx + c', col: C.ink, draw: (X, Y) => plot(x => 0.5 * (x - 1) ** 2 - 3, -2.4, 4.4, X, Y, { color: C.ink, w: 2.5 }) },
  ];
  panels.forEach((p, i) => {
    const ox = 20 + i * w + w / 2 - 5, oy = 100;
    const { X, Y, body } = axes({ ox, oy, u, xmin: -4.8, xmax: 4.8, ymin: -5, ymax: 5, ticks: false, grid: false });
    out.push(body.replace(/<text[^>]*>O<\/text>/, ''), p.draw(X, Y));
    out.push(text(ox, oy + 5 * u + 26, p.form, { anchor: 'middle', color: p.col, size: 13 }));
    out.push(text(ox, oy + 5 * u + 46, p.name, { anchor: 'middle', color: C.ink, size: 13 }));
  });
  files['7-function-index.svg'] = svg(530, 240, out.join('\n'));
}

export default files;
