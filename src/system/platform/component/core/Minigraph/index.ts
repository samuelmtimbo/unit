import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
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
  constructor(config?: Config) {
    super(
      {
        i: ['spec', 'style', 'width', 'height'],
        o: [],
      },
      config
    )
  }
}
