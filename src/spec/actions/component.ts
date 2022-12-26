import { GraphSubComponentSpec } from '../../types'

export const SET_SUB_COMPONENT = 'COMPONENT_SET_SUB_COMPONENT'
export const SET_SUB_COMPONENT_CHILDREN = 'COMPONENT_SET_SUB_COMPONENT_CHILDREN'
export const APPEND_SUB_COMPONENT_CHILDREN =
  'COMPONENT_APPEND_SUB_COMPONENT_CHILDREN'
export const REMOVE_SUB_COMPONENT_CHILDREN =
  'COMPONENT_REMOVE_SUB_COMPONENT_CHILDREN'
export const REMOVE_SUB_COMPONENT = 'COMPONENT_REMOVE_SUB_COMPONENT'
export const SET_SIZE = 'COMPONENT_SET_SIZE'

export const setSubComponent = (id: string, spec: GraphSubComponentSpec) => {
  return {
    type: SET_SUB_COMPONENT,
    data: {
      id,
      spec,
    },
  }
}

export const setSubComponentChildren = (id: string, children: string[]) => {
  return {
    type: SET_SUB_COMPONENT,
    data: {
      id,
      children,
    },
  }
}

export const appendSubComponentChildren = (id: string, children: string[]) => {
  return {
    type: APPEND_SUB_COMPONENT_CHILDREN,
    data: {
      id,
      children,
    },
  }
}

export const removeSubComponentChildren = (id: string, children: string[]) => {
  return {
    type: REMOVE_SUB_COMPONENT_CHILDREN,
    data: {
      id,
      children,
    },
  }
}

export const removeSubComponent = (id: string) => {
  return {
    type: REMOVE_SUB_COMPONENT,
    data: {
      id,
    },
  }
}

export const setSize = (id: string, width: number, height: number) => {
  return {
    type: SET_SIZE,
    data: {
      id,
      width,
      height,
    },
  }
}
