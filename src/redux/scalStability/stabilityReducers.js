import {
  SET_STABILITY,
  SET_STABILITY_SETTING_WGT,
  SET_STABILITY_TOLERANCE,
  SET_INGORE_SETTING_WGT,
  SET_STABILITY_ABSOLUTE,
  SET_MOVING_AVERAGE,
  SET_MAX_TOL,
  SET_MIN_TOL,
} from './stabilityConstants'

const stabilityReducer = (
  state = {
    stable: false,
    stableAbsolute: false,
    settingWgt: 0.055,
    toleranceWgt: 0.04,
    ignoreSettingWgt: false,
    movingAverage: 0,
    maxTol: 0,
    minTol: 0,
  },
  action,
) => {
  switch (action.type) {
    case SET_STABILITY:
      return { ...state, stable: action.payload }

    case SET_STABILITY_SETTING_WGT:
      return { ...state, settingWgt: action.payload }

    case SET_STABILITY_TOLERANCE:
      return { ...state, toleranceWgt: action.payload }

    case SET_INGORE_SETTING_WGT:
      return { ...state, ignoreSettingWgt: action.payload }

    case SET_STABILITY_ABSOLUTE:
      return { ...state, stableAbsolute: action.payload }
    case SET_MOVING_AVERAGE:
      return { ...state, movingAverage: action.payload }
    case SET_MAX_TOL:
      return { ...state, maxTol: action.payload }
    case SET_MIN_TOL:
      return { ...state, minTol: action.payload }

    default:
      return state
  }
}

export { stabilityReducer }

/*
  state = {
    stability: false,
    stabilityAbsolute: false,
    settingWgt: 0.055,
    toleranceWgt: 0.04,
    ignoreSettingWgt: false,
  },
*/
