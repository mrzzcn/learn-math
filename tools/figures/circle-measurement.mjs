// 第九部分“与圆有关的计算”的图。
import { C, f, svg, text, line, seg, dot, poly, circle, arc, angleMark, rightAngle, rad } from './lib.mjs';

const files = {};
const P = (O, r, d) => [O[0] + r * Math.cos(rad(d)), O[1] - r * Math.sin(rad(d))];
const out_ = (O, r, d, s, k = 15, o = {}) => { const p = P(O, r + k, d); return text(p[0], p[1] + 5, s, { italic: true, anchor: 'middle', ...o }); };
const lab = (p, s, dx, dy, o = {}) => text(p[0] + dx, p[1] + dy, s, { italic: true, anchor: 'middle', ...o });
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
// 扇形：圆心 O，半径 r，从 a0 度逆时针到 a1 度
const sector = (O, r, a0, a1, o = {}) => {
  const p0 = P(O, r, a0), p1 = P(O, r, a1), large = a1 - a0 > 180 ? 1 : 0;
  return `<path d="M ${f(O[0])} ${f(O[1])} L ${f(p0[0])} ${f(p0[1])} A ${f(r)} ${f(r)} 0 ${large} 0 ${f(p1[0])} ${f(p1[1])} Z" fill="${o.fill || 'none'}" stroke="${o.color || 'none'}" stroke-width="${o.w || 1.5}"/>`;
};

