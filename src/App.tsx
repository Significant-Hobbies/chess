import { Settings } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AIConfigModal } from './components/AIConfig'
import { ChessGame } from './components/ChessGame'
import { SaaSMakerFeedback } from './components/saasmaker-feedback'
import { type AIConfig, loadAIConfig } from './hooks/useAI'

const RELEASES = [
  {
    date: '2026-07-26',
    title: 'Reliable Stockfish startup on the live site',
    outcomes: [
      'The Cloudflare Pages build now serves the cross-origin isolation headers required by Stockfish WASM.',
      'The active static deployment remains independent of the optional local AI bridge.',
    ],
  },
  {
    date: '2026-07-25',
    title: 'Better search and sharing context',
    outcomes: [
      'Chess Coach gained canonical, social, and structured metadata for clearer search and shared-link previews.',
      'Agent and crawler surfaces document the public game without exposing the development-only AI proxy.',
    ],
  },
  {
    date: '2026-04-26',
    title: 'A focused chess-practice board',
    outcomes: [
      'The game received its current responsive board, evaluation, move feedback, clock, and coaching layout.',
      'Six Stockfish levels, hints, undo, board flip, and local game persistence remain available without an account.',
    ],
  },
] as const

const REPOSITORY = 'https://github.com/Significant-Hobbies/chess'

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function SiteHeader({ onOpenConfig }: { onOpenConfig?: () => void }) {
  return (
    <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <a href="/" className="flex items-center gap-3 text-inherit no-underline">
        <span className="text-2xl">♟</span>
        <div>
          <span className="block text-lg font-bold text-gray-100 leading-none">Chess Coach</span>
          <span className="block text-xs text-gray-500 mt-0.5">
            Stockfish practice with move feedback
          </span>
        </div>
      </a>
      <div className="flex items-center gap-3 sm:gap-4">
        <nav className="flex items-center gap-3 text-sm" aria-label="Site">
          <a href="/faq" className="text-gray-400 hover:text-gray-200 transition-colors">
            FAQ
          </a>
          <a href="/changelog" className="text-gray-400 hover:text-gray-200 transition-colors">
            Changelog
          </a>
          <a
            href={REPOSITORY}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            title="GitHub repository"
            className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <GithubIcon />
          </a>
        </nav>
        {onOpenConfig ? (
          <button
            onClick={onOpenConfig}
            aria-label="Open AI Config"
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">AI Config</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}

function Changelog() {
  useEffect(() => {
    document.title = 'Changelog · Chess Coach'
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-gray-100">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold text-amber-300">Product history</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Changelog</h1>
          <p className="mt-4 max-w-[65ch] leading-7 text-gray-400">
            Meaningful improvements to browser-based chess practice, reliability, and learning.
          </p>
          <nav className="mt-6 flex flex-wrap gap-5 text-sm" aria-label="Project links">
            <a className="text-amber-300 hover:text-amber-200" href={`${REPOSITORY}/issues`}>
              Roadmap
            </a>
            <a
              className="flex items-center text-amber-300 hover:text-amber-200"
              href={REPOSITORY}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              title="GitHub repository"
            >
              <GithubIcon />
            </a>
          </nav>
        </header>
        <ol className="mt-12 space-y-5">
          {RELEASES.map((release) => (
            <li key={`${release.date}-${release.title}`}>
              <article className="rounded-xl bg-gray-900/70 p-5 sm:p-6 shadow-lg shadow-black/20">
                <time className="text-xs font-semibold text-gray-500" dateTime={release.date}>
                  {new Date(`${release.date}T00:00:00`).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="mt-2 text-xl font-semibold">{release.title}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-gray-400">
                  {release.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}

function PracticeLoop() {
  return (
    <section
      className="border-b border-gray-800 bg-gray-950/35 px-4 py-5"
      aria-labelledby="practice-loop-title"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            Browser chess practice · retained experiment
          </p>
          <h1
            id="practice-loop-title"
            className="mt-1 text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl"
          >
            Play a move. Understand it. Try the idea again.
          </h1>
          <p className="mt-2 max-w-[68ch] text-sm leading-6 text-gray-400">
            Stockfish supplies the public evaluation and move quality. Optional natural-language
            coaching works only with the local development bridge; it does not replace the engine.
          </p>
        </div>
        <ol className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-gray-800 bg-gray-800 text-xs text-gray-400 lg:w-[32rem]">
          {['Play Stockfish', 'Inspect the evaluation', 'Ask, then replay'].map((step, index) => (
            <li key={step} className="bg-[#1a1a2e] px-3 py-3">
              <span className="block text-[10px] font-semibold text-amber-300">0{index + 1}</span>
              <strong className="mt-2 block font-medium text-gray-200">{step}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function App() {
  const [showAIConfig, setShowAIConfig] = useState(false)

  const [aiConfig, setAIConfig] = useState<AIConfig>(() => loadAIConfig())

  useEffect(() => {
    document.getElementById('lcp-shell')?.remove()
  }, [])

  const handleConfigSave = useCallback((config: AIConfig) => {
    setAIConfig(config)
  }, [])

  if (window.location.pathname === '/changelog' || window.location.pathname === '/changelog.html') {
    return <Changelog />
  }

  return (
    <div className="min-h-screen" style={{ background: '#1a1a2e' }}>
      <SiteHeader onOpenConfig={import.meta.env.DEV ? () => setShowAIConfig(true) : undefined} />

      <PracticeLoop />

      {/* Main content */}
      <main className="p-3 flex justify-center">
        <div className="w-full max-w-7xl">
          <ChessGame aiConfig={aiConfig} />
        </div>
      </main>

      {/* AI Config Modal */}
      {showAIConfig && (
        <AIConfigModal
          onClose={() => setShowAIConfig(false)}
          onSave={(config) => {
            handleConfigSave(config)
            setShowAIConfig(false)
          }}
        />
      )}
      <SaaSMakerFeedback />
    </div>
  )
}
