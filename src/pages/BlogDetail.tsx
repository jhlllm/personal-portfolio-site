import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostById } from '../api'
import { formatDate } from '../utils/format'
import { extractHeadings } from '../utils/markdown'
import { scrollToId } from '../utils/scroll'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import NotFound from './NotFound'

/**
 * 博客详情页：Markdown 渲染 + 代码高亮 + TOC 目录导航。
 */
export default function BlogDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const post = id ? getPostById(id) : undefined

  const toc = useMemo(() => (post ? extractHeadings(post.content) : []), [post])

  if (!post) {
    return <NotFound />
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-ink-dim hover:text-gold transition-colors"
      >
        <Icon name="arrow-left" size={16} /> 返回博客列表
      </Link>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* 正文 */}
        <article className="min-w-0 flex-1">
          <Card className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden border-b border-steel bg-panel-2">
              <img src={post.cover} alt={`${post.title} 封面`} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-dim">
                <Icon name="calendar" size={12} className="text-gold/70" />
                <span className="font-mono">{formatDate(post.date)}</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded border border-steel px-1.5 py-0.5 text-[11px]">
                    <Icon name="tag" size={10} /> {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-wide text-ink">{post.title}</h1>
              <div className="metal-divider my-5" />
              <MarkdownRenderer content={post.content} />
            </div>
          </Card>
        </article>

        {/* TOC 目录（仅在存在标题时展示） */}
        {toc.length > 0 && (
          <aside className="lg:w-64 lg:shrink-0">
            <Card className="sticky top-24 p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink">
                <Icon name="layers" size={14} className="text-gold" /> 目录
              </h2>
              <nav className="mt-3 space-y-1" aria-label="文章目录">
                {toc.map((heading) => (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => scrollToId(heading.id)}
                    className="block w-full rounded px-2 py-1 text-left text-sm text-ink-dim hover:text-gold-bright hover:bg-panel-2 transition-colors"
                    style={{ paddingLeft: `${8 + (heading.level - 1) * 12}px` }}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </Card>
          </aside>
        )}
      </div>
    </div>
  )
}
