import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { J } from '../../../../../types/interface/J'
import { ID_SEARCH } from '../../../../_ids'

export interface I<T> {
  style: Dict<string>
  selected: string
  selectedColor: string
  shape: string
  specs: J
}

export interface O<T> {}

export default class Search<T> extends Element_<I<T>, O<T>> {
  __ = ['U', 'C', 'V', 'J', 'EE']

  constructor(system: System) {
    super(
      {
        i: ['style', 'selected', 'selectedColor', 'shape', 'specs'],
        o: [],
      },
      {
        input: {
          specs: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      ID_SEARCH
    )
  }
}
