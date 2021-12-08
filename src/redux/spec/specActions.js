import axios from 'axios'
import SLTLDBConnection from '../../apis/SLTLDBConnection'
import {
  SPEC_READING_REQUEST,
  SPEC_READING_SUCCESS,
  SPEC_READING_FAIL,
  RESET_SPEC,
} from './specConstants'

const getSpecDetail = (params) => async (dispatch) => {
  const { tc, ttid } = params
  try {
    dispatch({ type: SPEC_READING_REQUEST })
    const { data } = await SLTLDBConnection.get(`/spec/getspec/${tc}/${ttid}`)

    dispatch({ type: SPEC_READING_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: SPEC_READING_FAIL, payload: error.message })
  }
}
const resetSpec = () => async (dispatch) => {
  dispatch({ type: RESET_SPEC, payload: '' })
}

export { getSpecDetail, resetSpec }
