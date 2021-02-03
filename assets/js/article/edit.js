$(function() {
    const { form } = layui;
    let state = '';
    // 接收列表页传来的查询参数
    console.log(location.search); //？id=..

    // 获取查询参数中的id,slice(截取的起始位置)=>从开始的位置截取到最后
    // split('分隔符') =>把字符串按着分割符样式分割为数组
    const arr = location.search.slice(1).split('=');
    const id = arr[1];
    console.log(arr[1]);

    // 发送请求到服务器，获取当前这条id的文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`)
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                };
                // 给表单赋值数据
                form.val('edit-form', res.data);
                // 初始化富文本编辑区域
                initEditor();
                $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            })
    };
    getArtDetail(id);


    // 从服务器获取文章的分类列表数据
    function grtCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                };

                // 遍历数组，渲染下拉组件的选项
                res.data.forEach(item => {
                    // 每遍历一次向下拉选择框中追加一条option
                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`);

                });
                // 一定要记得调用 form.render() 方法
                form.render('select');
                getArtDetail(id);
            })

    };
    grtCateList();



    // 初始化图片裁剪器
    const $image = $('#image');

    // 裁剪选项
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 初始化裁剪区域
    $image.cropper(options);
    // 为选择封面按钮绑定事件
    $('#choose-btn').click(function() {
        $('#file').click();
    });


    // 为file绑定change事件
    $('#file').change(function() {

        const imgUrl = URL.createObjectURL(this.files[0]);
        $image.cropper('replace', imgUrl);

    });

    // 监听表单提交事件
    $('.publish-form').submit(function(e) {
        e.preventDefault();

        // 获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {

            // console.log(blob);
            // 获取表单中所有的内容 => new FormData(原生元素)
            const fd = new FormData(this);
            // formdata相关的方法：append(),set(),get(),forEach()
            // 检测formdata中的数据项是和获取成功
            // fd.forEach(item => {
            //     console.log(item);
            // });
            // 向fd中新增state文章状态数据
            fd.append('state', state);
            // 把获取的图片数据添加到formdata中
            fd.append('cover_img', blob);
            // 调用函数，发送请求
            publishArticle(fd);
        })
    });

    // 点击发布和存为草稿按钮，改变state状态值
    $('.last-row button').click(function(e) {
        // console.log($(this).data('state'));
        // 为按钮添加自定义属性值，获取按钮的自定义属性值
        state = $(this).data('state')
    });

    // 发送请求
    function publishArticle(fd) {
        // 发送之前，在formdata中添加一条id
        fd.append('Id', id);
        axios.post('/my/article/edit', fd)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg(state == '草稿' ? '修改草稿成功！' : '修改文章成功！')

                // 跳转到文章列表页面
                location.href = './list.html';

                // 左边导航条更新
                window.parent.$('.layui-this').prev().find('a').click();
            });
    }






});