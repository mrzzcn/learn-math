// 第二部分总览“数的扩充”的图。
import { C, svg, text } from './lib.mjs';

const files = {};

// ---------- 数集一层套一层 ----------
{
  const rect = (x1, y1, x2, y2, stroke, fill) =>
    `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`;
  const out = [];
  const title = (x, y, s, color) => text(x, y, s, { color, size: 15 });
  const note = (x, y, s, color) => text(x, y, s, { anchor: 'middle', color, size: 12 });
  const num = (x, y, s) => text(x, y, s, { anchor: 'middle', size: 14 });
  // 实数
  out.push(rect(10, 10, 480, 280, C.ink, 'none'));
  out.push(title(22, 34, '实数', C.ink));
  // 有理数
  out.push(rect(24, 46, 360, 268, C.blue, C.blueFill));
  out.push(title(36, 70, '有理数', C.blue));
  // 整数
  out.push(rect(38, 82, 262, 256, C.soft, 'rgba(255,255,255,0.35)'));
  out.push(title(50, 106, '整数', C.soft));
  // 自然数
  out.push(rect(52, 118, 150, 244, C.emph, C.emphFill));
  out.push(title(64, 142, '自然数', C.emph));
  // 各层新添的数
  const col = (x, head, color, items) => {
    out.push(note(x, 176, head, color));
    items.forEach((s, i) => out.push(num(x, 202 + i * 22, s)));
  };
  col(101, '0 和正整数', C.emph, ['0, 1, 2', '3, …']);
  col(206, '负整数', C.soft, ['−1, −2', '−3, …']);
  col(311, '分数', C.blue, ['1/2, −3/4', '0.5, −2.4']);
  col(420, '无理数', C.ink, ['√2, −√3', 'π', '0.1010010001…']);
  files['2-number-index-sets.svg'] = svg(490, 290, out.join('\n'));
}

export default files;
