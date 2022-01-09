import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
  strokeStyle?: string
}

export interface O<T> {}

export default class HSVColorPicker<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['style', 'h', 's', 'v'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  onDataInputData(name: string) {}
}
