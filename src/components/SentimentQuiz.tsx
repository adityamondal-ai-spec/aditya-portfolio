import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'

type Cls = 'positive' | 'neutral' | 'negative'
type Item = { text: string; label: Cls }

const ITEMS: Item[] = [
  { text: 'Absolutely loved this place, the staff were incredible and the food was perfect.', label: 'positive' },
  { text: 'Terrible experience, will never come back. Rude staff and cold food.', label: 'negative' },
  { text: 'It was fine. Nothing special, but nothing wrong with it either.', label: 'neutral' },
  { text: 'The product broke after two days. Complete waste of money.', label: 'negative' },
  { text: 'Pretty good overall, though the price is a bit high for what you get.', label: 'neutral' },
  { text: 'Exceeded every expectation — will be recommending this to everyone I know.', label: 'positive' },
  { text: 'Average at best. Not bad, just forgettable.', label: 'neutral' },
  { text: 'Worst customer service I have dealt with all year.', label: 'negative' },
]

const OPTIONS: { label: Cls; display: string }[] = [
  { label: 'positive', display: 'Positive' },
  { label: 'neutral', display: 'Neutral' },
  { label: 'negative', display: 'Negative' },
]

const COLORS: Record<Cls, string> = {
  positive: 'var(--positive)',
  neutral: 'var(--neutral)',
  negative: 'var(--negative)',
}

export default function SentimentQuiz() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<Cls | null>(null)
  const [done, setDone] = useState(false)

  const current = ITEMS[index]

  function handleAnswer(choice: Cls) {
    if (answered) return
    setAnswered(choice)
    if (choice === current.label) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 >= ITEMS.length) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setAnswered(null)
  }

  function restart() {
    setIndex(0)
    setScore(0)
    setAnswered(null)
    setDone(false)
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-[var(--mono)] text-xs uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--ink-dim)' }}>
          One more thing
        </p>
        <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'var(--display)' }}>
          Guess the sentiment.
        </h2>
        <p className="text-sm mb-8 max-w-md" style={{ color: 'var(--ink-dim)' }}>
          Real review-style snippets, held out the same way a test set is. Guess how each was
          actually labeled — positive, neutral, or negative.
        </p>

        <div className="max-w-lg" style={{ border: '1px solid var(--line)', background: 'var(--paper-raised)' }}>
          <div className="flex items-center justify-between px-5 pt-4 text-xs font-[var(--mono)]" style={{ color: 'var(--ink-dim)' }}>
            <span>{index + 1} / {ITEMS.length}</span>
            <span>score {score}</span>
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={index}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
                className="px-5 pb-5 pt-3"
              >
                <p className="text-base leading-relaxed min-h-[72px]" style={{ fontFamily: 'var(--display)' }}>
                  &ldquo;{current.text}&rdquo;
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {OPTIONS.map((opt) => {
                    const isChosen = answered === opt.label
                    const isCorrectAnswer = answered && opt.label === current.label
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleAnswer(opt.label)}
                        disabled={!!answered}
                        className="px-3.5 py-1.5 text-sm transition-colors"
                        style={{
                          border: `1px solid ${answered ? (isCorrectAnswer ? COLORS[opt.label] : 'var(--line)') : 'var(--ink)'}`,
                          color: isCorrectAnswer ? COLORS[opt.label] : isChosen ? 'var(--ink-dim)' : 'var(--ink)',
                          background: 'transparent',
                          cursor: answered ? 'default' : 'pointer',
                        }}
                      >
                        {opt.display}
                      </button>
                    )
                  })}
                </div>

                {answered && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm" style={{ color: answered === current.label ? 'var(--positive)' : 'var(--negative)' }}>
                      {answered === current.label ? 'Correct' : `Actually: ${current.label}`}
                    </p>
                    <button
                      onClick={next}
                      className="text-sm border-b pb-0.5 hover:opacity-70 transition-opacity"
                      style={{ borderColor: 'var(--ink)' }}
                    >
                      {index + 1 >= ITEMS.length ? 'See score' : 'Next'} →
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-5 pb-6 pt-3"
              >
                <p className="text-lg" style={{ fontFamily: 'var(--display)' }}>
                  {score} / {ITEMS.length} correct.
                </p>
                <button
                  onClick={restart}
                  className="mt-3 text-sm border-b pb-0.5 hover:opacity-70 transition-opacity"
                  style={{ borderColor: 'var(--ink)' }}
                >
                  Try again →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
