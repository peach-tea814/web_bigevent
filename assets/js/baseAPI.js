// 注意： 每次调用 $.get() 或$.post() 或$.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax之前 先拼接好地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 同一为有权限的借口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        // console.log('ok');
        // console.log(res);
        // 再complete 回调函数中 可以使用res.responseJSON  拿到服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空token
            localStorage.removeItem('token');
            // 2. 强制跳转到登录页面
            location.href = '/大事件项目/login.html';
        }
    }

})