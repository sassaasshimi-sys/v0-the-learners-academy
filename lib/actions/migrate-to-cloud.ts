import db from '@/lib/db'
import type { Teacher, Student, Course, Question, Schedule, AssessmentTemplate } from '@/lib/types'

/**
 * Migration Utility: LocalStorage -> Neon Cloud
 * 
 * Usage:
 * 1. Run this script in the browser console OR create a hidden admin page.
 * 2. It reads current localStorage and pushes each entry to the Cloud actions.
 */
export async function migrateCurrentStateToCloud(
  actions: {
    addTeacher: (teacher: Teacher) => Promise<any>,
    enrollStudent: (student: Student) => Promise<any>,
    addCourse: (course: Course) => Promise<any>,
    addQuestion: (question: Question) => Promise<any>,
    addSchedule: (schedule: Schedule) => Promise<any>,
    publishAssessment: (assessment: AssessmentTemplate) => Promise<any>,
  }
) {
  const DATA_STORAGE_KEY = 'learners_academy_data'
  const stored = localStorage.getItem(DATA_STORAGE_KEY)
  
  if (!stored) {
    console.error('No data found in localStorage to migrate.')
    return { success: false, error: 'Empty local data' }
  }

  try {
    const data = JSON.parse(stored)
    console.log(`Starting migration for ${data.teachers.length} teachers, ${data.students.length} students, etc...`)

    // Linear migration for stability
    for (const t of data.teachers) await actions.addTeacher(t)
    for (const s of data.students) await actions.enrollStudent(s)
    for (const c of data.courses) await actions.addCourse(c)
    for (const q of data.questions) await actions.addQuestion(q)
    for (const sc of data.schedules) await actions.addSchedule(sc)
    for (const a of data.assessments) await actions.publishAssessment(a)

    console.log('Migration complete!')
    return { success: true }
  } catch (error: any) {
    console.error('Migration failed:', error)
    return { success: false, error: error.message }
  }
}
