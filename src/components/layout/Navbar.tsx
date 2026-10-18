import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getProfile } from '../../api/profile'
import Icon from '../ui/Icon'
import { cn } from '../../utils/cn'

/**
 * 吸顶毛玻璃导航栏 + 移动端汉堡折叠菜单。
 */

const NAV_ITEMS: Array<{ to: string; label: string }> = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于' },
  { to: '/skills', label: '技能' },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
  { to: '/contact', label: '联系' }
]

export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState(false)
  const profile = getProfile()

  return (
    <header className="sticky top-0 z-50 border-b border-steel bg-void/80 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6"
        aria-label="主导航"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-panel border border-gold/50 text-gold group-hover:shadow-metal-glow transition-shadow">
            <Icon name="skull" size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.15em] text-ink uppercase">
            {profile.name}
          </span>
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-panel px-3 py-2 text-sm font-semibold tracking-wider transition-colors',
                  isActive
                    ? 'text-gold-bright border border-gold/40 bg-gold/5'
                    : 'text-ink-dim hover:text-ink'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            className="ml-2 rounded-panel border border-steel px-3 py-2 text-sm font-semibold tracking-wider text-ink-dim hover:text-gold hover:border-gold/50 transition-colors"
          >
            管理
          </Link>
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-panel border border-steel text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
        >
          <Icon name={open ? 'x' : 'menu'} size={20} />
        </button>
      </nav>

      {/* 移动端折叠菜单 */}
      {open && (
        <div className="border-t border-steel bg-void/95 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-panel px-3 py-2 text-sm font-semibold tracking-wider transition-colors',
                    isActive
                      ? 'text-gold-bright border border-gold/40 bg-gold/5'
                      : 'text-ink-dim hover:text-ink'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-panel border border-steel px-3 py-2 text-sm font-semibold tracking-wider text-ink-dim hover:text-gold transition-colors"
            >
              管理
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
