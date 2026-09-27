// 第十一部分“方程思想与建模”的图。
import { C, f, svg, text, line, dot, poly, polyline, axes, plot, rightAngle } from './lib.mjs';

const files = {};
const pts = arr => arr.map(p => p.map(f).join(',')).join(' ');

// ---------- 折叠：D 落到 BC 上的 F ----------
// 题干图只标已知的 AB = 8、AD = BC = 10，带折叠动画；解法图再标出算出的 6、4 和设的 x、8 − x
function fold(solve) {
  const u = 22, ox = 50, oy = 210;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const A = [0, 8], B = [0, 0], Cc = [10, 0], D = [10, 8], E = [10, 3], F = [6, 0];
  const out = [];
  // 原来的 △ADE（虚线）
  out.push(poly([R(A), R(D), R(E)], { color: C.soft, w: 1.2, dash: '5 4' }));
  // 矩形剩下的部分
  out.push(polyline([R(D), R(A), R(B), R(Cc), R(E)], { color: C.ink, w: 2 }));
  // 折过去的三角形：顶点从 D 移到 F
  if (solve) out.push(poly([R(A), R(F), R(E)], { fill: C.emphFill, color: C.emph, w: 2 }));
  else {
    const kt = '0;0.3;0.5;0.8;1', dur = 8;
    const vs = [F, F, D, D, F].map(v => pts([R(A), R(v), R(E)])).join(';');
    out.push(`<polygon points="${pts([R(A), R(F), R(E)])}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2" stroke-linejoin="round"><animate attributeName="points" values="${vs}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></polygon>`);
  }
  out.push(line(...R(A), ...R(E), { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(rightAngle(R(Cc), R(B), R(E), { size: 10 }));
  for (const p of [A, B, Cc, D, E, F]) out.push(dot(...R(p), C.ink, 3));
  out.push(text(R(A)[0] - 8, R(A)[1] - 4, 'A', { italic: true, anchor: 'end' }), text(R(B)[0] - 8, R(B)[1] + 14, 'B', { italic: true, anchor: 'end' }));
  out.push(text(R(Cc)[0] + 8, R(Cc)[1] + 14, 'C', { italic: true }), text(R(D)[0] + 8, R(D)[1] - 4, 'D', { italic: true }));
  out.push(text(R(E)[0] + 8, R(E)[1] + 5, 'E', { italic: true }), text(R(F)[0], R(F)[1] + 20, 'F', { italic: true, anchor: 'middle' }));
  // 长度
  const s = { color: C.soft, size: 12 };
  out.push(text(R([0, 4])[0] - 10, R([0, 4])[1] + 4, '8', { ...s, anchor: 'end' }), text(R([5, 8])[0], R([5, 8])[1] - 8, '10', { ...s, anchor: 'middle' }));
  if (solve) {
    out.push(text(R([3, 0])[0], R([3, 0])[1] + 18, '6', { ...s, anchor: 'middle' }), text(R([8, 0])[0], R([8, 0])[1] + 18, '4', { ...s, anchor: 'middle' }));
    out.push(text(R([10, 5.5])[0] + 8, R([10, 5.5])[1] + 5, 'x', { color: C.emph, italic: true }));
    out.push(text(R([10, 1.5])[0] + 8, R([10, 1.5])[1] + 5, '8 − ', { color: C.emph, size: 13 }) + text(R([10, 1.5])[0] + 29, R([10, 1.5])[1] + 5, 'x', { color: C.emph, italic: true }));
    out.push(text(R([8, 1.5])[0] - 8, R([8, 1.5])[1] - 2, 'x', { color: C.emph, italic: true, anchor: 'end' }));
    out.push(text(R([3, 4])[0] - 10, R([3, 4])[1] + 4, '10', { color: C.emph, size: 12, anchor: 'end' }));
  }
  return svg(340, 240, out.join('\n'));
}
files['modeling-fold.svg'] = fold(false);
files['modeling-fold-solve.svg'] = fold(true);

// ---------- 购买方案：W = 2000 − 10m ----------
{
  const ox = 60, oy = 200, um = 6, uw = 0.3, w0 = 1500;
  const X = m => ox + um * m, Y = w => oy - uw * (w - w0);
  const out = [];
  for (let m = 10; m <= 50; m += 10) out.push(line(X(m), oy, X(m), Y(2050), { color: C.grid, w: 1 }), text(X(m), oy + 16, String(m), { anchor: 'middle', color: C.soft, size: 11 }));
  for (let w = 1600; w <= 2000; w += 100) out.push(line(ox, Y(w), X(52), Y(w), { color: C.grid, w: 1 }));
  for (const w of [1600, 1800, 2000]) out.push(text(ox - 6, Y(w) + 4, String(w), { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(ox, oy, X(53), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(2080), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(53) + 8)},${oy} ${f(X(53))},${oy - 4} ${f(X(53))},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${ox},${f(Y(2080) - 8)} ${ox - 4},${f(Y(2080))} ${ox + 4},${f(Y(2080))}" fill="${C.axis}" stroke="none"/>`);
  // 纵轴的折断记号
  out.push(polyline([[ox, oy - 6], [ox - 5, oy - 10], [ox + 5, oy - 16], [ox, oy - 20]], { color: C.axis, w: 1.5 }));
  out.push(text(X(53) + 4, oy + 18, 'm', { italic: true, color: C.soft }), text(ox + 8, Y(2080) - 2, 'W', { italic: true, color: C.soft }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), Y(2000), X(50), Y(1500), { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(line(X(20), Y(1800), X(33), Y(1670), { color: C.blue, w: 2.5 }));
  for (let m = 20; m <= 33; m++) out.push(dot(X(m), Y(2000 - 10 * m), C.blue, 2.5));
  for (const m of [20, 33]) out.push(line(X(m), Y(2000 - 10 * m), X(m), oy, { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(ox, Y(1670), X(33), Y(1670), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(text(X(33), oy + 16, '33', { anchor: 'middle', color: C.emph, size: 11 }), text(ox - 6, Y(1670) + 4, '1670', { anchor: 'end', color: C.emph, size: 11 }));
  out.push(dot(X(33), Y(1670), C.emph, 5));
  out.push(text(X(8), Y(1920) - 8, 'W = 2000 − 10m', { color: C.soft, size: 12 }));
  files['modeling-plan.svg'] = svg(400, 240, out.join('\n'));
}

// ---------- 抛物线形拱桥 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 40, u: 40, xmin: -3.8, xmax: 3.8, ymin: -4, ymax: 0.6, ticks: false });
  const out = [body];
  const g = x => -(x * x) / 2, r6 = Math.sqrt(6);
  out.push(plot(g, -2.8, 2.8, X, Y, { color: C.ink, w: 2.5 }));
  out.push(line(X(-3.6), Y(-2), X(3.6), Y(-2), { color: C.blue, w: 2 }));
  out.push(line(X(-3.6), Y(-3), X(3.6), Y(-3), { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(dot(X(-2), Y(-2)), dot(X(2), Y(-2)), dot(X(-r6), Y(-3), C.emph), dot(X(r6), Y(-3), C.emph));
  out.push(text(X(-2) - 6, Y(-2) - 8, 'A', { italic: true, anchor: 'end' }), text(X(2) + 6, Y(-2) - 8, 'B(2, −2)', { size: 13 }));
  out.push(text(X(-r6) - 8, Y(-3) - 6, 'C', { italic: true, anchor: 'end', color: C.emph }), text(X(r6) + 8, Y(-3) - 6, 'D', { italic: true, color: C.emph }));
  // 尺寸：水面宽 4 m，拱顶到水面 2 m，水面下降 1 m
  out.push(line(X(-2), Y(-2) + 14, X(2), Y(-2) + 14, { color: C.soft, w: 1 }), text(X(0.9), Y(-2) + 28, '4 m', { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(text(X(0) - 8, Y(-1) + 4, '2 m', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(X(3.3), Y(-2.5) + 4, '1 m', { anchor: 'middle', color: C.soft, size: 12 }), line(X(3.05), Y(-2), X(3.05), Y(-3), { color: C.soft, w: 1 }));
  files['modeling-arch.svg'] = svg(360, 220, out.join('\n'));
}

// ---------- 例 3 想一想：以水面左端 A 为原点 ----------
{
  const { X, Y, body } = axes({ ox: 80, oy: 120, u: 40, xmin: -1.6, xmax: 6, ymin: -1.8, ymax: 2.8, ticks: false });
  const out = [body.replace(/<text[^>]*>O<\/text>/, '')]; // 原点就是 A，不再标 O
  const g = x => -((x - 2) ** 2) / 2 + 2, r6 = Math.sqrt(6);
  out.push(plot(g, 2 - 2.8, 2 + 2.8, X, Y, { color: C.ink, w: 2.5 }));
  out.push(line(X(-1.4), Y(-1), X(5.8), Y(-1), { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(line(X(2), Y(2), X(2), Y(-1.6), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(dot(X(0), Y(0)), dot(X(4), Y(0)), dot(X(2), Y(2)), dot(X(2 - r6), Y(-1), C.emph), dot(X(2 + r6), Y(-1), C.emph));
  out.push(text(X(0) - 10, Y(0) - 8, 'A', { italic: true, anchor: 'end' }), text(X(4) + 8, Y(0) - 8, 'B(4, 0)', { size: 13 }), text(X(2) + 10, Y(2) - 6, '(2, 2)', { size: 13 }));
  out.push(text(X(2 - r6) - 8, Y(-1) - 6, 'C', { italic: true, anchor: 'end', color: C.emph }), text(X(2 + r6) + 8, Y(-1) - 6, 'D', { italic: true, color: C.emph }));
  out.push(text(X(5.8), Y(-1) + 18, 'y = −1', { anchor: 'end', color: C.blue, size: 12 }));
  files['modeling-arch-shift.svg'] = svg(360, 220, out.join('\n'));
}

export default files;
