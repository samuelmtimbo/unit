import { J } from '../../../interface/J'
import { ObjectUpdateType } from '../../../Object'
import { Dict } from '../../../types/Dict'
import { Unlisten } from '../../../types/Unlisten'

const _storage: Dict<string> = {}

export const $tabStorage: J = {
  get: function (name: string): Promise<any> {
    throw new Error('Function not implemented.')
  },

  set: function (name: string, data: any): Promise<void> {
    throw new Error('Function not implemented.')
  },

  hasKey: function (name: string): Promise<boolean> {
    throw new Error('Function not implemented.')
  },

  delete: function (name: string): Promise<any> {
    throw new Error('Function not implemented.')
  },

  keys: function (): Promise<string[]> {
    throw new Error('Function not implemented.')
  },

  pathSet: function (path: string[], name: string, data: any): Promise<void> {
    throw new Error('Function not implemented.')
  },

  pathGet: function (path: string[], name: string): Promise<any> {
    throw new Error('Function not implemented.')
  },

  pathDelete: function (path: string[], name: string): Promise<void> {
    throw new Error('Function not implemented.')
  },

  subscribe: function (
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    throw new Error('Function not implemented.')
  },
}
