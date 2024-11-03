import { $ } from '../Class/$'
import { escape } from './escape'
import { globalUrl } from './globalUrl'

export function stringify(value: any, deref: boolean = false): string | null {
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
        return `[${value.map((v) => stringify(v, deref)).join(',')}]`
      } else {
        if (value.constructor.name === 'Object') {
          return `{${Object.entries(value)
            .filter(([key, value]) => {
              return value !== undefined
            })
            .map(([key, value]) => `${`"${escape(key)}"`}:${stringify(value)}`)
            .join(',')}}`
        } else {
          if (deref) {
            if ((value as $).__.includes('U')) {
              return stringify(value.constructor)
            } else {
              return 'null'
            }
          } else {
            return globalUrl(value.__global_id)
          }
        }
      }
      break
    case 'function':
      if (value.__bundle) {
        return `$${stringify(value.__bundle, deref)}`
      } else {
        // throw new Error('invalid unit class')
        return 'null'
      }
    default:
      throw new Error('cannot stringify value')
  }
}
