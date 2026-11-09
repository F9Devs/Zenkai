import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'zenkai_winter_intro_2026'
const INTRO_DURATION_MS = 4800

const FULL_TITLE = 'Welcome to Winter'
const FULL_TAGLINE = 'The cold nights have arrived. Grab a warm blanket and cozy up with Zenkai.'

interface WinterIntroProps {
  onFinish: () => void
}

/**
 * Animated Winter Intro sequence shown before the landing page on first visit.
 * Features a joyful 2D female anime key visual, typewriter writing text effects,
 * snowy cursive font, and clean seasonal atmosphere.
 */
export function WinterIntro({ onFinish }: WinterIntroProps) {
  const [titleChars, setTitleChars] = useState(0)
  const [taglineChars, setTaglineChars] = useState(0)
  const [taglineStarted, setTaglineStarted] = useState(false)

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    onFinish()
  }, [onFinish])

  // Typewriter effect for Title ("Welcome to Winter")
  useEffect(() => {
    const startDelay = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        setTitleChars((prev) => {
          if (prev >= FULL_TITLE.length) {
            window.clearInterval(interval)
            setTaglineStarted(true)
            return prev
          }
          return prev + 1
        })
      }, 45)
      return () => window.clearInterval(interval)
    }, 280)

    return () => window.clearTimeout(startDelay)
  }, [])

  // Typewriter effect for Tagline
  useEffect(() => {
    if (!taglineStarted) return
    const pauseBeforeTagline = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        setTaglineChars((prev) => {
          if (prev >= FULL_TAGLINE.length) {
            window.clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 24)
      return () => window.clearInterval(interval)
    }, 180)

    return () => window.clearTimeout(pauseBeforeTagline)
  }, [taglineStarted])

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

  const typedTitle = FULL_TITLE.slice(0, titleChars)
  const titlePart1 = typedTitle.slice(0, 11) // "Welcome to "
  const titlePart2 = typedTitle.slice(11)     // "Winter"

  const typedTagline = FULL_TAGLINE.slice(0, taglineChars)
  const isTaglineComplete = taglineChars >= FULL_TAGLINE.length

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

        {/* Kanji & Seasonal Tag without any starry icon */}
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
        </motion.div>

        {/* Main Animated Headline in Snowy Font with Typewriter Writing Effect */}
        <h1
          className="mt-3 text-5xl sm:text-7xl font-bold tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] min-h-[1.25em]"
          style={{ fontFamily: "'Mountains of Christmas', 'Sniglet', cursive" }}
        >
          {titlePart1}
          {titlePart2 && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-indigo-200 drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
              {titlePart2}
            </span>
          )}
          {!taglineStarted && (
            <span className="inline-block w-[3px] h-[0.75em] bg-sky-300 ml-1.5 align-middle animate-pulse" />
          )}
        </h1>

        {/* Cozy Tagline in Comfortaa with Typewriter Writing Effect */}
        <p
          className="mt-2.5 text-sm sm:text-base font-medium text-slate-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-md leading-relaxed min-h-[2.8rem]"
          style={{ fontFamily: "'Comfortaa', sans-serif" }}
        >
          {typedTagline}
          {taglineStarted && !isTaglineComplete && (
            <span className="inline-block w-[2px] h-[0.9em] bg-sky-300 ml-1 align-middle animate-pulse" />
          )}
        </p>

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
