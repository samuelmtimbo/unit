import { getPublicKeyList } from '../../../../../../api/keys'
import { linearTransition } from '../../../../../../client/animation/animation'
import { ANIMATION_T_S } from '../../../../../../client/animation/ANIMATION_T_S'
import { Component } from '../../../../../../client/component'
import mergeProps from '../../../../../../client/component/mergeProps'
import mergePropStyle from '../../../../../../client/component/mergeStyle'
import { makeClickListener } from '../../../../../../client/event/pointer/click'
import { randomNaturalBetween } from '../../../../../../client/math'
import parentElement from '../../../../../../client/platform/web/parentElement'
import {
  COLOR_NONE,
  COLOR_YELLOW,
  randomColorString,
} from '../../../../../../client/theme'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import { rangeArray } from '../../../../../../util/array'
import Unplugged from '../../../../../host/component/Unplugged/Component'
import TextDiv from '../../../../core/component/TextDiv/Component'
import Div from '../../../Div/Component'
import Icon from '../../../Icon/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'center',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'currentColor',
  // padding: '9px',
  borderRadius: '3px',
  overflowY: 'auto',
  overflowX: 'hidden',
}

export const BUTTON_STYLE = {
  width: '33px',
  height: '33px',
  padding: '6px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  borderRadius: '3px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: COLOR_NONE,
}

export default class User extends Component<HTMLDivElement, Props> {
  private _root: Div

  private _picture: Div
  private _unplugged: Unplugged

  private _hex_text: TextDiv

  private _selector: Div
  private _selector_handle: Div
  private _selector_unplugged_list: Div
  private _selector_unplugged_list_car: Div
  private _selector_bullet_list: Div

