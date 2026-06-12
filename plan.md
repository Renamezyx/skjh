# 荒岛求生新手站 — 页面实现方案

> 纯 HTML + CSS + JS（Zepto）移动端落地页  
> 参考设计：失控进化 · 荒岛求生新手站

---

## 1. 页面定位

- **类型**：游戏新手引导 / 速查手册落地页
- **终端**：移动端优先（建议最大宽度 450px 居中）
- **风格**：暗色、粗粝、生存题材；主色为深棕黑 + 橙红强调色
- **技术栈**：纯静态，无框架；交互用 Zepto

---

## 2. 整体分区

页面为**纵向滚动**结构，自上而下分为 4 个主区域：

```
┌─────────────────────────┐
│  ① 顶栏 topbar           │  Logo + 返回官网 + 下载
├─────────────────────────┤
│  ② 首屏 hero             │  背景图 + 主标题 + 口号
├─────────────────────────┤
│  ③ 身份切换 role-switch  │  我是新手 / 我是老手 + 滚动提示
├─────────────────────────┤
│  ④ 速查手册 guide        │  标题区 + 手风琴 FAQ 列表
└─────────────────────────┘
```

| 区域 | 作用 | 定位方式 |
|------|------|----------|
| 顶栏 | 品牌 Logo、返回官网、下载入口 | 可 `position: fixed`，悬浮于内容之上 |
| Hero | 氛围主视觉、标题、角色插画 | 首屏，约 60–70vh |
| 身份切换 | 新手 / 老手分流入口 | 叠在 Hero 底部或紧贴下方 |
| 速查手册 | FAQ 攻略内容主体 | 页面可滚动区域 |

---

## 3. HTML 结构方案

### 3.1 页面骨架

```html
<body class="page">
  <header class="topbar">...</header>
  <main class="main">
    <section class="hero">...</section>
    <section class="role-switch">...</section>
    <section class="guide" id="guide">...</section>
  </main>
</body>
```

> 本页无传统 footer，`<footer>` 可省略或仅放版权信息。

### 3.2 顶栏 `topbar`

```html
<header class="topbar">
  <a class="topbar__logo" href="#">失控进化</a>
  <a class="topbar__back" href="#">返回官网 ></a>
  <button class="topbar__download" aria-label="下载">↓</button>
</header>
```

| 元素 | 说明 |
|------|------|
| `topbar__logo` | 居中或偏左，图片或文字 |
| `topbar__back` | 右上角红底白字按钮 |
| `topbar__download` | 圆形白底下载图标 |

### 3.3 首屏 `hero`

```html
<section class="hero">
  <div class="hero__bg"></div>
  <h1 class="hero__title">
    <span class="hero__title-main">荒岛求生</span>
    <span class="hero__title-sub accent">新手站</span>
  </h1>
  <p class="hero__slogan">从零到活下来，从活下来到越来越强</p>
</section>
```

| 元素 | 说明 |
|------|------|
| `hero__bg` | 角色背景图 + 暗色渐变遮罩 |
| `hero__title` | 艺术字标题（切图或自定义字体） |
| `hero__slogan` | 白色副标题，位于角色图下方 |

### 3.4 身份切换 `role-switch`

```html
<section class="role-switch">
  <button class="role-btn role-btn--newbie" data-role="newbie">
    < 我是新手
  </button>
  <button class="role-btn role-btn--veteran" data-role="veteran">
    我是老手 >
  </button>
  <button class="scroll-hint" id="scrollHint" aria-label="向下滚动">»</button>
</section>
```

| 按钮 | 样式 |
|------|------|
| 新手 | 红底白字，左箭头 |
| 老手 | 灰白底红字，右箭头 |

### 3.5 速查手册 `guide`

```html
<section class="guide" id="guide">
  <header class="guide__head">
    <span class="guide__icon">?</span>
    <h2 class="guide__title">速查手册</h2>
    <p class="guide__desc">点击查看速成攻略，直接找到你现在最需要的那个答案</p>
  </header>

  <div class="accordion" id="accordion">
    <!-- 由 JS 渲染或手写多条 -->
  </div>
</section>
```

### 3.6 手风琴单项 `accordion__item`（核心复用组件）

```html
<article class="accordion__item is-open">
  <button class="accordion__trigger" aria-expanded="true">
    <span class="accordion__title">如何快速回血？</span>
    <i class="accordion__arrow"></i>
  </button>
  <div class="accordion__panel">
    <p>正文段落，<em class="highlight">高亮关键词</em>用强调色。</p>
    <aside class="tip">
      <strong>关键优先级：</strong>食物 &gt; 绷带 &gt; 医疗针
    </aside>
  </div>
</article>
```

