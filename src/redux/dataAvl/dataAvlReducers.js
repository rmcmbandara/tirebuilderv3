import {
  UPDATE_TIRECODE_AVL,
  UPDATE_SPEC_VER_MATCH,
  UPDATE_SPEC_AVL,
  EDC_1ST_TIRE,
} from './dataAvlConstants'

const dataAvlReducer = (
  state = { tcAvl: false, specAvl: false, specVerMatch: false, edc1stTire: null },
  action,
) => {
  switch (action.type) {
    case UPDATE_TIRECODE_AVL:
      return { ...state, tcAvl: action.payload }
    case UPDATE_SPEC_VER_MATCH:
      return { ...state, specVerMatch: action.payload }
    case UPDATE_SPEC_AVL:
      return { ...state, specAvl: action.payload }
    case EDC_1ST_TIRE:
      return { ...state, edc1stTire: action.payload }
    default:
      return state
  }
}
export { dataAvlReducer }
