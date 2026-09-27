// 第五部分“几何图形初步”的图。
import { C, f, rad, svg, text, line, seg, dot, poly, polyline, circle, arc, angleMark, rightAngle, tick, label } from './lib.mjs';

const files = {};
const half = (cx, cy, rx, ry, back, o = {}) =>
  `<path d="M ${f(cx - rx)} ${f(cy)} A ${f(rx)} ${f(ry)} 0 0 ${back ? 1 : 0} ${f(cx + rx)} ${f(cy)}" stroke="${o.color || C.ink}" stroke-width="${o.w || 2}"${back ? ' stroke-dasharray="5 4"' : ''} fill="none"/>`;
const ellipse = (cx, cy, rx, ry, o = {}) =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const hid = { dash: '5 4', w: 1.5 };

// ---------- 常见的立体图形 ----------
{
  const out = [], base = 150;
  const name = (x, s) => text(x, 185, s, { anchor: 'middle', size: 13 });
  // 正方体
  {
    const x = 20, y = base - 60, s = 60, dx = 22, dy = -16;
    const P = (a, b, back = 0) => [x + a * s + back * dx, y + b * s + back * dy];
    out.push(poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]));
    out.push(poly([P(0, 0), P(0, 0, 1), P(1, 0, 1), P(1, 0)]), poly([P(1, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1)]));
    out.push(seg(P(0, 1, 1), P(0, 0, 1), hid), seg(P(0, 1, 1), P(1, 1, 1), hid), seg(P(0, 1, 1), P(0, 1), hid));
    out.push(name(x + 40, '正方体'));
  }
  // 圆柱
  {
    const cx = 160, rx = 32, ry = 10, top = base - 80;
    out.push(ellipse(cx, top, rx, ry), half(cx, base, rx, ry, true, hid), half(cx, base, rx, ry, false));
    out.push(line(cx - rx, top, cx - rx, base), line(cx + rx, top, cx + rx, base));
    out.push(name(cx, '圆柱'));
  }
  // 圆锥
  {
    const cx = 250, rx = 32, ry = 10, top = base - 85;
    out.push(half(cx, base, rx, ry, true, hid), half(cx, base, rx, ry, false));
    out.push(line(cx, top, cx - rx, base), line(cx, top, cx + rx, base));
    out.push(name(cx, '圆锥'));
  }
  // 三棱柱
  {
    const h = 75, p1 = [300, base], p2 = [370, base], p3 = [345, base - 20];
    const up = p => [p[0], p[1] - h];
    out.push(poly([up(p1), up(p2), up(p3)]), seg(p1, p2), seg(p1, up(p1)), seg(p2, up(p2)));
    out.push(seg(p1, p3, hid), seg(p3, p2, hid), seg(p3, up(p3), hid));
    out.push(name(335, '三棱柱'));
  }
  // 四棱锥
  {
    const b1 = [405, base], b2 = [465, base], b3 = [485, base - 20], b4 = [425, base - 20], T = [445, base - 90];
    out.push(seg(b1, b2), seg(b2, b3), seg(T, b1), seg(T, b2), seg(T, b3));
    out.push(seg(b1, b4, hid), seg(b4, b3, hid), seg(T, b4, hid));
    out.push(name(445, '四棱锥'));
  }
  // 球
  {
    const cx = 555, cy = base - 40, r = 40;
    out.push(circle(cx, cy, r), half(cx, cy, r, 10, true, hid), half(cx, cy, r, 10, false, { w: 1.5 }));
    out.push(name(cx, '球'));
  }
  files['basics-solids.svg'] = svg(610, 200, out.join('\n'));
}

