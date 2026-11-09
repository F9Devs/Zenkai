import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Snowflake, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 2500

/**
 * High-end cinematic Winter Intro Animation for first-time visitors.
 * Plays a smooth, atmospheric winter reveal sequence on landing, then
 * seamlessly dissolves to reveal the landing page.
 * Can be skipped immediately with a click, tap, or keypress.
 */
export function WinterIntro() {
  const [active, setActive] = useState(false)

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    setActive(false)
  }, [])

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY)
      if (!seen) {
        setActive(true)
      }
    } catch {
      setActive(true)
    }
  }, [])

  // Allow manual replay via custom event
  useEffect(() => {
    const handleReplay = () => setActive(true)
    window.addEventListener('zenkai:replay-winter-intro', handleReplay)
    return () => window.removeEventListener('zenkai:replay-winter-intro', handleReplay)
  }, [])

  // Auto-dismiss after sequence finishes
  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(finish, INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [active, finish])

  // Lock body scroll and allow instant skip on any keypress
  useEffect(() => {
    if (!active) return
    const onKey = () => finish()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [active, finish])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="winter-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: 'blur(14px)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={finish}
          className="fixed inset-0 z-[200] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#030712] select-none"
          aria-label="Winter intro animation. Click to skip."
        >
          {/* Deep Winter Aurora / Ambient Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22)_0%,rgba(99,102,241,0.12)_35%,rgba(3,7,18,0.95)_75%)]"
          />

          {/* Frosted Shimmer Sweep */}
          <motion.div
            aria-hidden
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.45, 0] }}
            transition={{ duration: 1.8, delay: 0.4, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent"
          />

          {/* Central Animated Composition */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Expanding Frost Halo Rings */}
            <div className="relative mb-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.8, 1.35, 1.55], opacity: [0.6, 0.25, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute size-28 rounded-full border border-sky-400/40"
              />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.6, 1.15, 1.3], opacity: [0.7, 0.35, 0] }}
                transition={{ duration: 2, delay: 0.35, repeat: Infinity, ease: 'easeOut' }}
                className="absolute size-24 rounded-full border border-cyan-300/30"
              />

              {/* Glowing Snowflake Emblem */}
              <motion.div
                initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex size-16 items-center justify-center rounded-2xl border border-sky-400/40 bg-gradient-to-b from-sky-400/20 to-indigo-950/60 shadow-[0_0_36px_rgba(56,189,248,0.45)] backdrop-blur-md"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                  className="flex items-center justify-center"
                >
                  <Snowflake className="size-8 text-sky-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                </motion.div>
                <Sparkles className="absolute -right-1 -top-1 size-3.5 text-sky-300 animate-pulse" />
              </motion.div>
            </div>

            {/* Kanji Accent */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xs font-medium tracking-[0.5em] text-sky-300/70"
            >
              冬 · WINTER 2026
            </motion.span>

            {/* Main Brand Title with Icy Gradient & Glow */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-sky-100 via-sky-200 to-indigo-200 drop-shadow-[0_0_28px_rgba(56,189,248,0.35)]"
            >
              ZENKAI
            </motion.h1>

            {/* Elegant Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-sky-400/60" />
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-sky-200/90 uppercase">
                Welcome to Winter
              </p>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-sky-400/60" />
            </motion.div>

            {/* Atmospheric Season Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-2 max-w-xs text-xs text-slate-300 sm:text-[13px]"
            >
              Cozy up with stories, manga &amp; anime.
            </motion.p>
          </div>

          {/* Bottom Skip Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="absolute bottom-6 flex items-center gap-1.5 text-[11px] font-medium tracking-widest text-slate-400 uppercase"
          >
            <span>tap or press any key to enter</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
