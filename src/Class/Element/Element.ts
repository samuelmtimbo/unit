import { Callback } from '../../Callback'
import { Component } from '../../client/component'
import { listenGlobalComponent } from '../../client/globalComponent'
import {
  appendChild,
  child,
  children,
  hasChild,
  pullChild,
  pushChild,
  removeChild,
} from '../../component/component'
import { C } from '../../interface/C'
import { EL } from '../../interface/EL'
import { ObjectSource } from '../../ObjectSource'
import { UnitClass } from '../../types/UnitClass'
import { Unlisten } from '../../Unlisten'
import { forEach } from '../../util/array'
import { Stateful } from '../Stateful'
import { IO, Opt } from '../Unit'
import { Config } from '../Unit/Config'

export class Element<I = any, O = any> extends Stateful<I, O> implements EL {
  _ = ['U', 'C', 'V']

  public element = true

  public _children: EL[] = []

  protected _component_source: ObjectSource<Component> = new ObjectSource()

  constructor({ i = [], o = [] }: IO, config: Config = {}, opt: Opt = {}) {
    super(
      {
        i,
        o,
      },
      config,
      opt
    )

    this.addListener('play', this._play)
    this.addListener('pause', this._pause)

    const { globalId } = this

    listenGlobalComponent(globalId, (component) => {
      this._component_source.set(component)
    })
  }

  private _play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _pause(): void {
    forEach(this._children, (u) => u.pause())
  }

  appendChild(Class: UnitClass): number {
    return appendChild(this, this._children, Class)
  }

  pushChild(Class: UnitClass): number {
    return pushChild(this, this._children, Class)
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): UnitClass {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): UnitClass {
    throw pullChild(this, this._children, at)
  }

  child(at: number): C {
    return child(this, this._children, at)
  }

  children(): C[] {
    return children(this, this._children)
  }

  component(callback: Callback<Component>): Unlisten {
    return this._component_source.connect(callback)
  }
}
