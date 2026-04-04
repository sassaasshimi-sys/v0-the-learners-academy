'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Student, Question } from '@/lib/types'

export async function getStudents() {
  try {
    return await db.student.findMany({ orderBy: { enrolledAt: 'desc' } })
  } catch (error) {
    console.error('DATABASE_ERROR [getStudents]:', error)
    throw new Error('Database connection failed. Please check server logs.')
  }
}

export async function enrollStudent(student: any) {
  try {
    const result = await db.student.create({ 
      data: { 
        ...student, 
        progress: 0,
        enrolledAt: student.enrolledAt ? new Date(student.enrolledAt) : new Date()
      }
    })

    // Create FeePayment records for enrollment
    if (student.enrolledCourses && student.enrolledCourses.length > 0) {
      for (const courseId of student.enrolledCourses) {
        const course = await db.course.findUnique({ where: { id: courseId } })
        if (course) {
          await db.feePayment.create({
            data: {
              studentId: result.id,
              courseId: courseId,
              totalAmount: course.feeAmount || 0,
              status: 'Unpaid'
            }
          })
        }
      }
    }

    revalidatePath('/')
    return result
  } catch (error) {
    console.error('DATABASE_ERROR [enrollStudent]:', error)
    throw new Error('Failed to enroll student')
  }
}

export async function deleteQuestion(id: string) {
  try {
    const result = await db.question.delete({ where: { id } })
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('FAILED_TO_DELETE_QUESTION:', error)
    return { success: false, error: 'Failed to purge block from library' }
  }
}

export async function updateQuestion(id: string, data: Partial<Question>) {
  try {
    const result = await db.question.update({ where: { id }, data: data as any })
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('FAILED_TO_UPDATE_QUESTION:', error)
    return { success: false, error: 'Curriculum update failed' }
  }
}

export async function removeStudent(id: string) {
  const result = await db.student.delete({ where: { id } })
  revalidatePath('/')
  return result
}

export async function addQuestion(question: Omit<Question, 'id'>) {
  try {
    const result = await db.question.create({
      data: {
        category: question.category,
        type: question.type,
        content: question.content,
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        imageUrl: question.imageUrl,
        phase: question.phase,
        passageText: question.passageText,
        audioUrl: question.audioUrl,
        matchPairs: question.matchPairs as any,
        isApproved: question.isApproved ?? false
      }
    })
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('FAILED_TO_ADD_QUESTION:', error)
    return { success: false, error: 'Database operation failed' }
  }
}

export async function updateStudentStatus(id: string, status: string) {
  const result = await db.student.update({ where: { id }, data: { status } })
  revalidatePath('/')
  return result
}

export async function updateStudent(id: string, data: Partial<Student>) {
  try {
    const result = await db.student.update({
      where: { id },
      data: {
        ...data,
        enrolledAt: data.enrolledAt ? new Date(data.enrolledAt) : undefined,
      }
    })
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('DATABASE_ERROR [updateStudent]:', error)
    throw new Error('Failed to update student')
  }
}

export async function updateStudentSuccessMetrics(id: string, progress: number, teacherId: string, grade?: string) {
  try {
    // Audit check: Verify if the student is actually in at least one of this teacher's courses
    // This prevents one teacher from accidentally impacting a student they don't teach
    const teacherCourses = await db.course.findMany({
      where: { teacherId },
      select: { id: true }
    })
    const courseIds = teacherCourses.map(c => c.id)

    const student = await db.student.findUnique({
      where: { id },
      select: { enrolledCourses: true }
    })

    const isAuthorized = student?.enrolledCourses.some(cId => courseIds.includes(cId))
    
    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized: Student is not enrolled in your registry' }
    }

    const result = await db.student.update({
      where: { id },
      data: { progress, grade }
    })
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('DATABASE_ERROR [updateStudentSuccessMetrics]:', error)
    return { success: false, error: 'Failed to synchronize institutional metrics' }
  }
}
