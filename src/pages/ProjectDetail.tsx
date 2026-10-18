import { useParams, Link } from 'react-router-dom'
import { getProjectById } from '../api'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import NotFound from './NotFound'

/**
 * 项目详情页。
 */
export default function ProjectDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const project = id ? getProjectById(id) : undefined

  if (!project) {
    return <NotFound />
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-ink-dim hover:text-gold transition-colors"
      >
        <Icon name="arrow-left" size={16} /> 返回项目列表
      </Link>

      <Card className="mt-6 overflow-hidden">
        <div className="aspect-video w-full overflow-hidden border-b border-steel bg-panel-2">
          <img src={project.cover} alt={`${project.title} 封面`} className="h-full w-full object-cover" />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold uppercase tracking-wider text-ink">{project.title}</h1>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded border border-steel px-2 py-0.5 text-xs text-ink-dim">
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-4 text-base leading-relaxed text-ink-dim">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-panel border border-steel-light bg-panel-2/70 px-4 py-2 text-sm font-semibold text-ink hover:border-silver hover:shadow-metal-silver-glow transition-all"
              >
                <Icon name="github" size={16} /> GitHub 仓库
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-panel border border-gold/60 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold hover:border-gold hover:shadow-metal-glow transition-all"
              >
                <Icon name="external" size={16} /> 在线预览
              </a>
            )}
          </div>
        </div>
      </Card>

      {project.content && (
        <Card className="mt-6 p-6">
          <MarkdownRenderer content={project.content} />
        </Card>
      )}
    </div>
  )
}
