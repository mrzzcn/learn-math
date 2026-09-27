// 第二部分“有理数”的图。
import { C, f, svg, text, line, dot } from './lib.mjs';

const files = {};
const fmt = v => (v < 0 ? '−' + -v : String(v));

// 数轴：原点像素 ox，基线 y，单位 u 像素，画 [min, max]，整数处画刻度
function numberLine({ ox, y, u, min, max, labels = true }) {
  const X = v => ox + u * v;
  const out = [line(X(min), y, X(max), y, { color: C.ink, w: 1.8 })];
  out.push(`<polygon points="${f(X(max) + 10)},${y} ${f(X(max))},${y - 5} ${f(X(max))},${y + 5}" fill="${C.ink}" stroke="none"/>`);
  for (let v = Math.ceil(min); v <= max; v++) {
    out.push(line(X(v), y - 5, X(v), y, { color: C.ink, w: 1.5 }));
    if (labels) out.push(text(X(v), y + 20, fmt(v), { anchor: 'middle', color: C.soft, size: 13 }));
  }
  return { X, body: out.join('\n') };
}

// 两端带短竖线的尺寸线，标注写在中间上方
function dimension(x1, x2, y, s, color) {
  return [
    line(x1, y, x2, y, { color, w: 2 }),
    line(x1, y - 5, x1, y + 5, { color, w: 1.5 }),
    line(x2, y - 5, x2, y + 5, { color, w: 1.5 }),
    text((x1 + x2) / 2, y - 7, s, { anchor: 'middle', color, size: 13 }),
  ].join('');
}

// ---------- 数轴的三要素 ----------
{
  const { X, body } = numberLine({ ox: 240, y: 80, u: 46, min: -4.6, max: 4.6 });
  const out = [body];
  out.push(text(X(0), 80 + 40, '原点', { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(text(X(4.6) + 4, 80 + 40, '正方向', { anchor: 'end', color: C.soft, size: 12 }));
  // 单位长度
  out.push(dimension(X(0), X(1), 52, '单位长度', C.blue));
  // 两个点
  out.push(dot(X(-2.5), 80, C.emph, 5), text(X(-2.5), 80 - 12, 'A', { anchor: 'middle', italic: true, color: C.emph }));
  out.push(dot(X(3), 80, C.emph, 5), text(X(3), 80 - 12, 'B', { anchor: 'middle', italic: true, color: C.emph }));
  files['rational-numbers-line.svg'] = svg(480, 135, out.join('\n'));
}

// ---------- 相反数：关于原点对称 ----------
{
  const y = 110;
  const { X, body } = numberLine({ ox: 240, y, u: 46, min: -4.6, max: 4.6 });
  const out = [body];
  out.push(line(X(0), 20, X(0), y, { color: C.soft, w: 1, dash: "4 4" }));
  out.push(dimension(X(-3), X(0), y - 30, '3', C.emph), dimension(X(0), X(3), y - 30, '3', C.emph));
  // 翻折示意：从 3 到 −3 的弧
  const r = X(3) - X(0);
  out.push(`<path d="M ${f(X(3))} ${y - 44} A ${f(r)} 34 0 0 0 ${f(X(-3))} ${y - 44}" stroke="${C.blue}" stroke-width="1.5" stroke-dasharray="5 4" fill="none"/>`);
  out.push(`<polygon points="${f(X(-3))},${y - 40} ${f(X(-3) - 5)},${y - 50} ${f(X(-3) + 5)},${y - 50}" fill="${C.blue}" stroke="none"/>`);
  out.push(dot(X(-3), y, C.emph, 5), dot(X(3), y, C.emph, 5));
  files['rational-numbers-opposite.svg'] = svg(480, 150, out.join('\n'));
}

// ---------- 绝对值：到原点的距离 ----------
{
  const y = 90;
  const { X, body } = numberLine({ ox: 260, y, u: 46, min: -5, max: 4.4 });
  const out = [body];
  out.push(dimension(X(-4), X(0), y - 26, '4', C.emph), dimension(X(0), X(2), y - 26, '2', C.blue));
  out.push(dot(X(-4), y, C.emph, 5), dot(X(2), y, C.blue, 5), dot(X(0), y, C.ink, 3.5));
  files['rational-numbers-abs.svg'] = svg(480, 125, out.join('\n'));
}

// ---------- 大小比较：越往右越大 ----------
{
  const y = 70;
  const { X, body } = numberLine({ ox: 240, y, u: 46, min: -4.6, max: 4.6 });
  const out = [body];
  // 顶部箭头：越往右，数越大
  out.push(line(X(-3.5), 22, X(3.5), 22, { color: C.soft, w: 1.5 }));
  out.push(`<polygon points="${f(X(3.5) + 9)},22 ${f(X(3.5))},17 ${f(X(3.5))},27" fill="${C.soft}" stroke="none"/>`);
  out.push(text(X(0), 14, '越往右，数越大', { anchor: 'middle', color: C.soft, size: 12 }));
  // 下方：两个负数到原点的距离
  out.push(dimension(X(-3), X(0), y + 50, '3', C.emph), dimension(X(-1), X(0), y + 80, '1', C.blue));
  out.push(line(X(-3), y + 28, X(-3), y + 50, { color: C.emph, w: 1, dash: "3 3" }), line(X(-1), y + 28, X(-1), y + 80, { color: C.blue, w: 1, dash: '3 3' }));
  out.push(dot(X(-3), y, C.emph, 5), dot(X(-1), y, C.blue, 5), dot(X(2), y, C.ink, 5));
  files['rational-numbers-compare.svg'] = svg(480, 170, out.join('\n'));
}

export default files;
