import axios from "axios";
import {
    getItem,
    KEY_ACCESS_TOKEN,
    removeItem,
    setItem,
} from "./localStorageManager";
import store from '../redux/store';
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";

let baseURL = 'http://localhost:4000/';
console.log('env is ', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production') {
    baseURL = process.env.REACT_APP_SERVER_BASE_URL
}

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
});

//axiosClient jab request bhej raha ho, tab hi turant interceptor usse intercept kar lega.
axiosClient.interceptors.request.use((request) => {
    // apne ab ye access token liya
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    // Ab hum ye accessToken request.headers me dal denge
    request.headers["Authorization"] = `Bearer ${accessToken}`;
    store.dispatch(setLoading(true));
    //Ab hamane request aage bhej di
    return request;
});

axiosClient.interceptors.response.use(async (respone) => {
    store.dispatch(setLoading(false));
    const data = respone.data;
    if (data.status === "ok") {
        //agar sab kuch thik hai to return kar do data ko.
        return data;
    }

    //respone.config mai se muzhe original request mil jayegi.
    const originalRequest = respone.config;
    const statusCode = data.statusCode;
    const error = data.message
    
    store.dispatch(showToast({
        type: TOAST_FAILURE,
        message: error
    }))

    //when refresh token expires, send user to login page
    if (statusCode === 401 && !originalRequest._retry) {
        // means the access token has expired
        originalRequest._retry = true;

        const response = await axios
            .create({
                withCredentials: true,
            })
            .get(`${baseURL}/auth/refresh`);

        if (response.data.status === "ok") {
            setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
            originalRequest.headers[
                "Authorization"
            ] = `Bearer ${response.data.result.accessToken}`;
 
            return axios(originalRequest);
        } else {
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace("/login", "_self");
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
}, async(error) => {
    store.dispatch(setLoading(false));
    store.dispatch(showToast({
        type: TOAST_FAILURE,
        message: error.message
    }))
    return Promise.reject(error);
});
