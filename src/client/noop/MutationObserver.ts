export class NoopMutationObserver implements MutationObserver {
  disconnect(): void {
    throw new Error('Method not implemented.')
  }
  observe(target: Node, options?: MutationObserverInit): void {
    throw new Error('Method not implemented.')
  }
  takeRecords(): MutationRecord[] {
    throw new Error('Method not implemented.')
  }
}
