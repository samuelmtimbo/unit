import dropLast from '../system/core/array/DropLast/f'
import split from '../system/f/string/Split/f'

export function removeLastSegment(path: string): string {
  const { a } = dropLast({ ab: split(path, '/'), n: 1 })
  return a.join('/')
}
