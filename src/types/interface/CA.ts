export interface CA {
  draw(step: any[]): Promise<void>
  clear(): Promise<void>
  toBlob(type: string, quality: number): Promise<Blob>
}
