import { UPDATE_FINAL_WGT, UPDATE_SN } from './buildFinalConstants'

const builderFinalReducer = (state = { sn: '', ttlWgt: 0.0 }, action) => {
  switch (action.type) {
    case UPDATE_SN:
      return { ...state, sn: action.payload }
    default:
      return state
  }
}
export { builderFinalReducer }
