/**
 * 文件读取并通过canvas压缩转成base64
 * @param files
 * @param callback
 */

//EXIF js 可以读取图片的元信息  https://github.com/exif-js/exif-js
import EXIF from "exif-js";
import { Toast } from "vant";
import axios from "axios";
// 压缩图片时 质量减少的值
const COMPRESS_QUALITY_STEP = 0.03;
const COMPRESS_QUALITY_STEP_BIG = 0.06;
// 压缩图片时，图片尺寸缩放的比例，eg：0.9, 等比例缩放为0.9
const COMPRESS_SIZE_RATE = 0.9;

let defaultOptions = {
  removeBase64Header: false,
  // 压缩后允许的最大值，默认：300kb
  maxSize: 200 * 1024,
  fillBgColor: "#ffffff"
};

/**
 *  将待上传文件列表压缩并转换base64
 *  ！！！！ 注意 ： 图片会默认被转为 jpeg ， 透明底会加白色背景
 *  files : 文件列表 ，必须是数组
 *  callback : 回调，每个文件压缩成功后都会回调,
 *  options ：配置
 *  options.removeBase64Header : 是否需要删除 'data:image/jpeg;base64,'这段前缀，默认true
 *  @return { base64Data: '',fileType: '' }， //fileType强制改为jpeg
 */
function imageListConvert(files, callback, options = {}) {
  if (!files.length) {
    return;
  }
  Toast.clear();
  Toast.loading({
    mask: false,
    message: "上传中...",
    duration: 0
  });

  options = { ...defaultOptions, ...options };
  // 获取图片方向－－iOS拍照下有值
  EXIF.getData(files[0], function() {
    let orientation = EXIF.getTag(this, "Orientation");
    for (let i = 0, len = files.length; i < len; i++) {
      let file = files[i];
      let fileType = getFileType(file.name);

      //强制改为jpeg
      fileType = "jpeg";

      let reader = new FileReader();
      reader.onload = (function() {
        return function(e) {
          let image = new Image();
          image.onload = function() {
            let data = convertImage(
              image,
              orientation,
              fileType,
              options.maxSize,
              options.fillBgColor
            );
            if (options.removeBase64Header) {
              data = removeBase64Header(data);
            }
            let fileImg = convertBase64UrlToBlob(data);
            var fd = new FormData();
            fd.append(
              "file",
              fileImg,
              "file_" + Date.parse(new Date()) + ".jpg"
            );
            // fd.append("folder", 'product');

            let config = {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            };

            axios.post("/api/common/upload/index/", fd, config).then(res => {
              Toast.clear();
              if (res.data.code == 200) {
                if (typeof callback === "function") {
                  //调用它，既然我们已经确定了它是可调用的
                  callback(res.data.result);
                  Toast.success("上传成功");
                }
                return true;
              } else {
                Toast.fail("上传失败");
                return false;
              }
            });
          };
          image.src = e.target.result;
        };
      })(file);
      reader.readAsDataURL(file);
    }
  });
}

/**
 * 将 image 对象 画入画布并导出base64数据
 */
function convertImage(
  image,
  orientation,
  fileType = "jpeg",
  maxSize = 200 * 1024,
  fillBgColor = "#ffffff"
) {
  let maxWidth = 1280,
    maxHeight = 1280,
    cvs = document.createElement("canvas"),
    w = image.width,
    h = image.height,
    quality = 0.9;

  /**
   * 这里用于计算画布的宽高
   */
  if (w > 0 && h > 0) {
    if (w / h >= maxWidth / maxHeight) {
      if (w > maxWidth) {
        h = (h * maxWidth) / w;
        w = maxWidth;
      }
    } else {
      if (h > maxHeight) {
        w = (w * maxHeight) / h;
        h = maxHeight;
      }
    }
  }

  let ctx = cvs.getContext("2d");
  let size = prepareCanvas(cvs, ctx, w, h, orientation);

  // 填充白色背景
  ctx.fillStyle = fillBgColor;
  ctx.fillRect(0, 0, size.w, size.h);

  //将图片绘制到Canvas上，从原点0,0绘制到w,h
  ctx.drawImage(image, 0, 0, size.w, size.h);

  let dataUrl = cvs.toDataURL(`image/${fileType}`, quality);

  //当图片大小 > maxSize 时，循环压缩,并且循环不超过5次
  let count = 0;
  while (dataUrl.length > maxSize && count < 10) {
    let imgDataLength = dataUrl.length;
    let isDoubleSize = imgDataLength / maxSize > 2;

    // 质量一次下降
    quality -= isDoubleSize ? COMPRESS_QUALITY_STEP_BIG : COMPRESS_QUALITY_STEP;
    quality = parseFloat(quality.toFixed(2));

    // 图片还太大的情况下，继续压缩 。 按比例缩放尺寸
    let scaleStrength = COMPRESS_SIZE_RATE;
    w = w * scaleStrength;
    h = h * scaleStrength;

    size = prepareCanvas(cvs, ctx, w, h, orientation);

    //将图片绘制到Canvas上，从原点0,0绘制到w,h
    ctx.drawImage(image, 0, 0, size.w, size.h);

    dataUrl = cvs.toDataURL(`image/jpeg`, quality);
    count++;
  }

  cvs = ctx = null;
  return dataUrl;
}

/**
 * 准备画布
 * cvs 画布
 * ctx 上下文
 * w : 想要画的宽度
 * h : 想要画的高度
 * orientation : 屏幕方向
 */
function prepareCanvas(cvs, ctx, w, h, orientation) {
  cvs.width = w;
  cvs.height = h;
  //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
  let degree = 0;
  switch (orientation) {
    case 3:
      //iphone横屏拍摄，此时home键在左侧
      degree = 180;
      w = -w;
      h = -h;
      break;

    case 6:
      //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
      cvs.width = h;
      cvs.height = w;
      degree = 90;
      // w = w;
      h = -h;
      break;
    case 8:
      //iphone竖屏拍摄，此时home键在上方
      cvs.width = h;
      cvs.height = w;
      degree = 270;
      w = -w;
      // h = h;
      break;
  }

  // console.log(`orientation --> ${orientation} , degree --> ${degree}`);
  // console.log(`w --> ${w} , h --> ${h}`);
  //使用canvas旋转校正
  ctx.rotate((degree * Math.PI) / 180);
  return { w, h };
}

/**
 * 截取 ‘data:image/jpeg;base64,’，
 * 截取到第一个逗号
 */
function removeBase64Header(content) {
  if (content.substr(0, 10) === "data:image") {
    let splitIndex = content.indexOf(",");
    return content.substring(splitIndex + 1);
  }
  return content;
}

function getFileType(fileName = "") {
  return fileName.substring(fileName.lastIndexOf(".") + 1);
}

function checkAccept(
  file,
  accept = "image/jpeg,image/jpg,image/png,image/gif"
) {
  return accept.toLowerCase().indexOf(file.type.toLowerCase()) !== -1;
}
const convertBase64UrlToBlob = function(urlData) {
  let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: "image/png"
  });
};
export default {
  checkAccept,
  getFileType,
  removeBase64Header,
  convertImage,
  imageListConvert
};
