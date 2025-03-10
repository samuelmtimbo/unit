import { C_EE } from '../types/interface/C'
import { G_EE } from '../types/interface/G'
import { U_EE } from '../types/interface/U'

export const GRAPH_DEFAULT_EVENTS: (keyof G_EE | keyof C_EE | keyof U_EE)[] = [
  'edit',
  'fork',
  'set_name',
  'append_child',
  'remove_child',
  'insert_child',
  'add_unit',
  'remove_unit',
  'move_unit',
  'add_merge',
  'remove_merge',
  'expose_pin',
  'cover_pin',
  'plug_pin',
  'unplug_pin',
  'remove_pin_from_merge',
  'add_pin_to_merge',
  'move_subgraph_into',
  'move_subgraph_out_of',
  'move_sub_component_root',
  'reorder_sub_component',
  'expose_pin_set',
  'cover_pin_set',
  'set_pin_set_id',
  'set_pin_set_default_ignored',
  'set_pin_set_functional',
  'set_unit_pin_constant',
  'set_unit_pin_ignored',
  'set_unit_pin_data',
  'remove_unit_pin_data',
  'set_unit_id',
  'bulk_edit',
  'set_metadata',
]
