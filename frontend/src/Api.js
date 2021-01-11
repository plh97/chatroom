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
    if (error?.response?.status===401) {
        store.dispatch({
            type: ACTION_TYPE.LOGOUT
        })
    }
    store.dispatch({
        type: ACTION_TYPE.FETCH_FAIL
    })
    return Promise.reject(error);
})

const Api = {
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
    queryUser: (params) => axios({
        url: '/user',
        method: 'get',
        params
    }),
    getRoom: params => axios({
        url: '/room',
        method: 'get',
        params
    }),
    addRoom: params => axios({
        url: '/room',
        method: 'put',
        params
    }),
    deleteRoom: (id) => axios({
        url: '/room/' + id,
        method: 'delete',
    }),
    editRoom: () => axios({
        url: '/room',
        method: 'post',
    }),
    sendMessage: data => axios({
        url: '/room/message',
        method: 'post',
        data
    }),
    deleteMessage: _id => axios({
        url: '/room/message',
        method: 'delete',
        params: { _id }
    }),
    addFriend: (params) => axios({
        url: '/friend',
        method: 'put',
        params
    }),
    deleteFriend: (params) => axios({
        url: '/friend',
        method: 'delete',
        params
    }),
}

export default Api;