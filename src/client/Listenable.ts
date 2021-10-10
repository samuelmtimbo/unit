import { System } from '../boot'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { Context } from './context'
import { Listener } from './Listener'

export default interface Listenable {
  $system: System
  $context: Context
  $element: HTMLElement | SVGElement
  $listenCount: Dict<number>
  $listener: Listener[]
  $unlisten: Unlisten[]
}
