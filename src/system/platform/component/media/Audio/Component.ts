import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
  controls?: boolean
  stream?: MediaStream
}

export const DEFAULT_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
  // outline: 'none',
}

export default class AudioComp extends Element<HTMLAudioElement, Props> {
  private _audio_el: HTMLAudioElement

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style = {}, src, controls = true } = this.$props
    const audio_element = this.$system.api.document.createElement('audio')
    audio_element.controls = controls
    if (className) {
      audio_element.className = className
    }
    if (src) {
      audio_element.src = src
    }
    applyStyle(audio_element, { ...DEFAULT_STYLE, ...style })
    this._audio_el = audio_element

    this.$element = audio_element
  }

  private propHandler = {
    className: (className: string | undefined = ''): void => {
      this._audio_el.className = className
    },
    style: (style: Dict<any>): void => {
      applyStyle(this._audio_el, { ...DEFAULT_STYLE, ...style })
    },
    src: (src: string | undefined) => {
      if (src === undefined) {
        this._audio_el.pause()
        this._audio_el.removeAttribute('src') // empty source
        this._audio_el.load()
      } else {
        this._audio_el.src = src
      }
    },
    stream: (stream: MediaStream | undefined): void => {
      if (stream === undefined) {
        this._audio_el.srcObject = null
      } else {
        this._audio_el.srcObject = stream
      }
    },
    controls: (controls: boolean | undefined): void => {
      if (controls === undefined) {
        this._audio_el.removeAttribute('controls')
      } else {
        this._audio_el.controls = controls
      }
    },
  }

  onPropChanged(prop: string, current: any): void {
    this.propHandler[prop](current)
  }
}
