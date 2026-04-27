import { PostHogProvider } from '@saas-maker/posthog-client';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com';
  return (
    <PostHogProvider apiKey={apiKey} host={host}>
      {children}
    </PostHogProvider>
  );
}
