import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

/**
 * 金属质感多行文本域（含 label / 错误提示）。
 */

const baseTextarea =
  'w-full rounded-panel border border-steel bg-panel-2/70 px-3 py-2 text-sm text-ink ' +
  'placeholder:text-ink-dim/50 outline-none transition-colors resize-y ' +
  'focus:border-gold/70 focus:shadow-metal-glow'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(baseTextarea, error && 'border-danger/70', className)}
        {...props}
      />
      {hint && !error && <p className="text-xs text-ink-dim/70">{hint}</p>}
      {error && <p className="text-xs text-danger-bright">{error}</p>}
    </div>
  )
})
