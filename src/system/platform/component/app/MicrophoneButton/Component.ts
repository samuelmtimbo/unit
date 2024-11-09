import { localComponentClassFromSpec } from '../../../../../client/unitComponentClassFromSpec'
import { Dict } from '../../../../../types/Dict'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { SpeechRecognitionOpt } from '../../../../../types/global/SpeechRecognition'
import spec = require('../../../core/component/Microphone/spec.json')

export interface Props {
  className?: string
  style?: Dict<string>
  opt?: SpeechRecognitionOpt
}

export default class MicrophoneButton extends localComponentClassFromSpec<
  HTMLDivElement,
  Props
>(spec as GraphSpec) {}
