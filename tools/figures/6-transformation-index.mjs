// 第六部分总览“给图形装上坐标”的图。
import { C, svg, text, poly, axes } from './lib.mjs';

const files = {};

// ---------- 同一个三角形的三种变换 ----------
{
  const { X, Y, body } = axes({ ox: 200, oy: 170, u: 26, xmin: -6.5, xmax: 6.5, ymin: -5.5, ymax: 5 });
  const out = [body];
  const tri = [[1, 1], [5, 1], [1, 4]];
  const P = ([x, y]) => [X(x), Y(y)];
  const draw = (pts, fill, color) => poly(pts.map(P), { fill, color, w: 2 });
  out.push(draw(tri, 'rgba(31,35,40,0.08)', C.ink));
  out.push(draw(tri.map(([x, y]) => [-x, y]), C.emphFill, C.emph));
  out.push(draw(tri.map(([x, y]) => [-x, -y]), 'rgba(87,96,106,0.12)', C.soft));
  out.push(draw(tri.map(([x, y]) => [x, y - 5]), C.blueFill, C.blue));
  const note = (x, y, s, color, anchor = 'middle') => text(X(x), Y(y), s, { anchor, color, size: 13 });
  out.push(note(2.4, 4.4, '原图形', C.ink, 'start'));
  out.push(note(-2.4, 4.4, '关于 y 轴对称', C.emph, 'end'));
  out.push(note(-2.4, -4.9, '绕原点旋转 180°', C.soft, 'end'));
  out.push(note(2.4, -4.9, '向下平移 5 个单位', C.blue, 'start'));
  files['6-transformation-index-three.svg'] = svg(400, 330, out.join('\n'));
}

export default files;
