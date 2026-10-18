/**
 * 输入安全防护（简单 XSS 防护）。
 */

/** 拒绝明显危险输入的正则（script 标签 / javascript: 协议 / 事件属性） */
export const XSS_PATTERN = /(<script|javascript:|on\w+\s*=)/i

/** 判断字符串是否含明显 XSS 危险内容 */
export function noXss(value: string): boolean {
  return !XSS_PATTERN.test(value)
}

/**
 * 清除所有 HTML 标签（普通文本字段），并清除控制字符。
 */
export function sanitizePlainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
}

/** HTML 实体转义（用于直接输出到 DOM 的文本） */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return input.replace(/[&<>"']/g, (ch) => map[ch] ?? ch)
}
