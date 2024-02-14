export class NoopResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}

  disconnect(): void {
    //
  }
  observe(target: Element, options?: ResizeObserverOptions): void {
    //
  }
  unobserve(target: Element): void {
    //
  }
}
