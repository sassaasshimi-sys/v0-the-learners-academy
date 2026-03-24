'use server'

import db from '@/lib/db'

export async function getInitialData() {
  try {
    const [
      teachers,
      students,
      courses,
      submissions,
      schedules,
      questions,
      assessments
    ] = await Promise.all([
      db.teacher.findMany({ orderBy: { joinedAt: 'desc' } }),
      db.student.findMany({ orderBy: { enrolledAt: 'desc' } }),
      db.course.findMany({ orderBy: { startDate: 'desc' } }),
      db.submission.findMany({ orderBy: { submittedAt: 'desc' } }),
      db.schedule.findMany({ orderBy: { classTitle: 'asc' } }),
      db.question.findMany({ orderBy: { category: 'asc' } }),
      db.assessmentTemplate.findMany({ orderBy: { createdAt: 'desc' } })
    ])

    return {
      success: true,
      data: {
        teachers,
        students,
        courses,
        submissions,
        schedules,
        questions,
        assessments,
        // Mock assignments for now as they are derived or separate
        assignments: [], 
        enrollments: [], 
      }
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
    return { success: false, error: 'Database error' }
  }
}
