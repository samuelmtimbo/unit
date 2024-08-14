import { Unit } from './Class/Unit'
import { extractValueInterface } from './extractValueInterface'

export function extractInterface(value: any): string[] {
  const _ = []

  if (value instanceof Unit) {
    _.push('U')
  }

  if (value instanceof Element) {
    _.push('G')
  }

  const __ = extractValueInterface(value)

  if (__) {
    _.push(__)
  }

  return _
}
