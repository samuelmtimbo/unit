// #rememberfelx

export const loadScript = (
  $window: Window, // TODO
  attr: { src: string; [key: string]: string }
) => {
  const $document = $window.document
  return new Promise<void>((resolve, reject) => {
    const { src } = attr
    // @ts-ignore
    $window.$script = $window.$script || new Set()
    // @ts-ignore
    if ($window.$script.has(src)) {
      resolve()
    } else {
      // @ts-ignore
      $window.$script.add(src)
      const script = $document.createElement('script')
      Object.keys(attr).forEach((key) => {
        script.setAttribute(key, attr[key])
      })
      script.onload = () => resolve()
      script.onerror = () => reject()
      $document.body.appendChild(script)
    }
  })
}

export const loadScripts = (
  $window: Window,
  list: { src: string; [key: string]: string }[]
) => {
  return Promise.all(list.map((attr) => loadScript($window, attr)))
}

export const hasScript = ($window: Window, src: string): boolean => {
  // @ts-ignore
  const has = $window.$script.has(src)
  return has
}
