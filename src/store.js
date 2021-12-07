import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { INCREMENT_COUNT } from './actions'
import { stabilityReducer } from './redux/scalStability/stabilityReducers'
import { sideBarShowReducer } from './redux/sideBarShow/sideBarShowReducers'
const initialState = {}
const reducer = combineReducers({
  stabilityDetails: stabilityReducer,
  sidebarShow: sideBarShowReducer,
})
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))
export default store
