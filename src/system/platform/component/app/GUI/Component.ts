import { addListeners } from '../../../../../client/addListener'
import { ANIMATION_T_MS } from '../../../../../client/animation/animation'
import classnames from '../../../../../client/classnames'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Context, setColor, setTheme } from '../../../../../client/context'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeInputListener } from '../../../../../client/event/input'
import { graphComponentFromId } from '../../../../../client/graphComponentFromSpec'
import { MAX_Z_INDEX } from '../../../../../client/MAX_Z_INDEX'
import parentElement from '../../../../../client/platform/web/parentElement'
import {
  COLOR_NONE,
  defaultThemeColor,
  setAlpha,
  themeBackgroundColor,
} from '../../../../../client/theme'
import { LINK_DISTANCE } from '../../../../../constant/LINK_DISTANCE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import Modes from '../../../component/app/Modes/Component'
import Div from '../../Div/Component'
import ColorInput from '../../value/ColorInput/Component'
import Cabinet from '../Cabinet/Component'
import { MINIMAP_HEIGHT, MINIMAP_WIDTH } from '../History/Component'
import Minimap from '../Minimap/Component'
import Search from '../Search/Component'

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

export default class GUI extends Element<HTMLDivElement, Props> {
  private _gui: Div

  private _background: Div

  public _search: Search
  public _modes: Modes
  public _cabinet: Cabinet
  public _minimap: Minimap
  public _color_picker: ColorInput
  public _color_pallete: Div
  public _history: Div

