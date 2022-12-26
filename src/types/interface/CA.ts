export interface CA {
  draw(step: any[]): Promise<void>
  drawImage(imageBitmap: ImageBitmap): void
  clear(): Promise<void>
  toBlob(type: string, quality: number): Promise<Blob>
}
