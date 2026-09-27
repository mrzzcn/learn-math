// 第二部分“实数”的图。
import { C, f, svg, text, line, dot, poly } from './lib.mjs';

const files = {};
const fmt = v => (v < 0 ? '−' + -v : String(v));

// ---------- 面积为 2 的正方形 ----------
{
  const L = 110, x0 = 60, y0 = 25;
  const P = (i, j) => [x0 + i * L, y0 + j * L]; // i 向右，j 向下
  const A = P(1, 0), B = P(2, 1), Cc = P(1, 2), D = P(0, 1), O = P(1, 1);
  const out = [];
  // 四个角上的直角三角形，绕斜边中点转 180° 后正好盖住正方形 ABCD 的四分之一。
  // 原位置用实线留着；转动的是虚线副本，初始（PDF 显示的）状态画在转进来以后的位置
  const corners = [[P(0, 0), A, D], [P(2, 0), B, A], [P(2, 2), Cc, B], [P(0, 2), D, Cc]];
  out.push(poly([A, B, Cc, D], { fill: C.emphFill, color: 'none', w: 0 }));
  corners.forEach(([v, p, q], i) => {
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const t0 = 0.08 + i * 0.1, t1 = t0 + 0.08;
    const kt = `0;${f(t0)};${f(t1)};0.75;0.85;1`;
    out.push(poly([v, p, q], { fill: C.blueFill, color: C.blue, w: 1.2 }));
    out.push(`<g transform="rotate(180 ${f(m[0])} ${f(m[1])})">${poly([v, p, q], { fill: C.blueFill, color: C.blue, w: 1.2, dash: '4 3' })}<animateTransform attributeName="transform" type="rotate" values="0 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])}" keyTimes="${kt}" dur="9s" repeatCount="indefinite"/></g>`);
  });
  // 网格：2 × 2 个单位正方形
  out.push(line(...P(1, 0), ...P(1, 2), { color: C.soft, w: 1, dash: '4 4' }), line(...P(0, 1), ...P(2, 1), { color: C.soft, w: 1, dash: '4 4' }));
  out.push(poly([P(0, 0), P(2, 0), P(2, 2), P(0, 2)], { color: C.ink, w: 1.5 }));
  out.push(poly([A, B, Cc, D], { color: C.emph, w: 2.5 }));
  out.push(text(A[0], A[1] - 8, 'A', { anchor: 'middle', italic: true }), text(B[0] + 8, B[1] + 5, 'B', { italic: true }));
  out.push(text(Cc[0], Cc[1] + 18, 'C', { anchor: 'middle', italic: true }), text(D[0] - 8, D[1] + 5, 'D', { anchor: 'end', italic: true }));
  out.push(text(x0 + L * 1.5, y0 + 2 * L + 18, '1', { anchor: 'middle', color: C.soft, size: 13 }), text(x0 + 2 * L + 8, y0 + L * 1.5 + 5, '1', { color: C.soft, size: 13 }));
  out.push(dot(...O, C.soft, 2.5));
  files['real-numbers-square.svg'] = svg(340, 270, out.join('\n'));
}

