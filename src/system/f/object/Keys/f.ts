export default function keys({ obj = {} }: { obj: object }): {
  keys: string[]
} {
  return { keys: Object.keys(obj) }
}

export function _keys(obj: object): string[] {
  return Object.keys(obj)
}
