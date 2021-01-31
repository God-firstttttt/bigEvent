$(function() {
    // 获取图片元素
    const $image = $('#image');
    // 配置选项
    $image.cropper({
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
        crop: function(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        }

    });

    // 点击上传按钮，上传图片
    $('#uploade-btn').click(function() {
        // 手动触发文件框的点击事件
        $('#file').click();
    });

    // 监听文件框状态改变事件change: file, checkbox, select
    $('#file').change(function() {
        // 获取用户上传的文件列表
        console.log(this.files); //伪数组

        // 判断用户是否上传
        if (this.files.length == 0) {
            return;
        }

        // 把文件转换为url地址的形式
        const imgUrl = URL.createObjectURL(this.files[0]);
        // 替换裁剪区域的图片
        $image.cropper('replace', imgUrl);

        // 或者使用下面的方法，先销毁再替换，最后初始化
        // $image
        // .cropper('destroy') // 销毁旧的裁剪区域
        // .attr('src', imgURL) // 重新设置图片路径
        // .cropper({
        // 纵横比
        // aspectRatio: 1,
        // 指定预览区域
        //   preview: '.img-preview',
        //}) // 重新初始化裁剪区域



    });

    // 点击确定上传到图片服务器上
    $('#sava-btn').click(function() {
        // 获取图片转换为base64格式
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg');
        // console.log(dataUrl);
        // 手动构建查询参数
        const search = new URLSearchParams();
        search.append('avatar', dataUrl);

        // 发送请求
        axios.post('/my/update/avatar', search).then(res => {
            console.log(res);
            // 判断是否失败
            if (res.status !== 0) {
                return layer.msg('上传失败');
            };
            // 提示成功
            layer.msg('上传成功');
            // 更新首页导航的头像
            window.parent.getUserInfo();
        })
    })








})