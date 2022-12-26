import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_KEYBOARD_KEY } from '../../../../_ids'

export interface I {
  style: Dict<string>
  key: string
}

export interface O {}

export default class KeyboardKey extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'key'],
        o: [],
      },
      {},
      system,
      ID_KEYBOARD_KEY
    )
  }
}
