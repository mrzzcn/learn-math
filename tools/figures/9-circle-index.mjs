// 第九部分“总览：圆的对称性”的图。
import { C, f, svg, text, line, seg, dot, circle, arc, rightAngle, tick, rad } from './lib.mjs';

const files = {};
const P = (O, r, d) => [O[0] + r * Math.cos(rad(d)), O[1] - r * Math.sin(rad(d))];
const lab = (p, s, dx, dy, o = {}) => text(p[0] + dx, p[1] + dy, s, { italic: true, anchor: 'middle', ...o });

// ---------- 圆的两种对称 ----------
{
  const r = 72, out = [];
  // 左：轴对称，沿任意一条直径所在直线翻折
  {
    const O = [115, 105], ax = 70; // 对称轴的方向角
    const L0 = P(O, r + 22, ax), L1 = P(O, r + 22, ax + 180);
    const Pp = P(O, r, 145), Q = P(O, r, 2 * ax - 145);
    const M = [(Pp[0] + Q[0]) / 2, (Pp[1] + Q[1]) / 2];
    out.push(circle(...O, r), seg(L0, L1, { color: C.blue, w: 1.8, dash: '7 4' }), seg(Pp, Q, { color: C.soft, w: 1.3, dash: '4 3' }));
    out.push(rightAngle(M, Q, L0, { size: 7 }), tick(Pp, M, 1), tick(M, Q, 1));
    out.push(dot(...O), dot(...Pp, C.emph), dot(...Q, C.emph), lab(O, 'O', 12, 12), lab(Pp, 'P', -12, -4), lab(Q, 'P′', 14, 0));
    out.push(text(O[0], O[1] + r + 34, '沿任一直径所在直线翻折', { anchor: 'middle', size: 13, color: C.soft }));
  }
  // 右：旋转对称，绕圆心转任意角度
  {
    const O = [355, 105], a = 200, b = 290;
    const Pp = P(O, r, a), Q = P(O, r, b);
    out.push(circle(...O, r), seg(O, Pp, { color: C.emph, w: 1.8 }), seg(O, Q, { color: C.emph, w: 1.8 }));
    const s = P(O, 30, a), e = P(O, 30, b);
    out.push(`<path d="M ${f(s[0])} ${f(s[1])} A 30 30 0 0 0 ${f(e[0])} ${f(e[1])}" stroke="${C.blue}" stroke-width="1.5"/>`);
    // 箭头
    const tg = [Math.sin(rad(b)), Math.cos(rad(b))]; // 逆时针方向的切向（屏幕坐标）
    const tip = e, back = [tip[0] + 8 * tg[0], tip[1] + 8 * tg[1]], nn = [-tg[1], tg[0]];
    out.push(`<polygon points="${f(tip[0])},${f(tip[1])} ${f(back[0] + 4 * nn[0])},${f(back[1] + 4 * nn[1])} ${f(back[0] - 4 * nn[0])},${f(back[1] - 4 * nn[1])}" fill="${C.blue}" stroke="none"/>`);
    out.push(dot(...O), dot(...Pp, C.emph), dot(...Q, C.emph), lab(O, 'O', -12, -6), lab(Pp, 'P', -12, 4), lab(Q, 'P′', 8, 18));
    // 转动的半径：转过任意角度，端点始终在圆上
    // 转动的半径只在网页上显示：静态 opacity 为 0，PDF 里不画这条没有名字的线
    out.push(`<g opacity="0" transform="rotate(0 ${O[0]} ${O[1]})">${seg(O, P(O, r, 60), { color: C.blue, w: 1.5 })}${dot(...P(O, r, 60), C.blue, 3.5)}<animate attributeName="opacity" values="1;1" dur="12s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" values="0 ${O[0]} ${O[1]};-360 ${O[0]} ${O[1]}" dur="12s" repeatCount="indefinite"/></g>`);
    out.push(text(O[0], O[1] + r + 34, '绕圆心旋转任意角度', { anchor: 'middle', size: 13, color: C.soft }));
  }
  files['9-circle-index-symmetry.svg'] = svg(480, 215, out.join('\n'));
}

// ---------- 结构图 ----------
{
  const out = [];
  const box = (x, y, w, lines, o = {}) => {
    const h = 12 + lines.length * 19;
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="1.5"/>`);
    lines.forEach((s, i) => out.push(text(x + w / 2, y + 21 + i * 19, s, { anchor: 'middle', size: 13, color: o.text || C.ink })));
    return { x, y, w, h, top: [x + w / 2, y], bottom: [x + w / 2, y + h] };
  };
  const arrow = (p, q, col = C.soft) => {
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], nn = [-u[1], u[0]];
    const e = [q[0] - 2 * u[0], q[1] - 2 * u[1]], b = [e[0] - 8 * u[0], e[1] - 8 * u[1]];
    out.push(line(p[0], p[1], b[0], b[1], { color: col, w: 1.3 }));
    out.push(`<polygon points="${f(e[0])},${f(e[1])} ${f(b[0] + 4 * nn[0])},${f(b[1] + 4 * nn[1])} ${f(b[0] - 4 * nn[0])},${f(b[1] - 4 * nn[1])}" fill="${col}" stroke="none"/>`);
  };
  const W = 150, X = [10, 175, 340];
  const top = box(95, 8, 310, ['圆：到圆心的距离都等于半径 r'], { color: C.emph, text: C.emph, fill: C.emphFill });
  // 第一列：对称 → 性质
  const h1 = box(X[0], 78, W, ['旋转对称', '轴对称'], { color: C.blue, text: C.blue });
  const p1 = box(X[0], 150, W, ['弧、弦、圆心角', '垂径定理'], {});
  const p2 = box(X[0], 222, W, ['圆周角定理', '圆内接四边形'], {});
  // 第二列：比较距离和半径
  const h2 = box(X[1], 78, W, ['比较距离 d', '和半径 r'], { color: C.blue, text: C.blue });
  const q1 = box(X[1], 150, W, ['点与圆', '直线与圆'], {});
  const q2 = box(X[1], 222, W, ['切线、切线长', '外接圆、内切圆'], {});
  // 第三列：按比例取整圆的一部分
  const h3 = box(X[2], 78, W, ['按圆心角', '占 360° 的比例'], { color: C.blue, text: C.blue });
  const s1 = box(X[2], 150, W, ['正多边形、π', '弧长、扇形面积'], {});
  const s2 = box(X[2], 222, W, ['圆锥的侧面积', '和全面积'], {});
  for (const h of [h1, h2, h3]) arrow([h.top[0], top.bottom[1]], h.top);
  for (const [a, b] of [[h1, p1], [p1, p2], [h2, q1], [q1, q2], [h3, s1], [s1, s2]]) arrow(a.bottom, b.top);
  const cap = ['圆的有关性质', '与圆有关的位置关系', '与圆有关的计算'];
  X.forEach((x, i) => out.push(text(x + W / 2, 300, cap[i], { anchor: 'middle', size: 13, color: C.soft })));
  files['9-circle-index-map.svg'] = svg(500, 310, out.join('\n'));
}

export default files;
