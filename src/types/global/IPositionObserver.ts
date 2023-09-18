import { IOElement } from '../../client/IOElement'
import { PositionObserver } from '../../client/PositionObserver'
import { System } from '../../system'

export interface IPositionObserverCostructor {
  new (system: System, callback: IPositionCallback): PositionObserver
}

export interface IPositionObserver {
  observe(element: IOElement): IPositionEntry
  disconnect(): void
}

export interface IPositionCallback {
  (
    x: number,
    y: number,
    sx: number,
    sy: number,
    rx: number,
    ry: number,
    rz: number,
    px: number,
    py: number
  ): void
}

export interface IPositionEntry {
  x: number
  y: number
  sx: number
  sy: number
  rx: number
  ry: number
  rz: number
  px: number
  py: number
}
