import { ISpeechSynthesisUtterance } from './ISpeechSynthesisUtterance'
import { ISpeechSynthesisVoice } from './ISpeechSynthesisVoice'

export type ISpeechSynthesisOpt = {}

export type ISpeechSynthesis = {
  getVoices: () => ISpeechSynthesisVoice[]
  speak(utterance: ISpeechSynthesisUtterance): void
}
