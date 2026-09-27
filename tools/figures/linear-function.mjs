// 第七部分“一次函数”的图。
import { C, f, svg, text, line, dot, poly, axes } from './lib.mjs';

const files = {};
// ---------- 一次函数：台阶 ----------
{
  const k = 0.5, b = 1;
  const { X, Y, body } = axes({ ox: 40, oy: 210, u: 56, xmin: -0.4, xmax: 4.6, ymin: -0.3, ymax: 3.4 });
  const out = [body];
  const dur = 10;
  // 直线：最后出现
  out.push(`<g>${line(X(-0.3), Y(b - 0.3 * k), X(4.4), Y(b + 4.4 * k), { color: C.blue, w: 2.5 })}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.6;0.7;1" dur="${dur}s" repeatCount="indefinite"/></g>`);
  for (let i = 0; i < 4; i++) {
    const x0 = X(i), y0 = Y(b + i * k), x1 = X(i + 1), y1 = Y(b + (i + 1) * k);
    const t0 = 0.05 + i * 0.12, t1 = t0 + 0.08;
    const g = [
      poly([[x0, y0], [x1, y0], [x1, y1]], { fill: C.emphFill, color: 'none', w: 0 }),
      line(x0, y0, x1, y0, { color: C.ink, w: 1.5, dash: '4 3' }),
      line(x1, y0, x1, y1, { color: C.emph, w: 2.5 }),
    ];
    if (i === 0) g.push(text((x0 + x1) / 2, y0 + 17, '1', { anchor: 'middle' }), text(x1 + 6, (y0 + y1) / 2 + 5, 'k', { italic: true, color: C.emph }));
    out.push(`<g>${g.join('')}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${f(t0)};${f(t1)};1" dur="${dur}s" repeatCount="indefinite"/></g>`);
  }
  for (let i = 0; i <= 4; i++) out.push(dot(X(i), Y(b + i * k), C.ink));
  out.push(text(X(4.4) - 4, Y(b + 4.4 * k) - 10, 'y = 0.5x + 1', { anchor: 'end', color: C.blue }));
  files['linear-steps.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 一次函数：k 的作用 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 190, u: 28, xmin: -6, xmax: 6, ymin: -5.5, ymax: 6 });
  const out = [body];
  const cx = X(0), cy = Y(1), L = 130;
  const ks = [1 / 3, 1, 3, -3, -1, -1 / 3];
  const lab = { [1 / 3]: 'k = 1/3', 1: 'k = 1', 3: 'k = 3', [-3]: 'k = −3', [-1]: 'k = −1', [-1 / 3]: 'k = −1/3' };
  for (const k of ks) {
    const a = Math.atan(k), dx = L * Math.cos(a), dy = L * Math.sin(a);
    const col = k > 0 ? C.blue : C.emph;
    out.push(line(cx - dx, cy + dy, cx + dx, cy - dy, { color: col, w: 1.2, dash: '5 4', extra: ' opacity="0.55"' }));
    const ex = k > 0 ? cx + dx : cx - dx, ey = k > 0 ? cy - dy : cy + dy;
    const tx = k > 0 ? ex + 4 : ex - 4, ty = k > 0 ? ey - 4 : ey - 4;
    // 标签放在直线上方的那一端
    const [lx, ly] = k > 0 ? [cx + dx + 4, cy - dy - 4] : [cx - dx - 4, cy + dy - 4];
    const upper = k > 0 ? [cx + dx, cy - dy] : [cx - dx, cy + dy];
    const top = upper[1] < cy ? upper : (k > 0 ? [cx - dx, cy + dy] : [cx + dx, cy - dy]);
    const right = top[0] >= cx;
    out.push(text(top[0] + (right ? 4 : -4), top[1] - 5, lab[k], { anchor: right ? 'start' : 'end', color: col, size: 12 }));
  }
  // 高亮直线：依次切换到各个 k（离散切换，每个停 1.5 秒）
  const angles = ks.map(k => f(-Math.atan(k) * 180 / Math.PI));
  const cols = ks.map(k => (k > 0 ? C.blue : C.emph));
  out.push(`<g transform="rotate(${angles[1]} ${f(cx)} ${f(cy)})">${line(cx - L, cy, cx + L, cy, { color: C.blue, w: 3, extra: '' }).replace('/>', `><animate attributeName="stroke" values="${cols.join(';')}" dur="${ks.length * 1.5}s" calcMode="discrete" repeatCount="indefinite"/></line>`)}<animateTransform attributeName="transform" type="rotate" values="${angles.map(a => `${a} ${f(cx)} ${f(cy)}`).join(';')}" dur="${ks.length * 1.5}s" calcMode="discrete" repeatCount="indefinite"/></g>`);
  out.push(dot(cx, cy, C.ink));
  out.push(text(cx + 8, cy + 16, '(0, 1)', { size: 12 }));
  files['linear-k.svg'] = svg(360, 370, out.join('\n'));
}

// ---------- 一次函数：b 的作用 ----------
{
  const { X, Y, body } = axes({ ox: 170, oy: 180, u: 28, xmin: -5, xmax: 5, ymin: -5, ymax: 5.5 });
  const out = [body];
  const seg = b => line(X(-4 - Math.min(b, 0)), Y(-4 - Math.min(b, 0) + b), X(4 - Math.max(b, 0)), Y(4 - Math.max(b, 0) + b), { color: C.soft, w: 1.2, dash: '5 4' });
  for (const b of [2, -2]) {
    out.push(seg(b), dot(X(0), Y(b), C.soft, 3));
    out.push(text(X(4 - Math.max(b, 0)) + 4, Y(4 - Math.max(b, 0) + b) + 4, `b = ${b < 0 ? '−' + -b : b}`, { color: C.soft, size: 12 }));
  }
  // y = x 用实线留在原处作参照；上下平移的是虚线副本
  out.push(line(X(-4), Y(-4), X(4), Y(4), { color: C.emph, w: 3 }), dot(X(0), Y(0), C.emph));
  out.push(`<g>${line(X(-4), Y(-4), X(4), Y(4), { color: C.emph, w: 2.5, dash: '7 5' })}${dot(X(0), Y(0), C.emph)}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 ${-2 * 28};0 ${-2 * 28};0 0;0 0;0 ${2 * 28};0 ${2 * 28};0 0" keyTimes="0;0.1;0.25;0.4;0.5;0.6;0.75;0.9;1" dur="8s" repeatCount="indefinite"/></g>`);
  out.push(text(X(4) + 4, Y(4) + 4, 'y = x', { color: C.emph, size: 12 }));
  files['linear-b.svg'] = svg(340, 360, out.join('\n'));
}

// ---------- 一次函数与方程、不等式 ----------
{
  const { X, Y, body } = axes({ ox: 90, oy: 170, u: 30, xmin: -2.5, xmax: 6.5, ymin: -5, ymax: 4.5 });
  const out = [body];
  // y > 0 的部分（x > 2）加粗
  out.push(line(X(0.5), Y(-3), X(2), Y(0), { color: C.blue, w: 2.5 }));
  out.push(line(X(2), Y(0), X(4.2), Y(4.4), { color: C.emph, w: 3.5 }));
  out.push(line(X(2), Y(0), X(6.3), Y(0), { color: C.emph, w: 5, extra: ' opacity="0.45"' }));
  out.push(dot(X(2), Y(0), C.emph, 5));
  out.push(text(X(2) - 8, Y(0) - 8, '(2, 0)', { anchor: 'end', color: C.emph, size: 12 }));
  out.push(text(X(4.2) + 6, Y(4.2) + 6, 'y = 2x − 4', { color: C.blue, size: 13 }));
  out.push(text(X(4.3), Y(0) - 10, 'x > 2', { color: C.emph, size: 13 }));
  files['linear-inequality.svg'] = svg(330, 330, out.join('\n'));
}

{
  const { X, Y, body } = axes({ ox: 100, oy: 220, u: 32, xmin: -2.5, xmax: 5.5, ymin: -1.8, ymax: 5.5 });
  const out = [body];
  out.push(line(X(-2.5), Y(-1.5), X(4), Y(5), { color: C.blue, w: 2.5 }));
  out.push(line(X(-1.5), Y(4.5), X(4.8), Y(-1.8), { color: C.emph, w: 2.5 }));
  out.push(line(X(1), Y(2), X(1), Y(0), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(line(X(1), Y(2), X(0), Y(2), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(dot(X(1), Y(2), C.ink, 5));
  out.push(text(X(1) + 10, Y(2) + 4, '(1, 2)'));
  out.push(text(X(4) - 6, Y(5) + 2, 'y = x + 1', { anchor: 'end', color: C.blue, size: 13 }));
  out.push(text(X(3.9) - 6, Y(-1.5) + 4, 'y = −x + 3', { anchor: 'end', color: C.emph, size: 13 }));
  files['linear-system.svg'] = svg(340, 300, out.join('\n'));
}

// ---------- 套餐比较 ----------
{
  const ox = 60, oy = 250, sx = 0.65, sy = 2;
  const X = x => ox + sx * x, Y = y => oy - sy * y;
  const out = [];
  for (let x = 100; x <= 400; x += 100) out.push(line(X(x), Y(0), X(x), Y(105), { color: C.grid, w: 1 }), text(X(x), oy + 18, x, { anchor: 'middle', color: C.soft, size: 11 }));
  for (let y = 25; y <= 100; y += 25) out.push(line(X(0), Y(y), X(420), Y(y), { color: C.grid, w: 1 }), text(ox - 6, Y(y) + 4, y, { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), oy, X(425), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(110), { color: C.axis, w: 1.5 }));
  out.push(text(X(425), oy + 36, '通话时间 x（分钟）', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(ox + 6, Y(110) - 4, '月费 y（元）', { color: C.soft, size: 12 }));
  out.push(text(ox - 6, oy + 16, '0', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(line(X(0), Y(30), X(400), Y(70), { color: C.blue, w: 2.5 }));
  out.push(line(X(0), Y(0), X(400), Y(100), { color: C.emph, w: 2.5 }));
  out.push(line(X(200), Y(50), X(200), Y(0), { color: C.soft, w: 1, dash: '4 3' }));
  out.push(dot(X(200), Y(50), C.ink, 5));
  out.push(text(X(200) + 8, Y(50) + 18, '(200, 50)', { size: 12 }));
  out.push(text(X(400) + 6, Y(70) + 4, 'A', { color: C.blue }));
  out.push(text(X(400) + 6, Y(100) + 4, 'B', { color: C.emph }));
  files['linear-plans.svg'] = svg(380, 300, out.join('\n'));
}

// ---------- y = −2x + 3 经过哪几个象限 ----------
{
  const { X, Y, body } = axes({ ox: 140, oy: 160, u: 28, xmin: -4, xmax: 5.5, ymin: -3.5, ymax: 5.2 });
  const out = [body];
  const q = (x, y, s, on) => text(X(x), Y(y), s, { anchor: 'middle', size: 13, color: on ? C.blue : C.soft });
  out.push(q(3, 3.8, '第一象限', true), q(-2.4, 3.8, '第二象限', true), q(-2.4, -2.4, '第三象限', false), q(4, -1.4, '第四象限', true));
  out.push(line(X(-1), Y(5), X(3.25), Y(-3.5), { color: C.emph, w: 2.5 }));
  out.push(dot(X(0), Y(3), C.emph, 4.5), dot(X(1.5), Y(0), C.emph, 4.5));
  out.push(text(X(0) + 8, Y(3) - 4, '(0, 3)', { size: 12 }), text(X(1.5) + 6, Y(0) - 8, '(1.5, 0)', { size: 12 }));
  out.push(text(X(3.05), Y(-2.5), 'y = −2x + 3', { color: C.emph, size: 13 }));
  files['linear-function-quadrants.svg'] = svg(340, 280, out.join('\n'));
}

export default files;
