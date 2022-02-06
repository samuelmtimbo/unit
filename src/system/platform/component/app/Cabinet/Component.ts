import { addListeners } from '../../../../../client/addListener'
import classnames from '../../../../../client/classnames'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { makeResizeListener } from '../../../../../client/event/resize'
import parentElement from '../../../../../client/platform/web/parentElement'
import { SimNode, Simulation } from '../../../../../client/simulation'
import { COLOR_NONE } from '../../../../../client/theme'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { clamp } from '../../../../core/relation/Clamp/f'
import Div from '../../Div/Component'
import Frame from '../../Frame/Component'
import Drawer, { KNOB_HEIGHT, Props as DrawerProps } from '../Drawer/Component'

export interface CabinetDrawer extends DrawerProps {
  active?: boolean
  state?: {
    y?: number
  }
}

export interface Props {
  className?: string
  style?: Dict<string>
  hidden?: boolean
}

export const DEFAULT_STYLE = {
  position: 'absolute',
  right: '0',
  top: '0',
  width: '0',
  height: '0',
}

export default class Cabinet extends Element<HTMLDivElement, Props> {
  private _cabinet: Div

  private _drawer: Dict<CabinetDrawer> = {}
  private _drawer_component: Dict<Drawer> = {}
  private _drawer_node: Dict<SimNode> = {}
  private _drawer_active: Set<string> = new Set()
  private _drawer_y: Dict<number> = {}

  private _simulation: Simulation

  private _component_frame: Dict<Frame> = {}

  private _width: number = 0
  private _height: number = 0

  // z-index

