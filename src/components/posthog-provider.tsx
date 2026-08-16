import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const DEFAULT_KEY = 'phc_qgiAarw4Co4pw9fz3Fxj4UJaHmqzFetqs4JrXhGc35Nd'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY ?? DEFAULT_KEY
  const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

  useEffect(() => {
    posthog.init(apiKey, {
      api_host: host,
      person_profiles: 'always',
      capture_pageview: false,
      autocapture: false,
    })
    posthog.capture('page_view', { project_id: 'chess' })
  }, [apiKey, host])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
