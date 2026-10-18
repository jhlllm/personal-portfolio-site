import { Link } from 'react-router-dom'
import { getProjects } from '../api'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'

/**
 * 项目展示模块：项目卡片列表（封面 / 描述 / 标签 / GitHub / 预览链接）。
 */
export default function Projects(): JSX.Element {
  const projects = getProjects()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="imperial-tag">Projects</span>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-wider text-ink">项目展示</h1>
        <div className="metal-divider mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-metal-glow"
          >
            <Link to={`/projects/${project.id}`} className="flex flex-1 flex-col">
              <div className="aspect-video w-full overflow-hidden border-b border-steel bg-panel-2">
                <img
                  src={project.cover}
                  alt={`${project.title} 封面`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-base font-bold text-ink group-hover:text-gold-bright transition-colors">
                  {project.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded border border-steel px-1.5 py-0.5 text-[11px] text-ink-dim">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>

            {/* 跳转链接 */}
            <div className="flex items-center gap-2 border-t border-steel px-4 py-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink-dim hover:text-gold transition-colors"
                >
                  <Icon name="github" size={14} /> GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink-dim hover:text-gold transition-colors"
                >
                  <Icon name="external" size={14} /> 预览
                </a>
              )}
              <Link
                to={`/projects/${project.id}`}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-bright transition-colors"
              >
                详情 <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
