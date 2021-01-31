// 从layui中提取模块
const { layer } = layui;

// 获取用户个人信息
function getUserInfo() {

    axios.get('/my/userinfo').then(res => {
        // console.log(res);
        // 先判断获取信息是否失败
        if (res.status !== 0) {
            return layer.msg('获取用户信息失败！');
        }
        // 从res中解析出data
        const { data } = res;
        // 将昵称或用户名赋值给name，如果昵称为空就用用户名
        const name = data.nickname || data.username;
        // 渲染昵称
        $('#welcome').text(`欢迎 ${name}`);
        // 渲染头像
        if (data.user_pic) {
            // 注意：base64格式的编码字符串可以直接设置给src
            $('.avatar').prop('src', data.user_pic).show();
            $('.text-avatar').hide();
        } else {
            $('.text-avatar').text(name[0].toUpperCase()).show();
            $('.avatar').hide();
        }
    })
};

getUserInfo();

// 点击退出
$('#logout').click(function() {
    // 请求接口（模拟）
    // 清除本地token令牌
    localStorage.removeItem('token');
    // 跳转到登录页
    location.href = './login.html';
})