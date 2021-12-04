import { createStore } from 'redux'
import { INCREMENT_COUNT } from './actions'
const initialState = {
  sidebarShow: false,
  count: 10,
}
const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1,
      }
    default:
      return state
  }
}
const store = createStore(changeState)
export default store
