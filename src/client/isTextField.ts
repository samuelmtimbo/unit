export function isTextField(element: HTMLElement): boolean {
  const { tagName } = element

  return (
    (tagName === 'INPUT' &&
      /^(?:text|email|search|tel|url|password)$/i.test(
        (element as HTMLInputElement).type
      )) ||
    tagName === 'TEXTAREA'
  )
}
