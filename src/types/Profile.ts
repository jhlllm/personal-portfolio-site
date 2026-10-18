/**
 * 个人信息相关类型定义
 */

/** 社交账号链接 */
export interface SocialLink {
  id: string
  label: string
  url: string
  /** 图标名称，对应 components/ui/Icon.tsx 中的 IconName */
  icon: string
}

/** 工作 / 项目经历 */
export interface Experience {
  id: string
  role: string
  company: string
  startDate: string
  endDate: string
  description: string
}

/** 教育背景 */
export interface Education {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

/** 个人完整信息 */
export interface Profile {
  id: string
  name: string
  title: string
  /** 一句话个人介绍 */
  tagline: string
  /** 个人简介（较长文本） */
  bio: string
  avatar: string
  email: string
  location: string
  resumeUrl: string
  socials: SocialLink[]
  experiences: Experience[]
  education: Education[]
}
