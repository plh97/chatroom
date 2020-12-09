import { useToast } from '@chakra-ui/react';
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
    const res = response.data
    // const toast = useToast();
    if(res.code===1) {
        console.log({
            title: "Warning.",
            description: res.message,
            status: "error",
            position: "top",
            duration: 1000,
        })
    }
    return res.data
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
    getUserImage: (username) => axios({
        url: '/userImage',
        method: 'get',
        params: {
            username
        }
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