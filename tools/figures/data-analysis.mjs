// 第十部分“数据的分析”的图。
import { C, f, svg, text, line, dot, poly, polyline } from './lib.mjs';

const files = {};

// 数轴：从 a 到 b，每隔 step 一个刻度；X(v) 把数换成像素
function numberLine(X, y, a, b, step, o = {}) {
  const out = [line(X(a) - 10, y, X(b) + 12, y, { color: C.axis, w: 1.5 })];
  out.push(`<polygon points="${f(X(b) + 20)},${f(y)} ${f(X(b) + 12)},${f(y - 4)} ${f(X(b) + 12)},${f(y + 4)}" fill="${C.axis}" stroke="none"/>`);
  for (let v = a; v <= b + 1e-9; v += step) {
    out.push(line(X(v), y - 4, X(v), y + 4, { color: C.axis, w: 1.2 }));
    if (!o.noLabels) out.push(text(X(v), y + 18, +v.toFixed(2), { anchor: 'middle', color: C.soft, size: 11 }));
  }
  return out.join('');
}

// ---------- 平均数：移多补少 ----------
{
  const vals = [3, 6, 5, 2], names = ['甲', '乙', '丙', '丁'], mean = 4;
  const u = 28, oy = 215, bw = 44, step = 80, ox = 50;
  const Y = v => oy - u * v, BX = i => ox + 20 + i * step;
  const rect = (x, y0, y1, o) => poly([[x, Y(y0)], [x + bw, Y(y0)], [x + bw, Y(y1)], [x, Y(y1)]], o);
  const out = [];
  out.push(line(ox, oy, ox + step * 4 + 10, oy, { color: C.axis, w: 1.5 }));
  vals.forEach((v, i) => {
    const x = BX(i);
    out.push(rect(x, 0, Math.min(v, mean), { fill: C.blueFill, color: C.blue, w: 1.5 }));
    if (v < mean) out.push(rect(x, v, mean, { color: C.blue, w: 1.2, dash: '4 3' }));
    out.push(text(x + bw / 2, oy + 18, names[i], { anchor: 'middle', size: 13 }));
    out.push(text(x + bw / 2, oy - 8, v, { anchor: 'middle', size: 13, color: C.blue }));
  });
  out.push(line(ox, Y(mean), ox + step * 4 + 10, Y(mean), { color: C.ink, w: 1.2, dash: '6 4' }));
  out.push(text(ox + step * 4 + 14, Y(mean) + 4, '平均数 4', { size: 12 }));
  // 多出来的部分：乙的 2 格移给丁，丙的 1 格移给甲
  const moves = [[1, 3], [2, 0]];
  moves.forEach(([from, to]) => {
    const v = vals[from], x = BX(from), dx = BX(to) - x, dy = u * (v - mean);
    // 移动路线
    const s = [x + bw / 2, Y(v) - 6], e = [BX(to) + bw / 2, Y(mean) - 6];
    const mx = (s[0] + e[0]) / 2, my = Math.min(s[1], e[1]) - (from === 1 ? 50 : 30);
    out.push(`<path d="M ${f(s[0])} ${f(s[1])} Q ${f(mx)} ${f(my)} ${f(e[0])} ${f(e[1])}" stroke="${C.emph}" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/>`);
    out.push(`<polygon points="${f(e[0])},${f(e[1] + 2)} ${f(e[0] - 5)},${f(e[1] - 7)} ${f(e[0] + 5)},${f(e[1] - 7)}" fill="${C.emph}" stroke="none"/>`);
    const piece = rect(x, mean, v, { fill: C.emphFill, color: C.emph, w: 1.5 });
    out.push(`<g>${piece}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${f(dx)} ${f(dy)};${f(dx)} ${f(dy)};0 0" keyTimes="0;0.2;0.5;0.85;1" dur="7s" repeatCount="indefinite"/></g>`);
  });
  files['data-analysis-mean.svg'] = svg(440, 240, out.join('\n'));
}

