import { useDispatch } from 'react-redux'
import { SET_IS_CHANGED_TRUE } from './nxtSnConstants'

const setisChantedNxtSnTrue = (value) => (dispath) => {
  dispath({ type: SET_IS_CHANGED_TRUE, payload: value })
}

export { setisChantedNxtSnTrue }
