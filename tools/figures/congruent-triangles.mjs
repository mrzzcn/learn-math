// 第五部分“全等三角形”的图。
import { C, f, svg, text, line, dot, poly, axes } from './lib.mjs';

const files = {};
// ---------- 全等：平移、旋转后重合 ----------
{
  const A = [70, 40], B = [30, 150], Cc = [170, 150];
  const g = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3].map(f);
  const tri = (fill, col, dash) => poly([A, B, Cc], { fill, color: col, dash });
  const out = [];
  out.push(tri('none', C.ink));
  out.push(text(A[0], A[1] - 8, 'A', { anchor: 'middle', italic: true }), text(B[0] - 8, B[1] + 16, 'B', { italic: true }), text(Cc[0] + 4, Cc[1] + 16, 'C', { italic: true }));
  const moving = [tri(C.blueFill, C.blue), text(A[0], A[1] - 8, 'D', { anchor: 'middle', italic: true, color: C.blue }), text(B[0] - 14, B[1] + 2, 'E', { italic: true, color: C.blue }), text(Cc[0] + 8, Cc[1] + 2, 'F', { italic: true, color: C.blue })].join('');
  const rot = `${g[0]} ${g[1]}`;
  const kt = '0;0.15;0.5;0.8;1';
  out.push(`<g transform="translate(250 20) rotate(40 ${rot})">${moving}<animateTransform attributeName="transform" type="translate" values="250 20;250 20;0 0;0 0;250 20" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" additive="sum" values="40 ${rot};40 ${rot};0 ${rot};0 ${rot};40 ${rot}" keyTimes="${kt}" dur="7s" repeatCount="indefinite"/></g>`);
  files['congruent-overlap.svg'] = svg(460, 235, out.join('\n'));
}

// ---------- 全等：SSA 不能判定 ----------
{
  const A = [150, 60], B = [40, 170], r = 115;
  const dx = Math.sqrt(r * r - (B[1] - A[1]) ** 2);
  const C1 = [A[0] - dx, B[1]], C2 = [A[0] + dx, B[1]];
  const th = f(Math.asin(dx / r) * 180 / Math.PI);
  const out = [];
  out.push(line(B[0], B[1], 330, B[1], { color: C.ink, w: 2 }));
  out.push(`<path d="M ${f(C1[0])} ${f(C1[1])} A ${r} ${r} 0 0 0 ${f(C2[0])} ${f(C2[1])}" stroke="${C.soft}" stroke-width="1" stroke-dasharray="4 4"/>`);
  out.push(poly([A, B, C2], { color: C.ink }));
  out.push(line(A[0], A[1], C1[0], C1[1], { color: C.ink, w: 2, dash: '6 4' }));
  // ∠B 的记号
  const ang = Math.atan2(B[1] - A[1], A[0] - B[0]);
  out.push(`<path d="M ${B[0] + 26} ${B[1]} A 26 26 0 0 0 ${f(B[0] + 26 * Math.cos(ang))} ${f(B[1] - 26 * Math.sin(ang))}" stroke="${C.emph}" stroke-width="2"/>`);
  // 摆动的边 AC
  out.push(`<g transform="rotate(${-th} ${A[0]} ${A[1]})">${line(A[0], A[1], A[0], A[1] + r, { color: C.emph, w: 3 })}${dot(A[0], A[1] + r, C.emph)}<animateTransform attributeName="transform" type="rotate" values="${-th} ${A[0]} ${A[1]};${-th} ${A[0]} ${A[1]};${th} ${A[0]} ${A[1]};${th} ${A[0]} ${A[1]};${-th} ${A[0]} ${A[1]}" keyTimes="0;0.2;0.5;0.7;1" dur="6s" repeatCount="indefinite"/></g>`);
  out.push(dot(C1[0], C1[1]), dot(C2[0], C2[1]));
  out.push(text(A[0], A[1] - 10, 'A', { anchor: 'middle', italic: true }), text(B[0] - 6, B[1] + 18, 'B', { italic: true }));
  out.push(text(C1[0], C1[1] + 20, 'C′', { anchor: 'middle', italic: true }), text(C2[0], C2[1] + 20, 'C', { anchor: 'middle', italic: true }));
  files['congruent-ssa.svg'] = svg(360, 200, out.join('\n'));
}

