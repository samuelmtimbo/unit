import { C } from './C'

export interface W {
  refChildContainer(at: number): C
  refParentRootContainer(at: number): C
  refParentChildContainer(at: number): C
}
