import { IOElement } from '../../client/IOElement'
import { PositionObserver_ } from '../../client/PositionObserver'

export interface PositionObserverConstructor {
  new (system: any, callback: PositionObserverCallback): PositionObserver_
}

export interface PositionObserver {
  observe(element: IOElement): IPositionObserverEntry
  disconnect(): void
}

export interface PositionObserverCallback {
  (
    x: number,
    y: number,
    sx: number,
    sy: number,
    rx: number,
    ry: number,
    rz: number,
    bx: number,
    by: number,
    gbx: number,
    gby: number
  ): void
}

export interface IPositionObserverEntry {
  x: number
  y: number
  sx: number
  sy: number
  rx: number
  ry: number
  rz: number
  bx: number
  by: number
  gbx: number
  gby: number
}
