import { Element } from '../../../../../Class/Element/Element'
import { GraphSpec } from '../../../../../types'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  width: number
  height: number
  spec: GraphSpec
  style: Dict<string>
}

export interface O<T> {}

export default class Minigraph<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['spec', 'style', 'width', 'height'],
      o: [],
    })
  }
}
