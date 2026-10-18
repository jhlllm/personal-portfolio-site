import { isValidElement, type ReactNode } from 'react'

/**
 * Markdown 解析工具：slug 生成、目录（TOC）提取、标题文本提取。
 * 注意：本项目的博客标题 id 与 TOC 使用同一套 slugify 规则，
 * 因此锚点可以稳定对应。TOC 跳转使用 JS scrollIntoView，而非 URL hash，
 * 以兼容 HashRouter 路由。
 */

/** 目录项 */
export interface TocHeading {
  level: number
  text: string
  id: string
}

/** 生成稳定的锚点 slug（保留中英文与数字） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** 从 React children 递归提取纯文本 */
export function childrenToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(childrenToText).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return childrenToText(props.children)
  }
  return ''
}

/** 去除行内 Markdown 语法，得到纯文本标题 */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .trim()
}

/**
 * 从 Markdown 源码提取标题，生成目录（跳过代码围栏内的 # 行）。
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const lines = markdown.split(/\r?\n/)
  const headings: TocHeading[] = []
  let inFence = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{1,6})\s+(.+)$/.exec(line)
    if (match) {
      const level = match[1].length
      const text = stripInlineMarkdown(match[2])
      headings.push({ level, text, id: slugify(text) })
    }
  }
  return headings
}
