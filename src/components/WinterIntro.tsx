import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Snowflake, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 3800

interface WinterIntroProps {
  onFinish: () => void
}

/**
 * Animated Winter Intro sequence shown before the landing page on first visit.
 * Features cozy snowy typography (Mountains of Christmas & Comfortaa),
 * along with cute winter mascot characters generated with Google's Nano Banana model.
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16)_0%,transparent_60%)]"
      />

      <div className="relative z-10 flex flex-col items-center max-w-2xl px-4">
        {/* Cute Characters and Central Snowflake Emblem */}
        <div className="flex items-end justify-center gap-3 sm:gap-6 mb-2">
          {/* Adorable Snowman */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.img
              src="/winter/snowman.png"
              alt="Cute Snowman"
              animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_25px_rgba(56,189,248,0.4)]"
            />
          </motion.div>

          {/* Central Rotating Snowflake & Season Pill */}
          <div className="flex flex-col items-center px-1">
            <motion.div
              initial={{ scale: 0.4, rotate: -60, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-2 flex items-center justify-center"
            >
              {/* Outer pulsing ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.9, 1.4, 1.6], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute size-20 sm:size-24 rounded-full border border-sky-400/40"
              />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="flex items-center justify-center"
              >
                <Snowflake className="size-10 sm:size-12 text-sky-300 drop-shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
              </motion.div>
              <Sparkles className="absolute -right-1 -top-1 size-4 text-sky-200 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            </motion.div>

            {/* Kanji & Seasonal Tag with Cozy Rounded Font */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-sky-200/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Comfortaa', 'Fredoka', sans-serif" }}
            >
              <span>冬の季節</span>
              <span className="text-sky-400">•</span>
              <span>WINTER 2026</span>
            </motion.div>
          </div>

          {/* Cute Winter Mascot Bunny */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.img
              src="/winter/mascot.png"
              alt="Cute Winter Mascot"
              animate={{ y: [0, -8, 0], rotate: [3, -3, 3] }}
              transition={{ repeat: Infinity, duration: 3.1, delay: 0.3, ease: 'easeInOut' }}
              className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_10px_25px_rgba(167,139,250,0.4)]"
            />
          </motion.div>
        </div>

        {/* Main Animated Headline with Snowy Font (Mountains of Christmas) */}
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

        {/* Cozy Tagline in Comfortaa / Fredoka */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
          className="mt-3 text-sm sm:text-base font-semibold text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md leading-relaxed"
          style={{ fontFamily: "'Comfortaa', 'Fredoka', sans-serif" }}
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
