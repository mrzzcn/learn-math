// 第四部分总览“从等式到方程”的图。
import { C, f, svg, text, line } from './lib.mjs';

const files = {};

// 带箭头的线段：从 a 指向 b
const arrow = (a, b, o = {}) => {
  const col = o.color || C.soft, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-u[1], u[0]];
  const tip = b, base = [b[0] - 9 * u[0], b[1] - 9 * u[1]];
  return line(a[0], a[1], base[0], base[1], { color: col, w: o.w || 1.5, dash: o.dash }) +
    `<polygon points="${f(tip[0])},${f(tip[1])} ${f(base[0] + 4 * n[0])},${f(base[1] + 4 * n[1])} ${f(base[0] - 4 * n[0])},${f(base[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`;
};

// 方框：中心 (cx, cy)，文字 s
const box = (cx, cy, s, o = {}) => {
  const w = o.w || s.length * 14 + 24, h = 34, col = o.color || C.ink;
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${h}" rx="6" fill="${o.fill || 'none'}" stroke="${col}" stroke-width="${o.sw || 1.5}"/>` +
    text(cx, cy + 5, s, { anchor: 'middle', color: col });
};

// ---------- 各类方程都化归为一元一次方程 ----------
{
  const out = [];
  const top = 40, mid = 150, bot = 245;
  const xs = [80, 230, 380];
  const names = ['二元一次方程组', '分式方程', '一元二次方程'];
  const ops = ['消元', '去分母', '降次'];
  names.forEach((s, i) => out.push(box(xs[i], top, s, { w: 124 })));
  const center = [230, mid];
  out.push(box(center[0], center[1], '一元一次方程', { color: C.emph, fill: C.emphFill, w: 124, sw: 2 }));
  xs.forEach((x, i) => {
    const a = [x, top + 17], b = [center[0] + (x - center[0]) * 0.28, mid - 17];
    out.push(arrow(a, b, { color: C.blue }));
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    out.push(text(m[0] + (i === 0 ? -8 : i === 2 ? 8 : 8), m[1] + 4, ops[i], { anchor: i === 0 ? 'end' : 'start', color: C.blue, size: 13 }));
  });
  // 不等式：类比
  out.push(box(420, mid, '不等式（组）', { w: 110 }));
  out.push(arrow([365, mid], [293, mid], { color: C.soft, dash: '5 4' }), arrow([293, mid], [365, mid], { color: C.soft, dash: '5 4' }));
  out.push(text(329, mid - 8, '类比', { anchor: 'middle', color: C.soft, size: 12 }));
  // 最终结果
  out.push(box(center[0], bot, 'x = a', { w: 90 }));
  out.push(arrow([center[0], mid + 17], [center[0], bot - 17], { color: C.emph }));
  out.push(text(center[0] + 10, (mid + bot) / 2 + 4, '等式的性质', { color: C.emph, size: 13 }));
  out.push(box(420, bot, 'x > a', { w: 90 }));
  out.push(arrow([420, mid + 17], [420, bot - 17], { color: C.soft }));
  out.push(text(410, (mid + bot) / 2 + 4, '不等式的性质', { anchor: 'end', color: C.soft, size: 13 }));
  files['4-equation-index.svg'] = svg(480, 275, out.join('\n'));
}

export default files;
