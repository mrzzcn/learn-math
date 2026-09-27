// 第三部分“总览：式的家族”的图。
import { C, svg, text, line } from './lib.mjs';

const files = {};
// ---------- 式的家族 ----------
{
  const out = [];
  const box = (cx, cy, w, s, col = C.ink, fill = 'none') =>
    `<rect x="${cx - w / 2}" y="${cy - 18}" width="${w}" height="36" rx="6" fill="${fill}" stroke="${col}" stroke-width="2"/>` + text(cx, cy + 5, s, { anchor: 'middle', color: col, size: 15 });
  const top = [240, 36], kids = [[90, 120], [250, 120], [400, 120]], grand = [[45, 204], [140, 204]];
  for (const k of kids) out.push(line(top[0], top[1] + 18, k[0], k[1] - 18, { color: C.soft, w: 1.5 }));
  for (const g of grand) out.push(line(kids[0][0], kids[0][1] + 18, g[0], g[1] - 18, { color: C.soft, w: 1.5 }));
  out.push(box(...top, 110, '代数式'));
  out.push(box(...kids[0], 100, '整式', C.blue, C.blueFill));
  out.push(box(...kids[1], 100, '分式', C.emph, C.emphFill));
  out.push(box(...kids[2], 110, '二次根式', C.emph, C.emphFill));
  out.push(box(...grand[0], 80, '单项式', C.blue));
  out.push(box(...grand[1], 80, '多项式', C.blue));
  const note = (x, y, s) => text(x, y, s, { anchor: 'middle', color: C.soft, size: 12 });
  out.push(note(45, 240, '如 3a²b'), note(140, 240, '如 x² − 2x + 1'));
  out.push(note(250, 160, '整式 ÷ 整式'), note(250, 178, '如 1/x'));
  out.push(note(400, 160, '对式子开平方'), note(400, 178, '如 √x'));
  files['3-expression-index-family.svg'] = svg(470, 256, out.join('\n'));
}

export default files;
