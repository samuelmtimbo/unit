import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_T } from '../../../../../client/animation'
import classnames from '../../../../../client/classnames'
import Cabinet from '../../../../../client/component/Cabinet/Component'
import mergeStyle from '../../../../../client/component/mergeStyle'
import Minimap, {
  MINIMAP_HEIGHT,
  MINIMAP_WIDTH,
} from '../../../../../client/component/Minimap/Component'
import Search from '../../../../../client/component/Search/Component'
import { Context, setColor, setTheme } from '../../../../../client/context'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeInputListener } from '../../../../../client/event/input'
import { graphComponentFromId } from '../../../../../client/graphComponentFromSpec'
import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import parentElement from '../../../../../client/parentElement'
import {
  defaultThemeColor,
  NONE,
  setAlpha,
  themeBackgroundColor,
} from '../../../../../client/theme'
import { LINK_DISTANCE } from '../../../../../constant/LINK_DISTANCE'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../Unlisten'
import Div from '../../../../platform/component/Div/Component'
import ColorInput from '../../../../platform/component/value/ColorInput/Component'
import Modes from '../Modes/Component'

export interface Props {
  className?: string
  style?: Dict<string>
}

export const DEFAULT_UNIT_ID = 'unit'

const GUI_Z_INDEX = MAX_Z_INDEX - 1000

