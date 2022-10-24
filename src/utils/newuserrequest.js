import axios from "axios";
//引入进度条
import nprogress from 'nprogress';
//start done

import 'nprogress/nprogress.css';
//request就是axios，只不过稍微配置一些
const requests = axios.create({
    //配置对象
    //基础路径
    baseURL:"http://192.168.0.136:8080",
    //请求超时的时间为5s
    timeout:40000,
});

//请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些使其
requests.interceptors.request.use((config)=>{
    //config:配置对象，对象里面有一个属性很重要，headers请求头
    nprogress.start();
    return config;
});

//响应拦截器
requests.interceptors.response.use((res)=>{
    //响应成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到，可以做一些使其
    nprogress.done();
    return res.data;
});


//对外暴露
export default requests;