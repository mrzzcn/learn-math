// 第四部分“二元一次方程组”的图。
import { C, f, svg, text, line, dot, axes } from './lib.mjs';

const files = {};

// ---------- 两个方程的解各成一条直线，公共解是交点 ----------
{
  const { X, Y, body } = axes({ ox: 40, oy: 280, u: 24, xmin: -0.8, xmax: 11.5, ymin: -0.8, ymax: 10.5 });
  const out = [body];
  // x + y = 10
  out.push(line(X(-0.5), Y(10.5), X(10.5), Y(-0.5), { color: C.blue, w: 2.5 }));
  // 2x + 4y = 32，即 y = 8 − x / 2
  out.push(line(X(-0.5), Y(8.25), X(11.2), Y(8 - 5.6), { color: C.emph, w: 2.5 }));
  // 整数解
  for (let x = 0; x <= 10; x++) if (x !== 4) out.push(dot(X(x), Y(10 - x), C.blue, 3));
  for (let x = 0; x <= 10; x += 2) if (x !== 4) out.push(dot(X(x), Y(8 - x / 2), C.emph, 3));
  out.push(line(X(4), Y(6), X(4), Y(0), { color: C.soft, w: 1, dash: '4 3' }), line(X(4), Y(6), X(0), Y(6), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(dot(X(4), Y(6), C.ink, 5.5));
  out.push(text(X(4) + 10, Y(6) - 8, '(4, 6)', { size: 13 }));
  out.push(text(X(1.2) + 8, Y(10.3), 'x + y = 10', { color: C.blue, size: 13 }));
  out.push(text(X(7), Y(5.3), '2x + 4y = 32', { color: C.emph, size: 13 }));
  files['linear-system-lines.svg'] = svg(360, 320, out.join('\n'));
}

// ---------- 解的三种情况 ----------
{
  const out = [];
  const panel = (ox, draw, caption) => {
    const { X, Y, body } = axes({ ox: ox + 40, oy: 130, u: 22, xmin: -1.3, xmax: 3.8, ymin: -1.3, ymax: 3.8, ticks: false, grid: false });
    // 第一幅里 y = x 穿过原点左下方，原点的 O 移到右下方，免得被直线压住
    out.push(ox === 0 ? body.replace(/<text[^>]*>O<\/text>/, text(ox + 46, 146, 'O', { italic: true, color: C.soft, size: 12 })) : body);
    draw(X, Y);
    out.push(text(ox + 70, 190, caption, { anchor: 'middle', size: 13 }));
  };
  // y = 2 − x 从 x = −1 画到 x = 3.3
  const l = (X, Y, b, o) => line(X(-1), Y(b + 1), X(b + 1.2), Y(-1.2), o);
  panel(0, (X, Y) => {
    out.push(l(X, Y, 2, { color: C.blue, w: 2 }), line(X(-1), Y(-1), X(3.4), Y(3.4), { color: C.emph, w: 2 }));
    out.push(dot(X(1), Y(1), C.ink, 4.5));
  }, '相交：唯一解');
  panel(160, (X, Y) => {
    out.push(l(X, Y, 2, { color: C.blue, w: 2 }), l(X, Y, 2.5, { color: C.emph, w: 2 }));
  }, '平行：无解');
  panel(320, (X, Y) => {
    out.push(l(X, Y, 2, { color: C.blue, w: 5, extra: ' opacity="0.45"' }), l(X, Y, 2, { color: C.emph, w: 2, dash: '6 4' }));
  }, '重合：无数个解');
  files['linear-system-cases.svg'] = svg(470, 205, out.join('\n'));
}

export default files;
