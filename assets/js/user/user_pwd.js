$(function() {
    // 导入layui的校验方法
    var form = layui.form
    var layer = layui.layer
        // 定义校验规则
    form.verify({
            pass: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 定义新密码不嫩与原密码相同
            //value是把方法给哪个文本框就会得到该文本框的 value 值
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) {
                    return '新旧密码不呢相同'
                }
            },
            // 确认新密码必须与新密码相同
            repwd: function(value) {
                if (value !== $('[name=newPwd]').val()) {
                    return '两次密码不一致'
                }
            }
        })
        // 发请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('密码更新失败！')
                }
                layer.msg('密码更新成功！')
                    //将jquery元素转为原生元素,在调用 rese() 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })


})