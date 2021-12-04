//Toastify
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
toast.configure()

const notifySuccess = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 2000,
  })
}

const notifySuccessQk = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 800,
  })
}

const notifyError = (msg) => {
  toast.error(msg, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 3000,
  })
}

const notifyWarning = (msg) => {
  toast.warning(msg, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 3000,
  })
}

const notifyWarningQk = (msg) => {
  toast.warning(msg, {
    position: toast.POSITION.TOP_LEFT,
    autoClose: 800,
  })
}

const notifyInfo = (msg) => {
  toast.success(msg, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 2000,
  })
}

export { notifyInfo, notifyWarning, notifyError, notifySuccess, notifySuccessQk, notifyWarningQk }
// ------------------------------------------------------------------------
