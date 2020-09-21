//再发起请求前会先调用这个函数，options可以拿到ajax的配置对象
//使用这个函数统一 行参（options）.属性
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    //在发起ajax请求之前统一拼接请求根路经
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        //统一为有权限的接口设置 headers 请求头
        //判断url地址里有没有‘my’字符串
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //无论成功失败都会调用 complete 函数
    options.complete = function(res) {
        console.log(res.responseJSON.status);
        console.log(res.responseJSON.message);
        // res.responseJSON 可以拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {

            // 1确定退出后清空本地存储中的 token
            localStorage.removeItem('token')
                // 2跳转到登录页面
            location.href = '/login.html'
        }
    }

})