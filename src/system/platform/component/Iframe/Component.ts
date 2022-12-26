import { Element } from '../../../../client/element'
import applyStyle from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { randomId } from '../../../../util/id'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  src?: string
  srcdoc?: string
}

export const DEFAULT_STYLE = {
  display: 'block',
  width: '100%',
  height: '100%',
  border: 'none',
}

export default class Iframe extends Element<HTMLSlotElement, Props> {
  public _iframe_el: HTMLIFrameElement

  private _slot_id: string
  private _slot_el: HTMLSlotElement

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

    const slot_id = randomId()
    this._slot_id = slot_id

    const slot_el = createElement('slot')
    slot_el.name = slot_id
    this._slot_el = slot_el

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

    this.$element = slot_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._iframe_el.className = current
    } else if (prop === 'style') {
      applyStyle(this._iframe_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'src') {
      this._setSrc(current)
    } else if (prop === 'srcdoc') {
      this._iframe_el.srcdoc = current || ''
    }
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
    let _src = current

    if (_src !== undefined) {
      if (_src.startsWith('http://') || _src.startsWith('https://')) {
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
    console.log('Iframe', 'send', data)

    this._iframe_el.contentWindow.postMessage(data, '*')
  }
}
