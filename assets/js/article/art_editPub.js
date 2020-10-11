$(function() {
    var layer = layui.layer;
    var form = layui.form;


    initCate();
    // 初始化富文本
    initEditor();

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎 ，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    // 监听coverFile的 change 事件  获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的发布状态
    var art_status = '已发布';


    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_status = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于form表单，快速创建一个formdat对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态存到fd中
        fd.append('state', art_status);
        // 4. 将fengm将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到fd中
                fd.append('cover_img', blob);
                // 6.发起ajax数据请求
                // publishArticle(fd);
                editArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    // function publishArticle(fd) {
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/article/add',
    //         data: fd,
    //         // 注意如果向服务器提交的是formData 格式的数据
    //         // 必须添加以下两个配置项
    //         contentType: false,
    //         processData: false,
    //         success: function(res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('发布文章失败！')
    //             }
    //             layer.msg('发布文章成功！');
    //             // 发布文章成功后，跳转到文章列表页面
    //             location.href = '/大事件项目/article/art_list.html'
    //         }
    //     })
    // }

    // 表单填充内容
    var params = new URLSearchParams(location.search);
    var iid = params.get('id');
    initEdit();

    function initEdit() {
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + iid,
            success: function(res) {
                form.val('data-form', res.data);
                form.render();
            }
        })
    }

    // 修改文章的方法
    function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意如果向服务器提交的是formData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/大事件项目/article/art_list.html'
            }
        })
    }
})