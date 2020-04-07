import axios from "axios";
import { message } from "antd";

function request(method, url, body) {

    const tokenBefore = sessionStorage.getItem('Authorization');

    console.log('old token:', tokenBefore);

    return axios({
        headers: {
            Authorization: tokenBefore || ''
        },
        method,
        url,
        data: body
    }).then(function (res) {
        console.log('request res:', res);
        const token = res.headers['authorization'];
        console.log('new token:', token);
        if (token) {
            sessionStorage.setItem('Authorization', token);
        }
        return res.data;
    })
}

const logout = history => {
    sessionStorage.removeItem('loginRole');
    sessionStorage.removeItem('loginId');
    sessionStorage.removeItem('loginName');
    history.push('/login');
};

const checkTokenExpiration = (res, history) => {
    if (res.code === 401) {
        logout(history);
        message.error('您长时间未操作，登录已失效，请重新登录！');
        return true;
    }
    return false;
};

const get = url => request('get', url, undefined);
const post = (url, body) => request('post', url, body);

export { get, post, logout, checkTokenExpiration };
