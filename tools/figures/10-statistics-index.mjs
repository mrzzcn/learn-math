// 第十部分总览“从数据到决策”的图。
import { C, f, svg, text, line, poly } from './lib.mjs';

const files = {};

// ---------- 统计的流程和概率的位置 ----------
{
  const steps = ['收集', '整理', '描述', '分析', '推断'];
  const subs = ['调查、抽样', '频数、频率', '统计图', '统计量', '估计、决策'];
  const bw = 72, bh = 34, gap = 22, x0 = 20, y0 = 44;
  const BX = i => x0 + i * (bw + gap);
  const out = [];
  const arrow = (x1, y1, x2, y2, col = C.soft, dash) => {
    const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
    return line(x1, y1, x2 - s * Math.cos(a), y2 - s * Math.sin(a), { color: col, w: 1.5, dash }) +
      `<polygon points="${f(x2)},${f(y2)} ${f(x2 - s * Math.cos(a) + 4 * Math.sin(a))},${f(y2 - s * Math.sin(a) - 4 * Math.cos(a))} ${f(x2 - s * Math.cos(a) - 4 * Math.sin(a))},${f(y2 - s * Math.sin(a) + 4 * Math.cos(a))}" fill="${col}" stroke="none"/>`;
  };
  steps.forEach((s, i) => {
    const x = BX(i), col = i < 3 ? C.blue : C.emph, fill = i < 3 ? C.blueFill : C.emphFill;
    out.push(poly([[x, y0], [x + bw, y0], [x + bw, y0 + bh], [x, y0 + bh]], { fill, color: col, w: 1.5 }));
    out.push(text(x + bw / 2, y0 + 22, s, { anchor: 'middle', size: 14 }));
    out.push(text(x + bw / 2, y0 + bh + 18, subs[i], { anchor: 'middle', size: 11, color: C.soft }));
    if (i) out.push(arrow(x - gap + 2, y0 + bh / 2, x - 2, y0 + bh / 2));
  });
  // 页面分组
  const brace = (i0, i1, y, s, col) => {
    const a = BX(i0), b = BX(i1) + bw;
    return line(a, y, b, y, { color: col, w: 1.5 }) + line(a, y + 5, a, y, { color: col, w: 1.5 }) + line(b, y + 5, b, y, { color: col, w: 1.5 }) + text((a + b) / 2, y - 7, s, { anchor: 'middle', size: 12, color: col });
  };
  out.push(brace(0, 2, y0 - 10, '数据的收集、整理与描述', C.blue));
  out.push(brace(3, 4, y0 - 10, '数据的分析', C.emph));
  // 概率
  const py = 160, px = BX(1) + bw / 2 + 60, pw = 120;
  out.push(poly([[px - pw / 2, py], [px + pw / 2, py], [px + pw / 2, py + bh], [px - pw / 2, py + bh]], { fill: 'rgba(87,96,106,0.10)', color: C.ink, w: 1.5 }));
  out.push(text(px, py + 22, '概率', { anchor: 'middle', size: 14 }));
  // 频率 ↔ 概率
  out.push(arrow(BX(1) + bw / 2, y0 + bh + 26, px - 30, py - 2, C.ink, '4 3'));
  out.push(text(BX(1) + bw / 2 - 2, py - 30, '试验次数很多时', { anchor: 'end', size: 11, color: C.soft }));
  out.push(text(BX(1) + bw / 2 - 2, py - 15, '频率稳定在概率附近', { anchor: 'end', size: 11, color: C.soft }));
  out.push(arrow(px + pw / 2, py + bh / 2, BX(4) + bw / 2, y0 + bh + 26, C.ink, '4 3'));
  out.push(text(BX(4) - 22, py - 10, '用概率做判断', { anchor: 'start', size: 11, color: C.soft }));
  files['10-statistics-index-flow.svg'] = svg(480, 205, out.join('\n'));
}

export default files;
