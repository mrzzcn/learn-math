# 初中数学的自然原理

从本义出发，把代数和几何连成一个整体。面向中学生。内容以 Markdown 编写，编译成 GitBook 风格的静态网站和 A4 纵向 PDF，网站发布在 Cloudflare，PDF 附在 GitHub Release 上。

书名、副标题、面向对象等配置集中在 `site.config.mjs`，改这一个文件即可，其他地方都从这里读取。

## 目录结构

| 路径 | 内容 |
| --- | --- |
| `site.config.mjs` | 书名、副标题、面向对象、Release 附件名、样张范围、依据行前缀 |
| `content/` | 网站内容，每页一个 Markdown 文件 |
| `content/SUMMARY.md` | 侧栏目录和页面顺序 |
| `content/images/` | 插图 |
| `content/download.md` | PDF 下载页，只在网页上出现 |
| `tools/build.mjs` | 网站构建脚本 |
| `tools/pdf.mjs`、`tools/fonts.mjs` | PDF 生成脚本、PDF 字体下载 |
| `tools/site/` | 网页样式、脚本和图标 |
| `tools/zh_typeset.py` | 中文排版检查 |
| `dist/`、`output/` | 网站和 PDF 的构建产物，不提交 |

## 配置

| 字段 | 用途 |
| --- | --- |
| `title` | 网页标题、PDF 封面、PDF 文件名 `output/<title>.pdf`、Release 标题 |
| `subtitle` | PDF 封面副标题 |
| `audience` | PDF 封面、网页 meta description、PDF 文档属性 |
| `slug` | Release 附件名 `<slug>-guide-<标签>.pdf` |
| `sample` | `pnpm pdf:sample` 默认只排的路径前缀 |
| `citePrefixes` | 以这些词开头的段落在 PDF 里排成灰色小字（依据、出处等） |

## 本地使用

```bash
pnpm install
```

```bash
pnpm build
```

`pnpm build` 先生成 PDF，再构建网站，并把 PDF 放进网站的下载页。只改了网页样式、想快点看效果时，用 `pnpm build:site` 只构建网站。

```bash
python3 -m http.server 8788 --directory dist
```

然后打开 http://localhost:8788 预览。

其他命令：

- `pnpm pdf`：生成 A4 纵向 PDF，输出到 `output/<title>.pdf`。
- `pnpm pdf:sample`：只生成 `site.config.mjs` 里 `sample` 指定的几节，用来快速看版式。也可以用 `node tools/pdf.mjs --only <路径前缀>` 生成任意几节。
- `pnpm merge`：按目录顺序把全部页面合并成一个 `guide.md`。
- `python3 tools/zh_typeset.py content/**/*.md`：检查中文排版，加 `--write` 直接修改。

## 写内容

- 新增页面：在 `content/` 下建 Markdown 文件，以一个 `#` 标题开头，再把它加进 `SUMMARY.md`。
- 分组：`SUMMARY.md` 里用 `## 第一部分：标题` 开一个分组，支持“第一部分”到“第十部分”。每个部分在 PDF 里从新的一页开始。
- 图片放在 `content/images/`，页面里用相对路径引用，比如 `../images/example.svg`。
- 交叉引用写成“见第一部分‘某个标题’”（用中文引号“”）或“第一部分：某个标题”，构建时会自动变成链接。没解析到的引用会在构建输出的 warnings 里列出。
- 加粗照常写 `**…**`。构建时，句子中间的加粗自动显示为珊瑚色；整段加粗、以冒号结尾的标签、自成一句的主题句、表头行和表格第一列里的加粗保持黑色（第一列只有开头的关键词不上色）。规则在 `tools/build.mjs` 的 `markInlineEmphasis`。
- 外链显示为蓝色，在新窗口打开。
- 中文排版：中英文之间加空格，使用全角标点。Markdown 表格用紧凑写法（`| --- |`），不补空格对齐。

## PDF

- **生成方式：** `tools/pdf.mjs` 用 pdfmake 生成 PDF。它和网站共用 `tools/build.mjs` 的交叉引用和句中加粗上色规则，所以两边的强调色、链接一致。
- **版式：** 页边距左 18 mm（留装订余量）、上 15 mm、右 12 mm、下 12 mm。封面、带页码的目录；每个部分从新的一页开始；页眉左边是部分名、右边是本节标题；页脚是页码。
  - 表格跨页时重复表头，一行不会拆到两页。
  - 标题下方空间不够时，标题会连同后面的内容一起移到下一页。
- **交叉引用：** 变成 PDF 内部链接，后面加“（第 N 页）”。
- **字体：** Noto Sans SC（思源黑体，SIL OFL 开源授权）的 Regular 和 Bold 静态 TTF。首次运行时，`tools/fonts.mjs` 通过 jsDelivr 下载到 `tools/fonts/`，约 20 MB，不提交到仓库。
- **网页下载页：** `content/download.md` 是网站最后一页“PDF 下载”，只在网页上出现，不排进 PDF。构建时，PDF 复制到 `dist/downloads/guide.pdf`，页面里的页数、大小、日期自动填好。
- **两遍排版：** 为了让页眉和交叉引用的页码准确，脚本先排一遍拿到各节标题的页码，再正式输出。如果第二遍页码有变化，会打印警告。

## 发布到 Cloudflare

项目以 Cloudflare Workers 静态资源的方式部署，配置在 `wrangler.jsonc`：上传 `dist/`，找不到的页面返回 `404.html`。

**方式一：连接 Git 仓库（推荐）。** 在 Cloudflare 控制台依次进入 Workers & Pages → Create，导入 GitHub 仓库，并填写：

| 设置 | 值 |
| --- | --- |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` |

Cloudflare 按 `.node-version` 和 `package.json` 的 `packageManager` 选择 Node 和 pnpm 版本。构建时会先生成 PDF，第一次构建要多花一点时间下载字体。之后每次推送到 `main` 都会自动构建和发布。

仓库里必须有 `wrangler.jsonc`。没有它，wrangler 会尝试把自己装成项目依赖，而 pnpm 11 默认拦截 esbuild、workerd 的安装脚本，部署就会失败（`ERR_PNPM_IGNORED_BUILDS`）。

**方式二：本地直接上传。**

```bash
pnpm build
```

```bash
pnpm dlx wrangler deploy
```

第一次运行时会要求登录 Cloudflare 账号。

## 发布 PDF 到 GitHub Release

推送版本标签后，GitHub Actions（`.github/workflows/release.yml`）会生成 PDF，建一个 Release，并把 PDF 作为附件上传。Release 标题取 `site.config.mjs` 的 `title`，附件名为 `<slug>-guide-<标签>.pdf`（附件名用英文，GitHub 会替换掉附件名里的中文）。

```bash
git tag v1.0.0
```

```bash
git push origin v1.0.0
```

给已有标签补传 PDF：在仓库的 Actions 页面选择“Release PDF”，点 Run workflow，填入标签名。

## 网站功能

- 左侧目录按部分分组，可以折叠；中间是正文；右侧是本页小标题导航。
- 每页底部有上一页和下一页。
- 全文搜索在浏览器本地完成，按 `/` 聚焦搜索框。
- 在手机上，目录收进左上角的菜单。
- 只提供浅色主题。
