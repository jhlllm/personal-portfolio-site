import { useCallback, useState } from 'react'
import { safeRead, safeWrite } from '../api/storage'

/**
 * localStorage 封装的 React Hook：
 * 以 localStorage 为数据源，写入后触发组件更新。
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => safeRead<T>(key, initialValue))

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        safeWrite(key, resolved)
        return resolved
      })
    },
    [key]
  )

  return [value, set]
}
