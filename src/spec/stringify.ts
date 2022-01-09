import { isValidKeyStr } from './parser'

export function escape(str: string): string {
  let res = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const next_char = str[i + 1]
    if (char === '\\' && next_char !== '\\') {
      res += '\\\\'
    } else if (char === '\n') {
      res += '\\n'
    } else if (char === '\r') {
      res += '\\r'
    } else if (char === "'") {
      res += "\\'"
    }
    // else if (char === '"') {
    //   res += '\\"'
    // }
    else if (char === '&') {
      res += '\\&'
    } else {
      res += char
    }
  }
  return res
}

export function stringify(value: any): string {
  const t = typeof value
  switch (t) {
    case 'string':
      return `'${escape(value)}'`
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
          // AD HOC
          return '`U`'
        }
      }
    case 'function':
      if (value.__bundle) {
        return `$${stringify(value.__bundle)}`
      } else {
        throw new Error('Invalid Unit Class.')
      }
    default:
      throw new Error('Cannot stringify value.')
  }
}
