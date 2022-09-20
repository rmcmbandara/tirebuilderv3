import { SET_IS_CHANGED_TRUE } from './orderSummeryConstants'

const nxtSnChangeSetTrueReducer = (state = false, action) => {
  switch (action.type) {
    case SET_IS_CHANGED_TRUE:
      return action.payload
    default:
      return state
  }
}

export { nxtSnChangeSetTrueReducer }
