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

const setStability = (value) => (dispatch) => {
  dispatch({ type: SET_STABILITY, payload: value })
}

//set in TtlWgtDisplayComp.js
//Cleard in TireCodeInputComp.js
const setSettingWgt = (value) => (dispatch) => {
  dispatch({ type: SET_STABILITY_SETTING_WGT, payload: value })
}

const setToleranceWgt = (value) => (dispatch) => {
  dispatch({ type: SET_STABILITY_TOLERANCE, payload: value })
}

const setIgnoreSettingWgt = (value) => (dispatch) => {
  dispatch({ type: SET_INGORE_SETTING_WGT, payload: value })
}

const setStabilityAbsolute = (value) => (dispatch) => {
  dispatch({ type: SET_STABILITY_ABSOLUTE, payload: value })
}
//set in ScaleWgtDisplay
const setMovingAvg = (value) => (dispatch) => {
  dispatch({ type: SET_MOVING_AVERAGE, payload: value })
}
//set in TtlWgtDisplayComp.js
//Cleard in TireCodeInputComp.js
const setMaxTol = (value) => (dispatch) => {
  dispatch({ type: SET_MAX_TOL, payload: value })
}
//set in TtlWgtDisplayComp.js
//Cleard in TireCodeInputComp.js
const setMinTol = (value) => (dispatch) => {
  dispatch({ type: SET_MIN_TOL, payload: value })
}
export {
  setMovingAvg,
  setStability,
  setSettingWgt,
  setToleranceWgt,
  setIgnoreSettingWgt,
  setStabilityAbsolute,
  setMaxTol,
  setMinTol,
}
