import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  class: string
}

export interface O {}

export default class Defs extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'className'],
        o: [],
      },
      config
    )
  }
}
