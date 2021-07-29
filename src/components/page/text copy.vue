<template>
  <div class="parentComponent">
    <UploadImage :options="options" @uploads-change="uploadsChange"></UploadImage>
  </div>
</template>

<script>
import UploadImage from './uploadImage'
export default {
  name: 'parentComponent',
  data () {
    return {
      uploadFormVal: null,
      options: {
        isBase64: true, // 上传给后台的数据默认base64，false是上传的Blob
        maxLength: 9, // 最大上传数量
        url: '', // 上传的接口链接
        compressWidth: 900, // 压缩到指定宽度压缩
        maxsize: 100 * 1024, // 小于1M的不进行压缩
        sendData: { // 图片上传所需的文件名，文件夹名，id，uploadData为图片压缩吐出来的base64
          fileName: '', // 文件名
          folder: 'report', // 文件夹名字
          id: '',
          uploadData: ''
        }
      }
    }
  },
  components: {
    UploadImage
  },
  methods: {
    // 获取图片上传返回的路径字符串
    uploadsChange (val) {
      this.uploadFormVal = val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.parentComponent {
  font-size: 0.4rem;
}
</style>
