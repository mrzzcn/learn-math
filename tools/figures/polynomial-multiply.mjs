// 第三部分“整式的乘法”的图。
import { C, f, svg, text, line, poly } from './lib.mjs';

const files = {};
const rect = (x, y, w, h, o = {}) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { w: 1.5, ...o });
const it = (x, y, s, o = {}) => text(x, y, s, { anchor: 'middle', italic: true, ...o });

// ---------- 单项式乘多项式：m(a + b + c) ----------
{
  const x0 = 50, y0 = 40, m = 80, ws = [120, 90, 60], names = ['a', 'b', 'c'];
  const fills = [C.blueFill, C.emphFill, C.blueFill], cols = [C.blue, C.emph, C.blue];
  const out = [];
  let x = x0;
  ws.forEach((w, i) => {
    out.push(rect(x, y0, w, m, { fill: fills[i], color: cols[i] }));
    out.push(it(x + w / 2, y0 - 10, names[i], { color: cols[i] }));
    out.push(it(x + w / 2, y0 + m / 2 + 5, 'm' + names[i]));
    x += w;
  });
  out.push(it(x0 - 14, y0 + m / 2 + 5, 'm'));
  files['polynomial-multiply-single.svg'] = svg(340, 140, out.join('\n'));
}

// ---------- 多项式乘多项式：(a + b)(m + n) ----------
{
  const x0 = 50, y0 = 40, a = 150, b = 80, m = 100, n = 60, out = [];
  out.push(rect(x0, y0, a, m, { fill: C.blueFill, color: C.blue }), rect(x0 + a, y0, b, m, { fill: C.emphFill, color: C.emph }));
  out.push(rect(x0, y0 + m, a, n, { fill: C.emphFill, color: C.emph }), rect(x0 + a, y0 + m, b, n, { fill: C.blueFill, color: C.blue }));
  out.push(it(x0 + a / 2, y0 - 10, 'a'), it(x0 + a + b / 2, y0 - 10, 'b'), it(x0 - 14, y0 + m / 2 + 5, 'm'), it(x0 - 14, y0 + m + n / 2 + 5, 'n'));
  out.push(it(x0 + a / 2, y0 + m / 2 + 5, 'am'), it(x0 + a + b / 2, y0 + m / 2 + 5, 'bm'), it(x0 + a / 2, y0 + m + n / 2 + 5, 'an'), it(x0 + a + b / 2, y0 + m + n / 2 + 5, 'bn'));
  files['polynomial-multiply-four.svg'] = svg(310, 220, out.join('\n'));
}

// ---------- 完全平方：(a + b)² ----------
{
  const x0 = 50, y0 = 40, a = 150, b = 70, out = [];
  out.push(rect(x0, y0, a, a, { fill: C.emphFill, color: C.emph }), rect(x0 + a, y0, b, a, { fill: C.blueFill, color: C.blue }));
  out.push(rect(x0, y0 + a, a, b, { fill: C.blueFill, color: C.blue }), rect(x0 + a, y0 + a, b, b, { fill: C.emphFill, color: C.emph }));
  out.push(it(x0 + a / 2, y0 - 10, 'a'), it(x0 + a + b / 2, y0 - 10, 'b'), it(x0 - 14, y0 + a / 2 + 5, 'a'), it(x0 - 14, y0 + a + b / 2 + 5, 'b'));
  out.push(it(x0 + a / 2, y0 + a / 2 + 5, 'a²', { size: 16 }), it(x0 + a + b / 2, y0 + a / 2 + 5, 'ab'), it(x0 + a / 2, y0 + a + b / 2 + 5, 'ab'), it(x0 + a + b / 2, y0 + a + b / 2 + 5, 'b²'));
  files['polynomial-multiply-square.svg'] = svg(310, 280, out.join('\n'));
}

// ---------- 完全平方：(a − b)² ----------
{
  const x0 = 60, y0 = 40, a = 200, b = 60, out = [];
  // 大正方形 a²
  out.push(rect(x0, y0, a, a, { color: C.ink, w: 2 }));
  // (a − b)²
  out.push(rect(x0, y0, a - b, a - b, { fill: C.emphFill, color: C.emph, w: 2 }));
  // 两条 ab：右边一条、下边一条，右下角重叠
  out.push(rect(x0 + a - b, y0, b, a, { fill: C.blueFill, color: C.blue, dash: '6 4' }));
  out.push(rect(x0, y0 + a - b, a, b, { fill: C.blueFill, color: C.blue, dash: '6 4' }));
  out.push(it(x0 + (a - b) / 2, y0 + (a - b) / 2 + 5, '(a − b)²', { color: C.emph, size: 16 }));
  out.push(it(x0 + a - b / 2, y0 + (a - b) / 2 + 5, 'ab', { color: C.blue }), it(x0 + (a - b) / 2, y0 + a - b / 2 + 5, 'ab', { color: C.blue }));
  out.push(it(x0 + a - b / 2, y0 + a - b / 2 + 5, 'b²'));
  out.push(it(x0 + (a - b) / 2, y0 - 10, 'a − b'), it(x0 + a - b / 2, y0 - 10, 'b'));
  out.push(it(x0 - 12, y0 + (a - b) / 2 + 5, 'a − b', { anchor: 'end' }), it(x0 - 12, y0 + a - b / 2 + 5, 'b', { anchor: 'end' }));
  // 大正方形的边长 a
  const dim = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { color: C.soft, w: 1 });
  out.push(dim(x0, y0 + a + 14, x0 + a, y0 + a + 14), dim(x0, y0 + a + 9, x0, y0 + a + 19), dim(x0 + a, y0 + a + 9, x0 + a, y0 + a + 19));
  out.push(it(x0 + a / 2, y0 + a + 32, 'a'));
  files['polynomial-multiply-minus-square.svg'] = svg(310, 284, out.join('\n'));
}

