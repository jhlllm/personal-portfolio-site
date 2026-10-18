import { safeRead, safeWrite, isArray } from './storage'
import { seedSkills } from './seed'
import { generateId } from '../utils/format'
import type { Skill } from '../types/Skill'

const KEY = 'skills'

function readAll(): Skill[] {
  const raw = safeRead<unknown>(KEY, null)
  if (isArray(raw)) return raw as Skill[]
  safeWrite(KEY, seedSkills)
  return seedSkills
}

export function getSkills(): Skill[] {
  return readAll().slice()
}

/** 返回按出现顺序分组后的分类列表 */
export function getSkillCategories(): string[] {
  const order: string[] = []
  for (const s of readAll()) {
    if (!order.includes(s.category)) order.push(s.category)
  }
  return order
}

export function createSkill(input: Omit<Skill, 'id'>): Skill {
  const list = readAll()
  const skill: Skill = { ...input, id: generateId('skill') }
  safeWrite(KEY, [...list, skill])
  return skill
}

export function updateSkill(id: string, input: Omit<Skill, 'id'>): Skill | null {
  const list = readAll()
  const idx = list.findIndex((s) => s.id === id)
  if (idx === -1) return null
  const updated: Skill = { ...input, id }
  list[idx] = updated
  safeWrite(KEY, list)
  return updated
}

export function deleteSkill(id: string): void {
  const list = readAll().filter((s) => s.id !== id)
  safeWrite(KEY, list)
}
