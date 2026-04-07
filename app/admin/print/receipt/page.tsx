'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useData } from '@/contexts/data-context'
import { ReceiptContent } from '@/components/receipt/receipt-content'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'

const ADDRESS = "Tanzeem School, Suzuki Stop, Sar-e-Khartar, Mominabad, Alamdar Road Quetta, Pakistan"

export default function ReceiptPrintPage() {
  const searchParams = useSearchParams()
  const { students, courses, isInitialized } = useData()
  const [hasPrinted, setHasPrinted] = useState(false)

  const studentId = searchParams?.get('studentId')
  const courseId = searchParams?.get('courseId')

  const student = useMemo(() => students?.find(s => s.id === studentId), [students, studentId])
  const course = useMemo(() => courses?.find(c => c.id === courseId), [courses, courseId])

  const receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`

  useEffect(() => {
    if (isInitialized && student && course && !hasPrinted) {
      const timer = setTimeout(() => {
        window.print()
        setHasPrinted(true)
      }, 800) // Allow extra time for any remaining layout stabilization
      return () => clearTimeout(timer)
    }
  }, [isInitialized, student, course, hasPrinted])

  if (!isInitialized) return <DashboardSkeleton />
  if (!student || !course) return (
    <div className="flex items-center justify-center h-screen font-serif text-muted-foreground opacity-30 text-xs italic">
       Incomplete Archive Data. System halted.
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col items-start p-0">
      <div id="thermal-receipt-container" className="mx-auto bg-white">
        {/* Office Copy */}
        <ReceiptContent 
          student={student} 
          course={course} 
          type="OFFICE COPY" 
          receiptId={receiptId}
          address={ADDRESS}
        />

        {/* Tear Line for Thermal Roll */}
        <div className="w-[72mm] border-t-2 border-black border-dashed my-8 relative">
           <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[8px] font-bold text-black opacity-30 print:hidden">Tear Here</span>
        </div>

        {/* Student Copy */}
        <ReceiptContent 
          student={student} 
          course={course} 
          type="STUDENT COPY" 
          receiptId={receiptId}
          address={ADDRESS}
        />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: 72mm auto;
            margin: 0;
          }
          body {
            background-color: white;
            margin: 0;
            padding: 0;
          }
           #thermal-receipt-container {
            margin: 0 !important;
            padding: 0 !important;
           }
        }
      `}</style>
    </div>
  )
}
