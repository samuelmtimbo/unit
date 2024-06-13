import { MethodNotImplementedError } from '../../exception/MethodNotImplementedError'

export class NoopMutationObserver implements MutationObserver {
  disconnect(): void {
    throw new MethodNotImplementedError()
  }
  observe(target: Node, options?: MutationObserverInit): void {
    throw new MethodNotImplementedError()
  }
  takeRecords(): MutationRecord[] {
    throw new MethodNotImplementedError()
  }
}
