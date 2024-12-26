import axios from 'axios'

const api = {
  getFlowData() {
    return axios.get('/api/ivr/flow')
  },
  
  getGptConfig() {
    return axios.get('/api/ivr/gpt-config')
  },
  
  // ... 其他接口
}

export default api