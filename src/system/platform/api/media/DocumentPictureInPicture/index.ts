import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { webBoot } from '../../../../../client/platform/web/boot'
import { HTML_STYLE } from '../../../../../client/render/attachStyle'
import { renderComponent } from '../../../../../client/render/renderComponent'
import {
  COLOR_GRAYSCALE_BASE01,
  COLOR_GRAYSCALE_BASE10,
} from '../../../../../client/theme'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { Component_ } from '../../../../../types/interface/Component'
import { callAll } from '../../../../../util/call/callAll'
import { ID_DOCUMENT_PICTURE_IN_PICTURE } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'

export interface I {
  component: Component_
  opt: {}
  done: any
}

export interface O {}

export default class DocumentPictureInPicture extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'opt'],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_DOCUMENT_PICTURE_IN_PICTURE
    )
  }

  async f({ component, opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        document: { createElement, createTextNode },
        window: { documentPictureInPicture },
      },
    } = this.__system

    // @ts-ignore
    if (!documentPictureInPicture || !documentPictureInPicture.requestWindow) {
      fail(apiNotSupportedError('Document Picture In Picture'))

      return
    }

    component.register()

    let window: Window

    try {
      window = (await documentPictureInPicture.requestWindow()) as Window
    } catch (err) {
      if (
        err.message ===
        "Failed to execute 'requestWindow' on 'DocumentPictureInPicture': Document PiP requires user activation"
      ) {
        fail('Document PiP requires user activation')

        return
      }

      fail(err.message)

      return
    }

    const root = createElement('div')

    root.style.width = '100%'
    root.style.height = '100%'

    const style = createElement('style')

    style.appendChild(
      createTextNode(`${HTML_STYLE}
      body {
        background-color: ${COLOR_GRAYSCALE_BASE10};
        color: ${COLOR_GRAYSCALE_BASE01}
      }`)
    )

    window.document.head.appendChild(style)
    window.document.body.appendChild(root)

    const [system, deboot] = webBoot(window, root)

    const component_ = await firstGlobalComponentPromise(
      this.__system,
      component.__global_id
    )

    const { $context, $system } = component_

    const base = component_.getRootLeaves()

    if ($context) {
      component_.unmount()
    }

    // component_.domRemoveLeaves(base)
    component_.setSystem(system)

    const unrender = renderComponent(
      system,
      null,
      system.foreground.app,
      component_
    )

    component_.setDetached(true)

    const back = () => {
      component_.setSystem($system)

      for (const leaf of base) {
        if (leaf.$domParent) {
          leaf.$domParent.$element.appendChild(leaf.$element)
        }
      }

      if ($context) {
        component_.mount($context)
      }
    }

    this._unlisten = callAll([
      () => {
        component_.setDetached(false)
      },
      unrender,
      back,
      deboot,
    ])

    window.addEventListener('pagehide', () => {
      this.d()

      done()
    })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
