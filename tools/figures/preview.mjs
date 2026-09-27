// 预览 SVG 在 PDF 里的样子（PDF 不播放动画，只显示初始状态）。
// 用法：node tools/figures/preview.mjs 输出.pdf 图1.svg 图2.svg …
// 每张图排一页，下面写文件名。再用 pdftoppm -r 80 -png 输出.pdf 前缀 转成 PNG 查看。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pdfmake from 'pdfmake';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [out, ...files] = process.argv.slice(2);
if (!out || !files.length) { console.error('用法：node tools/figures/preview.mjs 输出.pdf 图.svg …'); process.exit(1); }

pdfmake.setFonts({ F: { normal: path.join(ROOT, 'tools/fonts/NotoSansSC-Regular.ttf'), bold: path.join(ROOT, 'tools/fonts/NotoSansSC-Bold.ttf'), italics: path.join(ROOT, 'tools/fonts/STIXTwoText_400Regular_Italic.ttf'), bolditalics: path.join(ROOT, 'tools/fonts/STIXTwoText_700Bold_Italic.ttf') } });
pdfmake.setUrlAccessPolicy(() => false);
pdfmake.setLocalAccessPolicy(() => true);
const CONTENT_W = 595.28 - 15 * 2.835 - 9 * 2.835;
const content = files.flatMap((file, i) => {
  const svg = fs.readFileSync(file, 'utf8');
  const natural = +(svg.match(/viewBox="[\d.\s-]+ ([\d.]+) ([\d.]+)"/)?.[1] || 180);
  // 和 tools/pdf.mjs 的规则一致
  const width = natural > 300 ? Math.min(CONTENT_W, natural * 0.75) : 36 * 2.835;
  return [{ svg, width, font: 'F' }, { text: path.basename(file), fontSize: 9, margin: [0, 4, 0, 0], pageBreak: i < files.length - 1 ? 'after' : undefined }];
});
await pdfmake.createPdf({ pageSize: 'A4', pageMargins: [15 * 2.835, 10 * 2.835, 9 * 2.835, 10 * 2.835], defaultStyle: { font: 'F' }, content }).write(out);
console.log(`preview: ${files.length} 张图 → ${out}`);
