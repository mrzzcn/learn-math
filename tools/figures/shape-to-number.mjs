// 第十一部分“以形助数”的图。
import { C, f, svg, text, line, dot, poly, circle, axes, plot, label } from './lib.mjs';

const files = {};
const openDot = (x, y, color = C.ink, r = 4.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#fff" stroke="${color}" stroke-width="2"/>`;
const minus = v => (v < 0 ? '−' + -v : String(v));

// 数轴：原点像素 ox，单位 u，从 a 到 b
function numberLine(ox, oy, u, a, b) {
  const X = x => ox + u * x, out = [];
  out.push(line(X(a) - 10, oy, X(b) + 10, oy, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(b) + 18)},${oy} ${f(X(b) + 10)},${oy - 4} ${f(X(b) + 10)},${oy + 4}" fill="${C.axis}" stroke="none"/>`);
  for (let x = a; x <= b; x++) {
    out.push(line(X(x), oy - 4, X(x), oy + 4, { color: C.axis, w: 1.5 }));
    out.push(text(X(x), oy + 20, minus(x), { anchor: 'middle', color: C.soft, size: 12 }));
  }
  return { X, body: out.join('\n') };
}

// ---------- 绝对值是距离：PA + PB ----------
{
  const oy = 110;
  const { X, body } = numberLine(190, oy, 42, -4, 4);
  const out = [body];
  const A = -2, B = 1;
  // P 的运动：0 → 2 → 停 → −3 → 停 → 0
  const ts = [0, 2, 2, -3, -3, 0], kt = '0;0.2;0.35;0.65;0.8;1', dur = 12;
  const xs = ts.map(t => f(X(t))).join(';');
  const anim = attr => `<animate attributeName="${attr}" values="${xs}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  // PA、PB 两段（画在数轴上方，高度不同）
  out.push(`<line x1="${f(X(0))}" y1="${oy - 22}" x2="${f(X(A))}" y2="${oy - 22}" stroke="${C.blue}" stroke-width="3">${anim('x1')}</line>`);
  out.push(`<line x1="${f(X(0))}" y1="${oy - 36}" x2="${f(X(B))}" y2="${oy - 36}" stroke="${C.emph}" stroke-width="3">${anim('x1')}</line>`);
  out.push(`<line x1="${f(X(0))}" y1="${oy - 44}" x2="${f(X(0))}" y2="${oy}" stroke="${C.soft}" stroke-width="1" stroke-dasharray="3 3">${anim('x1')}${anim('x2')}</line>`);
  out.push(text(X(A) - 8, oy - 18, 'PA', { anchor: 'end', color: C.blue, size: 13, italic: true }));
  out.push(text(X(B) + 8, oy - 32, 'PB', { color: C.emph, size: 13, italic: true }));
  out.push(dot(X(A), oy, C.ink, 5), dot(X(B), oy, C.ink, 5));
  out.push(label([X(A), oy], 'A', 0, 40), label([X(B), oy], 'B', 0, 40));
  out.push(`<circle cx="${f(X(0))}" cy="${oy}" r="5" fill="${C.emph}" stroke="none">${anim('cx')}</circle>`);
  out.push(`<text x="${f(X(0))}" y="${oy - 50}" fill="${C.emph}" stroke="none" text-anchor="middle" font-style="italic">P${anim('x')}</text>`);
  files['shape-to-number-abs.svg'] = svg(420, 170, out.join('\n'));
}

// ---------- 不等式组恰有两个整数解 ----------
{
  const oy = 90;
  const { X, body } = numberLine(110, oy, 50, -2, 4);
  const out = [body];
  // x < 3：从 3 向左
  out.push(line(X(3), oy - 30, X(-2.2), oy - 30, { color: C.blue, w: 2 }), line(X(3), oy - 30, X(3), oy, { color: C.blue, w: 1.5 }));
  out.push(`<polygon points="${f(X(-2.2) - 8)},${oy - 30} ${f(X(-2.2))},${oy - 34} ${f(X(-2.2))},${oy - 26}" fill="${C.blue}" stroke="none"/>`);
  out.push(openDot(X(3), oy, C.blue));
  out.push(text(X(3) + 8, oy - 34, 'x &lt; 3', { color: C.blue, size: 13 }));
  // x > a：a 在 0 和 1 之间
  const a = 0.45;
  out.push(line(X(a), oy - 16, X(3.6), oy - 16, { color: C.emph, w: 2 }), line(X(a), oy - 16, X(a), oy, { color: C.emph, w: 1.5 }));
  out.push(`<polygon points="${f(X(3.6) + 8)},${oy - 16} ${f(X(3.6))},${oy - 20} ${f(X(3.6))},${oy - 12}" fill="${C.emph}" stroke="none"/>`);
  out.push(openDot(X(a), oy, C.emph));
  out.push(text(X(a), oy + 20, 'a', { anchor: 'middle', color: C.emph, italic: true, size: 13 }));
  // 两个整数解
  out.push(dot(X(1), oy, C.ink, 6), dot(X(2), oy, C.ink, 6));
  // a 能落的范围：0 ≤ a < 1
  const y2 = oy + 40;
  out.push(line(X(0), y2, X(1), y2, { color: C.emph, w: 4, extra: ' opacity="0.6"' }), dot(X(0), y2, C.emph, 5), openDot(X(1), y2, C.emph));
  out.push(text(X(1) + 12, y2 + 5, 'a 的范围', { color: C.emph, size: 13 }));
  files['shape-to-number-integers.svg'] = svg(420, 150, out.join('\n'));
}

// ---------- 抛物线与水平线的交点个数 ----------
{
  const { X, Y, body } = axes({ ox: 100, oy: 185, u: 26, xmin: -2.8, xmax: 6, ymin: -5, ymax: 6.3, ticks: false });
  const out = [body];
  // 刻度数字：避开左边的虚线抛物线（x 轴的 −1、3 不标，y 轴的 −1、−2 标在右侧，−3、−4 由右端的 y = −3、y = −4 标出）
  for (const x of [-2, 1, 2, 4, 5]) out.push(text(X(x), Y(0) + 16, x < 0 ? '−' + -x : String(x), { anchor: 'middle', color: C.soft, size: 11 }));
  for (const y of [1, 2, 3, 4, 5, 6]) out.push(text(X(0) - 6, Y(y) + 4, String(y), { anchor: 'end', color: C.soft, size: 11 }));
  for (const y of [-1, -2]) out.push(text(X(0) + 6, Y(y) + 4, '−' + -y, { color: C.soft, size: 11 }));
  out.push(text(X(0) - 6, Y(-5) + 4, '−5', { anchor: 'end', color: C.soft, size: 11 }));
  const g = x => x * x - 2 * x - 3;
  out.push(plot(g, -1.6, 0, X, Y, { color: C.soft, w: 1.2, dash: '4 4' }));
  out.push(plot(g, 4, 4.3, X, Y, { color: C.soft, w: 1.2, dash: '4 4', ymax: 6.2 }));
  out.push(plot(g, 0, 4, X, Y, { color: C.blue, w: 2.5 }));
  for (const m of [-3, -4]) out.push(line(X(-2.8), Y(m), X(6), Y(m), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(text(X(6) + 4, Y(-3) + 4, 'y = −3', { color: C.soft, size: 12 }), text(X(6) + 4, Y(-4) + 4, 'y = −4', { color: C.soft, size: 12 }));
  out.push(dot(X(0), Y(-3), C.blue), dot(X(4), Y(5), C.blue), dot(X(1), Y(-4), C.blue));
  out.push(text(X(4) + 8, Y(5) + 4, '(4, 5)', { color: C.blue, size: 12 }), text(X(1) + 6, Y(-4) + 16, '(1, −4)', { color: C.blue, size: 12 }), text(X(0) + 6, Y(-3) - 6, '(0, −3)', { color: C.blue, size: 12 }));
  // 动线 y = m：从 −3.5 出发，升到 5.5，再降到 −4.6，回到 −3.5
  const ms = [];
  const push = (a, b, n) => { for (let i = 0; i < n; i++) ms.push(a + ((b - a) * i) / n); };
  push(-3.5, 5.5, 30); push(5.5, -4.6, 34); push(-4.6, -3.5, 4); ms.push(-3.5);
  const kt = ms.map((_, i) => f(i / (ms.length - 1) * 1000) / 1000).join(';');
  const dur = 16;
  const ys = ms.map(m => f(Y(m))).join(';');
  out.push(`<line x1="${f(X(-2.8))}" y1="${f(Y(-3.5))}" x2="${f(X(6))}" y2="${f(Y(-3.5))}" stroke="${C.emph}" stroke-width="2"><animate attributeName="y1" values="${ys}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="y2" values="${ys}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></line>`);
  out.push(`<text x="${f(X(-2.8) + 2)}" y="${f(Y(-3.5) - 6)}" fill="${C.emph}" stroke="none" font-style="italic" font-size="13">y = m<animate attributeName="y" values="${ms.map(m => f(Y(m) - 6)).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></text>`);
  // 在 0 ≤ x ≤ 4 上的交点
  const roots = m => { const d = 4 + m; if (d < 0) return [null, null]; const s = Math.sqrt(d); return [1 - s >= 0 ? 1 - s : null, 1 + s <= 4 ? 1 + s : null]; };
  for (const side of [0, 1]) {
    const pts = ms.map(m => roots(m)[side]);
    const cx = pts.map(x => f(X(x ?? 1))).join(';'), cy = ms.map(m => f(Y(m))).join(';');
    const op = pts.map(x => (x === null ? 0 : 1)).join(';');
    const x0 = roots(-3.5)[side];
    out.push(`<circle cx="${f(X(x0))}" cy="${f(Y(-3.5))}" r="5" fill="${C.emph}" stroke="none"><animate attributeName="cx" values="${cx}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="cy" values="${cy}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${op}" keyTimes="${kt}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/></circle>`);
  }
  files['shape-to-number-roots.svg'] = svg(380, 340, out.join('\n'));
}

// ---------- 直线与双曲线：比较函数值 ----------
{
  const { X, Y, body } = axes({ ox: 170, oy: 170, u: 34, xmin: -4.5, xmax: 4.5, ymin: -4.3, ymax: 4.5, ticks: false });
  const out = [body];
  // 刻度数字避开直线和双曲线：x 轴负半轴的数写在轴上方（−1 处直线穿过，不标），y 轴负半轴的数写在轴右侧（1 处直线穿过，不标）
  const sub = v => (v < 0 ? '−' + -v : String(v)), tk = { color: C.soft, size: 11 };
  for (const x of [-4, -3, -2]) out.push(text(X(x), Y(0) - 7, sub(x), { ...tk, anchor: 'middle' }));
  for (const x of [1, 2, 3, 4]) out.push(text(X(x), Y(0) + 16, sub(x), { ...tk, anchor: 'middle' }));
  for (const y of [2, 3, 4]) out.push(text(X(0) - 6, Y(y) + 4, sub(y), { ...tk, anchor: 'end' }));
  for (const y of [-1, -2, -3, -4]) out.push(text(X(0) + 6, Y(y) + 4, sub(y), tk));
  const h = x => 2 / x;
  // x 轴上的解集
  out.push(line(X(-2), Y(0), X(0), Y(0), { color: C.emph, w: 6, extra: ' opacity="0.35"' }));
  out.push(line(X(1), Y(0), X(4.5), Y(0), { color: C.emph, w: 6, extra: ' opacity="0.35"' }));
  out.push(plot(h, 0.44, 4.4, X, Y, { color: C.ink, w: 2 }), plot(h, -4.4, -0.44, X, Y, { color: C.ink, w: 2 }));
  // 直线：在双曲线上方的部分用强调色
  out.push(line(X(-4.5), Y(-3.5), X(-2), Y(-1), { color: C.blue, w: 2.5 }));
  out.push(line(X(-2), Y(-1), X(0), Y(1), { color: C.emph, w: 3 }));
  out.push(line(X(0), Y(1), X(1), Y(2), { color: C.blue, w: 2.5 }));
  out.push(line(X(1), Y(2), X(3.4), Y(4.4), { color: C.emph, w: 3 }));
  for (const x of [-2, 1]) out.push(line(X(x), Y(x + 1), X(x), Y(0), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(dot(X(1), Y(2)), dot(X(-2), Y(-1)));
  out.push(text(X(1) + 8, Y(2) + 14, 'A(1, 2)', { size: 12 }), text(X(-2.6), Y(-1.3), 'B(−2, −1)', { anchor: 'end', size: 12 }));
  out.push(text(X(3.4) + 2, Y(4.4) + 14, 'y = x + 1', { size: 12 }));
  out.push(text(X(4.4), Y(0.45) - 8, 'y = 2/x', { anchor: 'end', size: 12 }));
  files['shape-to-number-hyperbola.svg'] = svg(340, 330, out.join('\n'));
}

// ---------- 周长一定的长方形：(a + b)² = 4ab + (a − b)² ----------
{
  const u = 24, s = 10, x0 = 50, y0 = 40;
  const P = v => f(v * u);
  const as = [7, 7, 5, 5, 7], kt = '0;0.2;0.5;0.7;1', dur = 9;
  const va = fn => as.map(a => fn(a, s - a)).join(';');
  const an = (attr, fn) => `<animate attributeName="${attr}" values="${va(fn)}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  // 四个 a × b 长方形（风车排法），用 rect 的 x、y、width、height 做动画
  const rects = [
    { x: () => 0, y: () => 0, w: a => a, h: (a, b) => b },
    { x: a => a, y: () => 0, w: (a, b) => b, h: a => a },
    { x: (a, b) => b, y: a => a, w: a => a, h: (a, b) => b },
    { x: () => 0, y: (a, b) => b, w: (a, b) => b, h: a => a },
  ];
  const out = [];
  out.push(`<rect x="${x0}" y="${y0}" width="${P(s)}" height="${P(s)}" fill="${C.emphFill}" stroke="${C.ink}" stroke-width="2"/>`);
  for (const r of rects) {
    const a = 7, b = 3;
    out.push(`<rect x="${f(x0 + r.x(a, b) * u)}" y="${f(y0 + r.y(a, b) * u)}" width="${P(r.w(a, b))}" height="${P(r.h(a, b))}" fill="#dfe8f3" stroke="${C.blue}" stroke-width="1.5">${an('x', (a, b) => f(x0 + r.x(a, b) * u))}${an('y', (a, b) => f(y0 + r.y(a, b) * u))}${an('width', (a, b) => P(r.w(a, b)))}${an('height', (a, b) => P(r.h(a, b)))}</rect>`);
  }
  // 边上的 a、b
  const t = (s0, attr, fn, o) => `<text x="${o.x}" y="${o.y}" fill="${o.color || C.ink}" stroke="none" text-anchor="middle" font-style="italic">${s0}${an(attr, fn)}</text>`;
  out.push(t('a', 'x', a => f(x0 + (a / 2) * u), { x: f(x0 + 3.5 * u), y: y0 - 8 }));
  out.push(t('b', 'x', a => f(x0 + ((a + s) / 2) * u), { x: f(x0 + 8.5 * u), y: y0 - 8 }));
  out.push(t('b', 'y', (a, b) => f(y0 + (b / 2) * u + 5), { x: x0 - 14, y: f(y0 + 1.5 * u + 5) }));
  out.push(t('a', 'y', (a, b) => f(y0 + ((b + s) / 2) * u + 5), { x: x0 - 14, y: f(y0 + 6.5 * u + 5) }));
  out.push(`<text x="${f(x0 + 5 * u)}" y="${f(y0 + 5 * u + 5)}" fill="${C.emph}" stroke="none" text-anchor="middle" font-size="13">a − b<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></text>`);
  files['shape-to-number-square.svg'] = svg(320, 300, out.join('\n'));
}

// ---------- 两段距离之和最小：作对称点 ----------
{
  const { X, Y, body } = axes({ ox: 60, oy: 140, u: 50, xmin: -0.6, xmax: 5, ymin: -1.6, ymax: 2.6, ticks: false });
  const out = [body];
  // 刻度数字：x 轴的 1 靠近 P、5 靠近 x，不标；A、A′、B 已写出坐标
  for (const x of [2, 3, 4]) out.push(text(X(x), Y(0) + 16, String(x), { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(text(X(0) - 6, Y(2) + 4, '2', { anchor: 'end', color: C.soft, size: 11 }));
  const A = [0, 1], B = [4, 2], A2 = [0, -1], P0 = [4 / 3, 0];
  out.push(line(X(A2[0]), Y(A2[1]), X(B[0]), Y(B[1]), { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(line(X(A[0]), Y(A[1]), X(A2[0]), Y(A2[1]), { color: C.soft, w: 1, dash: '3 3' }));
  // 动点 P 和 PA、PB
  const ps = [4 / 3, 3.3, 3.3, 0.4, 0.4, 4 / 3], kt = '0;0.2;0.35;0.65;0.8;1', dur = 12;
  const an = (attr, vals) => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const px = ps.map(p => f(X(p))).join(';');
  out.push(`<line x1="${f(X(P0[0]))}" y1="${f(Y(0))}" x2="${f(X(A[0]))}" y2="${f(Y(A[1]))}" stroke="${C.blue}" stroke-width="2.5">${an('x1', px)}</line>`);
  out.push(`<line x1="${f(X(P0[0]))}" y1="${f(Y(0))}" x2="${f(X(B[0]))}" y2="${f(Y(B[1]))}" stroke="${C.emph}" stroke-width="2.5">${an('x1', px)}</line>`);
  out.push(`<circle cx="${f(X(P0[0]))}" cy="${f(Y(0))}" r="5" fill="${C.ink}" stroke="none">${an('cx', px)}</circle>`);
  out.push(`<text x="${f(X(P0[0]))}" y="${f(Y(0) - 12)}" fill="${C.ink}" stroke="none" text-anchor="middle" font-style="italic">P${an('x', px)}</text>`);
  out.push(dot(X(A[0]), Y(A[1])), dot(X(B[0]), Y(B[1])), dot(X(A2[0]), Y(A2[1]), C.soft));
  out.push(text(X(0) + 8, Y(1) - 6, 'A(0, 1)', { size: 12 }), text(X(4) + 8, Y(2) + 4, 'B(4, 2)', { size: 12 }), text(X(0) + 8, Y(-1) + 14, 'A′(0, −1)', { size: 12, color: C.soft }));
  files['shape-to-number-distance.svg'] = svg(340, 240, out.join('\n'));
}

export default files;
