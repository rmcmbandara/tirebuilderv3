const { SET_ACTUAL_BAND_WGT, SET_SPEC_BAND_WGT } = require('./bandConstants')

const bandWgtReducer = (
  state = {
    actBandWgt: 0,
    specBandWgt: 0,
  },
  action,
) => {
  switch (action.type) {
    case SET_ACTUAL_BAND_WGT:
      return { ...state, actBandWgt: action.payload }
    case SET_SPEC_BAND_WGT:
      return { ...state, specBandWgt: action.payload }
    default:
      return state
  }
}

export { bandWgtReducer }
