// 第四部分“分式方程”的图。
import { C, f, svg, text, line } from './lib.mjs';

const files = {};

const arrow = (a, b, o = {}) => {
  const col = o.color || C.soft, l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [-u[1], u[0]];
  const base = [b[0] - 9 * u[0], b[1] - 9 * u[1]];
  return line(a[0], a[1], base[0], base[1], { color: col, w: 1.5 }) +
    `<polygon points="${f(b[0])},${f(b[1])} ${f(base[0] + 4 * n[0])},${f(base[1] + 4 * n[1])} ${f(base[0] - 4 * n[0])},${f(base[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`;
};
const box = (cx, cy, s, o = {}) => {
  const w = o.w || s.length * 14 + 24, h = 32, col = o.color || C.ink;
  return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${h}" rx="6" fill="${o.fill || 'none'}" stroke="${col}" stroke-width="1.5"/>` +
    text(cx, cy + 5, s, { anchor: 'middle', color: col });
};

// ---------- 解分式方程的流程 ----------
{
  const out = [];
  const cx = 230, ys = [28, 98, 168];
  out.push(box(cx, ys[0], '分式方程'), box(cx, ys[1], '整式方程'), box(cx, ys[2], '整式方程的解 x = a'));
  out.push(arrow([cx, ys[0] + 16], [cx, ys[1] - 16]), text(cx + 12, (ys[0] + ys[1]) / 2 + 4, '两边乘最简公分母', { color: C.soft, size: 13 }));
  out.push(arrow([cx, ys[1] + 16], [cx, ys[2] - 16]), text(cx + 12, (ys[1] + ys[2]) / 2 + 4, '解整式方程', { color: C.soft, size: 13 }));
  const yb = 270;
  out.push(text(cx, ys[2] + 42, '检验：x = a 时最简公分母等于 0 吗？', { anchor: 'middle', color: C.ink, size: 13 }));
  out.push(arrow([cx - 20, ys[2] + 50], [120, yb - 16], { color: C.blue }), arrow([cx + 20, ys[2] + 50], [340, yb - 16], { color: C.emph }));
  out.push(text(150, ys[2] + 70, '不等于 0', { anchor: 'end', color: C.blue, size: 12 }), text(310, ys[2] + 70, '等于 0', { color: C.emph, size: 12 }));
  out.push(box(120, yb, '是原方程的解', { color: C.blue, fill: C.blueFill }), box(340, yb, '是增根，舍去', { color: C.emph, fill: C.emphFill }));
  files['fractional-equation-steps.svg'] = svg(460, 295, out.join('\n'));
}

// ---------- 工程问题：把全部工作量看成 1 ----------
{
  const out = [];
  const x0 = 30, W = 400, y = 60, h = 34;
  const a = W * 12 / 30;
  out.push(`<rect x="${x0}" y="${y}" width="${f(a)}" height="${h}" fill="${C.blueFill}" stroke="${C.blue}" stroke-width="1.5"/>`);
  out.push(`<rect x="${f(x0 + a)}" y="${y}" width="${f(W - a)}" height="${h}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="1.5"/>`);
  // 每一格是甲队 1 天的工作量 1/30
  for (let i = 1; i < 12; i++) out.push(line(x0 + (W / 30) * i, y, x0 + (W / 30) * i, y + h, { color: C.blue, w: 0.6 }));
  out.push(text(x0 + a / 2, y + h + 22, '甲队 12 天', { anchor: 'middle', color: C.blue, size: 13 }), text(x0 + a / 2, y + h + 40, '12 × 1/30 = 2/5', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text(x0 + a + (W - a) / 2, y + h + 22, '乙队 12 天', { anchor: 'middle', color: C.emph, size: 13 }), text(x0 + a + (W - a) / 2, y + h + 40, '12 × 1/x', { anchor: 'middle', color: C.emph, size: 13 }));
  // 上方总量
  out.push(line(x0, y - 14, x0 + W / 2 - 50, y - 14, { color: C.soft, w: 1 }), line(x0 + W / 2 + 50, y - 14, x0 + W, y - 14, { color: C.soft, w: 1 }));
  out.push(line(x0, y - 20, x0, y - 8, { color: C.soft, w: 1 }), line(x0 + W, y - 20, x0 + W, y - 8, { color: C.soft, w: 1 }));
  out.push(text(x0 + W / 2, y - 9, '全部工程：1', { anchor: 'middle', color: C.soft, size: 13 }));
  files['fractional-equation-work.svg'] = svg(460, 150, out.join('\n'));
}

export default files;
