<template>
  <div>
    <van-loading type="spinner" v-if="messageIconClass=='eliconloading'" size='16px' />
    <span
    v-else
    style="width:16px;height:16px;"
      :class="messageIconClass"
      @click="handleIconClick"
    >{{messageIconClass==='message-send-fail'? '!':''}}</span>
  </div>
</template>

<script>
import { Loading } from 'vant';
export default {
  name: 'MessageStatusIcon',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  components:{
    [Loading.name]:Loading
  },
  computed: {
    messageIconClass() {
      switch (this.message.status) {
        case 'unSend':
          return 'eliconloading'
        case 'fail':
          return 'message-send-fail'
        default:
          return 'hode-span'
      }
    }
  },
  methods: {
    handleIconClick() {
      if (this.messageIconClass === 'message-send-fail') {
        this.tim.resendMessage(this.message).catch(imError => {
          this.$toast.fail(imError.message)
        })
      }
    }
  }
}
</script>

<style>
.hode-span{
  display: none;
}
.message-send-fail {
  background-color: red;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
}
</style>
