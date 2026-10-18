import { Link } from 'react-router-dom'
import { getPosts, getProjects, getSkills, getProfile } from '../../api'
import Icon, { type IconName } from '../../components/ui/Icon'
import { Card } from '../../components/ui/Card'

/**
 * 后台首页：数据概览 + 快捷入口。
 */
export default function AdminHome(): JSX.Element {
  const posts = getPosts()
  const projects = getProjects()
  const skills = getSkills()
  const profile = getProfile()

  const stats: Array<{ label: string; value: number; icon: IconName; to: string }> = [
    { label: '博客文章', value: posts.length, icon: 'file', to: '/admin/blog' },
    { label: '项目', value: projects.length, icon: 'folder', to: '/admin/projects' },
    { label: '技能', value: skills.length, icon: 'bolt', to: '/admin/skills' }
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎语 */}
      <Card className="p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold/70">Welcome back</p>
        <h2 className="mt-1 text-2xl font-bold uppercase tracking-wider text-ink">{profile.name}</h2>
        <p className="mt-2 text-sm text-ink-dim">这是你的后台控制中枢，管理博客、项目、技能与个人信息。</p>
      </Card>

      {/* 数据统计 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-metal-glow">
              <span className="flex h-12 w-12 items-center justify-center rounded-panel border border-gold/40 text-gold">
                <Icon name={s.icon} size={22} />
              </span>
              <div>
                <p className="text-3xl font-bold text-ink">{s.value}</p>
                <p className="text-sm text-ink-dim">{s.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* 快捷入口 */}
      <Card className="p-6">
        <h3 className="text-lg font-bold uppercase tracking-wider text-ink">快捷操作</h3>
        <div className="metal-divider my-4" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/blog"
            className="flex items-center gap-2 rounded-panel border border-steel px-4 py-3 text-sm font-semibold text-ink-dim hover:text-gold hover:border-gold/50 transition-colors"
          >
            <Icon name="plus" size={16} /> 新增博客
          </Link>
          <Link
            to="/admin/projects"
            className="flex items-center gap-2 rounded-panel border border-steel px-4 py-3 text-sm font-semibold text-ink-dim hover:text-gold hover:border-gold/50 transition-colors"
          >
            <Icon name="plus" size={16} /> 新增项目
          </Link>
          <Link
            to="/admin/skills"
            className="flex items-center gap-2 rounded-panel border border-steel px-4 py-3 text-sm font-semibold text-ink-dim hover:text-gold hover:border-gold/50 transition-colors"
          >
            <Icon name="plus" size={16} /> 新增技能
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-2 rounded-panel border border-steel px-4 py-3 text-sm font-semibold text-ink-dim hover:text-gold hover:border-gold/50 transition-colors"
          >
            <Icon name="settings" size={16} /> 个人信息设置
          </Link>
        </div>
      </Card>
    </div>
  )
}
