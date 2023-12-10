import { treeComplexityById } from '../../spec/complexity'
import {
  ID_INCREMENT,
  ID_ONE,
  ID_RANGE_ARRAY,
  ID_SINGLE,
} from '../../system/_ids'
import _specs from '../../system/_specs'

const paths = [ID_INCREMENT, ID_ONE, ID_SINGLE, ID_RANGE_ARRAY]

if (false) {
  for (const path of paths) {
    // eslint-disable-next-line no-console
    console.log(path, treeComplexityById(_specs, path))
  }
}
