import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_PHONE_KEYBOARD } from '../../../../_ids'

export interface I {
  style: Dict<string>
}

export interface O {}

export default class PhoneKeyboard extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style'],
        o: [],
      },
      {},
      system,
      ID_PHONE_KEYBOARD
    )
  }
}
