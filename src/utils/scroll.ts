/**
 * 滚动相关工具，统一尊重系统的 prefers-reduced-motion 偏好。
 */

/** 用户是否开启了“减少动画” */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 平滑滚动到指定 id 元素 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start'
  })
}

/** 滚动到页面顶部 */
export function scrollToTop(smooth = false): void {
  window.scrollTo({
    top: 0,
    behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto'
  })
}
