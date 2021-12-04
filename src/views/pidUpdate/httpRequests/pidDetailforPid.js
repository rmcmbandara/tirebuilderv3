import SLTLDBConnection from '../../../apis/SLTLDBConnection'
import { notifyError } from '../../../utils/toastify'

export function getPidDetail(pid) {
  return SLTLDBConnection.get(`/pid/pid-detail/${pid}`).then((data) => data)
}
