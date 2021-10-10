import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { loadStyle } from '../../../../../client/style'
import { Dict } from '../../../../../types/Dict'
import {
  basePropHandler,
  inputPropHandler,
  PropHandler,
} from '../../propHandler'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  config?: {
    tab?: string
  }
  lang?: string
  theme?: string
}

export const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
}

export default class CodeEditor extends Element<HTMLDivElement, Props> {
  private _div_el: HTMLDivElement

  private _prop_handler: PropHandler

  private _value: string
  private _lang: string = 'js'
  private _theme: string = 'dark'

  constructor($props: Props) {
    super($props)

    let { style = {}, value = '' } = $props

    style = { ...DEFAULT_STYLE, ...style }

    const div_el = document.createElement('div')

    div_el.className = 'editor language-js'

    applyStyle(div_el, { ...DEFAULT_STYLE, ...style })

    this._div_el = div_el

    this._prop_handler = {
      ...basePropHandler(this._div_el, DEFAULT_STYLE),
      ...inputPropHandler(this._div_el, 'value', ''),
      lang: (lang: string | undefined): void => {
        lang = lang || 'js'

        div_el.className = `editor language-${lang}`

        this._jar.updateCode(this._value)
      },
      theme: async (theme: string | undefined): Promise<void> => {
        theme = theme || 'dark'

        const CURRENT_PRISM_CSS_URL = this._get_prism_theme_href(this._theme)

        const current_style_tag =
          this.$system.$deps.$style[CURRENT_PRISM_CSS_URL]

        // @ts-ignore
        current_style_tag.disabled = true

        this._theme = theme

        const style_tag = await this._load_theme(theme)

        style_tag.disabled = false
      },
    }

    this.$element = div_el
  }

  private _jar: any

  private async _load() {
    this._load_theme(this._theme)

    const [Prism, CodeJar] = await Promise.all([
      this._load_prism(),
      this._load_codejar(),
    ])

    const jar = new CodeJar(
      this._div_el,
      (editor: HTMLElement) => {
        return Prism.highlightElement(editor)
      },
      {
        tab: '  ',
        spellcheck: false,
      }
    )

    jar.onUpdate((code) => {
      this._value = code

      this.set('value', this._value)
    })

    this._jar = jar
  }

  private _get_prism_theme_href = (theme: string): string => {
    const { href } = location

    return `${href}3rd/prism/theme/${theme}.min.css`
  }

  private async _load_theme(theme: string): Promise<any> {
    // console.log('CodeEditor', '_load_theme', theme)
    const PRISM_CSS_URL = this._get_prism_theme_href(theme)

    return await loadStyle(this.$system, { href: PRISM_CSS_URL })
  }

  private async _load_codejar(): Promise<any> {
    const { href } = location
    const CODEJAR_JS_URL = `${href}/3rd/codejar.js`
    const { CodeJar } = await import(CODEJAR_JS_URL)
    return CodeJar
  }

  private async _load_prism(): Promise<any> {
    const { href } = location
    const PRISM_JS_URL = `${href}/3rd/prism/prism.js`
    await import(PRISM_JS_URL)
    return globalThis.Prism
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }

  onMount() {
    this._load()
  }
}
