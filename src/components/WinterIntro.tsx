import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 4200

const TITLE_PART1 = 'Welcome to '
const TITLE_PART2 = 'Winter'
const TAGLINE_WORDS = 'The cold nights have arrived. Grab a warm blanket and cozy up with Zenkai.'.split(' ')

interface WinterIntroProps {
  onFinish: () => void
}

/**
 * Animated Winter Intro sequence shown before the landing page on first visit.
 * Features a joyful 2D female anime key visual, ultra-smooth fluid writing
 * text animations with soft blur transitions, and snowy cursive typography.
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
        {/* Joyful 2D Winter Anime Key Visual */}
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
              alt="Happy Winter Anime Visual"
              className="h-48 w-auto max-w-[14rem] sm:h-60 sm:max-w-[17rem] object-contain drop-shadow-[0_12px_32px_rgba(56,189,248,0.35)]"
            />
          </motion.div>
        </motion.div>

        {/* Kanji & Seasonal Tag without starry icon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-2 text-xs font-bold tracking-[0.35em] text-sky-200/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Comfortaa', 'Outfit', sans-serif" }}
        >
          <span>冬の季節</span>
          <span className="text-sky-400">•</span>
          <span>ZENKAI WINTER 2026</span>
        </motion.div>

        {/* Main Headline with Ultra-Smooth Fluid Writing Animation */}
        <h1
          className="mt-3 text-5xl sm:text-7xl font-bold tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "'Mountains of Christmas', 'Sniglet', cursive" }}
        >
          {/* "Welcome to " staggered smooth characters */}
          {TITLE_PART1.split('').map((char, i) => (
            <motion.span
              key={`p1-${i}`}
              initial={{ opacity: 0, y: 6, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.28 + i * 0.035,
              }}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}

          {/* "Winter" glowing gradient characters */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-200 drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
            {TITLE_PART2.split('').map((char, i) => (
              <motion.span
                key={`p2-${i}`}
                initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.28 + (TITLE_PART1.length + i) * 0.038,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Cozy Tagline with Ultra-Smooth Word-by-Word Fluid Reveal (no cursor line) */}
        <p
          className="mt-2.5 text-sm sm:text-base font-medium text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md leading-relaxed"
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <motion.span
              key={`w-${i}`}
              initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.95 + i * 0.052,
              }}
              className="inline-block mr-[0.28em]"
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Bottom Skip Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-7 text-[11px] font-medium tracking-widest text-slate-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
        >
          tap or click anywhere to enter
        </motion.p>
      </div>
    </motion.aside>
  )
}