// ---------- 正方体的展开图：相对的面 ----------
{
  const out = [];
  const pair = { 上: C.blueFill, 下: C.blueFill, 前: C.emphFill, 后: C.emphFill, 左: 'rgba(87,96,106,0.16)', 右: 'rgba(87,96,106,0.16)' };
  // 左：正方体
  const x = 40, y = 80, s = 80, dx = 36, dy = -28;
  const P = (a, b, back = 0) => [x + a * s + back * dx, y + b * s + back * dy];
  out.push(poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], { fill: pair['前'] }));
  out.push(poly([P(0, 0), P(0, 0, 1), P(1, 0, 1), P(1, 0)], { fill: pair['上'] }));
  out.push(poly([P(1, 0), P(1, 0, 1), P(1, 1, 1), P(1, 1)], { fill: pair['右'] }));
  out.push(seg(P(0, 1, 1), P(0, 0, 1), hid), seg(P(0, 1, 1), P(1, 1, 1), hid), seg(P(0, 1, 1), P(0, 1), hid));
  out.push(text(x + s / 2 + 18, y + s / 2 - 4, '前', { anchor: 'middle', size: 16 }));
  out.push(text(x + s / 2 + dx / 2, y + dy / 2 + 6, '上', { anchor: 'middle', size: 16 }));
  out.push(text(x + s + dx / 2, y + s / 2 + dy / 2 + 6, '右', { anchor: 'middle', size: 16 }));
  // 右：展开图（竖着的一列：上、前、下、后；前的两旁：左、右）
  const u = 50, gx = 290, gy = 20;
  const cells = { 上: [1, 0], 前: [1, 1], 下: [1, 2], 后: [1, 3], 左: [0, 1], 右: [2, 1] };
  for (const [k, [i, j]] of Object.entries(cells)) {
    out.push(poly([[gx + i * u, gy + j * u], [gx + (i + 1) * u, gy + j * u], [gx + (i + 1) * u, gy + (j + 1) * u], [gx + i * u, gy + (j + 1) * u]], { fill: pair[k] }));
    out.push(text(gx + i * u + u / 2, gy + j * u + u / 2 + 6, k, { anchor: 'middle', size: 16 }));
  }
  // 箭头：展开
  out.push(line(205, 110, 250, 110, { color: C.soft, w: 1.5 }), `<polygon points="258,110 249,105 249,115" fill="${C.soft}" stroke="none"/>`);
  files['basics-cube-net.svg'] = svg(460, 240, out.join('\n'));
}

// ---------- 面动成体：长方形绕一边旋转一周成圆柱 ----------
{
  const ax = 120, top = 50, bot = 190, w = 80, ry = 14;
  const out = [];
  out.push(line(ax, top - 30, ax, bot + 25, { color: C.soft, w: 1.2, dash: '8 3 2 3' }));
  // 圆柱轮廓（虚线）
  out.push(ellipse(ax, top, w, ry, { color: C.soft, w: 1.2, dash: '4 4' }), ellipse(ax, bot, w, ry, { color: C.soft, w: 1.2, dash: '4 4' }));
  out.push(line(ax - w, top, ax - w, bot, { color: C.soft, w: 1.2, dash: '4 4' }), line(ax + w, top, ax + w, bot, { color: C.soft, w: 1.2, dash: '4 4' }));
  // 旋转的长方形
  const rect = `<polygon points="0,${top} ${w},${top} ${w},${bot} 0,${bot}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2.5" stroke-linejoin="round"/>`;
  out.push(`<g transform="translate(${ax} 0)"><g>${rect}<animateTransform attributeName="transform" type="scale" values="1 1;1 1;-1 1;1 1" keyTimes="0;0.15;0.575;1" dur="8s" calcMode="spline" keySplines="0 0 1 1;0.45 0 0.55 1;0.45 0 0.55 1" repeatCount="indefinite"/></g></g>`);
  // 旋转方向的箭头
  out.push(`<path d="M ${ax - 26} ${bot + 20} A 26 7 0 0 0 ${ax + 26} ${bot + 20}" stroke="${C.blue}" stroke-width="1.5"/>`, `<polygon points="${ax + 30},${bot + 17} ${ax + 21},${bot + 16} ${ax + 26},${bot + 24}" fill="${C.blue}" stroke="none"/>`);
  out.push(text(ax + 6, top - 20, '旋转轴', { color: C.soft, size: 12 }));
  files['basics-rotate.svg'] = svg(320, 240, out.join('\n'));
}

