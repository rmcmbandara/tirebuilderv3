import { TOGGLE_SIDEBARSHOW } from './sideBarShowConstants'

const sideBarShowReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBARSHOW:
      console.log(state)
      return !state
    default:
      return state
  }
}

export { sideBarShowReducer }
