import type { SourceDoc } from '../utils/ingest.js'
import { synthesizeGuide } from './summarize.js'
import { generateQuiz } from './quiz.js'

export async function runPlanner(
  sources: SourceDoc[],
  plan: { requireCitations: boolean; quizItems: number },
  log?: (step: string, status?: 'ok' | 'error', info?: string) => void
) {
  if (!sources.length) throw new Error('No sources ingested. Provide at least one URL or a PDF.')
  log?.('synthesize:start')
  const guide = await synthesizeGuide(sources)
  log?.('synthesize:done')
  log?.('quiz:start')
  const quiz = await generateQuiz(guide, sources, plan.quizItems || 6)
  log?.('quiz:done')
  return { guide, quiz }
}
