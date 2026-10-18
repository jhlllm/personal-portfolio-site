import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import Icon from './Icon'
import { cn } from '../../utils/cn'

/**
 * 全局 Toast 反馈（成功 / 失败 / 信息）。
 * 通过 useToast() 在任意组件中调用。
 */

export type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const typeStyles: Record<ToastType, { border: string; icon: 'check' | 'alert' | 'bolt' }> = {
  success: { border: 'border-success/60', icon: 'check' },
  error: { border: 'border-danger/60', icon: 'alert' },
  info: { border: 'border-gold/60', icon: 'bolt' }
}

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = ++idRef.current
      setItems((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-20 right-4 z-[110] flex w-72 flex-col gap-2" aria-live="polite">
        {items.map((t) => {
          const s = typeStyles[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-2 rounded-panel border bg-panel/95 px-3 py-2 shadow-metal animate-slide-up',
                s.border
              )}
            >
              <span className="mt-0.5 text-ink">
                <Icon name={s.icon} size={16} />
              </span>
              <p className="text-sm text-ink break-words">{t.message}</p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast 必须在 ToastProvider 内使用')
  return ctx
}
