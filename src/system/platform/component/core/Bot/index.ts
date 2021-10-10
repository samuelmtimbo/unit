import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style: Dict<string>
  disabled: boolean
  r: number
  x: number
  y: number
}

export interface O<T> {}

export default class Bot<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'disabled', 'r', 'x', 'y'],
        o: [],
      },
      config
    )
  }
}
