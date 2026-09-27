// 画图用的公共函数。每页的图写在 tools/figures/<页面文件名>.mjs 里，
// 模块默认导出 { '文件名.svg': svg 字符串 }，由 tools/figures/index.mjs 写到 content/images/。
// 风格约定见 notes/writing-plan.md“图和动画”。

// 颜色：和网页、PDF 的配色一致
export const C = {
  ink: '#1f2328',      // 图形主体
  soft: '#57606a',     // 次要文字、辅助线
  grid: '#e3e6ea',     // 网格
  axis: '#57606a',     // 坐标轴
  emph: '#cd4b30',     // 强调（和正文句中加粗同色）
  blue: '#1f5fa8',     // 第二种强调
  emphFill: 'rgba(205,75,48,0.12)',
  blueFill: 'rgba(31,95,168,0.10)',
};

export const f = n => +(+n).toFixed(1);
export const rad = d => (d * Math.PI) / 180;

// 整张图。w、h 是像素宽高；宽度超过 300 时 PDF 按原尺寸的 3/4 排版，不超过 300 会被当成小图缩到 36 mm
export const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-size="14" font-family="-apple-system, BlinkMacSystemFont, &quot;PingFang SC&quot;, &quot;Noto Sans SC&quot;, &quot;Microsoft YaHei&quot;, sans-serif" fill="none">\n${body}\n</svg>\n`;

// 文字。o：color、anchor（start/middle/end）、italic、size
export const text = (x, y, s, o = {}) =>
  `<text x="${f(x)}" y="${f(y)}" fill="${o.color || C.ink}" stroke="none"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.italic ? ' font-style="italic"' : ''}${o.size ? ` font-size="${o.size}"` : ''}>${s}</text>`;

// 线段。o：color、w（线宽）、dash（如 '6 4'）、extra（追加的属性字符串）
export const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${o.color || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.extra || ''}/>`;
export const seg = (a, b, o) => line(a[0], a[1], b[0], b[1], o);

export const dot = (x, y, color = C.ink, r = 4) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="none"/>`;

// 多边形。pts 是 [[x, y], …]；o：fill、color、w、dash
export const poly = (pts, o = {}) =>
  `<polygon points="${pts.map(p => p.map(f).join(',')).join(' ')}" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w ?? 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linejoin="round"/>`;

// 折线、曲线（点足够密时就是光滑曲线，如抛物线）
export const polyline = (pts, o = {}) =>
  `<polyline points="${pts.map(p => p.map(f).join(',')).join(' ')}" fill="none" stroke="${o.color || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linejoin="round" stroke-linecap="round"/>`;

export const circle = (cx, cy, r, o = {}) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${o.fill || 'none'}" stroke="${o.color || C.ink}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;

// 以 c 为圆心、半径 r，从 a0 度到 a1 度的圆弧（数学方向：逆时针为正，0 度朝右）
export function arc(c, r, a0, a1, o = {}) {
  const p0 = [c[0] + r * Math.cos(rad(a0)), c[1] - r * Math.sin(rad(a0))];
  const p1 = [c[0] + r * Math.cos(rad(a1)), c[1] - r * Math.sin(rad(a1))];
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
  return `<path d="M ${f(p0[0])} ${f(p0[1])} A ${f(r)} ${f(r)} 0 ${large} ${sweep} ${f(p1[0])} ${f(p1[1])}" stroke="${o.color || C.ink}" stroke-width="${o.w || 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} fill="${o.fill || 'none'}"/>`;
}

// 从点 p 看向点 q 的方向角（度，数学方向）
export const dir = (p, q) => (Math.atan2(p[1] - q[1], q[0] - p[0]) * 180) / Math.PI;

// 角的记号：顶点 v，两边分别指向 a、b，n 条弧（相等的角用相同条数）
export function angleMark(v, a, b, o = {}) {
  let d0 = dir(v, a), d1 = dir(v, b);
  let diff = d1 - d0;
  while (diff <= -180) diff += 360;
  while (diff > 180) diff -= 360;
  const r = o.r || 18, n = o.n || 1, out = [];
  for (let k = 0; k < n; k++) out.push(arc(v, r + k * 4, d0, d0 + diff, { color: o.color || C.emph, w: o.w || 1.5 }));
  return out.join('');
}

// 直角记号：顶点 v，两边指向 a、b
export function rightAngle(v, a, b, o = {}) {
  const s = o.size || 10;
  const u = p => { const l = Math.hypot(p[0] - v[0], p[1] - v[1]); return [(p[0] - v[0]) / l, (p[1] - v[1]) / l]; };
  const ua = u(a), ub = u(b);
  const p1 = [v[0] + s * ua[0], v[1] + s * ua[1]], p3 = [v[0] + s * ub[0], v[1] + s * ub[1]];
  const p2 = [p1[0] + s * ub[0], p1[1] + s * ub[1]];
  return `<polyline points="${[p1, p2, p3].map(p => p.map(f).join(',')).join(' ')}" stroke="${o.color || C.ink}" stroke-width="1.2" fill="none"/>`;
}

