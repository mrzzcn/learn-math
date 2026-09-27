// 第七部分“二次函数”的图。
import { C, f, svg, text, line, dot, poly, polyline, axes, plot } from './lib.mjs';

const files = {};
const fmt = v => (v < 0 ? '−' + -v : String(v));
const appear = (inner, t0, t1, dur) =>
  `<g>${inner}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${t0.toFixed(2)};${t1.toFixed(2)};1" dur="${dur}s" repeatCount="indefinite"/></g>`;

// ---------- y = x² 的台阶：竖直方向的变化量 1、3、5 ----------
{
  const { X, Y, body } = axes({ ox: 40, oy: 300, u: 30, xmin: -0.4, xmax: 3.6, ymin: -0.3, ymax: 9.4 });
  const out = [body];
  const dur = 10;
  out.push(appear(plot(x => x * x, 0, 3.05, X, Y, { color: C.blue, w: 2.5 }), 0.6, 0.7, dur));
  for (let i = 0; i < 3; i++) {
    const x0 = X(i), y0 = Y(i * i), x1 = X(i + 1), y1 = Y((i + 1) * (i + 1));
    const g = [
      poly([[x0, y0], [x1, y0], [x1, y1]], { fill: C.emphFill, color: 'none', w: 0 }),
      line(x0, y0, x1, y0, { color: C.ink, w: 1.5, dash: '4 3' }),
      line(x1, y0, x1, y1, { color: C.emph, w: 2.5 }),
      text(x1 + 6, (y0 + y1) / 2 + 5, String(2 * i + 1), { color: C.emph }),
    ];
    if (i === 1) g.push(text((x0 + x1) / 2, y0 - 6, '1', { anchor: 'middle' }));
    const t0 = 0.05 + i * 0.15;
    out.push(appear(g.join(''), t0, t0 + 0.1, dur));
  }
  for (let i = 0; i <= 3; i++) out.push(dot(X(i), Y(i * i), C.ink));
  out.push(text(X(3) - 8, Y(9) + 4, 'y = x²', { anchor: 'end', color: C.blue, size: 13 }));
  files['quadratic-function-steps.svg'] = svg(320, 330, out.join('\n'));
}

// ---------- a 的作用：开口方向和大小（依次高亮） ----------
{
  const u = 30, lim = 6;
  const { X, Y, body } = axes({ ox: 170, oy: 200, u, xmin: -4.5, xmax: 4.5, ymin: -6, ymax: 6, ticks: false });
  const out = [body];
  const as = [0.5, 1, 2, -0.5, -1, -2];
  const lab = a => ({ 0.5: '1/2', 1: '1', 2: '2', [-0.5]: '−1/2', [-1]: '−1', [-2]: '−2' })[a];
  const col = a => (a > 0 ? C.blue : C.emph);
  const curve = (a, o) => { const r = Math.sqrt(lim / Math.abs(a)); return plot(x => a * x * x, -r, r, X, Y, { n: 200, ...o }); };
  for (const a of as) {
    out.push(curve(a, { color: col(a), w: 1.2, dash: '5 4' }));
    const r = Math.sqrt(lim / Math.abs(a));
    out.push(text(X(r) + 3, Y(a > 0 ? lim : -lim) + (a > 0 ? -5 : 15), lab(a), { anchor: 'middle', color: col(a), size: 12 }));
  }
  out.push(text(X(-4.3), Y(5.3), 'a &gt; 0', { color: C.blue, size: 13 }));
  out.push(text(X(-4.3), Y(-5.3) + 10, 'a &lt; 0', { color: C.emph, size: 13 }));
  const dur = as.length * 1.5;
  as.forEach((a, i) => {
    const vals = as.map((_, j) => (j === i ? 1 : 0)).join(';');
    out.push(`<g opacity="${a === 1 ? 1 : 0}">${curve(a, { color: col(a), w: 3 })}<animate attributeName="opacity" values="${vals}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/></g>`);
  });
  out.push(dot(X(0), Y(0), C.ink));
  files['quadratic-function-a.svg'] = svg(340, 400, out.join('\n'));
}

