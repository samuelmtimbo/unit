export type GraphSelectionSpec = {
  unitId: string
  type: 'input' | 'output'
  pinId: string
  mergeId: string
  oppositePinId: string
}
