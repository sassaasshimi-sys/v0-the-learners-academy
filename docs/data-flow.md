# Data Flow

## DataProvider Responsibilities
- Serve as the SINGLE application-wide data store.
- Distribute data to all portals (Admin, Teacher, Student) using React Context.
- Abstract all Server Action mutations behind standard execution wrappers (`executeAction()`).
- Handle global error degradation (`hasError` screen).

## `getInitialData` Lifecycle
1. Triggered on initialization and via `refresh()`.
2. Fires 8-9 concurrent, unpaginated Prisma database requests.
3. Resolves raw database aggregates directly into standard mapped structs.
4. If failures occur, silent fallback to `[]` guarantees partial rendering, but constitutes data loss risk on mutation.

## `refresh()` Lifecycle
1. Dispatches `getInitialData()`.
2. Parses dates recursively (`Date` → ISO String) to ensure strictly serializable objects.
3. Pushes fresh references into React `useState`, triggering global re-renders down the tree.

## Server Action → UI Flow
1. **Component Trigger:** User clicks "Delete Student".
2. **Context Method:** Component calls `const { removeStudent } = useData()`.
3. **Execution Wrapper:** `executeAction(dbRemoveStudent(id), "Success")` initiates.
4. **Server Action:** Next.js pushes execution back to the server (`lib/actions/*.ts`). Prisma manipulates the database. 
5. **Full Refresh:** Context forces `refresh()`, pulling back the entirely updated DB snapshot.
6. **UI Render:** The component re-renders with the item deleted.

## Step-by-Step Complete Pipeline Flow
```
[User Action in Dashboard Component]
        ↓
[React Context Mutation Call in `data-context.tsx`]
        ↓
[Server Action execution in `lib/actions/*`]
        ↓
[Prisma / PostgreSQL Mutation]
        ↓
[React Context `refresh()` invoked by `executeAction`]
        ↓
[`getInitialData()` Server Action executed]
        ↓
[Prisma / PostgreSQL fetches full snapshot]
        ↓
[React Context State Updated (`setTeachers`, `setStudents`)]
        ↓
[UI Re-renders globally]
```

---
CONSTRAINTS:
1. No arbitrary partial DB revalidation. `refresh()` always pulls full aggregate states.
2. Server Actions MUST respond with a rigid status object format `{ success: boolean, error?: string }` matching the `executeAction` expectation.
3. Direct Prisma manipulation inside `.tsx` UI files is strictly prohibited.
