$(function() {
    var layer = layui.layer
    var form = layui.form
        //加载文章分类
    initCate()
        // 初始化富文本编辑器
    initEditor()
        //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                //调用模板引擎渲染下拉菜单
                var htmlstr = template('tpl-cate', res)
                $('select').html(htmlstr)
                    //必须调用方法重新渲染表单区才能看到可选项
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 上传文件
    $('#btnChooseImage').on('click', function() {
            $('#coverfile').click()
        })
        //替换裁剪区的图片
        // 1给隐藏的选择框绑定 change 事件
    $('#coverfile').on('change', function(e) {
        //获取文件列表的数据
        var files = e.target.files
        console.log(files);
        //如果没有选择文件
        if (files.length == 0) {
            return
        }
        //如果选择了文件
        // 根据文件创建url地址, files[0] 代表files对象的第一个属性name
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

        //

    })

    //发布文章
    var art_state = '已发布'
        // 为点击事件按钮绑定点击事件
    $('#btnsave2').on('click', function() {
            art_state = '草稿'
        })
        //为发布表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        console.log($(this)[0]);
        //$(this)[0],将当前表单转为原生
        var fd = new FormData($(this)[0])
            //将发布状态追加到fd中
        fd.append('state', art_state)



        //将裁剪后的图片，输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            //调用.toBlob（）可以将裁剪后的图片转为文件对象，
            // blob就是文件对象
            .toBlob(function(blob) {
                console.log(blob);
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //向fd里追加，键为 cover_img () ,值为blob
                fd.append('cover_img', blob)
                    //发布文章的方法
                publishArticle(fd)
            })
            //     //forEach()可以循环出fd里的每个键和对应的值，k是键，v是值
            // fd.forEach(function(v, k) {
            //         console.log(k, v);
            //     })

    })

    //定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器添加的是FormData数据，
            //必须添加以下两个配置项,否则请求失败
            contentType: false,
            processData: false,
            //
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    //发布成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})