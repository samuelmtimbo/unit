import { Dict } from '../types/Dict'

export default function applyStyle(element: any, style: Dict<string>) {
  //#0

  // element.removeAttribute('style')
  // const _style = element.style
  // for (const key in style) {
  //   let value = style[key]
  //   _style[key] = value
  // }

  // #1

  // let _style_str = ''
  // for (const key in style) {
  //   const value = style[key]
  //   _style_str += camelToKebab(key) + ":" + value + ";"
  // }
  // element.style = _style_str

  // #2

  const _style = element.style
  while (_style[0]) {
    _style.removeProperty(_style[0])
  }

  for (const key in style) {
    let value = style[key]
    _style[key] = value
  }
}

export function mergeStyle(element: any, style: Dict<string>) {
  const _style = element.style

  for (const key in style) {
    let value = style[key]
    _style[key] = value
  }
}
