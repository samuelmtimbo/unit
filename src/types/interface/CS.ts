export interface CS {
  captureStream(opt: { frameRate: number }): Promise<MediaStream>
}
