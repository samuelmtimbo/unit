import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { C } from '../../../../interface/C'
import { C_U } from '../../../../interface/C_U'
import { W } from '../../../../interface/W'
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
  private _Container: UnitClass<C_U> = Parent

  private _child_container: C_U[] = []
  private _parent_container: C[] = []
  private _parent_child_container: C[] = []

  constructor(config: Config) {
    super({ i: ['component', 'style'], o: ['parent'] }, config)

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

      const new_container = new this._Container()

      new_container.play()

      this._child_container[i] = new_container
    }

    for (let i = 0; i < this._parent_container.length; i++) {
      const container = this._parent_container[i]

      container.destroy()

      const new_container = new this._Container()

      new_container.play()

      this._parent_container[i] = new_container
    }

    for (let i = 0; i < this._parent_child_container.length; i++) {
      const container = this._parent_child_container[i]

      container.destroy()

      const new_container = new this._Container()

      new_container.play()

      this._parent_child_container[i] = new_container
    }
  }

  appendChild(Class: UnitClass): number {
    const container = new this._Container()

    container.play()

    this._child_container.push(container)

    return super.appendChild(Class)
  }

  removeChild(at: number): UnitClass {
    this._child_container.splice(at, 1)

    return super.removeChild(at)
  }

  registerParentRoot(component: C, slotName: string): void {
    // console.log('Wrap', 'registerParentRoot')

    const container = new this._Container()

    container.play()

    this._parent_container.push(container)

    return super.registerParentRoot(component, slotName)
  }

  unregisterParentRoot(component: C): void {
    const at = this._parent_container.indexOf(component)

    this._parent_container.splice(at, 1)

    return super.unregisterParentRoot(component)
  }

  appendParentChild(component: C, slotName: string): void {
    // console.log('Wrap', 'appendParentChild', component.constructor.name, slotName)

    const container = new this._Container()

    container.play()

    this._parent_child_container.push(container)

    // container.appendChild(component) // TODO

    super.appendParentChild(container, slotName)
  }

  removeParentChild(component: C): void {
    const at = this._parent_children.indexOf(component)

    if (at > -1) {
      const container = this._parent_child_container[at]

      // container.removeChild(0) // TODO

      super.removeParentChild(container)
    } else {
      throw new Error('Parent Child not found')
    }
  }

  refParentRootContainer(at: number): C<any, any> {
    return this._parent_container[at]
  }

  refChildContainer(at: number): C {
    return this._child_container[at]
  }

  refParentChildContainer(at: number): C {
    return this._parent_child_container[at]
  }
}
