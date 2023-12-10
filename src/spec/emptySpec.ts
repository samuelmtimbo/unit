import { UNTITLED } from '../constant/STRING'
import deepMerge from '../system/f/object/DeepMerge/f'
import { GraphSpec } from '../types/GraphSpec'

export const emptyGraphSpec = (partial: Partial<GraphSpec> = {}): GraphSpec =>
  deepMerge(
    {
      type: '`U`&`G`',
      name: UNTITLED,
      units: {},
      merges: {},
      inputs: {},
      outputs: {},
      metadata: {
        icon: null,
        description: '',
      },
    },
    partial
  )
