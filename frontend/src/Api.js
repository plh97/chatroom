import {
    createStandaloneToast
} from '@chakra-ui/react';
import Axios from 'axios'
import store from './store'
import {
    ACTION_TYPE
} from './utils/constants';

const toast = createStandaloneToast()
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
    store.dispatch({
        type: ACTION_TYPE.FETCH_FAIL
    })
    return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
    // store.dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
    const res = response.data
    // const toast = useToast();
    if (res.code === 1) {
        res.message && toast({
            description: res.message,
            status: "error",
            position: "top",
            duration: 1000,
        })
    } else if (res.code === 0) {
        res.message && toast({
            description: res.message,
            status: "success",
            position: "top",
            duration: 1000
        })
    }
    return res.data
}, (error) => {
    // Do something with request error
    store.dispatch({
        type: ACTION_TYPE.FETCH_FAIL
    })
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
    setUserInfo: (data) => axios({
        url: '/userInfo',
        method: 'post',
        data
    }),
    upload: (data) => axios({
        url: '/upload',
        method: 'post',
        data
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
    }),
    deleteMessage: data => axios({
        url: '/message',
        method: 'delete',
        data
    })
}