import Axios from 'axios'
const instance = Axios.create({
    timeout: 1000,
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
})

export default instance