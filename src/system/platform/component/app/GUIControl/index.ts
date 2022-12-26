import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_GUI_CONTROL } from '../../../../_ids'

export interface I<T> {}

export interface O<T> {}

export default class GUIControl<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      ID_GUI_CONTROL
    )
  }
}
