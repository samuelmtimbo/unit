import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { Context } from './context'
import { IOElement } from './IOElement'
import { Listener } from './Listener'

export default interface Listenable {
  $system: System
  $context: Context
  $element: IOElement
  $listenCount: Dict<number>
  $listener: Listener[]
  $unlisten: Unlisten[]
}
