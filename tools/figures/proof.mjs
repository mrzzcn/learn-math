// 第一部分“怎样证明”的图。
import { C, f, svg, text, line, dot, poly, angleMark, rightAngle, tick, rad, dir } from './lib.mjs';

const files = {};

// ---------- 例 1：垂直于同一条直线的两条直线平行 ----------
{
  const x = 190, ya = 70, yb = 170;
  const out = [line(x, 25, x, 215), line(30, ya, 380, ya), line(30, yb, 380, yb)];
  out.push(rightAngle([x, ya], [380, ya], [x, 25], { color: C.emph, size: 14 }), rightAngle([x, yb], [380, yb], [x, 25], { color: C.emph, size: 14 }));
  out.push(text(x + 24, ya - 20, '1', { anchor: 'middle', color: C.emph }), text(x + 24, yb - 20, '2', { anchor: 'middle', color: C.emph }));
  out.push(text(386, ya + 5, 'a', { italic: true }), text(386, yb + 5, 'b', { italic: true }), text(x + 8, 32, 'c', { italic: true }));
  out.push(dot(x, ya), dot(x, yb));
  out.push(text(x - 8, ya + 20, 'M', { anchor: 'end', italic: true }), text(x - 8, yb + 20, 'N', { anchor: 'end', italic: true }));
  files['proof-perpendicular.svg'] = svg(410, 230, out.join('\n'));
}

// ---------- 例 2：B、E、C、F 在同一直线上 ----------
{
  const y = 170, sh = 110;
  const B = [30, y], Cc = [200, y], A = [140, 45];
  const E = [B[0] + sh, y], F = [Cc[0] + sh, y], D = [A[0] + sh, A[1]];
  const out = [line(B[0] - 10, y, F[0] + 10, y, { color: C.soft, w: 1 })];
  out.push(poly([A, B, Cc]), poly([D, E, F]));
  out.push(line(...B, ...E, { color: C.blue, w: 4 }), line(...Cc, ...F, { color: C.blue, w: 4 }));
  out.push(tick(A, B, 1), tick(D, E, 1), tick(A, Cc, 2), tick(D, F, 2));
  out.push(angleMark(A, B, Cc, { r: 22, color: C.emph }), angleMark(D, E, F, { r: 22, color: C.emph }));
  for (const p of [A, B, Cc, D, E, F]) out.push(dot(...p, C.ink, 3));
  out.push(text(A[0], A[1] - 10, 'A', { anchor: 'middle', italic: true }), text(D[0], D[1] - 10, 'D', { anchor: 'middle', italic: true }));
  out.push(text(B[0], y + 20, 'B', { anchor: 'middle', italic: true }), text(E[0], y + 20, 'E', { anchor: 'middle', italic: true }));
  out.push(text(Cc[0], y + 20, 'C', { anchor: 'middle', italic: true }), text(F[0], y + 20, 'F', { anchor: 'middle', italic: true }));
  files['proof-analysis.svg'] = svg(340, 200, out.join('\n'));
}

