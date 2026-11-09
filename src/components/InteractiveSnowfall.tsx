import { useEffect, useRef } from 'react'

interface InteractiveSnowfallProps {
  count?: number
  zIndex?: number
  speedMultiplier?: number
}

interface Flake {
  x: number
  y: number
  radius: number
  baseSpeed: number
  swaySpeed: number
  swayAmp: number
  swayPhase: number
  opacity: number
  vx: number
  vy: number
}

/**
 * High-performance Canvas Snowfall with realistic cursor interaction.
 * Snowflakes flutter naturally and scatter / push away smoothly when the cursor moves near them.
 */
export function InteractiveSnowfall({
  count = 85,
  zIndex = 20,
  speedMultiplier = 0.55,
}: InteractiveSnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const resize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)

    // Cursor tracking
    const mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      lastX: -9999,
      lastY: -9999,
      active: false,
    }

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.vx = e.clientX - (mouse.lastX === -9999 ? e.clientX : mouse.lastX)
      mouse.vy = e.clientY - (mouse.lastY === -9999 ? e.clientY : mouse.lastY)
      mouse.lastX = e.clientX
      mouse.lastY = e.clientY
      mouse.active = true
    }

    const onPointerLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.active = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })

    // Generate snowflakes
    const flakes: Flake[] = []
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 3.2,
        baseSpeed: (0.35 + Math.random() * 0.75) * speedMultiplier,
        swaySpeed: 0.001 + Math.random() * 0.002,
        swayAmp: 0.6 + Math.random() * 1.4,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: 0.25 + Math.random() * 0.55,
        vx: 0,
        vy: 0,
      })
    }

    const render = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height)

      // Decay mouse velocity
      mouse.vx *= 0.88
      mouse.vy *= 0.88

      const cursorRadius = 130
      const cursorRadiusSq = cursorRadius * cursorRadius

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]

        // Natural wind sway
        const sway = Math.sin(currentTime * f.swaySpeed + f.swayPhase) * f.swayAmp

        // Cursor interaction (repulsion & wake effect)
        if (mouse.active) {
          const dx = f.x - mouse.x
          const dy = f.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < cursorRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            const force = Math.pow(1 - dist / cursorRadius, 1.4) * 3.8
            f.vx += (dx / dist) * force + mouse.vx * 0.04
            f.vy += (dy / dist) * force + mouse.vy * 0.04
          }
        }

        // Apply velocities with damping
        f.vx *= 0.93
        f.vy *= 0.93

        f.x += sway + f.vx
        f.y += f.baseSpeed + f.vy

        // Wrap around boundaries
        if (f.y > height + 10) {
          f.y = -10
          f.x = Math.random() * width
          f.vx = 0
          f.vy = 0
        } else if (f.y < -20) {
          f.y = height + 5
        }

        if (f.x > width + 15) {
          f.x = -10
        } else if (f.x < -15) {
          f.x = width + 10
        }

        // Draw snowflake with subtle icy glow
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(224, 242, 254, ${f.opacity})`
        ctx.shadowColor = 'rgba(56, 189, 248, 0.45)'
        ctx.shadowBlur = f.radius > 2.5 ? 6 : 2
        ctx.fill()
      }

      // Reset shadow for next frame
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [count, speedMultiplier])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full select-none"
      style={{ zIndex }}
    />
  )
}
