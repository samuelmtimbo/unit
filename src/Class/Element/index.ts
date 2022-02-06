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
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { EventEmitter } from '../../EventEmitter'
import { C_EE } from '../../interface/C'
import { Component_ } from '../../interface/Component'
import { E } from '../../interface/E'
import { EE } from '../../interface/EE'
import { Pod } from '../../pod'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { UnitClass } from '../../types/UnitClass'
import { forEach } from '../../util/array'
import { Stateful, StatefulEvents } from '../Stateful'
import { ION, Opt } from '../Unit'

export type Element_EE = C_EE & { call: [{ method: string; data: any[] }] }

export type ElementEvents<_EE extends Dict<any[]>> = StatefulEvents<
  _EE & Element_EE
> &
  Element_EE

export class Element<
    I = any,
    O = any,
    _J extends Dict<any> = {},
    _EE extends ElementEvents<_EE> = ElementEvents<Element_EE>
  >
  extends Stateful<I, O, {}, _EE>
  implements E
{
  __ = ['U', 'C', 'J', 'V', 'EE']

  public element = true

  public _children: Component_[] = []
  public _root: Component_[] = []
  public _parent_root: Component_[] = []
  public _parent_children: Component_[] = []
  public _slot: Dict<Component_> = {}
  public _emitter: EventEmitter = new EventEmitter()

  constructor(
    { i = [], o = [] }: ION,
    opt: Opt = {},
    system: System,
    pod: Pod
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      pod
    )

    this.addListener('play', this._play)
    this.addListener('pause', this._pause)

    this._slot = {
      default: this,
    }
  }

  registerRoot(component: Component_): void {
    return registerRoot(this, this._root, component)
  }

  unregisterRoot(component: Component_): void {
    return unregisterRoot(this, this._root, component)
  }

  registerParentRoot(component: Component_, slotName: string): void {
    return registerParentRoot(this, this._parent_root, component, slotName)
  }

  unregisterParentRoot(component: Component_): void {
    return unregisterParentRoot(this, this._parent_root, component)
  }

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(this, this._parent_children, component, slotName)
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component)
  }

  appendChild(Class: UnitClass<Component_>): number {
    return appendChild(this, this._children, Class)
  }

  pushChild(Class: UnitClass<Component_>): number {
    return pushChild(this, this._children, Class)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): UnitClass<Component_> {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): UnitClass<Component_> {
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

    throw new Error('Slot not found')
  }

  refEmitter(): EE {
    return this._emitter
  }

  private _play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _pause(): void {
    forEach(this._children, (u) => u.pause())
  }
}
