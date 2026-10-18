import { safeRead, safeWrite } from './storage'
import { seedProfile } from './seed'
import type { Profile } from '../types/Profile'

const KEY = 'profile'

function read(): Profile {
  const raw = safeRead<Profile | null>(KEY, null)
  if (raw && typeof raw === 'object' && typeof raw.name === 'string') return raw
  safeWrite(KEY, seedProfile)
  return seedProfile
}

export function getProfile(): Profile {
  return read()
}

export function updateProfile(input: Profile): Profile {
  safeWrite(KEY, input)
  return input
}
