import { max, min } from '../util/array'
import { REGEX_CALC, REGEX_PERCENT, REGEX_PX } from '../util/regex'
import { removeWhiteSpace } from '../util/string'

export function parseLayoutValue(value: string): [number, number] {
  value = removeWhiteSpace(value)

  if (
    value === '' ||
    value === 'auto' ||
    value === 'fit-content' ||
    value === 'none'
  ) {
    // throw new Error('layout value not calculable')
    return [0, 0]
  }
  const percentTest = REGEX_PERCENT.exec(value)
  if (percentTest) {
    return [0, parseFloat(percentTest[1])]
  } else {
    const pxTest = REGEX_PX.exec(value)
    if (pxTest) {
      return [parseFloat(pxTest[1]), 0]
    } else {
      const calcTest = REGEX_CALC.exec(value)
      if (calcTest) {
        return [
          parseFloat(calcTest[2].replace('+-', '-')),
          parseFloat(calcTest[1]),
        ]
      } else {
        // throw new Error('layout value not recognized')
        return [0, 0]
      }
    }
  }
}

export function applyLayoutValue(value: string, baseValue: number): number {
  value = removeWhiteSpace(value)

  if (
    value === '' ||
    value === 'auto' ||
    value === 'fit-content' ||
    value === 'none'
  ) {
    // throw new Error('layout value not calculable')
    return 0
  }

  const percentTest = REGEX_PERCENT.exec(value)

  if (percentTest) {
    return applyPercent(percentTest[1], baseValue)
  }

  const pxTest = REGEX_PX.exec(value)

  if (pxTest) {
    return applyPx(pxTest[1], baseValue)
  }

  if (value.startsWith('calc(')) {
    return applyCalc(value.slice(5, -1), baseValue)
  }

  const minTest = value.match(/min\((.+)\)/)

  if (minTest) {
    return applyMin(minTest[1], baseValue)
  }

  const maxTest = value.match(/max\((.+)\)/)

  if (maxTest) {
    return applyMax(maxTest[1], baseValue)
  }

  return applyCalc(value, baseValue)
}

export function applyCalc(value: string, baseValue: number): number {
  let result = 0
  let last_i = 0
  let last_sign = '+'

  let open_paren_count = 0

  for (let i = 0; i < value.length; i++) {
    const char = value[i]

    switch (char) {
      case '(':
        {
          open_paren_count++
        }
        break
      case ')':
        {
          open_paren_count--
        }
        break
      case '+':
      case '-':
      case '*':
      case '/':
        {
          if (open_paren_count === 0) {
            const subValue = value.slice(last_i, i) || value

            result += applyLayoutValue(subValue, baseValue)

            last_i = i

            last_sign = char
          }
        }
        break
      default: {
        //
      }
    }
  }

  const lastValue = value.slice(last_i)

  if (lastValue !== '') {
    result += applyLayoutValue(lastValue, baseValue)
  }

  return result
}

export function applyPercent(value: string, baseValue: number): number {
  const p = parseFloat(value)

  return (p / 100) * baseValue
}

export function applyPx(value: string, baseValue: number): number {
  const p = parseFloat(value)

  return p
}

export function applyMin(value: string, baseValue: number): number {
  const layoutSegments = value.split(',')

  const layoutValues = layoutSegments.map((segment) =>
    applyLayoutValue(segment, baseValue)
  )

  return min(layoutValues)
}

export function applyMax(value: string, baseValue: number): number {
  const layoutSegments = value.split(',')

  const layoutValues = layoutSegments.map((segment) =>
    applyLayoutValue(segment, baseValue)
  )

  return max(layoutValues)
}
