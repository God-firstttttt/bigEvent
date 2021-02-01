$(function() {
    const { form, laypage } = layui;
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
                form.render();
            })

    };
    grtCateList();

    // 定义一个查询对象
    const query = {
        pagenum: 1, //表示当前的页码值，第几页
        pagesize: 2, //表示每页显示多少条数据
        cate_id: '', //表示文章的分类id
        state: '' //表示文章的状态
    };

    // 发送请求到服务器，获取文章列表
    function renderTable() {
        // 发送请求
        axios.get('/my/article/list', { params: query })
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                // 调用渲染引擎
                const htmlStr = template('tpl', res);
                // 添加到tbody中
                $('tbody').html(htmlStr);

                // 渲染分页器
                renderPage(res.total);
            })
    };
    renderTable();

    // 把服务端获取的数据，渲染到分页器上
    function renderPage(total) {
        //执行一个laypage实例,调用layui文档中的render方法
        laypage.render({
            elem: 'test1', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, //每页显示的数量
            limits: [2, 3, 5, 10], //每页的数据条数
            curr: query.pagenum, //当前的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //分页器的布局排版
            // 切换分页回调函数
            jump: function(obj, first) {
                // obj包含了当前分页的所有参数，如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据
                console.log(obj.limit); //得到每页显示的条数
                // 修改查询对象的参数
                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                // 首次不执行
                if (!first) {
                    // 非首次进入页面，需要重新渲染表格数据
                    renderTable();
                }
            }
        });
    };

    // 表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        // 获取下拉选择框中的值
        const cate_id = $('#cate-sel').val();
        const state = $('#state').val();
        console.log(cate_id, state);
        // 把获取到的值重新赋值给query对象
        query.cate_id = cate_id;
        query.state = state;

        renderTable()
    });

    // 点击删除按钮，删除当前文章
    $(document).on('click', '.del-btn', function() {

        const id = $(this).data('id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            axios.get('/my/article/delete/' + id)
                .then(res => {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！!');
                    // layer.close(index);

                    // 填坑处理：当前只有一条数据，那么我们点击删除这条数据之后，应该 去手动更新上一夜数据
                    if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                        query.pagenum--;
                    }

                    renderTable()

                })
        })

    })














})