//再发起请求前会先调用这个函数，options可以拿到ajax的配置对象

$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    //在发起ajax请求之前统一拼接请求根路经
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})