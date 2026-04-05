# Backend Architecture

## Prisma Model Relationships
- **Teacher:** Implicitly string-links `subjects[]`. One-to-Many with `Assignment`, `Course`, `TeacherAttendance`.
- **Student:** Heavy implicit string-links `enrolledCourses[]`. One-to-Many with `FeePayment`, `Submission`.
- **Course:** Belongs strictly to `Teacher`. One-to-Many with `FeePayment`, `Assignment`.
- **Assignment/Submission/Questions/Template/Economics:** Operates largely as localized tables tying explicitly only to single IDs (student / teacher).

## Server Action Structure
- Actions act exclusively as Prisma Database ORM wrappers.
- Found strictly inside `/lib/actions/*.ts`.
- File structure separates concerns: `teachers.ts`, `students.ts`, `get-data.ts`.
- Export signature mandates `async function()`.

## Interaction Bridge (Frontend → Backend)
- Direct Next.js action execution over HTTPS RPC bindings.
- Zero traditional `/api/*` REST endpoints are used.

## Current Weak Patterns
- **String Linking Data Drift:** `enrolledCourses String[]` within the Student model means no foreign-key protection exists restricting accidental deletion of a course while students remain registered within it. 
- **JSON Obfuscation:** `markAllocation`, `details`, `answers` heavily rely on `Json?` blobs for rapid prototyping, breaking Prisma type-safety and causing opaque mappings.
- **Data Duplication:** `Submission` carries `assignmentTitle` and `studentName` alongside IDs, meaning changing a student's name in `Student` causes outdated references in past `Submissions` unless handled manually via a master sync action.
