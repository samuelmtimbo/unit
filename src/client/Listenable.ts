import { System } from '../system'
import { Dict } from '../types/Dict'
import { Context } from './context'
import { IOElement } from './IOElement'

export interface Listenable {
  $system: System
  $context: Context
  $element: IOElement
  $listenCount: Dict<number>
}
