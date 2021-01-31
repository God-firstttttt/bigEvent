$(function() {

    const { form, layer } = layui;

    // 表单校验
    form.verify({
        pass: [/^\w{6,12}/,
            '密码必须6·12位，切不能出现空格'
        ],
        confirmPass: function(val) {
            if (val !== $('#pass').val()) { //val当前表单值
                return '两次密码输入不同';
            }
        }
    });

    // 提交表单
    $('.layui-form').submit(function(e) {
        e.preventDefault();

        // 发起ajax请求
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                // 检验请求失败
                if (res.status !== 0) {
                    return layer.msg('密码修改失败！')
                }
                // 检验请求成功
                layer.msg('密码修改成功！');
                // $(this)[0].reset();

                // 跳转到首页
                window.parent.location.href('../login.js')

            })
    })











})