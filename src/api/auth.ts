import { safeRead, safeWrite, safeRemove } from './storage'

/**
 * 鉴权模块（模拟 token 机制）。
 * - 密码绝不写入 localStorage，只在内存中比对。
 * - 登录成功后写入一个带过期时间的模拟 token。
 */

const SESSION_KEY = 'auth_session'
const SESSION_TTL = 24 * 60 * 60 * 1000 // 24 小时

/** 演示用默认账号（仅内存比对，不落盘） */
const DEFAULT_ACCOUNT = {
  username: 'admin',
  password: 'admin123'
}

interface Session {
  token: string
  expiresAt: number
}

export interface AuthResult {
  ok: boolean
  message?: string
}

function generateToken(): string {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** 登录：校验账号密码，成功后写入模拟 token */
export function login(username: string, password: string): AuthResult {
  if (username.trim() === DEFAULT_ACCOUNT.username && password === DEFAULT_ACCOUNT.password) {
    const session: Session = {
      token: generateToken(),
      expiresAt: Date.now() + SESSION_TTL
    }
    safeWrite(SESSION_KEY, session)
    return { ok: true }
  }
  return { ok: false, message: '账号或密码错误' }
}

/** 登出：清除会话 */
export function logout(): void {
  safeRemove(SESSION_KEY)
}

/** 判断当前是否已登录（token 存在且未过期） */
export function isAuthenticated(): boolean {
  const session = safeRead<Session | null>(SESSION_KEY, null)
  if (!session || typeof session !== 'object') return false
  if (typeof session.token !== 'string' || session.token.length === 0) return false
  if (typeof session.expiresAt !== 'number') return false
  return Date.now() < session.expiresAt
}

/** 获取当前会话 token（供后续真实接口接入时使用） */
export function getToken(): string | null {
  const session = safeRead<Session | null>(SESSION_KEY, null)
  return session && typeof session.token === 'string' ? session.token : null
}
