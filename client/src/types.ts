export type StudyGuide = {
  topic: string
  overview: string
  sections: { title: string; bullets: string[] }[]
  key_terms: { term: string; definition: string }[]
  figures_to_draw: string[]
}

export type QuizItem = {
  type: 'mcq' | 'short'
  question: string
  choices?: string[]
  answer: string
  rationale: string
}

export type BuildResponse = {
  logs: { step: string; status: 'ok' | 'error'; info?: string }[]
  guide: StudyGuide
  quiz: { items: QuizItem[] }
}
