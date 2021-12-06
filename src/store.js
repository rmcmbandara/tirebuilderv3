import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { INCREMENT_COUNT } from './actions'
const initialState = {
  sidebarShow: false,
  count: 10,
}
const reducer = (state = initialState, { type, ...rest }) => {
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

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))
export default store
