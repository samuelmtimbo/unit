import { $, $_EE, $Events } from '../Class/$'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { A } from '../types/interface/A'
import { F } from '../types/interface/F'
import { wrapFile } from './File'

export function wrapFileList(fileList: FileList, system: System): A<F & $> & $ {
  const files = new (class Files_ extends $ implements A<F & $> {
    __: string[] = ['A']

    async append(a: F): Promise<void> {
      throw new ReadOnlyError('file list')
    }

    async put(i: number, data: any): Promise<void> {
      throw new ReadOnlyError('file list')
    }

    async at(i: number): Promise<any> {
      const fileItem = fileList.item(i)

      const file: F = wrapFile(fileItem, system)

      return file
    }

    async length(): Promise<number> {
      return fileList.length
    }

    async indexOf(a: F): Promise<number> {
      let i = 0

      while (i < fileList.length) {
        const file = fileList.item(i)

        if (file === a) {
          return i
        }

        i++
      }

      return -1
    }

    async pop(): Promise<F & $> {
      throw new ReadOnlyError('file list')
    }

    async shift(): Promise<F & $<$Events<$_EE>>> {
      throw new MethodNotImplementedError()
    }
  })(system)

  return files
}
