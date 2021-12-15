import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { stabilityReducer } from './redux/scalStability/stabilityReducers'
import { sideBarShowReducer } from './redux/sideBarShow/sideBarShowReducers'
import { tireCodeTextReducer } from './redux/tireCodeText/tireCodeTextReducer'
import { tireCodeDetailReducer } from './redux/tireCodeDetail/tireCodeDetailsReducer'
import { specReducer } from './redux/spec/specReducer'
import { dataAvlReducer } from './redux/dataAvl/dataAvlReducers'
import { builderFinalReducer } from './redux/builderFinalData/buildFinalReducers'
const initialState = {}
const reducer = combineReducers({
  stabilityDetails: stabilityReducer,
  sidebarShow: sideBarShowReducer,
  tireCodeText: tireCodeTextReducer,
  tireCodeDetails: tireCodeDetailReducer,
  specDetails: specReducer,
  dataAvlReducer: dataAvlReducer,
  builderFinalReducer: builderFinalReducer,
})
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))
export default store
