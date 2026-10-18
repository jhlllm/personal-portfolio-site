# 技术设计文档（TECH_DESIGN）

## 一、技术栈

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | React 18 + TypeScript 5 | 严格模式，禁止 `any` |
| 构建 | Vite 5 + @vitejs/plugin-react | `base: './'` 相对路径 |
| 样式 | Tailwind CSS 3 + PostCSS + Autoprefixer | 自定义战锤暗黑金属主题 |
| 路由 | react-router-dom 6（HashRouter） | 静态部署刷新不 404 |
| 表单 | react-hook-form + zod + @hookform/resolvers | 统一校验 |
| Markdown | react-markdown + remark-gfm + rehype-highlight + highlight.js | 代码高亮 + TOC |

> 未引入 Antd / MUI 等重型 UI 库，全部组件手写。

## 二、项目结构

```
personal-portfolio-site/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── PRD.md / TECH_DESIGN.md / AGENTS.md
├── src/
│   ├── main.tsx / App.tsx / router.tsx / index.css / vite-env.d.ts
│   ├── types/            # Post / Project / Skill / Profile
│   ├── api/              # 统一接口层（storage / seed / auth / posts / projects / skills / profile）
│   ├── components/
│   │   ├── layout/       # Navbar / Footer / FrontLayout / AdminLayout / Sidebar
│   │   ├── ui/           # Icon / Button / Card / Modal / ConfirmModal / Input / Textarea / Select / Toast
│   │   ├── StarBackground.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── pages/            # Home / About / Skills / Projects / ProjectDetail / BlogList / BlogDetail / Contact / NotFound + admin/*
│   ├── hooks/            # useAuth / useLocalStorage / useScrollToTop
│   └── utils/            # markdown / format / sanitize / scroll / cn
└── public/               # avatar.svg / favicon.svg / resume.html / images/*
```

## 三、数据模型（localStorage）

| 键（前缀 `pps:`） | 类型 | 说明 |
| --- | --- | --- |
| `posts` | `Post[]` | 博客文章 |
| `projects` | `Project[]` | 项目 |
| `skills` | `Skill[]` | 技能 |
| `profile` | `Profile` | 个人信息 |
| `auth_session` | `Session` | 模拟 token 会话（含过期时间） |
| `messages` | `StoredMessage[]` | 联系表单消息 |

### 核心类型

- `Post`：`id / title / summary / tags[] / cover / date / content / published`
- `Project`：`id / title / description / cover / tags[] / githubUrl / demoUrl / featured / createdAt / content`
- `Skill`：`id / name / category / icon / level`
- `Profile`：`id / name / title / tagline / bio / avatar / email / location / resumeUrl / socials[] / experiences[] / education[]`

## 四、关键技术难点与方案

### 1. localStorage 模拟后端 + 容错
`api/storage.ts` 提供 `safeRead / safeWrite / safeRemove`，全部 try/catch；
读取时校验数据结构（数组 / 字段），损坏时回退到种子数据，保证页面不崩溃。
页面只依赖 `api/index.ts` 导出的函数，替换真实后端只需改动该层。

### 2. 模拟 token 鉴权
`api/auth.ts`：密码仅在内存比对，绝不写入 localStorage；登录成功后写入
`{ token, expiresAt }`，`isAuthenticated()` 校验 token 存在且未过期。

### 3. Markdown 渲染 + 代码高亮 + TOC
- 渲染：react-markdown + remark-gfm + rehype-highlight
- 标题 id：`utils/markdown.ts` 的 `slugify` 统一生成，TOC 与渲染标题共用同一规则
- TOC 跳转：使用 `scrollIntoView`（而非 URL hash），兼容 HashRouter

### 4. 星空背景性能
`StarBackground.tsx`：
- 粒子数量与屏幕面积挂钩，移动端更少
- 移动端 DPR 限制为 1
- `visibilitychange` 时暂停 / 恢复
- `prefers-reduced-motion` 时只绘制静态一帧

### 5. 路由守卫
`router.tsx` 的 `RequireAuth` 包裹后台布局，未登录 `<Navigate to="/admin/login" replace />`。

### 6. 相对路径部署
`vite.config.ts` 设置 `base: './'`；使用 HashRouter，GitHub Pages / Cloudflare Pages
无需服务端重写即可访问任意路由。
