export function downloadData(
  name: string,
  data: boolean | number | string,
  mimeType: string,
  charset: string = 'utf-8'
): void {
  const dataStr = `data:${mimeType};charset=${charset},${encodeURIComponent(
    data
  )}`
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.download = name
  a.href = dataStr
  a.click()
  document.body.removeChild(a)
}