// ---------- 平均数是平衡点：偏差之和为 0 ----------
{
  const vals = [2, 3, 5, 6], mean = 4, u = 40, ox = 30;
  const X = v => ox + u * v, oy = 150;
  const out = [numberLine(X, oy, 0, 8, 1)];
  // 偏差箭头，按长度分层画，避免重叠
  const arrow = (v, y) => {
    const col = v < mean ? C.blue : C.emph, dxs = v < mean ? 1 : -1;
    const d = v - mean;
    return [
      line(X(mean), y, X(v), y, { color: col, w: 2 }),
      `<polygon points="${f(X(v))},${f(y)} ${f(X(v) + dxs * 8)},${f(y - 4)} ${f(X(v) + dxs * 8)},${f(y + 4)}" fill="${col}" stroke="none"/>`,
      text((X(mean) + X(v)) / 2, y - 6, d > 0 ? `+${d}` : `−${-d}`, { anchor: 'middle', color: col, size: 12 }),
      line(X(v), y, X(v), oy, { color: C.soft, w: 1, dash: '3 3' }),
    ].join('');
  };
  out.push(arrow(3, 100), arrow(5, 100), arrow(2, 60), arrow(6, 60));
  vals.forEach(v => out.push(dot(X(v), oy, C.ink, 5)));
  // 支点
  out.push(`<polygon points="${f(X(mean))},${oy + 6} ${f(X(mean) - 10)},${oy + 26} ${f(X(mean) + 10)},${oy + 26}" fill="${C.emph}" stroke="none"/>`);
  out.push(line(X(mean), 40, X(mean), oy, { color: C.ink, w: 1.2, dash: '6 4' }));
  out.push(text(X(mean), 32, '平均数 4', { anchor: 'middle', size: 12 }));
  out.push(text(X(8) + 24, oy + 42, '左边偏差之和 −3，右边偏差之和 +3', { anchor: 'end', color: C.soft, size: 12 }));
  files['data-analysis-balance.svg'] = svg(400, 205, out.join('\n'));
}

// ---------- 中位数不受极端值影响 ----------
{
  const vals = [3, 3.2, 3.5, 3.5, 3.8, 4, 21], u = 16, ox = 30, oy = 140;
  const X = v => ox + u * v;
  const out = [numberLine(X, oy, 0, 22, 2)];
  // 3～4 千元的 6 个点挨得太近，摞成一列画在这一段的正中，下面用括号标出这一段
  vals.filter(v => v <= 4).forEach((v, i) => out.push(dot(X(3.5), oy - 12 - 10 * i, C.ink, 4.5)));
  out.push(polyline([[X(3), oy - 3], [X(3), oy - 6], [X(4), oy - 6], [X(4), oy - 3]], { color: C.ink, w: 1.2 }));
  out.push(dot(X(21), oy - 10, C.emph, 4.5));
  const mark = (v, y, s, col, anchor) => [
    line(X(v), oy + 24, X(v), y - 12, { color: col, w: 1.5 }),
    `<polygon points="${f(X(v))},${oy + 24} ${f(X(v) - 4)},${oy + 32} ${f(X(v) + 4)},${oy + 32}" fill="${col}" stroke="none" transform="rotate(180 ${f(X(v))} ${oy + 28})"/>`,
    text(X(v) + (anchor === 'end' ? 6 : -6), y, s, { anchor, color: col, size: 12 }),
  ].join('');
  out.push(mark(3.5, 205, '中位数 3.5', C.blue, 'end'));
  out.push(mark(6, 205, '平均数 6', C.emph, 'start'));
  out.push(text(X(3.5), 70, '6 人在 3～4 千元', { anchor: 'middle', size: 12 }));
  out.push(text(X(21), 115, '21', { anchor: 'middle', color: C.emph, size: 12 }));
  out.push(text(X(22) + 20, oy + 38, '月工资（千元）', { anchor: 'end', color: C.soft, size: 12 }));
  files['data-analysis-median.svg'] = svg(420, 220, out.join('\n'));
}

