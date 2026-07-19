import { FeedbackWidget } from "@saas-maker/feedback";
import "@saas-maker/feedback/dist/index.css";

const API_KEY = import.meta.env.VITE_SAASMAKER_API_KEY ?? "";
const API_BASE = "https://api.sassmaker.com";

export function SaaSMakerFeedback() {
  if (!API_KEY) return null;
  return (
    <FeedbackWidget
      projectId={API_KEY}
      apiBaseUrl={API_BASE}
      position="bottom-right"
      theme="dark"
    />
  );
}
