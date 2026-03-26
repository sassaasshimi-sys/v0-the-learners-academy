'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Course } from '@/lib/types'

export async function getCourses() {
  try {
    return await db.course.findMany({ orderBy: { startDate: 'desc' } })
  } catch (error) {
    console.error('DATABASE_ERROR [getCourses]:', error)
    throw new Error('Database connection failed. Please check server logs.')
  }
}

export async function addCourse(course: Omit<Course, 'enrolled'>) {
  const result = await db.course.create({ 
    data: { 
      ...course, 
      enrolled: 0,
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate)
    } as any 
  })
  revalidatePath('/')
  return result
}

export async function removeCourse(id: string) {
  const result = await db.course.delete({ where: { id } })
  revalidatePath('/')
  return result
}

export async function updateCourseStatus(id: string, status: string) {
  const result = await db.course.update({ where: { id }, data: { status } })
  revalidatePath('/')
  return result
}