  private _selected: number = 0

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const root = new Div(
      {
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    this._root = root

    const unplugged = new Unplugged(
      {
        style: {
          display: 'inline-block',
          width: '100%',
          // height: 'calc(80% - 75px)',
          height: 'calc(80% - 30px)',
          transition: linearTransition('color'),
          cursor: 'pointer',
        },
      },
      this.$system,
      this.$pod
    )
    unplugged.addEventListener(
      makeClickListener({
        onClick: async () => {
          const {
            api: {
              clipboard: { writeText },
            },
          } = this.$system

          const address = this._public_key_addr[this._selected]

          try {
            await writeText(`'${address}'`)
          } catch (err) {
            // swallow
          }
        },
      })
    )
    this._unplugged = unplugged

    const selector = new Div(
      {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '20%',
        },
      },
      this.$system,
      this.$pod
    )
    this._selector = selector

    const unplugged_list = new Div(
      {
        style: {
          width: '100%',
          height: '80%',
          // whiteSpace: 'nowrap',
        },
      },
      this.$system,
      this.$pod
    )
    this._selector_unplugged_list = unplugged_list

    const unplugged_list_car = new Div(
      {
        style: {
          width: 'fit-content',
          height: '100%',
          whiteSpace: 'nowrap',
          transform: 'translateX(0)',
          transition: linearTransition('transform'),
        },
      },
      this.$system,
      this.$pod
    )
    this._selector_unplugged_list_car = unplugged_list_car
    this._selector_unplugged_list.appendParentRoot(unplugged_list_car)

    const selector_bullet_list = new Div(
      {
        style: {
          width: 'fit-content',
          height: 'fit-content',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        },
      },
      this.$system,
      this.$pod
    )
    this._selector_bullet_list = selector_bullet_list
    this._selector.appendParentRoot(selector_bullet_list)

    const selector_handle = new Div(
      {
        style: {
          position: 'absolute',
          opacity: '0',
          width: '20px',
          height: '20px',
          background: 'none',
          border: '2px solid currentColor',
          borderRadius: '50%',
          cursor: 'pointer',
          pointerEvents: 'none',
          transition: linearTransition('transform', 'color'),
        },
      },
      this.$system,
      this.$pod
    )
    this._selector_handle = selector_handle
    this._selector.appendParentRoot(selector_handle)

    const hex_text = new TextDiv(
      {
        value: randomColorString().replace('#', '0x'),
        style: {
          fontSize: '15px',
          // fontWeight: '600',
          textAlign: 'center',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: linearTransition('color'),
          cursor: 'pointer',
        },
      },
      this.$system,
      this.$pod
    )
    this._hex_text = hex_text

    const scope_list = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '12px',
          height: '39px',
          marginBottom: '6px',
          overflow: 'auto',
          transition: `height ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )

    const memory = this._create_button('memory', 'cpu')
    const session = this._create_button('session', 'sliders')
    const local = this._create_button('local', 'home')

    scope_list.registerParentRoot(memory)
    scope_list.registerParentRoot(session)
    scope_list.registerParentRoot(local)

    this._select_button('local')

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$subComponent = {
      root,
    }
    this.$unbundled = false

    this.registerRoot(root)

    // root.appendParentRoot(unplugged_list)
    root.registerParentRoot(unplugged)
    root.registerParentRoot(hex_text)
    root.registerParentRoot(selector)
    // root.registerParentRoot(scope_list)
    ;(async () => {
      const public_keys = await getPublicKeyList(this.$system)

      const public_key_active: boolean[] = [true, false, false]

      this._public_key_code = public_keys.map(() => {
        return rangeArray(6).map(() => randomNaturalBetween(0, 10))
      })

      this._public_key_addr = public_keys.map(() => {
        return randomColorString().replace('#', '0x')
      })

      const l = public_keys.length

      for (let i = 0; i < l; i++) {
        const public_key = public_keys[i]

        const active = public_key_active[i]

        const color = active ? COLOR_YELLOW : 'currentColor'

        const selector_item_unplugged = new Unplugged(
          {
            style: {
              display: 'inline-block',
              width: '100%',
              height: '100%',
              color,
            },
          },
          this.$system,
          this.$pod
        )
        this._selector_unplugged_list_car.appendChild(selector_item_unplugged)

        const selector_item_bullet = new Div(
          {
            style: {
              width: '12px',
              height: '12px',
              background: 'currentColor',
              color,
              border: `2px solid currentColor`,
              fill: 'currentColor',
              borderRadius: '50%',
              cursor: 'pointer',
            },
          },
          this.$system,
          this.$pod
        )

        selector_item_bullet.addEventListener(
          makeClickListener({
            onClick: () => {
              const public_key = public_keys[i]

              const active = public_key_active[i]

              const color = active ? COLOR_YELLOW : 'currentColor'

              mergePropStyle(this._unplugged, {
                color,
              })

              mergePropStyle(this._hex_text, {
                color,
              })

              mergePropStyle(selector_item_bullet, {
                color,
              })

              mergePropStyle(this._selector_handle, {
                color,
              })

              mergeProps(this._unplugged, {
                id: this._public_key_code[i],
              })

              mergePropStyle(this._selector_handle, {
                transform: `translate(${(12 + 12) * (i - 1)}px)`,
              })

              // mergePropStyle(this._selector_unplugged_list_car, {
              //   transform: `translate(-${i * 100}%)`
              // })

              this._hex_text.setProp('value', this._public_key_addr[i])

              this._selected = i
            },
          })
        )

        this._selector_bullet_list.appendChild(selector_item_bullet)
      }

      if (l > 0) {
        const active = public_key_active[0]

        const color = active ? COLOR_YELLOW : 'currentColor'

        mergeProps(this._unplugged, {
          id: this._public_key_code[0],
        })

        mergePropStyle(this._unplugged, {
          color,
        })

        mergePropStyle(this._hex_text, {
          color,
        })

        mergePropStyle(this._selector_handle, {
          color,
          opacity: '1',
          transform: `translate(${(-l * 16) / 2}px)`,
        })
      }
    })()
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  private _selected_button: string | null = null
  private _button: Dict<Icon> = {}

  private _create_button = (
    name: string,
    icon: string,
    component: Component | null = null
  ): Icon => {
    const button = new Icon(
      {
        icon,
        style: {
          ...BUTTON_STYLE,
        },
      },
      this.$system,
      this.$pod
    )
    button.addEventListener(
      makeClickListener({
        onClick: () => {
          this._select_button(name)
        },
      })
    )
    this._button[name] = button

    return button
  }

  private _select_button = (name: string): void => {
    if (this._selected_button) {
      const selected_button = this._button[this._selected_button]
      mergePropStyle(selected_button, {
        borderColor: COLOR_NONE,
      })
    }

    this._selected_button = name

    const button = this._button[name]

    mergePropStyle(button, {
      borderColor: 'currentColor',
    })
  }

  private _public_key_code: number[][]
  private _public_key_addr: string[]

  onMount(): void {}
}
