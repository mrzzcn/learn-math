// 生成全部 SVG 图到 content/images/。
// 用法：
//   node tools/figures/index.mjs                 生成全部
//   node tools/figures/index.mjs 模块名 …         只生成这几个模块的图，如 linear-function
// 每个模块（tools/figures/<名字>.mjs，lib、index、preview 除外）默认导出 { '文件名.svg': svg 字符串 }。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(DIR, '../../content/images');
const SKIP = new Set(['lib.mjs', 'index.mjs', 'preview.mjs']);

const only = process.argv.slice(2).map(s => s.replace(/\.mjs$/, ''));
const mods = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !SKIP.has(f))
  .filter(f => !only.length || only.includes(f.replace(/\.mjs$/, '')));
if (only.length && mods.length !== only.length) throw new Error(`没有找到模块：${only.join('、')}`);

fs.mkdirSync(OUT, { recursive: true });
const owner = {};
let count = 0;
for (const m of mods) {
  const files = (await import(pathToFileURL(path.join(DIR, m)))).default;
  for (const [name, svg] of Object.entries(files)) {
    if (owner[name]) throw new Error(`${name} 同时由 ${owner[name]} 和 ${m} 生成`);
    owner[name] = m;
    if (!svg.startsWith('<svg')) throw new Error(`${m} 的 ${name} 不是 SVG`);
    fs.writeFileSync(path.join(OUT, name), svg);
    count++;
  }
}
console.log(`figures: ${mods.length} 个模块，${count} 张图 → content/images/`);