// ---------- 直线、射线、线段 ----------
{
  const out = [];
  const rows = [40, 100, 160];
  out.push(text(20, rows[0] + 5, '直线'), text(20, rows[1] + 5, '射线'), text(20, rows[2] + 5, '线段'));
  // 直线 AB：两端都没有端点
  out.push(line(80, rows[0], 400, rows[0]), dot(170, rows[0]), dot(310, rows[0]));
  out.push(label([170, rows[0]], 'A', 0, 22), label([310, rows[0]], 'B', 0, 22));
  // 射线 OA：一个端点
  out.push(line(100, rows[1], 400, rows[1]), dot(100, rows[1]), dot(260, rows[1]));
  out.push(label([100, rows[1]], 'O', 0, 22), label([260, rows[1]], 'A', 0, 22));
  // 线段 AB：两个端点
  out.push(line(100, rows[2], 330, rows[2]), dot(100, rows[2]), dot(330, rows[2]));
  out.push(label([100, rows[2]], 'A', 0, 22), label([330, rows[2]], 'B', 0, 22));
  // 向两边、一边延伸的示意
  for (const [x, y, s] of [[400, rows[0], 1], [80, rows[0], -1], [400, rows[1], 1]]) out.push(text(x + s * 6, y + 5, '…', { anchor: s > 0 ? 'start' : 'end', color: C.soft }));
  files['basics-lines.svg'] = svg(440, 190, out.join('\n'));
}

// ---------- 两点之间线段最短 ----------
{
  const A = [40, 130], B = [340, 90];
  const out = [];
  out.push(`<path d="M ${A[0]} ${A[1]} C 110 10, 240 10, ${B[0]} ${B[1]}" stroke="${C.soft}" stroke-width="1.5" stroke-dasharray="5 4"/>`);
  out.push(polyline([A, [150, 180], [260, 150], B], { color: C.soft, w: 1.5, dash: '5 4' }));
  out.push(seg(A, B, { color: C.emph, w: 3 }));
  out.push(dot(...A), dot(...B), label(A, 'A', -12, 5), label(B, 'B', 14, 5));
  files['basics-shortest.svg'] = svg(380, 200, out.join('\n'));
}

// ---------- 例 1：AC : CB = 2 : 3，M 是 AB 的中点 ----------
{
  const u = 16, x0 = 40, y = 60, X = t => x0 + u * t;
  const A = [X(0), y], Cc = [X(8), y], M = [X(10), y], B = [X(20), y];
  const out = [seg(A, B)];
  out.push(line(Cc[0], y, M[0], y, { color: C.emph, w: 4 }));
  for (const p of [A, Cc, M, B]) out.push(dot(...p));
  out.push(label(A, 'A', 0, -12), label(Cc, 'C', 0, -12), label(M, 'M', 0, -12), label(B, 'B', 0, -12));
  out.push(text((Cc[0] + M[0]) / 2, y + 22, '2', { anchor: 'middle', color: C.emph }));
  files['basics-midpoint.svg'] = svg(400, 90, out.join('\n'));
}

