'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getFeePayments() {
  try {
    const payments = await db.feePayment.findMany({
      include: {
        student: true,
        course: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return payments
  } catch (error) {
    console.error('DATABASE_ERROR [getFeePayments]:', error)
    throw new Error('Failed to fetch fee registry')
  }
}

export async function recordPayment(paymentId: string, amount: number) {
  try {
    const current = await db.feePayment.findUnique({
      where: { id: paymentId }
    })
    if (!current) throw new Error('Payment record not found')

    const newAmount = current.amountPaid + amount
    const status = newAmount >= current.totalAmount ? 'Paid' : newAmount > 0 ? 'Partial' : 'Unpaid'

    const result = await db.feePayment.update({
      where: { id: paymentId },
      data: {
        amountPaid: newAmount,
        status,
        paymentDate: new Date()
      }
    })
    
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('DATABASE_ERROR [recordPayment]:', error)
    throw new Error('Failed to record student payment')
  }
}

export async function addFeeAccount(data: { studentId: string, courseId: string, totalAmount: number, initialDeposit: number }) {
  try {
    const status = data.initialDeposit >= data.totalAmount ? 'Paid' : data.initialDeposit > 0 ? 'Partial' : 'Unpaid'
    const result = await db.feePayment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        totalAmount: data.totalAmount,
        amountPaid: data.initialDeposit,
        status,
        paymentDate: data.initialDeposit > 0 ? new Date() : null
      }
    })
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('DATABASE_ERROR [addFeeAccount]:', error)
    throw new Error('Failed to initialize student fee account')
  }
}

export async function updateClassFee(courseId: string, feeAmount: number) {
  try {
    const result = await db.course.update({
      where: { id: courseId },
      data: { feeAmount }
    })
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('DATABASE_ERROR [updateClassFee]:', error)
    throw new Error('Failed to update class tuition fee')
  }
}
