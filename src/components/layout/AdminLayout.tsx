import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import StarBackground from '../StarBackground'
import Icon from '../ui/Icon'
import { useScrollToTop } from '../../hooks/useScrollToTop'

/**
 * 后台布局：侧边栏 + 顶部导航栏，复用战锤暗黑金属风格，不复用前台导航组件。
 */

const TITLES: Record<string, string> = {
  '/admin': '后台首页',
  '/admin/blog': '博客管理',
  '/admin/projects': '项目管理',
  '/admin/skills': '技能管理',
  '/admin/settings': '个人信息设置'
}

export default function AdminLayout(): JSX.Element {
  useScrollToTop()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const title = TITLES[location.pathname] ?? '后台管理'

  return (
    <div className="relative flex min-h-screen">
      <StarBackground />

      {/* 桌面端侧边栏 */}
      <div className="relative z-20 hidden lg:block">
        <Sidebar />
      </div>

      {/* 移动端抽屉侧边栏 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-steel bg-void/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-panel border border-steel text-ink lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="打开侧边栏"
            >
              <Icon name="menu" size={20} />
            </button>
            <h1 className="font-display text-lg font-bold uppercase tracking-[0.15em] text-ink">
              {title}
            </h1>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold/70 hidden sm:inline">
            Admin Console
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
