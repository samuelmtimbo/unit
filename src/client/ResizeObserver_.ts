import { IPositionCallback } from '../types/global/IPositionObserver'
import { IResizeObserver } from '../types/global/IResizeObserver'

export class ResizeObserver_ implements IResizeObserver {
  constructor(callback: IPositionCallback) {}

  public observe(element: HTMLElement): void {}

  disconnect() {}
}
