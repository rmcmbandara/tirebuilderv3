import {
  SPEC_READING_REQUEST,
  SPEC_READING_SUCCESS,
  SPEC_READING_FAIL,
  RESET_SPEC,
} from './specConstants'

const specReducer = (state = { specDetail: {} }, action) => {
  switch (action.type) {
    case SPEC_READING_REQUEST:
      return { loading: true }
    case SPEC_READING_SUCCESS:
      return {
        data: action.payload,
      }
    case SPEC_READING_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case RESET_SPEC:
      return {
        loading: false,
        data: {},
      }
    default:
      return state
  }
}
export { specReducer }
