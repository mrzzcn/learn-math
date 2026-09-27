// 站点配置：书名等信息集中放在这里，构建脚本、PDF 脚本和 GitHub Actions 都从这里读取。
export default {
  title: '初中数学的自然原理',                   // 网页标题、PDF 封面和文件名（output/<title>.pdf）、Release 标题
  subtitle: '从本义出发，把代数和几何连成一个整体', // PDF 封面
  audience: '中学生',                           // PDF 封面、网页 meta description、PDF info.subject
  slug: 'learn-math',                           // Release 附件名 learn-math-guide-<标签>.pdf
  sample: '7-function',                         // pnpm pdf:sample 默认只排的路径前缀
  citePrefixes: ['依据', '出处'],  // 以这些词开头的段落在 PDF 里排成灰色小字（左对齐）
  cover: 'content/images/cover.jpg',            // PDF 封面图，A4 比例，已含书名等文字（原图 cover.png）；删掉这一行就用文字封面
};
