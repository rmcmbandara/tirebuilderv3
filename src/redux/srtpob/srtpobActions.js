const { TOGGLE_SRTPOB } = require('./srtpobConstants')
/*Accessed by 
TireBuilderView Component -->set true or false
TireCodeInputComp --> set null
*/
const toggleSrtPob = (value) => (dispatch) => {
  dispatch({ type: TOGGLE_SRTPOB, payload: value })
}

export { toggleSrtPob }
