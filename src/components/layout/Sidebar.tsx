import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getProfile } from '../../api/profile'
import Icon from '../ui/Icon'
import { cn } from '../../utils/cn'

/**
 * 后台侧边栏（独立于前台导航组件）。
 */

const ADMIN_ITEMS: Array<{ to: string; label: string; icon: 'home' | 'file' | 'folder' | 'bolt' | 'user' }> = [
  { to: '/admin', label: '后台首页', icon: 'home' },
  { to: '/admin/blog', label: '博客管理', icon: 'file' },
  { to: '/admin/projects', label: '项目管理', icon: 'folder' },
  { to: '/admin/skills', label: '技能管理', icon: 'bolt' },
  { to: '/admin/settings', label: '个人信息设置', icon: 'user' }
]

interface SidebarProps {
  onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps): JSX.Element {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const profile = getProfile()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-steel bg-panel/70">
      {/* 品牌区 */}
      <div className="flex items-center gap-2 border-b border-steel px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-panel border border-gold/50 text-gold">
          <Icon name="skull" size={18} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-ink">
            {profile.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold/70">控制中枢</p>
        </div>
      </div>

      {/* 导航 */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="后台导航">
        {ADMIN_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-panel border px-3 py-2 text-sm font-semibold tracking-wider transition-colors',
                isActive
                  ? 'border-gold/40 bg-gold/10 text-gold-bright'
                  : 'border-transparent text-ink-dim hover:text-ink hover:bg-panel-2'
              )
            }
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* 底部操作 */}
      <div className="space-y-1 border-t border-steel p-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-panel px-3 py-2 text-sm font-semibold tracking-wider text-ink-dim hover:text-ink transition-colors"
        >
          <Icon name="external" size={16} />
          返回前台
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-panel px-3 py-2 text-sm font-semibold tracking-wider text-danger-bright/90 hover:text-danger-bright hover:bg-danger/10 transition-colors"
        >
          <Icon name="logout" size={16} />
          退出登录
        </button>
      </div>
    </aside>
  )
}
