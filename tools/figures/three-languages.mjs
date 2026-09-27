// 第一部分“三种数学语言”的图。
import { C, f, svg, text, line, dot, poly, angleMark, rightAngle, dir } from './lib.mjs';

const files = {};

// ---------- 分配律的图形语言：a(b + c) = ab + ac ----------
{
  const x0 = 60, y0 = 40, h = 100, wb = 160, wc = 110;
  const out = [];
  out.push(`<rect x="${x0}" y="${y0}" width="${wb}" height="${h}" fill="${C.blueFill}" stroke="none"/>`);
  out.push(`<rect x="${x0 + wb}" y="${y0}" width="${wc}" height="${h}" fill="${C.emphFill}" stroke="none"/>`);
  out.push(`<rect x="${x0}" y="${y0}" width="${wb + wc}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="2"/>`);
  out.push(line(x0 + wb, y0, x0 + wb, y0 + h, { color: C.ink, w: 1.5, dash: '6 4' }));
  // 边长
  out.push(text(x0 - 12, y0 + h / 2 + 5, 'a', { anchor: 'end', italic: true }));
  out.push(text(x0 + wb / 2, y0 - 10, 'b', { anchor: 'middle', italic: true, color: C.blue }));
  out.push(text(x0 + wb + wc / 2, y0 - 10, 'c', { anchor: 'middle', italic: true, color: C.emph }));
  // 面积
  out.push(text(x0 + wb / 2, y0 + h / 2 + 5, 'ab', { anchor: 'middle', italic: true, color: C.blue, size: 16 }));
  out.push(text(x0 + wb + wc / 2, y0 + h / 2 + 5, 'ac', { anchor: 'middle', italic: true, color: C.emph, size: 16 }));
  // 下方总长 b + c
  const yb = y0 + h + 18;
  const mid = x0 + (wb + wc) / 2;
  out.push(line(x0, yb, mid - 28, yb, { color: C.soft, w: 1 }), line(mid + 28, yb, x0 + wb + wc, yb, { color: C.soft, w: 1 }));
  out.push(line(x0, yb - 5, x0, yb + 5, { color: C.soft, w: 1 }), line(x0 + wb + wc, yb - 5, x0 + wb + wc, yb + 5, { color: C.soft, w: 1 }));
  out.push(text(x0 + (wb + wc) / 2, yb + 5, 'b + c', { anchor: 'middle', italic: true }));
  files['three-languages-distributive.svg'] = svg(360, 190, out.join('\n'));
}

// ---------- 用字母表示规律：摆正方形用的火柴 ----------
{
  const s = 58, x0 = 40, y0 = 36, gap = 4, n = 4;
  const stick = (a, b, col) => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    const p = [a[0] + gap * u[0], a[1] + gap * u[1]], q = [b[0] - gap * u[0], b[1] - gap * u[1]];
    return line(p[0], p[1], q[0], q[1], { color: col, w: 5, extra: ' stroke-linecap="round"' }) + dot(q[0], q[1], C.ink, 3.5);
  };
  const out = [];
  const dur = 8;
  for (let i = 0; i < n; i++) {
    const L = x0 + i * s, R = L + s, T = y0, B = y0 + s;
    const col = i === 0 ? C.blue : C.emph;
    const g = [];
    if (i === 0) g.push(stick([L, B], [L, T], col));
    g.push(stick([L, T], [R, T], col), stick([R, T], [R, B], col), stick([L, B], [R, B], col));
    g.push(text((L + R) / 2, B + 26, i === 0 ? '4' : '+ 3', { anchor: 'middle', color: col }));
    if (i === 0) out.push(g.join(''));
    else {
      const t0 = f(0.1 + i * 0.15), t1 = f(0.1 + i * 0.15 + 0.06);
      out.push(`<g>${g.join('')}<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${t0};${t1};1" dur="${dur}s" repeatCount="indefinite"/></g>`);
    }
  }
  out.push(text(x0 + n * s + 18, y0 + s / 2 + 5, '……', { color: C.soft }));
  files['three-languages-matches.svg'] = svg(340, 135, out.join('\n'));
}

