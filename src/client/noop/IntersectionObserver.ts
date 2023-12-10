export class NoopIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {}

  public observe(element: HTMLElement): void {}

  disconnect() {}
}
