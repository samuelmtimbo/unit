import { Dict } from '../../../../../../types/Dict'
import { Element } from '../../../../../../Class/Element/Element'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class Web<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['style'],
      o: [],
    })
  }
}