// ---------- 正多边形与圆：中心、半径、中心角、边心距 ----------
{
  const O = [160, 125], R = 100, names = 'ABCDEF';
  const V = [240, 300, 0, 60, 120, 180].map(d => P(O, R, d));
  const M = mid(V[0], V[1]);
  const out = [circle(...O, R, { color: C.soft, w: 1.5 }), poly(V, { w: 2 })];
  out.push(seg(O, V[0], { color: C.emph, w: 2 }), seg(O, V[1], { color: C.emph, w: 2 }), seg(O, M, { color: C.blue, w: 2, dash: '6 4' }));
  out.push(angleMark(O, V[0], V[1], { r: 20 }), rightAngle(M, V[1], O, { size: 8 }));
  V.forEach((p, i) => out.push(dot(...p), out_(O, R, [240, 300, 0, 60, 120, 180][i], names[i], 14)));
  out.push(dot(...O), dot(...M, C.blue), lab(O, 'O', 0, -10), lab(M, 'M', -11, -7, { color: C.blue }));
  out.push(text((O[0] + V[0][0]) / 2 - 12, (O[1] + V[0][1]) / 2 + 2, 'R', { italic: true, anchor: 'middle', color: C.emph }), text(O[0] + 10, (O[1] + M[1]) / 2 + 14, 'r', { italic: true, color: C.blue }));
  files['circle-measurement-polygon.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 割圆：边数越多，越接近圆 ----------
{
  const r = 62, ns = [6, 12, 24];
  const out = [];
  ns.forEach((n, i) => {
    const O = [85 + i * 160, 80];
    const V = Array.from({ length: n }, (_, k) => P(O, r, 90 + (360 * k) / n));
    out.push(circle(...O, r, { color: C.soft, w: 1 }), poly(V, { color: C.emph, w: 1.8 }), dot(...O, C.ink, 3));
    out.push(text(O[0], O[1] + r + 30, `正 ${n} 边形`, { anchor: 'middle', size: 13, color: C.soft }));
  });
  files['circle-measurement-cut.svg'] = svg(490, 180, out.join('\n'));
}

// ---------- 圆的面积：剪成扇形，拼成近似的长方形 ----------
{
  const R = 60, n = 16, half = 180 / n, O = [80, 105];
  const c = 2 * R * Math.sin(rad(half)), h = R * Math.cos(rad(half));
  const x0 = 200, top = 75;
  const shape = `M 0 0 L ${f(-c / 2)} ${f(h)} A ${R} ${R} 0 0 0 ${f(c / 2)} ${f(h)} Z`;
  const out = [circle(...O, R, { color: C.soft, w: 1, dash: '4 4' })];
  const kt = '0;0.12;0.42;0.58;0.88;1', dur = 10;
  for (let i = 0; i < n; i++) {
    const phi = (i + 0.5) * (360 / n), upper = phi < 180;
    const j = upper ? n / 2 - 1 - i : i - n / 2; // 从左到右的位置
    const row = upper ? [x0 + j * c + c / 2, top + h] : [x0 + j * c, top];
    const rotRow = upper ? 180 : 0;
    let rotC = -phi - 90;
    while (rotC - rotRow > 180) rotC -= 360;
    while (rotC - rotRow < -180) rotC += 360;
    const tr = p => `${f(p[0])} ${f(p[1])}`, rt = a => f(a);
    const col = upper ? C.emph : C.blue, fill = upper ? C.emphFill : C.blueFill;
    out.push(`<g transform="translate(${tr(row)}) rotate(${rotRow})"><path d="${shape}" fill="${fill}" stroke="${col}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<animateTransform attributeName="transform" type="translate" values="${[row, row, O, O, row, row].map(tr).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/>` +
      `<animateTransform attributeName="transform" type="rotate" additive="sum" values="${[rotRow, rotRow, rotC, rotC, rotRow, rotRow].map(rt).join(';')}" keyTimes="${kt}" dur="${dur}s" repeatCount="indefinite"/></g>`);
  }
  out.push(dot(...O, C.ink, 3), seg(O, P(O, R, 90), { color: C.ink, w: 1.5 }), text(O[0] + 8, O[1] - R / 2 + 4, 'R', { italic: true }));
  // 尺寸：底边约为 πR，高约为 R
  const L = x0 - c / 2, Rt = x0 + (n / 2 - 1) * c + c;
  out.push(line(L, top + h + 18, Rt, top + h + 18, { color: C.soft, w: 1 }), line(L, top + h + 13, L, top + h + 23, { color: C.soft, w: 1 }), line(Rt, top + h + 13, Rt, top + h + 23, { color: C.soft, w: 1 }));
  out.push(text((L + Rt) / 2, top + h + 38, '约等于 πR（周长的一半）', { anchor: 'middle', size: 13, color: C.soft }));
  out.push(line(L - 14, top, L - 14, top + h, { color: C.soft, w: 1 }), text(L - 22, top + h / 2 + 5, 'R', { italic: true, anchor: 'end', color: C.soft }));
  files['circle-measurement-area.svg'] = svg(440, 200, out.join('\n'));
}

// ---------- 扇形：弧长 l、半径 R、圆心角 n° ----------
{
  const O = [160, 135], R = 100, a0 = 30, a1 = 150;
  const A = P(O, R, a0), B = P(O, R, a1);
  const out = [arc(O, R, a1, a0 + 360, { color: C.soft, w: 1, dash: '4 4' }), sector(O, R, a0, a1, { fill: C.emphFill })];
  out.push(seg(O, A), seg(O, B), arc(O, R, a0, a1, { color: C.emph, w: 3.5 }), arc(O, 22, a0, a1, { color: C.blue, w: 1.5 }));
  out.push(dot(...O), dot(...A), dot(...B), lab(O, 'O', 0, 20), out_(O, R, a0, 'A', 14), out_(O, R, a1, 'B', 14));
  out.push(text(O[0], O[1] - 30, 'n°', { anchor: 'middle', color: C.blue }), text((O[0] + A[0]) / 2 + 12, (O[1] + A[1]) / 2 + 12, 'R', { italic: true, anchor: 'middle' }));
  out.push(text(O[0], O[1] - R - 12, 'l', { italic: true, anchor: 'middle', color: C.emph }));
  files['circle-measurement-sector.svg'] = svg(320, 250, out.join('\n'));
}

// ---------- 例 2：弓形面积 ----------
// 题干图（circle-measurement-segment.svg）只画扇形、弦和已知数据；解答里的图（circle-measurement-segment-solution.svg）再添上 OC ⊥ AB
for (const withC of [false, true]) {
  const O = [160, 140], R = 100, a0 = 30, a1 = 150;
  const A = P(O, R, a0), B = P(O, R, a1), M = mid(A, B);
  const seg_ = `<path d="M ${f(A[0])} ${f(A[1])} A ${R} ${R} 0 0 0 ${f(B[0])} ${f(B[1])} Z" fill="${C.emphFill}" stroke="none"/>`;
  const out = [arc(O, R, a1, a0 + 360, { color: C.soft, w: 1, dash: '4 4' }), seg_, poly([O, A, B], { fill: C.blueFill, color: C.ink, w: 2 })];
  out.push(arc(O, R, a0, a1, { color: C.emph, w: 3 }));
  if (withC) out.push(seg(O, M, { color: C.blue, w: 1.5, dash: '5 4' }), rightAngle(M, A, O, { size: 8 }));
  out.push(dot(...O), dot(...A), dot(...B));
  if (withC) out.push(dot(...M, C.blue, 3.5), lab(M, 'C', 10, -6, { color: C.blue }));
  out.push(lab(O, 'O', 0, 20), out_(O, R, a0, 'A', 14), out_(O, R, a1, 'B', 14));
  // 120° 写在角的下方（圆心下面），不和 OC 重叠；半径 6 写在 OA 旁
  out.push(arc(O, 14, a0, a1, { color: C.soft, w: 1.2 }), text(O[0] - 34, O[1] - 2, '120°', { anchor: 'middle', size: 11, color: C.soft }));
  out.push(text((O[0] + A[0]) / 2 + 8, (O[1] + A[1]) / 2 + 14, '6', { anchor: 'middle', size: 13, color: C.soft }));
  files[withC ? 'circle-measurement-segment-solution.svg' : 'circle-measurement-segment.svg'] = svg(320, 260, out.join('\n'));
}

// ---------- 弓形面积：圆心角小于 180° 时扇形减三角形，大于 180° 时扇形加三角形 ----------
{
  const R = 70, out = [];
  const panel = (O, a0, a1, major, cap) => {
    // 弓形：弦 AB 和弧 AB（major 为真时取优弧）围成
    const A = P(O, R, a0), B = P(O, R, a1);
    const d = major
      ? `M ${f(A[0])} ${f(A[1])} A ${R} ${R} 0 1 1 ${f(B[0])} ${f(B[1])} Z`
      : `M ${f(A[0])} ${f(A[1])} A ${R} ${R} 0 0 0 ${f(B[0])} ${f(B[1])} Z`;
    out.push(circle(...O, R, { color: C.soft, w: 1, dash: '4 4' }), `<path d="${d}" fill="${C.emphFill}" stroke="${C.emph}" stroke-width="2.5"/>`);
    out.push(poly([O, A, B], { fill: major ? C.blueFill : 'none', color: C.blue, w: 1.8, dash: major ? '' : '5 4' }));
    out.push(dot(...O), dot(...A), dot(...B), lab(O, 'O', 0, major ? -8 : 18), out_(O, R, a0, 'A', 13), out_(O, R, a1, 'B', 13));
    out.push(text(O[0], 208, cap, { anchor: 'middle', size: 13, color: C.soft }));
  };
  panel([100, 95], 30, 150, false, '弓形 = 扇形 − 三角形');
  panel([300, 98], 240, 300, true, '弓形 = 扇形 + 三角形');
  files['circle-measurement-segment-major.svg'] = svg(410, 220, out.join('\n'));
}

// ---------- 圆锥和它的展开图 ----------
{
  const r = 54, l = 90, h = Math.sqrt(l * l - r * r);
  const Bc = [90, 200], S = [Bc[0], Bc[1] - h], ry = 15;
  const out = [];
  // 圆锥：底面椭圆（后半虚线）、两条母线、高、底面半径
  out.push(`<path d="M ${Bc[0] - r} ${Bc[1]} A ${r} ${ry} 0 0 1 ${Bc[0] + r} ${Bc[1]}" stroke="${C.emph}" stroke-width="1.5" stroke-dasharray="4 4"/>`);
  out.push(`<path d="M ${Bc[0] - r} ${Bc[1]} A ${r} ${ry} 0 0 0 ${Bc[0] + r} ${Bc[1]}" stroke="${C.emph}" stroke-width="2.5"/>`);
  out.push(seg(S, [Bc[0] - r, Bc[1]], { color: C.blue, w: 2.2 }), seg(S, [Bc[0] + r, Bc[1]], { color: C.ink, w: 2 }));
  out.push(seg(S, Bc, { color: C.soft, w: 1.5, dash: '5 4' }), seg(Bc, [Bc[0] + r, Bc[1]], { color: C.soft, w: 1.5, dash: '5 4' }), rightAngle(Bc, [Bc[0] + r, Bc[1]], S, { size: 7 }));
  out.push(text(Bc[0] - r / 2 - 14, (S[1] + Bc[1]) / 2, 'l', { italic: true, anchor: 'middle', color: C.blue }), text(Bc[0] + 6, (S[1] + Bc[1]) / 2 + 12, 'h', { italic: true, color: C.soft }), text(Bc[0] + r / 4 + 3, Bc[1] - 3, 'r', { italic: true, anchor: 'middle', color: C.soft, size: 13 }));
  // 展开图：扇形，半径 l，圆心角 360r/l
  const ang = (360 * r) / l, V = [300, 95], a0 = 270 - ang / 2, a1 = 270 + ang / 2;
  const p0 = P(V, l, a0), p1 = P(V, l, a1);
  out.push(`<path d="M ${f(V[0])} ${f(V[1])} L ${f(p0[0])} ${f(p0[1])} A ${l} ${l} 0 1 0 ${f(p1[0])} ${f(p1[1])} Z" fill="${C.emphFill}" stroke="none"/>`);
  out.push(seg(V, p0, { color: C.blue, w: 2.2 }), seg(V, p1, { color: C.ink, w: 2 }), arc(V, l, a0, a1, { color: C.emph, w: 2.5 }));
  out.push(text((V[0] + p0[0]) / 2 - 4, (V[1] + p0[1]) / 2 - 8, 'l', { italic: true, anchor: 'middle', color: C.blue }));
  // 底面圆：与扇形的弧相切
  const t = 300, Bc2 = P(V, l + r, t);
  out.push(circle(...Bc2, r, { color: C.emph, w: 2.5 }), dot(...Bc2, C.ink, 3), seg(Bc2, P(Bc2, r, 30), { color: C.soft, w: 1.5, dash: '5 4' }), text(...P(Bc2, r / 2 + 2, 55), 'r', { italic: true, anchor: 'middle', color: C.soft }));
  out.push(dot(...S), dot(...V));
  files['circle-measurement-cone.svg'] = svg(480, 300, out.join('\n'));
}

// ---------- 表格里的三张小图：正三角形、正方形、正六边形 ----------
// 放在表格单元格里，PDF 中缩到 36 mm 宽，所以画布只有 150 像素宽
for (const [n, name] of [[3, 'triangle'], [4, 'square'], [6, 'hexagon']]) {
  const O = [75, n === 3 ? 66 : 75], R = 58, out = [];
  const pt = deg => [O[0] + R * Math.cos((deg * Math.PI) / 180), O[1] - R * Math.sin((deg * Math.PI) / 180)];
  const half = 180 / n;
  const verts = Array.from({ length: n }, (_, k) => pt(-90 - half + (k * 360) / n));
  const A = verts[0], B = verts[1];                       // 底边 AB 水平，A 在左、B 在右
  const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  out.push(`<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="none" stroke="${C.soft}" stroke-width="1.2"/>`);
  out.push(`<polygon points="${verts.map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ')}" fill="${C.blueFill}" stroke="${C.ink}" stroke-width="1.8" stroke-linejoin="round"/>`);
  out.push(line(...O, ...A, { color: C.soft, w: 1.2 }), line(...O, ...B, { color: C.emph, w: 2 }));
  out.push(line(...O, ...M, { color: C.blue, w: 1.8, dash: '4 3' }), line(...A, ...B, { w: 3 }));
  // 直角记号（M 处）
  out.push(`<polyline points="${M[0] + 7},${M[1]} ${M[0] + 7},${M[1] - 7} ${M[0]},${M[1] - 7}" stroke="${C.ink}" stroke-width="1" fill="none"/>`);
  // 中心角：从 OA 到 OB 的弧（度数写在表格的“中心角”一列，图上只用弧指出是哪个角）
  const a0 = -90 - half, a1 = -90 + half, ar = 13;
  const p0 = [O[0] + ar * Math.cos((a0 * Math.PI) / 180), O[1] - ar * Math.sin((a0 * Math.PI) / 180)];
  const p1 = [O[0] + ar * Math.cos((a1 * Math.PI) / 180), O[1] - ar * Math.sin((a1 * Math.PI) / 180)];
  out.push(`<path d="M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${ar} ${ar} 0 0 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" stroke="${C.emph}" stroke-width="1.5" fill="none"/>`);
  out.push(`<circle cx="${O[0]}" cy="${O[1]}" r="2.8" fill="${C.ink}"/>`);
  // 标注
  const mOB = [(O[0] + B[0]) / 2, (O[1] + B[1]) / 2];
  out.push(text(mOB[0] + 8, mOB[1] - 3, 'R', { italic: true, color: C.emph, size: 13 }));
  out.push(text(O[0] - 5, (O[1] + M[1]) / 2 + (n === 3 ? 9 : 6), 'r', { italic: true, color: C.blue, size: 13, anchor: 'end' }));
  out.push(text(M[0], M[1] + 15, 'a', { italic: true, size: 13, anchor: 'middle' }));
  out.push(text(O[0] - 9, O[1] - 5, 'O', { italic: true, size: 11, anchor: 'end' }));
  files[`circle-measurement-cell-${name}.svg`] = svg(150, n === 3 ? 140 : 150, out.join('\n'));
}

export default files;
