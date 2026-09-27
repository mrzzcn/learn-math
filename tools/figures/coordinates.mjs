// 第六部分“平面直角坐标系”的图。
import { C, f, svg, text, line, dot, poly, axes, rightAngle } from './lib.mjs';

const files = {};
const num = v => (v < 0 ? '−' + -v : String(v));
// 点名斜体、坐标正体，如 P(3, 2)
const coord = (name, x, y) => `<tspan font-style="italic">${name}</tspan>(${num(x)}, ${num(y)})`;

// ---------- 点的坐标：P(3, 2) 和 Q(2, 3) ----------
{
  const { X, Y, body } = axes({ ox: 60, oy: 230, u: 44, xmin: -1, xmax: 5.5, ymin: -0.8, ymax: 4.2 });
  const out = [body];
  const pt = (x, y, col, name, dx, dy) => {
    out.push(line(X(x), Y(y), X(x), Y(0), { color: col, w: 1.5, dash: '5 4' }));
    out.push(line(X(x), Y(y), X(0), Y(y), { color: col, w: 1.5, dash: '5 4' }));
    out.push(dot(X(x), Y(y), col, 5));
    out.push(text(X(x) + dx, Y(y) + dy, coord(name, x, y), { color: col }));
  };
  pt(3, 2, C.emph, 'P', 8, 16);
  pt(2, 3, C.blue, 'Q', 8, -8);
  files['coordinates-point.svg'] = svg(360, 270, out.join('\n'));
}

// ---------- 四个象限 ----------
{
  const { X, Y, body } = axes({ ox: 180, oy: 170, u: 28, xmin: -5.5, xmax: 5.5, ymin: -5, ymax: 5 });
  const out = [body];
  const q = (x, y, name, sign, col) => {
    out.push(text(X(x), Y(y), name, { anchor: 'middle', color: col, size: 15 }));
    out.push(text(X(x), Y(y) + 22, sign, { anchor: 'middle', color: col, size: 15 }));
  };
  q(2.9, 3, '第一象限', '(+, +)', C.emph);
  q(-2.9, 3, '第二象限', '(−, +)', C.blue);
  q(-2.9, -2.4, '第三象限', '(−, −)', C.emph);
  q(2.9, -2.4, '第四象限', '(+, −)', C.blue);
  files['coordinates-quadrants.svg'] = svg(360, 330, out.join('\n'));
}

// ---------- 点到坐标轴的距离 ----------
{
  const { X, Y, body } = axes({ ox: 250, oy: 200, u: 40, xmin: -5.5, xmax: 1.8, ymin: -0.8, ymax: 4 });
  const out = [body];
  const P = [X(-4), Y(3)], M = [X(-4), Y(0)], N = [X(0), Y(3)];
  out.push(line(...P, ...M, { color: C.emph, w: 3 }), line(...P, ...N, { color: C.blue, w: 3 }));
  out.push(rightAngle(M, P, [X(0), Y(0)]));
  out.push(dot(...P, C.ink, 5), dot(...M, C.emph), dot(...N, C.blue));
  out.push(text(P[0] - 8, P[1] - 10, coord('P', -4, 3), { anchor: 'middle' }));
  out.push(text(M[0] - 8, (P[1] + M[1]) / 2 + 5, '3', { anchor: 'end', color: C.emph, size: 15 }));
  out.push(text((P[0] + N[0]) / 2, N[1] - 10, '4', { anchor: 'middle', color: C.blue, size: 15 }));
  out.push(text(M[0] + 16, M[1] - 6, 'M', { italic: true }), text(N[0] + 8, N[1] - 8, 'N', { italic: true }));
  files['coordinates-distance.svg'] = svg(340, 240, out.join('\n'));
}

