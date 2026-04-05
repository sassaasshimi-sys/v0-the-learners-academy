# Assessment Engine

## Question Structure
- Questions are generic building blocks mapped to a specific `phase` and `category`.
- Must hold JSON-compatible options/match pairs when dealing with non-standard inputs.
- Standalone nature; never permanently tied to a single Assessment Template.

## Assessment Template Structure
- High-level orchestrator holding constraints: `phase`, `questionCount`, `nature`, `durationMinutes`, and `totalMarks`.
- Relies heavily on JSON blobs for specific constraints: `markAllocation`.
- Contains un-normalized metadata copies (`submittedByTeacherName`) meant strictly for UI speed, avoiding deeper SQL joins.

## Test Generation Flow
1. User activates test portal session.
2. Filter global `questions` DB against Template `phase`.
3. Feed resulting block array + deterministic seed into PRNG shuffle algorithm.
4. Engine slices shuffled array to match exact `questionCount`.
5. Outputs flat array of normalized Question objects into UI state.

## Randomization Rules
- **Algorithm:** Linear Congruential Generator (LCG) or Mulberry32 implemented client-side.
- **Seed Constructor:** Combination of Template Identifier + Student Identifier.

## Submission Flow
1. Timer elapsed or manual exit.
2. Current UI Test State serialized.
3. Submits `StudentTest` artifact via mutation wrapper.
4. Backend `dbSubmitTestResult` permanently hard-encodes the arrays: `randomizedQuestions` and `answers` into a `Json` blob.
5. Ties to `studentId` permanently regardless of future mutations.

---
HOW SEEDS MUST BE CONSTRUCTED:
`const testSeed = Number(student.id.replace(/\D/g, '').slice(-5)) + Number(template.id.replace(/\D/g, '').slice(-5));`

WHEN RANDOMIZATION IS ALLOWED TO RUN:
Randomization MUST run exactly ONCE per unique test session initialization (during React Component mount). Must NEVER run inside a standard render cycle.

REQUIRED INPUTS:
- `studentId` MUST be stable. Fallback to `Date.now()` causes fatal regeneration drift upon re-render.
