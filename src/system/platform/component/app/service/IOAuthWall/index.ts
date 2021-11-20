import { Element } from '../../../../../../Class/Element/Element'
import { Dict } from '../../../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class IOAuthWall<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['style'],
      o: [],
    })
  }
}
