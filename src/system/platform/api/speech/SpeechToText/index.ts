import { SpeechRecorder } from '../../../../../api/speech'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { SpeechRecognitionOpt } from '../../../../../types/global/SpeechRecognition'
import { ID_SPEECH_TO_TEXT } from '../../../../_ids'

export type I = {
  opt: SpeechRecognitionOpt
  stop: any
  start: any
  done: any
}

export type O = {
  text: string
}

export default class SpeechToText extends Holder<I, O> {
  private _recorder: SpeechRecorder

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['start', 'stop'],
        o: ['text'],
      },
      {},
      system,
      ID_SPEECH_TO_TEXT
    )
  }

  f({ opt }: I, done: Done<O>) {
    const recorder = new SpeechRecorder(this.__system, opt)

    this._recorder = recorder

    this._recorder.addListener('transcript', (text) => {
      this._output.text.push(text)
    })

    this._recorder.addListener('err', (err) => {
      done(undefined, err)
    })
  }

  d() {
    if (this._recorder) {
      this._recorder.stop()

      this._recorder = undefined
    }
  }

  public onIterDataInputData(name: keyof I, data: any): void {
    super.onIterDataInputData(name, data)

    if (name === 'stop') {
      if (this._recorder) {
        try {
          this._recorder.stop()
        } catch (err) {
          //
        }
      }

      this._backward('stop')
    } else if (name === 'start') {
      if (this._recorder) {
        try {
          this._recorder.start()
        } catch (err) {
          //
        }
      }

      this._backward('start')
    }
  }
}
