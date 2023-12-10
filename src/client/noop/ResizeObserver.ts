import { IPositionCallback } from '../../types/global/IPositionObserver'
import { IResizeObserver } from '../../types/global/IResizeObserver'

export class NoopResizeObserver implements IResizeObserver {
  constructor(callback: IPositionCallback) {}

  public observe(element: HTMLElement): void {}

  disconnect() {}
}