// ---------- k 的作用：上下平移（动画） ----------
{
  const u = 28;
  const { X, Y, body } = axes({ ox: 130, oy: 230, u, xmin: -4, xmax: 4.4, ymin: -4, ymax: 7.5 });
  const out = [body];
  const r = 2.3;
  for (const k of [2, -3]) {
    out.push(plot(x => x * x + k, -Math.sqrt(7.3 - k) * (k > 0 ? 1 : 0.85), Math.sqrt(7.3 - k) * (k > 0 ? 1 : 0.85), X, Y, { color: C.soft, w: 1.2, dash: '5 4' }));
    out.push(dot(X(0), Y(k), C.soft, 3));
  }
  out.push(text(X(0) + 8, Y(2) + 4, '(0, 2)', { color: C.soft, size: 12 }));
  out.push(text(X(0) + 8, Y(-3) + 16, '(0, −3)', { color: C.soft, size: 12 }));
  out.push(text(X(2.3) + 6, Y(7.3) + 10, 'y = x² + 2', { color: C.soft, size: 12 }));
  out.push(text(X(3.2) + 4, Y(3.3) + 18, 'y = x² − 3', { color: C.soft, size: 12 }));
  const vals = [0, 0, 2, 2, 0, 0, -3, -3, 0].map(k => `0 ${f(-k * u)}`).join(';');
  // y = x² 用实线留在原处作参照；平移的是虚线副本
  out.push(plot(x => x * x, -r, r, X, Y, { color: C.emph, w: 3 }), dot(X(0), Y(0), C.emph, 5));
  out.push(`<g>${plot(x => x * x, -r, r, X, Y, { color: C.emph, w: 2.5, dash: '7 5' })}${dot(X(0), Y(0), C.emph, 5)}<animateTransform attributeName="transform" type="translate" values="${vals}" keyTimes="0;0.1;0.25;0.4;0.5;0.6;0.75;0.9;1" dur="9s" repeatCount="indefinite"/></g>`);
  out.push(text(X(-r) - 4, Y(r * r) + 4, 'y = x²', { anchor: 'end', color: C.emph, size: 13 }));
  files['quadratic-function-k.svg'] = svg(320, 360, out.join('\n'));
}

