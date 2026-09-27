// 第九部分“圆的有关性质”的图。
import { C, f, svg, text, line, seg, dot, poly, circle, arc, angleMark, rightAngle, tick, rad } from './lib.mjs';

const files = {};
// 圆 O、半径 r 上方向角为 d 度的点（数学方向）
const P = (O, r, d) => [O[0] + r * Math.cos(rad(d)), O[1] - r * Math.sin(rad(d))];
// 点名放在圆外侧：沿方向角 d 再往外 k
const out_ = (O, r, d, s, k = 15, o = {}) => { const p = P(O, r + k, d); return text(p[0], p[1] + 5, s, { italic: true, anchor: 'middle', ...o }); };
const lab = (p, s, dx, dy, o = {}) => text(p[0] + dx, p[1] + dy, s, { italic: true, anchor: 'middle', ...o });

// ---------- 圆的定义：线段 OA 绕 O 旋转一周 ----------
{
  const O = [160, 110], r = 80, L = f(2 * Math.PI * r);
  const A = [O[0] + r, O[1]];
  const out = [];
  out.push(`<path d="M ${A[0]} ${A[1]} A ${r} ${r} 0 1 0 ${O[0] - r} ${O[1]} A ${r} ${r} 0 1 0 ${A[0]} ${A[1]}" stroke="${C.ink}" stroke-width="2" stroke-dasharray="${L} ${L}" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" values="${L};0;0" keyTimes="0;0.75;1" dur="8s" repeatCount="indefinite"/></path>`);
  out.push(`<g transform="rotate(0 ${O[0]} ${O[1]})">${line(O[0], O[1], A[0], A[1], { color: C.emph, w: 2.5 })}${dot(A[0], A[1], C.emph)}<animateTransform attributeName="transform" type="rotate" values="0 ${O[0]} ${O[1]};-360 ${O[0]} ${O[1]};-360 ${O[0]} ${O[1]}" keyTimes="0;0.75;1" dur="8s" repeatCount="indefinite"/></g>`);
  out.push(dot(...O), lab(O, 'O', -4, 20), lab(A, 'A', 14, 5), text(O[0] + r / 2, O[1] - 8, 'r', { italic: true, anchor: 'middle', color: C.emph }));
  files['circle-properties-define.svg'] = svg(320, 220, out.join('\n'));
}

// ---------- 弦、直径、弧 ----------
{
  const O = [160, 115], r = 90;
  const A = P(O, r, 180), B = P(O, r, 0), Cc = P(O, r, 125), D = P(O, r, 50), E = P(O, r, 270);
  const out = [circle(...O, r)];
  out.push(arc(O, r, 50, 125, { color: C.emph, w: 4 }));
  out.push(seg(A, B, { color: C.blue, w: 2.5 }), seg(Cc, D, { w: 2 }));
  for (const p of [A, B, Cc, D, E, O]) out.push(dot(...p));
  out.push(out_(O, r, 180, 'A'), out_(O, r, 0, 'B'), out_(O, r, 125, 'C'), out_(O, r, 50, 'D'), out_(O, r, 270, 'E'), lab(O, 'O', 0, 20));
  files['circle-properties-parts.svg'] = svg(320, 230, out.join('\n'));
}

