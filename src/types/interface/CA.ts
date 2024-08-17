export interface CA {
  draw(step: any[]): Promise<void>
  drawImage(
    imageBitmap: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void>
  clear(): Promise<void>
  strokePath(d: string): void
  scale(sx: number, sy: number): void
  fillPath(d: string, fillRule: string): void
  toBlob(type: string, quality: number): Promise<Blob>
  toDataUrl(type: string, quality: number): Promise<string>
  getImageData(
    x: number,
    y: number,
    width: number,
    height: number,
    opt: ImageDataSettings
  ): Promise<ImageData>
  putImageData(
    image: ImageData,
    dx: number,
    dy: number,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<void>
}