// ---------- 方差：偏差平方是正方形的面积 ----------
{
  const u = 40, ox = -140;
  const X = v => ox + u * v;
  const out = [];
  const row = (vals, oy, name, s2) => {
    out.push(numberLine(X, oy, 5, 11, 1));
    // 正方形：一边是点到平均数的线段，画在数轴上方；长的在下层
    const sq = [...vals].filter(v => v !== 8).sort((a, b) => Math.abs(b - 8) - Math.abs(a - 8));
    sq.forEach(v => {
      const d = Math.abs(v - 8), x0 = Math.min(X(v), X(8));
      const col = v < 8 ? C.blue : C.emph, fill = v < 8 ? C.blueFill : C.emphFill;
      out.push(poly([[x0, oy], [x0 + u * d, oy], [x0 + u * d, oy - u * d], [x0, oy - u * d]], { fill, color: col, w: 1.5 }));
    });
    out.push(line(X(8), oy - 95, X(8), oy, { color: C.ink, w: 1.2, dash: '6 4' }));
    let seen = {};
    vals.forEach(v => { seen[v] = (seen[v] || 0) + 1; out.push(dot(X(v), oy + 0 - (seen[v] - 1) * 0, C.ink, 4.5)); });
    const cnt = vals.filter(v => v === 8).length;
    if (cnt > 1) out.push(text(X(8) + 8, oy - 8, `×${cnt}`, { size: 11, color: C.soft }));
    out.push(text(X(4.2), oy + 5, name, { anchor: 'end', size: 14 }));
    out.push(text(X(11) + 24, oy - 50, `方差 ${s2}`, { anchor: 'end', size: 13, color: C.emph }));
  };
  row([7, 8, 8, 8, 9], 120, '甲', '0.4');
  row([6, 7, 8, 9, 10], 255, '乙', '2');
  out.push(text(X(8), 18, '平均数 8', { anchor: 'middle', size: 12 }));
  files['data-analysis-variance.svg'] = svg(350, 285, out.join('\n'));
}

// ---------- 每个数都加 3：平均数加 3，方差不变 ----------
{
  const vals = [2, 3, 5, 6], u = 30, ox = 30, oy = 110, a = 3;
  const X = v => ox + u * v;
  const out = [numberLine(X, oy, 0, 10, 1)];
  // 原数据用实线留在原处作参照；加 3 后的数据是移动的副本，用虚线空心圆，和原来的点重合时也能看到下面的点
  vals.forEach(v => out.push(dot(X(v), oy, C.ink, 4.5)));
  out.push(line(X(2), oy - 38, X(6), oy - 38, { color: C.soft, w: 1.2 }), line(X(2), oy - 43, X(2), oy - 33, { color: C.soft, w: 1.2 }), line(X(6), oy - 43, X(6), oy - 33, { color: C.soft, w: 1.2 }));
  out.push(line(X(4), oy - 58, X(4), oy, { color: C.soft, w: 1.2 }), text(X(4), oy - 64, '4', { anchor: 'middle', color: C.soft, size: 12 }));
  const g = [];
  vals.forEach(v => g.push(`<circle cx="${f(X(v))}" cy="${oy}" r="7" fill="none" stroke="${C.emph}" stroke-width="1.8" stroke-dasharray="3 2"/>`));
  g.push(line(X(4), oy - 58, X(4), oy, { color: C.emph, w: 1.2, dash: '6 4' }), text(X(4), oy - 64, '7', { anchor: 'middle', color: C.emph, size: 12 }));
  // 数据的“宽度”：最小到最大
  g.push(line(X(2), oy - 24, X(6), oy - 24, { color: C.emph, w: 1.2, dash: '4 3' }), line(X(2), oy - 29, X(2), oy - 19, { color: C.emph, w: 1.2 }), line(X(6), oy - 29, X(6), oy - 19, { color: C.emph, w: 1.2 }));
  out.push(`<g transform="translate(${u * a} 0)">${g.join('')}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${u * a} 0;${u * a} 0" keyTimes="0;0.2;0.6;1" dur="6s" repeatCount="indefinite"/></g>`);
  out.push(text(X(0), 30, '原数据 2, 3, 5, 6', { size: 12 }));
  out.push(text(X(10) + 20, 30, '每个数加 3 后：5, 6, 8, 9', { anchor: 'end', color: C.emph, size: 12 }));
  files['data-analysis-shift.svg'] = svg(360, 140, out.join('\n'));
}

