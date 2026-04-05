# Project Rules

These rules represent definitive architectural constraints. Any violation of these constraints introduces direct operational instability to the platform.

1. **NEVER use `Array.sort(() => Math.random() - 0.5)` for randomization.**
   - All tests/assessments MUST utilize a seeded PRNG output to guarantee component re-render stability and prevent infinite UI loops or mismatched answer checks.

2. **NEVER silently swallow backend errors.**
   - Server Action wrappers must propagate standard `{ success: false, error: 'message' }` structures. `catch(e) { return [] }` masks catastrophic database collapse and replaces expected data with empty sets, triggering false data cascades.

3. **ALWAYS guard `isInitialized` before rendering UI data loops.**
   - Before executing any `.map()` over Context structures (`teachers`, `students`), the global state boolean `isInitialized` must be verified. Iterating over hydrating DB arrays causes hydration exceptions.

4. **NEVER rely on string-based relationships.**
   - Future schema updates must deprecate string-array relations (e.g. `enrolledCourses String[]`). Use formalized Prisma Many-to-Many Junction tables (`CourseEnrollment` model definition) strictly.

5. **ALWAYS validate identity before critical operations.**
   - Even if the UI protects a route via `useEffect`, any destructive Server Action MUST verify the authenticated session validity on the server block before running the Prisma mutation.

6. **ALWAYS import everything used in JSX.**
   - Maintain strict linter adherence. Ghost components cause fatal build errors in Next 15 App router architecture.
