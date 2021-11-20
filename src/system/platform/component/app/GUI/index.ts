import { Element } from '../../../../../Class/Element/Element'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class GUI<T> extends Element<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'disabled'],
        o: [],
      },
      {},
      system
    )
  }
}
