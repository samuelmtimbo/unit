import { EventEmitter2 } from 'eventemitter2'
import '../../../client/document'
import { getSpecs } from '../../spec'

// @ts-ignore
globalThis.SpeechRecognition =
  // @ts-ignore
  globalThis.webkitSpeechRecognition || globalThis.SpeechRecognition

// @ts-ignore
globalThis.SpeechGrammarList =
  // @ts-ignore
  globalThis.webkitSpeechGrammarList || globalThis.SpeechGrammarList

export type SpeechOpt = {
  grammar?: string
  lang?: string
  constinuous?: boolean
  interim?: boolean
}

const nameGrammar = (): string => {
  const specs = getSpecs()
  const token_set: Set<string> = new Set()
  for (let id in specs) {
    const spec = specs[id]
    const { name = '' } = spec
    const name_tokens = name.split(' ')
    for (const name_token of name_tokens) {
      token_set.add(name_token)
    }
  }
  const tokens: string[] = Array.from(token_set).sort()
  return grammarFrom(tokens)
}

const grammarFrom = (tokens: string[]): string => {
  const rule = tokens.join(' | ')
  const grammar = `#JSGF V1.0; grammar tokens; public <token> = ${rule} ;`
  return grammar
}

export class SpeechRecorder extends EventEmitter2 {
  private _grammarList: SpeechGrammarList
  private _recognition: SpeechRecognition

  constructor(opt: SpeechOpt) {
    super()

    if (globalThis.SpeechRecognition && globalThis.SpeechGrammarList) {
      const {
        grammar = nameGrammar(),
        lang = 'en-US',
        constinuous = false,
        interim = true,
      } = opt

      const grammarList = new globalThis.SpeechGrammarList()
      grammarList.addFromString(grammar, 1)
      this._grammarList = grammarList

      const recognition = new globalThis.SpeechRecognition()
      recognition.grammars = grammarList
      recognition.lang = lang
      recognition.interimResults = interim
      recognition.maxAlternatives = 1
      recognition.continuous = constinuous
      // recognition.continuous = false
      recognition.onerror = (event) => {
        // @ts-ignore
        this.stop()
        if (event.error === 'no-speech') {
          return
        }
        // @ts-ignore
        this.emit('err', event.error)
      }
      recognition.onend = (event) => {
        // this.emit('end', event.error)
        if (this._recording) {
          recognition.start()
        }
      }
      recognition.onaudioend = (event) => {
        // alert('onaudioend')
      }
      recognition.onspeechend = () => {
        // alert('onspeechend')
      }
      recognition.onsoundend = () => {
        // alert('onsoundend')
      }
      recognition.onresult = (event) => {
        const results = event.results
        const firstResult = results[0]
        const firstAlternative = firstResult[0]
        const { transcript, confidence } = firstAlternative
        this.emit('transcript', transcript)
      }
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
        // stop is provides faster recognition (than abort), but it can
        // throw an exception if it is called twice in a row - swallow it
        try {
          this._recognition.stop()
        } catch {}
        // this._recognition.abort()
      }
    }
  }
}