// ---------- 在数轴上找到 √2 ----------
{
  const y = 170, u = 100, ox = 140;
  const X = v => ox + u * v;
  const out = [line(X(-1.2), y, X(2.8), y, { color: C.ink, w: 1.8 })];
  out.push(`<polygon points="${f(X(2.8) + 10)},${y} ${f(X(2.8))},${y - 5} ${f(X(2.8))},${y + 5}" fill="${C.ink}" stroke="none"/>`);
  for (let v = -1; v <= 2; v++) {
    out.push(line(X(v), y - 5, X(v), y, { color: C.ink, w: 1.5 }));
    out.push(text(X(v), y + 20, fmt(v), { anchor: 'middle', color: C.soft, size: 13 }));
  }
  const O = [X(0), y], A = [X(1), y], B = [X(1), y - u], Cc = [X(0), y - u], r2 = Math.SQRT2, P = [X(r2), y];
  out.push(poly([O, A, B, Cc], { color: C.ink, w: 1.5 }));
  out.push(`<path d="M ${f(B[0])} ${f(B[1])} A ${f(u * r2)} ${f(u * r2)} 0 0 1 ${f(P[0])} ${f(P[1])}" stroke="${C.soft}" stroke-width="1.2" stroke-dasharray="5 4" fill="none"/>`);
  out.push(line(...O, ...B, { color: C.emph, w: 2.5 }));
  // 转下来的 OB：虚线副本，初始（PDF 显示的）状态画在数轴上的 OP
  out.push(`<g transform="rotate(45 ${f(O[0])} ${y})">${line(...O, ...B, { color: C.emph, w: 2.5, dash: '6 4' })}<animateTransform attributeName="transform" type="rotate" values="0 ${f(O[0])} ${y};0 ${f(O[0])} ${y};45 ${f(O[0])} ${y};45 ${f(O[0])} ${y};0 ${f(O[0])} ${y}" keyTimes="0;0.2;0.55;0.85;1" dur="7s" repeatCount="indefinite"/></g>`);
  out.push(dot(...P, C.emph, 5), dot(...B, C.ink, 3.5));
  out.push(text(O[0] - 6, y - 8, 'O', { anchor: 'end', italic: true }), text(A[0] - 6, y - 8, 'A', { anchor: 'end', italic: true }));
  out.push(text(B[0] + 6, B[1] - 4, 'B', { italic: true }), text(Cc[0] - 6, Cc[1] - 4, 'C', { anchor: 'end', italic: true }));
  out.push(text(P[0] + 4, y - 10, 'P', { italic: true, color: C.emph }));
  out.push(text(P[0], y + 20, '√2', { anchor: 'middle', color: C.emph, size: 13 }));
  files['real-numbers-line.svg'] = svg(450, 200, out.join('\n'));
}

// ---------- 估算 √7：一步步夹紧 ----------
{
  const r7 = Math.sqrt(7);
  const out = [];
  // 上面一条：0 到 4
  const y1 = 60, X1 = v => 60 + 95 * v;
  out.push(line(X1(0), y1, X1(4), y1, { color: C.ink, w: 1.8 }));
  for (let v = 0; v <= 4; v++) {
    out.push(line(X1(v), y1 - 5, X1(v), y1, { color: C.ink, w: 1.5 }));
    out.push(text(X1(v), y1 + 20, String(v), { anchor: 'middle', color: C.soft, size: 13 }));
  }
  out.push(line(X1(2), y1, X1(3), y1, { color: C.blue, w: 4 }));
  out.push(text(X1(2), y1 - 12, '4', { anchor: 'middle', color: C.blue, size: 12 }), text(X1(3), y1 - 12, '9', { anchor: 'middle', color: C.blue, size: 12 }));
  out.push(dot(X1(r7), y1, C.emph, 4.5), text(X1(r7), y1 - 30, '√7', { anchor: 'middle', color: C.emph, size: 13 }));
  out.push(text(10, y1 - 12, '平方', { color: C.blue, size: 12 }));
  // 下面一条：把 2 到 3 放大
  const y2 = 175, X2 = v => 60 + 380 * (v - 2);
  out.push(line(X1(2), y1 + 28, X2(2), y2 - 10, { color: C.soft, w: 1, dash: '4 4' }), line(X1(3), y1 + 28, X2(3), y2 - 10, { color: C.soft, w: 1, dash: '4 4' }));
  out.push(line(X2(2), y2, X2(3), y2, { color: C.ink, w: 1.8 }));
  for (let i = 0; i <= 10; i++) {
    const v = 2 + i / 10;
    out.push(line(X2(v), y2 - 5, X2(v), y2, { color: C.ink, w: 1.2 }));
    out.push(text(X2(v), y2 + 20, v.toFixed(1), { anchor: 'middle', color: C.soft, size: 12 }));
  }
  out.push(line(X2(2.6), y2, X2(2.7), y2, { color: C.emph, w: 4 }));
  out.push(text(X2(2.6), y2 - 12, '6.76', { anchor: 'end', color: C.blue, size: 12 }), text(X2(2.7), y2 - 12, '7.29', { color: C.blue, size: 12 }));
  out.push(dot(X2(r7), y2, C.emph, 4.5), text(X2(r7), y2 - 30, '√7', { anchor: 'middle', color: C.emph, size: 13 }));
  out.push(text(10, y2 - 12, '平方', { color: C.blue, size: 12 }));
  files['real-numbers-estimate.svg'] = svg(470, 205, out.join('\n'));
}

export default files;
