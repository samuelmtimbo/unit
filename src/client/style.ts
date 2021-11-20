// #rememberfelx

import { System } from '../system'
import { Dict } from '../types/Dict'

export const loadStyle = async (
  $system: System,
  attr: Dict<string> = {}
): Promise<HTMLStyleElement> => {
  return new Promise((resolve, reject) => {
    const { deps: $deps } = $system

    const { style: $style } = $deps

    const { href } = attr

    if ($style[href]) {
      resolve($style[href])
    } else {
      const link = document.createElement('link')

      link.rel = 'stylesheet'

      Object.keys(attr).forEach((key) => {
        link.setAttribute(key, attr[key])
      })

      link.onload = () => resolve(link)
      link.onerror = () => reject()

      $style[href] = link

      document.head.appendChild(link)
    }
  })
}

export const loadStyles = (
  $system: System,
  list: { href: string; [key: string]: string }[]
) => {
  return Promise.all(
    list.map((attr) => {
      return loadStyle($system, attr)
    })
  )
}