// ---------- 平方差：剪拼成长方形（动画） ----------
{
  const a = 180, b = 70, ox = 70, oy = 40 + b, out = [];
  // 原来的大正方形和挖去的小正方形（虚线）
  out.push(rect(ox, oy, a, a, { color: C.soft, w: 1, dash: '5 4' }));
  out.push(rect(ox + a - b, oy, b, b, { color: C.soft, w: 1, dash: '5 4' }));
  out.push(it(ox + a - b / 2, oy + b / 2 + 5, 'b²', { color: C.soft }));
  // 不动的一块
  out.push(rect(ox, oy, a - b, a, { fill: C.emphFill, color: C.emph, w: 2 }));
  // 移动的一块：原位置 x∈[ox+a−b, ox+a]，y∈[oy+b, oy+a]
  const cx = ox + a - b / 2, cy = oy + (a + b) / 2;
  const dx = -a / 2, dy = -a / 2 - b;
  // 原位置保留实线，移动的是虚线副本；PDF 里副本停在拼好的位置
  out.push(rect(ox + a - b, oy + b, b, a - b, { fill: C.blueFill, color: C.blue, w: 2 }));
  const piece = rect(ox + a - b, oy + b, b, a - b, { fill: C.blueFill, color: C.blue, w: 2, dash: '6 4' });
  const kt = '0;0.2;0.5;0.8;1', dur = 8;
  out.push(`<g transform="translate(${f(dx)} ${f(dy)}) rotate(90 ${f(cx)} ${f(cy)})">${piece}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${f(dx)} ${f(dy)};${f(dx)} ${f(dy)};0 0" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" additive="sum" values="0 ${f(cx)} ${f(cy)};0 ${f(cx)} ${f(cy)};90 ${f(cx)} ${f(cy)};90 ${f(cx)} ${f(cy)};0 ${f(cx)} ${f(cy)}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g>`);
  // 尺寸
  const dim = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { color: C.soft, w: 1 });
  out.push(dim(ox - 16, oy - b, ox - 16, oy + a), dim(ox - 21, oy - b, ox - 11, oy - b), dim(ox - 21, oy + a, ox - 11, oy + a));
  out.push(it(ox - 24, oy + (a - b) / 2 + 5, 'a + b', { anchor: 'end' }));
  out.push(it(ox + (a - b) / 2, oy - b - 10, 'a − b'));
  out.push(dim(ox, oy + a + 14, ox + a, oy + a + 14), dim(ox, oy + a + 9, ox, oy + a + 19), dim(ox + a, oy + a + 9, ox + a, oy + a + 19));
  out.push(it(ox + a / 2, oy + a + 32, 'a'));
  out.push(it(ox + a + 12, oy + b / 2 + 5, 'b', { anchor: 'start', color: C.soft }));
  files['polynomial-multiply-difference.svg'] = svg(320, oy + a + 44, out.join('\n'));
}

// ---------- 四个 ab 围成一圈：(a + b)² − (a − b)² = 4ab ----------
{
  const x0 = 50, y0 = 40, a = 150, b = 60, out = [];
  const R = [[x0, y0, a, b], [x0 + a, y0, b, a], [x0 + b, y0 + a, a, b], [x0, y0 + b, b, a]];
  for (const [x, y, w, h] of R) out.push(rect(x, y, w, h, { fill: C.blueFill, color: C.blue, w: 2 }), it(x + w / 2, y + h / 2 + 5, 'ab', { color: C.blue }));
  out.push(rect(x0 + b, y0 + b, a - b, a - b, { fill: C.emphFill, color: C.emph, w: 2 }));
  out.push(it(x0 + (a + b) / 2, y0 + (a + b) / 2 + 5, '(a − b)²', { color: C.emph, size: 16 }));
  out.push(it(x0 + a / 2, y0 - 10, 'a'), it(x0 + a + b / 2, y0 - 10, 'b'));
  out.push(it(x0 - 12, y0 + b / 2 + 5, 'b', { anchor: 'end' }), it(x0 - 12, y0 + b + a / 2 + 5, 'a', { anchor: 'end' }));
  files['polynomial-multiply-pinwheel.svg'] = svg(310, 270, out.join('\n'));
}

// ---------- 杨辉三角 ----------
{
  const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]];
  const cx = 280, y0 = 30, dy = 34, dx = 44, out = [];
  const pos = (r, k) => [cx + (k - r / 2) * dx, y0 + r * dy];
  // 3 + 3 = 6 的连线
  const p6 = pos(4, 2), pa = pos(3, 1), pb = pos(3, 2);
  out.push(line(pa[0], pa[1] + 6, p6[0], p6[1] - 12, { color: C.emph, w: 1.5 }), line(pb[0], pb[1] + 6, p6[0], p6[1] - 12, { color: C.emph, w: 1.5 }));
  rows.forEach((row, r) => {
    out.push(`<text x="20" y="${y0 + r * dy + 5}" fill="${C.soft}" stroke="none" font-style="italic" font-size="13">(a + b)<tspan dy="-6" font-size="10">${r}</tspan></text>`);
    row.forEach((v, k) => {
      const [x, y] = pos(r, k);
      const hot = (r === 4 && k === 2) || (r === 3 && (k === 1 || k === 2));
      out.push(text(x, y + 5, v, { anchor: 'middle', color: hot ? C.emph : C.ink, size: 15 }));
    });
  });
  files['polynomial-multiply-pascal.svg'] = svg(420, 220, out.join('\n'));
}

export default files;
