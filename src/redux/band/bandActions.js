const { SET_ACTUAL_BAND_WGT, SET_SPEC_BAND_WGT } = require('./bandConstants')

//Set TireCodeInputComp.js  --> if (tireCodeTxt?.data?.length === 8) else
//Reset tirecode INputComp.js--> //UseEffect for input tireCodeText
const setActBandWgt = (value) => (dispatch) => {
  dispatch({ type: SET_ACTUAL_BAND_WGT, payload: value })
}

const setSpecBandWgt = (value) => (dispatch) => {
  dispatch({ type: SET_SPEC_BAND_WGT, payload: value })
}

export { setActBandWgt, setSpecBandWgt }
