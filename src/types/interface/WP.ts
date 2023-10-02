import { C } from './C'

export interface WP {
  refChildContainer(at: number): C
  refParentRootContainer(at: number): C
  refParentChildContainer(at: number): C
}
