import callAll from '../../callAll'
import { Callback } from '../../Callback'
import { EventEmitter_ } from '../../EventEmitter'
import { APINotImplementedError } from '../../exception/APINotImplementedError'
import { EE } from '../../interface/EE'
import { System } from '../../system'
import { Unlisten } from '../../Unlisten'

export interface ISpeechGrammarList {
  addFromString(str: string, weight: number)
}

export interface ISpeechGrammarListOpt {}

export interface ISpeechRecognition {
  start(): void
  stop(): void
  addListener(event: string, listener: Callback): Unlisten
}

export interface ISpeechRecognitionOpt {
  grammars?: ISpeechGrammarList
  lang?: string
  interimResults?: boolean
  maxAlternatives?: number
  continuous?: boolean
}

export type SpeechOpt = {
  grammar?: string
  lang?: string
  constinuous?: boolean
  interim?: boolean
}

export const JSGFStrFrom = (tokens: string[]): string => {
  const rule = tokens.join(' | ')
  const grammar = `#JSGF V1.0; grammar tokens; public <token> = ${rule} ;`
  return grammar
}

export const grammarsFrom = (
  system: System,
  tokens: string[]
): ISpeechGrammarList => {
  const {
    api: {
      speech: { SpeechGrammarList },
    },
  } = system

  if (!SpeechGrammarList) {
    throw new APINotImplementedError('Speech Grammar List')
  }

  const grammarsStr = JSGFStrFrom(tokens)

  const grammars = SpeechGrammarList({})

  grammars.addFromString(grammarsStr, 1)

  return grammars
}

export class SpeechRecorder extends EventEmitter_ {
  private _grammars: ISpeechGrammarList
  private _recognition: ISpeechRecognition

  private _unlisten: Unlisten

  constructor(__system: System, opt: ISpeechRecognitionOpt) {
    super()

    const {
      api: {
        speech: { SpeechGrammarList, SpeechRecognition },
      },
    } = __system

    if (SpeechRecognition && SpeechGrammarList) {
      const {
        grammars,
        lang = 'en-US',
        continuous = false,
        interimResults = true,
        maxAlternatives = 1,
      } = opt

      const recognition = SpeechRecognition({
        grammars,
        lang,
        interimResults,
        maxAlternatives,
        continuous,
      })

      this._unlisten = callAll([
        recognition.addListener('error', (event) => {
          if (event.error === 'no-speech') {
            return
          }
        }),
        recognition.addListener('end', () => {
          if (this._recording) {
            recognition.start()
          }
        }),
        recognition.addListener('result', (event) => {
          const results = event.results
          const firstResult = results[0]
          const firstAlternative = firstResult[0]
          const { transcript, confidence } = firstAlternative
          this.emit('transcript', transcript)
        }),
        recognition.addListener('audioend', () => {
          // alert('audioend')
        }),
        recognition.addListener('speechend', () => {
          // alert('speechend')
        }),
        recognition.addListener('soundend', () => {
          // alert('soundend')
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
