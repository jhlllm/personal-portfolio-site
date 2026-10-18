import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

/**
 * 通用金属面板卡片容器。
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn('metal-panel', className)} {...props} />
}
