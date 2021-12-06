import { TIRECODE_TEXT_CHANGE } from './tireCodeTextConstans'

const tireCodeTextReducer = (state = { tireCodeText: {} }, action) => {
  switch (action.type) {
    case TIRECODE_TEXT_CHANGE:
      return {
        data: action.payload,
      }

    default:
      return state
  }
}
export { tireCodeTextReducer }
