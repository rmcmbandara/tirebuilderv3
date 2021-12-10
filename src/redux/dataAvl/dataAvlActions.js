import { UPDATE_TIRECODE_AVL, UPDATE_SPEC_VER_MATCH, UPDATE_SPEC_AVL } from './dataAvlConstants'

const updateTireCodeAvl = (value) => (dispatch) => {
  dispatch({ type: UPDATE_TIRECODE_AVL, payload: value })
}

const updateSpecAvl = (value) => (dispatch) => {
  dispatch({ type: UPDATE_SPEC_AVL, payload: value })
}

const updateSpecVerMach = (value) => (dispatch) => {
  dispatch({ type: UPDATE_SPEC_VER_MATCH, payload: value })
}

export { updateTireCodeAvl, updateSpecAvl, updateSpecVerMach }
