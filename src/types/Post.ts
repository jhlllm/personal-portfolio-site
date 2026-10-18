/**
 * 博客文章相关类型定义
 */
export interface Post {
  id: string
  title: string
  summary: string
  tags: string[]
  /** 封面图（相对路径） */
  cover: string
  /** 发布日期，ISO 字符串 */
  date: string
  /** 正文（Markdown 源码） */
  content: string
  /** 是否发布 */
  published: boolean
}
