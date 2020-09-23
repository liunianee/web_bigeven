$(function() {
    //导入layer方法，使用弹出框
    var layer = layui.layer
        //导出layui的方法
    var form = layui.form
        //定义自己的验证规则
    form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return '昵称长度必须在1~6个字符之间'
                }
            }
        })
        //调用获取信息函数
    initUserInfo()
        //获取用户基本信息并渲染到表单
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //form.val()快速给表单赋值，第一个参数指定给哪个表单赋值（由 form 中 lay-filter 的值决定）
                form.val('formUserInfo', res.data)

            }
        })
    }
    //
    $('#btnReset').on('click', function(e) {
            //阻止默认提交行为
            e.preventDefault()
                //调用获取用户信息的函数，并渲染到表单
            initUserInfo()
        })
        //监听表单提交
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // serialize() 快速拿到表单的值
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    //调用父页面中的方法，重新渲染用户名和头像
                    //window代表ifily窗口，window.parent代表父级index.html窗口，调用父级窗口的js方法
                window.parent.getUserInfo()
            }
        })
    })

})