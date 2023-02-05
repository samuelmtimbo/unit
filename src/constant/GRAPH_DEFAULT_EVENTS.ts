import { C_EE } from '../types/interface/C'
import { G_EE } from '../types/interface/G'
import { U_EE } from '../types/interface/U'

export const GRAPH_DEFAULT_EVENTS: (keyof G_EE | keyof C_EE | keyof U_EE)[] = [
  'append_child',
  'remove_child',
  'insert_child',
  'add_unit',
  'clone_unit',
  'remove_unit',
  'move_unit',
  'add_merge',
  'remove_merge',
  'expose_pin',
  'cover_pin',
  'plug_pin',
  'unplug_pin',
  'move_subgraph_into',
  'inject_graph',
  'move_unit_into',
  'expose_pin_set',
  'cover_pin_set',
  'set_pin_set_id',
  'set_unit_pin_constant',
  'set_unit_pin_data',
  'set_unit_id',
]
