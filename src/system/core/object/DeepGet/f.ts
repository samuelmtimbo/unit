export default function pathGet<T>(
  obj: object,
  path: string[] | number[]
): any {
  let v: any = obj
  for (const p of path) {
    v = obj[p]
    obj = v
  }
  return v
}
