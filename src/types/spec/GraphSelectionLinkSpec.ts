export type GraphSelectionLinkSpec = {
  unitId: string
  type: 'input' | 'output'
  pinId: string
  mergeId: string
  oppositePinId: string
}
