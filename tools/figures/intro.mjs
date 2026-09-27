// 导读（content/index.md）的图：全书各部分和几条主线的关系。
import { C, f, svg, text, line } from './lib.mjs';

const files = {};

{
  const out = [];
  const box = (x, y, w, h, title, sub, o = {}) => {
    const color = o.color || C.ink;
    out.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="6" fill="${o.fill || 'none'}" stroke="${color}" stroke-width="${o.w || 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`);
    out.push(text(x + w / 2, y + 22, title, { anchor: 'middle', size: o.size || 14, color }));
    out.push(text(x + w / 2, y + 40, sub, { anchor: 'middle', size: 11, color: C.soft }));
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  };
  // 带箭头的折线：pts 是 [[x, y], …]，箭头画在最后一段的末端
  const arrow = (pts, o = {}) => {
    const color = o.color || C.soft;
    const [p, q] = pts.slice(-2);
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / l, (q[1] - p[1]) / l], n = [-u[1], u[0]];
    const b = [q[0] - 8 * u[0], q[1] - 8 * u[1]];
    const path = [...pts.slice(0, -1), b];
    for (let i = 0; i + 1 < path.length; i++) out.push(line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], { color, w: 1.5, dash: o.dash }));
    out.push(`<polygon points="${f(q[0])},${f(q[1])} ${f(b[0] + 4 * n[0])},${f(b[1] + 4 * n[1])} ${f(b[0] - 4 * n[0])},${f(b[1] - 4 * n[1])}" fill="${color}" stroke="none"/>`);
  };

  const L = 30, R = 300, W = 210, H = 50;
  const rows = [110, 180, 250, 320, 390];

  // 第一部分：全书的工具
  const p1 = box(L, 16, R + W - L, H, '第一部分　数学的语言与推理', '三种语言 · 定义与命题 · 基本事实 · 证明：全书的工具', { color: C.blue });

  // 两条主线的标题
  out.push(text(L + W / 2, 94, '数 → 式 → 方程与函数', { anchor: 'middle', size: 12, color: C.soft }));
  out.push(text(R + W / 2, 94, '形 → 推理 → 变换', { anchor: 'middle', size: 12, color: C.soft }));

  // 左列：数
  const p2 = box(L, rows[0], W, H, '第二部分　数', '有理数、实数、数轴');
  const p3 = box(L, rows[1], W, H, '第三部分　式', '整式、分式、二次根式');
  const p4 = box(L, rows[2], W, H, '第四部分　方程与不等式', '等量关系、不等关系');
  const p7 = box(L, rows[3], W, H, '第七部分　函数', '变化中的对应');
  const p10 = box(L, rows[4], W, H, '第十部分　统计与概率', '用数描述数据和可能性', { color: C.soft });

  // 右列：形
  const p5 = box(R, rows[0], W, H, '第五部分　图形与推理', '定义、性质、判定');
  const p6 = box(R, rows[1], W, H, '第六部分　坐标与图形的变化', '坐标、平移、对称、旋转', { size: 13 });
  const p8 = box(R, rows[2], W, H, '第八部分　相似与锐角三角函数', '从全等到比', { size: 13 });
  const p9 = box(R, rows[3], W, H, '第九部分　圆', '对称、位置关系、计算');

  // 第十一部分：数形合一
  const p11 = box(L, 466, R + W - L, 54, '第十一部分　数形结合', '一体两面：以形助数、以数解形、动点与函数、通用的思想方法',
    { color: C.emph, fill: C.emphFill, w: 2 });

  // 第一部分通向两列
  arrow([[p2.cx, p1.b], [p2.cx, 80]], { color: C.blue, dash: '4 3' });
  arrow([[p5.cx, p1.b], [p5.cx, 80]], { color: C.blue, dash: '4 3' });

  // 两列各自的主线
  for (const [a, b] of [[p2, p3], [p3, p4], [p4, p7], [p5, p6], [p6, p8], [p8, p9]]) arrow([[a.cx, a.b], [b.cx, b.y]], { color: C.ink });

  // 数和形之间的桥：数轴 → 坐标系 → 函数图象
  arrow([[p2.r, p2.cy], [p6.x, p6.cy - 8]], { color: C.emph, dash: '5 3' });
  arrow([[p6.x, p6.cy + 8], [p7.r, p7.cy - 8]], { color: C.emph, dash: '5 3' });

  // 数的应用：统计与概率
  arrow([[p2.x, p2.cy], [14, p2.cy], [14, p10.cy], [p10.x, p10.cy]], { dash: '4 3' });

  // 两条主线汇合到第十一部分
  arrow([[p7.r, p7.cy + 8], [270, p7.cy + 8], [270, p11.y]], { color: C.emph });
  arrow([[p9.cx, p9.b], [p9.cx, p11.y]], { color: C.emph });

  files['intro-map.svg'] = svg(540, 536, out.join('\n'));
}

export default files;
