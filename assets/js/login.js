$(function() {
    // 从layui中提取form表单,layer弹出层
    //解构赋值
    const { form, layer } = layui;

    // 点击链接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle();
    });

    // layui内置属性
    form.verify({
        // 验证密码格式
        pass: [
            /^\w{6,12}$/,
            '密码只能在6到12位之间'
        ],
        // 验证再次输入密码是否符合
        samePass: function(value) {
            if (value != $('#pass').val())
                return '两次密码输入不一致'
        }
    });

    // 实现密码注册
    $('.reg-form').submit(function(e) {
        e.preventDefault();
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败');
                };
                layer.msg('注册成功,请登录');
                $('.reg-form a').click();
            })
    });

    // 实现登录请求
    $('.login-form').submit(function(e) {
        e.preventDefault();
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                };
                // 把token（个人身份证，令牌）保存到本地
                localStorage.setItem('token', res.token);
                layer.msg('登录成功', { time: 1000 }, function() {
                    // 页面跳转
                    location.href = './index.html';
                });


            })
    })



})