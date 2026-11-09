import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Snowflake, Sparkles, Tv, Coffee, BookOpen, Film } from 'lucide-react'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 3600

const INFO_PILLS = [
  { icon: Tv, label: 'Winter Anime in 4K' },
  { icon: Coffee, label: 'Cozy Manga Reader' },
  { icon: BookOpen, label: 'Fireside Novels' },
  { icon: Film, label: 'Cinema & Series' },
]

interface WinterIntroProps {
  onFinish: () => void
}

/**
 * Animated Winter Intro sequence shown before the landing page on first visit.
 * Clean, transparent design without heavy dark boxes, displaying animated
 * seasonal typography, rotating snowflake, and frosted feature highlights.
 */
export function WinterIntro({ onFinish }: WinterIntroProps) {
  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    onFinish()
  }, [onFinish])

  // Auto-transition to landing page after sequence completes
  useEffect(() => {
    const timer = window.setTimeout(finish, INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [finish])

  // Allow instant skip on any key, scroll, or tap
  useEffect(() => {
    const onKey = () => finish()
    const onScroll = () => finish()
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchmove', onScroll)
    }
  }, [finish])

  return (
    <motion.aside
      key="winter-intro-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(10px)',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      onClick={finish}
      className="relative z-10 flex min-h-svh w-full cursor-pointer flex-col items-center justify-center p-4 sm:p-6 text-center select-none"
      aria-label="Winter intro animation. Tap anywhere to enter."
    >
      {/* Soft Ambient Ice Radial Sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.14)_0%,transparent_60%)]"
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        {/* Rotating Crystalline Snowflake with glowing aura */}
        <motion.div
          initial={{ scale: 0.4, rotate: -60, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-3 flex items-center justify-center"
        >
          {/* Outer pulsing ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.9, 1.4, 1.6], opacity: [0.6, 0.2, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute size-24 rounded-full border border-sky-400/40"
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            className="flex items-center justify-center"
          >
            <Snowflake className="size-12 sm:size-14 text-sky-300 drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
          </motion.div>
          <Sparkles className="absolute -right-2 -top-1 size-4 text-sky-200 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </motion.div>

        {/* Kanji & Seasonal Tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.35em] text-sky-200/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          <span>冬の季節</span>
          <span className="text-sky-400">•</span>
          <span>WINTER 2026</span>
        </motion.div>

        {/* Main Animated Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 font-display text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
        >
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-200 drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
            Winter
          </span>
        </motion.h1>

        {/* Seasonal Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-2 text-sm sm:text-base font-medium text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md"
        >
          The cold nights have arrived. Grab a warm blanket and cozy up with Zenkai.
        </motion.p>

        {/* Animated Info Pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
        >
          {INFO_PILLS.map((pill, i) => {
            const Icon = pill.icon
            return (
              <motion.div
                key={pill.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.75 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/30 bg-sky-950/20 px-3.5 py-1.5 text-xs font-semibold text-sky-100 shadow-[0_0_16px_rgba(56,189,248,0.2)] backdrop-blur-sm"
              >
                <Icon className="size-3.5 text-sky-300" />
                <span>{pill.label}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Skip Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-7 text-[11px] font-medium tracking-widest text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          tap or click anywhere to enter
        </motion.p>
      </div>
    </motion.aside>
  )
}
