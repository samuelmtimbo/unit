import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { SpeechOpt } from '../../../../../client/event/speech'

export interface I<T> {
  options?: SpeechOpt
}

export interface O<T> {
  transcript?: string
}

export default class Microphone<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['options'],
        o: ['transcript'],
      },
      config
    )
  }
}
