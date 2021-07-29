<template>
  <div>
    <!-- el-image在IE下会自动加上用于兼容object-fit的类，该类的样式在没设置图片宽高是会 GG -->
    <img class="image-element" :src="imageUrl" @load="onImageLoaded" @click="handlePreview" />
    <!-- <el-progress
      v-if="showProgressBar"
      :percentage="percentage"
      :color="percentage => (percentage === 100 ? '#67c23a' : '#409eff')"
    /> -->
    <van-progress style="margin: 10px 0 0 0;"  v-if="showProgressBar" :percentage="percentage"  />
  </div>
</template>

<script>
// import { Progress } from 'element-ui'
import { Progress,ImagePreview  } from 'vant';
import { mapGetters  } from 'vuex';

export default {
  name: 'ImageElemnt',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  components: {
    // ElProgress: Progress
    [Progress.name]:Progress
  },
  computed: {
    ...mapGetters(['imgUrlList']),
    imageUrl() {
      const url = this.payload.imageInfoArray[0].url
      if (typeof url !== 'string') {
        return ''
      }
      return url.slice(0, 2) === '//' ? `https:${url}` : url
    },
    showProgressBar() {
      return this.$parent.message.status === 'unSend'
    },
    percentage() {
      return Math.floor((this.$parent.message.progress || 0) * 100)
    }
  },
  methods: {
    onImageLoaded(event) {
      this.$bus.$emit('image-loaded', event)
    },
    handlePreview() {
      ImagePreview([this.payload.imageInfoArray[0].url])
      this.$bus.$emit('image-preview', {
        url: this.payload.imageInfoArray[0].url
      })
    }
  }
}
</script>

<style scoped>
.image-element {
 width: 150px;
 /* height: 150px; */
  /* height: 250px; */
  cursor: zoom-in;
  padding: 15px 0;
}
</style>
