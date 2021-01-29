$(function() {

    const { layer, form } = layui

    function initUserInfo() {

        // 页面一加载就获取用户信息
        axios.get('/my/userinfo')
            .then(res => {
                // 检验失败
                if (res.status !== 0) {
                    return layer.msg('获取用户失败');
                }
                console.log(res);
                const { data } = res;
                // 给表单赋值
                // 注意：editForm是表单lay - filter属性的值
                // data对象中的属性名和表单name值一一对应
                form.val('editForm', data);
            })
    }

    initUserInfo();
    // 表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须在1~6个字符之间'
        ]
    });
    // 提交个人资料
    $('.base-info-form').submit(function(e) {
        e.preventDefault();

        // 提交更新资料请求
        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);
                // 检验失败
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！');
                // 更新用户信息
                // console.log(window.parent.document.querySelector('.userinfo'));
                window.parent.getUserInfo();
            });

    });


    // 重置按钮
    $('#reset-btn').click(function(e) {
        console.log(1);
        e.preventDefault();
        initUserInfo();


    });








})