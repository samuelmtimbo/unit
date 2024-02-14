import { Listener } from '../Listener'
import { Unlisten } from '../Unlisten'
import { SpeechGrammarList } from './SpeechGrammarList'

export interface SpeechRecognition {
  start(): void
  stop(): void
  addListener(
    event: 'result',
    listener: Listener<[{ transcript: string; confidence: number }[]]>
  ): Unlisten
  addListener(event: 'end', listener: Listener<[]>): Unlisten
  addListener(event: 'error', listener: Listener<[string]>): Unlisten
}

export interface SpeechRecognitionOpt {
  grammars?: SpeechGrammarList
  lang?: string
  interimResults?: boolean
  maxAlternatives?: number
  continuous?: boolean
}
