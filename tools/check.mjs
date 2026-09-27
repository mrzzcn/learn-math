// 检查页面，不生成网站（可以和别的检查同时运行）。
// 用法：node tools/check.mjs content/7-function/quadratic-function.md …（不给文件就检查全部页面）
// 检查：公式能否被 MathJax 解析；有没有没生效的加粗（渲染后还留着 **）；图片是否存在；
//       交叉引用能否解析；中文排版（调用 tools/zh_typeset.py，只统计不修改）。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, CONTENT, readSummary, loadPages, makeXrefProbe, makeRenderer } from './build.mjs';

const args = process.argv.slice(2).map(a => path.relative(CONTENT, path.resolve(a)));
const pages = loadPages(readSummary());
const byFile = Object.fromEntries(pages.map(p => [p.file, p]));
const targets = args.length ? args : pages.map(p => p.file);
const problems = [];

for (const file of targets) {
  const page = byFile[file];
  if (!page) { problems.push(`${file}: 不在 SUMMARY.md 里`); continue; }
  const src = page.src;
  if (!/^# /.test(src)) problems.push(`${file}: 第一行不是 # 标题`);
  // 公式
  let fence = false;
  src.split('\n').forEach((line, n) => {
    if (line.startsWith('```')) fence = !fence;
    if (fence) return;
    if (/^#{1,6}\s.*\$/.test(line)) problems.push(`${file}:${n + 1}: 标题里不要写公式`);
    if (/^!\[[^\]]*\$/.test(line)) problems.push(`${file}:${n + 1}: 图片说明里不要写公式`);
  });
  const md = makeRenderer(page, byFile);
  let html = '';
  try {
    html = md.render(src);
  } catch (e) {
    problems.push(`${file}: ${e.message}`);
    continue;
  }
  // 没生效的加粗、落单的 $
  const text = html.replace(/<(span|div) class="math[^"]*"[\s\S]*?<\/svg><\/\1>/g, '').replace(/<[^>]+>/g, '');
  text.split('\n').forEach(l => {
    if (l.includes('**')) problems.push(`${file}: 加粗没生效：${l.trim().slice(0, 50)}`);
    if (/(?<!\\)\$/.test(l)) problems.push(`${file}: 公式没解析（多余或不配对的 $）：${l.trim().slice(0, 50)}`);
  });
  // 图片
  for (const m of src.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const img = path.resolve(CONTENT, path.dirname(file), m[1]);
    if (!fs.existsSync(img)) problems.push(`${file}: 缺图片 ${m[1]}`);
  }
}

// 交叉引用
for (const w of makeXrefProbe(pages)) if (targets.some(t => w.startsWith(t + ':'))) problems.push(w);

// 中文排版
const files = targets.map(t => path.join(CONTENT, t));
const typeset = execFileSync('python3', [path.join(ROOT, 'tools/zh_typeset.py'), ...files], { encoding: 'utf8' });
const changed = +(typeset.match(/修改的行数：\s*(\d+)/)?.[1] || 0);
if (changed) problems.push(`中文排版：${changed} 行不合规范，运行 python3 tools/zh_typeset.py --write <文件> 修正后再检查\n${typeset}`);

if (problems.length) {
  console.log(`check: ${problems.length} 个问题`);
  for (const p of problems) console.log('  ' + p);
  process.exit(1);
}
console.log(`check: ${targets.length} 页，没有问题`);
