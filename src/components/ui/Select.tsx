import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

/**
 * 金属质感下拉选择框（含 label / 错误提示）。
 */

const baseSelect =
  'w-full rounded-panel border border-steel bg-panel-2/70 px-3 py-2 text-sm text-ink ' +
  'outline-none transition-colors focus:border-gold/70 focus:shadow-metal-glow'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id, ...props },
  ref
) {
  const selectId = id ?? props.name
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-ink-dim">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(baseSelect, error && 'border-danger/70', className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-panel-2 text-ink">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-bright">{error}</p>}
    </div>
  )
})
