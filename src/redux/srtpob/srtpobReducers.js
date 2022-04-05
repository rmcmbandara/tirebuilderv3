import { TOGGLE_SRTPOB } from './srtpobConstants'

const srtPobToggleReducer = (state = null, action) => {
  switch (action.type) {
    case TOGGLE_SRTPOB:
      return action.payload
    default:
      return state
  }
}

export { srtPobToggleReducer }
