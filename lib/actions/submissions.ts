'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { Submission, StudentTest } from '@/lib/types'

export async function getSubmissions() {
  return db.submission.findMany({ orderBy: { submittedAt: 'desc' } })
}

export async function submitTestResult(result: StudentTest, assignmentTitle: string) {
  const res = await db.submission.create({
    data: {
      assignmentId: result.templateId,
      assignmentTitle,
      studentId: result.studentId,
      studentName: result.studentName,
      status: 'graded',
      grade: result.score,
      randomizedQuestions: result.randomizedQuestions as any,
      answers: result.answers as any,
      aiFeedback: result.feedback,
      aiJustification: 'AI evaluation complete.',
    }
  })
  revalidatePath('/')
  return res
}

export async function gradeSubmission(id: string, grade: number, feedback: string) {
  const res = await db.submission.update({
    where: { id },
    data: { grade, feedback, status: 'graded' }
  })
  revalidatePath('/')
  return res
}
