/**
 * 统一 API 接口层。
 * 页面只依赖本文件导出的函数，后续接入真实后端时仅需替换实现。
 */
export * from './auth'
export * from './posts'
export * from './projects'
export * from './skills'
export * from './profile'
export { safeRead, safeWrite, safeRemove } from './storage'
