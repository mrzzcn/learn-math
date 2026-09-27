// 准备 PDF 用的字体：Noto Sans SC（思源黑体）Regular 和 Bold 静态 TTF，以及公式用的 STIX Two Text，开源授权（SIL OFL 1.1）。
// 首次运行时下载到 tools/fonts/（不提交），之后直接使用。
// 用静态 TTF 是因为 pdfkit 用的 fontkit 解析不了 Noto CJK 的 OTF，也不支持可变字体的字重。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fonts');
const BASE = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/noto-sans-sc@0.4.3';
const STIX = 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/stix-two-text@0.4.2';
const FONTS = {
  'NotoSansSC-Regular.ttf': `${BASE}/400Regular/NotoSansSC_400Regular.ttf`,
  'NotoSansSC-Bold.ttf': `${BASE}/700Bold/NotoSansSC_700Bold.ttf`,
  // 行内公式的字母和数字用 STIX Two Text（SIL OFL 1.1），和 MathJax 的 TeX 字形接近
  ...Object.fromEntries(['400Regular', '400Regular_Italic', '700Bold', '700Bold_Italic'].map(v =>
    [`STIXTwoText_${v}.ttf`, `${STIX}/${v}/STIXTwoText_${v}.ttf`])),
};

export async function ensureFonts() {
  fs.mkdirSync(DIR, { recursive: true });
  for (const [name, url] of Object.entries(FONTS)) {
    const file = path.join(DIR, name);
    if (fs.existsSync(file) && fs.statSync(file).size > 100_000) continue;
    console.log(`下载字体 ${name} …`);
    // 用 curl 下载：会自动使用系统代理（HTTPS_PROXY）
    execFileSync('curl', ['-sSfL', '--retry', '3', '-o', file + '.part', url], { stdio: 'inherit' });
    fs.renameSync(file + '.part', file);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await ensureFonts();
  console.log('字体已就绪：', Object.keys(FONTS).join('、'));
}
