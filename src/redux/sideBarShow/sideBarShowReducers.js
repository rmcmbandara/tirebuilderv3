import { TOGGLE_SIDEBARSHOW } from './sideBarShowConstants'

const sideBarShowReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBARSHOW:
      return !state
    default:
      return state
  }
}

export { sideBarShowReducer }
