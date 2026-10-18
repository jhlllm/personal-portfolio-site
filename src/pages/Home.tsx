import { Link } from 'react-router-dom'
import { getProfile } from '../api/profile'
import { getFeaturedProjects, getPosts } from '../api'
import { formatDate } from '../utils/format'
import Icon from '../components/ui/Icon'
import { Card } from '../components/ui/Card'

/**
 * 首页 Hero 模块 + 精选项目 / 最新博客预览。
 */
export default function Home(): JSX.Element {
  const profile = getProfile()
  const featured = getFeaturedProjects(3)
  const recentPosts = getPosts().slice(0, 3)

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative mx-auto flex max-w-[1200px] flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <div className="mb-6">
          <span className="imperial-tag">
            <Icon name="bolt" size={12} /> Frontend Engineer
          </span>
        </div>

        {/* 头像：金属描边外框 */}
        <div className="relative mb-6">
          <div className="h-32 w-32 overflow-hidden rounded-panel border-2 border-gold/60 shadow-metal-glow sm:h-40 sm:w-40">
            <img src={profile.avatar} alt={`${profile.name} 的头像`} className="h-full w-full object-cover" />
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-panel border border-gold/50 bg-panel text-gold">
            <Icon name="skull" size={14} />
          </span>
        </div>

        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-ink sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-gold-bright sm:text-base">
          {profile.title}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-dim">
          {profile.tagline}
        </p>

        {/* CTA 按钮组 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-panel border border-gold/60 bg-gold/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gold hover:border-gold hover:text-gold-bright hover:shadow-metal-glow transition-all"
          >
            查看项目
            <Icon name="arrow-right" size={16} />
          </Link>
          <a
            href={profile.resumeUrl}
            download="resume.html"
            className="inline-flex items-center gap-2 rounded-panel border border-steel-light bg-panel-2/70 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink hover:border-silver hover:text-white hover:shadow-metal-silver-glow transition-all"
          >
            <Icon name="download" size={16} />
            下载简历
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-panel border border-steel-light bg-panel-2/70 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ink hover:border-silver hover:text-white hover:shadow-metal-silver-glow transition-all"
          >
            联系我
            <Icon name="mail" size={16} />
          </Link>
        </div>
      </section>

      {/* ============ 精选项目 ============ */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="imperial-tag">Selected Works</span>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-wider text-ink">精选项目</h2>
          </div>
          <Link to="/projects" className="text-sm text-gold hover:text-gold-bright inline-flex items-center gap-1">
            全部项目 <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-metal-glow">
                <div className="aspect-video w-full overflow-hidden border-b border-steel bg-panel-2">
                  <img
                    src={p.cover}
                    alt={`${p.title} 封面`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-ink group-hover:text-gold-bright transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-dim">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded border border-steel px-1.5 py-0.5 text-[11px] text-ink-dim">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 最新博客 ============ */}
      <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="imperial-tag">Latest Posts</span>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-wider text-ink">最新博客</h2>
          </div>
          <Link to="/blog" className="text-sm text-gold hover:text-gold-bright inline-flex items-center gap-1">
            全部文章 <Icon name="arrow-right" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group">
              <Card className="h-full p-5 transition-shadow hover:shadow-metal-silver-glow">
                <p className="font-mono text-xs text-gold/70">{formatDate(post.date)}</p>
                <h3 className="mt-2 text-base font-bold text-ink group-hover:text-gold-bright transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink-dim">{post.summary}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