// 箱线图：五个数 [min, q1, med, q3, max]，中心高度 y，箱高 h
function boxPlot(X, y, five, col, fill, h = 30) {
  const [mn, q1, md, q3, mx] = five;
  return [
    line(X(mn), y, X(q1), y, { color: col, w: 1.5 }),
    line(X(q3), y, X(mx), y, { color: col, w: 1.5 }),
    line(X(mn), y - h / 3, X(mn), y + h / 3, { color: col, w: 1.5 }),
    line(X(mx), y - h / 3, X(mx), y + h / 3, { color: col, w: 1.5 }),
    poly([[X(q1), y - h / 2], [X(q3), y - h / 2], [X(q3), y + h / 2], [X(q1), y + h / 2]], { fill, color: col, w: 1.5 }),
    line(X(md), y - h / 2, X(md), y + h / 2, { color: col, w: 2.5 }),
  ].join('');
}

// ---------- 箱线图：一组数据的五个数 ----------
{
  const data = [52, 60, 65, 68, 70, 72, 75, 78, 80, 85, 88, 96];
  const five = [52, 66.5, 73.5, 82.5, 96];
  const X = v => 40 + (v - 45) * 6.4, axisY = 250;
  const out = [numberLine(X, axisY, 50, 100, 10)];
  data.forEach(v => out.push(dot(X(v), 30, C.ink, 4)));
  out.push(text(X(45) - 4, 34, '成绩', { anchor: 'end', color: C.soft, size: 12 }));
  const by = 150;
  out.push(boxPlot(X, by, five, C.blue, C.blueFill, 36));
  // 五个数的标注：最小值、中位数、最大值在上方，两个四分位数在下方
  const up = [[0, '最小值'], [2, '中位数'], [4, '最大值']], down = [[1, '第一四分位数'], [3, '第三四分位数']];
  up.forEach(([i, s]) => {
    out.push(text(X(five[i]), 78, s, { anchor: 'middle', size: 12 }), text(X(five[i]), 94, five[i], { anchor: 'middle', size: 12, color: C.emph }));
    out.push(line(X(five[i]), 100, X(five[i]), by - 20, { color: C.soft, w: 1, dash: '3 3' }));
  });
  down.forEach(([i, s]) => {
    out.push(line(X(five[i]), by + 20, X(five[i]), 190, { color: C.soft, w: 1, dash: '3 3' }));
    out.push(text(X(five[i]), 206, s, { anchor: 'middle', size: 12 }), text(X(five[i]), 222, five[i], { anchor: 'middle', size: 12, color: C.emph }));
  });
  files['data-analysis-boxplot.svg'] = svg(400, 275, out.join('\n'));
}

// ---------- 箱线图：两个班比较 ----------
{
  const X = v => 60 + (v - 40) * 5.2, axisY = 160;
  const out = [numberLine(X, axisY, 40, 100, 10)];
  out.push(boxPlot(X, 50, [52, 66.5, 73.5, 82.5, 96], C.blue, C.blueFill));
  out.push(boxPlot(X, 115, [48, 72, 78, 84, 92], C.emph, C.emphFill));
  out.push(text(X(40) - 12, 55, '甲班', { anchor: 'end', size: 13 }), text(X(40) - 12, 120, '乙班', { anchor: 'end', size: 13 }));
  files['data-analysis-boxplot-compare.svg'] = svg(420, 185, out.join('\n'));
}

export default files;
