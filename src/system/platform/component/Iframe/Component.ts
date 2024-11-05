import { applyAttr } from '../../../../client/attr'
import { Element } from '../../../../client/element'
import { PropHandler, htmlPropHandler } from '../../../../client/propHandler'
import { applyDynamicStyle } from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { CH } from '../../../../types/interface/CH'
import { W } from '../../../../types/interface/W'
import { pull, push } from '../../../../util/array'
import { randomId } from '../../../../util/id'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
  srcdoc?: string
  attr?: Dict<string>
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

export default class Iframe
  extends Element<HTMLSlotElement | HTMLIFrameElement, Props>
  implements CH, W
{
  public _iframe: HTMLIFrameElement

  private _slot_id: string

  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style, attr, src, srcdoc } = this.$props

    const DEFAULT_STYLE = $system.style['iframe']

    const DEFAULT_ATTR = {
      frameborder: '0',
      allowfullscreen: 'true',
    }

    const {
      root,
      api: {
        document: { createElement },
      },
    } = this.$system

    const iframe_el = this.$system.api.document.createElement('iframe')
    iframe_el.slot = ''
    root.appendChild(iframe_el)
    this._iframe = iframe_el

    const slot_id = randomId()
    this._slot_id = slot_id

    const slot_el = createElement('slot')
    slot_el.name = slot_id

    if (srcdoc !== undefined) {
      iframe_el.srcdoc = srcdoc
    }

    this._setSrc(src)

    const $controlled = new Set(['src', 'srcdoc'])

    applyAttr(iframe_el, { ...DEFAULT_ATTR, ...attr }, {}, $controlled)
    applyDynamicStyle(this, iframe_el, { ...DEFAULT_STYLE, ...style })

    this._prop_handler = {
      ...htmlPropHandler(
        this,
        iframe_el,
        DEFAULT_STYLE,
        DEFAULT_ATTR,
        $controlled
      ),
      srcdoc: (current: string) => {
        this._iframe.srcdoc = current || ''
      },
      src: (current: string) => {
        this._setSrc(current)
      },
    }

    this.$element = slot_el
    this.$node = iframe_el

    push(this.$system.cache.iframe, this)
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  private _setSrc(current: string) {
    const _src = this._parseSrc(current)

    if (_src === undefined) {
      this._iframe.removeAttribute('src')
    } else {
      this._iframe.src = _src
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

    this._iframe.slot = this._slot_id
  }

  onUnmount() {
    // console.log('Iframe', 'onUnmount')

    this._iframe.slot = ''
  }

  onDestroy(): void {
    pull(this.$system.cache.iframe, this)
  }

  async send(data): Promise<void> {
    // console.log('Iframe', 'send', data)

    this._iframe.contentWindow.postMessage(data, '*')
  }

  postMessage(data: any, target: string, transferables: Transferable[]): void {
    this._iframe.contentWindow.postMessage(data, target, transferables)
  }
}
