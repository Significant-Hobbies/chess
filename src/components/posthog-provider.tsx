import { PostHogProvider } from 'posthog-js/react';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com';
  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{ api_host: host, capture_pageview: true, capture_pageleave: true }}
    >
      {children}
    </PostHogProvider>
  );
}
