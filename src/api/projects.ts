import { safeRead, safeWrite, isArray } from './storage'
import { seedProjects } from './seed'
import { generateId } from '../utils/format'
import type { Project } from '../types/Project'

const KEY = 'projects'

function readAll(): Project[] {
  const raw = safeRead<unknown>(KEY, null)
  if (isArray(raw)) return raw as Project[]
  safeWrite(KEY, seedProjects)
  return seedProjects
}

export function getProjects(): Project[] {
  return readAll()
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

/** 精选项目（首页展示） */
export function getFeaturedProjects(limit = 3): Project[] {
  const featured = getProjects().filter((p) => p.featured)
  return featured.length > 0 ? featured.slice(0, limit) : getProjects().slice(0, limit)
}

export function getProjectById(id: string): Project | undefined {
  return readAll().find((p) => p.id === id)
}

export function createProject(input: Omit<Project, 'id'>): Project {
  const list = readAll()
  const project: Project = { ...input, id: generateId('project') }
  safeWrite(KEY, [project, ...list])
  return project
}

export function updateProject(id: string, input: Omit<Project, 'id'>): Project | null {
  const list = readAll()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const updated: Project = { ...input, id }
  list[idx] = updated
  safeWrite(KEY, list)
  return updated
}

export function deleteProject(id: string): void {
  const list = readAll().filter((p) => p.id !== id)
  safeWrite(KEY, list)
}
