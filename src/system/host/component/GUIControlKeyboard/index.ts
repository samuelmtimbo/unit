import { Element } from '../../../../Class/Element/Element'
import { System } from '../../../../system'

export interface I<T> {}

export interface O<T> {}

export default class IOUNAPPKeyboard<T> extends Element<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system
    )
  }
}
