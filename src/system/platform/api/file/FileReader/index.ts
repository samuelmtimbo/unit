import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { FR } from '../../../../../types/interface/FR'
import { wrapFileReader } from '../../../../../wrap/FileReader'
import { ID_FILE_READER } from '../../../../_ids'

export type I = {
  opt: {}
  done: any
}

export type O = {
  reader: FR & $
}

export default class FileReader extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['reader'],
        i: ['done'],
        o: [],
      },
      {
        output: {
          reader: {
            ref: true,
          },
        },
      },
      system,
      ID_FILE_READER
    )
  }

  async f({ opt }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        file: { FileReader },
      },
    } = this.__system

    if (!FileReader) {
      done(undefined, 'FileReader API not available.')

      return
    }

    const reader_ = new FileReader()

    const reader = wrapFileReader(reader_, this.__system)

    done({ reader })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._forward_empty('reader')

    this._backward('opt')
    this._backward('done')
    // }
  }
}
