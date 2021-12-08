import { TIRECODE_TEXT_CHANGE } from './tireCodeTextConstans'

const tireCodeTextChange = (tireCode) => async (dispatch) => {
  dispatch({ type: TIRECODE_TEXT_CHANGE, payload: tireCode })
}

export { tireCodeTextChange }
