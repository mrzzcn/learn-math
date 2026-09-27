// 第七部分“反比例函数”的图。
import { C, f, svg, text, line, dot, poly, axes, plot } from './lib.mjs';

const files = {};
const hyper = (k, X, Y, o, lim = 7.5, ymax = 7.5) =>
  plot(x => k / x, -lim, -0.01, X, Y, { ...o, n: 600, ymin: -ymax, ymax }) + plot(x => k / x, 0.01, lim, X, Y, { ...o, n: 600, ymin: -ymax, ymax });

// ---------- y = 6/x 的图象：描出的点连成两支曲线 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 180, u: 22, xmin: -7.5, xmax: 7.5, ymin: -7.5, ymax: 7.5 });
  const out = [body];
  out.push(hyper(6, X, Y, { color: C.blue, w: 2.5 }, 7.3, 7.3));
  for (const x of [-6, -3, -2, -1, 1, 2, 3, 6]) out.push(dot(X(x), Y(6 / x), C.emph, 4));
  out.push(text(X(4.6), Y(2.6) - 4, 'y = 6/x', { color: C.blue, size: 13 }));
  files['inverse-proportion-graph.svg'] = svg(360, 360, out.join('\n'));
}

// ---------- k 的正负和大小（依次高亮） ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 180, u: 22, xmin: -7.5, xmax: 7.5, ymin: -7.5, ymax: 7.5, ticks: false });
  const out = [body];
  const ks = [1, 6, -1, -6];
  const col = k => (k > 0 ? C.blue : C.emph);
  const lab = k => `k = ${k < 0 ? '−' + -k : k}`;
  // 全部画成淡虚线，并标出和直线 y = x 或 y = −x 的交点附近
  for (const k of ks) {
    out.push(hyper(k, X, Y, { color: col(k), w: 1.2, dash: '5 4' }, 7.3, 7.3));
    const r = Math.sqrt(Math.abs(k));
    const px = k > 0 ? r : -r, py = k > 0 ? r : r; // 第一或第二象限那一支上离原点最近的点
    out.push(text(X(px) + (k > 0 ? 8 : -8), Y(py) - (Math.abs(k) === 1 ? 2 : 6), lab(k), { anchor: k > 0 ? 'start' : 'end', color: col(k), size: 12 }));
  }
  // 依次高亮
  const dur = ks.length * 2;
  ks.forEach((k, i) => {
    const vals = ks.map((_, j) => (j === i ? 1 : 0)).join(';');
    out.push(`<g opacity="${i === 1 ? 1 : 0}">${hyper(k, X, Y, { color: col(k), w: 3 }, 7.3, 7.3)}<animate attributeName="opacity" values="${vals}" dur="${dur}s" calcMode="discrete" repeatCount="indefinite"/></g>`);
  });
  files['inverse-proportion-k.svg'] = svg(360, 360, out.join('\n'));
}