// ---------- 平行于坐标轴的线段，以及一般两点的距离 ----------
{
  const { X, Y, body } = axes({ ox: 160, oy: 170, u: 44, xmin: -3.2, xmax: 3.5, ymin: -2, ymax: 3 });
  const out = [body];
  const A = [X(-2), Y(-1)], B = [X(2), Y(-1)], Cc = [X(2), Y(2)];
  out.push(line(...A, ...Cc, { color: C.ink, w: 2, dash: '6 4' }));
  out.push(line(...A, ...B, { color: C.emph, w: 3 }), line(...B, ...Cc, { color: C.blue, w: 3 }));
  out.push(rightAngle(B, A, Cc));
  out.push(dot(...A), dot(...B), dot(...Cc));
  out.push(text(A[0] - 6, A[1] + 22, coord('A', -2, -1), { anchor: 'middle' }));
  out.push(text(B[0] + 6, B[1] + 22, coord('B', 2, -1), { anchor: 'middle' }));
  out.push(text(Cc[0] + 8, Cc[1] - 8, coord('C', 2, 2)));
  out.push(text(X(-0.8), A[1] - 8, '4', { anchor: 'middle', color: C.emph, size: 15 }));
  out.push(text(B[0] + 8, (B[1] + Cc[1]) / 2 + 5, '3', { color: C.blue, size: 15 }));
  out.push(text(X(1.2) - 8, Y(1.4) - 8, '5', { anchor: 'end', size: 15 }));
  files['coordinates-parallel.svg'] = svg(340, 280, out.join('\n'));
}

// ---------- 例题：割补法求三角形面积 ----------
// 题干的图只画 △ABC；解法的图再画出长方形 ADEF 和多出来的三个直角三角形
for (const cut of [false, true]) {
  const { X, Y, body } = axes({ ox: 150, oy: 210, u: 34, xmin: -4, xmax: 4, ymin: -2, ymax: 5 });
  const out = [body];
  const P = (x, y) => [X(x), Y(y)];
  const A = P(-3, -1), B = P(3, 1), Cc = P(1, 4), D = P(3, -1), E = P(3, 4), F = P(-3, 4);
  if (cut) {
    out.push(poly([A, B, D], { fill: C.blueFill, color: 'none', w: 0 }), poly([B, Cc, E], { fill: C.blueFill, color: 'none', w: 0 }), poly([A, Cc, F], { fill: C.blueFill, color: 'none', w: 0 }));
    out.push(poly([A, D, E, F], { color: C.blue, w: 1.5, dash: '6 4' }));
  }
  out.push(poly([A, B, Cc], { fill: C.emphFill, color: C.emph, w: 2.5 }));
  for (const p of cut ? [A, B, Cc, D, E, F] : [A, B, Cc]) out.push(dot(...p, C.ink, 3.5));
  out.push(text(A[0] - 8, A[1] + 16, 'A', { italic: true, anchor: 'end' }), text(B[0] + 8, B[1] + 5, 'B', { italic: true }), text(Cc[0], Cc[1] - 9, 'C', { italic: true, anchor: 'middle' }));
  if (cut) out.push(text(D[0] + 8, D[1] + 16, 'D', { italic: true }), text(E[0] + 8, E[1] - 4, 'E', { italic: true }), text(F[0] - 8, F[1] - 4, 'F', { italic: true, anchor: 'end' }));
  files[cut ? 'coordinates-area-cut.svg' : 'coordinates-area.svg'] = svg(320, 290, out.join('\n'));
}

