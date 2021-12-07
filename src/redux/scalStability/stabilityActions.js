import {
  SET_STABILITY,
  SET_STABILITY_SETTING_WGT,
  SET_STABILITY_TOLERANCE,
  SET_INGORE_SETTING_WGT,
  SET_STABILITY_ABSOLUTE,
} from './stabilityConstants'

const setStability = (value) => (dispatch) => {
  dispatch({ type: SET_STABILITY, payload: value })
}

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

export { setStability, setSettingWgt, setToleranceWgt, setIgnoreSettingWgt, setStabilityAbsolute }
