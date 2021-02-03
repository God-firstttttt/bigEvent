$(function() {

    const { form } = layui;

    function getCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取图书列表失败！');
                };
                const htmlStr = template('tpl', res);
                $('tbody').html(htmlStr);
            })
    };
    getCateList();

    var indexAdd = null;
    $('.add-btn').click(function() {
        const container = $('.add-form-container').html();
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: container,
            area: ['500px', '250px']
        });
    });

    $(document).on('submit', '.add-form', function(e) {
        e.preventDefault();
        axios.post('/my/article/addcates', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('提交失败！')
                }
                getCateList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            });

    });

    var indexEdit = null;
    $(document).on('click', '.edit-btn', function() {
        const container = $('.edit-form-container').html();
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',

            content: container,
            area: ['500px', '250px']
        });
        const id = $(this).data('id');
        axios.get('/my/article/cates/' + id)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取当前分类数据失败！');
                }
                form.val('edit-form', res.data)
            })

    });
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault();
        axios.post('/my/article/updatecate', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('更新表单分类失败！')
                }
                getCateList();
                layer.msg('更新表单分类成功！！');
                layer.close(indexEdit);
            });

    });

    $(document).on('click', '.delete-btn', function() {
        var id = $(this).data('id')

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            axios.get('/my/article/deletecate/' + id)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！!');

                    getCateList();

                })
        })

    });








})