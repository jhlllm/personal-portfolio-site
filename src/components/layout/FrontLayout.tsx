import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import StarBackground from '../StarBackground'
import { useScrollToTop } from '../../hooks/useScrollToTop'

/**
 * 前台布局：星空背景 + 导航 + 内容 + 页脚。
 */
export default function FrontLayout(): JSX.Element {
  useScrollToTop()
  return (
    <div className="relative flex min-h-screen flex-col">
      <StarBackground />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
