import { GraphNodeSpec } from '../../types'

export const ADD_DATUM = 'addDatum'
export const SET_DATUM = 'setDatum'
export const ADD_DATUM_LINK = 'addDatumLink'
export const REMOVE_DATUM = 'removeDatum'
export const REMOVE_DATUM_LINK = 'removeDatumLink'

export const makeSetDatumAction = (id: string, value: any, prevValue: any) => {
  return {
    type: SET_DATUM,
    data: {
      id,
      value,
      prevValue,
    },
  }
}

export const makeAddDatumAction = (id: string, value: any) => {
  return {
    type: ADD_DATUM,
    data: {
      id,
      value,
    },
  }
}

export const makeAddDatumLinkAction = (
  id: string,
  value: any,
  nodeSpec: GraphNodeSpec
) => {
  return {
    type: ADD_DATUM_LINK,
    data: {
      id,
      value,
      nodeSpec,
    },
  }
}

export const makeRemoveDatumAction = (id: string, value: any) => {
  return {
    type: REMOVE_DATUM,
    data: {
      id,
      value,
    },
  }
}

export const makeRemoveDatumLinkAction = (
  id: string,
  value: any,
  nodeSpec: GraphNodeSpec
) => {
  return {
    type: REMOVE_DATUM_LINK,
    data: {
      id,
      value,
      nodeSpec,
    },
  }
}
