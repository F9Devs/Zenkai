import { useEffect, useRef } from 'react'

interface InteractiveSnowfallProps {
  count?: number
  zIndex?: number
  speedMultiplier?: number
}

type LayerType = 'far' | 'mid' | 'close'

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
  layer: LayerType
  parallaxFactor: number
}

/**
 * 3-Layer Parallax Snowfall Engine with Depth of Field & Soft Cursor Physics.
 * - Layer 'far': Tiny, slow, distant background snowflakes.
 * - Layer 'mid': Crisp, natural midground snowflakes.
 * - Layer 'close': Large, soft blurred bokeh foreground snowflakes drifting close to the camera.
 * - Cursor Interaction: Gentle, floating air-current repulsion (smooth & peaceful, not fast or jarring).
 */
export function InteractiveSnowfall({
  count = 90,
  zIndex = 20,
  speedMultiplier = 0.5,
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

    // Cursor tracking with smoothed parallax
    const mouse = {
      x: -9999,
      y: -9999,
      normalizedX: 0,
      normalizedY: 0,
      targetNormX: 0,
      targetNormY: 0,
      active: false,
    }

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.targetNormX = (e.clientX - width / 2) / (width / 2)
      mouse.targetNormY = (e.clientY - height / 2) / (height / 2)
      mouse.active = true
    }

    const onPointerLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.targetNormX = 0
      mouse.targetNormY = 0
      mouse.active = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })

    // Generate 3 layers of flakes (Far: 40%, Mid: 40%, Close: 20%)
    const flakes: Flake[] = []
    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let layer: LayerType = 'mid'
      let radius = 2.8
      let baseSpeed = 0.65
      let opacity = 0.6
      let parallaxFactor = 15

      if (rand < 0.45) {
        // Far layer: distant, small, slow
        layer = 'far'
        radius = 1.0 + Math.random() * 1.4
        baseSpeed = (0.22 + Math.random() * 0.35) * speedMultiplier
        opacity = 0.18 + Math.random() * 0.25
        parallaxFactor = 8
      } else if (rand < 0.82) {
        // Mid layer: standard crisp snowflakes
        layer = 'mid'
        radius = 2.4 + Math.random() * 1.8
        baseSpeed = (0.45 + Math.random() * 0.55) * speedMultiplier
        opacity = 0.45 + Math.random() * 0.3
        parallaxFactor = 22
      } else {
        // Close layer: foreground, large, soft bokeh depth of field
        layer = 'close'
        radius = 5.5 + Math.random() * 4.5
        baseSpeed = (0.85 + Math.random() * 0.85) * speedMultiplier
        opacity = 0.2 + Math.random() * 0.35
        parallaxFactor = 45
      }

      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseSpeed,
        swaySpeed: 0.0008 + Math.random() * 0.0016,
        swayAmp: 0.4 + Math.random() * 1.2,
        swayPhase: Math.random() * Math.PI * 2,
        opacity,
        vx: 0,
        vy: 0,
        layer,
        parallaxFactor,
      })
    }

    const render = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height)

      // Smooth lerp for mouse parallax
      mouse.normalizedX += (mouse.targetNormX - mouse.normalizedX) * 0.04
      mouse.normalizedY += (mouse.targetNormY - mouse.normalizedY) * 0.04

      const cursorInfluenceRadius = 110
      const cursorRadiusSq = cursorInfluenceRadius * cursorInfluenceRadius

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]

        // Natural horizontal wind drift and sway
        const sway = Math.sin(currentTime * f.swaySpeed + f.swayPhase) * f.swayAmp
        const windDrift = 0.15

        // Gentle, fluid cursor repulsion (soft air breeze, never fast or violent)
        if (mouse.active) {
          const dx = f.x - mouse.x
          const dy = f.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < cursorRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            // Soft quadratic ease with gentle max impulse of 0.55
            const force = Math.pow(1 - dist / cursorInfluenceRadius, 2) * 0.55
            f.vx += (dx / dist) * force
            f.vy += (dy / dist) * force * 0.6
          }
        }

        // Smooth damping
        f.vx *= 0.955
        f.vy *= 0.955

        // Position update
        f.x += sway + windDrift + f.vx
        f.y += f.baseSpeed + f.vy

        // Wrap around boundaries
        if (f.y > height + 20) {
          f.y = -20
          f.x = Math.random() * width
          f.vx = 0
          f.vy = 0
        } else if (f.y < -30) {
          f.y = height + 10
        }

        if (f.x > width + 25) {
          f.x = -20
        } else if (f.x < -25) {
          f.x = width + 20
        }

        // Apply layer parallax offset based on cursor position
        const drawX = f.x - mouse.normalizedX * f.parallaxFactor
        const drawY = f.y - mouse.normalizedY * (f.parallaxFactor * 0.4)

        // Draw snowflake based on layer depth of field
        ctx.beginPath()
        ctx.arc(drawX, drawY, f.radius, 0, Math.PI * 2)

        if (f.layer === 'close') {
          // Foreground: soft blurred bokeh snowflake
          ctx.fillStyle = `rgba(224, 242, 254, ${f.opacity})`
          ctx.shadowColor = 'rgba(186, 230, 253, 0.7)'
          ctx.shadowBlur = 14
        } else if (f.layer === 'mid') {
          // Midground: crisp snowflake with slight glow
          ctx.fillStyle = `rgba(240, 249, 255, ${f.opacity})`
          ctx.shadowColor = 'rgba(56, 189, 248, 0.4)'
          ctx.shadowBlur = 4
        } else {
          // Background: subtle distant snowflake
          ctx.fillStyle = `rgba(203, 213, 225, ${f.opacity})`
          ctx.shadowBlur = 0
        }

        ctx.fill()
      }

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
