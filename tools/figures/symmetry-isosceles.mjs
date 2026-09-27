// 第五部分“轴对称与等腰三角形”的图。
import { C, f, svg, text, line, seg, dot, poly, angleMark, rightAngle, tick, label, arc, dir, circle } from './lib.mjs';

const files = {};
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const along = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
// 沿竖直直线 x = x0 翻折的动画：内容从原位置翻到对称位置，停一下再翻回来。初始（PDF）画成翻过去的状态
const flipX = (x0, body, dur = 6) =>
  `<g transform="translate(${f(x0)} 0)"><g transform="scale(-1 1)"><animateTransform attributeName="transform" type="scale" values="1 1;1 1;-1 1;-1 1;1 1" keyTimes="0;0.15;0.5;0.85;1" dur="${dur}s" repeatCount="indefinite"/><g transform="translate(${f(-x0)} 0)">${body}</g></g></g>`;

// ---------- 两个图形关于直线 l 对称 ----------
{
  const x0 = 180;
  const A = [80, 45], B = [45, 165], Cc = [140, 140];
  const r = p => [2 * x0 - p[0], p[1]];
  const A2 = r(A), B2 = r(B), C2 = r(Cc), M = [x0, A[1]];
  const out = [];
  out.push(line(x0, 20, x0, 200, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(poly([A, B, Cc]), poly([A2, B2, C2]));
  out.push(flipX(x0, poly([A, B, Cc], { fill: C.emphFill, color: 'none', w: 0 })));
  out.push(seg(A, A2, { color: C.emph, w: 1.5, dash: '5 4' }), seg(B, r(B), { color: C.soft, w: 1, dash: '3 4' }));
  out.push(rightAngle(M, A2, [x0, 200]), tick(A, M, 1), tick(M, A2, 1));
  out.push(dot(...A), dot(...A2), dot(...B), dot(...B2));
  out.push(label(A, 'A', -4, -10), label(B, 'B', -10, 16), label(Cc, 'C', 12, 14));
  out.push(label(A2, 'A′', 6, -10), label(B2, 'B′', 12, 16), label(C2, 'C′', -12, 14));
  out.push(text(x0 + 6, 200, 'l', { italic: true, color: C.blue }), label(M, 'M', -12, -8));
  files['symmetry-isosceles-axis.svg'] = svg(360, 215, out.join('\n'));
}

// ---------- 线段垂直平分线的性质 ----------
{
  const A = [60, 180], B = [300, 180], M = mid(A, B), P = [180, 60];
  const out = [];
  out.push(line(180, 20, 180, 205, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(seg(A, B), seg(P, A, { color: C.emph, w: 2.5 }), seg(P, B, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(M, B, P), tick(A, M, 1, { color: C.blue }), tick(M, B, 1, { color: C.blue }), tick(P, A, 2), tick(P, B, 2));
  out.push(dot(...A), dot(...B), dot(...M), dot(...P, C.emph));
  out.push(label(A, 'A', -12, 6), label(B, 'B', 12, 6), label(M, 'M', -12, 18), label(P, 'P', 12, -6));
  out.push(text(186, 30, 'l', { italic: true, color: C.blue }));
  files['symmetry-isosceles-bisector.svg'] = svg(360, 215, out.join('\n'));
}

// ---------- 三边的垂直平分线交于一点 ----------
{
  const A = [130, 40], B = [40, 210], Cc = [320, 210];
  // 外心：解两条垂直平分线的交点
  const circ = (a, b, c) => {
    const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    const s = p => p[0] ** 2 + p[1] ** 2;
    return [(s(a) * (b[1] - c[1]) + s(b) * (c[1] - a[1]) + s(c) * (a[1] - b[1])) / d, (s(a) * (c[0] - b[0]) + s(b) * (a[0] - c[0]) + s(c) * (b[0] - a[0])) / d];
  };
  const O = circ(A, B, Cc), R = Math.hypot(A[0] - O[0], A[1] - O[1]);
  const out = [circle(O[0], O[1], R, { color: C.grid, w: 1.5 })];
  out.push(poly([A, B, Cc]));
  for (const [p, q] of [[A, B], [B, Cc], [Cc, A]]) {
    const m = mid(p, q), l = Math.hypot(q[0] - p[0], q[1] - p[1]), n = [-(q[1] - p[1]) / l, (q[0] - p[0]) / l];
    // 从中点出发，沿法线穿过 O 再多画一点
    const t = (O[0] - m[0]) * n[0] + (O[1] - m[1]) * n[1];
    const e1 = [m[0] - Math.sign(t) * 22 * n[0], m[1] - Math.sign(t) * 22 * n[1]], e2 = [O[0] + Math.sign(t) * 28 * n[0], O[1] + Math.sign(t) * 28 * n[1]];
    out.push(seg(e1, e2, { color: C.soft, w: 1.2, dash: '5 4' }), rightAngle(m, q, O, { size: 8 }));
  }
  out.push(seg(O, A, { color: C.emph, w: 2 }), seg(O, B, { color: C.emph, w: 2 }), seg(O, Cc, { color: C.emph, w: 2 }));
  out.push(dot(...O, C.emph));
  out.push(label(A, 'A', -14, -2), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(O, 'O', 6, -12));
  files['symmetry-isosceles-circumcenter.svg'] = svg(360, Math.ceil(O[1] + R + 8), out.join('\n'));
}

// ---------- 等腰三角形的性质：沿 AD 对折 ----------
const iso = { A: [180, 30], B: [80, 200], C: [280, 200], D: [180, 200] };
{
  const { A, B, C: Cc, D } = iso;
  const out = [];
  out.push(line(180, 30, 180, 220, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(flipX(180, poly([A, B, D], { fill: C.blueFill, color: 'none', w: 0 })));
  out.push(poly([A, B, Cc]));
  out.push(tick(A, B, 1), tick(A, Cc, 1), tick(B, D, 2, { color: C.blue }), tick(D, Cc, 2, { color: C.blue }));
  out.push(angleMark(B, Cc, A, { r: 22 }), angleMark(Cc, A, B, { r: 22 }));
  out.push(angleMark(A, B, D, { r: 26, color: C.blue }), angleMark(A, D, Cc, { r: 30, color: C.blue }));
  out.push(rightAngle(D, Cc, A));
  out.push(label(A, 'A', -12, -2), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', -10, 18));
  files['symmetry-isosceles-properties.svg'] = svg(360, 230, out.join('\n'));
}

// ---------- 判定：等角对等边 ----------
{
  const { A, B, C: Cc, D } = iso;
  const out = [];
  out.push(poly([A, B, Cc]), seg(A, D, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(angleMark(B, Cc, A, { r: 22 }), angleMark(Cc, A, B, { r: 22 }));
  out.push(angleMark(A, B, D, { r: 26, color: C.blue }), angleMark(A, D, Cc, { r: 30, color: C.blue }));
  out.push(seg(A, B, { color: C.emph, w: 2.5 }), seg(A, Cc, { color: C.emph, w: 2.5 }));
  out.push(label(A, 'A', 0, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 0, 18));
  out.push(text(95, 110, '?', { color: C.emph }), text(258, 110, '?', { color: C.emph }));
  files['symmetry-isosceles-converse.svg'] = svg(360, 225, out.join('\n'));
}

// ---------- 等边三角形：三条对称轴 ----------
{
  const s = 200, h = s * Math.sqrt(3) / 2;
  const A = [180, 30], B = [180 - s / 2, 30 + h], Cc = [180 + s / 2, 30 + h];
  const O = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
  const out = [];
  for (const [p, q, r] of [[A, B, Cc], [B, Cc, A], [Cc, A, B]]) {
    const m = mid(q, r), e = along(p, m, 1.15), st = p;
    out.push(seg(st, e, { color: C.blue, w: 1.2, dash: '6 4' }));
  }
  out.push(poly([A, B, Cc]));
  out.push(tick(A, B, 1), tick(B, Cc, 1), tick(Cc, A, 1));
  const lab60 = (v, a, b) => { const d = (dir(v, a) + dir(v, b)) / 2 + (Math.abs(dir(v, a) - dir(v, b)) > 180 ? 180 : 0) + 15; return text(v[0] + 52 * Math.cos(d * Math.PI / 180), v[1] - 52 * Math.sin(d * Math.PI / 180) + 4, '60°', { anchor: 'middle', color: C.emph, size: 12 }); };
  out.push(angleMark(A, B, Cc, { r: 18 }), angleMark(B, Cc, A, { r: 18 }), angleMark(Cc, A, B, { r: 18 }));
  out.push(lab60(A, B, Cc), lab60(B, Cc, A), lab60(Cc, A, B));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -12, 14), label(Cc, 'C', 12, 14));
  files['symmetry-isosceles-equilateral.svg'] = svg(360, 250, out.join('\n'));
}

// ---------- 含 30° 角的直角三角形：沿 AC 翻折 ----------
{
  const bc = 90, ac = bc * Math.sqrt(3);
  const Cc = [180, 210], A = [180, 210 - ac], B = [180 + bc, 210], D = [180 - bc, 210];
  const out = [];
  out.push(flipX(180, poly([A, Cc, B], { fill: C.blueFill, color: 'none', w: 0 })));
  out.push(seg(A, D, { dash: '6 4', color: C.soft }), seg(D, Cc, { dash: '6 4', color: C.soft }));
  out.push(poly([A, Cc, B]));
  out.push(rightAngle(Cc, B, A));
  out.push(tick(Cc, B, 1, { color: C.blue }), tick(D, Cc, 1, { color: C.blue }));
  out.push(angleMark(A, Cc, B, { r: 30 }), text(A[0] + 12, A[1] + 56, '30°', { color: C.emph, size: 12 }));
  out.push(angleMark(B, A, Cc, { r: 20, color: C.blue }), text(B[0] - 34, B[1] - 10, '60°', { color: C.blue, size: 12 }));
  out.push(label(A, 'A', 0, -10), label(B, 'B', 10, 16), label(Cc, 'C', 0, 18), label(D, 'D', -10, 16));
  files['symmetry-isosceles-30.svg'] = svg(360, 235, out.join('\n'));
}

// ---------- 例 3：AB = AC，BD = CE。题干图只画已知条件，证法二的图再加上 AF ----------
{
  const A = [180, 30], B = [40, 200], Cc = [320, 200], D = [110, 200], E = [250, 200], F = [180, 200];
  const fig = axis => {
    const out = [];
    if (axis) out.push(seg(A, F, { color: C.blue, w: 1.5, dash: '6 4' }), rightAngle(F, Cc, A));
    out.push(poly([A, B, Cc]), seg(A, D, { color: C.emph, w: 2.5 }), seg(A, E, { color: C.emph, w: 2.5 }));
    out.push(tick(A, B, 1), tick(A, Cc, 1), tick(B, D, 2, { color: C.ink }), tick(E, Cc, 2, { color: C.ink }));
    if (axis) out.push(tick(D, F, 3, { color: C.blue }), tick(F, E, 3, { color: C.blue }));
    out.push(dot(...D), dot(...E));
    out.push(label(A, 'A', 0, -8), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 0, 18), label(E, 'E', 0, 18));
    if (axis) out.push(label(F, 'F', 0, 18));
    return svg(360, 225, out.join('\n'));
  };
  files['symmetry-isosceles-example.svg'] = fig(false);
  files['symmetry-isosceles-example-axis.svg'] = fig(true);
}

// ---------- 例 4：30° 角与角平分线 ----------
{
  const ac = 264, bc = ac / Math.sqrt(3), cd = bc / Math.sqrt(3);
  const A = [40, 200], Cc = [40 + ac, 200], B = [40 + ac, 200 - bc], D = [40 + ac - cd, 200];
  const out = [];
  out.push(poly([A, B, Cc]), seg(B, D, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(Cc, A, B));
  out.push(angleMark(A, Cc, B, { r: 40, color: C.ink }), text(A[0] + 46, A[1] - 6, '30°', { size: 12 }));
  out.push(angleMark(B, A, D, { r: 26 }), angleMark(B, D, Cc, { r: 30 }));
  out.push(label(A, 'A', -10, 16), label(B, 'B', 10, -4), label(Cc, 'C', 10, 16), label(D, 'D', 0, 18));
  files['symmetry-isosceles-30-example.svg'] = svg(340, 225, out.join('\n'));
}

// ---------- 大边对大角 ----------
{
  const A = [110, 40], B = [40, 190], Cc = [340, 190];
  const ab = Math.hypot(B[0] - A[0], B[1] - A[1]), acl = Math.hypot(Cc[0] - A[0], Cc[1] - A[1]);
  const D = along(A, Cc, ab / acl);
  const out = [];
  out.push(poly([A, B, Cc]), seg(B, D, { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(tick(A, B, 1), tick(A, D, 1));
  out.push(angleMark(B, A, D, { r: 26 }), angleMark(D, B, A, { r: 20 }));
  out.push(angleMark(Cc, A, B, { r: 34, color: C.blue }));
  out.push(dot(...D));
  out.push(label(A, 'A', 0, -10), label(B, 'B', -10, 16), label(Cc, 'C', 10, 16), label(D, 'D', 10, -6));
  files['symmetry-isosceles-larger-side.svg'] = svg(370, 215, out.join('\n'));
}

// ---------- 最短路径：同侧两点到直线上一点 ----------
{
  const ly = 170, A = [80, 60], B = [330, 110], B2 = [330, 2 * ly - 110];
  const t = (ly - A[1]) / (B2[1] - A[1]), P = along(A, B2, t);
  const x0 = 150, x1 = 370, dur = 8, kt = '0;0.1;0.5;0.6;1';
  const vals = `${x0};${x0};${x1};${x1};${x0}`;
  const out = [];
  out.push(line(20, ly, 420, ly, { color: C.ink, w: 2 }), text(405, ly - 8, 'l', { italic: true }));
  out.push(seg(B, B2, { color: C.soft, w: 1, dash: '3 4' }), rightAngle([B[0], ly], B, [420, ly], { size: 8 }));
  // 任意一点 P′ 的路线（动）
  const mv = (attr) => `<animate attributeName="${attr}" values="${vals}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  out.push(`<line x1="${A[0]}" y1="${A[1]}" x2="${x0}" y2="${ly}" stroke="${C.soft}" stroke-width="1.5" stroke-dasharray="5 4">${mv('x2')}</line>`);
  out.push(`<line x1="${x0}" y1="${ly}" x2="${B[0]}" y2="${B[1]}" stroke="${C.soft}" stroke-width="1.5" stroke-dasharray="5 4">${mv('x1')}</line>`);
  out.push(`<line x1="${x0}" y1="${ly}" x2="${B2[0]}" y2="${B2[1]}" stroke="${C.soft}" stroke-width="1" stroke-dasharray="2 4">${mv('x1')}</line>`);
  out.push(`<circle cx="${x0}" cy="${ly}" r="4" fill="${C.soft}">${mv('cx')}</circle>`);
  out.push(`<text x="${x0}" y="${ly + 20}" fill="${C.soft}" font-style="italic" text-anchor="middle">P′${mv('x')}</text>`);
  // 最短路线
  out.push(seg(A, P, { color: C.emph, w: 2.5 }), seg(P, B, { color: C.emph, w: 2.5 }), seg(P, B2, { color: C.emph, w: 1.5, dash: '6 4' }));
  out.push(dot(...A), dot(...B), dot(...B2), dot(...P, C.emph));
  out.push(label(A, 'A', -10, -6), label(B, 'B', 10, -6), label(B2, 'B′', 12, 12), label(P, 'P', -2, -12, { color: C.emph }));
  files['symmetry-isosceles-shortest.svg'] = svg(440, 250, out.join('\n'));
  // 题干图：只有河 l 和同侧的两个村庄 A、B
  files['symmetry-isosceles-shortest-question.svg'] = svg(440, 200, [line(20, ly, 420, ly, { color: C.ink, w: 2 }), text(405, ly - 8, 'l', { italic: true }), dot(...A), dot(...B), label(A, 'A', -10, -6), label(B, 'B', 10, -6)].join('\n'));
}

// ---------- 最短路径：造桥选址 ----------
{
  const y1 = 110, y2 = 150, A = [70, 40], B = [330, 225], A2 = [A[0], A[1] + (y2 - y1)];
  const N = along(A2, B, (y2 - A2[1]) / (B[1] - A2[1])), M = [N[0], y1];
  const out = [];
  out.push(`<rect x="20" y="${y1}" width="380" height="${y2 - y1}" fill="${C.blueFill}" stroke="none"/>`);
  out.push(line(20, y1, 400, y1, { w: 1.5 }), line(20, y2, 400, y2, { w: 1.5 }));
  out.push(text(392, y1 + 25, '河', { anchor: 'end', color: C.blue, size: 13 }));
  out.push(seg(A, A2, { color: C.blue, w: 1.5, dash: '5 4' }), seg(A2, N, { color: C.blue, w: 1.5, dash: '5 4' }));
  out.push(seg(A, M, { color: C.emph, w: 2.5 }), seg(M, N, { color: C.emph, w: 3 }), seg(N, B, { color: C.emph, w: 2.5 }));
  out.push(rightAngle(N, [400, y2], M, { size: 8 }));
  out.push(dot(...A), dot(...B), dot(...A2, C.blue), dot(...M), dot(...N));
  out.push(label(A, 'A', -12, 0), label(B, 'B', 12, 4), label(A2, 'A′', -14, 6, { color: C.blue }), label(M, 'M', 4, -8), label(N, 'N', -10, 18));
  files['symmetry-isosceles-bridge.svg'] = svg(420, 245, out.join('\n'));
}

export default files;
