'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useHasMounted } from '@/hooks/use-has-mounted'

interface ClientDateProps {
  date: Date | string | number | null | undefined
  formatString?: string
  fallback?: string
  className?: string
  suppressHydrationWarning?: boolean
}

export function ClientDate({ 
  date, 
  formatString = 'PPP', 
  fallback = '', 
  className,
  suppressHydrationWarning = true
}: ClientDateProps) {
  const hasMounted = useHasMounted()
  
  if (!hasMounted) {
    return <span className={className} suppressHydrationWarning={suppressHydrationWarning}>{fallback}</span>
  }

  if (!date) {
    return <span className={className} suppressHydrationWarning={suppressHydrationWarning}>{fallback}</span>
  }

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return <span className={className} suppressHydrationWarning={suppressHydrationWarning}>{fallback}</span>
    }

    return (
      <span className={className} suppressHydrationWarning={suppressHydrationWarning}>
        {format(dateObj, formatString)}
      </span>
    )
  } catch (error) {
    console.error('[ClientDate] Formatting error:', error)
    return <span className={className} suppressHydrationWarning={suppressHydrationWarning}>{fallback}</span>
  }
}
