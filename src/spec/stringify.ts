import { escape } from './escape'
import { globalUrl } from './globalUrl'
import { isValidKeyStr } from './parser'

export function stringify(value: any): string | null {
  const t = typeof value
  switch (t) {
    case 'string':
      return `"${escape(value)}"`
    case 'number':
    case 'boolean':
      return `${value}`
    case 'object':
      if (value === null) {
        return 'null'
      } else if (Array.isArray(value)) {
        return `[${value.map(stringify).join(',')}]`
      } else {
        if (value.constructor.name === 'Object') {
          return `{${Object.entries(value)
            .filter(([key, value]) => {
              return value !== undefined
            })
            .map(
              ([key, value]) =>
                `${isValidKeyStr(key) ? key : `"${key}"`}:${stringify(value)}`
            )
            .join(',')}}`
        } else {
          return globalUrl(value.__global_id)
        }
      }
    case 'function':
      if (value.__bundle) {
        return `$${stringify(value.__bundle)}`
      } else {
        // throw new Error('invalid unit class')
        return 'null'
      }
    default:
      throw new Error('cannot stringify value')
  }
}
