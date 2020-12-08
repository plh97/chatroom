import Axios from 'axios'
import store from './store'
import { ACTION_TYPE } from './utils/constants';

const axios = Axios.create({
    baseURL: `//${document.domain}:9002/api`,
    timeout: 10000,
    withCredentials: true
});

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // store.dispatch({ type: ACTION_TYPE.FETCH_START })
    return config;
}, (error) => {
    // Do something with request error
    store.dispatch({ type: ACTION_TYPE.FETCH_FAIL })
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    // store.dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
    return response.data.data
}, (error) => {
    // Do something with request error
    store.dispatch({ type: ACTION_TYPE.FETCH_FAIL })
    return Promise.reject(error);
})

export default {
    login: (data) => axios({
        url: '/login',
        method: 'post',
        data
    }),
    register: (data) => axios({
        url: '/register',
        method: 'post',
        data
    }),
    logout: (data) => axios({
        url: '/logout',
        method: 'post',
        data
    }),
    getUserInfo: () => axios({
        url: '/userInfo',
        method: 'get'
    }),
    sendMessage: data => axios({
        url: '/message',
        method: 'post',
        data
    }),
    getMessage: () => axios({
        url: '/message',
        method: 'get',
    })
}