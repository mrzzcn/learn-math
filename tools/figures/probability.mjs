// 第十部分“概率”的图。
import { C, f, svg, text, line, dot, polyline, rad } from './lib.mjs';

const files = {};

function lcg(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

// ---------- 可能性大小：0 到 1 ----------
{
  const X = p => 50 + 300 * p, y = 90;
  const out = [];
  out.push(line(X(0), y, X(1), y, { color: C.ink, w: 2 }));
  const marks = [[0, '0'], [1 / 6, '1/6'], [1 / 2, '1/2'], [1, '1']];
  marks.forEach(([p, s]) => out.push(line(X(p), y - 5, X(p), y + 5, { color: C.ink, w: 1.5 }), text(X(p), y + 20, s, { anchor: 'middle', size: 12, color: C.soft })));
  // 上方：三类事件
  out.push(text(X(0), 40, '不可能事件', { anchor: 'middle', size: 12, color: C.blue }), line(X(0), 46, X(0), y - 8, { color: C.blue, w: 1, dash: '3 3' }));
  out.push(text(X(1), 40, '必然事件', { anchor: 'middle', size: 12, color: C.blue }), line(X(1), 46, X(1), y - 8, { color: C.blue, w: 1, dash: '3 3' }));
  out.push(line(X(0) + 6, 64, X(1) - 6, 64, { color: C.emph, w: 1.5 }), line(X(0) + 6, 59, X(0) + 6, 69, { color: C.emph, w: 1.5 }), line(X(1) - 6, 59, X(1) - 6, 69, { color: C.emph, w: 1.5 }));
  out.push(text(X(0.5), 56, '随机事件', { anchor: 'middle', size: 12, color: C.emph }));
  // 下方：掷一枚骰子的几个事件
  const ex = [[0, '掷出 7 点'], [1 / 6, '掷出 6 点'], [1 / 2, '掷出偶数点'], [1, '点数不超过 6']];
  ex.forEach(([p, s], i) => {
    out.push(dot(X(p), y, p === 0 || p === 1 ? C.blue : C.emph, 5));
    const ty = i % 2 ? 150 : 130;
    out.push(line(X(p), y + 26, X(p), ty - 12, { color: C.soft, w: 1, dash: '3 3' }));
    out.push(text(X(p), ty, s, { anchor: 'middle', size: 12 }));
  });
  files['probability-scale.svg'] = svg(400, 165, out.join('\n'));
}

// ---------- 抛硬币：正面朝上的频率随次数稳定到 0.5 ----------
{
  const N = 1000, rnd = lcg(2024);
  const ox = 55, oy = 215, sx = 0.32, sy = 180;
  const X = n => ox + sx * n, Y = p => oy - sy * p;
  const out = [];
  for (const p of [0.2, 0.4, 0.6, 0.8, 1]) {
    out.push(line(X(0), Y(p), X(N), Y(p), { color: C.grid, w: 1 }));
    out.push(text(ox - 6, Y(p) + 4, p, { anchor: 'end', color: C.soft, size: 11 }));
  }
  for (let n = 200; n <= N; n += 200) out.push(text(X(n), oy + 16, n, { anchor: 'middle', color: C.soft, size: 11 }));
  out.push(line(X(0), oy, X(N) + 10, oy, { color: C.axis, w: 1.5 }), line(ox, oy, ox, Y(1.08), { color: C.axis, w: 1.5 }));
  out.push(text(ox - 6, oy + 4, '0', { anchor: 'end', color: C.soft, size: 11 }));
  out.push(text(X(N) + 10, oy + 34, '抛掷次数', { anchor: 'end', color: C.soft, size: 12 }));
  out.push(text(ox + 6, Y(1.08) - 4, '正面朝上的频率', { color: C.soft, size: 12 }));
  out.push(line(X(0), Y(0.5), X(N), Y(0.5), { color: C.emph, w: 1.5, dash: '6 4' }));
  out.push(text(X(N) + 4, Y(0.5) + 4, '0.5', { color: C.emph, size: 12 }));
  let heads = 0;
  const pts = [];
  for (let n = 1; n <= N; n++) {
    if (rnd() < 0.5) heads++;
    pts.push([X(n), Y(heads / n)]);
  }
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  L = Math.ceil(L) + 5;
  const pl = polyline(pts, { color: C.blue, w: 1.5 });
  out.push(pl.replace('/>', `><animate attributeName="stroke-dasharray" values="0 ${L};${L} 0;${L} 0" keyTimes="0;0.8;1" dur="8s" repeatCount="indefinite"/></polyline>`));
  files['probability-frequency.svg'] = svg(420, 262, out.join('\n'));
  files._final = heads / N;
}

// ---------- 转盘 ----------
{
  const c = [160, 125], r = 95;
  const parts = [['红', 120, C.emphFill, C.emph], ['蓝', 90, C.blueFill, C.blue], ['白', 150, 'none', C.soft]];
  const out = [];
  let a = 90;
  parts.forEach(([name, deg, fill, col]) => {
    const a1 = a - deg, mid = a - deg / 2;
    const p0 = [c[0] + r * Math.cos(rad(a)), c[1] - r * Math.sin(rad(a))], p1 = [c[0] + r * Math.cos(rad(a1)), c[1] - r * Math.sin(rad(a1))];
    out.push(`<path d="M ${f(c[0])} ${f(c[1])} L ${f(p0[0])} ${f(p0[1])} A ${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${f(p1[0])} ${f(p1[1])} Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round"/>`);
    const lx = c[0] + 60 * Math.cos(rad(mid)), ly = c[1] - 60 * Math.sin(rad(mid));
    out.push(text(lx, ly - 2, name, { anchor: 'middle', size: 13, color: col === C.soft ? C.ink : col }));
    out.push(text(lx, ly + 14, `${deg}°`, { anchor: 'middle', size: 12, color: col === C.soft ? C.soft : col }));
    a = a1;
  });
  // 指针：转几圈后停下
  const stop = 35;
  const ptr = `${line(c[0], c[1], c[0], c[1] - 72, { color: C.ink, w: 3 })}<polygon points="${c[0]},${c[1] - 84} ${c[0] - 6},${c[1] - 70} ${c[0] + 6},${c[1] - 70}" fill="${C.ink}" stroke="none"/>`;
  out.push(`<g transform="rotate(${stop} ${c[0]} ${c[1]})">${ptr}<animateTransform attributeName="transform" type="rotate" values="${stop} ${c[0]} ${c[1]};${stop + 1080 + 137} ${c[0]} ${c[1]};${stop + 1080 + 137} ${c[0]} ${c[1]};${stop + 1080 + 137} ${c[0]} ${c[1]}" keyTimes="0;0.5;0.95;1" calcMode="spline" keySplines="0.1 0.6 0.3 1;0 0 1 1;0 0 1 1" dur="6s" repeatCount="indefinite"/></g>`);
  out.push(dot(c[0], c[1], C.ink, 5));
  files['probability-spinner.svg'] = svg(320, 250, out.join('\n'));
}

// 树状图：levels 是每一层每个结点的名字；leaf(path) 返回结果文字和是否强调
function tree(root, branches, W, rowH, o = {}) {
  const out = [];
  const x0 = 40, x1 = 150, x2 = 260, xr = W - 30;
  const leaves = [];
  branches.forEach(([a, subs]) => subs.forEach(b => leaves.push([a, b])));
  const n = leaves.length, top = 40;
  const ly = i => top + i * rowH;
  out.push(text(x1, 20, '第一次', { anchor: 'middle', size: 12, color: C.soft }), text(x2, 20, '第二次', { anchor: 'middle', size: 12, color: C.soft }), text(xr, 20, '结果', { anchor: 'middle', size: 12, color: C.soft }));
  const rootY = (ly(0) + ly(n - 1)) / 2;
  out.push(dot(x0, rootY, C.ink, 4));
  let i = 0;
  branches.forEach(([a, subs]) => {
    const ys = subs.map((_, k) => ly(i + k)), ay = (ys[0] + ys.at(-1)) / 2;
    out.push(line(x0, rootY, x1 - 16, ay, { color: C.soft, w: 1.2 }));
    out.push(text(x1, ay + 5, a, { anchor: 'middle', size: 13 }));
    subs.forEach((b, k) => {
      const hi = o.hi([a, b]);
      out.push(line(x1 + 16, ay, x2 - 16, ys[k], { color: hi ? C.emph : C.soft, w: hi ? 2 : 1.2 }));
      out.push(text(x2, ys[k] + 5, b, { anchor: 'middle', size: 13, color: hi ? C.emph : C.ink }));
      out.push(text(xr, ys[k] + 5, `${a}${o.sep || ''}${b}`, { anchor: 'middle', size: 13, color: hi ? C.emph : C.ink }));
    });
    i += subs.length;
  });
  return svg(W, top + (n - 1) * rowH + 20, out.join('\n'));
}

// ---------- 抛两枚硬币 ----------
files['probability-coins.svg'] = tree('', [['正', ['正', '反']], ['反', ['正', '反']]], 340, 32, { hi: ([a, b]) => a !== b });

// ---------- 不放回摸两次球 ----------
files['probability-tree.svg'] = tree('', [['红1', ['红2', '白']], ['红2', ['红1', '白']], ['白', ['红1', '红2']]], 360, 28, { sep: '、', hi: ([a, b]) => a[0] === '红' && b[0] === '红' });

const final = files._final;
delete files._final;
if (process.env.SHOW_FINAL) console.log('coin final frequency', final);

export default files;
