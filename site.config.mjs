// 站点配置：书名等信息集中放在这里，构建脚本、PDF 脚本和 GitHub Actions 都从这里读取。
export default {
  title: '（书名占位）',            // 网页标题、PDF 封面和文件名（output/<title>.pdf）、Release 标题
  subtitle: '（副标题占位）',        // PDF 封面
  audience: '（面向对象占位）',      // PDF 封面、网页 meta description、PDF info.subject
  slug: 'learn-math',               // Release 附件名 learn-math-guide-<标签>.pdf
  sample: '1-part',                 // pnpm pdf:sample 默认只排的路径前缀
  citePrefixes: ['依据', '出处'],    // 以这些词开头的段落在 PDF 里排成灰色小字
};
