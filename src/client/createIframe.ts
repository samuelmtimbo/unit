export default function createIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe')
  iframe.style.border = 'none'
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  return iframe
}