  private _z_index: number = 1

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style = {} } = $props

    const cabinet = new Div(
      {
        className: classnames('cabinet', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
      },
      this.$system,
      this.$pod
    )
    this._cabinet = cabinet

    this._simulation = new Simulation({
      n: 6,
      force: this._force,
    })
    this._simulation.nodes(this._drawer_node)
    this._simulation.addListener('tick', this._tick)

    const $element = parentElement($system)

    this.$element = $element
    this.$subComponent = {
      cabinet,
    }
    this.$unbundled = false

    this.registerRoot(cabinet)
  }

  private _setActive(drawerId: string, active: boolean): void {
    if (active) {
      this._drawer_active.add(drawerId)
    } else {
      this._drawer_active.delete(drawerId)
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._cabinet.setProp('className', current)
    } else if (prop === 'style') {
      this._cabinet.setProp('style', { ...DEFAULT_STYLE, ...current })
      const { style = {} } = this.$props
      const { color = 'currentColor', backgroundColor = COLOR_NONE } = style

      for (const drawerId in this._component_frame) {
        const drawer = this._drawer_component[drawerId]
        mergePropStyle(drawer, {
          color,
          backgroundColor,
        })
      }
    } else if (prop === 'disabled') {
      // TODO
    } else if (prop === 'hidden') {
      if (this._hidden && !current) {
        this.show(false)
      } else if (!this._hidden && current) {
        this.hide(false)
      }
    }
  }

  public setActive(drawerId: string, active: boolean): void {
    const drawer = this._drawer_component[drawerId]
    drawer.setProp('active', active)
  }

  public isActive(drawerId: string): boolean {
    return this._drawer_active.has(drawerId)
  }

  public getDrawer(drawerId: string): Drawer {
    return this._drawer_component[drawerId]
  }

  public setDrawerProp<K extends keyof DrawerProps>(
    drawerId: string,
    name: K,
    value: any
  ): void {
    const drawer_component = this.getDrawer(drawerId)
    drawer_component.setProp(name, value)
  }

  private _tick = () => {
    for (const drawer_id in this._drawer_node) {
      const { y } = this._drawer_node[drawer_id]
      const drawer = this._drawer_component[drawer_id]
      drawer.setProp('y', y)
    }
  }

  private _force = (alpha: number): void => {
    const entries = Object.entries(this._drawer_node)
    const n = entries.length
    for (let i = 0; i < n; i++) {
      const a_entry = entries[i]

      const [a_id, a] = a_entry

      const ay = a.y
      const ah = a.height

      for (let j = i + 1; j < n; j++) {
        const b_entry = entries[j]

        const [b_id, b] = b_entry

        const by = b.y
        const bh = b.height

        let l = 1
        let s = 1

        if (ay + ah <= by) {
          l = by - ay - ah
          s = -1
        } else if (ay <= by) {
          l = ay + ah - by
          s = -1
        } else if (by + bh <= ay) {
          l = ay - by - bh
        } else if (by <= ay) {
          l = by + bh - ay
        } else {
          s = -1
        }

        l = Math.max(l, 3)

        const k = (s * (alpha * 150)) / l

        if (!this._drawer_inactivating.has(a_id)) {
          a.vy += k
        }

        if (!this._drawer_inactivating.has(b_id)) {
          b.vy -= k
        }
      }
    }

    for (const drawer_id in this._drawer_node) {
      if (!this._drawer_inactivating.has(drawer_id)) {
        const node = this._drawer_node[drawer_id]
        const { y, height } = node
        const dy = y + height / 2 - this._height / 2
        node.vy -= (dy * alpha) / 10
      }
    }
  }

  private _on_context_resize =
    // debounce(
    () => {
      // console.log('Cabinet', '_on_context_resize')
      const { $width, $height } = this.$context
      this._on_resize($width, $height)
    }
  // , 300)

  private _on_drawer_drag_start = (drawerId: string, y: number) => {
    // console.log('Cabinet', '_on_drawer_drag_start', y)
    const node = this._drawer_node[drawerId]
    if (node) {
      node.hy = y - node.y
      node.fy = node.y
    }
  }

  private _on_drawer_dragged = (drawerId: string, y: number) => {
    // console.log('Cabinet', '_on_drawer_dragged', y)
    const node = this._drawer_node[drawerId]
    if (node) {
      node.fy = y - node.hy
      node.y = node.fy
      this._startSimulation()
    }
  }

  private _on_drawer_drag_end = (drawerId: string) => {
    // console.log('Cabinet', '_on_drawer_drag_end')
    // this._start_simulation()
    const node = this._drawer_node[drawerId]
    if (node) {
      node.hy = 0
      node.fy = undefined
    }
  }

  public addDrawers = (drawers: Dict<CabinetDrawer>) => {
    for (const drawerId in drawers) {
      const drawer = drawers[drawerId]
      this.addDrawer(drawerId, drawer)
    }
  }

  private _drawer_inactivating: Set<string> = new Set()

  public addDrawer = (drawerId: string, cabinetDrawer: CabinetDrawer) => {
    // console.log('Cabinet', 'addDrawer')

    // const { $width } = this.$context

    const { style = {}, hidden } = this.$props

    let {
      component,
      icon,
      title,
      active,
      state = {},
      width = 0,
      height = KNOB_HEIGHT,
    } = cabinetDrawer
    const { y = 0 } = state

    const { color = 'currentColor', backgroundColor = COLOR_NONE } = style

    this._drawer[drawerId] = cabinetDrawer

    const drawer_component = new Drawer(
      {
        className: 'cabinet-drawer',
        component,
        active,
        icon,
        title,
        y,
        width,
        height,
        hidden,
        style: {
          backgroundColor,
          color,
        },
      },
      this.$system,
      this.$pod
    )
    drawer_component.addEventListener(
      makeCustomListener('active', () => {
        // console.log('Cabinet', '_on_drawer_active')
        // increase zIndex of this drawer on active
        this._inc_drawer_z_index(drawerId)

        this._setActive(drawerId, true)

        this._drawer_y[drawerId] = this._drawer_node[drawerId].y

        const drawer = this._drawer[drawerId]
        const { component } = drawer
        if (component) {
          this._removeDrawerNode(drawerId)
          this._startSimulation()
        }

        const frame = this._component_frame[drawerId]
        frame.setProp('disabled', false)

        this.dispatchEvent('draweractive', { drawerId })
      })
    )
    drawer_component.addEventListener(
      makeCustomListener('inactive', () => {
        // console.log('Cabinet', '_on_drawer_inactive')
        this._setActive(drawerId, false)

        const drawer = this._drawer[drawerId]
        const { component } = drawer
        if (component) {
          const y = this._drawer_y[drawerId] ?? this._height / 2

          this._drawer_inactivating.add(drawerId)

          setTimeout(() => {
            this._drawer_inactivating.delete(drawerId)

            this._startSimulation(0.05)
          }, 200)

          this._addDrawerNode(drawerId, y)

          this._startSimulation(0.05)
        }

        const frame = this._component_frame[drawerId]
        frame.setProp('disabled', true)

        this.dispatchEvent('drawerinactive', { drawerId })
      })
    )
    drawer_component.addEventListener(
      makeCustomListener('dragstart', ({ y }) => {
        // increase this drawer zIndex on dragstart
        this._inc_drawer_z_index(drawerId)
        this._drawer_y[drawerId] = y
        this._on_drawer_drag_start(drawerId, y)
      })
    )
    drawer_component.addEventListener(
      makeCustomListener('dragged', ({ y }) => {
        this._drawer_y[drawerId] = y
        this._on_drawer_dragged(drawerId, y)
      })
    )
    drawer_component.addEventListener(
      makeCustomListener('dragend', () => {
        this._on_drawer_drag_end(drawerId)
      })
    )
    this._drawer_component[drawerId] = drawer_component
    this._cabinet.appendChild(drawer_component)

    const { frame } = drawer_component
    this._component_frame[drawerId] = frame

    if (component) {
      frame.appendChild(component)
    }

    if (!active) {
      this._addDrawerNode(drawerId, y)
    }
  }

  private _addDrawerNode = (drawerId: string, y: number): void => {
    const x = 0
    const r = KNOB_HEIGHT / 2
    const node: SimNode = {
      _x: x,
      _y: y,
      ax: 0,
      ay: 0,
      x,
      y,
      fx: undefined,
      fy: undefined,
      shape: 'rect',
      r,
      width: 0,
      height: KNOB_HEIGHT,
      vx: 0,
      vy: 0,
      hx: 0,
      hy: 0,
    }
    this._drawer_node[drawerId] = node
  }

  private _removeDrawerNode = (drawerId: string): void => {
    delete this._drawer_node[drawerId]
  }

  private _startSimulation = (alpha: number = 0.1): void => {
    // console.log('Cabinet', '_startSimulation')
    this._simulation.alpha(alpha)
    this._simulation.start()
  }

  public removeDrawer(drawerId: string): void {
    const drawer = this._drawer_component[drawerId]

    this._cabinet.removeChild(drawer)

    delete this._drawer[drawerId]
    delete this._drawer_component[drawerId]
    delete this._drawer_node[drawerId]
    delete this._drawer_y[drawerId]
    delete this._drawer_active[drawerId]
  }

  public getDrawers(): Dict<Drawer> {
    return this._drawer_component
  }

  private _context_unlisten: Unlisten

  public onMount() {
    // console.log('Cabinet', 'onMount')
    const { $width, $height } = this.$context

    this._width = $width
    this._height = $height

    this._context_unlisten = addListeners(this.$context, [
      makeResizeListener(this._on_context_resize),
    ])

    this._startSimulation()
  }

  public onUnmount() {
    this._simulation.stop()

    this._context_unlisten()
  }

  private _inc_drawer_z_index = (drawerId: string): void => {
    // increase zIndex of this drawer
    const drawer_component = this._drawer_component[drawerId]

    drawer_component.drawer.$element.style.zIndex = `${this._z_index}`

    this._z_index++
  }

  private _on_resize = ($width: number, $height: number) => {
    // console.log('Cabinet', '_on_resize', $width, $height)

    const dh = $height - this._height
    const dy = dh / 2

    this._width = $width
    this._height = $height

    for (const drawer_id in this._drawer_component) {
      const y = this._drawer_y[drawer_id] ?? 0

      const drawer_component = this._drawer_component[drawer_id]

      const _y = clamp(y + dy, 0, $height - KNOB_HEIGHT + 1)

      drawer_component.setProp('y', _y)

      const node = this._drawer_node[drawer_id]
      if (node) {
        node.y += dy
      }
    }

    this._tick()
  }

  private _hidden: boolean = false

  public show(animate: boolean): void {
    this._hidden = false

    for (const drawer_id in this._drawer_component) {
      const drawer = this._drawer_component[drawer_id]
      drawer.show(animate)
    }
  }

  public hide(animate: boolean): void {
    this._hidden = true

    for (const drawer_id in this._drawer_component) {
      const drawer = this._drawer_component[drawer_id]
      drawer.hide(animate)
    }
  }
}
