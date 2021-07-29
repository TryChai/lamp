import axios from 'axios';
import { Toast} from 'vant';

const upImg=function(url){
    let urls=''
    var  img = new Image();
    img.src = url
    // base64地址图片加载完毕后执行
    img.onload = function () {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        // 图片原始尺寸
        var originWidth =750;
        var originHeight = img.height;
        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        var maxWidth = 750,
            maxHeight = 750;
        // 目标尺寸
        var targetWidth = originWidth,
            targetHeight = originHeight;
        // 图片尺寸超过最大尺寸的限制
        if(originWidth > maxWidth || originHeight > maxHeight) {
            if(originWidth / originHeight > maxWidth / maxHeight) {
                // 更改宽度，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
        }
        //对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
        //压缩后的base64文件
        var newUrl = canvas.toDataURL('image/jpeg', 0.92);
  
        let file = convertBase64UrlToBlob(newUrl)
        var fd = new FormData();
            fd.append("file", file,"file_"+Date.parse(new Date())+".jpg");
            // fd.append("folder", 'product');

        let config = {
            headers: {'Content-Type': 'multipart/form-data'}
        }
            
        axios.post('/api/common/upload/index/', fd,config).then(res => {
                if (res.data.code==200) {
                    urls=res.data.result
                   return urls;
                }else{
                    Toast.fail('图片上传失败')
        }
                
    })

}
 

};
const convertBase64UrlToBlob=function(urlData) {
    let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
}
export default upImg;