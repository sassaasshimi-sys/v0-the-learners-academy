'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Schedule } from '@/lib/types'

export async function getSchedules() {
  return db.schedule.findMany()
}

export async function addSchedule(schedule: Omit<Schedule, 'id'>) {
  const res = await db.schedule.create({ data: schedule as any })
  revalidatePath('/')
  return res
}

export async function updateSchedule(id: string, data: Partial<Schedule>) {
  const res = await db.schedule.update({ where: { id }, data: data as any })
  revalidatePath('/')
  return res
}

export async function removeSchedule(id: string) {
  const res = await db.schedule.delete({ where: { id } })
  revalidatePath('/')
  return res
}
