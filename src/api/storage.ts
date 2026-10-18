/**
 * localStorage 安全封装。
 * 所有读写都带 try/catch 容错，存储损坏（JSON 解析失败 / 存储不可用）时
 * 返回兜底值，保证页面不崩溃。
 */

const PREFIX = 'pps:'

function getStore(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/** 安全读取：解析失败 / 缺失 / 存储不可用时返回 fallback */
export function safeRead<T>(key: string, fallback: T): T {
  const store = getStore()
  if (!store) return fallback
  try {
    const raw = store.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** 安全写入：成功返回 true，失败（配额/不可用）返回 false */
export function safeWrite<T>(key: string, value: T): boolean {
  const store = getStore()
  if (!store) return false
  try {
    store.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** 安全删除 */
export function safeRemove(key: string): void {
  const store = getStore()
  if (!store) return
  try {
    store.removeItem(PREFIX + key)
  } catch {
    // 忽略删除失败
  }
}

/** 判断是否为合法数组（用于存储损坏时的结构校验） */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
