export interface IMutationObserverConstructor {
  new (callback): IMutationObserver
}

export interface IMutationObserver {
  observe(element: Element, opt: any): void // TODO
  disconnect(): void
}
