export interface IResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver
}

export interface IResizeObserver {
  observe(element: HTMLElement)
  disconnect(): void
}
