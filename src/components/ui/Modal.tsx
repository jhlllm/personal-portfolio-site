import { useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { cn } from '../../utils/cn'

/**
 * 通用模态弹窗：支持 ESC 关闭、点击遮罩关闭、打开时锁定滚动。
 */

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg'
}: ModalProps): JSX.Element | null {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [open, handleKey])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? '弹窗'}
    >
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 面板 */}
      <div
        className={cn(
          'relative w-full metal-panel bg-panel/95 shadow-metal-glow animate-slide-up flex flex-col max-h-[85vh]',
          maxWidth
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-steel px-5 py-3">
            <h3 className="text-base font-semibold text-ink tracking-wide">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-ink-dim hover:text-ink transition-colors p-1"
              aria-label="关闭"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-steel px-5 py-3">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  )
}
