// 第十部分“数据的收集、整理与描述”的图。
import { C, f, svg, text, line, dot, poly, polyline, rad } from './lib.mjs';

const files = {};

// 伪随机数（固定种子，保证每次生成的图一样）
function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

// 扇形：圆心 c，半径 r，从 a0 度到 a1 度（数学方向，逆时针为正）
function sector(c, r, a0, a1, fill, stroke = C.ink) {
  const p0 = [c[0] + r * Math.cos(rad(a0)), c[1] - r * Math.sin(rad(a0))];
  const p1 = [c[0] + r * Math.cos(rad(a1)), c[1] - r * Math.sin(rad(a1))];
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
  return `<path d="M ${f(c[0])} ${f(c[1])} L ${f(p0[0])} ${f(p0[1])} A ${r} ${r} 0 ${large} ${sweep} ${f(p1[0])} ${f(p1[1])} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>`;
}

// 最喜欢的运动：40 人
const sports = [['篮球', 12], ['乒乓球', 10], ['足球', 8], ['跳绳', 6], ['其他', 4]];
const total = sports.reduce((s, [, n]) => s + n, 0);

// ---------- 抽样：随机抽取与只抽一个角落 ----------
{
  const out = [];
  const cols = 12, rows = 8, gap = 14;
  const panel = (x0, pick, title) => {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const on = pick.has(r * cols + c);
      out.push(dot(x0 + c * gap, 30 + r * gap, on ? C.emph : '#c3c8ce', on ? 4.5 : 3));
    }
    out.push(poly([[x0 - 9, 21], [x0 + (cols - 1) * gap + 9, 21], [x0 + (cols - 1) * gap + 9, 30 + (rows - 1) * gap + 9], [x0 - 9, 30 + (rows - 1) * gap + 9]], { color: C.soft, w: 1 }));
    out.push(text(x0 + ((cols - 1) * gap) / 2, 170, title, { anchor: 'middle', size: 13 }));
  };
  const rnd = lcg(3), random = new Set();
  while (random.size < 12) random.add(Math.floor(rnd() * cols * rows));
  const corner = new Set();
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) corner.add(r * cols + c);
  panel(25, random, '随机抽取：分散在各处');
  panel(265, corner, '只抽一个角落');
  files['data-collection-sampling.svg'] = svg(440, 185, out.join('\n'));
}

