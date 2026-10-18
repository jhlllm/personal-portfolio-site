import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

/**
 * 深色金属质感按钮：金属描边 + hover 微光，无渐变亮彩色。
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-gold/60 bg-gold/10 text-gold hover:text-gold-bright hover:border-gold hover:shadow-metal-glow',
  secondary:
    'border-steel-light bg-panel-2/70 text-ink hover:text-white hover:border-silver hover:shadow-metal-silver-glow',
  ghost: 'border-transparent bg-transparent text-ink-dim hover:text-ink',
  danger:
    'border-danger/60 bg-danger/10 text-danger-bright hover:border-danger-bright hover:shadow-[0_0_0_1px_rgba(224,108,101,0.35),0_0_16px_rgba(224,108,101,0.15)]'
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', fullWidth = false, className, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-panel border font-display font-semibold uppercase tracking-wider transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
})