// ---------- 对称性：关于原点中心对称，关于 y = x 轴对称 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 180, u: 22, xmin: -7.5, xmax: 7.5, ymin: -7.5, ymax: 7.5 });
  const out = [body];
  out.push(line(X(-7), Y(-7), X(7), Y(7), { color: C.soft, w: 1.2, dash: '5 4' }));
  out.push(text(X(7) - 12, Y(7) + 4, 'y = x', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(hyper(6, X, Y, { color: C.blue, w: 2.5 }, 7.3, 7.3));
  const P = [X(2), Y(3)], P1 = [X(-2), Y(-3)], Q = [X(3), Y(2)];
  out.push(line(P[0], P[1], P1[0], P1[1], { color: C.emph, w: 1.5, dash: '5 4' }));
  out.push(line(P[0], P[1], Q[0], Q[1], { color: C.ink, w: 1.2, dash: '3 3' }));
  out.push(dot(P[0], P[1], C.emph, 5), dot(P1[0], P1[1], C.emph, 5), dot(Q[0], Q[1], C.ink, 5), dot(X(0), Y(0), C.ink, 3));
  out.push(text(P[0] + 2, P[1] - 20, 'P', { anchor: 'middle', italic: true }));
  out.push(text(P1[0] - 8, P1[1] + 16, 'P′', { anchor: 'end', italic: true }));
  out.push(text(Q[0] + 8, Q[1] - 6, 'Q', { italic: true }));
  files['inverse-proportion-symmetry.svg'] = svg(360, 360, out.join('\n'));
}

// ---------- k 的几何意义：点 P 在曲线上移动，长方形面积始终是 6（动画） ----------
{
  const u = 36;
  const { X, Y, body } = axes({ ox: 40, oy: 280, u, xmin: 0, xmax: 7.3, ymin: 0, ymax: 7.3 });
  const out = [body];
  out.push(plot(x => 6 / x, 0.86, 6.95, X, Y, { color: C.blue, w: 2.5 }));
  // P 的横坐标：从 2 出发，在 1～6 之间来回
  const xs = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // 2 → 6 → 1 → 2，用对数刻度匀速移动，看起来更均匀
    const L = Math.log, E = Math.exp;
    let x;
    if (t < 0.35) x = E(L(2) + (L(6) - L(2)) * (t / 0.35));
    else if (t < 0.85) x = E(L(6) + (L(1) - L(6)) * ((t - 0.35) / 0.5));
    else x = E(L(1) + (L(2) - L(1)) * ((t - 0.85) / 0.15));
    xs.push(x);
  }
  const vals = fn => xs.map(x => f(fn(x))).join(';');
  const dur = 12;
  const anim = (a, fn) => `<animate attributeName="${a}" values="${vals(fn)}" dur="${dur}s" repeatCount="indefinite"/>`;
  const x0 = 2;
  out.push(`<rect x="${X(0)}" y="${f(Y(6 / x0))}" width="${f(x0 * u)}" height="${f((6 / x0) * u)}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2">${anim('y', x => Y(6 / x))}${anim('width', x => x * u)}${anim('height', x => (6 / x) * u)}</rect>`);
  // 对角线 OP：把长方形分成两个全等的直角三角形
  out.push(`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(x0)}" y2="${f(Y(6 / x0))}" stroke="${C.emph}" stroke-width="1.5" stroke-dasharray="5 4">${anim('x2', x => X(x))}${anim('y2', x => Y(6 / x))}</line>`);
  out.push(`<circle cx="${X(x0)}" cy="${f(Y(6 / x0))}" r="5" fill="${C.emph}" stroke="none">${anim('cx', x => X(x))}${anim('cy', x => Y(6 / x))}</circle>`);
  out.push(`<text x="${f(X(x0) + 8)}" y="${f(Y(6 / x0) - 8)}" fill="${C.ink}" stroke="none" font-style="italic">P${anim('x', x => X(x) + 8)}${anim('y', x => Y(6 / x) - 8)}</text>`);
  // 垂足 M（x 轴上）和 N（y 轴上）
  out.push(`<text x="${f(X(x0))}" y="${f(Y(0) + 32)}" fill="${C.ink}" stroke="none" font-style="italic" text-anchor="middle">M${anim('x', x => X(x))}</text>`);
  out.push(`<text x="${f(X(0) - 20)}" y="${f(Y(6 / x0) + 5)}" fill="${C.ink}" stroke="none" font-style="italic" text-anchor="end">N${anim('y', x => Y(6 / x) + 5)}</text>`);
  out.push(text(X(1.2) + 30, Y(6 / 1.2) + 6, 'y = 6/x', { color: C.blue, size: 13 }));
  // 面积 6 写在 OP 左上方的三角形 ONP 里，跟着长方形走
  out.push(`<text x="${f(X(0.3 * x0))}" y="${f(Y(0.62 * 6 / x0) + 5)}" fill="${C.emph}" stroke="none" text-anchor="middle" font-size="15">6${anim('x', x => X(0.3 * x))}${anim('y', x => Y(0.62 * 6 / x) + 5)}</text>`);
  files['inverse-proportion-area.svg'] = svg(320, 320, out.join('\n'));
}

// ---------- 与一次函数的交点 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 180, u: 22, xmin: -7.5, xmax: 7.5, ymin: -7.5, ymax: 7.5 });
  const out = [body];
  const A = [X(2), Y(3)], B = [X(-3), Y(-2)], O = [X(0), Y(0)], Cc = [X(0), Y(1)];
  out.push(poly([A, O, B], { fill: C.emphFill, color: 'none', w: 0 }));
  out.push(line(O[0], O[1], A[0], A[1], { color: C.emph, w: 1.2, dash: '4 3' }), line(O[0], O[1], B[0], B[1], { color: C.emph, w: 1.2, dash: '4 3' }));
  out.push(hyper(6, X, Y, { color: C.blue, w: 2.5 }, 7.3, 7.3));
  out.push(line(X(-7.3), Y(-6.3), X(6.3), Y(7.3), { color: C.ink, w: 2 }));
  out.push(dot(A[0], A[1], C.emph, 5), dot(B[0], B[1], C.emph, 5), dot(Cc[0], Cc[1], C.ink, 4));
  out.push(text(A[0] + 2, A[1] - 20, 'A', { anchor: 'middle', italic: true }));
  out.push(text(B[0] - 8, B[1] - 14, 'B', { anchor: 'end', italic: true }));
  out.push(text(Cc[0] - 8, Cc[1] - 6, 'C', { anchor: 'end', italic: true }));
  out.push(text(X(4.6), Y(2.1) - 2, 'y = 6/x', { color: C.blue, size: 13 }));
  out.push(text(X(4.4) + 8, Y(5.4) + 4, 'y = x + 1', { size: 13 }));
  files['inverse-proportion-intersect.svg'] = svg(360, 360, out.join('\n'));
}

export default files;
