import { AuthProvider } from './hooks/useAuth'
import { ToastProvider } from './components/ui/Toast'
import AppRouter from './router'

/**
 * 应用根组件：按顺序包裹 鉴权上下文 -> 全局 Toast 上下文 -> 路由。
 */
export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  )
}
