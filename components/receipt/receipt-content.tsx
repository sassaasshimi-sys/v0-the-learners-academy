'use client'

import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ReceiptContentProps {
  student: {
    name: string
    guardianName?: string
    studentId?: string
    classTiming?: string
  }
  course: {
    title: string
    roomNumber?: string
  }
  type: 'OFFICE COPY' | 'STUDENT COPY'
  receiptId: string
  address: string
}

export function ReceiptContent({ 
  student, 
  course, 
  type, 
  receiptId,
  address 
}: ReceiptContentProps) {
  const now = new Date()
  const dateStr = format(now, 'dd-MMM-yyyy')
  const timeStr = format(now, 'hh:mm:ss a')

  return (
    <div className="w-[72mm] bg-white p-4 text-black text-[11px] leading-tight font-mono selection:bg-transparent print:p-0">
      {/* Header */}
      <div className="text-center space-y-1 mb-4 border-b border-black border-dashed pb-3">
        <h1 className="text-sm font-bold uppercase tracking-tight">The Learners Academy</h1>
        <p className="text-[9px] font-normal leading-none opacity-80">{address}</p>
        <div className="mt-2 text-[10px] bg-black text-white py-1 px-2 inline-block font-bold">
          {type}
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Receipt ID:</span>
          <span className="font-bold">{receiptId}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-1 border-t border-black border-dashed pt-3 mb-4">
        <div className="uppercase font-bold mb-1 underline text-[9px]">Student Dossier</div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] opacity-60">Candidate Name:</span>
          <span className="text-[12px] font-bold uppercase">{student.name}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span>Guardian:</span>
          <span className="font-medium">{student.guardianName || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Student ID:</span>
          <span className="font-medium">{student.studentId || 'GEN-ST'}</span>
        </div>
      </div>

      {/* Academic Details */}
      <div className="space-y-1 border-t border-black border-dashed pt-3 mb-4">
        <div className="uppercase font-bold mb-1 underline text-[9px]">Academic Stats</div>
        <div className="flex justify-between">
          <span>Batch Level:</span>
          <span className="font-medium">{course.title}</span>
        </div>
        <div className="flex justify-between">
          <span>Session Timing:</span>
          <span className="font-medium">{student.classTiming || 'TBC'}</span>
        </div>
        <div className="flex justify-between">
          <span>Room Number:</span>
          <span className="font-medium">{course.roomNumber || 'TBC'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-black border-dashed space-y-2">
        <div className="h-10 border border-black/20 flex items-end justify-center pb-1 text-[8px] italic">
          Authorized Signature
        </div>
        <p className="text-[9px] font-bold">Thank you for choosing The Learners Academy</p>
        <p className="text-[8px] opacity-50 italic uppercase leading-none pb-2">Computer Generated Receipt</p>
      </div>
    </div>
  )
}
