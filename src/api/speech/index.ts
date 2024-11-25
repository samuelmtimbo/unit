import { EventEmitter_, EventEmitter_EE } from '../../EventEmitter'
import { System } from '../../system'
import {
  SpeechRecognition,
  SpeechRecognitionOpt,
} from '../../types/global/SpeechRecognition'
import { Unlisten } from '../../types/Unlisten'
import { callAll } from '../../util/call/callAll'

export type SpeechOpt = {
  grammar?: string
  lang?: string
  constinuous?: boolean
  interim?: boolean
}

export type SpeechRecorder_EE = {
  transcript: [string]
  err: [string]
  end: []
}

export type SpeechRecorderEvents = EventEmitter_EE<SpeechRecorder_EE> &
  SpeechRecorder_EE

export class SpeechRecorder extends EventEmitter_<SpeechRecorderEvents> {
  private _recognition: SpeechRecognition

  private _unlisten: Unlisten

  constructor(__system: System, opt: SpeechRecognitionOpt) {
    super()

    const {
      api: {
        speech: { SpeechGrammarList, SpeechRecognition },
      },
    } = __system

    if (SpeechRecognition) {
      const {
        grammars,
        lang = 'en-US',
        continuous = false,
        interimResults = false,
        maxAlternatives = 1,
      } = opt

      let recognition: any

      try {
        recognition = new SpeechRecognition({
          grammars,
          lang,
          interimResults,
          maxAlternatives,
          continuous,
        })
      } catch (err) {
        throw err
      }

      this._unlisten = callAll([
        recognition.addEventListener('error', ({ error }) => {
          if (error === 'no-speech') {
            return
          }
        }),
        recognition.addEventListener('end', () => {
          if (this._recording) {
            recognition.start()
          } else {
            this.emit('end')
          }
        }),
        recognition.addEventListener('result', (event) => {
          const { results } = event

          const firstResult = results[0]
          const firstAlternative = firstResult[0]

          const { transcript, confidence } = firstAlternative

          this.emit('transcript', transcript)
        }),
      ])

      this._recognition = recognition
    }
  }

  private _recording: boolean = false

  public start(): void {
    if (this._recognition) {
      if (!this._recording) {
        this._recording = true
        this._recognition.start()
      }
    }
  }

  public stop(): void {
    if (this._recognition) {
      if (this._recording) {
        this._recording = false
        // stop provides faster recognition (than abort), but it can
        // throw an exception if it is called twice in a row - swallow it
        try {
          this._recognition.stop()
        } catch {}
        // this._recognition.abort()
      }
    }
  }
}