// ---------- 角平分线的性质 ----------
{
  const O = [40, 180], rad = d => d * Math.PI / 180;
  const at = (len, deg) => [O[0] + len * Math.cos(rad(deg)), O[1] - len * Math.sin(rad(deg))];
  const P = at(200, 20), D = [P[0], O[1]], E = at(200 * Math.cos(rad(20)), 40);
  const out = [];
  out.push(line(O[0], O[1], 360, O[1]), line(O[0], O[1], ...at(250, 40)));
  out.push(line(O[0], O[1], ...at(300, 20), { color: C.blue, w: 1.5, dash: '6 4' }));
  out.push(line(P[0], P[1], D[0], D[1], { color: C.emph, w: 2.5 }), line(P[0], P[1], E[0], E[1], { color: C.emph, w: 2.5 }));
  // 直角记号
  out.push(`<polyline points="${f(D[0] - 10)},${D[1]} ${f(D[0] - 10)},${D[1] - 10} ${f(D[0])},${D[1] - 10}" stroke="${C.ink}" stroke-width="1.2"/>`);
  const u1 = [-Math.cos(rad(40)), Math.sin(rad(40))], u2 = [(P[0] - E[0]) / 68.4, (P[1] - E[1]) / 68.4];
  const q = (a, b) => [E[0] + 10 * a[0] + 10 * b[0], E[1] + 10 * a[1] + 10 * b[1]];
  out.push(`<polyline points="${f(E[0] + 10 * u1[0])},${f(E[1] + 10 * u1[1])} ${q(u1, u2).map(f).join(',')} ${f(E[0] + 10 * u2[0])},${f(E[1] + 10 * u2[1])}" stroke="${C.ink}" stroke-width="1.2"/>`);
  // ∠AOC 和 ∠BOC 的记号
  const arc = (r, a0, a1) => { const p0 = at(r, a0), p1 = at(r, a1); return `<path d="M ${f(p0[0])} ${f(p0[1])} A ${r} ${r} 0 0 0 ${f(p1[0])} ${f(p1[1])}" stroke="${C.blue}" stroke-width="1.5"/>`; };
  out.push(arc(34, 0, 20), arc(40, 20, 40));
  // 相等记号：PD、PE 中点各一条短线
  const tick = (a, b) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; return line(m[0] - 6 * n[0], m[1] - 6 * n[1], m[0] + 6 * n[0], m[1] + 6 * n[1], { color: C.emph, w: 2 }); };
  out.push(tick(P, D), tick(P, E));
  out.push(dot(...P), dot(...D), dot(...E));
  const B = at(250, 40), Cp = at(300, 20);
  out.push(text(O[0] - 8, O[1] + 16, 'O', { italic: true }), text(350, O[1] + 18, 'A', { italic: true }), text(B[0] + 6, B[1] + 4, 'B', { italic: true }), text(Cp[0] + 6, Cp[1] + 4, 'C', { italic: true, color: C.blue }));
  out.push(text(P[0] + 8, P[1] + 2, 'P', { italic: true }), text(D[0] - 4, D[1] + 18, 'D', { italic: true }), text(E[0] - 16, E[1] - 2, 'E', { italic: true }));
  files['congruent-bisector.svg'] = svg(380, 200, out.join('\n'));
}


// ---------- 例题：AB = AD，CB = CD ----------
{
  const A = [40, 110], B = [150, 30], Cc = [320, 110], D = [150, 190];
  const tick = (a, b, n = 1) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(b[0] - a[0], b[1] - a[1]); const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn = [-u[1], u[0]]; let o = ''; for (let i = 0; i < n; i++) { const c = [m[0] + (i - (n - 1) / 2) * 5 * u[0], m[1] + (i - (n - 1) / 2) * 5 * u[1]]; o += line(c[0] - 6 * nn[0], c[1] - 6 * nn[1], c[0] + 6 * nn[0], c[1] + 6 * nn[1], { color: C.emph, w: 2 }); } return o; };
  // 题干图只画已知条件；解法中连接 AC 的图另画一张
  for (const withAC of [false, true]) {
    const out = [poly([A, B, Cc, D])];
    if (withAC) out.push(line(A[0], A[1], Cc[0], Cc[1], { color: C.blue, w: 2, dash: '6 4' }));
    out.push(tick(A, B), tick(A, D), tick(Cc, B, 2), tick(Cc, D, 2));
    out.push(text(A[0] - 14, A[1] + 5, 'A', { italic: true }), text(B[0], B[1] - 8, 'B', { anchor: 'middle', italic: true }), text(Cc[0] + 6, Cc[1] + 5, 'C', { italic: true }), text(D[0], D[1] + 18, 'D', { anchor: 'middle', italic: true }));
    files[withAC ? 'congruent-example-ac.svg' : 'congruent-example.svg'] = svg(350, 215, out.join('\n'));
  }
}

// ---------- HL：直角时两个交点对称 ----------
{
  const Cc = [150, 160], A = [150, 50], r = 150;
  const d = Math.sqrt(r * r - (Cc[1] - A[1]) ** 2);
  const B1 = [Cc[0] + d, Cc[1]], B2 = [Cc[0] - d, Cc[1]];
  const out = [line(20, Cc[1], 300, Cc[1], { color: C.soft, w: 1.5 })];
  out.push(`<path d="M ${f(B2[0])} ${f(B2[1])} A ${r} ${r} 0 0 1 ${f(B1[0])} ${f(B1[1])}" stroke="${C.soft}" stroke-width="1" stroke-dasharray="4 4"/>`);
  out.push(poly([A, Cc, B1]), line(A[0], A[1], B2[0], B2[1], { dash: '6 4' }), line(B2[0], B2[1], Cc[0], Cc[1], { dash: '6 4' }));
  out.push(line(A[0], A[1], Cc[0], Cc[1], { color: C.blue, w: 3 }), line(A[0], A[1], B1[0], B1[1], { color: C.emph, w: 3 }));
  out.push(`<polyline points="${Cc[0] + 10},${Cc[1]} ${Cc[0] + 10},${Cc[1] - 10} ${Cc[0]},${Cc[1] - 10}" stroke="${C.ink}" stroke-width="1.2"/>`);
  out.push(text(A[0], A[1] - 10, 'A', { anchor: 'middle', italic: true }), text(Cc[0], Cc[1] + 20, 'C', { anchor: 'middle', italic: true }), text(B1[0], B1[1] + 20, 'B', { anchor: 'middle', italic: true }), text(B2[0], B2[1] + 20, 'B′', { anchor: 'middle', italic: true }));
  files['congruent-hl.svg'] = svg(320, 190, out.join('\n'));
}



export default files;
