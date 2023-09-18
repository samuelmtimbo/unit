import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_BOT } from '../../../../_ids'

export interface I<T> {
  style: Dict<string>
  disabled: boolean
  r: number
  x: string
  y: string
}

export interface O<T> {}

export default class Bot<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'disabled', 'r', 'x', 'y'],
        o: [],
      },
      {},
      system,
      ID_BOT
    )
  }
}
