import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'

import FrontLayout from './components/layout/FrontLayout'
import AdminLayout from './components/layout/AdminLayout'
import { useAuth } from './hooks/useAuth'

import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import Login from './pages/admin/Login'
import AdminHome from './pages/admin/AdminHome'
import AdminSettings from './pages/admin/AdminSettings'
import BlogManage from './pages/admin/BlogManage'
import ProjectManage from './pages/admin/ProjectManage'
import SkillManage from './pages/admin/SkillManage'

/**
 * 路由守卫：未登录访问 /admin 下任意路由，强制跳转到登录页。
 */
function RequireAuth({ children }: { children: ReactElement }): ReactElement {
  const { isAuthed } = useAuth()
  if (!isAuthed) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

/**
 * 全局路由配置。
 * 使用 HashRouter：静态部署到 GitHub Pages / Cloudflare Pages 时无需服务端重写，
 * 任意路由刷新均不会 404。
 */
export default function AppRouter(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        {/* 前台路由 */}
        <Route element={<FrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 后台登录页（独立，不使用后台布局） */}
        <Route path="/admin/login" element={<Login />} />

        {/* 后台路由（受保护） */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="blog" element={<BlogManage />} />
          <Route path="projects" element={<ProjectManage />} />
          <Route path="skills" element={<SkillManage />} />
        </Route>

        {/* 兜底：未匹配路由回到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