// ---------- 例 2：M、N 分别是 AC、CB 的中点 ----------
{
  const u = 30, x0 = 40, y = 50, X = t => x0 + u * t;
  const A = [X(0), y], M = [X(3), y], Cc = [X(6), y], N = [X(8), y], B = [X(10), y];
  const out = [seg(A, B)];
  out.push(line(M[0], y - 18, N[0], y - 18, { color: C.emph, w: 2 }), line(M[0], y - 24, M[0], y - 12, { color: C.emph, w: 2 }), line(N[0], y - 24, N[0], y - 12, { color: C.emph, w: 2 }));
  out.push(tick(A, M, 1, { color: C.ink }), tick(M, Cc, 1, { color: C.ink }), tick(Cc, N, 2, { color: C.blue }), tick(N, B, 2, { color: C.blue }));
  for (const p of [A, M, Cc, N, B]) out.push(dot(...p));
  out.push(label(A, 'A', 0, 24), label(M, 'M', 0, 24), label(Cc, 'C', 0, 24), label(N, 'N', 0, 24), label(B, 'B', 0, 24));
  files['basics-midpoints.svg'] = svg(380, 90, out.join('\n'));
}

// ---------- 例 2 想一想：C 在 AB 的延长线上 ----------
{
  const u = 34, x0 = 30, y = 50, X = t => x0 + u * t;
  const A = [X(0), y], B = [X(4), y], M = [X(5), y], N = [X(7), y], Cc = [X(10), y];
  const out = [seg(A, Cc)];
  out.push(line(M[0], y - 18, N[0], y - 18, { color: C.emph, w: 2 }), line(M[0], y - 24, M[0], y - 12, { color: C.emph, w: 2 }), line(N[0], y - 24, N[0], y - 12, { color: C.emph, w: 2 }));
  out.push(tick(A, M, 1, { color: C.ink }), tick(M, Cc, 1, { color: C.ink }), tick(B, N, 2, { color: C.blue }), tick(N, Cc, 2, { color: C.blue }));
  for (const p of [A, B, M, N, Cc]) out.push(dot(...p));
  out.push(label(A, 'A', 0, 24), label(B, 'B', 0, 24), label(M, 'M', 0, 24), label(N, 'N', 0, 24), label(Cc, 'C', 0, 24));
  files['basics-midpoints-extension.svg'] = svg(400, 90, out.join('\n'));
}

