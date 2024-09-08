import { $ } from './Class/$'
import { extractValueInterface } from './extractValueInterface'

export function extractInterface(value: any): string[] {
  const _ = []

  if (value instanceof $) {
    for (const __ of value.__) {
      _.push(__)
    }
  }

  const __ = extractValueInterface(value)

  if (__) {
    _.push(__)
  }

  return _
}
