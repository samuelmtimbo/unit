// #rememberfelx

export const loadStyles = (
  $window: Window,
  list: { href: string; [key: string]: string }[]
) => {
  const $document = $window.document
  return Promise.all(
    list.map((attr) => {
      return new Promise<void>((resolve, reject) => {
        const { href } = attr
        // @ts-ignore
        $window.$style = $window.$style || new Set()
        // @ts-ignore
        if ($window.$style.has(href)) {
          resolve()
        } else {
          // @ts-ignore
          $window.$style.add(href)
          const link = $document.createElement('link')
          link.rel = 'stylesheet'
          Object.keys(attr).forEach((key) => {
            link.setAttribute(key, attr[key])
          })
          link.onload = () => resolve()
          link.onerror = () => reject()
          $document.head.appendChild(link)
        }
      })
    })
  )
}
