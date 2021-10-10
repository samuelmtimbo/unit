import { Config } from './Class/Unit/Config'
import { MIMO } from './MIMO'
import { Dict } from './types/Dict'

export interface S {
  input: string
  output: string
}

export class SISO<I, O> extends MIMO<Dict<I>, Dict<O>> {
  private __input: string
  private __output: string

  constructor({ input, output }: S, config?: Config) {
    super({ i: [input], o: [output] }, config)
    this.__input = input
    this.__output = output
  }

  m(i: { [input: string]: I }): Dict<O | undefined> {
    const s = this.s(i[this.__input])
    return { [this.__output]: s }
  }

  s(i: I): O | undefined {
    return undefined
  }

  getInputName(): string {
    return this.__input
  }

  getOutputName(): string {
    return this.__output
  }

  i(i: I) {
    this.push(this.__input, i)
  }

  o(): O | undefined {
    return this.take(this.__output)
  }
}
