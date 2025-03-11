import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { ID_OUTER_HTML } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export type I = {
  component: Component_
  any: any
}

export type O = {
  html: string
  done: any
}

export default class OuterHTML extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['component', 'any'],
        fo: ['html'],
        i: [],
        o: ['done'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_OUTER_HTML
    )
  }

  async f({ component, any: opt }: I, done: Done<O>) {
    const globalId = component.getGlobalId()

    const component_ = (await firstGlobalComponentPromise(
      this.__system,
      globalId
    )) as Component

    let html: string

    if (component_.$element instanceof Text) {
      html = component_.$element.textContent
    } else {
      const leaves = component_.getRootLeaves()

      const leavesHtml: string[] = []

      for (const leaf of leaves) {
        leavesHtml.push(leaf.$element.outerHTML)
      }

      html = leavesHtml.join('\n')
    }

    done({ html })
  }

  b() {
    this._output.done.push(true)
  }
}
