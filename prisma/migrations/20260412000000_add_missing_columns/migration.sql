-- Safe migration to add missing columns due to schema drift

-- AssessmentTemplate missing columns
ALTER TABLE "AssessmentTemplate" ADD COLUMN IF NOT EXISTS "adminFeedback" TEXT;
ALTER TABLE "AssessmentTemplate" ADD COLUMN IF NOT EXISTS "submittedByTeacherId" TEXT;
ALTER TABLE "AssessmentTemplate" ADD COLUMN IF NOT EXISTS "submittedByTeacherName" TEXT;
ALTER TABLE "AssessmentTemplate" ADD COLUMN IF NOT EXISTS "isAdaptive" BOOLEAN DEFAULT FALSE;
ALTER TABLE "AssessmentTemplate" ADD COLUMN IF NOT EXISTS "courseIds" TEXT[] DEFAULT '{}';

-- TeacherAttendance missing columns
ALTER TABLE "TeacherAttendance" ADD COLUMN IF NOT EXISTS "details" JSONB;
ALTER TABLE "TeacherAttendance" ADD COLUMN IF NOT EXISTS "substituteCount" INTEGER DEFAULT 0;

-- Teacher missing columns
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "requiresReview" BOOLEAN DEFAULT FALSE;

-- Submission missing columns
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "randomizedQuestions" JSONB;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "answers" JSONB;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "aiFeedback" TEXT;
ALTER TABLE "Submission" ADD COLUMN IF NOT EXISTS "aiJustification" TEXT;

-- FeePayment missing columns
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "totalAmount" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "discount" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'Unpaid';
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP(3);
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "FeePayment" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