// ---------- 用坐标描述位置：地图 ----------
// kind：'map' 例 3 题干；'park' 例 3 第（2）问，以公园为原点；'hospital' 用方向和距离描述医院的位置
for (const kind of ['map', 'park', 'hospital']) {
  const { X, Y, body } = axes({ ox: 170, oy: 170, u: 30, xmin: -4.5, xmax: 5, ymin: -4.5, ymax: 4.5 });
  const out = [body];
  const place = (x, y, s, dx, dy, col = C.emph, anchor) => {
    out.push(dot(X(x), Y(y), col, 5));
    out.push(text(X(x) + dx, Y(y) + dy, s, { color: col, size: 13, anchor }));
  };
  if (kind === 'park') {
    // 以公园为原点的新坐标轴
    out.push(line(X(-4.5), Y(3), X(5), Y(3), { color: C.blue, w: 1.2, dash: '6 4' }));
    out.push(line(X(-2), Y(-4.5), X(-2), Y(4.5), { color: C.blue, w: 1.2, dash: '6 4' }));
    // 从公园出发：到图书馆向东 5、向南 1；到学校向东 2、向南 3
    const leg = (x1, y1, x2, y2) => line(X(x1), Y(y1), X(x2), Y(y2), { color: C.emph, w: 2.5 });
    out.push(leg(-2, 3, 3, 3), leg(3, 3, 3, 2), leg(-2, 3, 0, 3), leg(0, 3, 0, 0));
    out.push(text(X(1.5), Y(3) - 7, '5', { color: C.emph, size: 13, anchor: 'middle' }));
    out.push(text(X(3) + 7, Y(2.5) + 5, '1', { color: C.emph, size: 13 }));
    out.push(text(X(-1), Y(3) - 7, '2', { color: C.emph, size: 13, anchor: 'middle' }));
    out.push(text(X(0) + 8, Y(1.5) + 5, '3', { color: C.emph, size: 13 }));
  }
  if (kind === 'hospital') {
    // 向西 3 格、向南 3 格，斜边是学校到医院的距离；和正南方向的夹角是 45°
    out.push(line(X(0), Y(0), X(0), Y(-3), { color: C.blue, w: 2.5 }), line(X(0), Y(-3), X(-3), Y(-3), { color: C.blue, w: 2.5 }));
    out.push(rightAngle([X(0), Y(-3)], [X(0), Y(0)], [X(-3), Y(-3)]));
    out.push(line(X(0), Y(0), X(-3), Y(-3), { color: C.emph, w: 2.5 }));
    out.push(`<path d="M ${f(X(0))} ${f(Y(0) + 26)} A 26 26 0 0 1 ${f(X(0) - 26 * Math.SQRT1_2)} ${f(Y(0) + 26 * Math.SQRT1_2)}" stroke="${C.emph}" stroke-width="1.5" fill="none"/>`);
    out.push(text(X(0) - 12, Y(0) + 46, '45°', { color: C.emph, size: 12, anchor: 'end' }));
    out.push(text(X(0) + 8, Y(-1.5) + 5, '300 m', { color: C.blue, size: 12 }));
    out.push(text(X(-1.5), Y(-3) + 18, '300 m', { color: C.blue, size: 12, anchor: 'middle' }));
  }
  place(0, 0, '学校', 8, -8, C.ink);
  if (kind !== 'hospital') {
    place(-2, 3, '公园', -8, -8, C.blue, 'end');
    place(3, 2, '图书馆', 8, kind === 'park' ? 18 : -8);
  } else {
    place(-3, -3, '医院', -8, 5, C.emph, 'end');
  }
  // 指北针
  const nx = X(4.2), ny = Y(-2.2);
  out.push(line(nx, ny + 22, nx, ny - 14, { color: C.ink, w: 1.5 }));
  out.push(`<polygon points="${f(nx)},${f(ny - 22)} ${f(nx - 5)},${f(ny - 12)} ${f(nx + 5)},${f(ny - 12)}" fill="${C.ink}" stroke="none"/>`);
  out.push(text(nx, ny - 27, '北', { anchor: 'middle', size: 12 }));
  out.push(text(X(5), Y(-4.5) + 34, '每格 100 m', { anchor: 'end', color: C.soft, size: 12 }));
  files[kind === 'map' ? 'coordinates-map.svg' : `coordinates-map-${kind}.svg`] = svg(350, 350, out.join('\n'));
}

// ---------- 同一个长方形的两种放法 ----------
{
  const out = [];
  const u = 22;
  const panel = (ox, oy, x0, y0, labels) => {
    const { X, Y, body } = axes({ ox, oy, u, xmin: x0 - 1.2, xmax: x0 + 7.2, ymin: y0 - 1.2, ymax: y0 + 5.2, ticks: false });
    out.push(body);
    const pts = [[x0, y0], [x0 + 6, y0], [x0 + 6, y0 + 4], [x0, y0 + 4]];
    out.push(poly(pts.map(([x, y]) => [X(x), Y(y)]), { fill: C.emphFill, color: C.emph, w: 2.5 }));
    pts.forEach(([x, y], i) => {
      out.push(dot(X(x), Y(y), C.ink, 3.5));
      const [dx, dy, anchor] = labels[i];
      out.push(text(X(x) + dx, Y(y) + dy, `(${num(x)}, ${num(y)})`, { size: 12, anchor }));
    });
  };
  panel(40, 150, 0, 0, [[4, 16, 'start'], [-4, 16, 'end'], [6, -6, 'start'], [6, -6, 'start']]);
  panel(370, 118, -3, -2, [[-4, 16, 'end'], [4, 16, 'start'], [4, -6, 'start'], [-4, -6, 'end']]);
  files['coordinates-rect-two.svg'] = svg(540, 200, out.join('\n'));
}

export default files;
