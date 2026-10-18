import { getProfile } from '../api/profile'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'

/**
 * 个人介绍模块：简介 + 经历时间线 + 教育背景。
 */
export default function About(): JSX.Element {
  const profile = getProfile()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="imperial-tag">About</span>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-wider text-ink">个人介绍</h1>
        <div className="metal-divider mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 个人简介 */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 overflow-hidden rounded-panel border-2 border-gold/50 shadow-metal">
              <img src={profile.avatar} alt={`${profile.name} 的头像`} className="h-full w-full object-cover" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink">{profile.name}</h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gold/80">{profile.title}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-ink-dim">
              <Icon name="globe" size={12} /> {profile.location}
            </p>
          </div>

          <div className="metal-divider my-5" />

          <div className="whitespace-pre-line text-sm leading-relaxed text-ink-dim">
            {profile.bio}
          </div>
        </Card>

        {/* 经历时间线 + 教育背景 */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-ink">
              <Icon name="bolt" size={16} className="text-gold" /> 经历时间线
            </h2>
            <ol className="relative mt-6 space-y-6 border-l border-steel pl-6">
              {profile.experiences.map((exp) => (
                <li key={exp.id} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-sm border border-gold bg-void" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-base font-bold text-ink">{exp.role}</h3>
                    <span className="text-sm text-gold-bright">{exp.company}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-ink-dim">
                    {exp.startDate} — {exp.endDate}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{exp.description}</p>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-ink">
              <Icon name="shield" size={16} className="text-gold" /> 教育背景
            </h2>
            <ul className="mt-6 space-y-4">
              {profile.education.map((edu) => (
                <li key={edu.id} className="rounded-panel border border-steel bg-panel-2/40 p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-base font-bold text-ink">{edu.school}</h3>
                    <span className="text-sm text-gold-bright">{edu.degree}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-ink-dim">
                    {edu.startDate} — {edu.endDate}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{edu.description}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