**组件层级：**

```
accordion__item
├── accordion__trigger    ← 点击区域（标题 + 箭头）
└── accordion__panel      ← 展开内容
    ├── 普通段落（含 .highlight 高亮词）
    └── .tip 关键优先级块（左侧橙色竖线）
```

---

## 4. 命名规范

采用 **BEM**：

- Block：`.hero`、`.accordion`
- Element：`.hero__title`、`.accordion__trigger`
- Modifier：`.role-btn--newbie`、`.accordion__item.is-open`

状态类用 `is-` 前缀：`is-open`、`is-active`。

---

## 5. CSS 组织

### 5.1 文件拆分（推荐）

```
css/
├── base.css          # reset、CSS 变量、字体
├── layout.css        # page 容器、最大宽度
├── topbar.css
├── hero.css
├── role-switch.css
├── guide.css
└── accordion.css
```

纯静态小项目也可合并为单个 `style.css`，用注释分区。

### 5.2 设计 Token

```css
:root {
  /* 背景 */
  --bg-page: #120a08;
  --bg-card: #1e1816;
  --bg-card-head: #3d140c;

  /* 强调色 */
  --accent: #e64a19;
  --accent-hover: #ff5722;

  /* 文字 */
  --text: #ffffff;
  --text-muted: #b0b0b0;

  /* 边框 */
  --border: rgba(230, 74, 25, 0.4);

  /* 布局 */
  --page-max-width: 450px;
}
```

### 5.3 布局要点

| 区域 | 关键样式 |
|------|----------|
| `body` / `.page` | `max-width: 450px; margin: 0 auto; background: var(--bg-page)` |
| `.topbar` | `position: fixed; top: 0; z-index: 100` |
| `.hero` | `min-height: 70vh; background-size: cover; position: relative` |
| `.hero__bg` | 背景图 + `linear-gradient` 暗色遮罩 |
| `.role-switch` | `display: flex; gap: 8px` 两按钮并排 |
| `.accordion__panel` | 默认 `max-height: 0; overflow: hidden`，`.is-open` 时展开 |
| `.accordion__arrow` | `.is-open` 时 `transform: rotate(180deg)` |
| `.tip` | `border-left: 4px solid var(--accent); padding-left: 12px` |
| `.highlight` | `color: var(--accent)` |

### 5.4 质感实现

- 按钮斑驳感：背景纹理图或 `linear-gradient` 叠加
- 卡片头部：斜线纹理（`repeating-linear-gradient`）或背景图
- 页面背景：可选噪点纹理 `bg-noise.png` 低透明度叠加

---

## 6. JS 交互（Zepto）

### 6.1 功能清单

| 功能 | 触发 | 实现 |
|------|------|------|
| 手风琴展开/收起 | 点击 `.accordion__trigger` | 切换父级 `.accordion__item` 的 `is-open` |
| 互斥展开（可选） | 展开一项时 | 关闭其他 `.is-open` 项 |
| 新手/老手切换 | 点击 `.role-btn` | 切换 `body[data-role]`，过滤 FAQ 或跳转 |
| 滚动到手册 | 点击 `.scroll-hint` | `animate({ scrollTop: $('#guide').offset().top })` |
| 返回官网 | 点击 `.topbar__back` | `<a href="...">` 跳转 |
| 下载 | 点击 `.topbar__download` | 跳转下载链接或触发下载 |

### 6.2 FAQ 数据驱动

将攻略内容抽成 JS 数组，避免手写大量重复 HTML：

```js
const faqList = [
  {
    id: 'heal',
    title: '如何快速回血？',
    role: 'newbie',       // 可选：newbie | veteran | all
    content: '通过<em class="highlight">进食</em>恢复生命值...',
    tip: '关键优先级：食物 > 绷带 > 医疗针'
  },
  {
    id: 'base',
    title: '如何快速建造基地？',
    role: 'newbie',
    content: '先建<em class="highlight">1x2小房子</em>...',
    tip: '关键优先级：工具柜 > 领地柜 > 睡袋'
  },
  {
    id: 'weapon',
    title: '如何快速获得武器？',
    role: 'all',
    content: '采集木头石头，制作<em class="highlight">石斧</em>、<em class="highlight">长矛</em>...',
    tip: ''
  },
  {
    id: 'strong',
    title: '如何快速变强？',
    role: 'all',
    content: '优先解锁<em class="highlight">科技树</em>...',
    tip: ''
  }
];
```

