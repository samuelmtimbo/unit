import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { A } from '../types/interface/A'
import { F } from '../types/interface/F'
import { wrapFile } from './File'

export function wrapFileList(fileList: FileList, system: System): A<F & $> & $ {
  const files = new (class Files_ extends $ implements A<F> {
    __: string[] = ['A']

    append(a: F): Promise<void> {
      throw new ReadOnlyError('file list')
    }

    put(i: number, data: any): Promise<void> {
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

    indexOf(a: F): Promise<number> {
      throw new ReadOnlyError('file list')
    }
  })(system)

  return files
}
