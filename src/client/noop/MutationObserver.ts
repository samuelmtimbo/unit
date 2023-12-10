import { IMutationObserver } from '../../types/global/IMutationObserver'
import { IPositionCallback } from '../../types/global/IPositionObserver'

export class NoopMutationObserver implements IMutationObserver {
  constructor(callback: IPositionCallback) {}

  public observe(element: HTMLElement): void {}

  disconnect() {}
}
