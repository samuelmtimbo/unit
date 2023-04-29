export function escape(str: string): string {
  let res = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '"') {
      res += '\\"'
    } else {
      res += char
    }
  }
  return res
}
