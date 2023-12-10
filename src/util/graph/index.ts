import { forEachPinOnMerges } from '../../spec/util/spec'

export function templateMoveUnitIntoGraph(
  unit_id: string,
  graph_id: string,
  { getUnitSpec, getUnitMerges, removeUnit, injectUnit, removePinFromMerge }
): void {
  const unit_spec = getUnitSpec()
  const unit_merges = getUnitMerges()

  removeUnit(unit_id)
  injectUnit(graph_id, unit_id, unit_spec)
  forEachPinOnMerges(unit_merges, (merge_id, unit_id, type, pin_id) => {
    removePinFromMerge(merge_id, unit_id, type, pin_id)
  })
}
