/**
 * 技能相关类型定义
 */
export interface Skill {
  id: string
  name: string
  /** 技能分类（如：前端核心 / 工程化 / 样式与设计 / 工具链） */
  category: string
  /** 图标名称，对应 components/ui/Icon.tsx 中的 IconName */
  icon: string
  /** 熟练度，0 - 100 */
  level: number
}
