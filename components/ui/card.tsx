import * as React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { STIFF_SPRING } from '@/lib/premium-motion'

import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<'div'> {
  isHoverable?: boolean
}

function Card({ className, isHoverable = false, ...props }: CardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const Comp = (isHoverable ? motion.div : 'div') as any
  const hoverProps = isHoverable 
    ? {
        whileHover: { y: -5, scale: 1.01 },
        transition: STIFF_SPRING
      }
    : {}

  return (
    <Comp
      ref={cardRef}
      data-slot="card"
      onMouseMove={handleMouseMove}
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-premium transition-all duration-300 relative group overflow-hidden',
        isHoverable && 'hover:shadow-premium-lg cursor-pointer',
        className,
      )}
      {...props as any}
      {...hoverProps}
    >
      {/* Dynamic Backlight */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(var(--primary) / 0.05), transparent 40%)`,
        }}
      />
      {props.children}
    </Comp>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-serif font-normal', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
