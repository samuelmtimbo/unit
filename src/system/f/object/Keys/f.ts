export default function keys({ obj = {} }: { obj: object }): {
  keys: string[]
} {
  return { keys: Object.keys(obj) }
}
