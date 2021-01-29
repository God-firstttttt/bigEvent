// 为全局的axios请求设置根路径
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 添加全局的请求拦截器
axios.interceptors.request.use(function(config) {
    console.log('-----发送ajax请求前');

    console.log(config.url);
    // 获取本地存储的token令牌
    const token = localStorage.getItem('token') || '';

    // 在发送请求之前判断是否有/my的请求路径
    //如果有就添加headers
    /*
    正则表达式方法：\^/my\.test
    startsWith('/my')
    indexOf('/my')==0
    */
    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token;
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('-----接收ajax响应前', response);
    // 解构出需要的值
    const { message, status } = response.data;
    // 先判断身份验证是否失败

    if (message == '身份认证失败！' && status == 1) {
        // 清除本地存储的token
        localStorage.removeItem('token');
        // 跳转到登录页
        location.href = './login.html';
    }
    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});