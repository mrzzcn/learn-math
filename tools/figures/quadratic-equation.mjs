// 第四部分“一元二次方程”的图。
import { C, f, svg, text, line, dot, axes, plot } from './lib.mjs';

const files = {};
const rect = (x, y, w, h, o = {}) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

// ---------- 配方：x² + 6x 补上一个角，配成正方形 ----------
{
  const s = 130, w = 45, X0 = 40, Y0 = 40;
  const out = [];
  // x²
  out.push(rect(X0, Y0, s, s, { fill: C.blueFill, color: C.blue }), text(X0 + s / 2, Y0 + s / 2 + 6, 'x²', { anchor: 'middle', italic: true, color: C.blue, size: 18 }));
  // 右边的一条 3x
  out.push(rect(X0 + s, Y0, w, s), text(X0 + s + w / 2, Y0 + s / 2 + 5, '3x', { anchor: 'middle', size: 15 }));
  // 另一条 3x：原来接在右边，转到下边（静态画结果）
  const tgt = [X0, Y0 + s, s, w];                      // 目标位置 x, y, 宽, 高
  const c = [X0 + s / 2, Y0 + s + w / 2], c2 = [X0 + s + w + w / 2, Y0 + s / 2];
  // 顺时针转 90°：R(v) = (−v_y, v_x)。解 c2 = P + R(c − P)，即 (I − R)P = c2 − R c
  const Rc = [-c[1], c[0]], r = [c2[0] - Rc[0], c2[1] - Rc[1]];
  // I − R = [[1, 1], [−1, 1]]，逆矩阵 = 1/2 [[1, −1], [1, 1]]
  const P = [(r[0] - r[1]) / 2, (r[0] + r[1]) / 2];
  const piv = `${f(P[0])} ${f(P[1])}`;
  const kt = '0;0.15;0.45;0.9;1';
  out.push(`<g>${rect(...tgt)}${text(c[0], c[1] + 5, '3x', { anchor: 'middle', size: 15 })}<animateTransform attributeName="transform" type="rotate" values="90 ${piv};90 ${piv};0 ${piv};0 ${piv};90 ${piv}" keyTimes="${kt}" dur="8s" repeatCount="indefinite"/></g>`);
  // 缺的角 3 × 3 = 9
  out.push(`<g>${rect(X0 + s, Y0 + s, w, w, { fill: C.emphFill, color: C.emph, dash: '5 3', w: 2 })}${text(X0 + s + w / 2, Y0 + s + w / 2 + 5, '9', { anchor: 'middle', color: C.emph, size: 15 })}<animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.15;0.45;0.55;0.9;1" dur="8s" repeatCount="indefinite"/></g>`);
  // 边长标注
  out.push(text(X0 + s / 2, Y0 - 10, 'x', { anchor: 'middle', italic: true }), text(X0 + s + w / 2, Y0 - 10, '3', { anchor: 'middle' }));
  out.push(text(X0 - 10, Y0 + s / 2 + 5, 'x', { anchor: 'end', italic: true }), text(X0 - 10, Y0 + s + w / 2 + 5, '3', { anchor: 'end' }));
  files['quadratic-equation-square.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 判别式：抛物线和 x 轴的交点个数 ----------
{
  const { X, Y, body } = axes({ ox: 110, oy: 190, u: 34, xmin: -2.4, xmax: 4.6, ymin: -4.5, ymax: 5.3 });
  const out = [body];
  const cases = [
    { c: -3, col: C.blue, lab: 'c = −3，Δ > 0', roots: [-1, 3] },
    { c: 1, col: C.emph, lab: 'c = 1，Δ = 0', roots: [1] },
    { c: 3, col: C.ink, lab: 'c = 3，Δ &lt; 0', roots: [] },
  ];
  for (const k of cases) {
    out.push(plot(x => x * x - 2 * x + k.c, -2.4, 4.4, X, Y, { color: k.col, w: 2.2, ymin: -4.5, ymax: 5.3 }));
    for (const r of k.roots) out.push(dot(X(r), Y(0), k.col, 5));
  }
  // 图例放在右边空白处：线条颜色对应 c 的取值
  cases.forEach((k, i) => {
    const yl = 40 + i * 26;
    out.push(line(292, yl - 5, 314, yl - 5, { color: k.col, w: 2.2 }), text(320, yl, k.lab, { color: k.col, size: 13 }));
  });
  files['quadratic-equation-discriminant.svg'] = svg(430, 370, out.join('\n'));
}

// ---------- 小路问题：把小路平移到边上 ----------
{
  const k = 9, W = 30 * k, H = 20 * k, x0 = 50, y0 = 40, p = 2 * k;
  const vx = 12 * k, hy = 8 * k;       // 小路原来的位置（竖路左边、横路上边到空地边缘的距离）
  const out = [];
  out.push(rect(x0, y0, W, H, { fill: C.blueFill, color: C.ink, w: 2 }));
  // 小路原来的位置：实线，固定不动，作参照
  out.push(rect(x0 + vx, y0, p, H, { fill: 'rgba(87,96,106,0.35)', color: C.soft }), rect(x0, y0 + hy, W, p, { fill: 'rgba(87,96,106,0.35)', color: C.soft }));
  // 剩下的部分拼成的长方形 (30 − x)(20 − x)：蓝色边框
  out.push(rect(x0, y0, W - p, H - p, { color: C.blue, w: 2 }));
  // 平移的虚线副本：竖路移到右边，横路移到下边。属性里的初始位置在边上，PDF 显示平移后的位置
  const kt = '0;0.15;0.45;0.9;1', dur = '8s';
  const mv = (dx, dy) => `<animateTransform attributeName="transform" type="translate" values="${dx} ${dy};${dx} ${dy};0 0;0 0;${dx} ${dy}" keyTimes="${kt}" dur="${dur}" repeatCount="indefinite"/>`;
  out.push(`<g>${rect(x0 + W - p, y0, p, H, { fill: 'rgba(87,96,106,0.15)', color: C.ink, dash: '5 3' })}${mv(-(W - p - vx), 0)}</g>`);
  out.push(`<g>${rect(x0, y0 + H - p, W, p, { fill: 'rgba(87,96,106,0.15)', color: C.ink, dash: '5 3' })}${mv(0, -(H - p - hy))}</g>`);
  // 标注
  out.push(text(x0 + W / 2, y0 - 10, '30 m', { anchor: 'middle', color: C.soft, size: 13 }), text(x0 - 8, y0 + H / 2 + 5, '20 m', { anchor: 'end', color: C.soft, size: 13 }));
  out.push(text(x0 + (vx + p + W - p) / 2, y0 + (hy + p + H - p) / 2 - 4, '剩下的空地', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text(x0 + (vx + p + W - p) / 2, y0 + (hy + p + H - p) / 2 + 16, '(30 − x)(20 − x)', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text(x0 + W - p / 2, y0 + H + 18, 'x', { anchor: 'middle', italic: true }), text(x0 + W + 8, y0 + H - p / 2 + 5, 'x', { italic: true }));
  files['quadratic-equation-paths.svg'] = svg(360, 250, out.join('\n'));
}

// ---------- 黄金分割 ----------
{
  const out = [];
  const x0 = 30, L = 300, y = 60, g = (Math.sqrt(5) - 1) / 2;
  const A = x0, Cx = x0 + L * g, B = x0 + L;
  out.push(line(A, y, Cx, y, { color: C.emph, w: 3 }), line(Cx, y, B, y, { color: C.blue, w: 3 }));
  out.push(dot(A, y), dot(Cx, y), dot(B, y));
  out.push(text(A, y + 22, 'A', { anchor: 'middle', italic: true }), text(Cx, y + 22, 'C', { anchor: 'middle', italic: true }), text(B, y + 22, 'B', { anchor: 'middle', italic: true }));
  out.push(text((A + Cx) / 2, y - 10, 'x', { anchor: 'middle', italic: true, color: C.emph }), text((Cx + B) / 2, y - 10, '1 − x', { anchor: 'middle', color: C.blue }));
  // AB = 1
  out.push(line(A, y + 36, (A + B) / 2 - 20, y + 36, { color: C.soft, w: 1 }), line((A + B) / 2 + 20, y + 36, B, y + 36, { color: C.soft, w: 1 }));
  out.push(line(A, y + 30, A, y + 42, { color: C.soft, w: 1 }), line(B, y + 30, B, y + 42, { color: C.soft, w: 1 }));
  out.push(text((A + B) / 2, y + 41, '1', { anchor: 'middle', color: C.soft }));
  files['quadratic-equation-golden.svg'] = svg(360, 115, out.join('\n'));
}

export default files;
