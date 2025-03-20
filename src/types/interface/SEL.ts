export type SelectionObject = {
  path: string[]
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
}

export interface SEL {
  getSelection(): SelectionObject[]
  setSelectionRange(
    start: number,
    end: number,
    direction: 'forward' | 'backward' | 'none'
  ): void
}
