import { J } from '../../../interface/J'
import { Dict } from '../../../types/Dict'

const _storage: Dict<string> = {}

// TODO
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

  setPath: function (path: string[], name: string, data: any): Promise<void> {
    throw new Error('Function not implemented.')
  },

  getPath: function (path: string[], name: string): Promise<any> {
    throw new Error('Function not implemented.')
  },

  deletePath: function (path: string[], name: string): Promise<void> {
    throw new Error('Function not implemented.')
  },
}
