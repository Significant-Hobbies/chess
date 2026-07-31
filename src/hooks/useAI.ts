import { useState, useCallback, useRef } from 'react'
import { buildChessCoachPrompt, SYSTEM_PROMPT } from '../lib/ai-prompts'

export type AIProvider = 'claude-code' | 'codex' | 'gemini-cli'

const IS_LOCAL = import.meta.env.DEV

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model: string
}

const AI_CONFIG_KEY = 'chess-coach-ai-config'

const MODELS: Record<AIProvider, string[]> = {
  'claude-code': ['claude-code-local'],
  'codex': ['codex-local'],
  'gemini-cli': ['gemini-cli-local'],
}

export function getModels(provider: AIProvider): string[] {
  return MODELS[provider] || []
}

export function loadAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AIConfig>
      if (parsed.provider && Object.hasOwn(MODELS, parsed.provider)) {
        const provider = parsed.provider as AIProvider
        const models = MODELS[provider]
        return {
          provider,
          apiKey: '',
          model: models.includes(parsed.model ?? '') ? parsed.model! : models[0],
        }
      }
    }
  } catch { }
  return { provider: 'claude-code', apiKey: '', model: 'claude-code-local' }
}

export function saveAIConfig(config: AIConfig) {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
}

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

const LOCAL_TOOL_MAP: Partial<Record<AIProvider, string>> = {
  'claude-code': 'claude',
  'codex': 'codex',
  'gemini-cli': 'gemini',
}

async function streamLocalAI(
  config: AIConfig,
  messages: AIMessage[],
  systemContext: string,
  onChunk: (text: string) => void,
  signal: AbortSignal
) {
  const tool = LOCAL_TOOL_MAP[config.provider] || 'claude'
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      systemPrompt: systemContext,
      tool,
    }),
    signal,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Local AI server error: ${res.status} - ${err}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const json = JSON.parse(line.slice(6))
          if (json.text) onChunk(json.text)
          if (json.error) throw new Error(json.error)
        } catch (e: unknown) {
          const err = e as Error
          if (err.message && !err.message.includes('JSON')) throw e
        }
      }
    }
  }
}

export interface CoachContext {
  fen: string
  playerMove: string
  evalBefore: number
  evalAfter: number
  bestMove: string
  playerColor: 'white' | 'black'
}

export function useChessCoach() {
  const [explanation, setExplanation] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const evaluate = useCallback(async (context: CoachContext, config: AIConfig) => {
    // Abort any in-progress stream
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setExplanation('')
    setIsStreaming(true)
    setError(null)

    if (!IS_LOCAL) {
      setError('AI coaching is available only in local development with an authenticated CLI.')
      setIsStreaming(false)
      return
    }

    const prompt = buildChessCoachPrompt(context)
    const messages: AIMessage[] = [{ role: 'user', content: prompt }]
    const systemContext = SYSTEM_PROMPT

    const onChunk = (text: string) => {
      setExplanation(prev => prev + text)
    }

    try {
      await streamLocalAI(config, messages, systemContext, onChunk, abortRef.current.signal)
    } catch (e: unknown) {
      const err = e as Error
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to get coaching explanation')
      }
    } finally {
      setIsStreaming(false)
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  return { explanation, isStreaming, error, evaluate, cancel }
}
