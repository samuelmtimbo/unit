export default function split(a: string, sep: string): string[] {
  return a.split(new RegExp(sep))
}
