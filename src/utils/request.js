import axios from 'axios'
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
const requests = axios.create({
    //配置对象
    //基础路径
    baseURL: 'http://47.96.164.104:30080',
    //请求超时的时间为5s
    timeout:5000,
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
}, (error) => {
    if (error.request.status){
        switch (error.response.status) {
            // case 400:
            //     alert('用户名或密码错误')
            // // 401: 未登录
            // // 未登录则跳转登录页面，并携带当前页面的路径
            // // 在登录成功后返回当前页面，这一步需要在登录页操作。
            // case 401:
            //     alert('登录过期，请重新登录')
            //     window.location.replace('login');
            //     break;
            // // 403 token过期
            // // 登录过期对用户进行提示
            // // 清除本地token和清空vuex中token对象
            // // 跳转登录页面
            // case 403:
            //     alert('登录过期，请重新登录')
            //     // 清除token
            //     // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            //     setTimeout(() => {
            //         window.location.replace('login');
            //     }, 1000);
            //     break;
            // // 404请求不存在
            // case 404:
            //     alert('网络请求不存在')
            //     break;
            // // 其他错误，直接抛出错误提示
            // default:
            //     Message({
            //         message: error.response.data.message,
            //         duration: 1500,
            //         forbidClick: true
            //     });
        }
    }
});

export default requests