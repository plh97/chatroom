import Axios from 'axios'
import store from './store'

const axios = Axios.create({
    baseURL: `//${document.domain}:9002`,
    timeout: 5000,
    withCredentials: true
});

axios.interceptors.response.use(function(response) {
    console.log('res', response)
    console.log(response.data.message)
    return response.data.data
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
})

export default {
    login: (data) => axios({
        url: '/login',
        method: 'post',
        data
    }).then(data => data.data),
    logout: (data) => axios({
        url: '/logout',
        method: 'post',
        data
    }).then(data => data.data),
    getUserInfo: data => axios({
        url: '/userInfo',
        method: 'get'
    })
}