// ---------- h 的作用：左右平移（动画） ----------
{
  const u = 28;
  const { X, Y, body } = axes({ ox: 180, oy: 230, u, xmin: -5.5, xmax: 5.5, ymin: -1.5, ymax: 7 });
  const out = [body];
  const r = 2.45;
  for (const h of [2, -2]) {
    out.push(plot(x => (x - h) ** 2, h - r, h + r, X, Y, { color: C.soft, w: 1.2, dash: '5 4' }));
    out.push(dot(X(h), Y(0), C.soft, 3.5));
  }
  out.push(text(X(2), Y(0) + 34, '(2, 0)', { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(text(X(-2), Y(0) + 34, '(−2, 0)', { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(text(X(2 + r) - 10, Y(r * r) - 6, 'y = (x − 2)²', { anchor: 'start', color: C.soft, size: 12 }));
  out.push(text(X(-2 - r) + 10, Y(r * r) - 6, 'y = (x + 2)²', { anchor: 'end', color: C.soft, size: 12 }));
  const vals = [0, 0, 2, 2, 0, 0, -2, -2, 0].map(h => `${f(h * u)} 0`).join(';');
  // y = x² 用实线留在原处作参照；平移的是虚线副本
  out.push(plot(x => x * x, -r, r, X, Y, { color: C.emph, w: 3 }), dot(X(0), Y(0), C.emph, 5));
  out.push(`<g>${plot(x => x * x, -r, r, X, Y, { color: C.emph, w: 2.5, dash: '7 5' })}${dot(X(0), Y(0), C.emph, 5)}<animateTransform attributeName="transform" type="translate" values="${vals}" keyTimes="0;0.1;0.25;0.4;0.5;0.6;0.75;0.9;1" dur="9s" repeatCount="indefinite"/></g>`);
  out.push(text(X(r) + 8, Y(6) + 4, 'y = x²', { color: C.emph, size: 13 }));
  files['quadratic-function-h.svg'] = svg(360, 290, out.join('\n'));
}

// ---------- y = x² − 4x + 3：顶点、对称轴、与坐标轴的交点 ----------
{
  const { X, Y, body } = axes({ ox: 60, oy: 220, u: 32, xmin: -1.5, xmax: 5.8, ymin: -2, ymax: 5.5, ticks: false });
  const out = [body];
  const g = x => x * x - 4 * x + 3;
  out.push(line(X(2), Y(-1.9), X(2), Y(5.3), { color: C.emph, w: 1.5, dash: '6 4' }));
  out.push(text(X(2) + 6, Y(5.3) + 4, 'x = 2', { color: C.emph, size: 12 }));
  out.push(plot(g, -0.3, 4.3, X, Y, { color: C.blue, w: 2.5 }));
  out.push(line(X(0), Y(3), X(4), Y(3), { color: C.soft, w: 1, dash: '4 3' }));
  for (const [x, y] of [[1, 0], [3, 0], [0, 3], [4, 3]]) out.push(dot(X(x), Y(y), C.ink, 4));
  out.push(dot(X(2), Y(-1), C.emph, 5));
  out.push(text(X(2) + 8, Y(-1) + 16, '(2, −1)', { color: C.emph, size: 12 }));
  out.push(text(X(1) + 6, Y(0) - 8, '(1, 0)', { size: 12 }));
  out.push(text(X(3) + 6, Y(0) + 17, '(3, 0)', { size: 12 }));
  out.push(text(X(0) + 6, Y(3) - 8, '(0, 3)', { size: 12 }));
  out.push(text(X(4) + 8, Y(3) + 18, '(4, 3)', { size: 12 }));
  out.push(text(X(4.3) + 8, Y(g(4.3)) + 4, 'y = x² − 4x + 3', { color: C.blue, size: 13 }));
  files['quadratic-function-vertex.svg'] = svg(340, 300, out.join('\n'));
}

// ---------- 与 x 轴的交点：c 变化时交点个数变化（依次高亮） ----------
{
  const { X, Y, body } = axes({ ox: 100, oy: 190, u: 30, xmin: -2.5, xmax: 4.5, ymin: -4.5, ymax: 5.5 });
  const out = [body];
  const cs = [-3, 1, 3];
  const cols = [C.emph, C.blue, C.ink];
  const g = c => x => x * x - 2 * x + c;
  const range = c => { const r = Math.sqrt(5.3 - (c - 1)); return [1 - r, 1 + r]; };
  const roots = { [-3]: [-1, 3], 1: [1], 3: [] };
  cs.forEach((c, i) => {
    const [a, b] = range(c);
    out.push(plot(g(c), a, b, X, Y, { color: cols[i], w: 1.2, dash: '5 4' }));
    out.push(text(X(4.4), Y(-2.2 - 0.8 * i) + 4, `c = ${fmt(c)}`, { anchor: 'end', color: cols[i], size: 13 }));
  });
  const dur = 9;
  cs.forEach((c, i) => {
    const [a, b] = range(c);
    const vals = cs.map((_, j) => (j === i ? 1 : 0)).join(';');
    const inner = plot(g(c), a, b, X, Y, { color: cols[i], w: 3 }) +
      roots[c].map(x => dot(X(x), Y(0), cols[i], 5.5)).join('');
    out.push(`<g opacity="${i === 0 ? 1 : 0}">${inner}<animate attributeName="opacity" values="${vals}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/></g>`);
  });
  files['quadratic-function-roots.svg'] = svg(340, 360, out.join('\n'));
}

// ---------- 靠墙围菜园 ----------
{
  const out = [];
  const x0 = 70, x1 = 290, y0 = 40, y1 = 150;
  out.push(line(30, y0, 330, y0, { color: C.ink, w: 3 }));
  for (let x = 36; x < 330; x += 12) out.push(line(x, y0, x + 8, y0 - 10, { color: C.soft, w: 1 }));
  out.push(text(318, y0 - 16, '墙', { anchor: 'end', color: C.soft }));
  out.push(polyline([[x0, y0], [x0, y1], [x1, y1], [x1, y0]], { color: C.emph, w: 2.5 }));
  out.push(`<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${C.emphFill}" stroke="none"/>`);
  out.push(text(x0 - 8, (y0 + y1) / 2 + 5, 'x', { anchor: 'end', italic: true }));
  out.push(text(x1 + 8, (y0 + y1) / 2 + 5, 'x', { italic: true }));
  out.push(text((x0 + x1) / 2, y1 + 22, '20 − 2x', { anchor: 'middle' }));
  out.push(text((x0 + x1) / 2, (y0 + y1) / 2 + 5, '菜园', { anchor: 'middle', color: C.soft }));
  files['quadratic-function-fence.svg'] = svg(360, 185, out.join('\n'));
}

// ---------- 面积 S 随 x 变化的图象：顶点和取值范围 ----------
{
  const ox = 50, oy = 250, sx = 26, sy = 4;
  const X = x => ox + sx * x, Y = s => oy - sy * s;
  const S = x => -2 * x * x + 20 * x;
  const out = [];
  for (let x = 2; x <= 10; x += 2) out.push(line(X(x), Y(0), X(x), Y(55), { color: C.grid, w: 1 }), text(X(x), oy + 18, x, { anchor: 'middle', color: C.soft, size: 11 }));
  for (let s = 10; s <= 50; s += 10) out.push(line(X(0), Y(s), X(10.8), Y(s), { color: C.grid, w: 1 }), text(ox - 6, Y(s) + 4, s, { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), oy, X(11), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(58), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(11) + 8)},${oy} ${f(X(11))},${oy - 4} ${f(X(11))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(58) - 8)} ${ox - 4},${f(Y(58))} ${ox + 4},${f(Y(58))}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(X(11) + 4, oy + 18, 'x', { italic: true, color: C.soft }));
  out.push(text(ox + 8, Y(58) - 2, 'S', { italic: true, color: C.soft }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(plot(S, 0, 6, X, Y, { color: C.soft, w: 1.5, dash: '5 4' }));
  out.push(plot(S, 6, 10, X, Y, { color: C.emph, w: 3 }));
  out.push(line(X(5), Y(50), X(5), Y(0), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(line(X(6), Y(48), X(6), Y(0), { color: C.emph, w: 1, dash: '4 3' }));
  out.push(dot(X(5), Y(50), C.soft, 4), dot(X(6), Y(48), C.emph, 5));
  out.push(`<circle cx="${X(10)}" cy="${Y(0)}" r="4.5" fill="none" stroke="${C.emph}" stroke-width="2"/>`);
  out.push(text(X(5) - 8, Y(50) - 8, '(5, 50)', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(X(6) + 8, Y(48) - 6, '(6, 48)', { color: C.emph, size: 12 }));
  files['quadratic-function-fence-graph.svg'] = svg(360, 290, out.join('\n'));
}

export default files;
