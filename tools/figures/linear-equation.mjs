// 第四部分“一元一次方程”的图。
import { C, f, svg, text, line, dot, poly } from './lib.mjs';

const files = {};

// ---------- 天平：两边同时拿走 3 个 1 ----------
{
  const out = [];
  const beamY = 110, plateY = 88;
  // 支架和横梁
  out.push(poly([[210, beamY], [190, beamY + 50], [230, beamY + 50]], { fill: C.grid, color: C.soft, w: 1.5 }));
  out.push(line(40, beamY, 380, beamY, { color: C.soft, w: 3 }));
  out.push(line(100, beamY, 100, plateY, { color: C.soft, w: 2 }), line(320, beamY, 320, plateY, { color: C.soft, w: 2 }));
  out.push(line(20, plateY, 180, plateY, { color: C.ink, w: 3 }), line(240, plateY, 400, plateY, { color: C.ink, w: 3 }));
  // 左盘：两个 x
  for (const x0 of [30, 66]) {
    out.push(`<rect x="${x0}" y="${plateY - 32}" width="30" height="30" fill="${C.blueFill}" stroke="${C.blue}" stroke-width="1.5"/>`);
    out.push(text(x0 + 15, plateY - 12, 'x', { anchor: 'middle', italic: true, color: C.blue }));
  }
  const one = (cx, cy, col) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="10" fill="${col === C.emph ? C.emphFill : 'none'}" stroke="${col}" stroke-width="1.5"/>` + text(cx, cy + 4, '1', { anchor: 'middle', color: col, size: 11 });
  // 要拿走的 3 个 1：淡出再出现
  const fade = g => `<g>${g}<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.3;0.45;0.85;1" dur="8s" repeatCount="indefinite"/></g>`;
  out.push(fade([118, 140, 162].map(cx => one(cx, plateY - 11, C.emph)).join('')));
  // 右盘：下排 4 个 1，上排 3 个 1（要拿走的）
  out.push([254, 276, 298, 320].map(cx => one(cx, plateY - 11, C.ink)).join(''));
  out.push(fade([342, 364, 386].map(cx => one(cx, plateY - 11, C.emph)).join('')));
  out.push(text(100, beamY + 45, '左边', { anchor: 'middle', color: C.soft, size: 12 }), text(320, beamY + 45, '右边', { anchor: 'middle', color: C.soft, size: 12 }));
  files['linear-equation-balance.svg'] = svg(420, 175, out.join('\n'));
}

// ---------- 相遇问题的线段图 ----------
{
  const out = [];
  const u = 1, x0 = 40, y = 90;
  const X = km => x0 + u * km;
  const P = X(60), M = X(180), B = X(360);
  out.push(line(X(0), y, B, y, { color: C.ink, w: 2 }));
  for (const x of [X(0), P, M, B]) out.push(line(x, y - 6, x, y + 6, { color: C.ink, w: 1.5 }));
  // 甲：先行 60 km，再走 60x
  out.push(line(X(0), y - 16, P, y - 16, { color: C.blue, w: 2, dash: '5 4' }), line(P, y - 16, M, y - 16, { color: C.blue, w: 3 }));
  out.push(text((X(0) + P) / 2, y - 24, '60', { anchor: 'middle', color: C.blue, size: 13 }));
  out.push(text((P + M) / 2, y - 24, '60x', { anchor: 'middle', color: C.blue, size: 13, italic: false }));
  // 乙：走 90x
  out.push(line(M, y - 16, B, y - 16, { color: C.emph, w: 3 }));
  out.push(text((M + B) / 2, y - 24, '90x', { anchor: 'middle', color: C.emph, size: 13 }));
  // 总长
  const mid = (X(0) + B) / 2, yb = y + 44;
  out.push(line(X(0), yb, mid - 34, yb, { color: C.soft, w: 1 }), line(mid + 34, yb, B, yb, { color: C.soft, w: 1 }), line(X(0), yb - 6, X(0), yb + 6, { color: C.soft, w: 1 }), line(B, yb - 6, B, yb + 6, { color: C.soft, w: 1 }));
  out.push(text(mid, yb + 5, '360 km', { anchor: 'middle', color: C.soft, size: 12 }));
  out.push(text(X(0), y + 24, 'A', { anchor: 'middle', italic: true }), text(B, y + 24, 'B', { anchor: 'middle', italic: true }), text(M, y + 24, '相遇', { anchor: 'middle', color: C.soft, size: 12 }));
  // 两个车：初始画在相遇点；动画里甲先出发 1 h（每小时 2 s），乙晚 1 h 出发
  const dur = 9, kt = '0;0.06;0.28;0.72;1';
  out.push(`<circle cx="${f(M)}" cy="${y}" r="6" fill="${C.blue}" stroke="none"><animate attributeName="cx" values="${f(X(0))};${f(X(0))};${f(P)};${f(M)};${f(M)}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></circle>`);
  out.push(`<circle cx="${f(M)}" cy="${y}" r="6" fill="${C.emph}" stroke="none" opacity="0.8"><animate attributeName="cx" values="${f(B)};${f(B)};${f(B)};${f(M)};${f(M)}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></circle>`);
  out.push(text(X(0) - 6, y - 40, '甲 →', { color: C.blue, size: 13 }), text(B + 6, y - 40, '← 乙', { anchor: 'end', color: C.emph, size: 13 }));
  files['linear-equation-trip.svg'] = svg(440, 150, out.join('\n'));
}

export default files;
