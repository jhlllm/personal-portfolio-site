import type { Profile } from '../types/Profile'
import type { Project } from '../types/Project'
import type { Skill } from '../types/Skill'
import type { Post } from '../types/Post'

/**
 * 预置模拟示例数据。首次访问时写入 localStorage，
 * 保证打开页面即可直接展示内容（不允许空白页面）。
 *
 * 注意：content 字段统一使用模板字符串，代码围栏内的反引号需转义为 \`。
 */

export const seedProfile: Profile = {
  id: 'profile_main',
  name: '姜一苒',
  title: '前端工程师 · UI 工程化方向',
  tagline: '用代码铸造工业级体验。专注高性能前端、设计系统与工具链。',
  bio: '我是一名深耕前端领域 6 年的工程师，擅长 React / TypeScript / Vite 技术栈。\n\n我热衷于把设计系统与工程化能力结合，打造具备“金属质感”的高性能界面：关注首屏性能、可访问性与长期可维护性。\n\n业余时间我维护多个开源组件库，并持续输出工程化实践文章。',
  avatar: '/avatar.png',
  email: 'ember.lin@example.com',
  location: '中国 · 大连',
  resumeUrl: '/resume.html',
  socials: [
    { id: 's1', label: 'GitHub', url: 'https://github.com/ember-lin', icon: 'github' },
    { id: 's2', label: '邮箱', url: 'mailto:ember.lin@example.com', icon: 'mail' },
    { id: 's3', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ember-lin', icon: 'linkedin' },
    { id: 's4', label: '掘金', url: 'https://juejin.cn/', icon: 'globe' }
  ],
  experiences: [
    {
      id: 'e1',
      role: '高级前端工程师',
      company: '深空工业科技',
      startDate: '2022-03',
      endDate: '至今',
      description: '主导设计系统重构，搭建基于 Vite 的组件库与微前端基础设施；将核心业务首屏性能提升 45%。'
    },
    {
      id: 'e2',
      role: '前端工程师',
      company: '星环数字',
      startDate: '2020-06',
      endDate: '2022-02',
      description: '负责数据可视化平台前端开发，落地 Canvas / WebGL 高性能渲染方案，支撑百万级数据点实时刷新。'
    },
    {
      id: 'e3',
      role: '初级前端工程师',
      company: '启明软件',
      startDate: '2019-07',
      endDate: '2020-05',
      description: '参与电商中后台项目，使用 React + TypeScript 完成订单、商品等模块开发与维护。'
    }
  ],
  education: [
    {
      id: 'ed1',
      school: '华东理工大学',
      degree: '本科 · 计算机科学与技术',
      startDate: '2015-09',
      endDate: '2019-06',
      description: '主修数据结构、操作系统、计算机网络；连续三年获得校级奖学金。'
    }
  ]
}

export const seedProjects: Project[] = [
  {
    id: 'p1',
    title: '星舰指挥台 Dashboard',
    description: '暗黑工业风数据可视化面板，Canvas 实时渲染舰队状态、资源与航线，支持自定义布局与主题。',
    cover: '/images/project-1.svg',
    tags: ['React', 'TypeScript', 'Vite', 'Canvas'],
    githubUrl: 'https://github.com/ember-lin/starbridge-dashboard',
    demoUrl: 'https://ember-lin.github.io/starbridge-dashboard',
    featured: true,
    createdAt: '2024-09-15',
    content: `# 星舰指挥台 Dashboard

一个面向科幻设定的数据可视化面板，用于演示高性能 Canvas 渲染与复杂状态管理。

## 核心能力

- 基于 \`requestAnimationFrame\` 的增量渲染管线
- 支持缩放、拖拽、区域框选
- 主题系统（暗金 / 冷银）

## 技术要点

\`\`\`ts
const fps = () => {
  let frames = 0
  let last = performance.now()
  return () => {
    frames++
    const now = performance.now()
    if (now - last >= 1000) {
      console.log(frames)
      frames = 0
      last = now
    }
  }
}
\`\`\`

## 数据来源

模拟数据使用随机种子生成，保证每次刷新结果一致，便于截图与回归测试。`
  },
  {
    id: 'p2',
    title: 'forge-ui 组件库',
    description: '自研暗黑工业风 React 组件库，内置金属质感主题 token，支持按需加载与 Tree Shaking。',
    cover: '/images/project-2.svg',
    tags: ['React', 'TypeScript', 'Design System', 'Rollup'],
    githubUrl: 'https://github.com/ember-lin/forge-ui',
    demoUrl: 'https://forge-ui.example.com',
    featured: true,
    createdAt: '2024-06-02',
    content: `# forge-ui 组件库

一套面向「工业 / 科幻」场景的 React 组件库。

## 设计原则

1. 语义化 token，而非硬编码色值
2. 全键盘可访问
3. 尊重 \`prefers-reduced-motion\`

## 安装

\`\`\`bash
npm install forge-ui
\`\`\`

## 使用

\`\`\`tsx
import { Button } from 'forge-ui'

<Button variant="primary">铸造</Button>
\`\`\``
  },
  {
    id: 'p3',
    title: '机械神教 API 网关',
    description: '基于 Node.js 与 TypeScript 的轻量 API 网关，提供路由、限流、缓存与鉴权中间件。',
    cover: '/images/project-3.svg',
    tags: ['Node.js', 'TypeScript', 'HTTP', 'Middleware'],
    githubUrl: 'https://github.com/ember-lin/mechanicus-gateway',
    demoUrl: '',
    featured: true,
    createdAt: '2024-03-20',
    content: `# 机械神教 API 网关

一个以「可靠、可观测」为目标的轻量网关。

## 特性

- 声明式路由
- 令牌桶限流
- 响应缓存

\`\`\`json
{
  "rateLimit": { "window": "1m", "max": 100 }
}
\`\`\``
  },
  {
    id: 'p4',
    title: '帝国之拳博客引擎',
    description: '静态博客生成器，Markdown 写作，输出纯静态站点，内置代码高亮与目录生成。',
    cover: '/images/project-4.svg',
    tags: ['Markdown', 'SSG', 'Node.js'],
    githubUrl: 'https://github.com/ember-lin/fist-blog',
    demoUrl: 'https://fist-blog.example.com',
    featured: false,
    createdAt: '2024-01-11',
    content: `# 帝国之拳博客引擎

面向工程师的静态站点生成器。

## 工作流

1. 写 Markdown
2. 运行构建
3. 部署到 Pages`
  },
  {
    id: 'p5',
    title: 'Markdown 工坊',
    description: '所见即所得的 Markdown 编辑器，左侧源码右侧实时预览，支持 GFM 表格与代码高亮。',
    cover: '/images/project-5.svg',
    tags: ['React', 'Markdown', 'Editor'],
    githubUrl: 'https://github.com/ember-lin/markdown-forge',
    demoUrl: 'https://markdown-forge.example.com',
    featured: false,
    createdAt: '2023-10-05',
    content: `# Markdown 工坊

编辑器核心基于统一的 AST 管线，保证源码与预览一致。`
  },
  {
    id: 'p6',
    title: '星图三维可视化',
    description: '基于 WebGL 的星系可视化实验，展示数千星体的运动轨迹与引力场。',
    cover: '/images/project-6.svg',
    tags: ['WebGL', 'TypeScript', 'Math'],
    githubUrl: 'https://github.com/ember-lin/star-map',
    demoUrl: 'https://star-map.example.com',
    featured: false,
    createdAt: '2023-07-18',
    content: `# 星图三维可视化

使用 WebGL 绘制星体并模拟引力作用。

\`\`\`ts
const v = velocity(a, b, dt)
\`\`\``
  }
]

export const seedSkills: Skill[] = [
  { id: 'sk1', name: 'React', category: '前端核心', icon: 'code', level: 92 },
  { id: 'sk2', name: 'TypeScript', category: '前端核心', icon: 'shield', level: 88 },
  { id: 'sk3', name: 'JavaScript', category: '前端核心', icon: 'bolt', level: 94 },
  { id: 'sk4', name: 'HTML / CSS', category: '前端核心', icon: 'layers', level: 90 },

  { id: 'sk5', name: 'Vite', category: '工程化', icon: 'terminal', level: 86 },
  { id: 'sk6', name: 'Webpack', category: '工程化', icon: 'settings', level: 78 },
  { id: 'sk7', name: 'Node.js', category: '工程化', icon: 'terminal', level: 82 },
  { id: 'sk8', name: 'Git', category: '工程化', icon: 'database', level: 88 },

  { id: 'sk9', name: 'Tailwind CSS', category: '样式与设计', icon: 'palette', level: 90 },
  { id: 'sk10', name: 'CSS3', category: '样式与设计', icon: 'palette', level: 86 },
  { id: 'sk11', name: 'SVG', category: '样式与设计', icon: 'layers', level: 72 },
  { id: 'sk12', name: 'Figma', category: '样式与设计', icon: 'eye', level: 68 },

  { id: 'sk13', name: 'Linux', category: '工具与其他', icon: 'terminal', level: 74 },
  { id: 'sk14', name: 'Docker', category: '工具与其他', icon: 'folder', level: 62 },
  { id: 'sk15', name: 'CI / CD', category: '工具与其他', icon: 'bolt', level: 70 }
]

export const seedPosts: Post[] = [
  {
    id: 'b1',
    title: '用 Vite + React 打造暗黑工业风前端工程',
    summary: '从主题 token、金属质感样式到性能优化，分享一套完整的暗黑工业风落地实践。',
    tags: ['Vite', 'React', '设计系统'],
    cover: '/images/blog-1.svg',
    date: '2024-10-02',
    published: true,
    content: `# 用 Vite + React 打造暗黑工业风前端工程

一套完整的暗黑工业风界面，不只是“换个黑色背景”，而是从 **主题 token** 到 **动效约束** 的系统性设计。

## 设计 token 先行

先定义语义化色板，避免散落的硬编码色值：

\`\`\`css
:root {
  --color-void: #0B0F1A;
  --color-panel: #1c1c1c;
  --color-gold: #b8963e;
}
\`\`\`

## 金属质感的三要素

1. 细描边而非粗边框
2. 内阴影模拟金属厚度
3. 微光而非柔和彩色阴影

## 性能清单

| 优化项 | 收益 |
| --- | --- |
| 星空粒子降级 | 移动端帧率 +30% |
| 按需引入组件 | 首屏体积 -42% |
| 资源懒加载 | LCP 显著下降 |

> 性能是体验的一部分，而非可选项。

## 结语

把约束当成风格的一部分，暗黑工业风才能稳定、可维护地落地。
`
  },
  {
    id: 'b2',
    title: 'Canvas 星空背景的性能优化实践',
    summary: '如何在移动端 375px 下保持 50fps 以上，并优雅地尊重减少动画偏好。',
    tags: ['Canvas', '性能优化', '动画'],
    cover: '/images/blog-2.svg',
    date: '2024-08-19',
    published: true,
    content: `# Canvas 星空背景的性能优化实践

星空粒子是氛围利器，但也最容易拖垮移动端帧率。本文分享几个关键优化点。

## 粒子数量与屏幕面积挂钩

\`\`\`ts
const count = Math.min(120, Math.floor(area / 12000))
\`\`\`

## 尊重 prefers-reduced-motion

\`\`\`ts
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reduced) return // 不启动动画循环
\`\`\`

## 后台自动暂停

页面不可见时停止 \`requestAnimationFrame\`，避免无谓消耗。

## 小结

- 冷白粒子，拒绝彩色
- 限制 DPR，移动端降到 1
- 复用粒子对象，减少 GC
`
  },
  {
    id: 'b3',
    title: 'Markdown 渲染与目录生成方案对比',
    summary: '从 react-markdown 到统一 AST 管线，梳理代码高亮与 TOC 的可靠实现。',
    tags: ['Markdown', 'react-markdown', 'TOC'],
    cover: '/images/blog-3.svg',
    date: '2024-06-28',
    published: true,
    content: `# Markdown 渲染与目录生成方案对比

博客系统里，代码高亮和目录（TOC）是最常见的两个需求，实现方式却各有取舍。

## 代码高亮

使用 \`rehype-highlight\` 与 \`highlight.js\`：

\`\`\`bash
npm install react-markdown rehype-highlight highlight.js
\`\`\`

## 目录生成

关键点：**TOC 的 slug 必须与标题渲染时的 id 完全一致**，否则无法跳转。

## 实践建议

1. 统一 slugify 规则
2. 跳转使用 \`scrollIntoView\`，兼容 Hash 路由
3. 跳过代码围栏内的井号行
`
  },
  {
    id: 'b4',
    title: 'localStorage 作为模拟后端的容错设计',
    summary: '如何让 localStorage 数据层在存储损坏时也不崩溃，并方便无缝替换真实接口。',
    tags: ['localStorage', '架构', '容错'],
    cover: '/images/blog-4.svg',
    date: '2024-05-10',
    published: true,
    content: `# localStorage 作为模拟后端的容错设计

在 MVP 阶段，用 localStorage 模拟后端非常高效，但必须做好容错。

## 统一读写封装

\`\`\`ts
export function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}
\`\`\`

## 结构校验

读取后校验是否为合法数组，损坏时回退到种子数据。

## 无缝替换

所有页面只依赖 \`src/api\` 导出的函数，替换真实后端时只需改动这一层。
`
  }
]
