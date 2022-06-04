import { Dict } from '../types/Dict'

export function showNotification(
  message: string,
  style: Dict<string> = {},
  timeout: number | null = null
) {
  const message_div = document.createElement('div')

  message_div.style.color = 'currentColor'
  message_div.style.borderColor = 'currentColor'
  message_div.style.borderWidth = '1px'
  message_div.style.borderStyle = 'solid'
  message_div.style.borderRadius = '3px'
  message_div.innerText = message
  message_div.style.width = 'calc(100% - 180px)'
  message_div.style.maxHeight = 'calc(100% - 180px)'
  message_div.style.cursor = 'pointer'
  message_div.style.position = 'absolute'
  message_div.style.top = '90px'
  message_div.style.wordBreak = 'break-all'
  message_div.style.textAlign = 'center'
  message_div.style.left = '50%'
  message_div.style.maxHeight = '90px'
  message_div.style.overflow = 'auto'
  message_div.style.transform = 'translateX(-50%)'
  message_div.style.padding = '6px'

  for (const name in style) {
    const value = style[name]

    message_div.style[name] = value
  }

  document.body.appendChild(message_div)

  let mounted = true

  const remove = () => {
    mounted = false

    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }

    document.body.removeChild(message_div)
  }

  message_div.onclick = () => {
    remove()
  }

  let timer: NodeJS.Timer

  if (typeof timeout === 'number') {
    timer = setTimeout(() => {
      remove()
    }, timeout)
  }
}
