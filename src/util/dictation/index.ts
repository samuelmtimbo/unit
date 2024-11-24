const NUMBERS: { [key: string]: number } = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
}

const MULTIPLIERS: { [key: string]: number } = {
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
  quadrillion: 1000000000000000,
  quintillion: 1000000000000000000,
}

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER

function normalizeNumber(numStr: string, nextWord?: string): string {
  if (
    nextWord &&
    MULTIPLIERS.hasOwnProperty(nextWord) &&
    /^\d+,\d+$/.test(numStr)
  ) {
    return (
      parseFloat(numStr.replace(',', '.')) * MULTIPLIERS[nextWord]
    ).toString()
  }

  if (/^\d{1,3}(,\d{3})*$/.test(numStr)) {
    return numStr.replace(/,/g, '')
  }

  const parts = numStr.split(',')
  if (parts.length > 1) {
    if (parts[parts.length - 1].length === 1) {
      const wholeNumber = parts.slice(0, -1).join('')

      return `${wholeNumber}.${parts[parts.length - 1]}`
    }

    if (parts[0] === '0') {
      return `0.${parts.slice(1).join('')}`
    }
    return parts.join('')
  }

  return numStr
}

export function parseNumberSentence(sentence: string): number {
  let normalized = sentence
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ and /g, ' ')
    .trim()

  Object.keys(MULTIPLIERS).forEach((multiplier) => {
    normalized = normalized.replace(
      new RegExp(`\\ba ${multiplier}\\b`, 'g'),
      `one ${multiplier}`
    )
  })

  const words = normalized.split(' ')

  let total = 0
  let currentNumber = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    let nextValue: number

    const nextWord = i < words.length - 1 ? words[i + 1] : undefined
    const normalizedNum = normalizeNumber(word, nextWord)
    const numericValue = parseFloat(normalizedNum)

    if (!isNaN(numericValue)) {
      if (
        nextWord &&
        MULTIPLIERS.hasOwnProperty(nextWord) &&
        /^\d+,\d+$/.test(word)
      ) {
        nextValue = numericValue
        i++
      } else {
        nextValue = numericValue
      }
    } else if (NUMBERS.hasOwnProperty(word)) {
      nextValue = NUMBERS[word]
    } else if (MULTIPLIERS.hasOwnProperty(word)) {
      if (currentNumber === 0) {
        currentNumber = 1
      }

      nextValue = currentNumber * MULTIPLIERS[word]

      if (nextValue > MAX_SAFE_INTEGER) {
        return null
      }

      if (MULTIPLIERS[word] >= 1000) {
        total += nextValue
        currentNumber = 0
        continue
      }

      currentNumber = nextValue
      continue
    } else {
      return null
    }

    if (currentNumber + nextValue > MAX_SAFE_INTEGER) {
      return null
    }

    currentNumber += nextValue
  }

  if (total + currentNumber > MAX_SAFE_INTEGER) {
    return null
  }

  return total + currentNumber
}
