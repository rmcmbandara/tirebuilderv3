import axios from 'axios'
import SLTLDBConnection from '../../apis/SLTLDBConnection'
import {
  TIRECODE_READING_REQUEST,
  TIRECODE_READING_SUCCESS,
  TIRECODE_READING_FAIL,
  RESET_TIRE_DETAIL,
} from './tireCodeDetailsConstants'

const setTireCodeDetail = (tireCode) => async (dispatch) => {
  try {
    dispatch({ type: TIRECODE_READING_REQUEST })
    const { data } = await SLTLDBConnection.get(`/tirecode/getdetail/${tireCode}`)
    console.log(tireCode)
    dispatch({ type: TIRECODE_READING_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: TIRECODE_READING_FAIL, payload: error.message })
  }
}
const resetTireDetails = () => async (dispatch) => {
  dispatch({ type: RESET_TIRE_DETAIL, payload: '' })
}
export { setTireCodeDetail, resetTireDetails }
