import { TOGGLE_SIDEBARSHOW } from './sideBarShowConstants'

const toggleSideBarShow = (value) => (dispatch) => {
  dispatch({ type: TOGGLE_SIDEBARSHOW, payload: value })
}

export { toggleSideBarShow }