// ---------- 例 3：三角形内角和，过 A 作 BC 的平行线 ----------
{
  const A = [170, 50], B = [60, 190], Cc = [340, 190];
  const D = [30, A[1]], E = [390, A[1]];
  const out = [line(D[0], D[1], E[0], E[1], { color: C.soft, w: 1.5, dash: '6 4' }), poly([A, B, Cc])];
  const r = 30;
  // 扇形：顶点 v，从方向 a0 转到 a1（度）
  const wedge = (v, a0, a1, fill) => {
    const p0 = [v[0] + r * Math.cos(rad(a0)), v[1] - r * Math.sin(rad(a0))], p1 = [v[0] + r * Math.cos(rad(a1)), v[1] - r * Math.sin(rad(a1))];
    return `<path d="M ${f(v[0])} ${f(v[1])} L ${f(p0[0])} ${f(p0[1])} A ${r} ${r} 0 0 ${a1 > a0 ? 0 : 1} ${f(p1[0])} ${f(p1[1])} Z" fill="${fill}" stroke="none"/>`;
  };
  const dB = dir(B, A), dC = dir(Cc, A);
  // 静态记号
  out.push(angleMark(B, Cc, A, { r, color: C.blue }), angleMark(A, D, B, { r, color: C.blue }));
  out.push(angleMark(Cc, A, B, { r, n: 2, color: C.emph }), angleMark(A, Cc, E, { r, n: 2, color: C.emph }));
  out.push(angleMark(A, B, Cc, { r: 18, color: C.ink }));
  // 动画：∠B 绕 AB 中点转 180°，∠C 绕 AC 中点转 180°，落到 A 处（初始画成落到 A 处的样子）
  const mAB = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], mAC = [(A[0] + Cc[0]) / 2, (A[1] + Cc[1]) / 2];
  const kt = 'keyTimes="0;0.15;0.45;0.6;0.9;1"';
  const spin = m => `values="180 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])};0 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])};180 ${f(m[0])} ${f(m[1])}"`;
  out.push(`<g transform="rotate(180 ${f(mAB[0])} ${f(mAB[1])})">${wedge(B, 0, dB, C.blueFill)}<animateTransform attributeName="transform" type="rotate" ${spin(mAB)} ${kt} dur="8s" repeatCount="indefinite"/></g>`);
  out.push(`<g transform="rotate(180 ${f(mAC[0])} ${f(mAC[1])})">${wedge(Cc, dC, 180, C.emphFill)}<animateTransform attributeName="transform" type="rotate" ${spin(mAC)} ${kt} dur="8s" repeatCount="indefinite"/></g>`);
  // 数字标号
  const lab = (v, deg, s, col, rr = 44) => text(v[0] + rr * Math.cos(rad(deg)), v[1] - rr * Math.sin(rad(deg)) + 5, s, { anchor: 'middle', color: col, size: 13 });
  out.push(lab(A, (180 + dir(A, B) + 360) / 2, '1', C.blue), lab(A, dir(A, Cc) / 2, '2', C.emph), lab(A, (dir(A, B) + 360 + dir(A, Cc) + 360) / 2, '3', C.ink, 34));
  out.push(text(A[0], A[1] - 10, 'A', { anchor: 'middle', italic: true }), text(B[0] - 8, B[1] + 16, 'B', { anchor: 'end', italic: true }), text(Cc[0] + 8, Cc[1] + 16, 'C', { italic: true }));
  out.push(text(D[0], D[1] - 8, 'D', { italic: true }), text(E[0], E[1] - 8, 'E', { anchor: 'end', italic: true }));
  files['proof-angle-sum.svg'] = svg(420, 220, out.join('\n'));
}

// ---------- 例 5：两个连续奇数的平方差（n = 3：7² − 5²） ----------
{
  const u = 24, x0 = 30, y0 = 40, big = 7, small = 5;
  const out = [];
  // 小正方形 5 × 5 放在左下角；上方 2 × 7 的长条、右侧 5 × 2 的长条合成 L 形
  out.push(`<rect x="${x0}" y="${y0 + (big - small) * u}" width="${small * u}" height="${small * u}" fill="${C.grid}" stroke="none"/>`);
  out.push(`<rect x="${x0}" y="${y0}" width="${big * u}" height="${(big - small) * u}" fill="${C.emphFill}" stroke="none"/>`);
  out.push(`<rect x="${x0 + small * u}" y="${y0 + (big - small) * u}" width="${(big - small) * u}" height="${small * u}" fill="${C.blueFill}" stroke="none"/>`);
  for (let i = 0; i <= big; i++) {
    out.push(line(x0 + i * u, y0, x0 + i * u, y0 + big * u, { color: C.soft, w: 0.6 }));
    out.push(line(x0, y0 + i * u, x0 + big * u, y0 + i * u, { color: C.soft, w: 0.6 }));
  }
  out.push(`<rect x="${x0}" y="${y0}" width="${big * u}" height="${big * u}" fill="none" stroke="${C.ink}" stroke-width="2"/>`);
  out.push(`<rect x="${x0}" y="${y0 + (big - small) * u}" width="${small * u}" height="${small * u}" fill="none" stroke="${C.ink}" stroke-width="2"/>`);
  out.push(line(x0 + small * u, y0 + (big - small) * u, x0 + big * u, y0 + (big - small) * u, { color: C.ink, w: 1.5, dash: '4 3' }));
  // 尺寸
  const bg = (cx, cy, w) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 11)}" width="${w}" height="18" rx="3" fill="#ffffff" fill-opacity="0.85" stroke="none"/>`;
  out.push(bg(x0 + small * u / 2, y0 + (big - small) * u + small * u / 2, 44), bg(x0 + big * u / 2, y0 + u, 44), bg(x0 + small * u + u, y0 + (big - small) * u + small * u / 2, 40));
  out.push(text(x0 + big * u / 2, y0 - 10, '7', { anchor: 'middle' }));
  out.push(text(x0 + small * u / 2, y0 + (big - small) * u + small * u / 2 + 5, '5 × 5', { anchor: 'middle', color: C.soft }));
  out.push(text(x0 + big * u / 2, y0 + u + 5, '2 × 7', { anchor: 'middle', color: C.emph }));
  out.push(text(x0 + small * u + u, y0 + (big - small) * u + small * u / 2 + 5, '2 × 5', { anchor: 'middle', color: C.blue, size: 12 }));
  files['proof-odd-squares.svg'] = svg(230, 220, out.join('\n'));
}

export default files;
