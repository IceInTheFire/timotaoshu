import Qs from "qs";
import axios from "axios/index";
import Cookies from 'js-cookie';
import config from './config';


axios.defaults.timeout = 10000;
axios.defaults.baseURL = config.apiUrl;

axios.interceptors.request.use(function (config) {
    window.timotaoAdmin.$store.commit('updateLoading', {loading: true});
    let token = Cookies.get("token");
    if (config.method === 'post') {
        if(token) {
            config.data.params.token = token;
        }
        if(config.data.responseType == 'blob') {        //blob下载
            config.responseType = 'blob';
        }
        config.data = Qs.stringify(config.data.params)
    } else if (config.method === 'get') {
        if(token) {
            config.params.token = token;
        }
    }
    return config
}, function (error) {
    if(!navigator.onLine){
        window.timotaoAdmin.$Message.error("请检查你的网络");
    } else {
        window.timotaoAdmin.$Message.error("请求异常");
    }
    window.timotaoAdmin.$store.commit('updateLoading', {loading: false});
    return Promise.reject(error)
})

// 响应时拦截
axios.interceptors.response.use(function (response) {
    window.timotaoAdmin.$store.commit('updateLoading', {loading: false});
    if(response.data.code == 1002){         //接口返回错误
        window.timotaoAdmin.$Message.error(response.data.msg);
        return Promise.reject(response.data);
    } else if (response.data.code == 1003) {    //登录验证失败
        window.timotaoAdmin.$Message.error(response.data.msg);
        window.timotaoAdmin.$store.commit('logout', this);
        window.timotaoAdmin.$store.commit('clearOpenedSubmenu');
        window.timotaoAdmin.$router.push({
            name: 'login'
        });
        return Promise.reject(response.data);
    } else if(response.data.code == 1000){
        if(typeof response.data.data == "object" && response.data.data.msg) {
            window.timotaoAdmin.$Message.info(response.data.data.msg);
        } else if(typeof response.data.data == "object" && response.data.data.successMsg) {
            window.timotaoAdmin.$Message.success(response.data.data.successMsg);
        }

        return response.data.data;
    // } else if(response.headers['content-type'] == "application/octet-stream") {  //下载的
    } else if(response.headers['content-type'] == "application/force-download") {  //下载的
        return response.data;
    } else if(response.headers['content-type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {  //xls下载
        console.log("测试我来了没");
        return response.data;
    }else {
        return response;
    }
}, function (error) {
    console.error(error);
    if(!navigator.onLine){
        window.timotaoAdmin.$Message.error("请检查你的网络");
    } else {
        window.timotaoAdmin.$Message.error("响应超时，服务器已在处理中，可能处理时间过长");
    }
    window.timotaoAdmin.$store.commit('updateLoading', {loading: false});
    return Promise.reject(error)
})



export default axios;
