import { System } from '../system'
import { Context } from './context'
import { IOElement } from './IOElement'

export interface Listenable {
  $system: System
  $context: Context
  $element: IOElement
}
