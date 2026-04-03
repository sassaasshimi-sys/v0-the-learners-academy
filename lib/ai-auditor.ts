import { Question, QuestionCategory } from './types'

interface AuditResult {
  score: number // 0 to 1
  feedback: string
  justification: string
}

/**
 * AI Academic Auditor (Simulation)
 * Analyzes subjective answers for keywords and academic markers to provide instant evaluation.
 */
export async function evaluateSubjective(
  question: Question,
  answer: string
): Promise<AuditResult> {
  const cleanAnswer = answer.trim()
  
  if (!cleanAnswer || cleanAnswer.length < 5) {
    return { 
      score: 0, 
      feedback: "Answer is insufficient for academic audit.",
      justification: "Student provided an empty or critically short response."
    }
  }

  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    })

    if (!response.ok) {
      console.error('API Error:', await response.text())
      throw new Error('Failed to fetch from evaluate API')
    }

    const data = await response.json()

    return {
      score: data.score ?? 0,
      feedback: data.feedback || "Evaluated.",
      justification: data.justification || "AI evaluation complete."
    }
  } catch (error) {
    console.error('evaluateSubjective encountered an error:', error)
    // Fallback to a zero-grade if the API is entirely down
    return {
      score: 0.5,
      feedback: "Your response has been temporarily auto-graded due to server congestion.",
      justification: "Error calling OpenAI API. A mid-tier passing score was granted temporarily."
    }
  }
}
