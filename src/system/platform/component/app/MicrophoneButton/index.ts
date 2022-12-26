import { SpeechOpt } from '../../../../../api/speech'
import { Element_ } from '../../../../../Class/Element'
import { System } from '../../../../../system'
import { ID_MICROPHONE_BUTTON } from '../../../../_ids'

export interface I<T> {
  options?: SpeechOpt
}

export interface O<T> {
  transcript?: string
}

export default class MicrophoneButton<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['options'],
        o: ['transcript'],
      },
      {},
      system,
      ID_MICROPHONE_BUTTON
    )
  }
}
