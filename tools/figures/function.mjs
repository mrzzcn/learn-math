// 第七部分“函数”的图。
import { C, f, svg, text, line, dot, polyline, axes, plot } from './lib.mjs';

const files = {};

// 带箭头的线段：从 a 指向 b
const arrow = (a, b, o = {}) => {
  const col = o.color || C.soft, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-u[1], u[0]];
  const base = [b[0] - 9 * u[0], b[1] - 9 * u[1]];
  return line(a[0], a[1], base[0], base[1], { color: col, w: o.w || 1.5, dash: o.dash }) +
    `<polygon points="${f(b[0])},${f(b[1])} ${f(base[0] + 4 * n[0])},${f(base[1] + 4 * n[1])} ${f(base[0] - 4 * n[0])},${f(base[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`;
};
const ellipse = (cx, cy, rx, ry) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`;
const fmt = v => (v < 0 ? '−' + -v : String(v));

// ---------- 对应：是函数和不是函数 ----------
{
  const out = [];
  // 一组对应图：左边 x 的值，右边 y 的值，pairs 是 [x 的序号, y 的序号]
  const panel = (x0, xs, ys, pairs, title, bad) => {
    const lx = x0 + 45, rx = x0 + 165, cy = 130, gap = 38;
    out.push(ellipse(lx, cy, 32, 85), ellipse(rx, cy, 32, 85));
    out.push(text(lx, 32, 'x', { anchor: 'middle', italic: true, color: C.soft }), text(rx, 32, 'y', { anchor: 'middle', italic: true, color: C.soft }));
    const py = (arr, i) => cy + (i - (arr.length - 1) / 2) * gap;
    xs.forEach((v, i) => out.push(text(lx, py(xs, i) + 5, fmt(v), { anchor: 'middle' })));
    ys.forEach((v, i) => out.push(text(rx, py(ys, i) + 5, fmt(v), { anchor: 'middle' })));
    for (const [i, j] of pairs) {
      const col = bad && bad.includes(i) ? C.emph : C.blue;
      out.push(arrow([lx + 18, py(xs, i)], [rx - 18, py(ys, j)], { color: col }));
    }
    out.push(text(x0 + 105, 245, title, { anchor: 'middle', color: bad ? C.emph : C.blue }));
  };
  // y = x²：两个 x 可以对应同一个 y
  panel(10, [-2, -1, 1, 2], [1, 4], [[0, 1], [1, 0], [2, 0], [3, 1]], '是函数', null);
  // y² = x：一个 x 对应两个 y
  panel(250, [1, 4], [-2, -1, 1, 2], [[0, 1], [0, 2], [1, 0], [1, 3]], '不是函数', [0, 1]);
  files['function-mapping.svg'] = svg(470, 260, out.join('\n'));
}

// ---------- 竖直线检验：x = y² 的图象，x = 4 对应两个 y ----------
{
  const { X, Y, body } = axes({ ox: 50, oy: 150, u: 30, xmin: -1, xmax: 7.4, ymin: -3.6, ymax: 3.6 });
  const out = [body];
  const pts = [];
  for (let k = 0; k <= 120; k++) { const y = -2.65 + (5.3 * k) / 120; pts.push([X(y * y), Y(y)]); }
  out.push(polyline(pts, { color: C.blue, w: 2.5 }));
  out.push(line(X(4), Y(-3.4), X(4), Y(3.4), { color: C.emph, w: 1.5, dash: '6 4' }));
  out.push(dot(X(4), Y(2), C.emph, 5), dot(X(4), Y(-2), C.emph, 5));
  out.push(text(X(4) - 8, Y(2) - 8, '(4, 2)', { anchor: 'end', size: 12 }), text(X(4) - 8, Y(-2) + 20, '(4, −2)', { anchor: 'end', size: 12 }));
  out.push(text(X(4) - 6, Y(3.4) + 4, 'x = 4', { anchor: 'end', color: C.emph, size: 12 }));
  out.push(text(X(6.8), Y(1.9) + 4, 'x = y²', { anchor: 'end', color: C.blue, size: 13 }));
  files['function-vertical-line.svg'] = svg(320, 300, out.join('\n'));
}

// ---------- 描点法：列表、描点、连线（动画） ----------
{
  const { X, Y, body } = axes({ ox: 160, oy: 280, u: 28, xmin: -4.5, xmax: 4.5, ymin: -0.5, ymax: 9.5 });
  const out = [body];
  const dur = 10, xs = [-3, -2, -1, 0, 1, 2, 3];
  // 曲线：最后出现，PDF 里直接显示
  out.push(`<g>${plot(x => x * x, -3.05, 3.05, X, Y, { color: C.blue, w: 2.5 })}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.6;0.72;1" dur="${dur}s" repeatCount="indefinite"/></g>`);
  xs.forEach((x, i) => {
    const t0 = 0.04 + i * 0.07, t1 = t0 + 0.04;
    out.push(`<g>${dot(X(x), Y(x * x), C.emph, 4.5)}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${t0.toFixed(2)};${t1.toFixed(2)};1" dur="${dur}s" repeatCount="indefinite"/></g>`);
  });
  out.push(text(X(3) + 8, Y(9) + 5, 'y = x²', { color: C.blue, size: 13 }));
  files['function-plot-points.svg'] = svg(320, 320, out.join('\n'));
}

