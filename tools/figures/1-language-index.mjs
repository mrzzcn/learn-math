// 第一部分总览页的结构图：语言 → 命题 → 从定义和基本事实出发证明 → 定理 → 新的依据。
import { C, f, svg, text } from './lib.mjs';

const files = {};
{
  const out = [];
  const box = (x, y, w, h, title, sub, o = {}) => {
    out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"/>`);
    const cy = y + h / 2;
    if (sub) {
      out.push(text(x + w / 2, cy - 3, title, { anchor: 'middle', color: o.color || C.ink, size: 15 }));
      out.push(text(x + w / 2, cy + 16, sub, { anchor: 'middle', color: C.soft, size: 12 }));
    } else out.push(text(x + w / 2, cy + 5, title, { anchor: 'middle', color: o.color || C.ink, size: 15 }));
  };
  const arrow = (p, q, col = C.soft) => {
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], n = [-u[1], u[0]];
    const b = [q[0] - 9 * u[0], q[1] - 9 * u[1]];
    out.push(`<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="1.5"/>`);
    out.push(`<polygon points="${f(q[0])},${f(q[1])} ${f(b[0] + 4 * n[0])},${f(b[1] + 4 * n[1])} ${f(b[0] - 4 * n[0])},${f(b[1] - 4 * n[1])}" fill="${col}" stroke="none"/>`);
  };
  // 第一行：三种语言
  box(20, 14, 440, 44, '三种数学语言', '文字 · 符号 · 图形：把话说清楚', { fill: C.blueFill, color: C.blue });
  // 命题
  box(180, 90, 120, 44, '命题', '如果……那么……');
  arrow([240, 58], [240, 90], C.blue);
  // 起点
  box(20, 160, 110, 40, '定义', '', { fill: C.emphFill, color: C.emph });
  box(20, 214, 110, 40, '基本事实', '', { fill: C.emphFill, color: C.emph });
  out.push(text(75, 150, '推理的起点', { anchor: 'middle', color: C.emph, size: 12 }));
  // 证明、定理
  box(180, 180, 120, 44, '证明', '每一步都有依据');
  box(350, 180, 110, 44, '定理', '证实了的真命题');
  arrow([240, 134], [240, 180]);
  arrow([130, 180], [180, 196], C.emph);
  arrow([130, 234], [180, 212], C.emph);
  arrow([300, 202], [350, 202]);
  // 定理作为新的依据
  out.push(`<path d="M 405 224 C 405 272, 260 272, 250 230" stroke="${C.soft}" stroke-width="1.5" fill="none" stroke-dasharray="5 4"/>`);
  out.push(`<polygon points="249,224 245.5,233 254,232" fill="${C.soft}" stroke="none"/>`);
  out.push(text(330, 280, '作为新的依据', { anchor: 'middle', color: C.soft, size: 12 }));
  files['language-index-map.svg'] = svg(480, 292, out.join('\n'));
}

export default files;
