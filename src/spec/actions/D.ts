export const ADD_DATUM = 'addDatum'
export const SET_DATUM = 'setDatum'
export const REMOVE_DATUM = 'removeDatum'

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

export const makeRemoveDatumAction = (id: string, value: any) => {
  return {
    type: REMOVE_DATUM,
    data: {
      id,
      value,
    },
  }
}
