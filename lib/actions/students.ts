'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Student } from '@/lib/types'

export async function getStudents() {
  try {
    return await db.student.findMany({ orderBy: { enrolledAt: 'desc' } })
  } catch (error) {
    console.error('DATABASE_ERROR [getStudents]:', error)
    throw new Error('Database connection failed. Please check server logs.')
  }
}

export async function enrollStudent(student: Omit<Student, 'progress'>) {
  const result = await db.student.create({ 
    data: { 
      ...student, 
      progress: 0,
      enrolledAt: student.enrolledAt ? new Date(student.enrolledAt) : new Date()
    } as any 
  })
  revalidatePath('/')
  return result
}

export async function removeStudent(id: string) {
  const result = await db.student.delete({ where: { id } })
  revalidatePath('/')
  return result
}

export async function updateStudentStatus(id: string, status: string) {
  const result = await db.student.update({ where: { id }, data: { status } })
  revalidatePath('/')
  return result
}