// ---------- 旋转对称：圆心角相等，弧、弦也相等 ----------
{
  const O = [170, 125], r = 95, a1 = 150, b1 = 95, turn = 130;
  const A = P(O, r, a1), B = P(O, r, b1), A2 = P(O, r, a1 - turn), B2 = P(O, r, b1 - turn);
  const sector = (a, b, o) => `<path d="M ${f(O[0])} ${f(O[1])} L ${f(P(O, r, a)[0])} ${f(P(O, r, a)[1])} A ${r} ${r} 0 0 0 ${f(P(O, r, b)[0])} ${f(P(O, r, b)[1])} Z" fill="${o.fill}" stroke="none"/>`;
  const out = [circle(...O, r, { w: 1.5 })];
  out.push(seg(O, A), seg(O, B), seg(A, B, { color: C.blue, w: 2.5 }), arc(O, r, b1, a1, { color: C.emph, w: 4 }));
  out.push(seg(O, A2), seg(O, B2), seg(A2, B2, { color: C.blue, w: 2.5 }), arc(O, r, b1 - turn, a1 - turn, { color: C.emph, w: 4 }));
  out.push(angleMark(O, A, B, { r: 20 }), angleMark(O, A2, B2, { r: 20 }), tick(A, B, 1, { color: C.blue }), tick(A2, B2, 1, { color: C.blue }));
  // 转动的扇形
  const moving = sector(b1, a1, { fill: C.emphFill }) + seg(O, A, { color: C.emph, w: 1.5 }) + seg(O, B, { color: C.emph, w: 1.5 });
  const rv = d => `${d} ${O[0]} ${O[1]}`;
  out.push(`<g transform="rotate(0 ${O[0]} ${O[1]})">${moving}<animateTransform attributeName="transform" type="rotate" values="${rv(0)};${rv(0)};${rv(turn)};${rv(turn)};${rv(0)}" keyTimes="0;0.15;0.5;0.8;1" dur="8s" repeatCount="indefinite"/></g>`);
  for (const p of [A, B, A2, B2, O]) out.push(dot(...p));
  out.push(out_(O, r, a1, 'A'), out_(O, r, b1, 'B'), out_(O, r, a1 - turn, 'A′'), out_(O, r, b1 - turn, 'B′'), lab(O, 'O', -8, 20));
  files['circle-properties-central.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 垂径定理：沿直径 CD 翻折 ----------
{
  const O = [170, 125], r = 95, e = 45;
  const E = [O[0], O[1] + e], hw = Math.sqrt(r * r - e * e);
  const A = [O[0] - hw, E[1]], B = [O[0] + hw, E[1]], Cc = P(O, r, 90), D = P(O, r, 270);
  const t = (Math.asin(e / r) * 180) / Math.PI, dA = 180 + t, dB = 360 - t; // A、B 的方向角
  const out = [];
  // 四段弧：AC、BC 用蓝色，AD、BD 用红色
  out.push(arc(O, r, 90, dA, { color: C.blue, w: 3 }), arc(O, r, -t, 90, { color: C.blue, w: 3 }));
  out.push(arc(O, r, dA, 270, { color: C.emph, w: 3.5 }), arc(O, r, 270, dB, { color: C.emph, w: 3.5 }));
  // 翻折：左半边沿 CD 翻到右边
  const half = arc(O, r, 90, dA, { color: C.blue, w: 2 }) + arc(O, r, dA, 270, { color: C.emph, w: 2.5 }) + seg(A, E, { color: C.ink, w: 2 }) + dot(...A, C.ink);
  out.push(`<g transform="translate(${O[0]} 0)"><g opacity="0.6"><g transform="translate(${-O[0]} 0)">${half}</g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;-1 1;-1 1;1 1" keyTimes="0;0.2;0.5;0.75;1" dur="7s" repeatCount="indefinite"/></g></g>`);
  out.push(seg(Cc, D), seg(A, B), seg(O, A, { color: C.soft, w: 1.5, dash: '5 4' }), seg(O, B, { color: C.soft, w: 1.5, dash: '5 4' }));
  out.push(rightAngle(E, B, Cc), tick(A, E, 1), tick(E, B, 1));
  for (const p of [A, B, Cc, D, E, O]) out.push(dot(...p));
  out.push(out_(O, r, 90, 'C'), out_(O, r, 270, 'D'), lab(A, 'A', -14, 5), lab(B, 'B', 14, 5), lab(E, 'E', 12, 18), lab(O, 'O', -14, -4));
  files['circle-properties-perpendicular.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 算长度：半径 r、弦心距 d、弦长 a（静态，和上图同一个位置关系） ----------
{
  const O = [170, 120], r = 100, e = 60;
  const E = [O[0], O[1] + e], hw = Math.sqrt(r * r - e * e);
  const A = [O[0] - hw, E[1]], B = [O[0] + hw, E[1]], Cc = P(O, r, 90), D = P(O, r, 270);
  const out = [];
  out.push(poly([O, A, E], { fill: C.emphFill, color: 'none', w: 0 }));
  out.push(circle(...O, r, { w: 2 }), seg(Cc, D, { color: C.soft, w: 1.5 }), seg(A, B, { w: 2 }));
  out.push(seg(O, A, { color: C.emph, w: 2.5 }), seg(O, E, { color: C.blue, w: 3 }));
  out.push(rightAngle(E, B, Cc), tick(A, E, 1), tick(E, B, 1));
  // 标注 r、d
  out.push(text((O[0] + A[0]) / 2 - 4, (O[1] + A[1]) / 2 - 6, 'r', { italic: true, color: C.emph, size: 16, anchor: 'end' }));
  out.push(text(O[0] - 7, (O[1] + E[1]) / 2 + 12, 'd', { italic: true, color: C.blue, size: 16, anchor: 'end' }));
  // 弦长 a：弦 AB 下方的尺寸线
  const y = O[1] + r + 24;                      // 尺寸线放在圆的下方，从 A、B 引细虚线下来
  out.push(line(A[0], A[1] + 6, A[0], y + 6, { color: C.soft, w: 1, dash: '3 3' }), line(B[0], B[1] + 6, B[0], y + 6, { color: C.soft, w: 1, dash: '3 3' }));
  out.push(line(A[0], y, B[0], y, { color: C.soft, w: 1 }), line(A[0], y - 5, A[0], y + 5, { color: C.soft, w: 1 }), line(B[0], y - 5, B[0], y + 5, { color: C.soft, w: 1 }));
  out.push(`<rect x="${f(O[0] - 10)}" y="${f(y - 10)}" width="20" height="18" fill="#ffffff" stroke="none"/>`);
  out.push(text(O[0], y + 6, 'a', { italic: true, anchor: 'middle', size: 16 }));
  for (const p of [A, B, Cc, D, E, O]) out.push(dot(...p));
  out.push(out_(O, r, 90, 'C'), lab(D, 'D', 12, 16), lab(A, 'A', -14, 5), lab(B, 'B', 14, 5), lab(E, 'E', 13, 17), lab(O, 'O', 14, -4));
  files['circle-properties-chord-distance.svg'] = svg(340, 265, out.join('\n'));
}

// ---------- 例 1：桥拱 ----------
// 题干图（circle-properties-bridge.svg）只画桥拱、跨度和拱高；解答里的图（circle-properties-bridge-solution.svg）再添上圆心 O、OA、OD
for (const withO of [false, true]) {
  const u = 12, r = 10 * u, O = [170, 200];
  const Cc = [O[0], O[1] - r], D = [O[0], O[1] - 6 * u], A = [O[0] - 8 * u, D[1]], B = [O[0] + 8 * u, D[1]];
  const dA = (Math.atan2(O[1] - A[1], A[0] - O[0]) * 180) / Math.PI;
  const out = [];
  out.push(arc(O, r, dA, 180 - dA, { color: C.ink, w: 3 }));
  out.push(seg(A, B), seg(Cc, D, { color: C.emph, w: 2.5 }));
  if (withO) out.push(seg(D, O, { color: C.blue, w: 1.5, dash: '5 4' }), seg(O, A, { color: C.blue, w: 1.5, dash: '5 4' }));
  out.push(rightAngle(D, B, Cc));
  for (const p of withO ? [A, B, Cc, D, O] : [A, B, Cc, D]) out.push(dot(...p));
  out.push(lab(A, 'A', -14, 5), lab(B, 'B', 14, 5), lab(Cc, 'C', 0, -10), lab(D, 'D', -12, 18));
  if (withO) {
    out.push(lab(O, 'O', 0, 20));
    out.push(text((O[0] + A[0]) / 2 - 8, (O[1] + A[1]) / 2 + 14, 'r', { italic: true, anchor: 'middle', color: C.blue, size: 15 }));
    out.push(text(O[0] + 8, (O[1] + D[1]) / 2 + 5, 'r − 4', { color: C.blue, size: 13 }));
    out.push(text((A[0] + D[0]) / 2, D[1] - 7, '8', { anchor: 'middle', color: C.soft, size: 13 }));
  } else {
    // 跨度 AB：弦下方的尺寸线
    const y = D[1] + 38;
    out.push(line(A[0], y, B[0], y, { color: C.soft, w: 1 }), line(A[0], y - 5, A[0], y + 5, { color: C.soft, w: 1 }), line(B[0], y - 5, B[0], y + 5, { color: C.soft, w: 1 }));
    out.push(`<rect x="${f(D[0] - 20)}" y="${f(y - 9)}" width="40" height="16" fill="#ffffff" stroke="none"/>`, text(D[0], y + 5, '16 m', { anchor: 'middle', color: C.soft, size: 13 }));
    out.push(text(D[0] + 8, (Cc[1] + D[1]) / 2 + 5, '4 m', { color: C.emph, size: 13 }));
  }
  files[withO ? 'circle-properties-bridge-solution.svg' : 'circle-properties-bridge.svg'] = svg(340, withO ? 230 : 180, out.join('\n'));
}

// ---------- 圆周角定理的三种情况 ----------
{
  const r = 58, cases = [
    { a: 200, b: 300, c: 20, name: '圆心在角的一边上' },
    { a: 215, b: 320, c: 60, d: 35, name: '圆心在角的内部' },
    { a: 200, b: 295, c: 345, d: 20, name: '圆心在角的外部' },
  ];
  const out = [];
  cases.forEach((k, i) => {
    const O = [85 + i * 160, 95];
    const A = P(O, r, k.a), B = P(O, r, k.b), Cc = P(O, r, k.c);
    out.push(circle(...O, r, { w: 1.5 }), arc(O, r, k.b, k.c > k.b ? k.c : k.c + 360, { color: C.emph, w: 3.5 }));
    if (k.d !== undefined) { const D = P(O, r, k.d); out.push(seg(A, D, { color: C.soft, w: 1.2, dash: '4 3' }), dot(...D, C.soft, 3), out_(O, r, k.d, 'D', 12, { color: C.soft, size: 13 })); }
    out.push(seg(A, B), seg(A, Cc), seg(O, B, { color: C.blue, w: 1.5 }), seg(O, Cc, { color: C.blue, w: 1.5 }));
    out.push(angleMark(A, B, Cc, { r: 16 }), angleMark(O, B, Cc, { r: 12, color: C.blue }));
    for (const p of [A, B, Cc, O]) out.push(dot(...p, C.ink, 3));
    out.push(out_(O, r, k.a, 'A', 12), out_(O, r, k.b, 'B', 12), out_(O, r, k.c, 'C', 12));
    out.push(text(O[0] + (k.d === 35 ? -12 : -2), O[1] + (k.d === 35 ? 4 : -8), 'O', { italic: true, anchor: 'end', size: 13 }));
    out.push(text(O[0], O[1] + r + 34, `${'①②③'[i]} ${k.name}`, { anchor: 'middle', size: 13, color: C.soft }));
  });
  files['circle-properties-inscribed-cases.svg'] = svg(490, 200, out.join('\n'));
}

// ---------- 同弧所对的圆周角相等 ----------
{
  const O = [170, 130], r = 95;
  const A = P(O, r, 200), B = P(O, r, 340), pts = [[50, 'C'], [90, 'D'], [130, 'E']];
  const out = [circle(...O, r, { w: 1.5 }), arc(O, r, 200, 340, { color: C.emph, w: 3.5 })];
  out.push(seg(O, A, { color: C.blue, w: 1.5, dash: '5 4' }), seg(O, B, { color: C.blue, w: 1.5, dash: '5 4' }), angleMark(O, A, B, { r: 14, color: C.blue }));
  for (const [d, name] of pts) {
    const X = P(O, r, d);
    out.push(seg(X, A, { w: 1.5 }), seg(X, B, { w: 1.5 }), angleMark(X, A, B, { r: 20 }), dot(...X), out_(O, r, d, name));
  }
  out.push(dot(...A), dot(...B), dot(...O), out_(O, r, 200, 'A'), out_(O, r, 340, 'B'), lab(O, 'O', 0, -10));
  files['circle-properties-same-arc.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 直径所对的圆周角是直角 ----------
{
  const O = [170, 115], r = 95;
  const A = P(O, r, 180), B = P(O, r, 0), pts = [[60, 'C'], [128, 'D'], [245, 'E']];
  const out = [circle(...O, r, { w: 1.5 }), seg(A, B, { color: C.emph, w: 2.5 })];
  for (const [d, name] of pts) {
    const X = P(O, r, d);
    out.push(seg(X, A, { w: 1.5 }), seg(X, B, { w: 1.5 }), rightAngle(X, A, B, { size: 9 }), dot(...X), out_(O, r, d, name));
  }
  out.push(dot(...A), dot(...B), dot(...O), out_(O, r, 180, 'A'), out_(O, r, 0, 'B'), lab(O, 'O', 0, 20));
  files['circle-properties-diameter.svg'] = svg(340, 230, out.join('\n'));
}

// ---------- 例 2 ----------
// 题干图 circle-properties-example.svg：只画已知条件，∠BDC 是要求的角；
// 解法图 circle-properties-example-ac.svg：连接 AC；“想一想”的图 circle-properties-example-oc.svg：连接 OC
for (const kind of ['given', 'ac', 'oc']) {
  const O = [170, 125], r = 95;
  const A = P(O, r, 180), B = P(O, r, 0), Cc = P(O, r, 80), D = P(O, r, 228);
  const out = [circle(...O, r, { w: 1.5 })];
  out.push(seg(A, B), seg(B, Cc), seg(Cc, D), seg(D, B));
  out.push(angleMark(B, A, Cc, { r: 22, color: C.blue }), text(B[0] - 43, B[1] - 11, '50°', { color: C.blue, size: 13, anchor: 'middle' }));
  out.push(angleMark(D, B, Cc, { r: 22 }));
  if (kind === 'ac') out.push(seg(A, Cc, { color: C.blue, w: 2, dash: '6 4' }), angleMark(A, B, Cc, { r: 22 }), rightAngle(Cc, A, B));
  if (kind === 'oc') {
    out.push(seg(O, Cc, { color: C.blue, w: 2, dash: '6 4' }), angleMark(Cc, O, B, { r: 18, color: C.blue }), angleMark(O, B, Cc, { r: 16 }));
  }
  for (const p of [A, B, Cc, D, O]) out.push(dot(...p));
  out.push(out_(O, r, 180, 'A'), out_(O, r, 0, 'B'), out_(O, r, 80, 'C'), out_(O, r, 228, 'D'), lab(O, 'O', -2, 20));
  files[{ given: 'circle-properties-example.svg', ac: 'circle-properties-example-ac.svg', oc: 'circle-properties-example-oc.svg' }[kind]] = svg(340, 250, out.join('\n'));
}

// ---------- 直径是最长的弦：连接 OC、OD ----------
{
  const O = [170, 115], r = 90;
  const A = P(O, r, 180), B = P(O, r, 0), Cc = P(O, r, 140), D = P(O, r, 60);
  const out = [circle(...O, r, { w: 2 }), seg(A, B, { color: C.blue, w: 2.5 }), seg(Cc, D, { w: 2.5 })];
  out.push(seg(O, Cc, { color: C.emph, w: 1.8, dash: '6 4' }), seg(O, D, { color: C.emph, w: 1.8, dash: '6 4' }), tick(O, Cc, 1), tick(O, D, 1));
  for (const p of [A, B, Cc, D, O]) out.push(dot(...p));
  out.push(out_(O, r, 180, 'A'), out_(O, r, 0, 'B'), out_(O, r, 140, 'C'), out_(O, r, 60, 'D'), lab(O, 'O', 0, 20));
  files['circle-properties-longest.svg'] = svg(340, 230, out.join('\n'));
}

// ---------- 圆内接四边形 ----------
{
  const O = [160, 125], r = 95;
  const A = P(O, r, 150), B = P(O, r, 220), Cc = P(O, r, 310), D = P(O, r, 50);
  const E = [Cc[0] + (Cc[0] - B[0]) * 0.55, Cc[1] + (Cc[1] - B[1]) * 0.55];
  const out = [arc(O, r, 220, 410, { color: C.blue, w: 3.5 }), arc(O, r, 50, 220, { color: C.emph, w: 3.5 })];
  out.push(poly([A, B, Cc, D]), seg(Cc, E, { dash: '6 4' }));
  out.push(angleMark(A, B, D, { r: 20, color: C.blue }), angleMark(Cc, D, B, { r: 18 }), angleMark(Cc, E, D, { r: 22, color: C.blue }));
  for (const p of [A, B, Cc, D, O]) out.push(dot(...p));
  out.push(out_(O, r, 150, 'A'), out_(O, r, 220, 'B'), out_(O, r, 310, 'C', 17), out_(O, r, 50, 'D'), lab(E, 'E', 12, 10), lab(O, 'O', 0, -10));
  files['circle-properties-cyclic.svg'] = svg(340, 250, out.join('\n'));
}

// ---------- 圆是轴对称图形：P 关于直径所在直线的对称点 P′ 也在圆上 ----------
{
  const O = [170, 115], r = 88, out = [];
  out.push(circle(...O, r, { w: 2 }));
  // 对称轴：竖直的直径所在直线（虚线，两端伸出圆外）
  out.push(line(O[0], O[1] - r - 18, O[0], O[1] + r + 18, { color: C.blue, w: 1.5, dash: '6 4' }));
  const Pp = P(O, r, 145), Pq = [2 * O[0] - Pp[0], Pp[1]];     // P 在左上，P′ 是它关于竖直直线的对称点
  const M = [O[0], Pp[1]];                                      // PP′ 与对称轴的交点
  out.push(line(...Pp, ...Pq, { color: C.soft, w: 1.5 }), rightAngle(M, Pq, [O[0], O[1]], { size: 8 }));
  out.push(tick(Pp, M, 1, { color: C.blue }), tick(M, Pq, 1, { color: C.blue }));   // 对称轴平分 PP′
  out.push(line(...O, ...Pp, { color: C.emph, w: 2 }), line(...O, ...Pq, { color: C.emph, w: 2 }));
  out.push(tick(O, Pp, 2), tick(O, Pq, 2));                                           // OP = OP′
  out.push(dot(...O), dot(...Pp), dot(...Pq, C.emph));
  out.push(lab(O, 'O', 12, 16), lab(Pp, 'P', -10, -6), lab(Pq, 'P′', 12, -6, { color: C.emph }));
  files['circle-properties-reflect.svg'] = svg(340, 230, out.join('\n'));
}

export default files;
