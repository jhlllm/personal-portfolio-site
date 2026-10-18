import { safeRead, safeWrite, isArray } from './storage'
import { seedPosts } from './seed'
import { generateId } from '../utils/format'
import type { Post } from '../types/Post'

const KEY = 'posts'

/** 读取全部文章（存储损坏时回退到种子数据） */
function readAll(): Post[] {
  const raw = safeRead<unknown>(KEY, null)
  if (isArray(raw)) return raw as Post[]
  // 首次访问 / 存储损坏：写入种子数据
  safeWrite(KEY, seedPosts)
  return seedPosts
}

/** 按日期倒序返回文章 */
export function getPosts(): Post[] {
  return readAll()
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostById(id: string): Post | undefined {
  return readAll().find((p) => p.id === id)
}

export function createPost(input: Omit<Post, 'id'>): Post {
  const list = readAll()
  const post: Post = { ...input, id: generateId('post') }
  safeWrite(KEY, [post, ...list])
  return post
}

export function updatePost(id: string, input: Omit<Post, 'id'>): Post | null {
  const list = readAll()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const updated: Post = { ...input, id }
  list[idx] = updated
  safeWrite(KEY, list)
  return updated
}

export function deletePost(id: string): void {
  const list = readAll().filter((p) => p.id !== id)
  safeWrite(KEY, list)
}
