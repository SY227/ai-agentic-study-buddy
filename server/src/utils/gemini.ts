import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
if (!apiKey) console.warn('[gemini] GEMINI_API_KEY missing — set it in .env')

const gen = new GoogleGenerativeAI(apiKey)
export function getModel(name = 'gemini-2.0-flash') {
  return gen.getGenerativeModel({ model: name })
}

export const StudyGuideSchema = {
  type: SchemaType.OBJECT,
  properties: {
    topic: { type: SchemaType.STRING },
    overview: { type: SchemaType.STRING },
    sections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          bullets: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        }
      }
    },
    key_terms: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { term: { type: SchemaType.STRING }, definition: { type: SchemaType.STRING } }
      }
    },
    figures_to_draw: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    citations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          url: { type: SchemaType.STRING },
          source_title: { type: SchemaType.STRING },
          quote: { type: SchemaType.STRING }
        }
      }
    }
  }
} as const

export const QuizSchema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          question: { type: SchemaType.STRING },
          choices: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          answer: { type: SchemaType.STRING },
          rationale: { type: SchemaType.STRING },
          citationIds: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        }
      }
    }
  }
} as const
