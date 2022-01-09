import { SpeechOpt } from '../../../../../api/speech'
import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  options?: SpeechOpt
}

export interface O<T> {
  transcript?: string
}

export default class Microphone<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['options'],
        o: ['transcript'],
      },
      {},
      system,
      pod
    )
  }
}
