export default async function paperBackground(root: HTMLElement) {
  const black = new Uint8ClampedArray([0, 0, 0, 32])
  const white = new Uint8ClampedArray([255, 255, 255, 0])
  const size = 64
  const data = new Uint8ClampedArray(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      data.set(Math.random() > 0.9 ? white : black, (y * size + x) * 4)
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.putImageData(new ImageData(data, size, size), 0, 0)
  const png = await new Promise<Blob>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  )
  const url = URL.createObjectURL(png)
  root.style.backgroundImage = `url(${url})`
}
