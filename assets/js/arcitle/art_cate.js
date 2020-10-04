$(function() {

    //
    var layer = layui.layer
        //导入layui的form方法
    var form = layui.form
    initArtCateLIST()
        //1获取文章分类的列表
    function initArtCateLIST() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                //调用模板引擎，传入模板id和要渲染的数据
                //最终会返回渲染好的字符串
                var htmlstr = template('tpl-table', res)
                console.log(htmlstr);
                $('tbody').html(htmlstr)
            }
        })
    }
    // 为拿到弹出层索引
    var indexAdd = null
        //为添加按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
            //var index =layer.open() 拿到弹出框的索引
            indexAdd = layer.open({
                type: 1, //指定类型，默认0，信息层
                area: ['500px', '250px'], //设置宽和高
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        //为 form-add 表单邦迪submit事件，应为 form-add 是点击按钮后才出现的，所以要用代理的形式
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章失败')
                    }
                    //成功后重新渲染文章分类列表
                    initArtCateLIST()
                    layer.msg('新增分类成功！')
                        //用layui的方法关闭弹出框，根据索引关闭对应弹出层
                    layer.close(indexAdd)
                }
            })
        })
        //indexedit
    var indexedit = null
        //通过代理方式给 btn-edit 绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
            indexedit = layer.open({
                    type: 1, //指定类型，默认0，信息层
                    area: ['500px', '250px'], //设置宽和高
                    title: '修改文章分类',
                    content: $('#dialog-edit').html()
                })
                //获取当前按钮的自己定义属性i值
            var id = $(this).attr('data-id')
                // console.log(id);
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    //layui 方法
                    //快速将服务器返回的苏剧更具name填充到对应文本框中，
                    //结构form要定义 lay-filter 属性 
                    // 返回的id 值将来也需要用于提交，定义隐藏域保存id
                    form.val('form-edit', res.data)
                }
            })
        })
        //通过代理的方式为编辑的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                //快速得到当前表单的数据
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                        //layui方法,根据索引关闭弹出层
                    layer.close(indexedit)
                        //刷新表单数据
                    initArtCateLIST()
                }
            })
        })
        //通过代理方式给删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        //通过自定义属性获取id值
        var id = $(this).attr('data-id')

        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,

                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章类别失败！')
                    }
                    layer.msg('删除文章类别成功！')
                        // 关闭弹出层
                    layer.close(index);
                    // 重新渲染表格数据
                    initArtCateLIST()
                }
            })
        })
    })
})