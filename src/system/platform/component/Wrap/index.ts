import { Element } from '../../../../Class/Element'
import { Unit } from '../../../../Class/Unit'
import { C } from '../../../../interface/C'
import { Component_ } from '../../../../interface/Component'
import { W } from '../../../../interface/W'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { UnitClass } from '../../../../types/UnitClass'
import Parent from '../Parent'

export type I = {
  component: UnitClass
  style: Dict<string>
}

export type O = {
  parent: C
}

export default class Wrap extends Element<I, O> implements W {
  private _Container: UnitClass = Parent

  private _child_container: Component_[] = []
  private _parent_container: Component_[] = []
  private _parent_child_container: Component_[] = []

  constructor(system: System, pod: Pod) {
    super(
      { i: ['component', 'style'], o: ['parent'] },
      { output: { parent: { ref: true } } },
      system,
      pod
    )

    this.prependListener('set', ({ name, data }) => {
      if (name === 'component') {
        this._Container = data

        this._rewrap()
      }
    })
  }

  private _rewrap(): void {
    for (let i = 0; i < this._child_container.length; i++) {
      const container = this._child_container[i]

      container.destroy()

      const new_container = new this._Container(this.__system, this.__pod)

      new_container.play()

      this._child_container[i] = new_container
    }

    for (let i = 0; i < this._parent_container.length; i++) {
      const container = this._parent_container[i]

      container.destroy()

      const new_container = new this._Container(this.__system, this.__pod)

      new_container.play()

      this._parent_container[i] = new_container
    }

    for (let i = 0; i < this._parent_child_container.length; i++) {
      const container = this._parent_child_container[i]

      container.destroy()

      const new_container = new this._Container(this.__system, this.__pod)

      new_container.play()

      this._parent_child_container[i] = new_container
    }
  }

  appendChild(Class: UnitClass): number {
    const container = new this._Container(this.__system, this.__pod)

    container.play()

    this._child_container.push(container)

    return super.appendChild(Class)
  }

  removeChild(at: number): UnitClass {
    this._child_container.splice(at, 1)

    return super.removeChild(at)
  }

  registerParentRoot(component: Component_, slotName: string): void {
    // console.log('Wrap', 'registerParentRoot')

    const container = new this._Container(this.__system, this.__pod)

    container.play()

    this._parent_container.push(container)

    return super.registerParentRoot(component, slotName)
  }

  unregisterParentRoot(component: Unit & C): void {
    const at = this._parent_container.indexOf(component)

    this._parent_container.splice(at, 1)

    return super.unregisterParentRoot(component)
  }

  appendParentChild(component: Component_, slotName: string): void {
    // console.log('Wrap', 'appendParentChild', component.constructor.name, slotName)

    const container = new this._Container(this.__system, this.__pod)

    container.play()

    this._parent_child_container.push(container)

    // container.appendChild(component) // TODO

    super.appendParentChild(container, slotName)
  }

  removeParentChild(component: Component_): void {
    const at = this._parent_children.indexOf(component)

    if (at > -1) {
      const container = this._parent_child_container[at]

      // container.removeChild(0) // TODO

      super.removeParentChild(container)
    } else {
      throw new Error('Parent Child not found')
    }
  }

  refParentRootContainer(at: number): C {
    return this._parent_container[at]
  }

  refChildContainer(at: number): C {
    return this._child_container[at]
  }

  refParentChildContainer(at: number): C {
    return this._parent_child_container[at]
  }
}
