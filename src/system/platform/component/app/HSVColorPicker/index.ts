import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { ID_HSV_COLOR_PICKER } from '../../../../_ids'

export interface I<T> {
  style?: Dict<string>
  strokeStyle?: string
}

export interface O<T> {}

export default class HSVColorPicker<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'h', 's', 'v'],
        o: [],
      },
      {},
      system,
      ID_HSV_COLOR_PICKER
    )
  }

  onDataInputData(name: string) {}
}