// ---------- 几何命题的翻译：同旁内角的平分线互相垂直 ----------
{
  const yAB = 50, yCD = 200;
  const M = [150, yAB], N = [215, yCD];
  const out = [];
  const xl = 30, xr = 420;
  out.push(line(xl, yAB, xr, yAB), line(xl, yCD, xr, yCD));
  // 直线 EF
  const u = [(N[0] - M[0]), (N[1] - M[1])], ul = Math.hypot(...u);
  const e = [u[0] / ul, u[1] / ul];
  const E = [M[0] - 34 * e[0], M[1] - 34 * e[1]], F = [N[0] + 34 * e[0], N[1] + 34 * e[1]];
  out.push(line(E[0], E[1], F[0], F[1]));
  // 两条角平分线
  const aM = dir(M, N) / 2; // ∠BMN 的一半（MB 方向为 0 度）
  const aN = dir(N, M) / 2; // ∠DNM 的一半（ND 方向为 0 度）
  // 求交点 G：M + t(cos aM, −sin aM) = N + s(cos aN, −sin aN)
  const r = d => (d * Math.PI) / 180;
  const d1 = [Math.cos(r(aM)), -Math.sin(r(aM))], d2 = [Math.cos(r(aN)), -Math.sin(r(aN))];
  const det = d1[0] * -d2[1] - d1[1] * -d2[0];
  const t = ((N[0] - M[0]) * -d2[1] - (N[1] - M[1]) * -d2[0]) / det;
  const G = [M[0] + t * d1[0], M[1] + t * d1[1]];
  out.push(line(M[0], M[1], G[0], G[1], { color: C.emph, w: 2.5 }), line(N[0], N[1], G[0], G[1], { color: C.blue, w: 2.5 }));
  const B = [xr, yAB], D = [xr, yCD];
  out.push(angleMark(M, B, G, { r: 26, color: C.emph }), angleMark(M, G, N, { r: 26, color: C.emph }));
  out.push(angleMark(N, D, G, { r: 22, n: 2, color: C.blue }), angleMark(N, G, M, { r: 22, n: 2, color: C.blue }));
  // 不画直角记号：MG ⊥ NG 是要证的结论，不是已知
  // 角的标号：∠1 = ∠2（M 处），∠3 = ∠4（N 处，∠3 挨着 ND）
  const lab = (v, a, b, s, col, rr) => { const d = (dir(v, a) + dir(v, b)) / 2, rr2 = rr; return text(v[0] + rr2 * Math.cos(d * Math.PI / 180), v[1] - rr2 * Math.sin(d * Math.PI / 180) + 5, s, { anchor: 'middle', color: col, size: 13 }); };
  out.push(lab(M, B, G, '1', C.emph, 40), lab(M, G, N, '2', C.emph, 40), lab(N, D, G, '3', C.blue, 40), lab(N, G, M, '4', C.blue, 40));
  out.push(dot(...M), dot(...N), dot(...G));
  out.push(text(xl - 4, yAB + 5, 'A', { anchor: 'end', italic: true }), text(xr + 6, yAB + 5, 'B', { italic: true }));
  out.push(text(xl - 4, yCD + 5, 'C', { anchor: 'end', italic: true }), text(xr + 6, yCD + 5, 'D', { italic: true }));
  out.push(text(E[0] - 6, E[1] - 2, 'E', { anchor: 'end', italic: true }), text(F[0] + 6, F[1] + 8, 'F', { italic: true }));
  out.push(text(M[0] - 8, M[1] - 8, 'M', { anchor: 'end', italic: true }), text(N[0] - 8, N[1] + 18, 'N', { anchor: 'end', italic: true }));
  out.push(text(G[0] + 10, G[1] + 5, 'G', { italic: true }));
  files['three-languages-bisectors.svg'] = svg(450, 240, out.join('\n'));
}

export default files;
