export function setupCanvas(canvas: HTMLCanvasElement) {
  const canvas_ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas_ctx.scale(dpr, dpr)
  canvas.style.transform = `scale(${1 / dpr})`
}