// ---------- 条形图 ----------
{
  const ox = 50, oy = 210, bw = 40, step = 64, sy = 12;
  const Y = v => oy - sy * v;
  const out = [];
  for (let v = 2; v <= 14; v += 2) {
    out.push(line(ox, Y(v), ox + step * sports.length + 10, Y(v), { color: C.grid, w: 1 }));
    out.push(text(ox - 6, Y(v) + 4, v, { anchor: 'end', color: C.soft, size: 11 }));
  }
  out.push(line(ox, oy, ox + step * sports.length + 14, oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(15.5), { color: C.axis, w: 1.5 }));
  out.push(text(ox - 6, oy + 4, '0', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(text(ox + 6, Y(15.5) - 2, '人数', { color: C.soft, size: 12 }));
  sports.forEach(([name, n], i) => {
    const x = ox + 16 + i * step;
    const col = i === 0 ? C.emph : C.blue;
    out.push(poly([[x, oy], [x + bw, oy], [x + bw, Y(n)], [x, Y(n)]], { fill: i === 0 ? C.emphFill : C.blueFill, color: col, w: 1.5 }));
    out.push(text(x + bw / 2, Y(n) - 6, n, { anchor: 'middle', color: col, size: 12 }));
    out.push(text(x + bw / 2, oy + 18, name, { anchor: 'middle', size: 12 }));
  });
  files['data-collection-bar.svg'] = svg(390, 235, out.join('\n'));
}

// ---------- 扇形图 ----------
{
  const c = [130, 125], r = 100;
  const fills = [C.emphFill, 'rgba(31,95,168,0.22)', 'rgba(31,95,168,0.12)', 'rgba(87,96,106,0.16)', 'rgba(87,96,106,0.06)'];
  const out = [];
  let a = 90; // 从正上方开始，顺时针排列
  sports.forEach(([name, n], i) => {
    const deg = (360 * n) / total, a1 = a - deg, mid = a - deg / 2;
    out.push(sector(c, r, a1, a, fills[i], i === 0 ? C.emph : C.ink));
    const lr = i === 0 ? 58 : 62;
    const lx = c[0] + lr * Math.cos(rad(mid)), ly = c[1] - lr * Math.sin(rad(mid));
    out.push(text(lx, ly - 2, name, { anchor: 'middle', size: 12, color: i === 0 ? C.emph : C.ink }));
    out.push(text(lx, ly + 13, `${(100 * n) / total}%`, { anchor: 'middle', size: 11, color: i === 0 ? C.emph : C.soft }));
    a = a1;
  });
  // 篮球扇形的圆心角：从 90° 到 −18°
  const deg0 = 360 * sports[0][1] / total;
  const ar = 22, p0 = [c[0] + ar * Math.cos(rad(90)), c[1] - ar * Math.sin(rad(90))], p1 = [c[0] + ar * Math.cos(rad(90 - deg0)), c[1] - ar * Math.sin(rad(90 - deg0))];
  out.push(`<path d="M ${f(p0[0])} ${f(p0[1])} A ${ar} ${ar} 0 0 1 ${f(p1[0])} ${f(p1[1])}" stroke="${C.emph}" stroke-width="2"/>`);
  // 圆心角的度数写在角的记号旁边
  const tp = [c[0] + 38 * Math.cos(rad(68)), c[1] - 38 * Math.sin(rad(68))];
  out.push(text(tp[0], tp[1] + 4, `${deg0}°`, { anchor: 'middle', color: C.emph, size: 12 }));
  files['data-collection-pie.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 折线图：一天的气温 ----------
{
  const temps = [12, 11, 10, 11, 14, 18, 21, 22, 20, 17, 15, 13];
  const ox = 50, oy = 200, sx = 13, sy = 7;
  const X = h => ox + sx * h, Y = t => oy - sy * t;
  const out = [];
  for (let t = 5; t <= 25; t += 5) {
    out.push(line(X(0), Y(t), X(23), Y(t), { color: C.grid, w: 1 }));
    out.push(text(ox - 6, Y(t) + 4, t, { anchor: 'end', color: C.soft, size: 11 }));
  }
  out.push(text(ox - 6, oy + 4, '0', { anchor: 'end', color: C.soft, size: 11 }));
  for (let h = 0; h <= 22; h += 2) out.push(text(X(h), oy + 16, h, { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(line(ox, oy, X(23.5), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(27), { color: C.axis, w: 1.5 }));
  out.push(text(X(23.5), oy + 34, '时刻（时）', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(ox + 6, Y(27) - 2, '气温（°C）', { color: C.soft, size: 12 }));
  const pts = temps.map((t, i) => [X(2 * i), Y(t)]);
  out.push(polyline(pts, { color: C.blue, w: 2.5 }));
  pts.forEach(p => out.push(dot(p[0], p[1], C.blue, 3.5)));
  out.push(dot(pts[7][0], pts[7][1], C.emph, 5), text(pts[7][0], pts[7][1] - 10, '最高 22', { anchor: 'middle', color: C.emph, size: 12 }));
  out.push(dot(pts[2][0], pts[2][1], C.emph, 5), text(pts[2][0], pts[2][1] + 20, '最低 10', { anchor: 'middle', color: C.emph, size: 12 }));
  files['data-collection-line.svg'] = svg(380, 240, out.join('\n'));
}

// ---------- 频数分布直方图：跳绳次数 ----------
{
  const groups = [[80, 4], [100, 9], [120, 16], [140, 13], [160, 8]];
  const ox = 50, oy = 210, sx = 2.4, sy = 10, x0 = 70;
  const X = v => ox + sx * (v - x0), Y = n => oy - sy * n;
  const out = [];
  for (let n = 4; n <= 16; n += 4) {
    out.push(line(ox, Y(n), X(190), Y(n), { color: C.grid, w: 1 }));
    out.push(text(ox - 6, Y(n) + 4, n, { anchor: 'end', color: C.soft, size: 11 }));
  }
  out.push(text(ox - 6, oy + 4, '0', { anchor: 'end', color: C.soft, size: 11 }));
  // 横轴从 70 开始，左端画折断记号
  out.push(line(ox, oy, X(192), oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(18.5), { color: C.axis, w: 1.5 }));
  out.push(polyline([[ox + 3, oy], [ox + 6, oy - 5], [ox + 10, oy + 5], [ox + 13, oy]], { color: C.axis, w: 1.2 }));
  groups.forEach(([a, n], i) => {
    const hi = i === 2;
    out.push(poly([[X(a), oy], [X(a + 20), oy], [X(a + 20), Y(n)], [X(a), Y(n)]], { fill: hi ? C.emphFill : C.blueFill, color: hi ? C.emph : C.blue, w: 1.5 }));
    out.push(text(X(a + 10), Y(n) - 6, n, { anchor: 'middle', color: hi ? C.emph : C.blue, size: 12 }));
  });
  for (let v = 80; v <= 180; v += 20) out.push(text(X(v), oy + 16, v, { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(text(X(192), oy + 34, '跳绳次数', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(ox + 6, Y(18.5) - 2, '频数（人）', { color: C.soft, size: 12 }));
  files['data-collection-histogram.svg'] = svg(360, 250, out.join('\n'));
}

export default files;
