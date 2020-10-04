$(function() {
    //
    var form = layui.form
        //
    var layer = layui.layer
        //用于渲染分页
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padzero(dt.getMonth() + 1)
            var d = padzero(dt.getDate())

            var hh = padzero(dt.getHours())
            var mm = padzero(dt.getMinutes())
            var ss = padzero(dt.getSeconds())

            return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
        }
        //定义补0的函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }
    //发请求的携带参数
    var q = {
            pagenum: 1, //页码值，默认请求第一页的数据
            pagesize: 2, //默认每页显示2条数据
            cate_id: '', //文章分类的id
            state: '' //文章分类的状态

        }
        //调用获取文章列表数据
    inittable()
        //获取文章列表数据
    function inittable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                //获取成功，用模板引擎渲染数据
                var htmlstr = template('tpl-table ', res)
                $('tbody').html(htmlstr)
                    //渲染完列表以后，调用渲染分页

                rederpage(res.total)
            }
        })
    }
    //调用文章分类的方法
    initCate()
        //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数距失败！')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate ', res)
                    // console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //为筛选按钮绑定 submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取下拉单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件，重新渲染表格
        inittable()
    })

    //渲染分页的方法
    function rederpage(total) {
        //调用 laypage.render()渲染分页
        //传入参数1，分页容器id ，不需要加id
        //参数2，总数据条数，（行参）
        laypage.render({
            elem: pagebox, //容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认哪页被选中
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页功能项
            limits: [2, 3, 5, 10],
            //分页发生变化时，触发jmp回调
            //1点击页码时会触发 jump 回调
            //2 调用了laypage.render 会触发jump回调
            jump: function(obj, first) {
                //如果 first=true,则是以 laypage.render() 方式触发的jump回调
                //否则是以点击页码方式触发的jump回调

                //obj.curr拿到最新的页码值
                //把最新页码值赋值给q,重新渲染页面
                q.pagenum = obj.curr
                    //把最新的条目数赋值到q上
                q.pagesize = obj.limit

                //根据最新的q获取列表并渲染
                if (!first) {
                    inittable()
                }
            }
        })
    }


    //通过代理的方式为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function() {

        var len = $('.btn-delete').length
        console.log(len);
        //获取自定义属性，文章id
        var id = $(this).attr('data-id')
            //弹出层，询问是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //如果点击确认，则会触发的回调
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    //当删除数据后，判断当前页码还有没有数据
                    //如果没有数据了，则让页码值-1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    //重新渲染文章列表，
                    inittable()
                }
            })


            layer.close(index);
        });
    })
})