$(function() {
    const $image = $('#image');

    $image.cropper({
        aspectRatio: 1,
        preview: '.img-preview',
        // crop(event) {
        //     console.log(event.detail.x);
        //     console.log(event.detail.y);
        // }
    });

    $('#uploade-btn').click(function() {
        $('#file').click();
    })

    $('#file').change(function() {
        // console.log(this.files);
        if (this.files.length == 0) {
            return;
        };
        const imgUrl = URL.createObjectURL(this.files[0]);
        $('#image').cropper('replace', imgUrl);
        // $('#image').prop('src', imgUrl);


    });
    $('#sava-btn').click(function() {

        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg');
        const search = new URLSearchParams();
        search.append('avatar', dataUrl);

        axios.post('/my/update/avatar', search)
            .then(res => {
                if (res.status != 0) {
                    return layer.msg('更新头像失败');
                };
                layer.msg('更新头像成功');
                window.parent.getUserInfo();
            })

    })



})