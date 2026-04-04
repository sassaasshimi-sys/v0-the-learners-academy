'use server'

import db from '@/lib/db'

export async function getInitialData() {
  const fetchEntity = async (name: string, query: any) => {
    try {
      return await query
    } catch (error) {
      console.error(`FAILED_TO_FETCH_${name.toUpperCase()}:`, error)
      return [] // Fallback to empty array for non-critical data
    }
  }

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
      fetchEntity('teachers', db.teacher.findMany({ orderBy: { joinedAt: 'desc' } })),
      fetchEntity('students', db.student.findMany({ orderBy: { enrolledAt: 'desc' } })),
      fetchEntity('courses', db.course.findMany({ orderBy: { startDate: 'desc' } })),
      fetchEntity('submissions', db.submission.findMany({ orderBy: { submittedAt: 'desc' } })),
      fetchEntity('schedules', db.schedule.findMany({ orderBy: { classTitle: 'asc' } })),
      fetchEntity('questions', db.question.findMany({ orderBy: { category: 'asc' } })),
      fetchEntity('assessments', db.assessmentTemplate.findMany({ orderBy: { createdAt: 'desc' } })),
      fetchEntity('assignments', db.assignment.findMany({ orderBy: { createdAt: 'desc' } }))
    ])

    // Derive enrollments from students' enrolledCourses
    const enrollments = (students || []).flatMap(s => 
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
    console.error('FATAL_INITIALIZATION_ERROR:', error)
    return { success: false, error: 'Core engine failed to initialize' }
  }
}
