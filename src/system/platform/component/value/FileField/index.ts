import { $ } from '../../../../../Class/$'
import { Element_ } from '../../../../../Class/Element'
import { Component } from '../../../../../client/component'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { F } from '../../../../../types/interface/F'
import { wrapFileList } from '../../../../../wrap/FileList'
import { ID_FILE_FIELD } from '../../../../_ids'
import { listenGlobalComponent } from '../../../../globalComponent'

export interface I {
  style: object
  attr: {
    multiple: boolean
    capture: string
    accept: string
  }
}

export interface O {
  files: A<F> & $
}

export default class FileField extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'attr'],
        o: ['files'],
      },
      {},
      system,
      ID_FILE_FIELD
    )

    this._defaultState = {
      value: '',
    }

    listenGlobalComponent(
      system,
      this.__global_id,
      (component: Component<HTMLInputElement>) => {
        component.$element.addEventListener(
          '_change',
          async (event: InputEvent) => {
            const { files } = component.$element

            const files_ = wrapFileList(files, this.__system)

            this._output.files.push(files_)
          }
        )
      }
    )
  }
}
