import { useEffect } from 'react'

const DEFAULT_KEY = 'phc_qgiAarw4Co4pw9fz3Fxj4UJaHmqzFetqs4JrXhGc35Nd'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY ?? DEFAULT_KEY
  const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

  useEffect(() => {
    let cancelled = false
    let idleHandle: number | undefined
    let timeoutHandle: number | undefined

    const loadAnalytics = () => {
      void import('posthog-js').then(({ default: posthog }) => {
        if (cancelled) return

        posthog.init(apiKey, {
          api_host: host,
          person_profiles: 'always',
          capture_pageview: false,
          autocapture: false,
        })
        posthog.capture('page_view', { project_id: 'chess' })
      })
    }

    const scheduleAnalytics = () => {
      timeoutHandle = window.setTimeout(() => {
        idleHandle = window.requestIdleCallback(loadAnalytics, { timeout: 5_000 })
      }, 3_000)
    }

    if (document.readyState === 'complete') {
      scheduleAnalytics()
    } else {
      window.addEventListener('load', scheduleAnalytics, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', scheduleAnalytics)
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle)
    }
  }, [apiKey, host])

  return children
}
