import { Component } from '../../client/component'
import {
  appendChild,
  appendParentChild,
  hasChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  reorderParentRoot,
  reorderRoot,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { MethodNotImplementedError } from '../../exception/MethodNotImplementedError'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { C_EE } from '../../types/interface/C'
import { ComponentEvents, Component_ } from '../../types/interface/Component'
import { E } from '../../types/interface/E'
import { UnitBundle } from '../../types/UnitBundle'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { forEach } from '../../util/array'
import { Stateful, StatefulEvents } from '../Stateful'
import { ION, Opt } from '../Unit'

export type Element_EE = C_EE & { call: [{ method: string; data: any[] }] }

export type ElementEE<_EE extends Dict<any[]>> = StatefulEvents<
  _EE & Element_EE
> &
  Element_EE

export class Element_<
    I = any,
    O = any,
    _J extends Dict<any> = {},
    _EE extends ElementEE<_EE> = ElementEE<Element_EE>,
    _C extends Component = Component
  >
  extends Stateful<I, O, {}, _EE>
  implements E
{
  __ = ['U', 'C', 'J', 'V', 'EE']

  public _children: Component_[] = []
  public _root: Component_[] = []
  public _parent_root: Component_[] = []
  public _parent_children: Component_[] = []
  public _slot: Dict<Component_> = {}
  public _component: _C
  public _state: Dict<any> = {}

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      id
    )

    this.addListener('play', this._play)
    this.addListener('pause', this._pause)
    this.addListener('set', (name: keyof I, data) => {
      if (!this._forwarding && data !== undefined) {
        this._backwarding = true

        // TODO add to end of event queue
        setTimeout(() => {
          this._input?.[name]?.pull()

          this._backwarding = false
        }, 0)
      }

      this._forwarding = true
      if (data === undefined) {
        // @ts-ignore
        this._output?.[name]?.pull()
      } else {
        // @ts-ignore
        this._output?.[name]?.push(data)
      }
      this._forwarding = false
    })

    this._slot = {
      default: this,
    }
  }
  getBundleSpec(): UnitBundleSpec {
    throw new MethodNotImplementedError()
  }

  registerRoot(component: Component_): void {
    return registerRoot(this, this._root, component)
  }

  unregisterRoot(component: Component_): void {
    return unregisterRoot(this, this._root, component)
  }

  reorderRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderRoot(this, this._root, component, to)
  }

  registerParentRoot(component: Component_, slotName: string): void {
    return registerParentRoot(this, this._parent_root, component, slotName)
  }

  unregisterParentRoot(component: Component_): void {
    return unregisterParentRoot(this, this._parent_root, component)
  }

  reorderParentRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderParentRoot(this, this._parent_root, component, to)
  }

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(this, this._parent_children, component, slotName)
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component)
  }

  appendChild(bundle: UnitBundle<Component_>): number {
    return appendChild(this, this._children, bundle)
  }

  insertChild(
    Bundle: UnitBundle<Component_<ComponentEvents>>,
    at: number
  ): void {
    throw new MethodNotImplementedError()
  }

  pushChild(Bundle: UnitBundle<Component_>): number {
    return pushChild(this, this._children, Bundle)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): Component_ {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): Component_ {
    throw pullChild(this, this._children, at)
  }

  refChild(at: number): Component_ {
    return refChild(this, this._children, at)
  }

  refChildren(): Component_[] {
    return refChildren(this, this._children)
  }

  refSlot(slotName: string): Component_ {
    const slot = this._slot[slotName]

    if (slot) {
      return slot
    }

    throw new MethodNotImplementedError()
  }

  private _play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _pause(): void {
    forEach(this._children, (u) => u.pause())
  }
}
