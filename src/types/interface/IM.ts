export interface IM {
  image(): Promise<
    | HTMLImageElement
    | SVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | ImageBitmap
    | OffscreenCanvas
    | VideoFrame
  >
}