export const DEFAULT_STYLE = {
  // display: 'none',
  // width: '0px',
  // height: '0px',
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

export default class GUI extends Element<HTMLElement, Props> {
  private _control: Div

  public _search: Search
  public _modes: Modes
  public _cabinet: Cabinet
  public _minimap: Minimap
  public _color_picker: ColorInput
  public _color_pallete: Div

  private _manually_changed_color: boolean = false

  constructor($props: Props) {
    super($props)

    const { className, style = {} } = this.$props

    const modes = new Modes({
      className: 'graph-control-crud',
      style: {
        position: 'absolute',
        top: '50%',
        left: '0px',
        // transition: `transform ${ANIMATION_T}s linear`,
        // transform: 'translate(0%, -50%)',
        transform: 'translate(-100%, -50%)',
        backgroundColor: 'none',
        zIndex: `${GUI_Z_INDEX}`, // AD HOC
      },
    })
    this.$ref['modes'] = modes
    this._modes = modes

    const search = new Search({
      style: {
        position: 'absolute',
        bottom: '0',
        left: '50%',
        // transition: `transform ${ANIMATION_T}s linear`,
        // transform: 'translateX(-50%)',
        transform: 'translate(-50%, 100%)',
        backgroundColor: 'none',
        zIndex: `${GUI_Z_INDEX}`, // AD HOC
      },
    })
    this.$ref['search'] = search
    this._search = search

    const minimap = new Minimap({
      width: MINIMAP_WIDTH,
      height: MINIMAP_HEIGHT,
      nodes: {},
      links: {},
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        touchAction: 'none',
      },
      padding: 1 * LINK_DISTANCE,
    })
    this.$ref['minimap'] = minimap
    this._minimap = minimap

    const TOGGLE_SPEC_ID = '6253bf76-2e85-11eb-9f59-3703abfd39c7'
    const { component: color_theme } = graphComponentFromId(TOGGLE_SPEC_ID, {
      style: {
        height: '26px',
        marginBottom: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'currentColor',
        backgroundColor: NONE,
        // transition: `all ${ANIMATION_T}s linear`,
      },
    })
    color_theme.addEventListener(
      makeInputListener((light: boolean) => {
        if (light) {
          setTheme(this.$context, 'light')
        } else {
          setTheme(this.$context, 'dark')
        }
      })
    )
    const color_picker = new ColorInput({
      value: '#ffffff',
      style: {
        position: 'relative',
        height: 'calc(100% - 28px)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'currentColor',
        boxSizing: 'border-box',
      },
    })
    color_picker.addEventListener(
      makeInputListener((data) => {
        this._manually_changed_color = true
        setColor(this.$context, data)
        this._refresh_color()
      })
    )
    this._color_picker = color_picker

    const color_pallete = new Div({
      style: {
        className: 'gui-color-pallete',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      },
    })
    color_pallete.appendChild(color_theme)
    color_pallete.appendChild(color_picker)
    this._color_pallete = color_pallete

    const cabinet = new Cabinet({
      className: 'graph-control-cabinet',
      style: {
        backgroundColor: 'none',
        zIndex: `${GUI_Z_INDEX}`, // AD HOC
      },
      hidden: true,
    })
    cabinet.addEventListener(
      makeCustomListener(
        'draweractive',
        ({ drawerId }: { drawerId: string }) => {
          if (drawerId === 'theme') {
            setTheme(this.$context, 'light')
          } else if (drawerId === 'reload') {
            location.reload()
          }
        }
      )
    )
    cabinet.addEventListener(
      makeCustomListener(
        'drawerinactive',
        ({ drawerId }: { drawerId: string }) => {
          if (drawerId === 'theme') {
            setTheme(this.$context, 'dark')
          }
        }
      )
    )
    this.$ref['cabinet'] = cabinet
    this._cabinet = cabinet

    const background = new Div({
      className: 'control-background',
    })

    const control = new Div({
      className: classnames('control', className),
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
    })
    this._control = control
    control.registerParentRoot(modes)
    control.registerParentRoot(search)
    control.registerParentRoot(cabinet)
    control.registerParentRoot(background)

    this.$ref['control'] = this

    const $element = parentElement()

    this.$element = $element
    // this.$slot = control.$slot
    this.$slot = background.$slot
    this.$subComponent = {
      control,
      modes,
      search,
      cabinet,
      background,
    }
    this.$unbundled = false

    this.registerRoot(control)
  }

  private _get_color = (): string => {
    const { $theme, $color } = this.$context
    const { style = {} } = this.$props

    let { color = $color } = style
    // let { color = 'currentColor' } = style

    return color
  }

  private _background_color = (): string => {
    const { $theme } = this.$context
    const backgroundColor = setAlpha(themeBackgroundColor($theme), 0.75)
    return backgroundColor
  }

  private _refresh_color = (): void => {
    const color = this._get_color()
    const backgroundColor = this._background_color()

    mergeStyle(this._cabinet, {
      // color,
      backgroundColor,
    })

    mergeStyle(this._modes, {
      backgroundColor,
    })

    mergeStyle(this._search, {
      backgroundColor,
    })

    mergeStyle(this._minimap, {
      color,
    })
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('GUI', 'onPropChanged', prop, current)
    if (prop === 'style') {
      this._control.setProp('style', { ...DEFAULT_STYLE, ...current })
      this._refresh_color()
    }
  }

  private _init: boolean = false

  private _context_unlisten: Unlisten

  onMount() {
    // console.log('GUI', 'onMount')
    if (!this._init) {
      const { $height } = this.$context

      const cy = $height / 2

      this._cabinet.addDrawers({
        minimap: {
          // icon: 'chart-network',
          icon: 'graph',
          title: 'minimap',
          component: this._minimap,
          active: false,
          width: MINIMAP_WIDTH,
          height: MINIMAP_HEIGHT,
          state: { y: cy - 55 },
        },
        color: {
          icon: 'palette',
          title: 'color',
          component: this._color_pallete,
          active: false,
          width: 100,
          height: 100,
          state: { y: cy + 20 },
        },
      })

      this._init = true
    }

    this._context_unlisten = addListeners(this.$context, [
      makeCustomListener('themechanged', this._on_context_theme_changed),
      makeCustomListener('colorchanged', this._on_context_color_changed),
    ])

    setTimeout(() => {
      mergeStyle(this._search, {
        transition: `transform ${ANIMATION_T}s linear`,
      })

      mergeStyle(this._modes, {
        transition: `transform ${ANIMATION_T}s linear`,
      })

      const drawers = this._cabinet.getDrawers()
      for (const drawer_id in drawers) {
        const drawer = drawers[drawer_id]
        mergeStyle(drawer, {
          transition: `transform ${ANIMATION_T}s linear`,
        })
      }
    }, 0)

    this._refresh_color()
  }

  onUnmount($context: Context) {
    // console.log('GUI', 'onUnmount')
    this._context_unlisten()
  }

  private _on_context_theme_changed = (): void => {
    // console.log('GUI', '_on_context_theme_changed')
    const { $theme } = this.$context
    // if (this.$context.$parent === null) {
    document.body.style.backgroundColor = themeBackgroundColor($theme)
    // }

    if (!this._manually_changed_color) {
      const default_theme_color = defaultThemeColor($theme)
      setColor(this.$context, default_theme_color)
      this._color_picker.setProp('value', default_theme_color)
    }

    this._refresh_color()
  }

  private _on_context_color_changed = (): void => {
    // console.log('GUI', 'colorchanged')
    this._refresh_color()
  }

  public hide(): void {
    // console.log('GUI', 'hide')
    // mergeStyle(this._control, {
    //   opacity: '0.2'
    // })

    mergeStyle(this._search, {
      transform: 'translate(-50%, 100%)',
    })

    mergeStyle(this._modes, {
      transform: 'translate(-100%, -50%)',
    })

    this._cabinet.setProp('hidden', true)
  }

  public show(): void {
    // console.log('GUI', 'show')
    // mergeStyle(this._control, {
    //   opacity: '1'
    // })

    mergeStyle(this._search, {
      transform: 'translate(-50%, 0%)',
    })

    mergeStyle(this._modes, {
      transform: 'translate(0%, -50%)',
    })

    this._cabinet.setProp('hidden', false)
  }
}
