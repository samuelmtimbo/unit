export interface IIntersectionObserverConstructor {
  new (
    callback: IntersectionObserverCallback,
    opt: IntersectionObserverInit
  ): IntersectionObserver
}

export interface IIntersectionObserver {
  observe(element: HTMLElement): void
  disconnect(): void
}
