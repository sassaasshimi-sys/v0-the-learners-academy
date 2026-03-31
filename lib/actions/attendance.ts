'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getTeacherAttendance(startDateInput?: Date, endDateInput?: Date) {
  // Returns all attendance records for a specific date range, default is current month
  const today = new Date()
  const startDate = startDateInput || new Date(today.getFullYear(), today.getMonth(), 1)
  const endDate = endDateInput || new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  return db.teacherAttendance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          avatar: true,
          status: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
}

export async function markAttendance(teacherId: string, date: string, status: string, substituteCount: number = 0) {
  const targetDate = new Date(date)
  // Ensure we operate on the date without time components for the unique check
  targetDate.setHours(0, 0, 0, 0)

  const result = await db.teacherAttendance.upsert({
    where: {
      teacherId_date: {
        teacherId,
        date: targetDate
      }
    },
    update: {
      status,
      substituteCount
    },
    create: {
      teacherId,
      date: targetDate,
      status,
      substituteCount
    }
  })

  revalidatePath('/admin/attendance')
  return result
}
