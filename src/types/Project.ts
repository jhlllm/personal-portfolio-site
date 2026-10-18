/**
 * 项目相关类型定义
 */
export interface Project {
  id: string
  title: string
  description: string
  /** 封面图（相对路径） */
  cover: string
  tags: string[]
  githubUrl: string
  demoUrl: string
  featured: boolean
  createdAt: string
  /** 项目详情（Markdown 正文） */
  content: string
}
