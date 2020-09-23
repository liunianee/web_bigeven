$(function() {

    var layer = layui.layer
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {

            $('#file').click()
        })
        //为文件选择绑定change（监听事件变化）事件

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
            // 获取用户选择的文件
            var filelist = e.target.files
            if (filelist.length === 0) {
                return layer.msg('请选择照片！')
            }

            // 1. 拿到用户选择的文件
            var file = e.target.files[0]
                // 2. 将文件，转化为路径
            var imgURL = URL.createObjectURL(file)
                // 3. 重新初始化裁剪区域
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //
    $('#btnupload').on('click', function() { //1拿到用户上传的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            //2调用接口把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                    //
                window.parent.getUserInfo()
            }
        })
    })
})