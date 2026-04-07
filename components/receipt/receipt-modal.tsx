'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ReceiptContent } from './receipt-content'
import { Printer, X } from 'lucide-react'

interface ReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
}

const ADDRESS = "Tanzeem School, Suzuki Stop, Sar-e-Khartar, Mominabad, Alamdar Road Quetta, Pakistan"

export function ReceiptModal({ open, onOpenChange, student, course }: ReceiptModalProps) {
  const receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`

  const handlePrint = () => {
    // Print logic
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 border-none bg-accent/5 backdrop-blur-xl max-h-[90vh] overflow-y-auto print:max-h-full print:overflow-visible print:bg-white print:p-0">
        <DialogHeader className="p-6 pb-2 print:hidden">
          <DialogTitle className="font-serif text-2xl font-medium tracking-tight">Receipt Preview</DialogTitle>
          <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Dual-Copy Thermal Format</p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-8 p-6 print:p-0 print:block">
          {/* Action Buttons */}
          <div className="flex gap-4 w-full print:hidden">
            <Button 
                onClick={handlePrint} 
                className="flex-1 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 h-12 font-normal"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="h-12 w-12 rounded-xl border border-black/5"
            >
                <X className="w-4 h-4 opacity-40" />
            </Button>
          </div>

          {/* Printable Area */}
          <div id="thermal-receipt-printable" className="bg-white shadow-xl p-2 print:shadow-none print:p-0">
            {/* Office Copy */}
            <ReceiptContent 
              student={student} 
              course={course} 
              type="OFFICE COPY" 
              receiptId={receiptId}
              address={ADDRESS}
            />

            {/* Tear Line */}
            <div className="w-[72mm] border-t-2 border-black border-dashed my-6 print:my-8 relative">
                <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[8px] font-bold text-black opacity-30 print:hidden uppercase tracking-widest">Tear Here</span>
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
        </div>
      </DialogContent>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt-printable, #thermal-receipt-printable * {
            visibility: visible;
          }
          #thermal-receipt-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 72mm;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            size: 72mm auto;
            margin: 0;
          }
        }
      `}</style>
    </Dialog>
  )
}
