// 注意： 每次调用 $.get() 或$.post() 或$.ajax() 的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax之前 先拼接好地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})