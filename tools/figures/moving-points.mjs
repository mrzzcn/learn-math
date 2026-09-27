// 第十一部分“动点与函数”的图。
import { C, f, svg, text, line, dot, poly, polyline, rightAngle } from './lib.mjs';

const files = {};

// 时间线：从 t0 出发，steps 是 [目标值, 秒数, 'jump'?]；返回每一帧的 t 和 keyTimes（动点按 dt 取样）
function timeline(t0, steps, dt = 0.1) {
  const ts = [t0], times = [0];
  let now = 0, cur = t0;
  for (const [to, sec, jump] of steps) {
    if (jump) { ts.push(to); now += 0.001; times.push(now); cur = to; continue; }
    const n = Math.max(1, Math.round(Math.abs(to - cur) / dt));
    for (let i = 1; i <= n; i++) { ts.push(cur + ((to - cur) * i) / n); times.push(now + (sec * i) / n); }
    now += sec; cur = to;
  }
  const kt = times.map(x => (x / now).toFixed(4)).join(';');
  return { ts, kt, dur: +now.toFixed(3) };
}
const pts = arr => arr.map(p => p.map(f).join(',')).join(' ');

// 坐标轴（只画第一象限）：原点 (ox, oy)，横轴长 w，纵轴长 h
function quadrant(ox, oy, w, h, xl, yl) {
  return [
    line(ox, oy, ox + w, oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, oy - h, { color: C.axis, w: 1.5 }),
    `<polygon points="${f(ox + w + 8)},${oy} ${f(ox + w)},${oy - 4} ${f(ox + w)},${oy + 4}" fill="${C.axis}" stroke="none"/>`,
    `<polygon points="${ox},${f(oy - h - 8)} ${ox - 4},${f(oy - h)} ${ox + 4},${f(oy - h)}" fill="${C.axis}" stroke="none"/>`,
    text(ox + w + 4, oy + 18, xl, { italic: true, color: C.soft }), text(ox + 8, oy - h - 2, yl, { italic: true, color: C.soft }),
    text(ox - 6, oy + 16, 'O', { anchor: 'end', italic: true, color: C.soft, size: 12 }),
  ].join('\n');
}

