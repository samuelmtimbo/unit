// TODO
export class NoopCanvasRenderingContext2D implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement
  getContextAttributes(): CanvasRenderingContext2DSettings {
    return
  }
  globalAlpha: number
  globalCompositeOperation: GlobalCompositeOperation
  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  drawImage(
    image: CanvasImageSource,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void
  drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void
  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  drawImage(
    image: CanvasImageSource,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void
  drawImage(
    image: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void
  drawImage(
    image: unknown,
    sx: unknown,
    sy: unknown,
    sw?: unknown,
    sh?: unknown,
    dx?: unknown,
    dy?: unknown,
    dw?: unknown,
    dh?: unknown
  ): void {
    //
  }
  beginPath(): void
  beginPath(): void
  beginPath(): void {
    //
  }
  clip(fillRule?: CanvasFillRule): void
  clip(path: Path2D, fillRule?: CanvasFillRule): void
  clip(fillRule?: CanvasFillRule): void
  clip(path: Path2D, fillRule?: CanvasFillRule): void
  clip(path?: unknown, fillRule?: unknown): void {
    //
  }
  fill(fillRule?: CanvasFillRule): void
  fill(path: Path2D, fillRule?: CanvasFillRule): void
  fill(fillRule?: CanvasFillRule): void
  fill(path: Path2D, fillRule?: CanvasFillRule): void
  fill(path?: unknown, fillRule?: unknown): void {
    //
  }
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInPath(
    path: Path2D,
    x: number,
    y: number,
    fillRule?: CanvasFillRule
  ): boolean
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInPath(
    path: Path2D,
    x: number,
    y: number,
    fillRule?: CanvasFillRule
  ): boolean
  isPointInPath(
    path: unknown,
    x: unknown,
    y?: unknown,
    fillRule?: unknown
  ): boolean {
    return false
  }
  isPointInStroke(x: number, y: number): boolean
  isPointInStroke(path: Path2D, x: number, y: number): boolean
  isPointInStroke(x: number, y: number): boolean
  isPointInStroke(path: Path2D, x: number, y: number): boolean
  isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
    return false
  }
  stroke(): void
  stroke(path: Path2D): void
  stroke(): void
  stroke(path: Path2D): void
  stroke(path?: unknown): void {
    //
  }
  fillStyle: string | CanvasGradient | CanvasPattern
  strokeStyle: string | CanvasGradient | CanvasPattern
  createConicGradient(startAngle: number, x: number, y: number): CanvasGradient
  createConicGradient(startAngle: number, x: number, y: number): CanvasGradient
  createConicGradient(
    startAngle: unknown,
    x: unknown,
    y: unknown
  ): CanvasGradient {
    return
  }
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient
  createLinearGradient(
    x0: unknown,
    y0: unknown,
    x1: unknown,
    y1: unknown
  ): CanvasGradient {
    return
  }
  createPattern(
    image: CanvasImageSource,
    repetition: string | null
  ): CanvasPattern | null
  createPattern(
    image: CanvasImageSource,
    repetition: string | null
  ): CanvasPattern | null
  createPattern(image: unknown, repetition: unknown): CanvasPattern {
    return
  }
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient
  createRadialGradient(
    x0: unknown,
    y0: unknown,
    r0: unknown,
    x1: unknown,
    y1: unknown,
    r1: unknown
  ): CanvasGradient {
    return
  }
  filter: string
  createImageData(
    sw: number,
    sh: number,
    settings?: ImageDataSettings
  ): ImageData
  createImageData(imagedata: ImageData): ImageData
  createImageData(
    sw: number,
    sh: number,
    settings?: ImageDataSettings
  ): ImageData
  createImageData(imagedata: ImageData): ImageData
  createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData {
    return
  }
  getImageData(
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    settings?: ImageDataSettings
  ): ImageData
  getImageData(
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    settings?: ImageDataSettings
  ): ImageData
  getImageData(
    sx: unknown,
    sy: unknown,
    sw: unknown,
    sh: unknown,
    settings?: unknown
  ): ImageData {
    return
  }
  putImageData(imagedata: ImageData, dx: number, dy: number): void
  putImageData(
    imagedata: ImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void
  putImageData(imagedata: ImageData, dx: number, dy: number): void
  putImageData(
    imagedata: ImageData,
    dx: number,
    dy: number,
    dirtyX: number,
    dirtyY: number,
    dirtyWidth: number,
    dirtyHeight: number
  ): void
  putImageData(
    imagedata: unknown,
    dx: unknown,
    dy: unknown,
    dirtyX?: unknown,
    dirtyY?: unknown,
    dirtyWidth?: unknown,
    dirtyHeight?: unknown
  ): void {
    return
  }
  imageSmoothingEnabled: boolean
  imageSmoothingQuality: ImageSmoothingQuality
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void
  arc(
    x: unknown,
    y: unknown,
    radius: unknown,
    startAngle: unknown,
    endAngle: unknown,
    counterclockwise?: unknown
  ): void {
    return
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
  arcTo(
    x1: unknown,
    y1: unknown,
    x2: unknown,
    y2: unknown,
    radius: unknown
  ): void {
    return
  }
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void
  bezierCurveTo(
    cp1x: unknown,
    cp1y: unknown,
    cp2x: unknown,
    cp2y: unknown,
    x: unknown,
    y: unknown
  ): void {
    return
  }
  closePath(): void
  closePath(): void
  closePath(): void {
    return
  }
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void
  ellipse(
    x: unknown,
    y: unknown,
    radiusX: unknown,
    radiusY: unknown,
    rotation: unknown,
    startAngle: unknown,
    endAngle: unknown,
    counterclockwise?: unknown
  ): void {
    return
  }
  lineTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  lineTo(x: unknown, y: unknown): void {
    return
  }
  moveTo(x: number, y: number): void
  moveTo(x: number, y: number): void
  moveTo(x: unknown, y: unknown): void {
    return
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void
  quadraticCurveTo(cpx: unknown, cpy: unknown, x: unknown, y: unknown): void {
    return
  }
  rect(x: number, y: number, w: number, h: number): void
  rect(x: number, y: number, w: number, h: number): void
  rect(x: unknown, y: unknown, w: unknown, h: unknown): void {
    return
  }
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[]
  ): void
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | Iterable<number | DOMPointInit>
  ): void
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[]
  ): void
  roundRect(
    x: unknown,
    y: unknown,
    w: unknown,
    h: unknown,
    radii?: unknown
  ): void {
    return
  }
  lineCap: CanvasLineCap
  lineDashOffset: number
  lineJoin: CanvasLineJoin
  lineWidth: number
  miterLimit: number
  getLineDash(): number[]
  getLineDash(): number[]
  getLineDash(): number[] {
    return
  }
  setLineDash(segments: number[]): void
  setLineDash(segments: Iterable<number>): void
  setLineDash(segments: number[]): void
  setLineDash(segments: unknown): void {
    return
  }
  clearRect(x: number, y: number, w: number, h: number): void
  clearRect(x: number, y: number, w: number, h: number): void
  clearRect(x: unknown, y: unknown, w: unknown, h: unknown): void {
    return
  }
  fillRect(x: number, y: number, w: number, h: number): void
  fillRect(x: number, y: number, w: number, h: number): void
  fillRect(x: unknown, y: unknown, w: unknown, h: unknown): void {
    return
  }
  strokeRect(x: number, y: number, w: number, h: number): void
  strokeRect(x: number, y: number, w: number, h: number): void
  strokeRect(x: unknown, y: unknown, w: unknown, h: unknown): void {
    return
  }
  shadowBlur: number
  shadowColor: string
  shadowOffsetX: number
  shadowOffsetY: number
  reset(): void
  reset(): void
  reset(): void {
    return
  }
  restore(): void
  restore(): void
  restore(): void {
    return
  }
  save(): void
  save(): void
  save(): void {
    return
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void
  fillText(text: string, x: number, y: number, maxWidth?: number): void
  fillText(text: unknown, x: unknown, y: unknown, maxWidth?: unknown): void {
    return
  }
  measureText(text: string): TextMetrics
  measureText(text: string): TextMetrics
  measureText(text: unknown): TextMetrics {
    return
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void
  strokeText(text: string, x: number, y: number, maxWidth?: number): void
  strokeText(text: unknown, x: unknown, y: unknown, maxWidth?: unknown): void {
    return
  }
  direction: CanvasDirection
  font: string
  fontKerning: CanvasFontKerning
  fontStretch: CanvasFontStretch
  fontVariantCaps: CanvasFontVariantCaps
  letterSpacing: string
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  textRendering: CanvasTextRendering
  wordSpacing: string
  getTransform(): DOMMatrix
  getTransform(): DOMMatrix
  getTransform(): DOMMatrix {
    return
  }
  resetTransform(): void
  resetTransform(): void
  resetTransform(): void {
    return
  }
  rotate(angle: number): void
  rotate(angle: number): void
  rotate(angle: unknown): void {
    return
  }
  scale(x: number, y: number): void
  scale(x: number, y: number): void
  scale(x: unknown, y: unknown): void {
    return
  }
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void
  setTransform(transform?: DOMMatrix2DInit): void
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void
  setTransform(transform?: DOMMatrix2DInit): void
  setTransform(
    a?: unknown,
    b?: unknown,
    c?: unknown,
    d?: unknown,
    e?: unknown,
    f?: unknown
  ): void {
    return
  }
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void
  transform(
    a: unknown,
    b: unknown,
    c: unknown,
    d: unknown,
    e: unknown,
    f: unknown
  ): void {
    return
  }
  translate(x: number, y: number): void
  translate(x: number, y: number): void
  translate(x: unknown, y: unknown): void {
    return
  }
  drawFocusIfNeeded(element: Element): void
  drawFocusIfNeeded(path: Path2D, element: Element): void
  drawFocusIfNeeded(path: unknown, element?: unknown): void {
    return
  }
}
