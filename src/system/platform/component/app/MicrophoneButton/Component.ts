import { Mode } from '../../../../../client/mode'
import { localComponentClassFromSpec } from '../../../../../client/unitComponentClassFromSpec'
import { Dict } from '../../../../../types/Dict'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { SpeechRecognitionOpt } from '../../../../../types/global/SpeechRecognition'
import spec = require('../../../core/component/Microphone/spec.json')

export interface Props {
  className?: string
  style?: Dict<string>
  mode?: Mode
  disabled?: boolean
  opt?: SpeechRecognitionOpt
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  touchAction: 'none',
}

export default class MicrophoneButton extends localComponentClassFromSpec<
  HTMLDivElement,
  Props
>(spec as GraphSpec) {}
