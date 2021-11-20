import { Specs } from '../types'
import { getSpecComplexity } from './complexity'
import { getSpec } from './spec'

const NUMERAL = '0123456789'

export function startsWithNumeral(str: string): boolean {
  return NUMERAL.indexOf(str[0]) > -1
}

export function compareByComplexity(
  specs: Specs,
  a: string,
  b: string
): number {
  const aC = getSpecComplexity(specs, a, true)
  const bC = getSpecComplexity(specs, b, true)
  if (aC < bC) {
    return -1
  } else if (aC > bC) {
    return 1
  } else {
    return compareByName(specs, a, b)
  }
}

export function compareByName(specs: Specs, a: string, b: string): number {
  const aSpec = getSpec(specs, a)
  const bSpec = getSpec(specs, b)
  const aName = (aSpec.name || '').toLowerCase()
  const bName = (bSpec.name || '').toLowerCase()
  if (startsWithNumeral(aName) && !startsWithNumeral(bName)) {
    return 1
  } else if (!startsWithNumeral(aName) && startsWithNumeral(bName)) {
    return -1
  }
  if (aName < bName) {
    return -1
  } else if (aName > bName) {
    return 1
  } else {
    return 0
  }
}
