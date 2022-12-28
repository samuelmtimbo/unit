import { Dict } from '../../types/Dict'

export function styleToCSS(style: Dict<any>): string {
  let str = ''
  for (let key in style) {
    const value = style[key]
    str += `${key}`
  }
  return str
}
