import axios from 'axios'
axios.defaults.timeout = 10000
export default axios.create({
  baseURL: 'http://localhost:4444', //<== no back    slashe here
})
