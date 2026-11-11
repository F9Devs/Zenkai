import { useEffect, useState } from 'react'

export interface CompanionInfo {
  installed: boolean
  version?: string
  capabilities?: string[]
}

export function isCompanionActive(): boolean {
  if (typeof window === 'undefined') return false
  return (
    document.documentElement.dataset.zenkaiCompanion === 'true' ||
    Boolean((window as any).__ZENKAI_COMPANION__?.active)
  )
}

export function useCompanion(): CompanionInfo {
  const [info, setInfo] = useState<CompanionInfo>(() => {
    const active = isCompanionActive()
    const meta = typeof window !== 'undefined' ? (window as any).__ZENKAI_COMPANION__ : undefined
    return {
      installed: active,
      version: meta?.version || (typeof document !== 'undefined' ? document.documentElement.dataset.zenkaiCompanionVersion : undefined),
      capabilities: meta?.capabilities,
    }
  })

  useEffect(() => {
    const onReady = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      setInfo({
        installed: true,
        version: detail?.version || '1.0.0',
        capabilities: detail?.capabilities,
      })
    }

    window.addEventListener('zenkai:companion-ready', onReady)
    window.addEventListener('zenkai:companion-pong', onReady)

    // Probe extension
    window.dispatchEvent(new CustomEvent('zenkai:ping-companion'))

    // Fast interval check for late injection
    const t = window.setInterval(() => {
      if (isCompanionActive() && !info.installed) {
        setInfo({
          installed: true,
          version: (window as any).__ZENKAI_COMPANION__?.version || '1.0.0',
          capabilities: (window as any).__ZENKAI_COMPANION__?.capabilities,
        })
      }
    }, 1000)

    return () => {
      window.removeEventListener('zenkai:companion-ready', onReady)
      window.removeEventListener('zenkai:companion-pong', onReady)
      window.clearInterval(t)
    }
  }, [info.installed])

  return info
}
