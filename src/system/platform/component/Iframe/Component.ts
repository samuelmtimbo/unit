import { Element } from '../../../../client/element'
import { PropHandler, htmlPropHandler } from '../../../../client/propHandler'
import applyStyle from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { randomId } from '../../../../util/id'

export interface Props {
  id: string
  className?: string
  style?: Dict<string>
  src?: string
  srcdoc?: string
  allow?: {
    autoplay?: boolean
    camera?: boolean
    encryptedMedia?: boolean
    fullscreen?: boolean
    microphone?: boolean
    pictureInPicture?: boolean
    scripts?: boolean
  }
}

export const DEFAULT_STYLE = {
  display: 'block',
  border: 'none',
}

export default class Iframe extends Element<
  HTMLSlotElement | HTMLIFrameElement,
  Props
> {
  public _iframe_el: HTMLIFrameElement

  private _slot_id: string

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { id, className, style = {}, src, srcdoc } = this.$props

    const {
      root,
      api: {
        document: { createElement },
      },
    } = this.$system

    const iframe_el = this.$system.api.document.createElement('iframe')
    iframe_el.slot = ''
    root.appendChild(iframe_el)
    this._iframe_el = iframe_el

    iframe_el.setAttribute('frameborder', '0')

    const slot_id = randomId()
    this._slot_id = slot_id

    const slot_el = createElement('slot')
    slot_el.name = slot_id

    if (id !== undefined) {
      iframe_el.id = id
    }
    if (className) {
      iframe_el.className = className
    }
    if (srcdoc !== undefined) {
      iframe_el.srcdoc = srcdoc
    }

    this._setSrc(src)

    applyStyle(iframe_el, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...htmlPropHandler(this, iframe_el, DEFAULT_STYLE),
      srcdoc: (current: string) => {
        this._iframe_el.srcdoc = current || ''
      },
      src: (current: string) => {
        this._setSrc(current)
      },
    }

    this.$element = slot_el
    this.$node = iframe_el
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  private _setSrc(current: string) {
    const _src = this._parseSrc(current)

    if (_src === undefined) {
      this._iframe_el.removeAttribute('src')
    } else {
      this._iframe_el.src = _src
    }
  }

  private _parseSrc(current: any) {
    let _src: string = current

    if (_src !== undefined) {
      if (new RegExp('^(.+)://', 'i').exec(_src)) {
        //
      } else {
        const { origin, pathname } = (window && window.location) || {
          origin: '',
          pathname: '',
        }

        if (_src.startsWith('/')) {
          //
        } else {
          if (pathname.endsWith('/')) {
            //
          } else {
            _src = '/' + _src
          }

          _src = pathname + _src
        }

        _src = origin + _src
      }
    }

    return _src
  }

  onMount(): void {
    // console.log('Iframe', 'onMount')

    this._iframe_el.slot = this._slot_id
  }

  onUnmount() {
    // console.log('Iframe', 'onUnmount')

    this._iframe_el.slot = ''
  }

  send(data) {
    // console.log('Iframe', 'send', data)

    this._iframe_el.contentWindow.postMessage(data, '*')
  }
}
