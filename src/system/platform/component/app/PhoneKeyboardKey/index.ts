import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_PHONE_KEYBOARD_KEY } from '../../../../_ids'

export interface I {
  style: Dict<string>
  key: string
}

export interface O {}

export default class PhoneKeyboardKey extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'key', 'altKey'],
        o: [],
      },
      {},
      system,
      ID_PHONE_KEYBOARD_KEY
    )
  }
}
