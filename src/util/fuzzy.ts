export interface FuzzyOptions {
  caseSensitive?: boolean
}

export interface FuzzyMatchResult {
  score: number
}

export function match(
  pattern: string,
  str: string,
  opts: FuzzyOptions = {}
): FuzzyMatchResult | null {
  const { caseSensitive = false } = opts

  const compareStr = caseSensitive ? str : str.toLowerCase()
  const comparePattern = caseSensitive ? pattern : pattern.toLowerCase()

  let patternIdx = 0
  let totalScore = 0
  let currScore = 0

  for (let i = 0; i < compareStr.length; i++) {
    if (compareStr[i] === comparePattern[patternIdx]) {
      patternIdx++
      currScore += 1 + currScore
      totalScore += currScore
    } else {
      currScore = 0
    }
  }

  if (patternIdx === comparePattern.length) {
    return {
      score: compareStr === comparePattern ? Infinity : totalScore,
    }
  }

  return null
}
