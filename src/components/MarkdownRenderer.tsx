import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { ReactNode } from 'react'
import { slugify, childrenToText } from '../utils/markdown'
import { scrollToId, prefersReducedMotion } from '../utils/scroll'

/**
 * Markdown 渲染组件：
 * - GFM 支持（表格 / 删除线 / 任务列表 / 自动链接）
 * - 代码块高亮（rehype-highlight）
 * - 标题自动生成 id（供 TOC 跳转，slug 规则与 utils/markdown.ts 一致）
 * - 内部锚点跳转使用 scrollIntoView，兼容 HashRouter
 */

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6): Components['h1'] {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return function Heading(props) {
    const { node: _node, children, ...rest } = props
    const id = slugify(childrenToText(children))
    return (
      <Tag id={id} {...rest}>
        {children}
      </Tag>
    )
  }
}

function LinkRenderer(props: { href?: string; children?: ReactNode }): JSX.Element {
  const { href, children } = props
  if (href && href.startsWith('#')) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(href.slice(1))
        }}
      >
        {children}
      </a>
    )
  }
  const external = !!href && /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
    >
      {children}
    </a>
  )
}

const components: Components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: LinkRenderer
}

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps): JSX.Element {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

/** 判断是否开启减少动画（供 TOC 平滑滚动使用，保持统一） */
export { prefersReducedMotion }
