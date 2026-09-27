// 第三部分“代数式”的图。
import { C, f, svg, text, line, dot } from './lib.mjs';

const files = {};
// ---------- 火柴棒摆正方形：1 + 3n ----------
{
  const x0 = 45, y0 = 30, s = 60, g = 5, n = 4;
  const stick = (x1, y1, x2, y2, col) => line(x1, y1, x2, y2, { color: col, w: 5, extra: ' stroke-linecap="round"' });
  const out = [];
  // 第一根竖的
  out.push(stick(x0, y0 + g, x0, y0 + s - g, C.emph));
  out.push(text(x0, y0 + s + 30, '1', { anchor: 'middle', color: C.emph, size: 15 }));
  for (let i = 0; i < n; i++) {
    const col = i % 2 ? C.ink : C.blue, xl = x0 + i * s, xr = xl + s;
    out.push(stick(xl + g, y0, xr - g, y0, col), stick(xl + g, y0 + s, xr - g, y0 + s, col), stick(xr, y0 + g, xr, y0 + s - g, col));
    out.push(text((xl + xr) / 2 + 4, y0 + s + 30, '+3', { anchor: 'middle', color: col, size: 15 }));
  }
  out.push(text(x0 + n * s + 22, y0 + s / 2 + 5, '……', { color: C.soft }));
  files['algebraic-expressions-matches.svg'] = svg(340, 132, out.join('\n'));
}

// ---------- 代数式 3n + 1 的值随 n 变化 ----------
{
  const ox = 50, oy = 250, ux = 44, uy = 10;
  const X = x => ox + ux * x, Y = y => oy - uy * y;
  const out = [];
  for (let x = 1; x <= 6; x++) out.push(line(X(x), Y(0), X(x), Y(21), { color: C.grid, w: 1 }), text(X(x), oy + 18, x, { anchor: 'middle', color: C.soft, size: 11 }));
  for (let y = 5; y <= 20; y += 5) out.push(line(X(0), Y(y), X(6.6), Y(y), { color: C.grid, w: 1 }), text(ox - 6, Y(y) + 4, y, { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), oy, X(6.8), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(22.5), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(6.8) + 8)},${oy} ${f(X(6.8))},${oy - 4} ${f(X(6.8))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(22.5) - 8)} ${ox - 4},${f(Y(22.5))} ${ox + 4},${f(Y(22.5))}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(X(6.8) + 4, oy + 18, 'n', { italic: true, color: C.soft }));
  out.push(text(ox + 8, Y(22.5) - 2, '3n + 1 的值', { color: C.soft, size: 12 }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', color: C.soft, size: 11 }));
  // 第一步的台阶
  out.push(line(X(1), Y(4), X(2), Y(4), { color: C.blue, w: 1.5, dash: '4 3' }), line(X(2), Y(4), X(2), Y(7), { color: C.emph, w: 2.5 }));
  out.push(text(X(1.5), Y(4) + 16, '+1', { anchor: 'middle', color: C.blue, size: 12 }), text(X(2) + 6, Y(5.5) + 4, '+3', { color: C.emph, size: 12 }));
  for (let n = 1; n <= 6; n++) {
    out.push(dot(X(n), Y(3 * n + 1), C.ink, 4.5));
    out.push(text(X(n) - 6, Y(3 * n + 1) - 8, 3 * n + 1, { anchor: 'end', size: 12 }));
  }
  files['algebraic-expressions-values.svg'] = svg(370, 280, out.join('\n'));
}

export default files;
