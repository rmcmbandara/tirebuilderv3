import {
  TIRECODE_READING_REQUEST,
  TIRECODE_READING_SUCCESS,
  TIRECODE_READING_FAIL,
  RESET_TIRE_DETAIL,
} from './tireCodeDetailsConstants'

const tireCodeDetailReducer = (state = { tireCodeDetail: {} }, action) => {
  switch (action.type) {
    case TIRECODE_READING_REQUEST:
      return { loading: true }
    case TIRECODE_READING_SUCCESS:
      return {
        data: action.payload,
      }
    case TIRECODE_READING_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case RESET_TIRE_DETAIL:
      return {
        loading: false,
        data: {},
      }
    default:
      return state
  }
}
export { tireCodeDetailReducer }
