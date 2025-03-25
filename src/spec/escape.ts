export function escape(str: string) {
  return str.replace(/[\n\r\t\b\f\v\\'"`\0]/g, (char) => {
    switch (char) {
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '\t':
        return '\\t'
      case '\b':
        return '\\b'
      case '\f':
        return '\\f'
      case '\v':
        return '\\v'
      case '\\':
        return '\\\\'
      case '"':
        return '\\"'
      case '\0':
        return '\\0'
      default:
        return char
    }
  })
}
