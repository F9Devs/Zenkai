import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 3800

interface WinterIntroProps {
  onFinish: () => void
}

/**
 * Animated Winter Intro sequence shown before the landing page on first visit.
 * Clean, mature 2D anime aesthetic with refined seasonal typography,
 * smooth falling snow atmosphere, and professional studio key art.
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_60%)]"
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl px-4">
        {/* Professional 2D Winter Anime Key Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-3 flex items-center justify-center"
        >
          {/* Subtle Ambient Glow behind character */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-sky-400/20 via-indigo-500/15 to-transparent blur-2xl"
          />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="relative flex items-center justify-center"
          >
            <img
              src="/winter/anime_character.png"
              alt="Winter Anime Key Visual"
              className="h-44 w-44 sm:h-56 sm:w-56 object-contain drop-shadow-[0_12px_32px_rgba(56,189,248,0.35)]"
            />
          </motion.div>
        </motion.div>

        {/* Kanji & Seasonal Tag with Clean Modern Font */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.35em] text-sky-200/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Comfortaa', 'Outfit', sans-serif" }}
        >
          <span>冬の季節</span>
          <span className="text-sky-400">•</span>
          <span>ZENKAI WINTER 2026</span>
          <Sparkles className="size-3 text-sky-300" />
        </motion.div>

        {/* Main Animated Headline in Snowy Font */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-5xl sm:text-7xl font-bold tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "'Mountains of Christmas', 'Sniglet', cursive" }}
        >
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-200 drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
            Winter
          </span>
        </motion.h1>

        {/* Cozy Tagline in Comfortaa */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-2.5 text-sm sm:text-base font-medium text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md leading-relaxed"
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
        >
          The cold nights have arrived. Grab a warm blanket and cozy up with Zenkai.
        </motion.p>

        {/* Bottom Skip Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-7 text-[11px] font-medium tracking-widest text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
        >
          tap or click anywhere to enter
        </motion.p>
      </div>
    </motion.aside>
  )
}
