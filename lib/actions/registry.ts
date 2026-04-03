'use server'

import { prisma } from '@/lib/db'
import { ACADEMY_LEVELS, SESSION_TIMINGS } from '@/lib/registry'

/**
 * Registry Discovery Engine
 * Returns the union of hardcoded institutional levels/timings 
 * and any unique values found in the active database.
 */
export async function getRegistryDiscovery() {
  try {
    // Discovery: Levels
    const dbCourses = await prisma.course.findMany({
      select: { title: true },
      distinct: ['title']
    })
    
    // Discovery: Timings
    const dbTimings = await prisma.course.findMany({
      select: { schedule: true },
      distinct: ['schedule']
    })

    const discoveredLevels = Array.from(new Set([
      ...ACADEMY_LEVELS,
      ...dbCourses.map(c => c.title)
    ])).sort()

    const discoveredTimings = Array.from(new Set([
      ...SESSION_TIMINGS,
      ...dbTimings.map(c => c.schedule)
    ])).sort()

    return {
      levels: discoveredLevels,
      timings: discoveredTimings
    }
  } catch (error) {
    console.error('[REGISTRY_DISCOVERY_ERROR]', error)
    return {
      levels: [...ACADEMY_LEVELS],
      timings: [...SESSION_TIMINGS]
    }
  }
}
