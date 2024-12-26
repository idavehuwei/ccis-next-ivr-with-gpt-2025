import axios from 'axios'

const api = {
  getPhoneNumbers() {
    return axios.get('/api/phone/numbers')
  },
}

export default api 