// ---------- 例 1：矩形上的动点，△APD 的面积 ----------
{
  const u = 36, ox = 40, oy = 170;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const A = [0, 0], B = [4, 0], Cc = [4, 3], D = [0, 3];
  const Pt = t => (t <= 4 ? [t, 0] : t <= 7 ? [4, t - 4] : [11 - t, 3]);
  const S = t => (t <= 4 ? 1.5 * t : t <= 7 ? 6 : 1.5 * (11 - t));
  // 图象：t 每单位 18 像素，S 每单位 18 像素
  const gx = 250, gy = 170, ut = 18, us = 18;
  const G = (t, s) => [gx + ut * t, gy - us * s];
  const { ts, kt, dur } = timeline(2, [[11, 9], [11, 1.2], [0, 0, 'jump'], [0, 1], [2, 2]], 0.25);
  const an = (attr, vals, extra = '') => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s"${extra} repeatCount="indefinite"/>`;
  const out = [];
  const t0 = 2;
  out.push(`<polygon points="${pts([R(A), R(Pt(t0)), R(D)])}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="1.5">${an('points', ts.map(t => pts([R(A), R(Pt(t)), R(D)])).join(';'))}</polygon>`);
  out.push(poly([R(A), R(B), R(Cc), R(D)]));
  out.push(text(R(A)[0] - 6, R(A)[1] + 18, 'A', { italic: true, anchor: 'end' }), text(R(B)[0] + 6, R(B)[1] + 18, 'B', { italic: true }));
  out.push(text(R(Cc)[0] + 6, R(Cc)[1] - 6, 'C', { italic: true }), text(R(D)[0] - 6, R(D)[1] - 6, 'D', { italic: true, anchor: 'end' }));
  out.push(text(R(A)[0] - 10, (R(A)[1] + R(D)[1]) / 2 + 4, '3', { anchor: 'end', color: C.soft, size: 12 }));
  const px = ts.map(t => f(R(Pt(t))[0])).join(';'), py = ts.map(t => f(R(Pt(t))[1])).join(';');
  out.push(`<circle cx="${f(R(Pt(t0))[0])}" cy="${f(R(Pt(t0))[1])}" r="5" fill="${C.emph}" stroke="none">${an('cx', px)}${an('cy', py)}</circle>`);
  // P 的名字放在矩形外侧
  const lab = t => { const [x, y] = R(Pt(t)); return t <= 4 ? [x, y + 20] : t <= 7 ? [x + 14, y + 5] : [x, y - 10]; };
  out.push(`<text x="${f(lab(t0)[0])}" y="${f(lab(t0)[1])}" fill="${C.emph}" stroke="none" font-style="italic" text-anchor="middle">P${an('x', ts.map(t => f(lab(t)[0])).join(';'))}${an('y', ts.map(t => f(lab(t)[1])).join(';'))}</text>`);
  // 图象
  out.push(quadrant(gx, gy, ut * 11.8, us * 7.2, 't', 'S'));
  for (const [t, s] of [[4, 6], [7, 6]]) out.push(line(...G(t, s), ...G(t, 0), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(...G(0, 6), ...G(4, 6), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(polyline([G(0, 0), G(4, 6), G(7, 6), G(11, 0)], { color: C.blue, w: 2.5 }));
  for (const t of [4, 7, 11]) out.push(text(G(t, 0)[0], gy + 16, String(t), { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(text(gx - 6, G(0, 6)[1] + 4, '6', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(`<circle cx="${f(G(t0, S(t0))[0])}" cy="${f(G(t0, S(t0))[1])}" r="5" fill="${C.emph}" stroke="none">${an('cx', ts.map(t => f(G(t, S(t))[0])).join(';'))}${an('cy', ts.map(t => f(G(t, S(t))[1])).join(';'))}</circle>`);
  files['moving-points-rect.svg'] = svg(480, 220, out.join('\n'));
}

// ---------- 例 2：由图象反推图形 ----------
{
  const u = 30, ox = 40, oy = 150;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const A = [0, 0], B = [4, 0], Cc = [4, 3], D = [0, 3], P = [4, 1.8];
  const out = [];
  out.push(poly([R(A), R(B), R(P)], { fill: C.emphFill, color: C.emph, w: 1.5 }));
  out.push(poly([R(A), R(B), R(Cc), R(D)]));
  // 运动路线 B → C → D
  out.push(polyline([[R(B)[0] + 10, R(B)[1] - 6], [R(Cc)[0] + 10, R(Cc)[1] - 10], [R(D)[0] + 6, R(D)[1] - 10]], { color: C.blue, w: 1.2, dash: '4 3' }));
  out.push(`<polygon points="${f(R(D)[0] + 6)},${f(R(D)[1] - 10)} ${f(R(D)[0] + 14)},${f(R(D)[1] - 14)} ${f(R(D)[0] + 14)},${f(R(D)[1] - 6)}" fill="${C.blue}" stroke="none"/>`);
  out.push(dot(...R(P), C.emph));
  out.push(text(R(A)[0] - 6, R(A)[1] + 18, 'A', { italic: true, anchor: 'end' }), text(R(B)[0] + 6, R(B)[1] + 18, 'B', { italic: true }));
  out.push(text(R(Cc)[0] + 14, R(Cc)[1] + 4, 'C', { italic: true }), text(R(D)[0] - 6, R(D)[1] - 6, 'D', { italic: true, anchor: 'end' }));
  out.push(text(R(P)[0] + 16, R(P)[1] + 5, 'P', { italic: true, color: C.emph }));
  // 图象
  const gx = 220, gy = 150, ux = 22, uy = 16;
  const G = (x, y) => [gx + ux * x, gy - uy * y];
  out.push(quadrant(gx, gy, ux * 8.3, uy * 7.6, 'x', 'y'));
  out.push(line(...G(0, 6), ...G(3, 6), { color: C.soft, w: 1, dash: '3 3' }), line(...G(3, 6), ...G(3, 0), { color: C.soft, w: 1, dash: '3 3' }), line(...G(7, 6), ...G(7, 0), { color: C.soft, w: 1, dash: '3 3' }));
  out.push(polyline([G(0, 0), G(3, 6), G(7, 6)], { color: C.blue, w: 2.5 }));
  out.push(dot(...G(3, 6), C.blue), dot(...G(7, 6), C.blue));
  for (const x of [3, 7]) out.push(text(G(x, 0)[0], gy + 16, String(x), { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(text(gx - 6, G(0, 6)[1] + 4, '6', { anchor: 'end', color: C.soft, size: 11 }));
  files['moving-points-read.svg'] = svg(420, 190, out.join('\n'));
}

// ---------- 例 3：两个动点，面积是二次函数 ----------
{
  const u = 20, ox = 40, oy = 180;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const Cc = [0, 0], A = [0, 6], B = [8, 0];
  const Pt = t => [0, 6 - t], Qt = t => [2 * t, 0], S = t => -t * t + 6 * t;
  const gx = 270, gy = 180, ut = 26, us = 13;
  const G = (t, s) => [gx + ut * t, gy - us * s];
  const { ts, kt, dur } = timeline(3, [[4, 2], [4, 1.5], [0, 0, 'jump'], [0, 1], [3, 6]], 0.1);
  const an = (attr, vals) => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const t0 = 3, out = [];
  out.push(`<polygon points="${pts([R(Pt(t0)), R(Cc), R(Qt(t0))])}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="1.5">${an('points', ts.map(t => pts([R(Pt(t)), R(Cc), R(Qt(t))])).join(';'))}</polygon>`);
  out.push(poly([R(A), R(Cc), R(B)]));
  out.push(rightAngle(R(Cc), R(A), R(B), { size: 11 }));
  out.push(text(R(A)[0] - 8, R(A)[1] + 4, 'A', { italic: true, anchor: 'end' }), text(R(Cc)[0] - 8, R(Cc)[1] + 16, 'C', { italic: true, anchor: 'end' }), text(R(B)[0] + 6, R(B)[1] + 16, 'B', { italic: true }));
  const circ = (fn, col, name, dx, dy, anchor) => {
    const x = ts.map(t => f(R(fn(t))[0])).join(';'), y = ts.map(t => f(R(fn(t))[1])).join(';');
    const [x0, y0] = R(fn(t0));
    return `<circle cx="${f(x0)}" cy="${f(y0)}" r="5" fill="${col}" stroke="none">${an('cx', x)}${an('cy', y)}</circle>`
      + `<text x="${f(x0 + dx)}" y="${f(y0 + dy)}" fill="${col}" stroke="none" font-style="italic" text-anchor="${anchor}">${name}${an('x', ts.map(t => f(R(fn(t))[0] + dx)).join(';'))}${an('y', ts.map(t => f(R(fn(t))[1] + dy)).join(';'))}</text>`;
  };
  out.push(circ(Pt, C.emph, 'P', -10, 5, 'end'), circ(Qt, C.blue, 'Q', 0, 20, 'middle'));
  // 图象
  out.push(quadrant(gx, gy, ut * 6.6, us * 10.6, 't', 'S'));
  const curve = (a, b) => { const r = []; for (let i = 0; i <= 40; i++) { const t = a + ((b - a) * i) / 40; r.push(G(t, S(t))); } return r; };
  out.push(polyline(curve(0, 4), { color: C.blue, w: 2.5 }), polyline(curve(4, 6), { color: C.soft, w: 1.2, dash: '4 3' }));
  out.push(line(...G(0, 8), ...G(4, 8), { color: C.soft, w: 1, dash: '3 3' }), line(...G(0, 9), ...G(3, 9), { color: C.soft, w: 1, dash: '3 3' }));
  for (const t of [2, 3, 4]) out.push(line(...G(t, S(t)), ...G(t, 0), { color: C.soft, w: 1, dash: '3 3' }));
  for (const t of [2, 3, 4, 6]) out.push(text(G(t, 0)[0], gy + 16, String(t), { anchor: 'middle', color: C.soft, size: 11 }));
  for (const s of [8, 9]) out.push(text(gx - 6, G(0, s)[1] + 4, String(s), { anchor: 'end', color: C.soft, size: 11 }));
  out.push(dot(...G(2, 8), C.blue, 3.5), dot(...G(4, 8), C.blue, 3.5));
  out.push(`<circle cx="${f(G(t0, S(t0))[0])}" cy="${f(G(t0, S(t0))[1])}" r="5" fill="${C.emph}" stroke="none">${an('cx', ts.map(t => f(G(t, S(t))[0])).join(';'))}${an('cy', ts.map(t => f(G(t, S(t))[1])).join(';'))}</circle>`);
  files['moving-points-two.svg'] = svg(470, 220, out.join('\n'));
}

// ---------- 动线：直线 x = t 扫过三角形 ----------
{
  const u = 40, ox = 40, oy = 150;
  const R = ([x, y]) => [ox + u * x, oy - u * y];
  const O = [0, 0], A = [4, 0], B = [2, 2];
  const region = t => (t <= 2 ? [[0, 0], [t, 0], [t, t], [t, t]] : [[0, 0], [t, 0], [t, 4 - t], [2, 2]]);
  const S = t => (t <= 2 ? (t * t) / 2 : 4 - ((4 - t) * (4 - t)) / 2);
  const gx = 270, gy = 150, ut = 36, us = 26;
  const G = (t, s) => [gx + ut * t, gy - us * s];
  const { ts, kt, dur } = timeline(3, [[4, 1.5], [4, 1.5], [0, 0, 'jump'], [0, 1], [3, 6]], 0.1);
  const an = (attr, vals) => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const t0 = 3, out = [];
  out.push(line(ox - 16, oy, R([4.6, 0])[0], oy, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${pts(region(t0).map(R))}" fill="${C.emphFill}" stroke="none">${an('points', ts.map(t => pts(region(t).map(R))).join(';'))}</polygon>`);
  out.push(poly([R(O), R(A), R(B)]));
  const lx = ts.map(t => f(R([t, 0])[0])).join(';');
  out.push(`<line x1="${f(R([t0, 0])[0])}" y1="${f(oy + 14)}" x2="${f(R([t0, 0])[0])}" y2="${f(R([0, 2.6])[1])}" stroke="${C.emph}" stroke-width="2">${an('x1', lx)}${an('x2', lx)}</line>`);
  out.push(`<text x="${f(R([t0, 0])[0] + 6)}" y="${f(R([0, 2.6])[1] + 8)}" fill="${C.emph}" stroke="none" font-style="italic" font-size="13">x = t${an('x', ts.map(t => f(R([t, 0])[0] + 6)).join(';'))}</text>`);
  out.push(text(R(O)[0] - 6, oy + 18, 'O', { italic: true, anchor: 'end' }), text(R(A)[0] + 4, oy + 18, 'A', { italic: true }), text(R(B)[0], R(B)[1] - 10, 'B', { italic: true, anchor: 'middle' }));
  out.push(text(R([2, 0])[0], oy + 18, '2', { anchor: 'middle', color: C.soft, size: 11 }));
  // 图象
  out.push(quadrant(gx, gy, ut * 4.6, us * 4.6, 't', 'S'));
  const curve = (a, b) => { const r = []; for (let i = 0; i <= 40; i++) { const t = a + ((b - a) * i) / 40; r.push(G(t, S(t))); } return r; };
  out.push(polyline(curve(0, 2), { color: C.blue, w: 2.5 }), polyline(curve(2, 4), { color: C.emph, w: 2.5 }));
  out.push(line(...G(2, 2), ...G(2, 0), { color: C.soft, w: 1, dash: '3 3' }), line(...G(0, 4), ...G(4, 4), { color: C.soft, w: 1, dash: '3 3' }), line(...G(0, 2), ...G(2, 2), { color: C.soft, w: 1, dash: '3 3' }));
  for (const t of [2, 4]) out.push(text(G(t, 0)[0], gy + 16, String(t), { anchor: 'middle', color: C.soft, size: 11 }));
  for (const s of [2, 4]) out.push(text(gx - 6, G(0, s)[1] + 4, String(s), { anchor: 'end', color: C.soft, size: 11 }));
  out.push(`<circle cx="${f(G(t0, S(t0))[0])}" cy="${f(G(t0, S(t0))[1])}" r="5" fill="${C.emph}" stroke="none">${an('cx', ts.map(t => f(G(t, S(t))[0])).join(';'))}${an('cy', ts.map(t => f(G(t, S(t))[1])).join(';'))}</circle>`);
  files['moving-points-sweep.svg'] = svg(470, 190, out.join('\n'));
}

export default files;
