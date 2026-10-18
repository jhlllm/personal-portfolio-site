import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 路由变化时滚动到页面顶部。
 */
export function useScrollToTop(): void {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
