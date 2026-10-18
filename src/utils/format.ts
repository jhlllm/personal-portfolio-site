/**
 * 通用工具：时间格式化、id 生成等。
 */

/** 将 ISO 日期字符串格式化为 YYYY-MM-DD */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 生成唯一 id */
export function generateId(prefix = 'id'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}_${rand}`
}

/** 当前日期（YYYY-MM-DD），用于表单默认值 */
export function today(): string {
  return formatDate(new Date().toISOString())
}
