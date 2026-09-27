// 第三部分“二次根式”的图。
import { C, f, svg, text, line, dot, axes, rightAngle } from './lib.mjs';

const files = {};

// ---------- 方格中的 √2 和 √8 ----------
{
  const u = 70, ox = 40, oy = 250, P = (x, y) => [ox + u * x, oy - u * y], out = [];
  for (let i = 0; i <= 3; i++) {
    out.push(line(...P(i, 0), ...P(i, 3), { color: C.grid, w: 1.5 }), line(...P(0, i), ...P(3, i), { color: C.grid, w: 1.5 }));
  }
  // 边长 1 和边长 2 的正方形
  const sq = (x, y, n, fill, col) => `<rect x="${P(x, y + n)[0]}" y="${P(x, y + n)[1]}" width="${n * u}" height="${n * u}" fill="${fill}" stroke="${col}" stroke-width="1.5"/>`;
  out.push(sq(0, 0, 1, C.blueFill, C.blue), sq(1, 1, 2, C.emphFill, C.emph));
  out.push(line(...P(0, 0), ...P(1, 1), { color: C.blue, w: 3.5 }));
  out.push(line(...P(1, 1), ...P(3, 3), { color: C.emph, w: 3.5 }));
  out.push(dot(...P(0, 0)), dot(...P(1, 1)), dot(...P(2, 2), C.emph, 3.5), dot(...P(3, 3)));
  // 标注放在对角线右下方
  const lab = (x, y, s, col) => { const [px, py] = P(x, y); return text(px + 12, py + 20, s, { color: col, size: 15 }); };
  out.push(lab(0.5, 0.5, '√2', C.blue), lab(2.5, 2.5, '√8', C.emph));
  out.push(text(P(2, 3)[0], P(2, 3)[1] - 8, '2', { anchor: 'middle', color: C.emph, size: 12 }));
  out.push(text(P(0.5, 0)[0], oy + 22, '1', { anchor: 'middle', color: C.blue, size: 12 }), text(P(0, 0.5)[0] - 12, P(0, 0.5)[1] + 4, '1', { anchor: 'end', color: C.blue, size: 12 }));
  files['radicals-grid.svg'] = svg(310, 280, out.join('\n'));
}

// ---------- 数轴上的 √(x − 1)² + √(x − 3)²（动画） ----------
{
  const u = 50, ox = 80, y = 70, X = x => ox + u * x, out = [];
  out.push(line(X(-1.2), y, X(4.6), y, { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(4.6) + 8)},${y} ${f(X(4.6))},${y - 4} ${f(X(4.6))},${y + 4}" fill="${C.axis}" stroke="none"/>`);
  for (let k = -1; k <= 4; k++) {
    out.push(line(X(k), y - 5, X(k), y + 5, { color: C.axis, w: 1.5 }));
    out.push(text(X(k), y + 20, k < 0 ? '−' + -k : k, { anchor: 'middle', color: C.soft, size: 12 }));
  }
  const xs = [1.8, 1.8, 2.7, 2.7, 1.3, 1.3, 1.8], kt = '0;0.1;0.35;0.5;0.75;0.9;1', dur = 9;
  const anim = (a, fn) => `<animate attributeName="${a}" values="${xs.map(v => f(fn(v))).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>`;
  const x0 = xs[0];
  out.push(`<line x1="${X(1)}" y1="${y - 14}" x2="${f(X(x0))}" y2="${y - 14}" stroke="${C.blue}" stroke-width="4">${anim('x2', X)}</line>`);
  out.push(`<line x1="${f(X(x0))}" y1="${y - 14}" x2="${X(3)}" y2="${y - 14}" stroke="${C.emph}" stroke-width="4">${anim('x1', X)}</line>`);
  out.push(`<text x="${f(X((1 + x0) / 2))}" y="${y - 24}" fill="${C.blue}" stroke="none" text-anchor="middle" font-style="italic" font-size="13">x − 1${anim('x', v => X((1 + v) / 2))}</text>`);
  out.push(`<text x="${f(X((3 + x0) / 2))}" y="${y - 24}" fill="${C.emph}" stroke="none" text-anchor="middle" font-style="italic" font-size="13">3 − x${anim('x', v => X((3 + v) / 2))}</text>`);
  out.push(`<circle cx="${f(X(x0))}" cy="${y}" r="5" fill="${C.ink}" stroke="none">${anim('cx', X)}</circle>`);
  out.push(`<text x="${f(X(x0))}" y="${y + 40}" fill="${C.ink}" stroke="none" text-anchor="middle" font-style="italic" font-size="14">x${anim('x', X)}</text>`);
  out.push(dot(X(1), y, C.blue, 4), dot(X(3), y, C.emph, 4));
  files['radicals-numberline.svg'] = svg(360, 120, out.join('\n'));
}

// ---------- 两点间的距离：A(−1, 1)，B(3, 3) ----------
{
  const { X, Y, body } = axes({ ox: 110, oy: 200, u: 40, xmin: -2, xmax: 4.5, ymin: -0.8, ymax: 4, ticks: false });
  const tk = [];
  for (const x of [-2, -1, 1, 2, 3, 4]) tk.push(text(X(x), Y(0) + 16, x < 0 ? '−' + -x : x, { anchor: 'middle', color: C.soft, size: 11 }));
  for (const y of [2, 3, 4]) tk.push(text(X(0) - 6, Y(y) + 4, y, { anchor: 'end', color: C.soft, size: 11 }));
  const A = [X(-1), Y(1)], B = [X(3), Y(3)], Cc = [X(3), Y(1)], out = [body, ...tk];
  out.push(line(...A, ...Cc, { color: C.blue, w: 2.5 }), line(...Cc, ...B, { color: C.blue, w: 2.5 }));
  out.push(line(...A, ...B, { color: C.emph, w: 3 }));
  out.push(rightAngle(Cc, A, B));
  out.push(dot(...A), dot(...B), dot(...Cc));
  out.push(text(A[0] - 6, A[1] - 8, 'A', { anchor: 'end', italic: true }), text(B[0] + 6, B[1] - 4, 'B', { italic: true }), text(Cc[0] + 8, Cc[1] + 16, 'C', { italic: true }));
  out.push(text((A[0] + Cc[0]) / 2, A[1] + 18, '4', { anchor: 'middle', color: C.blue }), text(Cc[0] + 10, (Cc[1] + B[1]) / 2 + 5, '2', { color: C.blue }));
  files['radicals-distance.svg'] = svg(330, 250, out.join('\n'));
}

export default files;
