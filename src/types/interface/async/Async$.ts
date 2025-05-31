import { $ } from '../../../Class/$'
import { Callback } from '../../Callback'
import { $$, $$_C, $$_G, $$_R, $$_W } from './$$'

export const Async$Get = (ref: $): $$_G => ({
  $getInterface: function (data: {}, callback: Callback<string[]>): void {
    const _ = ref.getInterface()

    callback(_)
  },
  $getGlobalId: function (data: {}, callback: Callback<string>) {
    const _ = ref.getGlobalId()

    callback(_)
  },
})

export const Async$Call = (ref: $): $$_C => ({})

export const Async$Watch = (ref: $): $$_W => {
  return {}
}

export const Async$Ref = (ref: $): $$_R => ({})

export const Async$ = (ref: $): $$ => {
  return {
    ...Async$Get(ref),
    ...Async$Call(ref),
    ...Async$Watch(ref),
    ...Async$Ref(ref),
  }
}