// 相等线段的记号：在线段 ab 中点画 n 条短线
export function tick(a, b, n = 1, o = {}) {
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const u = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], nn = [-u[1], u[0]];
  let s = '';
  for (let i = 0; i < n; i++) {
    const c = [m[0] + (i - (n - 1) / 2) * 5 * u[0], m[1] + (i - (n - 1) / 2) * 5 * u[1]];
    s += line(c[0] - 6 * nn[0], c[1] - 6 * nn[1], c[0] + 6 * nn[0], c[1] + 6 * nn[1], { color: o.color || C.emph, w: 2 });
  }
  return s;
}

// 点的名字：放在点 p 附近，偏移 [dx, dy]
export const label = (p, s, dx = 0, dy = -8, o = {}) => text(p[0] + dx, p[1] + dy, s, { italic: true, anchor: 'middle', ...o });

// 坐标系：原点 (ox, oy)，单位 u 像素；X(x)、Y(y) 把数学坐标换成像素
export function axes({ ox, oy, u, xmin, xmax, ymin, ymax, ticks = true, xlabel = 'x', ylabel = 'y', grid = true, step = 1 }) {
  const X = x => ox + u * x, Y = y => oy - u * y;
  const out = [];
  const range = (a, b) => { const r = []; for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) r.push(+v.toFixed(6)); return r; };
  if (grid) {
    for (const x of range(xmin, xmax)) if (x) out.push(line(X(x), Y(ymin), X(x), Y(ymax), { color: C.grid, w: 1 }));
    for (const y of range(ymin, ymax)) if (y) out.push(line(X(xmin), Y(y), X(xmax), Y(y), { color: C.grid, w: 1 }));
  }
  out.push(line(X(xmin), oy, X(xmax), oy, { color: C.axis, w: 1.5 }));
  out.push(line(ox, Y(ymin), ox, Y(ymax), { color: C.axis, w: 1.5 }));
  out.push(`<polygon points="${f(X(xmax) + 8)},${f(oy)} ${f(X(xmax))},${f(oy - 4)} ${f(X(xmax))},${f(oy + 4)}" fill="${C.axis}" stroke="none"/>`);
  out.push(`<polygon points="${f(ox)},${f(Y(ymax) - 8)} ${f(ox - 4)},${f(Y(ymax))} ${f(ox + 4)},${f(Y(ymax))}" fill="${C.axis}" stroke="none"/>`);
  out.push(text(X(xmax) + 4, oy + 18, xlabel, { italic: true, color: C.soft }));
  out.push(text(ox + 8, Y(ymax) - 2, ylabel, { italic: true, color: C.soft }));
  out.push(text(ox - 6, oy + 16, 'O', { anchor: 'end', italic: true, color: C.soft, size: 12 }));
  if (ticks) {
    const fmt = v => (v < 0 ? '−' + -v : String(v));
    for (const x of range(xmin, xmax)) if (x) out.push(text(X(x), oy + 16, fmt(x), { anchor: 'middle', color: C.soft, size: 11 }));
    for (const y of range(ymin, ymax)) if (y) out.push(text(ox - 6, Y(y) + 4, fmt(y), { anchor: 'end', color: C.soft, size: 11 }));
  }
  return { X, Y, body: out.join('\n') };
}

// 函数图象：在 [x0, x1] 上取 n 个点画 y = fn(x)，超出 [ymin, ymax] 的部分断开
export function plot(fn, x0, x1, X, Y, o = {}) {
  const n = o.n || 200, parts = [[]];
  for (let k = 0; k <= n; k++) {
    const x = x0 + ((x1 - x0) * k) / n, y = fn(x);
    if (!Number.isFinite(y) || (o.ymin !== undefined && y < o.ymin) || (o.ymax !== undefined && y > o.ymax)) { if (parts.at(-1).length) parts.push([]); continue; }
    parts.at(-1).push([X(x), Y(y)]);
  }
  return parts.filter(p => p.length > 1).map(p => polyline(p, o)).join('');
}

// 动画：给一个 <g> 加循环动画。values 是分号分隔的各帧取值，keyTimes 可省略
export const animate = (attr, values, dur, o = {}) =>
  `<animate attributeName="${attr}" values="${values}"${o.keyTimes ? ` keyTimes="${o.keyTimes}"` : ''} dur="${dur}s"${o.calcMode ? ` calcMode="${o.calcMode}"` : ''} repeatCount="indefinite"/>`;
export const animateTransform = (type, values, dur, o = {}) =>
  `<animateTransform attributeName="transform" type="${type}" values="${values}"${o.keyTimes ? ` keyTimes="${o.keyTimes}"` : ''} dur="${dur}s"${o.calcMode ? ` calcMode="${o.calcMode}"` : ''}${o.additive ? ` additive="${o.additive}"` : ''} repeatCount="indefinite"/>`;
