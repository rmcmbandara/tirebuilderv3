import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3050', //<== no backslashe here
})
