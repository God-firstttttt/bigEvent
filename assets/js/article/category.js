$(function() {
    const { form } = layui;
    // 页面加载时， 获取服务器中的数据，渲染到页面，并封装一个函数
    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取图书列表失败！');
                };

                // 使用模版引擎渲染界面： 1. 引入插件2.准备一个模版3.调用一个模版函数
                const htmlStr = template('tpl', res);

                $('tbody').html(htmlStr);
            })
    };

    getCateList();
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    // 为添加按钮绑定点击事件
    $('.add-btn').click(function() {
        const container = $('.add-form-container').html();
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            //这里content是一个普通的String
            content: container,
            area: ['500px', '250px']
        });

    });

    // 监听添加表单的提交事件
    // 注意这个表单单击之后再去添加的，后创建的元素绑定事件要用事件委托
    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault();

        // 发送请求，把表单数据提交到服务器
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('提交失败！')
                }
                getCateList();
                layer.msg('新增分类成功！');
                // 根据索引，关闭对应的弹出层（so，打开弹出层时要保存其索引）
                layer.close(indexAdd);
            })
    });

    var indexEdit = null;
    // 为编辑表单按钮绑定事件
    $(document).on('click', '.edit-btn', function() {
        const container = $('.edit-form-container').html();
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            //这里content是一个普通的String
            content: container,
            area: ['500px', '250px']
        });
        // 获取该文章分类的id
        const id = $(this).data('id');
        axios.get('/my/article/cates/' + id)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取当前分类数据失败！');
                }
                form.val('edit-form', res.data)
            })

    });

    // 提交编辑表单
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault();
        console.log($(this));
        axios.post('/my/article/updatecate', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新表单分类失败！');
                }
                layer.msg('更新表单分类成功！');
                layer.close(indexEdit);
                getCateList();
            })

    });

    // 为删除按钮绑定事件
    $(document).on('click', '.delete-btn', function() {
        var id = $(this).data('id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            axios.get('/my/article/deletecate/' + id)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！');
                    // layer.close(index);
                    getCateList();

                })
        })

    });






});