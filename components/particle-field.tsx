'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 80
const MOUSE_RADIUS = 80
const REPULSION_FORCE = 0.04
const SPRING_FACTOR = 0.012
const MIN_SPEED = 0.15
const MAX_SPEED = 0.3

// Brand-aligned colors: 60% primary blue, 25% accent blue, 15% muted
const COLORS = [
  'oklch(0.62 0.17 240)',  // primary blue
  'oklch(0.62 0.17 240)',  // primary blue
  'oklch(0.62 0.17 240)',  // primary blue
  'oklch(0.70 0.14 240)',  // accent blue
  'oklch(0.70 0.14 240)',  // accent blue
  'oklch(0.72 0.04 240)',  // muted neutral
]

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  angle: number
  length: number
  opacity: number
  color: string
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function createParticle(width: number, height: number): Particle {
  const x = randomBetween(0, width)
  const y = randomBetween(0, height)
  const speed = randomBetween(MIN_SPEED, MAX_SPEED)
  const dir = randomBetween(0, Math.PI * 2)
  return {
    x,
    y,
    originX: x,
    originY: y,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    angle: randomBetween(-Math.PI / 3, Math.PI / 3),
    length: randomBetween(6, 9),
    opacity: randomBetween(0.25, 0.45),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    // Seed particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    )

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onResize = () => {
      setSize()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        // --- Mouse repulsion ---
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          p.vx += (dx / dist) * force * REPULSION_FORCE * 6
          p.vy += (dy / dist) * force * REPULSION_FORCE * 6
        }

        // --- Spring return to origin ---
        p.vx += (p.originX - p.x) * SPRING_FACTOR
        p.vy += (p.originY - p.y) * SPRING_FACTOR

        // --- Speed damping ---
        p.vx *= 0.94
        p.vy *= 0.94

        // --- Update position ---
        p.x += p.vx
        p.y += p.vy

        // --- Soft edge bounce for origin drift ---
        if (p.originX < 0) p.originX = canvas.width
        if (p.originX > canvas.width) p.originX = 0
        if (p.originY < 0) p.originY = canvas.height
        if (p.originY > canvas.height) p.originY = 0

        // --- Very slow ambient origin drift ---
        p.originX += Math.cos(Date.now() * 0.00005 + p.angle) * 0.08
        p.originY += Math.sin(Date.now() * 0.00005 + p.angle) * 0.08

        // --- Draw stroke ---
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.beginPath()
        ctx.moveTo(0, -p.length / 2)
        ctx.lineTo(0, p.length / 2)
        ctx.strokeStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.restore()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
