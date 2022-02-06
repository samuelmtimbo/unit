import { ANIMATION_T_S } from '../../../../../../client/animation/ANIMATION_T_S'
import { mergeStyle } from '../../../../../../client/applyStyle'
import { Component } from '../../../../../../client/component'
import { makeClickListener } from '../../../../../../client/event/pointer/click'
import { VMSpec } from '../../../../../../client/host/service/vm'
import parentElement from '../../../../../../client/platform/web/parentElement'
import { getActiveColor } from '../../../../../../client/theme'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'
import CloudTabs from '../../../../../host/component/IconTabs/Component'
import { dragOverTimeListener } from '../../../../../host/component/IconTabs/dragOverTimeListener'
import TextDiv from '../../../../core/component/TextDiv/Component'
import Div from '../../../Div/Component'
import Icon from '../../../Icon/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  overflowY: 'auto',
  paddingTop: '3px',
  paddingBottom: '3px',
}

export default class VMServiceComponent extends Component<
  HTMLDivElement,
  Props
> {
  private _tabs: CloudTabs

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style } = $props

    const tabs = new CloudTabs(
      {
        // tabs: ['cloud', 'shared'],
        style,
      },
      this.$system,
      this.$pod
    )
    this._tabs = tabs

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = tabs.$slot
    this.$subComponent = {
      tabs,
    }
    this.$unbundled = false

    this.registerRoot(tabs)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._tabs.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  onMount(): void {}

  private _item: Dict<Div> = {}
  private _item_chevron: Dict<Icon> = {}
  private _item_content: Dict<Div> = {}

  private _item_on: Dict<boolean> = {}
  private _item_detail: Dict<boolean> = {}

  private _render_item = (id: string, vm: VMSpec): Div => {
    const { name, on, units, config } = vm

    const { cpu, memory, network } = config

    const item = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: 'fit-content',
          borderBottom: '1px solid currentColor',
        },
      },
      this.$system,
      this.$pod
    )
    this._item[id] = item

    const title = new Div(
      {
        style: {
          display: 'flex',
          height: '45px',
          alignItems: 'center',
        },
      },
      this.$system,
      this.$pod
    )

    item.appendChild(title)

    const power = new Icon(
      {
        icon: 'power-off',
        style: {
          width: '18px',
          height: '18px',
          margin: '6px',
          cursor: 'pointer',
          transition: `color ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    power.addEventListener(
      makeClickListener({
        onClick: () => {
          const { $theme } = this.$context
          this._item_on[id] = !this._item_on[id]
          const color = this._item_on[id]
            ? getActiveColor($theme)
            : 'currentColor'
          mergeStyle(power, {
            color,
          })
        },
      })
    )

    title.appendChild(power)

    const main = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 'calc(100% - 60px)',
          paddingLeft: '6px',
          paddingRight: '6px',
        },
      },
      this.$system,
      this.$pod
    )
    title.appendChild(main)

    const name_comp = new TextDiv(
      {
        value: name,
        style: {
          height: 'fit-content',
          fontWeight: '600',
        },
      },
      this.$system,
      this.$pod
    )
    main.appendChild(name_comp)

    const id_comp = new TextDiv(
      {
        value: id,
        style: {
          height: 'fit-content',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          maxWidth: '100%',
        },
      },
      this.$system,
      this.$pod
    )
    main.appendChild(id_comp)

    const chevron = new Icon(
      {
        icon: 'chevron-up',
        style: {
          width: '18px',
          height: '18px',
          padding: '6px',
          cursor: 'pointer',
          transition: `transform ${ANIMATION_T_S}s linear`,
        },
      },
      this.$system,
      this.$pod
    )
    dragOverTimeListener(chevron, 500, () => {
      this._toggle_detail(id)
    })
    chevron.addEventListener(
      makeClickListener({
        onClick: () => {
          this._toggle_detail(id)
        },
      })
    )
    this._item_chevron[id] = chevron
    title.appendChild(chevron)

    const content = new Div(
      {
        style: {
          height: '0px',
          transition: `height ${ANIMATION_T_S}s linear, opacity ${ANIMATION_T_S}s linear`,
          display: 'flex',
          overflow: 'hidden',
          justifyContent: 'center',
          gap: '18px',
          alignItems: 'center',
        },
      },
      this.$system,
      this.$pod
    )
    this._item_content[id] = content
    item.appendChild(content)

    const content_cpu = new VMConfigMeter(
      {
        icon: 'microchip',
        name: 'net',
        power: cpu,
      },
      this.$system,
      this.$pod
    )
    content.appendChild(content_cpu)

    const content_memory = new VMConfigMeter(
      {
        icon: 'memory',
        name: 'mem',
        power: memory,
      },
      this.$system,
      this.$pod
    )
    content.appendChild(content_memory)

    const content_network = new VMConfigMeter(
      {
        icon: 'ethernet',
        name: 'net',
        power: network,
      },
      this.$system,
      this.$pod
    )
    content.appendChild(content_network)

    return item
  }

  private _toggle_detail = (id: string): void => {
    this._item_detail[id] = !this._item_detail[id]
    const detail = this._item_detail[id]
    const chevron = this._item_chevron[id]
    const content = this._item_content[id]
    const angle = detail ? 180 : 0
    mergeStyle(chevron, {
      transform: `rotate3d(1, 0, 0, ${angle}deg)`,
    })
    mergeStyle(content, {
      height: detail ? '90px' : '0px',
      opacity: detail ? '1' : '0',
    })
  }
}

export type VMConfigMeterProps = {
  name: string
  icon: string
  power: number
}

export class VMConfigMeter extends Component<HTMLElement, VMConfigMeterProps> {
  constructor($props: VMConfigMeterProps, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { name, icon, power } = this.$props

    const container = new Div(
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'fit-content',
        },
      },
      this.$system,
      this.$pod
    )

    const circle = new Div(
      {
        style: {
          position: 'relative',
          width: 'fit-content',
          height: 'fit-content',
        },
      },
      this.$system,
      this.$pod
    )
    container.registerParentRoot(circle)

    const meter = new Div(
      {
        style: {
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          border: '2px solid currentColor',
        },
      },
      this.$system,
      this.$pod
    )
    circle.registerParentRoot(meter)

    const icon_comp = new Icon(
      {
        icon,
        style: {
          width: '18px',
          height: '18px',
          padding: '6px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      },
      this.$system,
      this.$pod
    )
    circle.registerParentRoot(icon_comp)

    const title = new TextDiv(
      {
        value: name,
        style: {
          marginTop: '6px',
          textAlign: 'center',
          fontWeight: '600',
        },
      },
      this.$system,
      this.$pod
    )
    container.registerParentRoot(title)

    const $element = parentElement($system)

    this.$element = $element

    this.registerRoot(container)
  }
}
