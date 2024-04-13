import { SpeechRecorder } from '../../../../../api/speech'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
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

export default class SpeechToText extends Semifunctional<I, O> {
  private _recorder: SpeechRecorder | null = null

  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['start', 'stop', 'done'],
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

    this._recorder.addListener('end', () => {
      this._recorder = null

      done()
    })
  }

  public onIterDataInputData(name: string, data: any): void {
    if (name === 'stop') {
      if (this._recorder) {
        this._recorder.stop()
      }

      this._backward('stop')
    } else if (name === 'start') {
      if (this._recorder) {
        this._recorder.start()
      }

      this._backward('start')
    } else if (name === 'done') {
      if (this._recorder) {
        this._recorder.stop()
      }

      this._forward_empty('text')

      this._backward('opt')
      this._backward('done')
    }
  }
}
