import { getProfile } from '../../api/profile'
import Icon from '../ui/Icon'

/**
 * 页脚组件：社交链接 + 版权信息。
 */
export default function Footer(): JSX.Element {
  const profile = getProfile()
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-steel bg-void/90">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold">
              <Icon name="skull" size={16} />
            </span>
            <span className="font-display font-bold tracking-[0.15em] text-ink uppercase">
              {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {profile.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-9 w-9 items-center justify-center rounded-panel border border-steel text-ink-dim hover:text-gold hover:border-gold/50 hover:shadow-metal-glow transition-all"
                aria-label={s.label}
                title={s.label}
              >
                <Icon name={(s.icon as 'github') || 'globe'} size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 text-xs text-ink-dim/70">
          <span className="font-mono tracking-wider">
            © {year} {profile.name} · {profile.title}
          </span>
          <span className="font-mono">FORGED IN THE DARK · 个人展示网站</span>
        </div>
      </div>
    </footer>
  )
}
