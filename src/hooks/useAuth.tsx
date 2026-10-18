import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import * as authApi from '../api/auth'

/**
 * 鉴权上下文：提供登录态、登录 / 登出方法。
 * 路由守卫（router.tsx 中的 RequireAuth）依赖这里的 isAuthed。
 */

interface AuthContextValue {
  isAuthed: boolean
  login: (username: string, password: string) => authApi.AuthResult
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => authApi.isAuthenticated())

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthed,
      login: (username, password) => {
        const result = authApi.login(username, password)
        if (result.ok) setIsAuthed(true)
        return result
      },
      logout: () => {
        authApi.logout()
        setIsAuthed(false)
      }
    }),
    [isAuthed]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** 获取鉴权上下文（须在 AuthProvider 内使用） */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}
