import { GraphDataSpec } from '../../types'

export const SET_DATUM = 'SPEC_SET_DATUM'
export const SET_DATA = 'SPEC_ADD_DATA'
export const REMOVE_DATUM = 'SPEC_REMOVE_DATUM'
export const REMOVE_DATA = 'SPEC_REMOVE_DATA'

export const removeData = (ids: string[]) => {
  return {
    type: REMOVE_DATA,
    data: {
      ids,
    },
  }
}

export const setDatum = (id: string, value: any) => {
  return {
    type: SET_DATUM,
    data: {
      id,
      value,
    },
  }
}

export const removeDatum = (id: string) => {
  return {
    type: REMOVE_DATUM,
    data: {
      id,
    },
  }
}

export const setData = (data: GraphDataSpec) => {
  return {
    type: SET_DATA,
    data: {
      data,
    },
  }
}
