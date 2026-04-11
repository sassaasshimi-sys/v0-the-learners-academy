'use client'

import { useEffect, useState } from 'react'
import { format, isValid } from 'date-fns'
import { cn } from '@/lib/utils'

interface SafeDateProps {
  date: Date | string | number | null | undefined
  formatStr?: string
  fallback?: string
  className?: string
  priority?: boolean // If true, tries to render earlier but may flicker
}

/**
 * SafeDate: The definitive solution for Hydration Drift in Next.js 14.
 * 
 * Automatically suppresses rendering until the client has mounted,
 * ensuring the server and client are in perfect synchronization.
 * Also handles malformed database strings and nulls gracefully.
 */
export function SafeDate({ 
  date, 
  formatStr = 'MMM d, yyyy', 
  fallback = '—',
  className,
  priority = false
}: SafeDateProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Defensive parsing
  const parsedDate = date ? new Date(date) : null
  const isDateValid = parsedDate && isValid(parsedDate)

  // Hydration Guard: Do not render on the server to prevent drift 'exceptions'
  if (!mounted && !priority) {
    return <span className={cn("opacity-0", className)} aria-hidden="true">{fallback}</span>
  }

  if (!isDateValid) {
    return <span className={cn("text-muted-foreground italic opacity-50", className)}>{fallback}</span>
  }

  try {
    return (
      <span className={cn(className)}>
        {format(parsedDate as Date, formatStr)}
      </span>
    )
  } catch (error) {
    console.error('[SafeDate] Formatting error:', error)
    return <span className={cn("text-muted-foreground", className)}>{fallback}</span>
  }
}
