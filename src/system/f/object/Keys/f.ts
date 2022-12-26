export default function _keys({ obj = {} }: { obj: object }): {
  keys: string[]
} {
  return { keys: Object.keys(obj) }
}

export function keys(obj: object): string[] {
  return Object.keys(obj)
}
