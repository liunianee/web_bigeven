$(function() {
    //点击切换成注册表单
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        //点击切换成登录表单
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form
    var form = layui.form;
    //导入layer提示框方法
    var layer = layui.layer;
    //通过form.verify自定义校验规则
    form.verify({
        //自定义不能为空格号且6-12位字符
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //行参得到的是用户输入的value值
        repwd: function(value) {
            //获得注册div节点后再通过属性选择器获得密码框
            var pwd = $('#form_reg [name=password]').val()

            if (pwd !== value) {
                return '两次密码不一致'

            }
        }
    })

    //监听注册表单的接口
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
                //要传输的属性
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)

                } else {

                    layer.msg('注册成功！请登录')
                        //自动点击切换登录页面链接
                    $('#link_login').click()
                }
            })
        })
        //监听登录表单的接口
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获得表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                console.log('登录成功！');
                // 将登录成功后的token字符存入本地存储
                localStorage.setItem('token', res.token)
                    // console.log(res.token);
                location.href = '/index.html'
            }

        })
    })
})