渲染流程：

1. 根据 `body[data-role]` 过滤 `faqList`
2. 遍历生成 `.accordion__item` HTML
3. 插入 `#accordion`
4. 绑定手风琴点击事件（事件委托）

### 6.3 手风琴核心逻辑（伪代码）

```js
$('#accordion').on('click', '.accordion__trigger', function () {
  var $item = $(this).closest('.accordion__item');
  var isOpen = $item.hasClass('is-open');

  // 互斥模式
  $('.accordion__item').removeClass('is-open');
  $('.accordion__trigger').attr('aria-expanded', 'false');

  if (!isOpen) {
    $item.addClass('is-open');
    $(this).attr('aria-expanded', 'true');
  }
});
```

---

## 7. 资源清单

| 文件 | 用途 | 备注 |
|------|------|------|
| `images/hero-bg.jpg` | Hero 角色主视觉 | `background-size: cover` |
| `images/logo.png` | 顶栏 Logo | 透明 PNG |
| `images/title.png` | 「荒岛求生 新手站」艺术字 | 或用 webfont |
| `images/btn-texture.png` | 按钮斑驳质感 | 可用 CSS 渐变替代 |
| `images/icon-download.svg` | 下载图标 | SVG 优先 |
| `images/bg-noise.png` | 背景噪点纹理 | 可选 |

---

## 8. 目录结构（目标）

```
skjh/
├── index.html
├── plan.md                 # 本文档
├── css/
│   └── style.css           # 或按模块拆分
├── js/
│   ├── main.js             # 入口：事件绑定、初始化
│   └── data.js             # FAQ 数据（可选拆分）
├── images/
│   ├── hero-bg.jpg
│   ├── logo.png
│   └── ...
└── README.md
```

---

## 9. 与当前项目映射

当前 `index.html` 空壳：

| 现有标签 | 建议改造 |
|----------|----------|
| `<header class="header">` | 改为 `topbar` 顶栏 |
| `<main>` | 放入 `hero` + `role-switch` + `guide` |
| `<footer class="footer">` | 可删除或仅保留版权 |
| Zepto CDN | 保留，用于手风琴、滚动、身份切换 |
| `js/main.js` | 实现交互逻辑 |
| `css/style.css` | 按 Token 重写为暗色游戏风 |

---

## 10. 开发顺序

| 步骤 | 任务 | 产出 |
|------|------|------|
| 1 | 搭 HTML 骨架 + 占位色块 | 确认分区与滚动流程 |
| 2 | 定义 CSS Token + 顶栏样式 | 固定导航可用 |
| 3 | Hero 区域（背景、标题、口号） | 首屏氛围完成 |
| 4 | 身份切换按钮 | 两按钮并排 + 滚动提示 |
| 5 | 手风琴组件（先写 1 条静态） | 展开/收起动画 |
| 6 | FAQ 数据化 + JS 渲染 | 4 条攻略可维护 |
| 7 | 身份切换过滤逻辑 | 新手/老手看到不同内容 |
| 8 | 切图替换占位 + 字体微调 | 视觉对齐设计稿 |
| 9 | 链接配置（官网、下载） | 可上线状态 |

---

## 11. 内容参考（设计稿 FAQ）

### 如何快速回血？

- 通过**进食**恢复生命值，**绷带**和**医疗针**可快速回血
- **关键优先级**：食物 > 绷带 > 医疗针（前期优先保证食物储备）

### 如何快速建造基地？

- 先建 **1x2 小房子**，放置**工具柜**和**领地柜**
- 建造顺序：地基 → 墙体 → 门框 → 门 → 屋顶
- **关键优先级**：工具柜 > 领地柜 > 睡袋

### 如何快速获得武器？

- 采集木头、石头，制作**石斧**、**长矛**
- 后期解锁**枪械**和**弹药**

### 如何快速变强？

- 优先解锁**科技树**关键节点
- 提升装备等级，参与**副本**和**PVP**获取资源

---

## 12. 注意事项

- **无障碍**：手风琴按钮加 `aria-expanded`，图标按钮加 `aria-label`
- **性能**：背景图压缩，移动端宽度建议 ≤ 750px 的 2x 图
- **兼容**：`color-mix` 等新特性注意降级，或直接用固定色值
- **无 JS 降级**：手风琴可用 `<details>/<summary>` 作为备选方案
- **桌面预览**：`max-width: 450px` 居中，两侧留深色背景
