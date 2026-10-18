# AGENTS.md · AI 代理开发规范

本文件为 AI 代理在本仓库协作开发的统一规范。

## 1. 技术约束

- 仅使用 React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3。
- 禁止引入 Antd / MUI 等重型 UI 库。
- 仅允许轻量库：react-hook-form、zod、@hookform/resolvers、react-markdown、remark-gfm、rehype-highlight、highlight.js。
- TypeScript 开启 `strict`，禁止使用 `any`，用联合类型 / 泛型 / 类型守卫替代。
- 静态资源一律使用相对路径（`./...`），保证可部署到 GitHub Pages / Cloudflare Pages。

## 2. UI 风格铁律（战锤 40K 暗黑硬核金属工业风）

- 背景 `#0B0F1A`，面板 `#1c1c1c`，文字 `#E6EAF2`，次要文字 `#9ca3af`。
- 点缀色为暗金 `#b8963e` / 冷灰银 `#8a93a6`；**禁用亮蓝色**作为主色。
- 卡片 8px 圆角、金属细描边、hover 金属微光（禁止柔和彩色阴影、禁止 12–16px 大圆角）。
- 按钮为深色金属质感，无渐变亮彩。
- 星空粒子为冷白光，禁止彩色粒子。
- 所有前台 + 后台页面必须统一该风格。

## 3. 功能规范

- 后台路由统一挂载 `/admin`，使用独立布局（侧边栏 + 顶部导航），不复用前台导航。
- 数据层统一走 `src/api`，页面不直接操作 localStorage；localStorage 读写必须容错。
- 所有删除操作必须弹二次确认（`ConfirmModal`）。
- 登录密码禁止明文存储，使用模拟 token（`api/auth.ts`）。
- 表单统一使用 react-hook-form + zod，普通文本字段做 XSS 过滤（`utils/sanitize.ts`）。
- 所有页面挂载 `StarBackground`。

## 4. 可访问性与性能

- 颜色对比度达到 WCAG AA。
- 所有 `<img>` 必须补 `alt`；交互元素支持键盘导航。
- 严格尊重 `prefers-reduced-motion`：减少动画时关闭粒子动画、hover 微光、过渡。
- 星空粒子移动端降级，保证 375px 下 ≥50fps。

## 5. 目录与命名

- 目录结构以 PRD 为准，不得随意改名。
- 类型定义放 `src/types`，接口放 `src/api`，纯函数放 `src/utils`，复用逻辑放 `src/hooks`。
- 组件文件名与导出组件使用 PascalCase。

## 6. 提交前检查

- `npm run typecheck`（`tsc --noEmit`）通过。
- `npm run build` 成功产出 `dist`。
- 移动端 375px 无横向滚动条。
- 未登录访问 `/admin` 任意路由强制跳登录页。
