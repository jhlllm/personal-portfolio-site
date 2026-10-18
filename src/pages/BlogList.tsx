import { Link } from 'react-router-dom'
import { getPosts } from '../api'
import { formatDate } from '../utils/format'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'

/**
 * 博客列表页：标题 / 摘要 / 发布日期 / 标签。
 */
export default function BlogList(): JSX.Element {
  const posts = getPosts().filter((p) => p.published)

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <header className="mb-10">
        <span className="imperial-tag">Blog</span>
        <h1 className="mt-1 text-3xl font-bold uppercase tracking-wider text-ink">博客</h1>
        <div className="metal-divider mt-4" />
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-metal-silver-glow">
              <div className="aspect-video w-full overflow-hidden border-b border-steel bg-panel-2">
                <img
                  src={post.cover}
                  alt={`${post.title} 封面`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-ink-dim">
                  <Icon name="calendar" size={12} className="text-gold/70" />
                  <span className="font-mono">{formatDate(post.date)}</span>
                </div>
                <h2 className="mt-2 text-base font-bold text-ink group-hover:text-gold-bright transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-dim">{post.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded border border-steel px-1.5 py-0.5 text-[11px] text-ink-dim">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
