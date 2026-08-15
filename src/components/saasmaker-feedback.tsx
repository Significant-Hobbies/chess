import { FeedbackWidget } from '@saas-maker/feedback'
import '@saas-maker/feedback/dist/index.css'

const INGESTION_URL = import.meta.env.VITE_FEEDBACK_INGESTION_URL?.trim() ?? ''

export function SaaSMakerFeedback() {
  if (!INGESTION_URL) return null
  return <FeedbackWidget ingestionUrl={INGESTION_URL} position="bottom-right" theme="dark" />
}
