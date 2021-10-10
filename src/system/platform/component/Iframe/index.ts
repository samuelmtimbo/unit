import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  src: string
  style: object
}

export interface O {}

export default class Iframe extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'srcdoc', 'style'],
        o: [],
      },
      config
    )
  }
}
