export interface CA {
  draw(step: any[]): Promise<void>
  drawImage(imageBitmap: ImageBitmap): void
  clear(): Promise<void>
  strokePath(d: string): void
  scale(sx: number, sy: number): void
  fillPath(d: string, fillRule: string): void
  toBlob(type: string, quality: number): Promise<Blob>
}
