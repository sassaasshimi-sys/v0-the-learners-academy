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
      assessments,
      assignments
    ] = await Promise.all([
      db.teacher.findMany({ orderBy: { joinedAt: 'desc' } }),
      db.student.findMany({ orderBy: { enrolledAt: 'desc' } }),
      db.course.findMany({ orderBy: { startDate: 'desc' } }),
      db.submission.findMany({ orderBy: { submittedAt: 'desc' } }),
      db.schedule.findMany({ orderBy: { classTitle: 'asc' } }),
      db.question.findMany({ orderBy: { category: 'asc' } }),
      db.assessmentTemplate.findMany({ orderBy: { createdAt: 'desc' } }),
      db.assignment.findMany({ orderBy: { createdAt: 'desc' } })
    ])

    // Derive enrollments from students' enrolledCourses
    const enrollments = students.flatMap(s => 
      (s.enrolledCourses || []).map(courseId => ({
        id: `${s.id}-${courseId}`,
        studentId: s.id,
        studentName: s.name,
        courseId,
        progress: s.progress || 0,
        grade: s.grade || 'N/A'
      }))
    )

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
        assignments, 
        enrollments, 
      }
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
    return { success: false, error: 'Database error' }
  }
}
