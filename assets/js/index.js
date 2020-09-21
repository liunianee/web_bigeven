$(function() {
    //调用获取用户信息函数
    getUserInfo()
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        //
        method: 'GET',
        url: '/my/userinfo',

        success: function(res) {
            // console.log(res.data);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        //无论成功失败都会调用 complete 函数
        // complete: function(res) {
        //     console.log(res.responseJSON.status);
        //     console.log(res.responseJSON.message);
        //     // res.responseJSON 可以拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {

        //         // 1确定退出后清空本地存储中的 token
        //         localStorage.removeItem('token')
        //             // 2跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染头像的函数
function renderAvatar(user) {
    //
    var name = user.nickname || user.username
        //&nbsp;是空格符
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
    if (user.user_pic !== null) {

    } else {
        //渲染文字头像
        $('.layui-nav-img').hide()
            // name[0] 可以获取name的第一个字符
            //toUpperCase() 转大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
//
var layer = layui.layer
$('#btnLogout').on('click', function() {
    //用layui的内置对象弹出提示框'是否确定退出'
    layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {
        //do something
        //1确定退出后清空本地存储中的 token
        localStorage.removeItem('token')
            //2跳转到登录页面
        location.href = '/login.html'
            //关闭 comfirm 询问框 （layui官方自带）
        layer.close(index);
    })
})