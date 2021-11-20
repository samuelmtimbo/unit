import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { IOElement } from './IOElement'
import { Context } from './context'
import { Listener } from './Listener'

export default interface Listenable {
  $system: System
  $context: Context
  $element: IOElement
  $listenCount: Dict<number>
  $listener: Listener[]
  $unlisten: Unlisten[]
}