// ---------- 角：射线绕端点旋转 ----------
{
  const O = [180, 150], L = 140, r = 30, circ = 2 * Math.PI * r, dur = 12;
  const angs = [50, 50, 90, 90, 180, 180, 360, 360, 50];
  const kt = '0;0.1;0.22;0.32;0.47;0.57;0.8;0.93;1';
  const out = [];
  out.push(line(O[0], O[1], O[0] + L, O[1]));
  out.push(line(O[0], O[1], O[0], O[1] - L + 20, { color: C.soft, w: 1.2, dash: '5 4' }), line(O[0], O[1], O[0] - L + 20, O[1], { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(text(O[0] + 6, O[1] - L + 28, '直角', { color: C.soft, size: 12 }), text(O[0] - L + 20, O[1] - 8, '平角', { color: C.soft, size: 12 }));
  // 周角时 OB 转回到 OA 上，标注写在 OA 末端外侧
  out.push(text(O[0] + L + 8, O[1] + 4, '周角', { color: C.soft, size: 12 }));
  // 角的弧：用虚线长度控制画出的部分
  const offs = angs.map(a => f(circ * (1 - a / 360))).join(';');
  out.push(`<g transform="translate(${O[0]} ${O[1]}) scale(1 -1)"><circle cx="0" cy="0" r="${r}" fill="none" stroke="${C.emph}" stroke-width="2" stroke-dasharray="${f(circ)} ${f(circ)}" stroke-dashoffset="${f(circ * (1 - 50 / 360))}"><animate attributeName="stroke-dashoffset" values="${offs}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></circle></g>`);
  // 旋转的射线 OB，B 的名字反向旋转保持正立
  const bx = O[0] + L - 20, by = O[1] - 14;
  const rot = angs.map(a => `${-a} ${O[0]} ${O[1]}`).join(';');
  const back = angs.map(a => `${a} ${bx} ${by}`).join(';');
  out.push(`<g transform="rotate(-50 ${O[0]} ${O[1]})">${line(O[0], O[1], O[0] + L, O[1], { color: C.blue, w: 2.5 })}${dot(O[0] + L - 20, O[1], C.blue)}<g transform="rotate(50 ${bx} ${by})">${text(bx, by + 5, 'B', { anchor: 'middle', italic: true, color: C.blue })}<animateTransform attributeName="transform" type="rotate" values="${back}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g><animateTransform attributeName="transform" type="rotate" values="${rot}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g>`);
  out.push(dot(...O), dot(O[0] + L - 20, O[1]));
  out.push(label(O, 'O', -4, 20), label([O[0] + L - 20, O[1]], 'A', 0, 20));
  files['basics-angle.svg'] = svg(380, 190, out.join('\n'));
}

// ---------- 角的平分线 ----------
{
  const O = [40, 180], at = (l, d) => [O[0] + l * Math.cos(rad(d)), O[1] - l * Math.sin(rad(d))];
  const A = at(260, 0), B = at(180, 64), Cc = at(260, 32);
  const out = [seg(O, A), seg(O, B), seg(O, Cc, { color: C.blue, w: 2 })];
  out.push(arc(O, 40, 0, 32, { color: C.emph, w: 2 }), arc(O, 50, 32, 64, { color: C.emph, w: 2 }));
  out.push(dot(...O), label(O, 'O', -10, 16), label(A, 'A', 0, 20), label(B, 'B', 10, 6), label(Cc, 'C', 12, 4, { color: C.blue }));
  files['basics-bisector.svg'] = svg(330, 210, out.join('\n'));
}

// ---------- 余角和补角 ----------
{
  const out = [];
  // 左：∠1 + ∠2 = 90°
  {
    const O = [40, 170], at = (l, d) => [O[0] + l * Math.cos(rad(d)), O[1] - l * Math.sin(rad(d))];
    const A = at(160, 0), B = at(160, 35), Cc = at(150, 90);
    out.push(seg(O, A), seg(O, Cc), seg(O, B, { color: C.blue }), rightAngle(O, A, Cc, { size: 12 }));
    out.push(arc(O, 42, 0, 35, { color: C.emph }), arc(O, 34, 35, 90, { color: C.blue }));
    out.push(text(...at(56, 17).map((v, i) => v + (i ? 5 : 0)), '1', { anchor: 'middle', color: C.emph }), text(...at(50, 64).map((v, i) => v + (i ? 5 : 0)), '2', { anchor: 'middle', color: C.blue }));
    out.push(label(O, 'O', -10, 16), label(A, 'A', 0, 20), label(B, 'B', 10, 0), label(Cc, 'C', -10, 4));
    out.push(text(110, 205, '互余', { anchor: 'middle', color: C.soft, size: 13 }));
  }
  // 右：∠3 + ∠4 = 180°
  {
    const O = [390, 170], at = (l, d) => [O[0] + l * Math.cos(rad(d)), O[1] - l * Math.sin(rad(d))];
    const A = at(150, 0), D = at(150, 180), B = at(140, 55);
    out.push(seg(D, A), seg(O, B, { color: C.blue }));
    out.push(arc(O, 30, 0, 55, { color: C.emph }), arc(O, 24, 55, 180, { color: C.blue }));
    out.push(text(...at(46, 27).map((v, i) => v + (i ? 5 : 0)), '3', { anchor: 'middle', color: C.emph }), text(...at(40, 118).map((v, i) => v + (i ? 5 : 0)), '4', { anchor: 'middle', color: C.blue }));
    out.push(label(O, 'O', 0, 20), label(A, 'A', 0, 20), label(D, 'D', 0, 20), label(B, 'B', 10, 0));
    out.push(text(O[0], 205, '互补', { anchor: 'middle', color: C.soft, size: 13 }));
  }
  files['basics-complement.svg'] = svg(560, 220, out.join('\n'));
}

export default files;
