import {
  SCALE_OVERRIDE,
  SCALE_READING_FAIL,
  SCALE_READING_REQUEST,
  SCALE_READING_SUCCESS,
} from './scaleConstants'

const scaleReadingReducer = (state = { scaleReading: {} }, action) => {
  switch (action.type) {
    case SCALE_READING_REQUEST:
      return { loading: true }
    case SCALE_READING_SUCCESS:
      return {
        loading: false,
        reading: action.payload,
      }
    case SCALE_READING_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case SCALE_OVERRIDE:
      return {
        loading: false,
        reading: action.payload,
      }
    default:
      return state
  }
}
export { scaleReadingReducer }
