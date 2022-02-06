import { IOElement } from '../../client/IOElement'
import { System } from '../../system'

export interface IPositionObserverCostructor {
  new (system: System, callback: IPositionCallback): IPositionObserver
}

export interface IPositionObserver {
  observe(element: IOElement): IPositionEntry
  disconnect(): void
}

export interface IPositionCallback {
  (entry: IPositionEntry): void
}

export interface IPositionEntry {
  x: number
  y: number
  sx: number
  sy: number
  rx: number
  ry: number
  rz: number
}
