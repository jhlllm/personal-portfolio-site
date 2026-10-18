import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'

/**
 * 404 页面。
 */
export default function NotFound(): JSX.Element {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="text-gold">
        <Icon name="skull" size={48} />
      </span>
      <p className="mt-6 font-mono text-7xl font-bold tracking-widest text-ink">404</p>
      <h1 className="mt-3 text-xl font-bold uppercase tracking-wider text-ink">页面失联</h1>
      <p className="mt-2 max-w-md text-sm text-ink-dim">
        你寻找的页面不存在，或已在星海中遗失。返回首页继续探索。
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-panel border border-gold/60 bg-gold/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-gold hover:border-gold hover:shadow-metal-glow transition-all"
      >
        <Icon name="arrow-left" size={16} /> 返回首页
      </Link>
    </div>
  )
}
