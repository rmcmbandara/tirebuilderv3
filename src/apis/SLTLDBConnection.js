import axios from 'axios'
axios.defaults.timeout = 10000
export default axios.create({
  baseURL: 'http://192.168.1.150:5433', //<== no back    slashe here
})
