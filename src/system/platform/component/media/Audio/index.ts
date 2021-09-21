import { Element } from '../../../../../Class/Element/Element'
import { Unit } from '../../../../../Class/Unit'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
}

export interface O {}

export default class Audio extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['src', 'stream', 'style', 'controls'],
        o: [],
      },
      config,
      {
        input: {
          stream: {
            ref: true,
          },
        },
      }
    )
  }
}