// ---------- 读图：去图书馆再回家 ----------
// 题干的图只画行程；解答里的图再画出直线 y = 2 和它与图象的两个交点
for (const sol of [false, true]) {
  const ox = 60, oy = 230, sx = 4, sy = 45;
  const X = t => ox + sx * t, Y = s => oy - sy * s;
  const out = [];
  for (let t = 10; t <= 80; t += 10) out.push(line(X(t), Y(0), X(t), Y(4.5), { color: C.grid, w: 1 }), text(X(t), oy + 18, t, { anchor: 'middle', color: C.soft, size: 11 }));
  for (let s = 1; s <= 4; s++) out.push(line(X(0), Y(s), X(85), Y(s), { color: C.grid, w: 1 }), text(ox - 6, Y(s) + 4, s, { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), oy, X(88), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(4.8), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(88) + 8)},${oy} ${f(X(88))},${oy - 4} ${f(X(88))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(4.8) - 8)} ${ox - 4},${f(Y(4.8))} ${ox + 4},${f(Y(4.8))}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(X(88), oy + 36, '时间 x（分）', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(ox + 8, Y(4.8) - 2, '离家距离 y（千米）', { color: C.soft, size: 12 }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', color: C.soft, size: 11 }));
  const A = [X(0), Y(0)], B = [X(20), Y(4)], Cc = [X(50), Y(4)], D = [X(80), Y(0)];
  out.push(polyline([A, B, Cc, D], { color: C.blue, w: 2.5 }));
  for (const p of [B, Cc, D]) out.push(dot(p[0], p[1], C.blue, 4));
  // 同一个 y = 2 对应两个时刻
  if (sol) out.push(line(X(0), Y(2), X(79), Y(2), { color: C.emph, w: 1.2, dash: '5 4' }));
  if (sol) out.push(line(X(10), Y(2), X(10), Y(0), { color: C.soft, w: 1, dash: '4 3' }), line(X(65), Y(2), X(65), Y(0), { color: C.soft, w: 1, dash: '4 3' }));
  if (sol) out.push(dot(X(10), Y(2), C.emph, 4.5), dot(X(65), Y(2), C.emph, 4.5));
  if (sol) out.push(text(X(10) + 8, Y(2) + 18, '(10, 2)', { size: 12 }), text(X(65) + 8, Y(2) - 6, '(65, 2)', { size: 12 }), text(X(81), Y(2) + 4, 'y = 2', { color: C.emph, size: 12 }));
  out.push(text(X(35), Y(4) - 10, '在图书馆', { anchor: 'middle', color: C.soft, size: 12 }));
  files[sol ? 'function-trip-two.svg' : 'function-trip.svg'] = svg(420, 280, out.join('\n'));
}

export default files;