  private _manually_changed_color: boolean = false

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style = {} } = this.$props

    const modes = new Modes(
      {
        className: 'graph-gui-crud',
        style: {
          position: 'absolute',
          top: '50%',
          left: '0px',
          transform: 'translate(0%, -50%)',
          backgroundColor: 'none',
          zIndex: `${GUI_Z_INDEX}`, // AD HOC
        },
      },
      this.$system,
      this.$pod
    )
    this.$ref['modes'] = modes
    this._modes = modes

    const search = new Search(
      {
        style: {
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translate(-50%, 0%)',
          backgroundColor: 'none',
          zIndex: `${GUI_Z_INDEX}`, // AD HOC
        },
      },
      this.$system,
      this.$pod
    )
    this.$ref['search'] = search
    this._search = search

    const minimap = new Minimap(
      {
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
      },
      this.$system,
      this.$pod
    )
    this.$ref['minimap'] = minimap
    this._minimap = minimap

    const history_tree = new Div(
      {
        style: {
          position: 'absolute',
          width: `${MINIMAP_HEIGHT}px`,
          height: `${MINIMAP_HEIGHT * 1.5}`,
          touchAction: 'none',
        },
      },
      this.$system,
      this.$pod
    )
    this.$ref['history'] = history_tree
    this._history = history_tree

    const TOGGLE_SPEC_ID = '6253bf76-2e85-11eb-9f59-3703abfd39c7'
    const { component: color_theme } = graphComponentFromId(
      this.$system,
      this.$pod,
      TOGGLE_SPEC_ID,
      {
        style: {
          height: '26px',
          marginBottom: '3px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          backgroundColor: COLOR_NONE,
        },
      }
    )
    color_theme.addEventListener(
      makeInputListener((light: boolean) => {
        if (light) {
          setTheme(this.$context, 'light')
        } else {
          setTheme(this.$context, 'dark')
        }
      })
    )
    const color_picker = new ColorInput(
      {
        value: '#ffffff',
        style: {
          position: 'relative',
          height: 'calc(100% - 28px)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'currentColor',
          boxSizing: 'border-box',
        },
      },
      this.$system,
      this.$pod
    )
    color_picker.addEventListener(
      makeInputListener((data) => {
        this._manually_changed_color = true
        setColor(this.$context, data)
        this._refresh_color()
      })
    )
    this._color_picker = color_picker

    const color_pallete = new Div(
      {
        style: {
          className: 'gui-color-pallete',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        },
      },
      this.$system,
      this.$pod
    )
    color_pallete.appendChild(color_theme)
    color_pallete.appendChild(color_picker)
    this._color_pallete = color_pallete

    const cabinet = new Cabinet(
      {
        className: 'graph-gui-cabinet',
        style: {
          backgroundColor: 'none',
          zIndex: `${GUI_Z_INDEX}`, // AD HOC
        },
        // hidden: true,
      },
      this.$system,
      this.$pod
    )
    cabinet.addEventListener(
      makeCustomListener(
        'draweractive',
        ({ drawerId }: { drawerId: string }) => {
          if (drawerId === 'theme') {
            setTheme(this.$context, 'light')
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

    const background = new Div(
      {
        className: 'gui-background',
        style: {
          position: 'absolute',
          top: '0px',
          left: '0px',
        },
      },
      this.$system,
      this.$pod
    )
    this._background = background

    const foreground = new Div(
      {
        className: 'gui-foreground',
        style: {
          position: 'absolute',
          top: '0px',
          left: '0px',
        },
      },
      this.$system,
      this.$pod
    )

    const control = new Div(
      {
        className: classnames('gui-control', className),
        style: {},
      },
      this.$system,
      this.$pod
    )
    control.registerParentRoot(modes)
    control.registerParentRoot(search)
    control.registerParentRoot(cabinet)

    const gui = new Div(
      {
        className: classnames('gui', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    gui.registerParentRoot(background)
    gui.registerParentRoot(foreground)
    gui.registerParentRoot(control)

    this._gui = gui

    this.$ref['control'] = this

    const $element = parentElement($system)

    this.$element = $element
    // this.$slot = control.$slot
    this.$slot['default'] = foreground
    this.$slot['1'] = background
    this.$subComponent = {
      control: gui,
      modes,
      search,
      cabinet,
      background,
    }
    this.$unbundled = false

    this.registerRoot(gui)
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

    mergePropStyle(this._cabinet, {
      backgroundColor,
    })

    mergePropStyle(this._modes, {
      backgroundColor,
    })

    mergePropStyle(this._search, {
      backgroundColor,
    })

    mergePropStyle(this._minimap, {
      color,
    })
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('GUI', 'onPropChanged', prop, current)
    if (prop === 'style') {
      this._gui.setProp('style', { ...DEFAULT_STYLE, ...current })
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

    this._refresh_color()
  }

  onUnmount($context: Context) {
    // console.log('GUI', 'onUnmount')
    this._context_unlisten()
  }

  private _on_context_theme_changed = (): void => {
    // console.log('GUI', '_on_context_theme_changed')
    const { $theme } = this.$context
    if (this.$context.$parent === null) {
      document.body.style.backgroundColor = themeBackgroundColor($theme)
    }

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

  public hide(animate: boolean): void {
    // console.log('GUI', 'hide')

    this.hide_background(animate)

    this.hide_search(animate)
    this.hide_modes(animate)
    this.hide_cabinet(animate)
  }

  public _animate_background = (
    style: Dict<string>,
    animate: boolean
  ): void => {
    const duration = animate ? ANIMATION_T_MS : 0
    const fill = 'forwards'

    this._background.$element.animate(style, {
      duration,
      fill,
    })
  }

  public _animate_search = (style: Dict<string>, animate: boolean) => {
    const duration = animate ? ANIMATION_T_MS : 0
    const fill = 'forwards'

    this._search._search.$element.animate(style, {
      duration,
      fill,
    })
  }

  public hide_background = (animate: boolean): void => {
    this._animate_background(
      {
        opacity: '0.25',
      },
      animate
    )
  }

  public hide_search = (animate: boolean): void => {
    this._animate_search(
      {
        transform: 'translate(-50%, 100%)',
      },
      animate
    )
  }

  private _animate_modes = (style: Dict<string>, animate: boolean): void => {
    const duration = animate ? ANIMATION_T_MS : 0
    const fill = 'forwards'

    this._modes._modes.$element.animate([style], {
      duration,
      fill,
    })
  }

  public hide_modes = (animate: boolean = true): void => {
    this._animate_modes(
      {
        transform: 'translate(-100%, -50%)',
      },
      animate
    )
  }

  public hide_cabinet = (animate: boolean): void => {
    this._cabinet.hide(animate)
  }

  public show_background = (animate: boolean): void => {
    this._animate_background(
      {
        opacity: '1',
      },
      animate
    )
  }

  public show_search = (animate: boolean): void => {
    this._animate_search(
      {
        transform: 'translate(-50%, 0%)',
      },
      animate
    )
  }

  public show_modes = (animate: boolean): void => {
    this._animate_modes(
      {
        transform: 'translate(0%, -50%)',
      },
      animate
    )
  }

  public show_cabinet = (animate: boolean): void => {
    this._cabinet.show(animate)
  }

  public show(animate: boolean): void {
    // console.log('GUI', 'show')

    this.show_background(animate)

    this.show_search(animate)
    this.show_modes(animate)
    this.show_cabinet(animate)
  }
}
