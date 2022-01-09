import { Listener } from '../Listener'
import { Unlisten } from '../Unlisten'
import { ISpeechGrammarList } from './ISpeechGrammarList'

export interface ISpeechRecognition {
  start(): void
  stop(): void
  addListener(
    event: 'result',
    listener: Listener<[{ transcript: string; confidence: number }[]]>
  ): Unlisten
  addListener(event: 'end', listener: Listener<[]>): Unlisten
  addListener(event: 'error', listener: Listener<[string]>): Unlisten
}

export interface ISpeechRecognitionOpt {
  grammars?: ISpeechGrammarList
  lang?: string
  interimResults?: boolean
  maxAlternatives?: number
  continuous?: boolean
}
