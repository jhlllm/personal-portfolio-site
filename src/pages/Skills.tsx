import { getSkills, getSkillCategories } from '../api'
import Icon, { type IconName } from '../components/ui/Icon'
import { Card } from '../components/ui/Card'

/**
 * 技能展示模块：按分类分组，图标 + 名称 + 熟练度进度条。
 */

/** 分类对应的图标（兜底用） */
const CATEGORY_ICONS: Record<string, IconName> = {
  前端核心: 'code',
  工程化: 'terminal',
  样式与设计: 'palette',
  工具与其他: 'database'
}

export default function Skills(): JSX.Element {
  const skills = getSkills()
  const categories = getSkillCategories()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="imperial-tag">Skills</span>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-wider text-ink">技能展示</h1>
        <div className="metal-divider mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((category) => {
          const items = skills.filter((s) => s.category === category)
          if (items.length === 0) return null
          const catIcon = CATEGORY_ICONS[category] ?? 'bolt'
          return (
            <Card key={category} className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-ink">
                <Icon name={catIcon} size={18} className="text-gold" />
                {category}
              </h2>
              <div className="metal-divider my-4" />

              <ul className="space-y-4">
                {items.map((skill) => (
                  <li key={skill.id}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <Icon name={skill.icon as IconName} size={14} className="text-ink-dim" />
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs text-gold-bright">{skill.level}%</span>
                    </div>
                    {/* 熟练度进度条 */}
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full border border-steel bg-panel-2"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} 熟练度`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-dim to-gold-bright transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
